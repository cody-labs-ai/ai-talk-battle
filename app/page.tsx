'use client';
import { useState } from 'react';
import { Character, Mode } from '@/types';
import SetupScreen from '@/components/SetupScreen';
import ChatScreen from '@/components/ChatScreen';
import ResultScreen from '@/components/ResultScreen';
import { I18nProvider } from '@/lib/i18n';

type Screen = 'setup' | 'chat' | 'result';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [char1, setChar1] = useState<Character | null>(null);
  const [char2, setChar2] = useState<Character | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [topic, setTopic] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  return (
    <I18nProvider>
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 flex items-center justify-center">
      <div className="w-full max-w-[430px] min-h-screen md:min-h-0 md:h-[860px] md:rounded-[44px] md:shadow-2xl md:shadow-black/50 overflow-hidden relative bg-black">
        {screen === 'setup' && (
          <SetupScreen onStart={(c1, c2, m, t) => { setChar1(c1); setChar2(c2); setMode(m); setTopic(t); setHistory([]); setScreen('chat'); }} />
        )}
        {screen === 'chat' && char1 && char2 && mode && (
          <ChatScreen character1={char1} character2={char2} mode={mode} topic={topic} onComplete={(h) => { setHistory(h); setScreen('result'); }} onBack={() => setScreen('setup')} />
        )}
        {screen === 'result' && char1 && char2 && mode && (
          <ResultScreen character1={char1} character2={char2} mode={mode} topic={topic} history={history} onRestart={() => setScreen('setup')} />
        )}
      </div>
    </div>
    </I18nProvider>
  );
}
