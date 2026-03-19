'use client';

import { useState, useEffect, useRef } from 'react';
import { Character, Mode } from '@/types';
import { ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ChatScreenProps {
  character1: Character;
  character2: Character;
  mode: Mode;
  topic: string;
  onComplete: (history: any[]) => void;
  onBack: () => void;
}

interface Message {
  character: Character;
  content: string;
  round: number;
}

export default function ChatScreen({
  character1,
  character2,
  mode,
  topic,
  onComplete,
  onBack,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const totalRounds = 10;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (currentRound < totalRounds) {
      startNextRound();
    } else if (currentRound === totalRounds) {
      setTimeout(() => {
        onComplete(messages);
      }, 1000);
    }
  }, [currentRound]);

  const startNextRound = async () => {
    const currentCharacter = currentRound % 2 === 0 ? character1 : character2;
    const previousMessages = messages.map((m) => ({
      role: m.character.id === currentCharacter.id ? 'assistant' : 'user',
      content: m.content,
    }));

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: currentCharacter,
          mode,
          topic,
          previousMessages,
        }),
      });

      const data = await response.json();

      setIsTyping(false);

      const newMessage: Message = {
        character: currentCharacter,
        content: data.content,
        round: currentRound + 1,
      };

      setMessages((prev) => [...prev, newMessage]);
      setCurrentRound((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to fetch message:', error);
      setIsTyping(false);
    }
  };

  const getIcon = (iconName: string = 'User') => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.User;
    return <IconComponent size={20} />;
  };

  return (
    <div className="screen-transition h-screen flex flex-col bg-[#E5DDD5]">
      {/* Top Bar */}
      <div className="h-14 bg-white flex items-center px-4 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full btn-press">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-semibold text-gray-900 text-sm">
            {character1.name} vs {character2.name}
          </h2>
          <p className="text-xs text-gray-500">{mode.name}</p>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 chat-scroll">
        {messages.map((message, index) => {
          const isLeft = message.character.id === character1.id;
          return (
            <div key={index} className={`flex gap-2 mb-4 ${isLeft ? '' : 'flex-row-reverse'}`}>
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isLeft ? 'bg-gray-300' : 'bg-[#2563EB]'
                }`}
              >
                <div className={isLeft ? 'text-gray-700' : 'text-white'}>
                  {getIcon(message.character.iconName)}
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'} max-w-[70%]`}>
                {isLeft && (
                  <span className="text-[11px] text-gray-600 mb-1 px-1">
                    {message.character.name}
                  </span>
                )}
                <div
                  className={`px-4 py-2.5 shadow-sm ${
                    isLeft
                      ? 'bg-white text-gray-900'
                      : 'bg-[#2563EB] text-white'
                  }`}
                  style={{
                    borderRadius: isLeft ? '0px 18px 18px 18px' : '18px 0px 18px 18px',
                  }}
                >
                  <p className="text-[15px] leading-[1.5] whitespace-pre-wrap">{message.content}</p>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 px-1">第{message.round}話</span>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
              <div className="text-gray-700">
                {getIcon((currentRound % 2 === 0 ? character1 : character2).iconName)}
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] text-gray-600 mb-1 px-1">
                {(currentRound % 2 === 0 ? character1 : character2).name}
              </span>
              <div
                className="bg-white px-4 py-3 shadow-sm flex gap-1"
                style={{ borderRadius: '0px 18px 18px 18px' }}
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Bottom Bar */}
      <div className="bg-white px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            ラウンド {currentRound} / {totalRounds}
          </span>
          <span className="text-xs font-medium text-[#2563EB]">
            {Math.round((currentRound / totalRounds) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#2563EB] h-full rounded-full transition-all duration-300 progress-bar"
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
