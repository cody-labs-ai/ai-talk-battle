'use client';
import { Character, Mode } from '@/types';
import { Share2, RotateCcw, Flame, Snowflake, Users, Crown, Bot, Briefcase, Theater, Scale, Trophy } from 'lucide-react';
import { characters } from '@/data/characters';

const ICONS: Record<string, any> = { Flame, Snowflake, Users, Crown, Bot, Briefcase, Theater, Scale };
const BG = ['bg-red-500','bg-blue-500','bg-amber-500','bg-purple-500','bg-slate-500','bg-emerald-500','bg-pink-500','bg-orange-500'];
const CONFETTI = ['#FF6B6B','#4ECDC4','#FFE66D','#A78BFA','#F97316','#3B82F6','#EC4899','#10B981','#F59E0B','#8B5CF6'];

interface Props { character1: Character; character2: Character; mode: Mode; topic: string; history: any[]; onRestart: () => void; }

export default function ResultScreen({ character1, character2, mode, topic, history, onRestart }: Props) {
  const getIcon = (ch: Character, size = 24) => { const I = ICONS[ch.iconName || 'Users'] || Users; return <I size={size} />; };
  const getBg = (ch: Character) => BG[characters.findIndex(c => c.id === ch.id) % BG.length];

  const handleShare = () => {
    const text = `🗣️ AIトークバトル\n\n${character1.name} vs ${character2.name}\nモード: ${mode.name}\nトークテーマ: ${topic}\n${history.length}メッセージの激闘！\n\nhttps://ai-talk-battle.vercel.app`;
    navigator.clipboard.writeText(text).then(() => alert('コピーしました！'));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-violet-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Confetti */}
      {CONFETTI.map((color, i) => (
        <div key={i} className="absolute w-3 h-3 rounded-sm" style={{
          backgroundColor: color, left: `${5 + (i * 9.5) % 90}%`, top: '-3%',
          animation: `confettiFall ${2 + Math.random() * 2}s ${Math.random() * 2}s linear infinite`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }} />
      ))}

      <div className="flex-1 flex flex-col items-center justify-center px-6 animate-slideUp relative z-10">
        {/* Trophy */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 animate-float">
          <Trophy size={32} className="text-white" />
        </div>

        <h1 className="text-2xl font-black text-white mb-2">バトル終了！</h1>
        <p className="text-white/40 text-sm mb-8">白熱のトークバトルでした</p>

        {/* Result Card */}
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-2xl ${getBg(character1)} flex items-center justify-center text-white`}>{getIcon(character1, 28)}</div>
              <span className="text-white font-bold text-sm">{character1.name}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">VS</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-2xl ${getBg(character2)} flex items-center justify-center text-white`}>{getIcon(character2, 28)}</div>
              <span className="text-white font-bold text-sm">{character2.name}</span>
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-white/60 text-sm">トークテーマ: <span className="text-white font-semibold">{topic}</span></p>
            <p className="text-white/60 text-sm">モード: <span className="text-white font-semibold">{mode.name}</span></p>
            <p className="text-white/60 text-sm"><span className="text-white font-semibold">{history.length}</span> メッセージ</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-5 space-y-3 relative z-10">
        <button onClick={handleShare} className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer active:scale-[0.97] transition-transform">
          <Share2 size={18} /> Xでシェア
        </button>
        <a href="https://buy.stripe.com/eVqeVc5PNfeb7ke6HYcMM02" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-2xl bg-white/10 border border-white/20 text-white/80 font-medium text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-all hover:bg-white/15 block">
          ☕ 面白かったらコーヒー1杯おごってください
        </a>
        <button onClick={onRestart} className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer active:scale-[0.97] transition-transform">
          <RotateCcw size={18} /> もう一度バトル
        </button>
      </div>
    </div>
  );
}

