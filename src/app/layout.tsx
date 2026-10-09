import type { Metadata } from 'next';
import { AppDataProvider } from '@/lib/AppDataContext';
import '../index.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: 'Licere',
  description: 'Licere - ambiente de compliance e gestão operacional.',
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
    apple: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <AppDataProvider>{children}</AppDataProvider>
      </body>
    </html>
  );
}
