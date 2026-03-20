'use client';
import { useState, useEffect } from 'react';
import { Character, Mode } from '@/types';
import { characters } from '@/data/characters';
import { modes } from '@/data/modes';
import { Flame, Snowflake, Users, Crown, Bot, Briefcase, Theater, Scale, Swords, GraduationCap, Lightbulb, Laugh, Heart, X as XIcon, PenLine, Sparkles } from 'lucide-react';

const ICONS: Record<string, any> = { Flame, Snowflake, Users, Crown, Bot, Briefcase, Theater, Scale };
const MODE_ICONS: Record<string, any> = { 'heated-argument': Flame, 'serious-debate': GraduationCap, 'business-brainstorm': Lightbulb, 'comedy-duo': Laugh, 'love-advice': Heart, 'pro-brainstorm': Sparkles };
const PRO_MODES = new Set(['pro-brainstorm']);
const PRO_PAYMENT_URL = 'https://buy.stripe.com/dRmaEW1zx0jh9smaYecMM01';
const COLORS = ['from-red-500 to-rose-600', 'from-blue-500 to-cyan-600', 'from-amber-500 to-orange-600', 'from-purple-500 to-violet-600', 'from-slate-500 to-gray-600', 'from-emerald-500 to-teal-600', 'from-pink-500 to-fuchsia-600', 'from-orange-500 to-amber-600'];
const BG_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-slate-500', 'bg-emerald-500', 'bg-pink-500', 'bg-orange-500'];
const PLACEHOLDERS = ['きのこの山 vs たけのこの里', 'AIは人間を超えるか', '猫派 vs 犬派', '朝型 vs 夜型', 'リモート vs 出社'];

interface Props { onStart: (c1: Character, c2: Character, m: Mode, t: string) => void; }

