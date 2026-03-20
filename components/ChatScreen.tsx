'use client';
import { useState, useEffect, useRef } from 'react';
import { Character, Mode, Message } from '@/types';
import { ArrowLeft, Flame, Snowflake, Users, Crown, Bot, Briefcase, Theater, Scale } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ICONS: Record<string, any> = { Flame, Snowflake, Users, Crown, Bot, Briefcase, Theater, Scale };
const BG = ['bg-red-500','bg-blue-500','bg-amber-500','bg-purple-500','bg-slate-500','bg-emerald-500','bg-pink-500','bg-orange-500'];
import { characters } from '@/data/characters';

const MAX_ROUNDS = 10;

interface Props { character1: Character; character2: Character; mode: Mode; topic: string; onComplete: (h: any[]) => void; onBack: () => void; }

export default function ChatScreen({ character1, character2, mode, topic, onComplete, onBack }: Props) {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<{ character: Character; content: string; round: number }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streaming, setStreaming] = useState('');
  const [currentRound, setCurrentRound] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  const getIcon = (ch: Character, size = 20) => { const I = ICONS[ch.iconName || 'Users'] || Users; return <I size={size} />; };
  const getBg = (ch: Character) => BG[characters.findIndex(c => c.id === ch.id) % BG.length];

  // Only auto-scroll when a NEW message is being typed (streaming), not when reading back
  useEffect(() => { if (isTyping) { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); } }, [streaming, isTyping]);

  useEffect(() => {
    if (fetchingRef.current) return;
    if (messages.length >= MAX_ROUNDS * 2) { return; }
    fetchingRef.current = true;
    const speaker = messages.length % 2 === 0 ? character1 : character2;
    const round = Math.floor(messages.length / 2) + 1;
    setCurrentRound(round);
    setIsTyping(true);
    setStreaming('');

    (async () => {
      try {
        const apiMessages: Message[] = messages.map((m, i) => ({ id: String(i), character: m.character, content: m.content, timestamp: new Date() }));
        const res = await fetch('/api/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character1, character2, mode, topic, history: apiMessages, currentSpeaker: speaker, sessionId: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('session_id') || undefined : undefined }),
        });
        if (!res.ok) throw new Error('API error');
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let text = '';
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            for (const line of chunk.split('\n')) {
              if (line.startsWith('data: ')) {
                const d = line.slice(6);
                if (d === '[DONE]') continue;
                try { const p = JSON.parse(d); if (p.content) { text += p.content; setStreaming(text); } } catch {}
              }
            }
          }
        }
        setMessages(prev => [...prev, { character: speaker, content: text, round }]);
      } catch (e) { console.error(e); }
      finally { setIsTyping(false); setStreaming(''); fetchingRef.current = false; }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const isLeft = (ch: Character) => ch.id === character1.id;

  return (
    <div className="h-full flex flex-col bg-stone-100">
      {/* Nav */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"><ArrowLeft size={20} className="text-gray-600" /></button>
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className={`w-7 h-7 rounded-full ${getBg(character1)} flex items-center justify-center text-white`}>{getIcon(character1, 14)}</div>
            <span className="text-[11px] font-bold text-gray-400">VS</span>
            <div className={`w-7 h-7 rounded-full ${getBg(character2)} flex items-center justify-center text-white`}>{getIcon(character2, 14)}</div>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[200px] mx-auto">{topic}</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => {
          const left = isLeft(msg.character);
          return (
            <div key={i} className={`flex ${left ? 'justify-start' : 'justify-end'} gap-2 animate-fadeIn`}>
              {left && <div className={`w-10 h-10 rounded-full ${getBg(msg.character)} flex items-center justify-center text-white shrink-0 mt-5`}>{getIcon(msg.character, 18)}</div>}
              <div className={`max-w-[75%] ${left ? '' : 'order-first'}`}>
                {left && <p className="text-[11px] text-gray-400 mb-1 ml-1">{msg.character.name}</p>}
                <div className={`px-4 py-2.5 text-[15px] leading-relaxed ${left ? 'bg-white rounded-[20px] rounded-tl-[4px] shadow-sm text-gray-800' : 'bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[20px] rounded-tr-[4px] text-white'}`}>
                  {msg.content}
                </div>
                <p className={`text-[10px] text-gray-300 mt-1 ${left ? 'ml-1' : 'mr-1 text-right'}`}>{lang === 'ja' ? `第${msg.round}話` : `Round ${msg.round}`}</p>
              </div>
              {!left && <div className={`w-10 h-10 rounded-full ${getBg(msg.character)} flex items-center justify-center text-white shrink-0 mt-1`}>{getIcon(msg.character, 18)}</div>}
            </div>
          );
        })}

        {/* Streaming */}
        {isTyping && streaming && (() => {
          const speaker = messages.length % 2 === 0 ? character1 : character2;
          const left = isLeft(speaker);
          return (
            <div className={`flex ${left ? 'justify-start' : 'justify-end'} gap-2`}>
              {left && <div className={`w-10 h-10 rounded-full ${getBg(speaker)} flex items-center justify-center text-white shrink-0 mt-5`}>{getIcon(speaker, 18)}</div>}
              <div className="max-w-[75%]">
                {left && <p className="text-[11px] text-gray-400 mb-1 ml-1">{speaker.name}</p>}
                <div className={`px-4 py-2.5 text-[15px] leading-relaxed ${left ? 'bg-white rounded-[20px] rounded-tl-[4px] shadow-sm text-gray-800' : 'bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[20px] rounded-tr-[4px] text-white'}`}>
                  {streaming}<span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />
                </div>
              </div>
              {!left && <div className={`w-10 h-10 rounded-full ${getBg(speaker)} flex items-center justify-center text-white shrink-0 mt-1`}>{getIcon(speaker, 18)}</div>}
            </div>
          );
        })()}

        {/* Typing indicator */}
        {isTyping && !streaming && (
          <div className="flex justify-start gap-2">
            <div className={`w-10 h-10 rounded-full ${getBg(messages.length % 2 === 0 ? character1 : character2)} flex items-center justify-center text-white shrink-0`}>
              {getIcon(messages.length % 2 === 0 ? character1 : character2, 18)}
            </div>
            <div className="bg-white rounded-full px-4 py-3 shadow-sm flex gap-1.5">
              {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-gray-300 rounded-full" style={{ animation: `bounce1 1.4s ${i * 0.2}s infinite ease-in-out both` }} />)}
            </div>
          </div>
        )}

        {/* End section - inline in chat */}
        {messages.length >= MAX_ROUNDS * 2 && !isTyping && (
          <div className="mt-6 mb-4 animate-fadeIn">
            <div className="text-center mb-4">
              <span className="text-2xl">🎉</span>
              <p className="text-gray-500 font-semibold text-sm mt-1">{lang === 'ja' ? 'バトル終了！' : 'Battle Complete!'}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className={`w-10 h-10 rounded-full ${getBg(character1)} flex items-center justify-center text-white`}>{getIcon(character1, 18)}</div>
                <span className="text-xs font-bold text-gray-400">VS</span>
                <div className={`w-10 h-10 rounded-full ${getBg(character2)} flex items-center justify-center text-white`}>{getIcon(character2, 18)}</div>
              </div>
              <p className="text-center text-gray-500 text-xs">{topic} · {messages.length} {t.messages}</p>
              <button onClick={() => {
                const pick1 = messages.filter(m => m.character.id === character1.id).slice(-1)[0];
                const pick2 = messages.filter(m => m.character.id === character2.id).slice(-1)[0];
                const q1 = pick1 ? `${character1.name}「${pick1.content.slice(0, 60)}${pick1.content.length > 60 ? '…' : ''}」` : '';
                const q2 = pick2 ? `${character2.name}「${pick2.content.slice(0, 60)}${pick2.content.length > 60 ? '…' : ''}」` : '';
                const text = lang === 'ja'
                  ? `🗣️ ${character1.name} vs ${character2.name}\nテーマ: ${topic}\n\n${q1}\n${q2}\n\n👉 https://ai-talk-battle.onrender.com?lang=ja\nby @cody_labs_ai\n#AIトークバトル`
                  : `🗣️ ${character1.name} vs ${character2.name}\nTopic: ${topic}\n\n${q1}\n${q2}\n\n👉 https://ai-talk-battle.onrender.com\nby @cody_labs_ai\n#AITalkBattle`;
                const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                window.open(xUrl, '_blank');
              }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-transform">
                {t.shareOnX}
              </button>
              <a href="https://buy.stripe.com/eVqeVc5PNfeb7ke6HYcMM02" target="_blank" rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.97] transition-all hover:bg-gray-100 block">
                {t.tipJar}
              </a>
              <button onClick={onBack}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-transform">
                {t.playAgain}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
