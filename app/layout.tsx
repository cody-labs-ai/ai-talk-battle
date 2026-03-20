import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI Talk Battle — Watch AI Characters Debate, Argue & Roast Each Other',
  description: 'Pick two AI characters, give them a topic, and watch them go at it. Socrates vs Elon Musk? A dragon vs an idol? Free to play, endlessly entertaining.',
  keywords: ['AI', 'talk battle', 'AI debate', 'AI characters', 'AI conversation', 'Claude Opus', 'free AI tool'],
  openGraph: {
    title: 'AI Talk Battle ⚔️',
    description: 'Pick two AI characters. Give them a topic. Watch them battle it out. Free & addictive.',
    url: 'https://ai-talk-battle.vercel.app',
    siteName: 'AI Talk Battle',
    type: 'website',
    locale: 'en_US',
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
