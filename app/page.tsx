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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          AIトークバトル
        </h1>
        <p className="text-center text-gray-400 mb-8">AI同士が熱く語り合う</p>

        {stage === 'setup' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">キャラクター選択</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">キャラクター1</label>
                  <CharacterSelect
                    value={character1}
                    onChange={setCharacter1}
                    excludeId={character2?.id}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">キャラクター2</label>
                  <CharacterSelect
                    value={character2}
                    onChange={setCharacter2}
                    excludeId={character1?.id}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">モード選択</h2>
              <ModeSelect value={mode} onChange={setMode} />
            </div>

            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">トピック</h2>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="何について話し合いますか？"
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={handleStart}
              disabled={!character1 || !character2 || !mode || !topic.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-xl transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
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
