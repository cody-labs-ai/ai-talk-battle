'use client';

import { Character, Mode } from '@/types';
import { Share2, RotateCcw } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ResultScreenProps {
  character1: Character;
  character2: Character;
  mode: Mode;
  topic: string;
  chatHistory: any[];
  onRestart: () => void;
}

export default function ResultScreen({
  character1,
  character2,
  mode,
  topic,
  chatHistory,
  onRestart,
}: ResultScreenProps) {
  const getIcon = (iconName: string = 'User') => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.User;
    return <IconComponent size={24} />;
  };

  const handleShare = () => {
    const shareText = `AIトークバトル 🔥\n\n${character1.name} vs ${character2.name}\nモード: ${mode.name}\nお題: ${topic}\n\n#AIトークバトル`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="screen-transition min-h-screen bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex flex-col items-center justify-center p-6">
      {/* Result Card */}
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl mb-6">
        <div className="text-center mb-6">
          <h1 className="font-[family-name:var(--font-righteous)] text-3xl text-[#2563EB] mb-2">
            バトル終了！
          </h1>
          <p className="text-sm text-gray-500">お疲れ様でした</p>
        </div>

        {/* Characters */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center mb-2">
              <div className="text-[#2563EB]">{getIcon(character1.iconName)}</div>
            </div>
            <span className="text-sm font-medium text-gray-900">{character1.name}</span>
          </div>

          <div className="text-2xl font-bold text-[#F97316]">VS</div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center mb-2">
              <div className="text-[#2563EB]">{getIcon(character2.iconName)}</div>
            </div>
            <span className="text-sm font-medium text-gray-900">{character2.name}</span>
          </div>
        </div>

        {/* Battle Info */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">モード</span>
            <span className="text-sm font-medium text-gray-900">{mode.name}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">お題</span>
            <span className="text-sm font-medium text-gray-900 text-right max-w-[200px] truncate">
              {topic}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">発言数</span>
            <span className="text-sm font-medium text-gray-900">{chatHistory.length}件</span>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full py-3.5 bg-[#1DA1F2] text-white rounded-2xl font-semibold text-base mb-3 flex items-center justify-center gap-2 hover:bg-[#1a8cd8] transition-all btn-press"
        >
          <Share2 size={18} />
          Xでシェア
        </button>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full py-3.5 bg-[#F97316] text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#ea580c] transition-all btn-press"
        >
          <RotateCcw size={18} />
          もう一度バトル
        </button>
      </div>

      {/* Footer */}
      <p className="text-white/80 text-xs text-center">
        powered by AI Talk Battle
      </p>
    </div>
  );
}
