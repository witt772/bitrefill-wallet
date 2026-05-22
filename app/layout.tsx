import './globals.css';

export const metadata = {
  title: 'imToken 10th AI Assistant',
  description: 'Bitrefill Wallet Commerce Assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className="dark">
      <body className="bg-slate-900 text-slate-100 min-h-screen">{children}</body>
    </html>
  );
}
