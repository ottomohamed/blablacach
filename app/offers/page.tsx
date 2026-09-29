'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, XCircle } from 'lucide-react';
import { SearchBar } from '@/components/search-bar';
import { OfferCard } from '@/components/offer-card';
import { BookingModal } from '@/components/booking-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Offer } from '@/lib/data';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/language-context';
import { translateCountryName } from '@/lib/i18n';

function OffersContent() {
  const { offers, filters, setFilters } = useStore();
  const { locale, t, tc } = useLanguage();
  const searchParams = useSearchParams();
  const [bookingOffer, setBookingOffer] = useState<Offer | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const filtered = useMemo(() => {
    let result = [...offers];
    if (filters.sourceCountry) result = result.filter((o) => o.sourceCountry === filters.sourceCountry);
    if (filters.targetCountry) result = result.filter((o) => o.targetCountry === filters.targetCountry);
    if (filters.targetCity) result = result.filter((o) => o.targetCity === filters.targetCity);
    if (filters.amount) {
      const amt = parseFloat(filters.amount);
      result = result.filter((o) => o.availableAmount >= amt);
    }

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'rate') result.sort((a, b) => b.rate - a.rate);
    else if (sortBy === 'deals') result.sort((a, b) => b.totalDeals - a.totalDeals);

    return result;
  }, [offers, filters, sortBy]);

  const handleBook = (offer: Offer) => {
    setBookingOffer(offer);
    setBookingOpen(true);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasFilters = filters.sourceCountry || filters.targetCountry || filters.targetCity || filters.amount;

  const foundText = filtered.length === 1
    ? t('offers.found', { count: String(filtered.length) })
    : t('offers.foundPlural', { count: String(filtered.length) });
  const filterText = hasFilters ? t('offers.foundFiltered') : t('offers.foundAll');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{t('offers.title')}</h1>
        <p className="text-muted-foreground">
          {foundText}{filterText}
        </p>
      </div>

      <div className="mb-6">
        <SearchBar variant="inline" />
      </div>

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{t('offers.sortBy')}</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">{t('offers.topRated')}</SelectItem>
              <SelectItem value="rate">{t('offers.bestRate')}</SelectItem>
              <SelectItem value="deals">{t('offers.mostDeals')}</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground" onClick={clearFilters}>
              <XCircle className="h-3.5 w-3.5" />
              {t('offers.clearFilters')}
            </Button>
          )}
        </div>

        {hasFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {filters.sourceCountry && <Badge variant="secondary">{t('offers.fromBadge', { country: translateCountryName(locale, filters.sourceCountry) })}</Badge>}
            {filters.targetCountry && <Badge variant="secondary">{t('offers.toBadge', { country: translateCountryName(locale, filters.targetCountry) })}</Badge>}
            {filters.targetCity && <Badge variant="secondary">{t('offers.cityBadge', { city: filters.targetCity })}</Badge>}
            {filters.amount && <Badge variant="secondary">{t('offers.minBadge', { amount: filters.amount, currency: filters.currency ?? 'EUR' })}</Badge>}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('offers.noOffers')}</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {t('offers.noOffersDesc')}
          </p>
          <Button variant="outline" onClick={clearFilters}>{t('offers.clearAll')}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onBook={handleBook} />
          ))}
        </div>
      )}

      <BookingModal
        offer={bookingOffer}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}

export default function OffersPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">{t('offers.loading')}</div>}>
      <OffersContent />
    </Suspense>
  );
}
