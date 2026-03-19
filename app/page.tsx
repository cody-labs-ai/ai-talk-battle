'use client';

import { useState } from 'react';
import { Character, Mode } from '@/types';
import SetupScreen from '@/components/SetupScreen';
import ChatScreen from '@/components/ChatScreen';
import ResultScreen from '@/components/ResultScreen';

type Screen = 'setup' | 'chat' | 'result';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [character1, setCharacter1] = useState<Character | null>(null);
  const [character2, setCharacter2] = useState<Character | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [topic, setTopic] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const handleStartBattle = (
    char1: Character,
    char2: Character,
    selectedMode: Mode,
    selectedTopic: string
  ) => {
    setCharacter1(char1);
    setCharacter2(char2);
    setMode(selectedMode);
    setTopic(selectedTopic);
    setScreen('chat');
  };

  const handleBattleComplete = (history: any[]) => {
    setChatHistory(history);
    setScreen('result');
  };

  const handleReset = () => {
    setScreen('setup');
    setCharacter1(null);
    setCharacter2(null);
    setMode(null);
    setTopic('');
    setChatHistory([]);
  };

  return (
    <div className="phone-frame">
      {screen === 'setup' && (
        <SetupScreen onStart={handleStartBattle} />
      )}
      {screen === 'chat' && character1 && character2 && mode && (
        <ChatScreen
          character1={character1}
          character2={character2}
          mode={mode}
          topic={topic}
          onComplete={handleBattleComplete}
          onBack={handleReset}
        />
      )}
      {screen === 'result' && character1 && character2 && mode && (
        <ResultScreen
          character1={character1}
          character2={character2}
          mode={mode}
          topic={topic}
          chatHistory={chatHistory}
          onRestart={handleReset}
        />
      )}
    </div>
  );
}
