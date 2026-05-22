import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bitrefill Wallet Assistant',
  description: 'imToken + Bitrefill 钱包电商助手',
  icons: { favicon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
