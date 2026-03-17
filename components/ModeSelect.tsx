'use client';

import { Mode } from '@/types';
import { modes } from '@/data/modes';

interface Props {
  value: Mode | null;
  onChange: (mode: Mode) => void;
}

export default function ModeSelect({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode)}
          className={`p-4 rounded-lg transition-all text-left ${
            value?.id === mode.id
              ? 'bg-purple-600 ring-2 ring-purple-400 scale-105'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{mode.emoji}</span>
            <span className="font-bold">{mode.name}</span>
          </div>
          <div className="text-xs text-gray-300">{mode.description}</div>
        </button>
      ))}
    </div>
  );
}
