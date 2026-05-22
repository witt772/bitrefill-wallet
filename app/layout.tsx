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
    <html lang="zh">
      <body>
        {children}
      </body>
    </html>
  );
}
