import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI Talk Battle ⚔️ AIキャラ同士のガチ会話バトル',
  description: 'Pick two AI characters, give them a topic, and watch them battle. AIキャラを選んでバトル観戦。Free to play. 無料で遊べる。',
  keywords: ['AI', 'talk battle', 'AI debate', 'AI characters', 'Claude Opus', 'free AI tool', 'AIトークバトル'],
  alternates: {
    languages: { 'ja': '/?lang=ja', 'en': '/?lang=en' },
  },
  openGraph: {
    title: 'AI Talk Battle ⚔️',
    description: 'Pick two AI characters. Give them a topic. Watch them battle it out. Free & addictive.',
    url: 'https://ai-talk-battle.vercel.app',
    siteName: 'AI Talk Battle',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ja_JP',
    images: [{ url: 'https://ai-talk-battle.vercel.app/api/og', width: 1200, height: 630, alt: 'AI Talk Battle' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Talk Battle ⚔️',
    description: 'Pick two AI characters. Give them a topic. Watch them battle it out.',
    images: ['https://ai-talk-battle.vercel.app/api/og'],
    creator: '@cody_labs_ai',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
