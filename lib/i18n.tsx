'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'ja' | 'en';

const translations = {
  ja: {
    // Setup
    setupTitle: 'AI トークバトル',
    setupSubtitle: 'AIキャラ同士のガチ会話を観戦しよう',
    selectChar1: 'キャラ1を選択',
    selectChar2: 'キャラ2を選択',
    selectMode: 'モードを選択',
    topicLabel: 'トークテーマ',
    topicPlaceholder: 'テーマを入力（空欄ならAIが決めます）',
    startBattle: 'バトル開始！',
    customCreate: 'カスタムキャラ作成',
    charName: 'キャラ名',
    charNamePlaceholder: '例：ツンデレ幼馴染',
    charPersonality: '性格・口調の設定',
    charPersonalityOptional: '（任意）',
    charPersonalityPlaceholder: '空欄なら名前から自動で性格を推測します',
    create: '作成',
    proBrainstorm: 'ビジネス壁打ち Pro',
    proBrainstormDesc: '最高性能AI（Claude Opus）による深い議論・壁打ち',
    // Chat
    round: 'ラウンド',
    messages: 'メッセージ',
    battleEnd: '🎉 バトル終了！',
    shareOnX: 'Xでシェア',
    tipJar: '☕ このサービスは無料でいくらでも遊んでいただけますが、もし面白かったら、コーヒー代をいただけますと励みになります',
    playAgain: 'もう一度バトル',
    // Share
    shareTheme: 'テーマ',
    shareBy: 'by',
    // Result
    talkTheme: 'トークテーマ',
    mode: 'モード',
    // Modes
    heatedArgument: '口喧嘩',
    heatedArgumentDesc: '相手を論破せよ！激しいバトルモード',
    seriousDebate: '真面目な議論',
    seriousDebateDesc: '論理的に意見をぶつけ合う',
    businessBrainstorm: 'ビジネスブレスト',
    businessBrainstormDesc: 'アイデアを出し合って発展させる',
    comedyDuo: '漫才・コント',
    comedyDuoDesc: 'ボケとツッコミの掛け合い',
    loveAdvice: '恋愛相談',
    loveAdviceDesc: '恋の悩みにアドバイス対決',
    // Characters
    descPhilosopher: '古代ギリシャの哲学者。問答法で真理を追求する。',
    descDragon: '古の竜。人間を見下しつつも知恵を授ける。',
    descIdol: '元気いっぱいのアイドル。テンション高め。',
    descSamurai: '戦国時代の武将。義と誇りを重んじる。',
    descAI: '超高性能AI。論理的で感情を理解しようとする。',
    descCEO: 'スタートアップCEO。成長とイノベーションに執着。',
    descActor: '大げさな演技派俳優。すべてをドラマチックに。',
    descJudge: '厳格な裁判官。公正さと法を重んじる。',
    // Character names
    charHotbloodedTeacher: '熱血教師',
    charCoolScientist: '冷静な科学者',
    charOsakaAuntie: '関西のおばちゃん',
    charChuunibyou: '中二病の高校生',
    charSeriousAI: '真面目すぎるAI',
    charWokeEntrepreneur: '意識高い系起業家',
    charShakespearean: 'シェイクスピア風',
    charDevilsAdvocate: '悪魔の弁護士',
    // Character descriptions
    charDescHotbloodedTeacher: '情熱的で声が大きい。若者を熱く指導する',
    charDescCoolScientist: '論理的で冷静。データと事実を重視する',
    charDescOsakaAuntie: '明るくおせっかい。関西弁で温かく話す',
    charDescChuunibyou: '厨二病全開。「闇の力」を信じてる',
    charDescSeriousAI: '規則厳守で形式的。冗談が通じない',
    charDescWokeEntrepreneur: '横文字多用。イノベーションが口癖',
    charDescShakespearean: '古典的で詩的。演劇的な表現が得意',
    charDescDevilsAdvocate: '常に反対意見。挑発的で皮肉屋',
  },
  en: {
    setupTitle: 'AI Talk Battle',
    setupSubtitle: 'Watch AI characters have real conversations',
    selectChar1: 'Select Character 1',
    selectChar2: 'Select Character 2',
    selectMode: 'Select Mode',
    topicLabel: 'Topic',
    topicPlaceholder: 'Enter a topic (leave blank for AI to decide)',
    startBattle: 'Start Battle!',
    customCreate: 'Create Custom Character',
    charName: 'Character Name',
    charNamePlaceholder: 'e.g. Elon Musk',
    charPersonality: 'Personality & Speaking Style',
    charPersonalityOptional: '(optional)',
    charPersonalityPlaceholder: 'Leave blank to auto-detect from name',
    create: 'Create',
    proBrainstorm: 'Business Brainstorm Pro',
    proBrainstormDesc: 'Deep discussion powered by Claude Opus',
    round: 'Round',
    messages: 'messages',
    battleEnd: '🎉 Battle Complete!',
    shareOnX: 'Share on X',
    tipJar: '☕ This app is 100% free. If you enjoyed it, buy me a coffee!',
    playAgain: 'Battle Again',
    shareTheme: 'Topic',
    shareBy: 'by',
    talkTheme: 'Topic',
    mode: 'Mode',
    heatedArgument: 'Heated Argument',
    heatedArgumentDesc: 'Destroy your opponent! Intense battle mode',
    seriousDebate: 'Serious Debate',
    seriousDebateDesc: 'Clash opinions with logic',
    businessBrainstorm: 'Business Brainstorm',
    businessBrainstormDesc: 'Generate and develop ideas together',
    comedyDuo: 'Comedy Duo',
    comedyDuoDesc: 'Back-and-forth comedy routine',
    loveAdvice: 'Love Advice',
    loveAdviceDesc: 'Dueling advice on matters of the heart',
    descPhilosopher: 'Ancient Greek philosopher. Pursues truth through dialogue.',
    descDragon: 'Ancient dragon. Looks down on humans but shares wisdom.',
    descIdol: 'Energetic idol. Always high tension.',
    descSamurai: 'Feudal warlord. Values honor and pride.',
    descAI: 'Super AI. Logical, trying to understand emotions.',
    descCEO: 'Startup CEO. Obsessed with growth and innovation.',
    descActor: 'Dramatic actor. Makes everything theatrical.',
    descJudge: 'Strict judge. Values fairness and the law.',
    charHotbloodedTeacher: 'Hot-Blooded Teacher',
    charCoolScientist: 'Cool Scientist',
    charOsakaAuntie: 'Osaka Auntie',
    charChuunibyou: 'Edgy Teenager',
    charSeriousAI: 'Overly Serious AI',
    charWokeEntrepreneur: 'Hustle Bro CEO',
    charShakespearean: 'Shakespearean Actor',
    charDevilsAdvocate: "Devil's Advocate",
    charDescHotbloodedTeacher: 'Passionate & loud. Motivates with fire',
    charDescCoolScientist: 'Logical & calm. Only trusts data',
    charDescOsakaAuntie: 'Cheerful & nosy. Speaks Osaka dialect',
    charDescChuunibyou: 'Full cringe. Believes in "dark powers"',
    charDescSeriousAI: 'Rule-follower. Cannot take a joke',
    charDescWokeEntrepreneur: 'Buzzword machine. "Synergy" is life',
    charDescShakespearean: 'Poetic & dramatic. Speaks in verse',
    charDescDevilsAdvocate: 'Always disagrees. Provocative & sarcastic',
  },
} as const;

type Translations = typeof translations['ja'];

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const I18nContext = createContext<I18nCtx>({ lang: 'ja', setLang: () => {}, t: translations.ja as Translations });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ja');

  useEffect(() => {
    // Priority: URL param > localStorage > browser language
    const urlLang = new URLSearchParams(window.location.search).get('lang') as Lang;
    if (urlLang === 'ja' || urlLang === 'en') {
      setLangState(urlLang);
      localStorage.setItem('lang', urlLang);
    } else {
      const saved = localStorage.getItem('lang') as Lang;
      if (saved && (saved === 'ja' || saved === 'en')) {
        setLangState(saved);
      } else if (!navigator.language.startsWith('ja')) {
        setLangState('en');
      }
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] as Translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() { return useContext(I18nContext); }

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors text-sm"
      title={lang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
    >
      {lang === 'ja' ? '🇺🇸' : '🇯🇵'}
    </button>
  );
}
