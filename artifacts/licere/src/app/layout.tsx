import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'Licere',
  description: 'Licere - ambiente de compliance operacional.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
