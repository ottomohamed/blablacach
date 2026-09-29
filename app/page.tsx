'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Users, TrendingUp, Globe2, ArrowRight, BadgeCheck, Wallet, Star, Search,
} from 'lucide-react';
import { SearchBar } from '@/components/search-bar';
import { OfferCard } from '@/components/offer-card';
import { BookingModal } from '@/components/booking-modal';
import { BanWarning } from '@/components/ban-warning';
import { Button } from '@/components/ui/button';
import type { Offer } from '@/lib/data';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/language-context';

function StatCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const { offers } = useStore();
  const { t } = useLanguage();
  const [bookingOffer, setBookingOffer] = useState<Offer | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const featured = offers.slice(0, 6);

  const handleBook = (offer: Offer) => {
    setBookingOffer(offer);
    setBookingOpen(true);
  };

  const steps = [
    { step: '01', title: t('home.step1Title'), desc: t('home.step1Desc'), icon: Search },
    { step: '02', title: t('home.step2Title'), desc: t('home.step2Desc'), icon: Wallet },
    { step: '03', title: t('home.step3Title'), desc: t('home.step3Desc'), icon: Star },
  ];

  return (
    <div>
      <BanWarning variant="banner" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('home.trustedP2P')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              {t('home.heroTitle')} <span className="text-primary">{t('home.heroTitleHighlight')}</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              {t('home.heroSubtitle')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <SearchBar variant="hero" />
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <StatCard icon={Users} value="12,000+" label={t('home.activeUsers')} />
            <StatCard icon={TrendingUp} value="€4.2M" label={t('home.exchanged')} />
            <StatCard icon={Globe2} value="5" label={t('home.corridors')} />
            <StatCard icon={BadgeCheck} value="98%" label={t('home.successRate')} />
          </div>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('home.featuredOffers')}</h2>
            <p className="mt-1 text-muted-foreground">{t('home.featuredDesc')}</p>
          </div>
          <Link href="/offers" className="hidden sm:block">
            <Button variant="outline" className="gap-2">
              {t('home.viewAll')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onBook={handleBook} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/offers">
            <Button variant="outline" className="gap-2">
              {t('home.viewAllOffers')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it Works preview */}
      <section className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">{t('home.howItWorks')}</h2>
            <p className="mt-2 text-slate-400">{t('home.threeSteps')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-mono text-primary mb-1">{item.step}</p>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/how-it-works">
              <Button variant="outline" className="bg-transparent border-slate-600 text-white hover:bg-slate-800 hover:text-white gap-2">
                {t('home.learnMore')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">{t('home.areYouMerchant')}</h2>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
            {t('home.merchantDesc')}
          </p>
          <Link href="/post-offer" className="inline-block mt-6">
            <Button size="lg" variant="secondary" className="gap-2">
              {t('home.postFirstOffer')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-6 max-w-3xl mx-auto">
          <BanWarning variant="dismissible" />
        </div>
      </section>

      <BookingModal
        offer={bookingOffer}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
