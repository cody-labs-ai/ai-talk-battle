'use client';

import { useState } from 'react';
import { Character, Mode } from '@/types';
import { characters } from '@/data/characters';
import { modes } from '@/data/modes';
import * as LucideIcons from 'lucide-react';

interface SetupScreenProps {
  onStart: (char1: Character, char2: Character, mode: Mode, topic: string) => void;
}

const CHAR_COLORS = [
  { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-500' },
  { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-500' },
  { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-500' },
  { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-500' },
  { bg: 'bg-gray-500', light: 'bg-gray-50', text: 'text-gray-500' },
  { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-500' },
  { bg: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-500' },
  { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-500' },
];

const MODE_COLORS = [
  { bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-200' },
  { bg: 'bg-indigo-500', light: 'bg-indigo-50', border: 'border-indigo-200' },
  { bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-200' },
  { bg: 'bg-pink-500', light: 'bg-pink-50', border: 'border-pink-200' },
  { bg: 'bg-rose-500', light: 'bg-rose-50', border: 'border-rose-200' },
];

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [character1, setCharacter1] = useState<Character | null>(null);
  const [character2, setCharacter2] = useState<Character | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [topic, setTopic] = useState('');

  const canStart = character1 && character2 && selectedMode && topic.trim();

  const handleStart = () => {
    if (canStart) onStart(character1, character2, selectedMode, topic);
  };

  const getIcon = (iconName: string = 'User', size: number = 28) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.User;
    return <IconComponent size={size} strokeWidth={2.5} />;
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
    return <IconComponent size={20} strokeWidth={2.5} />;
  };

  const CharSelector = ({
    label,
    selected,
    onSelect,
  }: {
    label: string;
    selected: Character | null;
    onSelect: (c: Character) => void;
  }) => (
    <div>
      <h2 className="text-lg font-bold text-[#1E293B] mb-3 font-[family-name:var(--font-righteous)]">
        {label}
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {characters.map((char, i) => {
          const color = CHAR_COLORS[i % CHAR_COLORS.length];
          const isSelected = selected?.id === char.id;
          return (
            <button
              key={char.id}
              onClick={() => onSelect(char)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
                isSelected
                  ? `${color.bg} text-white shadow-lg shadow-${color.bg}/30 scale-105`
                  : `${color.light} ${color.text} hover:shadow-md`
              }`}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                  isSelected ? 'bg-white/25' : 'bg-white/80'
                }`}
              >
                {getIcon(char.iconName, isSelected ? 32 : 28)}
              </div>
              <span className={`text-[11px] font-bold leading-tight text-center ${isSelected ? 'text-white' : ''}`}>
                {char.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF2FF] to-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="pt-10 pb-4 px-5 text-center">
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm mb-3">
          <LucideIcons.Swords size={20} className="text-[#F97316]" />
          <span className="text-xs font-bold text-[#1E293B] tracking-wider uppercase">AI Talk Battle</span>
        </div>
        <h1 className="font-[family-name:var(--font-righteous)] text-3xl text-[#1E293B]">
          AI<span className="text-[#2563EB]">トーク</span>バトル
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-4 overflow-y-auto space-y-5">
        <CharSelector label="キャラ1" selected={character1} onSelect={setCharacter1} />

        {/* VS Divider */}
        <div className="flex items-center justify-center py-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F97316] to-[#EF4444] flex items-center justify-center shadow-lg">
            <span className="text-white font-[family-name:var(--font-righteous)] text-lg">VS</span>
          </div>
        </div>

        <CharSelector label="キャラ2" selected={character2} onSelect={setCharacter2} />

        {/* Mode Selection */}
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-3 font-[family-name:var(--font-righteous)]">
            モード
          </h2>
          <div className="flex flex-wrap gap-2">
            {modes.map((m, i) => {
              const color = MODE_COLORS[i % MODE_COLORS.length];
              const isSelected = selectedMode?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMode(m)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-200 cursor-pointer active:scale-95 border-2 ${
                    isSelected
                      ? `${color.bg} text-white border-transparent shadow-md`
                      : `bg-white ${color.border} text-[#1E293B] hover:shadow-sm`
                  }`}
                >
                  <span className={isSelected ? 'text-white' : ''}>{getModeIcon(m.id)}</span>
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-3 font-[family-name:var(--font-righteous)]">
            お題
          </h2>
          <div className="relative">
            <LucideIcons.PenLine size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例：きのこの山 vs たけのこの里"
              className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl text-[#1E293B] placeholder-gray-300 border-2 border-gray-100 focus:border-[#2563EB] focus:ring-0 focus:outline-none transition-all text-[15px]"
            />
          </div>
        </div>
      </div>

      {/* Start Button - always visible at bottom */}
      <div className="p-5 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent">
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full py-4.5 rounded-2xl font-[family-name:var(--font-righteous)] text-xl tracking-wide transition-all duration-200 cursor-pointer active:scale-[0.97] ${
            canStart
              ? 'bg-gradient-to-r from-[#F97316] to-[#EF4444] text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          ⚔️ バトル開始！
        </button>
      </div>
    </div>
  );
}
