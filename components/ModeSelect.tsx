'use client';

import { Mode } from '@/types';
import { modes } from '@/data/modes';
import { Flame, GraduationCap, Lightbulb, Laugh, Heart } from 'lucide-react';

interface Props {
  value: Mode | null;
  onChange: (mode: Mode) => void;
}

const iconMap: Record<string, any> = {
  'heated-argument': Flame,
  'serious-debate': GraduationCap,
  'business-brainstorm': Lightbulb,
  'comedy-duo': Laugh,
  'love-advice': Heart,
};

export default function ModeSelect({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {modes.map((mode) => {
        const isSelected = value?.id === mode.id;
        const Icon = iconMap[mode.id];
        
        return (
          <button
            key={mode.id}
            onClick={() => onChange(mode)}
            className="p-4 rounded-xl transition-all duration-200 text-left"
            style={{
              backgroundColor: isSelected ? '#2563EB' : 'white',
              color: isSelected ? 'white' : '#881337',
              border: isSelected ? '3px solid #3B82F6' : '2px solid #FFF1F2',
              boxShadow: isSelected ? '0 6px 8px rgba(37, 99, 235, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transform: isSelected ? 'scale(1.02)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.transform = 'scale(1.01)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              {Icon && (
                <div style={{ color: isSelected ? 'white' : '#E11D48' }}>
                  <Icon size={24} />
                </div>
              )}
              <span 
                className="font-bold text-base"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                {mode.name}
              </span>
            </div>
            <div 
              className="text-xs leading-relaxed"
              style={{ 
                fontFamily: 'Nunito, sans-serif',
                color: isSelected ? 'rgba(255,255,255,0.9)' : '#881337',
              }}
            >
              {mode.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
