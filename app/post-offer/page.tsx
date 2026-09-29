'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { EUROPEAN_COUNTRIES, NORTH_AFRICAN_COUNTRIES } from '@/lib/data';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/language-context';
import { translateCountryName } from '@/lib/i18n';
import { toast } from 'sonner';

const CURRENCY_MAP: Record<string, string> = {
  Morocco: 'MAD', Algeria: 'DZD', Mauritania: 'MRU', Tunisia: 'TND', Libya: 'LYD',
};

export default function PostOfferPage() {
  const router = useRouter();
  const { addOffer, getMerchantOffers } = useStore();
  const { locale, t, tc } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [sourceCountry, setSourceCountry] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [rate, setRate] = useState('');
  const [availableAmount, setAvailableAmount] = useState('');
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [notes, setNotes] = useState('');

  const targetCountryData = NORTH_AFRICAN_COUNTRIES.find((c) => c.name === targetCountry);
  const targetCurrency = targetCountry ? CURRENCY_MAP[targetCountry] : '';
  const myOffers = getMerchantOffers('m-001');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceCountry || !targetCountry || !targetCity || !rate || !availableAmount) {
      toast.error(t('post.pleaseFill'));
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      addOffer({
        sourceCountry,
        sourceFlag: EUROPEAN_COUNTRIES.find((c) => c.name === sourceCountry)?.flag ?? '',
        targetCountry,
        targetFlag: targetCountryData?.flag ?? '',
        targetCity,
        rate: parseFloat(rate),
        targetCurrency: targetCurrency,
        availableAmount: parseFloat(availableAmount),
        currency,
        notes: notes.trim() || undefined,
      });
      setSubmitting(false);
      setSuccess(true);
      toast.success(t('post.offerPostedSuccess'));
      setTimeout(() => router.push('/dashboard'), 1500);
    }, 1000);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t('post.posted')}</h1>
        <p className="text-muted-foreground">{t('post.redirecting')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('post.title')}</h1>
        <p className="mt-1 text-muted-foreground">
          {t('post.desc')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            {t('post.offerDetails')}
          </CardTitle>
          <CardDescription>{t('post.fillIn')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">{t('post.sourceCountry')}</Label>
                <Select value={sourceCountry} onValueChange={setSourceCountry}>
                  <SelectTrigger id="source"><SelectValue placeholder={t('post.selectCountry')} /></SelectTrigger>
                  <SelectContent>
                    {EUROPEAN_COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.name}>{c.flag} {translateCountryName(locale, c.name)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">{t('post.targetCountry')}</Label>
                <Select value={targetCountry} onValueChange={(v) => { setTargetCountry(v); setTargetCity(''); }}>
                  <SelectTrigger id="target"><SelectValue placeholder={t('post.selectCountry')} /></SelectTrigger>
                  <SelectContent>
                    {NORTH_AFRICAN_COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.name}>{c.flag} {translateCountryName(locale, c.name)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t('post.targetCity')}</Label>
                <Select value={targetCity} onValueChange={setTargetCity} disabled={!targetCountryData}>
                  <SelectTrigger id="city">
                    <SelectValue placeholder={targetCountryData ? t('post.selectCity') : t('post.selectCountryFirst')} />
                  </SelectTrigger>
                  <SelectContent>
                    {targetCountryData?.cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t('post.yourCurrency')}</Label>
                <Select value={currency} onValueChange={(v: 'EUR' | 'USD') => setCurrency(v)}>
                  <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">
                  {t('post.exchangeRate')} {targetCurrency && <span className="text-muted-foreground">{t('post.perCurrency', { currency })}</span>}
                </Label>
                <div className="relative">
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 265"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                  {targetCurrency && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{targetCurrency}</span>
                  )}
                </div>
                {targetCurrency && rate && (
                  <p className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {t('post.senderGets', { rate, targetCurrency, currency })}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">{t('post.availableAmount')}</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g. 5000"
                    value={availableAmount}
                    onChange={(e) => setAvailableAmount(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{currency}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('post.notes')}</Label>
              <Textarea
                id="notes"
                placeholder={t('post.notesPlaceholder')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? t('post.posting') : t('post.publish')}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {t('post.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {myOffers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">{t('post.yourActiveOffers')} ({myOffers.length})</h2>
          <div className="space-y-2">
            {myOffers.slice(0, 3).map((offer) => (
              <div key={offer.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span className="font-medium">{offer.sourceFlag} {translateCountryName(locale, offer.sourceCountry)} → {offer.targetFlag} {offer.targetCity}</span>
                <span className="text-muted-foreground">{offer.rate} {offer.targetCurrency} · {offer.availableAmount.toLocaleString()} {offer.currency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
