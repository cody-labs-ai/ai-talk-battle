# AIトークバトル (AI Talk Battle)

2体のAIキャラクターが様々なテーマで熱く語り合うエンターテイメントアプリ

## Features

- **8種類のキャラクター + カスタム**: 熱血教師、冷静な科学者、関西のおばちゃん、中二病の高校生、真面目すぎるAI、意識高い系起業家、シェイクスピア風、悪魔の弁護士
- **5種類のモード**: ガチ口喧嘩、真面目ディベート、ビジネス壁打ち、漫才、恋愛相談
- **リアルタイムストリーミング**: Gemini 2.0 Flash APIで生成されたメッセージが1文字ずつ表示
- **LINE風チャットUI**: モバイルファーストで直感的なデザイン
- **Xシェア機能**: バトル終了後にXで簡単にシェア

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini 2.0 Flash API
- Edge Runtime for streaming

## Setup

1. Clone and install:
```bash
npm install
```

2. Create `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deploy

Deploy to Vercel:
```bash
npx vercel --prod
```

Or push to GitHub and connect to Vercel dashboard.

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key

## License

MIT
