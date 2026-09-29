import type { Metadata } from 'next';
import { AppDataProvider } from '@/lib/AppDataContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
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
      <body suppressHydrationWarning>
        <AppDataProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AppDataProvider>
      </body>
    </html>
  );
}
