import { Mode } from '@/types';

export const modes: Mode[] = [
  {
    id: 'heated-argument',
    emoji: '🔥',
    name: 'ガチ口喧嘩',
    description: 'Heated argument - aggressive, personal attacks OK',
    rules: '激しい口論モード。感情的になり、相手を攻撃してもOK。人格否定もあり。ただし、実際の暴力や違法行為の推奨はNG。',
  },
  {
    id: 'serious-debate',
    emoji: '🎓',
    name: '真面目ディベート',
    description: 'Serious debate - logical, with evidence',
    rules: '真面目な討論モード。論理的に、証拠やデータを示しながら議論します。相手を尊重し、感情的にならず、建設的な議論を目指します。',
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
];
