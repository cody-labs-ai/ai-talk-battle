'use client';

import { useState } from 'react';
import { Character } from '@/types';
import { characters } from '@/data/characters';

interface Props {
  value: Character | null;
  onChange: (character: Character | null) => void;
  excludeId?: string;
}

export default function CharacterSelect({ value, onChange, excludeId }: Props) {
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const availableCharacters = characters.filter((c) => c.id !== excludeId);

  const handlePresetSelect = (character: Character) => {
    setIsCustom(false);
    onChange(character);
  };

  const handleCustomToggle = () => {
    if (isCustom) {
      setIsCustom(false);
      setCustomName('');
      setCustomDescription('');
      onChange(null);
    } else {
      setIsCustom(true);
      onChange(null);
    }
  };

  const handleCustomSave = () => {
    if (customName.trim() && customDescription.trim()) {
      const customChar: Character = {
        id: `custom-${Date.now()}`,
        emoji: '✨',
        name: customName.trim(),
        description: 'Custom character',
        systemPrompt: `あなたは${customName.trim()}です。${customDescription.trim()}`,
      };
      onChange(customChar);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {availableCharacters.map((char) => (
          <button
            key={char.id}
            onClick={() => handlePresetSelect(char)}
            className={`p-3 rounded-lg transition-all ${
              value?.id === char.id
                ? 'bg-purple-600 ring-2 ring-purple-400 scale-105'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <div className="text-2xl mb-1">{char.emoji}</div>
            <div className="text-sm font-medium">{char.name}</div>
          </button>
        ))}
        <button
          onClick={handleCustomToggle}
          className={`p-3 rounded-lg transition-all ${
            isCustom
              ? 'bg-purple-600 ring-2 ring-purple-400 scale-105'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <div className="text-2xl mb-1">✨</div>
          <div className="text-sm font-medium">カスタム</div>
        </button>
      </div>

      {isCustom && (
        <div className="space-y-2 animate-fadeIn">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="キャラクター名"
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="キャラクターの説明（性格、口調など）"
            rows={3}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleCustomSave}
            disabled={!customName.trim() || !customDescription.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg text-sm transition-all"
          >
            保存
          </button>
        </div>
      )}

      {value && !isCustom && (
        <div className="text-xs text-gray-400 bg-gray-700/50 rounded p-2">
          {value.emoji} {value.name}
        </div>
      )}
    </div>
  );
}
