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

    // Build conversation history
    const conversationHistory = history
      .map((msg) => {
        const speaker = msg.character.id === character1.id ? character1.name : character2.name;
        return `${speaker}: ${msg.content}`;
      })
      .join('\n\n');

    // Build system prompt
    const systemPrompt = `${currentSpeaker.systemPrompt}

あなたは今、${opponent.name}と「${topic}」というテーマについて話しています。

モード: ${mode.name}
ルール: ${mode.rules}

これまでの会話:
${conversationHistory || '(まだ会話は始まっていません)'}

あなた（${currentSpeaker.name}）の次の発言を、キャラクターになりきって生成してください。
- 150文字以内で簡潔に
- キャラクターの口調と性格を維持
- モードのルールに従う
- 相手の発言を受けて自然に返答する
- 発言のみを出力（「〜と言った」などの地の文は不要）`;

    const userPrompt = history.length === 0 
      ? `テーマ「${topic}」について、${mode.name}モードで最初の発言をしてください。`
      : `相手の最後の発言を受けて、あなたの次の発言をしてください。`;

    // Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${apiKey}`,
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
      throw new Error('Gemini API request failed');
    }

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6);
                if (!jsonStr.trim()) continue;

                try {
                  const data = JSON.parse(jsonStr);
                  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

                  if (text) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
                    );
                  }
                } catch (e) {
                  // Ignore parse errors
                }
              }
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
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
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
