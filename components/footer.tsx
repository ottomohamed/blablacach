'use client';

import Link from 'next/link';
import { Send, Mail, Shield, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { translateCountryName } from '@/lib/i18n';

export function Footer() {
  const { t, tc } = useLanguage();

  const platformLinks = [
    { href: '/offers', label: t('nav.offers') },
    { href: '/post-offer', label: t('nav.postAnOffer') },
    { href: '/dashboard', label: t('nav.dashboard') },
    { href: '/how-it-works', label: t('nav.howItWorks') },
  ];

  return (
    <footer className="border-t border-border bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Send className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                BlaBla<span className="text-blue-400">Cach</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs">
              {t('footer.desc')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.platform')}</h3>
            <ul className="space-y-2 text-sm">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.corridors')}</h3>
            <ul className="space-y-2 text-sm">
              <li>🇫🇷 {tc('France')} ➡️ 🇩🇿 {tc('Algeria')}</li>
              <li>🇪🇸 {tc('Spain')} ➡️ 🇲🇦 {tc('Morocco')}</li>
              <li>🇧🇪 {tc('Belgium')} ➡️ 🇲🇷 {tc('Mauritania')}</li>
              <li>🇮🇹 {tc('Italy')} ➡️ 🇹🇳 {tc('Tunisia')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.trustSafety')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-green-400 shrink-0" />
                <span>{t('footer.verifiedSystem')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
                <span>{t('footer.refundableFee')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
                <span>support@blablacach.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {t('footer.copyright')}
          </p>
          <p className="text-xs text-slate-500">
            {t('footer.notFinancial')}
          </p>
        </div>
      </div>
    </footer>
  );
}
