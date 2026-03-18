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
      {/* LINE-style header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <button className="text-[#06C755] hover:opacity-70 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1 text-center">
                <div className="font-semibold text-gray-800">
                  {character1.name} vs {character2.name}
                </div>
                <div className="text-xs text-gray-500">{topic}</div>
              </div>
              <div className="bg-[#06C755] text-white text-xs px-2 py-1 rounded-full font-medium">
                {mode.name}
              </div>
            </div>
          </div>
        </div>

        {/* LINE-style chat area with soft gray-green background */}
        <div className="h-[500px] overflow-y-auto p-4 bg-[#7B9E89] space-y-4">
          {messages.map((message, index) => {
            const isChar1 = message.character.id === character1.id;
            return (
              <div
                key={message.id}
                className={`flex ${isChar1 ? 'justify-start' : 'justify-end'} animate-slideIn`}
              >
                <div className={`flex gap-2 max-w-[75%] ${isChar1 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Avatar circle */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                      {message.character.emoji}
                    </div>
                  </div>

                  {/* Message content */}
                  <div className={`flex flex-col ${isChar1 ? 'items-start' : 'items-end'}`}>
                    {/* Character name above bubble */}
                    <div className={`text-xs text-gray-700 mb-1 px-1 ${isChar1 ? 'text-left' : 'text-right'}`}>
                      {message.character.name}
                    </div>

                    {/* Speech bubble */}
                    <div
                      className={`px-4 py-2.5 shadow-sm ${
                        isChar1
                          ? 'bg-white text-gray-800 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
                          : 'bg-[#06C755] text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>

                    {/* Timestamp below bubble */}
                    <div className="text-xs text-gray-600 mt-1 px-1">
                      第{index + 1}話
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Streaming message */}
          {isTyping && streamingMessage && (
            <div
              className={`flex ${
                currentSpeaker.id === character1.id ? 'justify-start' : 'justify-end'
              } animate-slideIn`}
            >
              <div className={`flex gap-2 max-w-[75%] ${currentSpeaker.id === character1.id ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar circle */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                    {currentSpeaker.emoji}
                  </div>
                </div>

                {/* Message content */}
                <div className={`flex flex-col ${currentSpeaker.id === character1.id ? 'items-start' : 'items-end'}`}>
                  {/* Character name above bubble */}
                  <div className={`text-xs text-gray-700 mb-1 px-1 ${currentSpeaker.id === character1.id ? 'text-left' : 'text-right'}`}>
                    {currentSpeaker.name}
                  </div>

                  {/* Speech bubble */}
                  <div
                    className={`px-4 py-2.5 shadow-sm ${
                      currentSpeaker.id === character1.id
                        ? 'bg-white text-gray-800 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
                        : 'bg-[#06C755] text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {streamingMessage}
                      <span className={`inline-block w-1 h-4 ml-1 animate-blink ${currentSpeaker.id === character1.id ? 'bg-gray-800' : 'bg-white'}`} />
                    </div>
                  </div>

                  {/* Timestamp below bubble */}
                  <div className="text-xs text-gray-600 mt-1 px-1">
                    第{messages.length + 1}話
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator - three bouncing dots in white bubble */}
          {isTyping && !streamingMessage && (
            <div
              className={`flex ${
                currentSpeaker.id === character1.id ? 'justify-start' : 'justify-end'
              }`}
            >
              <div className={`flex gap-2 ${currentSpeaker.id === character1.id ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar circle */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                    {currentSpeaker.emoji}
                  </div>
                </div>

                {/* Typing bubble */}
                <div className={`${currentSpeaker.id === character1.id ? 'rounded-tr-2xl rounded-br-2xl rounded-bl-2xl' : 'rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'} bg-white px-4 py-3 shadow-sm flex items-center gap-1`}>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Buttons area */}
        {finished && (
          <div className="bg-white border-t border-gray-200 p-4 space-y-3 animate-fadeIn">
            <div className="text-center text-sm text-gray-600">バトル終了！</div>
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 shadow-md"
              >
                Xでシェア
              </button>
              <button
                onClick={onNewBattle}
                className="flex-1 bg-[#06C755] hover:bg-[#05B04A] text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 shadow-md"
              >
                新しいバトル
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Round counter */}
      <div className="text-center text-sm text-gray-500">
        ラウンド {Math.floor(messages.length / 2) + 1} / {MAX_ROUNDS}
      </div>
    </div>
  );
}
