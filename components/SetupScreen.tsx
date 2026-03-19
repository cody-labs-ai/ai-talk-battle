'use client';

import { useState } from 'react';
import { Character, Mode } from '@/types';
import { characters } from '@/data/characters';
import { modes } from '@/data/modes';
import * as LucideIcons from 'lucide-react';

interface SetupScreenProps {
  onStart: (char1: Character, char2: Character, mode: Mode, topic: string) => void;
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [character1, setCharacter1] = useState<Character | null>(null);
  const [character2, setCharacter2] = useState<Character | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [topic, setTopic] = useState('');

  const canStart = character1 && character2 && selectedMode && topic.trim();

  const handleStart = () => {
    if (canStart) {
      onStart(character1, character2, selectedMode, topic);
    }
  };

  const getIcon = (iconName: string = 'User') => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.User;
    return <IconComponent size={24} />;
  };

  const getModeIcon = (modeId: string) => {
    const iconMap: Record<string, any> = {
      'heated-argument': LucideIcons.Flame,
      'serious-debate': LucideIcons.GraduationCap,
      'business-brainstorm': LucideIcons.Lightbulb,
      'comedy-duo': LucideIcons.Laugh,
      'love-advice': LucideIcons.Heart,
    };
    const IconComponent = iconMap[modeId] || LucideIcons.MessageCircle;
    return <IconComponent size={18} />;
  };

  return (
    <div className="screen-transition min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center">
        <h1 className="font-[family-name:var(--font-righteous)] text-4xl text-[#2563EB] mb-2">
          AIトークバトル
        </h1>
        <p className="text-sm text-gray-500">キャラクターを選んでバトル開始！</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Character 1 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">キャラクター1</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setCharacter1(char)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all btn-press ${
                  character1?.id === char.id
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    character1?.id === char.id ? 'bg-white/20' : 'bg-[#2563EB]/10'
                  }`}
                >
                  <div className={character1?.id === char.id ? 'text-white' : 'text-[#2563EB]'}>
                    {getIcon(char.iconName)}
                  </div>
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{char.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="px-4 text-2xl font-bold text-[#F97316]">VS</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Character 2 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">キャラクター2</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setCharacter2(char)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all btn-press ${
                  character2?.id === char.id
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    character2?.id === char.id ? 'bg-white/20' : 'bg-[#2563EB]/10'
                  }`}
                >
                  <div className={character2?.id === char.id ? 'text-white' : 'text-[#2563EB]'}>
                    {getIcon(char.iconName)}
                  </div>
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{char.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">バトルモード</h2>
          <div className="flex flex-wrap gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all btn-press ${
                  selectedMode?.id === m.id
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={selectedMode?.id === m.id ? 'text-white' : 'text-[#2563EB]'}>
                  {getModeIcon(m.id)}
                </div>
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">お題</h2>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="お題を入力..."
            className="w-full px-4 py-3.5 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#2563EB] transition-all"
          />
        </div>
      </div>

      {/* Start Button */}
      <div className="p-6 pt-0">
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all btn-press ${
            canStart
              ? 'bg-[#F97316] text-white hover:bg-[#ea580c] active:bg-[#c2410c]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          バトル開始！
        </button>
      </div>
    </div>
  );
}
