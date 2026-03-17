'use client';

import { useEffect, useRef, useState } from 'react';
import { Character, Mode, Message } from '@/types';

interface Props {
  character1: Character;
  character2: Character;
  mode: Mode;
  topic: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  onFinish: () => void;
  onNewBattle: () => void;
  finished: boolean;
}

const MAX_ROUNDS = 10;

export default function ChatUI({
  character1,
  character2,
  mode,
  topic,
  messages,
  setMessages,
  onFinish,
  onNewBattle,
  finished,
}: Props) {
  const [isTyping, setIsTyping] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<Character>(character1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingMessage, setStreamingMessage] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (!finished && messages.length < MAX_ROUNDS * 2) {
      const nextSpeaker = messages.length % 2 === 0 ? character1 : character2;
      setCurrentSpeaker(nextSpeaker);
      fetchNextMessage(nextSpeaker);
    } else if (messages.length >= MAX_ROUNDS * 2) {
      onFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const fetchNextMessage = async (speaker: Character) => {
    setIsTyping(true);
    setStreamingMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character1,
          character2,
          mode,
          topic,
          history: messages,
          currentSpeaker: speaker,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedText += parsed.content;
                  setStreamingMessage(accumulatedText);
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Add completed message
      const newMessage: Message = {
        id: `${Date.now()}-${messages.length}`,
        character: speaker,
        content: accumulatedText,
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);
      setStreamingMessage('');
    } catch (error) {
      console.error('Error fetching message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleShare = () => {
    const summary = `AIトークバトル: ${character1.name} vs ${character2.name}\nテーマ: ${topic}\nモード: ${mode.name}\n\n面白い会話が繰り広げられました！\n\n#AIトークバトル`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{character1.emoji}</span>
            <span className="font-bold">{character1.name}</span>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">{mode.name}</div>
            <div className="text-sm font-medium">{topic}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{character2.name}</span>
            <span className="text-2xl">{character2.emoji}</span>
          </div>
        </div>

        <div className="h-[500px] overflow-y-auto space-y-3 p-4 bg-gray-900/50 rounded-xl">
          {messages.map((message) => {
            const isChar1 = message.character.id === character1.id;
            return (
              <div
                key={message.id}
                className={`flex ${isChar1 ? 'justify-start' : 'justify-end'} animate-slideIn`}
              >
                <div
                  className={`max-w-[70%] ${
                    isChar1
                      ? 'bg-gray-700 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
                      : 'bg-purple-600 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
                  } p-3 shadow-lg`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{message.character.emoji}</span>
                    <div>
                      <div className="text-xs text-gray-300 mb-1">{message.character.name}</div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && streamingMessage && (
            <div
              className={`flex ${
                currentSpeaker.id === character1.id ? 'justify-start' : 'justify-end'
              } animate-slideIn`}
            >
              <div
                className={`max-w-[70%] ${
                  currentSpeaker.id === character1.id
                    ? 'bg-gray-700 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
                    : 'bg-purple-600 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
                } p-3 shadow-lg`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{currentSpeaker.emoji}</span>
                  <div>
                    <div className="text-xs text-gray-300 mb-1">{currentSpeaker.name}</div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {streamingMessage}
                      <span className="inline-block w-1 h-4 bg-white ml-1 animate-blink" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isTyping && !streamingMessage && (
            <div
              className={`flex ${
                currentSpeaker.id === character1.id ? 'justify-start' : 'justify-end'
              }`}
            >
              <div className="bg-gray-700 rounded-full px-4 py-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {finished && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <div className="text-center text-sm text-gray-400">バトル終了！</div>
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105"
              >
                Xでシェア
              </button>
              <button
                onClick={onNewBattle}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105"
              >
                新しいバトル
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-400">
        ラウンド {Math.floor(messages.length / 2) + 1} / {MAX_ROUNDS}
      </div>
    </div>
  );
}
