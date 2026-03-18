'use client';

import { useEffect, useRef, useState } from 'react';
import { Character, Mode, Message } from '@/types';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Flame, Snowflake, Users, Crown, Bot, Briefcase, Theater, Scale, Sparkles } from 'lucide-react';

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

const iconMap: Record<string, any> = {
  Flame,
  Snowflake,
  Users,
  Crown,
  Bot,
  Briefcase,
  Theater,
  Scale,
  Sparkles,
};

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

  const getIcon = (character: Character) => {
    const iconName = character.iconName || 'Sparkles';
    const Icon = iconMap[iconName] || Sparkles;
    return <Icon size={20} />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div 
        className="h-14 flex items-center justify-between px-4"
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <button
          onClick={onNewBattle}
          className="transition-all duration-150"
          style={{ 
            color: '#881337',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#E11D48';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#881337';
          }}
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 text-center">
          <div 
            className="text-base font-semibold"
            style={{ 
              fontFamily: 'Fredoka, sans-serif',
              color: '#881337',
            }}
          >
            {character1.name} vs {character2.name}
          </div>
          <div 
            className="text-xs inline-block px-2 py-0.5 rounded-full mt-0.5"
            style={{
              fontFamily: 'Nunito, sans-serif',
              backgroundColor: '#FFF1F2',
              color: '#E11D48',
            }}
          >
            {mode.name}
          </div>
        </div>
        <div className="w-6" />
      </div>

      {/* Chat Area */}
      <div 
        className="h-[500px] overflow-y-auto px-4 py-3"
        style={{ backgroundColor: '#E8ECF0' }}
      >
        <div className="space-y-3">
          {messages.map((message) => {
            const isLeft = message.character.id === character1.id;
            return (
              <div
                key={message.id}
                className={`flex ${isLeft ? 'justify-start' : 'justify-end'} animate-slideIn`}
              >
                <div className={`flex gap-2 items-start ${isLeft ? 'flex-row' : 'flex-row-reverse'} max-w-[75%]`}>
                  {/* Avatar */}
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: isLeft ? '#E11D48' : '#2563EB',
                      color: 'white',
                    }}
                  >
                    {getIcon(message.character)}
                  </div>

                  {/* Bubble Container */}
                  <div className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
                    {/* Name (only for left) */}
                    {isLeft && (
                      <div 
                        className="text-[11px] mb-1 px-1"
                        style={{ 
                          fontFamily: 'Nunito, sans-serif',
                          color: '#64748B',
                        }}
                      >
                        {message.character.name}
                      </div>
                    )}

                    {/* Bubble */}
                    <div 
                      className={isLeft ? 'bubble-left' : 'bubble-right'}
                      style={{
                        padding: '10px 14px',
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        ...(isLeft ? {} : { backgroundColor: '#E11D48', color: 'white' }),
                      }}
                    >
                      {message.content}
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
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: currentSpeaker.id === character1.id ? '#E11D48' : '#2563EB',
                    color: 'white',
                  }}
                >
                  {getIcon(currentSpeaker)}
                </div>

                {/* Bubble Container */}
                <div className={`flex flex-col ${currentSpeaker.id === character1.id ? 'items-start' : 'items-end'}`}>
                  {/* Name (only for left) */}
                  {currentSpeaker.id === character1.id && (
                    <div 
                      className="text-[11px] mb-1 px-1"
                      style={{ 
                        fontFamily: 'Nunito, sans-serif',
                        color: '#64748B',
                      }}
                    >
                      {currentSpeaker.name}
                    </div>
                  )}

                  {/* Bubble */}
                  <div 
                    className={currentSpeaker.id === character1.id ? 'bubble-left' : 'bubble-right'}
                    style={{
                      padding: '10px 14px',
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '15px',
                      lineHeight: '1.5',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      ...(currentSpeaker.id === character1.id ? {} : { backgroundColor: '#E11D48', color: 'white' }),
                    }}
                  >
                    {streamingMessage}
                    <span 
                      className="inline-block w-0.5 h-4 ml-1 animate-blink"
                      style={{ 
                        backgroundColor: currentSpeaker.id === character1.id ? '#881337' : 'white',
                      }}
                    />
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
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: currentSpeaker.id === character1.id ? '#E11D48' : '#2563EB',
                    color: 'white',
                  }}
                >
                  {getIcon(currentSpeaker)}
                </div>

                {/* Typing Bubble */}
                <div 
                  className="flex items-center gap-1"
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'white',
                    borderRadius: currentSpeaker.id === character1.id ? '2px 18px 18px 18px' : '18px 2px 18px 18px',
                    position: 'relative',
                  }}
                >
                  {/* Tail */}
                  <div
                    style={{
                      position: 'absolute',
                      width: 0,
                      height: 0,
                      ...(currentSpeaker.id === character1.id ? {
                        left: '-8px',
                        top: 0,
                        borderWidth: '0 8px 8px 0',
                        borderStyle: 'solid',
                        borderColor: 'transparent white transparent transparent',
                      } : {
                        right: '-8px',
                        top: 0,
                        borderWidth: '0 0 8px 8px',
                        borderStyle: 'solid',
                        borderColor: 'transparent transparent transparent white',
                      }),
                    }}
                  />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Area */}
      <div 
        className="px-4 py-3"
        style={{ backgroundColor: 'white' }}
      >
        {/* Round Counter */}
        <div 
          className="text-center text-sm mb-3"
          style={{ 
            fontFamily: 'Nunito, sans-serif',
            color: '#64748B',
          }}
        >
          ラウンド {Math.floor(messages.length / 2) + 1} / {MAX_ROUNDS}
        </div>

        {/* Buttons */}
        {finished && (
          <div className="space-y-2 animate-fadeIn">
            <div 
              className="text-center text-base font-semibold mb-3"
              style={{ 
                fontFamily: 'Fredoka, sans-serif',
                color: '#E11D48',
              }}
            >
              バトル終了！
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  backgroundColor: '#2563EB',
                  color: 'white',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Share2 size={18} />
                Xでシェア
              </button>
              <button
                onClick={onNewBattle}
                className="flex-1 font-semibold py-3 rounded-lg transition-all duration-200"
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  backgroundColor: '#E11D48',
                  color: 'white',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
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
