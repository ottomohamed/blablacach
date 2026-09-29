import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { StoreProvider } from '@/lib/store';
import { LanguageProvider } from '@/lib/language-context';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster as Sonner } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BlaBlaCach — P2P Cash Exchange Marketplace',
  description:
    'BlaBlaCach connects senders in Europe with trusted merchants in North Africa for cash-to-cash exchange. Find the best rates, post offers, and trade safely.',
  openGraph: {
    title: 'BlaBlaCach — P2P Cash Exchange Marketplace',
    description:
      'The trusted P2P marketplace connecting European senders with North African merchants for cash exchange.',
    url: 'https://blablacach.com',
    siteName: 'BlaBlaCach',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <StoreProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Sonner position="top-center" />
            </StoreProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
