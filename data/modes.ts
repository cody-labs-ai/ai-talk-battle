import { Mode } from '@/types';

export const modes: Mode[] = [
  {
    id: 'heated-argument',
    emoji: '🔥',
    name: 'ガチ口喧嘩',
    description: 'Heated argument - aggressive, personal attacks OK',
    rules: '激しい口論モード。必ず相手と対立し、感情的に攻撃する。相手の意見を全否定し、自分の主張を押し通す。皮肉、煽り、大げさな表現を使ってOK。絶対に同意しない。',
  },
  {
    id: 'serious-debate',
    emoji: '🎓',
    name: '真面目ディベート',
    description: 'Serious debate - logical, with evidence',
    rules: '真面目な討論モード。必ず相手と対立する立場を取ること。相手が賛成なら反対、反対なら賛成の立場で論理的に反論する。同意してはいけない。データや根拠を示しながら相手の主張を論破することを目指す。',
  },
  {
    id: 'business-brainstorm',
    emoji: '💡',
    name: 'ビジネス壁打ち',
    description: "Business brainstorm - build on each other's ideas",
    rules: 'ビジネスアイデア出しモード。お互いのアイデアを発展させ、「それいいね！」「さらに〜したら」と前向きに積み上げます。批判ではなく、建設的な提案を重視。',
  },
  {
    id: 'comedy-duo',
    emoji: '😂',
    name: '漫才',
    description: 'Comedy duo - one does boke, one does tsukkomi',
    rules: '漫才モード。一人がボケ、もう一人がツッコミ。テンポよく、面白く、観客を笑わせることを目指します。「なんでやねん！」「ちゃうやろ！」などのツッコミを活用。',
  },
  {
    id: 'love-advice',
    emoji: '💕',
    name: '恋愛相談',
    description: 'Love advice - give opposite advice',
    rules: '恋愛相談モード。二人は正反対のアドバイスをします。一人は積極的に攻める派、もう一人は慎重に待つ派。相談者（架空）を想定して助言します。',
  },
  {
    id: 'pro-brainstorm',
    emoji: '🧠',
    name: 'ビジネス壁打ち Pro',
    description: '高性能AI（Claude Opus）による深い議論・壁打ち',
    rules: 'ビジネスアイデアの壁打ちモード。相手のアイデアを深く分析し、鋭い質問、リスク指摘、改善提案を行う。表面的な同意はしない。投資家・経営者の視点で本質を突く。',
  },
];
