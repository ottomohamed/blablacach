'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import {
  Search, Handshake, Star, ShieldCheck, Wallet, RotateCcw,
  BadgeCheck, AlertTriangle, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BanWarning } from '@/components/ban-warning';
import { useLanguage } from '@/lib/language-context';

function renderRichText(text: string): React.ReactNode {
  const parts = text.split(/(<b>.*?<\/b>)/g);
  return parts.map((part, i) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return <span key={i} className="font-bold text-red-700">{part.slice(3, -4)}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    { icon: Search, title: t('how.step1Title'), desc: t('how.step1Desc') },
    { icon: Wallet, title: t('how.step2Title'), desc: t('how.step2Desc') },
    { icon: Handshake, title: t('how.step3Title'), desc: t('how.step3Desc') },
    { icon: Star, title: t('how.step4Title'), desc: t('how.step4Desc') },
  ];

  const faq = [
    { q: t('how.faq1q'), a: t('how.faq1a') },
    { q: t('how.faq2q'), a: t('how.faq2a') },
    { q: t('how.faq3q'), a: t('how.faq3a') },
    { q: t('how.faq4q'), a: t('how.faq4a') },
  ];

  const trustCards = [
    { icon: BadgeCheck, title: t('how.verifiedMerchants'), desc: t('how.verifiedMerchantsDesc') },
    { icon: RotateCcw, title: t('how.refundableFee'), desc: t('how.refundableFeeDesc') },
    { icon: AlertTriangle, title: t('how.newMerchantWarning'), desc: t('how.newMerchantWarningDesc') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t('how.simpleSafe')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            {t('how.title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            {t('how.desc')}
          </p>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-800 mb-1">{t('ban.title')}</p>
            <p className="text-sm text-red-700 leading-relaxed">
              {renderRichText(t('ban.message'))}
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex flex-col items-center shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <step.icon className="h-7 w-7" />
                </div>
                {i < steps.length - 1 && <div className="w-px h-12 bg-border mt-2" />}
              </div>
              <div className="pt-2 pb-6">
                <p className="text-sm font-mono text-primary mb-1">{t('how.step')} {i + 1}</p>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">{t('how.trustSafety')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustCards.map((card, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <card.icon className="h-8 w-8 text-success mb-3" />
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-400">{card.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-10">{t('how.faq')}</h2>
        <div className="space-y-4">
          {faq.map((item, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2 flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  {item.q}
                </h3>
                <p className="text-sm text-muted-foreground pl-7">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 mx-auto max-w-3xl px-4 text-center">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">{t('how.ready')}</h2>
          <p className="text-blue-100 mb-6">{t('how.findBestRates')}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/offers"><Button size="lg" variant="secondary" className="gap-2">{t('how.findOffers')} <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/post-offer"><Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white gap-2">{t('how.postAnOffer')} <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
