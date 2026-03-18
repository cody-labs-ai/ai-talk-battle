'use client';

import { useState } from 'react';
import CharacterSelect from '@/components/CharacterSelect';
import ModeSelect from '@/components/ModeSelect';
import ChatUI from '@/components/ChatUI';
import { Character, Mode, Message } from '@/types';

export default function Home() {
  const [stage, setStage] = useState<'setup' | 'chat' | 'finished'>('setup');
  const [character1, setCharacter1] = useState<Character | null>(null);
  const [character2, setCharacter2] = useState<Character | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleStart = () => {
    if (character1 && character2 && mode && topic.trim()) {
      setMessages([]);
      setStage('chat');
    }
  };

  const handleNewBattle = () => {
    setStage('setup');
    setCharacter1(null);
    setCharacter2(null);
    setMode(null);
    setTopic('');
    setMessages([]);
  };

  const handleFinish = () => {
    setStage('finished');
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FFF1F2' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-2"
            style={{ 
              fontFamily: 'Fredoka, sans-serif',
              color: '#E11D48',
              textShadow: '2px 2px 0 rgba(225, 29, 72, 0.1)'
            }}
          >
            AIトークバトル
          </h1>
          <p 
            className="text-lg md:text-xl"
            style={{ 
              fontFamily: 'Nunito, sans-serif',
              color: '#881337',
              fontWeight: 500
            }}
          >
            AI同士が熱く語り合う！🔥
          </p>
        </div>

        {stage === 'setup' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Character Selection */}
            <div 
              className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ 
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#881337'
                }}
              >
                キャラクター選択
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ 
                      fontFamily: 'Nunito, sans-serif',
                      color: '#881337'
                    }}
                  >
                    キャラクター1
                  </label>
                  <CharacterSelect
                    value={character1}
                    onChange={setCharacter1}
                    excludeId={character2?.id}
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ 
                      fontFamily: 'Nunito, sans-serif',
                      color: '#881337'
                    }}
                  >
                    キャラクター2
                  </label>
                  <CharacterSelect
                    value={character2}
                    onChange={setCharacter2}
                    excludeId={character1?.id}
                  />
                </div>
              </div>
            </div>

            {/* Mode Selection */}
            <div 
              className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ 
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#881337'
                }}
              >
                モード選択
              </h2>
              <ModeSelect value={mode} onChange={setMode} />
            </div>

            {/* Topic Input */}
            <div 
              className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ 
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#881337'
                }}
              >
                トピック
              </h2>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="何について話し合いますか？"
                className="w-full rounded-lg px-4 py-3 transition-all duration-200"
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  border: '2px solid #E2E8F0',
                  fontSize: '16px',
                  color: '#881337'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E11D48';
                  e.target.style.outline = 'none';
                  e.target.style.boxShadow = '0 0 0 3px rgba(225, 29, 72, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              disabled={!character1 || !character2 || !mode || !topic.trim()}
              className="w-full font-bold py-4 rounded-xl text-xl transition-all duration-200"
              style={{
                fontFamily: 'Fredoka, sans-serif',
                backgroundColor: !character1 || !character2 || !mode || !topic.trim() ? '#CBD5E1' : '#2563EB',
                color: 'white',
                boxShadow: !character1 || !character2 || !mode || !topic.trim() ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                cursor: !character1 || !character2 || !mode || !topic.trim() ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (character1 && character2 && mode && topic.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = character1 && character2 && mode && topic.trim() ? '0 4px 6px rgba(0,0,0,0.1)' : 'none';
              }}
            >
              バトル開始！
            </button>
          </div>
        )}

        {(stage === 'chat' || stage === 'finished') && character1 && character2 && mode && (
          <ChatUI
            character1={character1}
            character2={character2}
            mode={mode}
            topic={topic}
            messages={messages}
            setMessages={setMessages}
            onFinish={handleFinish}
            onNewBattle={handleNewBattle}
            finished={stage === 'finished'}
          />
        )}
      </div>
    </main>
  );
}
