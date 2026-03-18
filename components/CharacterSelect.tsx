'use client';

import { useState } from 'react';
import { Character } from '@/types';
import { characters } from '@/data/characters';
import { Flame, Snowflake, Users, Crown, Bot, Briefcase, Theater, Scale, Sparkles } from 'lucide-react';

interface Props {
  value: Character | null;
  onChange: (character: Character | null) => void;
  excludeId?: string;
}

const iconMap: Record<string, any> = {
  Flame,
  Snowflake,
  Users,
  Crown,
  Bot,
  Briefcase,
  Theater,
  Scale,
  Sparkles,
};

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
        iconName: 'Sparkles',
        name: customName.trim(),
        description: 'Custom character',
        systemPrompt: `あなたは${customName.trim()}です。${customDescription.trim()}`,
      };
      onChange(customChar);
    }
  };

  const getIcon = (iconName?: string) => {
    if (!iconName || !iconMap[iconName]) return null;
    const Icon = iconMap[iconName];
    return <Icon size={32} />;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {availableCharacters.map((char) => {
          const isSelected = value?.id === char.id;
          return (
            <button
              key={char.id}
              onClick={() => handlePresetSelect(char)}
              className="p-4 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: isSelected ? '#E11D48' : 'white',
                color: isSelected ? 'white' : '#881337',
                border: isSelected ? '3px solid #FB7185' : '2px solid #FFF1F2',
                boxShadow: isSelected ? '0 6px 8px rgba(225, 29, 72, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'scale(1.02)';
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
              <div className="flex items-center justify-center mb-2" style={{ color: isSelected ? 'white' : '#E11D48' }}>
                {getIcon(char.iconName)}
              </div>
              <div 
                className="text-sm font-semibold text-center"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {char.name}
              </div>
            </button>
          );
        })}
        
        {/* Custom Character Button */}
        <button
          onClick={handleCustomToggle}
          className="p-4 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: isCustom ? '#E11D48' : 'white',
            color: isCustom ? 'white' : '#881337',
            border: isCustom ? '3px solid #FB7185' : '2px solid #FFF1F2',
            boxShadow: isCustom ? '0 6px 8px rgba(225, 29, 72, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transform: isCustom ? 'scale(1.05)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (!isCustom) {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isCustom) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }
          }}
        >
          <div className="flex items-center justify-center mb-2" style={{ color: isCustom ? 'white' : '#E11D48' }}>
            <Sparkles size={32} />
          </div>
          <div 
            className="text-sm font-semibold text-center"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            カスタム
          </div>
        </button>
      </div>

      {isCustom && (
        <div className="space-y-2 animate-fadeIn">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="キャラクター名"
            className="w-full rounded-lg px-3 py-2 text-sm transition-all duration-200"
            style={{
              fontFamily: 'Nunito, sans-serif',
              border: '2px solid #E2E8F0',
              color: '#881337',
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
          <textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="キャラクターの説明（性格、口調など）"
            rows={3}
            className="w-full rounded-lg px-3 py-2 text-sm transition-all duration-200"
            style={{
              fontFamily: 'Nunito, sans-serif',
              border: '2px solid #E2E8F0',
              color: '#881337',
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
          <button
            onClick={handleCustomSave}
            disabled={!customName.trim() || !customDescription.trim()}
            className="w-full font-semibold py-2 rounded-lg text-sm transition-all duration-200"
            style={{
              fontFamily: 'Nunito, sans-serif',
              backgroundColor: !customName.trim() || !customDescription.trim() ? '#CBD5E1' : '#2563EB',
              color: 'white',
              cursor: !customName.trim() || !customDescription.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (customName.trim() && customDescription.trim()) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            保存
          </button>
        </div>
      )}

      {value && !isCustom && (
        <div 
          className="text-xs rounded p-2"
          style={{
            fontFamily: 'Nunito, sans-serif',
            backgroundColor: '#FFF1F2',
            color: '#881337',
          }}
        >
          選択中: {value.name}
        </div>
      )}
    </div>
  );
}