function CustomCharModal({ onSave, onClose }: { onSave: (c: Character) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  return (
    <div className="fixed inset-0 z-[60] animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl p-5 pb-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">カスタムキャラ作成</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"><XIcon size={16} className="text-white/60" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">キャラ名</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="例：ツンデレ幼馴染" className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-white/20 border border-white/10 focus:border-white/30 focus:outline-none" />
          </div>
          <div>
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 block">性格・口調の設定 <span className="text-white/30 font-normal normal-case">（任意）</span></label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="空欄なら名前から自動で性格を推測します" rows={3} className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-white/20 border border-white/10 focus:border-white/30 focus:outline-none resize-none" />
          </div>
          <button disabled={!name.trim()} onClick={() => { onSave({ id: 'custom-' + Date.now(), emoji: '✨', iconName: 'Sparkles', name: name.trim(), description: name.trim(), systemPrompt: desc.trim() || `あなたは${name.trim()}です。${name.trim()}として自然に振る舞い、その人物らしい口調と考え方で会話してください。` }); }}
            className={`w-full py-3.5 rounded-xl font-bold transition-all cursor-pointer active:scale-[0.97] ${name.trim() ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}>
            作成
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SetupScreen({ onStart }: Props) {
  const [c1, setC1] = useState<Character | null>(null);
  const [c2, setC2] = useState<Character | null>(null);
  const [selMode, setSelMode] = useState<Mode | null>(null);
  const [topic, setTopic] = useState('');
  const [modal, setModal] = useState<1 | 2 | null>(null);
  const [customModal, setCustomModal] = useState<1 | 2 | null>(null);
  const [phIdx, setPhIdx] = useState(0);

  useEffect(() => { const t = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 3000); return () => clearInterval(t); }, []);

  const canStart = c1 && c2 && selMode && topic.trim();
  const getIcon = (name?: string, size = 28) => { const I = ICONS[name || 'Users'] || Users; return <I size={size} />; };

  const CharSlot = ({ char, slot }: { char: Character | null; slot: 1 | 2 }) => (
    <button onClick={() => setModal(slot)} className="flex-1 h-[160px] rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer active:scale-95 hover:border-white/40 overflow-hidden relative">
      {char ? (
        <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[characters.indexOf(char) % COLORS.length]} flex flex-col items-center justify-center gap-2`}>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white">{getIcon(char.iconName, 36)}</div>
          <span className="text-white font-bold text-sm">{char.name}</span>
        </div>
      ) : (
        <>
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/30"><Users size={28} /></div>
          <span className="text-white/30 text-xs font-medium">タップして選択</span>
        </>
      )}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-violet-950 via-indigo-950 to-slate-950 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="pt-14 pb-6 px-6 text-center animate-fadeIn">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
          <Swords size={14} className="text-orange-400" /><span className="text-[11px] text-white/70 font-semibold tracking-widest uppercase">AI Talk Battle</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight animate-glow">AI TALK BATTLE</h1>
        <p className="text-white/40 text-sm mt-2">キャラを選んで、バトル開始</p>
      </div>

      <div className="flex-1 px-5 pb-5 space-y-6 animate-slideUp">
        {/* Character Slots */}
        <div className="flex gap-3 items-center">
          <CharSlot char={c1} slot={1} />
          <div className="animate-pulse-slow"><div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30"><span className="text-white font-black text-sm">VS</span></div></div>
          <CharSlot char={c2} slot={2} />
        </div>

        {/* Mode */}
        <div>
          <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">会話モード</h3>
          <div className="space-y-2">
            {modes.map((m, i) => { const MIcon = MODE_ICONS[m.id] || Sparkles; const sel = selMode?.id === m.id; const isPro = PRO_MODES.has(m.id); const isUnlocked = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('pro') === 'true'; return (
              <button key={m.id} onClick={() => { if (isPro && !isUnlocked) { window.location.href = PRO_PAYMENT_URL; } else { setSelMode(m); } }} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 cursor-pointer active:scale-[0.98] ${sel ? 'bg-white/15 border border-white/30 shadow-lg shadow-purple-500/10' : isPro ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-500/50' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sel ? 'bg-white/20 text-white' : isPro ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/50'}`}><MIcon size={20} /></div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${sel ? 'text-white' : isPro ? 'text-amber-300' : 'text-white/70'}`}>{m.name}</span>
                    {isPro && <span className="text-[9px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-full">$1</span>}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isPro ? 'text-amber-300/50' : 'text-white/30'}`}>{m.description}</div>
                </div>
              </button>
            ); })}
          </div>
        </div>

        {/* Topic */}
        <div>
          <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">トークテーマ</h3>
          <div className="relative">
            <PenLine size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder={PLACEHOLDERS[phIdx]}
              className="w-full pl-11 pr-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white placeholder-white/20 border border-white/10 focus:border-white/30 focus:outline-none transition-all text-[15px]" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-5">
        <button onClick={() => canStart && onStart(c1!, c2!, selMode!, topic)} disabled={!canStart}
          className={`w-full py-4.5 rounded-2xl font-black text-lg tracking-wide transition-all duration-200 cursor-pointer active:scale-[0.97] ${canStart ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/25' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}>
          ⚔️ バトル開始！
        </button>
      </div>

      {/* Character Selection Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 animate-fadeIn" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl p-5 pb-10 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">キャラクター{modal}を選択</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"><XIcon size={16} className="text-white/60" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {characters.map((ch, i) => (
                <button key={ch.id} onClick={() => { modal === 1 ? setC1(ch) : setC2(ch); setModal(null); }}
                  className={`bg-gradient-to-br ${COLORS[i % COLORS.length]} p-4 rounded-2xl flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-all`}>
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white">{getIcon(ch.iconName, 32)}</div>
                  <span className="text-white font-bold text-sm">{ch.name}</span>
                  <span className="text-white/60 text-[10px]">{ch.description}</span>
                </button>
              ))}
              <button onClick={() => { setCustomModal(modal); setModal(null); }}
                className="bg-white/5 border-2 border-dashed border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all hover:border-white/40">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white/40"><Sparkles size={32} /></div>
                <span className="text-white/60 font-bold text-sm">自分で作る</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Character Modal */}
      {customModal && (
        <CustomCharModal
          onSave={(ch) => { customModal === 1 ? setC1(ch) : setC2(ch); setCustomModal(null); }}
          onClose={() => setCustomModal(null)}
        />
      )}
    </div>
  );
}

