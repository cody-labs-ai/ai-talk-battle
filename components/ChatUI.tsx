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
    <div className="w-full max-w-2xl mx-auto">
      {/* LINE Header */}
      <div className="bg-white h-14 flex items-center justify-between px-4 border-b border-gray-200">
        <button
          onClick={onNewBattle}
          className="text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 text-center">
          <div className="text-base font-medium text-gray-900" style={{ fontFamily: '-apple-system, sans-serif' }}>
            {character1.name} vs {character2.name}
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded-full mt-0.5">
            {mode.name}
          </div>
        </div>
        <div className="w-6" /> {/* Spacer for centering */}
      </div>

      {/* LINE Chat Background */}
      <div className="h-[500px] overflow-y-auto px-4 py-3" style={{ backgroundColor: '#9BBBA7' }}>
        <div className="space-y-3">
          {messages.map((message, index) => {
            const isLeft = message.character.id === character1.id;
            return (
              <div
                key={message.id}
                className={`flex ${isLeft ? 'justify-start' : 'justify-end'} animate-slideIn`}
              >
                <div className={`flex gap-2 items-start ${isLeft ? 'flex-row' : 'flex-row-reverse'} max-w-[75%]`}>
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                    {message.character.emoji}
                  </div>

                  {/* Bubble Container */}
                  <div className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
                    {/* Name (only for left/opponent) */}
                    {isLeft && (
                      <div className="text-[11px] text-gray-600 mb-1 px-1" style={{ fontFamily: '-apple-system, sans-serif' }}>
                        {message.character.name}
                      </div>
                    )}

                    {/* Bubble with Tail */}
                    <div className="relative">
                      {isLeft ? (
                        <>
                          {/* Left Tail */}
                          <div
                            className="absolute left-0 top-0"
                            style={{
                              width: 0,
                              height: 0,
                              borderWidth: '0 8px 8px 0',
                              borderStyle: 'solid',
                              borderColor: 'transparent #FFFFFF transparent transparent',
                              left: '-8px',
                              top: 0,
                            }}
                          />
                          {/* Left Bubble */}
                          <div
                            className="bubble-left px-[14px] py-[10px] text-[15px] leading-[1.5]"
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              borderRadius: '2px 18px 18px 18px',
                              fontFamily: '-apple-system, sans-serif',
                              wordWrap: 'break-word',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {message.content}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Right Tail */}
                          <div
                            className="absolute right-0 top-0"
                            style={{
                              width: 0,
                              height: 0,
                              borderWidth: '0 0 8px 8px',
                              borderStyle: 'solid',
                              borderColor: 'transparent transparent transparent #06C755',
                              right: '-8px',
                              top: 0,
                            }}
                          />
                          {/* Right Bubble */}
                          <div
                            className="bubble-right px-[14px] py-[10px] text-[15px] leading-[1.5]"
                            style={{
                              backgroundColor: '#06C755',
                              color: '#FFFFFF',
                              borderRadius: '18px 2px 18px 18px',
                              fontFamily: '-apple-system, sans-serif',
                              wordWrap: 'break-word',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {message.content}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Streaming Message */}
          {isTyping && streamingMessage && (
            <div
              className={`flex ${currentSpeaker.id === character1.id ? 'justify-start' : 'justify-end'} animate-slideIn`}
            >
              <div className={`flex gap-2 items-start ${currentSpeaker.id === character1.id ? 'flex-row' : 'flex-row-reverse'} max-w-[75%]`}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                  {currentSpeaker.emoji}
                </div>

                {/* Bubble Container */}
                <div className={`flex flex-col ${currentSpeaker.id === character1.id ? 'items-start' : 'items-end'}`}>
                  {/* Name (only for left/opponent) */}
                  {currentSpeaker.id === character1.id && (
                    <div className="text-[11px] text-gray-600 mb-1 px-1" style={{ fontFamily: '-apple-system, sans-serif' }}>
                      {currentSpeaker.name}
                    </div>
                  )}

                  {/* Bubble with Tail */}
                  <div className="relative">
                    {currentSpeaker.id === character1.id ? (
                      <>
                        {/* Left Tail */}
                        <div
                          className="absolute left-0 top-0"
                          style={{
                            width: 0,
                            height: 0,
                            borderWidth: '0 8px 8px 0',
                            borderStyle: 'solid',
                            borderColor: 'transparent #FFFFFF transparent transparent',
                            left: '-8px',
                            top: 0,
                          }}
                        />
                        {/* Left Bubble */}
                        <div
                          className="px-[14px] py-[10px] text-[15px] leading-[1.5]"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            borderRadius: '2px 18px 18px 18px',
                            fontFamily: '-apple-system, sans-serif',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {streamingMessage}
                          <span className="inline-block w-0.5 h-4 ml-1 bg-gray-800 animate-blink" />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Right Tail */}
                        <div
                          className="absolute right-0 top-0"
                          style={{
                            width: 0,
                            height: 0,
                            borderWidth: '0 0 8px 8px',
                            borderStyle: 'solid',
                            borderColor: 'transparent transparent transparent #06C755',
                            right: '-8px',
                            top: 0,
                          }}
                        />
                        {/* Right Bubble */}
                        <div
                          className="px-[14px] py-[10px] text-[15px] leading-[1.5]"
                          style={{
                            backgroundColor: '#06C755',
                            color: '#FFFFFF',
                            borderRadius: '18px 2px 18px 18px',
                            fontFamily: '-apple-system, sans-serif',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {streamingMessage}
                          <span className="inline-block w-0.5 h-4 ml-1 bg-white animate-blink" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && !streamingMessage && (
            <div
              className={`flex ${currentSpeaker.id === character1.id ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex gap-2 items-start ${currentSpeaker.id === character1.id ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                  {currentSpeaker.emoji}
                </div>

                {/* Typing Bubble */}
                <div className="relative">
                  {currentSpeaker.id === character1.id ? (
                    <>
                      {/* Left Tail */}
                      <div
                        className="absolute left-0 top-0"
                        style={{
                          width: 0,
                          height: 0,
                          borderWidth: '0 8px 8px 0',
                          borderStyle: 'solid',
                          borderColor: 'transparent #FFFFFF transparent transparent',
                          left: '-8px',
                          top: 0,
                        }}
                      />
                      {/* Typing Bubble */}
                      <div
                        className="px-[14px] py-[10px] flex items-center gap-1"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '2px 18px 18px 18px',
                        }}
                      >
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Right Tail */}
                      <div
                        className="absolute right-0 top-0"
                        style={{
                          width: 0,
                          height: 0,
                          borderWidth: '0 0 8px 8px',
                          borderStyle: 'solid',
                          borderColor: 'transparent transparent transparent #FFFFFF',
                          right: '-8px',
                          top: 0,
                        }}
                      />
                      {/* Typing Bubble */}
                      <div
                        className="px-[14px] py-[10px] flex items-center gap-1"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '18px 2px 18px 18px',
                        }}
                      >
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Area */}
      <div className="bg-white px-4 py-3">
        {/* Round Counter */}
        <div className="text-center text-sm text-gray-500 mb-3" style={{ fontFamily: '-apple-system, sans-serif' }}>
          ラウンド {Math.floor(messages.length / 2) + 1} / {MAX_ROUNDS}
        </div>

        {/* Buttons */}
        {finished && (
          <div className="space-y-2 animate-fadeIn">
            <div className="text-center text-sm text-gray-600 mb-3" style={{ fontFamily: '-apple-system, sans-serif' }}>
              バトル終了！
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
                style={{ fontFamily: '-apple-system, sans-serif' }}
              >
                Xでシェア
              </button>
              <button
                onClick={onNewBattle}
                className="flex-1 text-white font-medium py-3 rounded-lg transition-colors"
                style={{ backgroundColor: '#06C755', fontFamily: '-apple-system, sans-serif' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#05B04A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#06C755'}
              >
                新しいバトル
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
