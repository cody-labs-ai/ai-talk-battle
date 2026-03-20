import { Character, Mode, Message } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Rate limiter: per-minute burst + daily cap per IP + global daily cap
const minuteMap = new Map<string, { count: number; resetAt: number }>();
const dailyMap = new Map<string, { count: number; resetAt: number }>();
const MINUTE_LIMIT = 30;  // max 30 req/min per IP
const DAILY_LIMIT = 500;  // max 500 req/day per IP
const GLOBAL_DAILY_LIMIT = 5000; // max 5000 req/day total (~$10/day max)
let globalDaily = { count: 0, resetAt: Date.now() + 86_400_000 };

function checkRateLimit(ip: string): { ok: boolean; reason?: string } {
  const now = Date.now();

  // Minute check
  const mEntry = minuteMap.get(ip);
  if (!mEntry || now > mEntry.resetAt) {
    minuteMap.set(ip, { count: 1, resetAt: now + 60_000 });
  } else {
    if (mEntry.count >= MINUTE_LIMIT) return { ok: false, reason: 'Too many requests. Please wait a moment.' };
    mEntry.count++;
  }

  // Daily check
  const dEntry = dailyMap.get(ip);
  if (!dEntry || now > dEntry.resetAt) {
    dailyMap.set(ip, { count: 1, resetAt: now + 86_400_000 });
  } else {
    if (dEntry.count >= DAILY_LIMIT) return { ok: false, reason: 'Daily limit reached. Come back tomorrow!' };
    dEntry.count++;
  }

  // Global daily check
  if (now > globalDaily.resetAt) {
    globalDaily = { count: 1, resetAt: now + 86_400_000 };
  } else {
    if (globalDaily.count >= GLOBAL_DAILY_LIMIT) return { ok: false, reason: 'Service is at capacity for today. Please come back tomorrow!' };
    globalDaily.count++;
  }

  return { ok: true };
}

// Cleanup runs inline on each request (stale entries removed in checkRateLimit)

import { trackRequest } from '@/lib/stats';


interface RequestBody {
  character1: Character;
  character2: Character;
  mode: Mode;
  topic: string;
  history: Message[];
  currentSpeaker: Character;
  sessionId?: string;
}

// Cache verified Stripe sessions (valid for 1 hour)
const verifiedSessions = new Map<string, number>();

async function verifyStripeSession(sessionId: string): Promise<boolean> {
  const cached = verifiedSessions.get(sessionId);
  if (cached && Date.now() < cached) return true;

  const STRIPE_SK = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SK) return false;

  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { 'Authorization': `Basic ${btoa(STRIPE_SK + ':')}` },
  });
  if (!res.ok) return false;

  const session = await res.json();
  if (session.payment_status === 'paid') {
    verifiedSessions.set(sessionId, Date.now() + 3_600_000); // cache 1 hour
    return true;
  }
  return false;
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.ok) {
      return new Response(JSON.stringify({ error: rateCheck.reason }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body: RequestBody = await req.json();
    const { character1, character2, mode, history, currentSpeaker } = body;
    trackRequest(ip, history.length === 0);
    // Sanitize topic: limit length and strip control characters
    const topic = (body.topic || '').slice(0, 200).replace(/[\x00-\x1f]/g, '');

    const opponent = currentSpeaker.id === character1.id ? character2 : character1;

    const conversationHistory = history
      .map((msg) => {
        const speaker = msg.character.id === character1.id ? character1.name : character2.name;
        return `${speaker}: ${msg.content}`;
      })
      .join('\n\n');

    const systemPrompt = `${currentSpeaker.systemPrompt}

あなたは今、${opponent.name}と「${topic}」というテーマについて話しています。

モード: ${mode.name}
ルール: ${mode.rules}

これまでの会話:
${conversationHistory || '(まだ会話は始まっていません)'}

あなた（${currentSpeaker.name}）の次の発言を、キャラクターになりきって生成してください。
- 150文字以内で簡潔に
- 自分のキャラクターの口調と性格を厳密に維持すること
- 絶対に相手（${opponent.name}）の口調や話し方を真似しないこと
- モードのルールに従う
- 相手の発言を受けて自然に返答する
- 発言のみを出力（「〜と言った」などの地の文は不要）
- **最重要：必ず「${topic}」のテーマに沿った発言をすること。テーマから逸脱しないこと。雑談や関係ない話題に移らないこと。**
- **モードが口喧嘩やディベートの場合：絶対に相手に同意してはいけない。必ず反対の立場から反論すること。**`;

    const userPrompt = history.length === 0 
      ? `テーマ「${topic}」について、${mode.name}モードで最初の発言をしてください。`
      : `相手の最後の発言を受けて、あなたの次の発言をしてください。`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if pro mode (use Anthropic Claude) — requires verified Stripe payment
    const isPro = mode.id === 'pro-brainstorm';
    let text = '';

    if (isPro && process.env.ANTHROPIC_API_KEY) {
      const sessionId = body.sessionId;
      if (!sessionId || !(await verifyStripeSession(sessionId))) {
        return new Response(JSON.stringify({ error: 'Pro mode requires payment. Please complete checkout first.' }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-0-20250514',
          max_tokens: 500,
          messages: [{ role: 'user', content: systemPrompt + '\n\n' + userPrompt }],
        }),
      });
      if (!anthropicRes.ok) {
        const err = await anthropicRes.text();
        console.error('Anthropic API error:', err);
        return new Response(JSON.stringify({ error: 'Pro API failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
      const anthropicData = await anthropicRes.json();
      text = anthropicData?.content?.[0]?.text || '';
    } else {
      // Use Gemini Flash (free)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
            generationConfig: { temperature: 0.9, maxOutputTokens: 300 },
          }),
        }
      );
      if (!response.ok) {
        const error = await response.text();
        console.error('Gemini API error:', error);
        return new Response(JSON.stringify({ error: 'Gemini API failed: ' + response.status }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
      const data = await response.json();
      text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // Simulate streaming by sending chars one by one
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send text in small chunks for typing effect
        const chunkSize = 3;
        for (let i = 0; i < text.length; i += chunkSize) {
          const chunk = text.slice(i, i + chunkSize);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
          );
          // Small delay for typing effect
          await new Promise(r => setTimeout(r, 30));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
