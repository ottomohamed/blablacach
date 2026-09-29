'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Send, Coins, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EXCHANGE_RATES } from '@/lib/data';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { translateCountryName } from '@/lib/i18n';

function Ticker() {
  const { locale, tc } = useLanguage();
  const items = [...EXCHANGE_RATES, ...EXCHANGE_RATES];
  return (
    <div className="ticker-container relative overflow-hidden bg-slate-900 text-white py-2 border-b border-slate-800">
      <div className="flex whitespace-nowrap animate-ticker">
        {items.map((r, i) => (
          <div key={i} className="inline-flex items-center gap-2 px-6 text-sm font-medium">
            <span className="text-lg">{r.sourceFlag}</span>
            <span className="text-slate-400">{translateCountryName(locale, r.source)}</span>
            <span className="text-blue-400">➡️</span>
            <span className="text-lg">{r.targetFlag}</span>
            <span className="text-slate-400">{translateCountryName(locale, r.target)}</span>
            <span className="ml-1 text-white font-semibold">
              1 EUR = {r.rate} {r.currency}
            </span>
            <span className="ml-3 text-slate-600">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const { t } = useLanguage();
  const { user, credits, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/offers', label: t('nav.offers') },
    { href: '/post-offer', label: t('nav.postOffer') },
    { href: '/how-it-works', label: t('nav.howItWorks') },
    { href: '/dashboard', label: t('nav.dashboard') },
  ];

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Send className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                BlaBla<span className="text-primary">Cach</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname === link.href
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher />
              {user ? (
                <>
                  <Link href="/buy-credits">
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{credits}</span>
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={signOut} className="gap-1.5">
                    <LogOut className="h-4 w-4" />
                    {t('auth.signOut')}
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button size="sm" variant="ghost" className="gap-1.5">
                    <User className="h-4 w-4" />
                    {t('nav.login')}
                  </Button>
                </Link>
              )}
              <Link href="/post-offer">
                <Button size="sm">{t('nav.postAnOffer')}</Button>
              </Link>
            </div>

            <div className="flex md:hidden items-center gap-1">
              <LanguageSwitcher />
              <button
                className="p-2"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                    pathname === link.href
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/buy-credits" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                    <Coins className="h-4 w-4 text-primary" />
                    {t('nav.buyCredits')} ({credits})
                  </Link>
                  <button onClick={() => { signOut(); setOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted w-full text-left">
                    <LogOut className="h-4 w-4" />
                    {t('auth.signOut')}
                  </button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                  <User className="h-4 w-4" />
                  {t('nav.login')}
                </Link>
              )}
              <Link href="/post-offer" onClick={() => setOpen(false)} className="mt-2">
                <Button size="sm" className="w-full">{t('nav.postAnOffer')}</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
      <Ticker />
    </header>
  );
}
