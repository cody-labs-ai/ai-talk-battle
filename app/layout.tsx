import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIトークバトル - AI Talk Battle",
  description: "2体のAIキャラクターが様々なテーマで熱く語り合うエンターテイメントアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#FFF1F2' }}>
        {children}
      </body>
    </html>
  );
}
