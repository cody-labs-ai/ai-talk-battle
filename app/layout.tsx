import type { Metadata } from 'next';
import { Righteous, Poppins } from 'next/font/google';
import './globals.css';

const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-righteous',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'AIトークバトル',
  description: 'AIキャラクター同士のリアルタイムトークバトル',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${righteous.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
