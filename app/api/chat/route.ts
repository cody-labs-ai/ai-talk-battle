import { Character, Mode, Message } from '@/types';

export const runtime = 'edge';

interface RequestBody {
  character1: Character;
  character2: Character;
  mode: Mode;
  topic: string;
  history: Message[];
  currentSpeaker: Character;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { character1, character2, mode, topic, history, currentSpeaker } = body;

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

    // Use non-streaming endpoint for reliability
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt + '\n\n' + userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return new Response(JSON.stringify({ error: 'Gemini API failed: ' + response.status }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

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
    return new Response(JSON.stringify({ error: 'Error: ' + msg, hasKey: !!process.env.GEMINI_API_KEY, keyPrefix: (process.env.GEMINI_API_KEY || '').substring(0, 10) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
