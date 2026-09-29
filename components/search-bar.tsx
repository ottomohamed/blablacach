'use client';

import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EUROPEAN_COUNTRIES, NORTH_AFRICAN_COUNTRIES } from '@/lib/data';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/language-context';
import { translateCountryName } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Props = {
  variant?: 'hero' | 'inline';
  onSearch?: () => void;
};

export function SearchBar({ variant = 'hero', onSearch }: Props) {
  const router = useRouter();
  const { filters, setFilters } = useStore();
  const { locale, t, tc } = useLanguage();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.sourceCountry) params.set('from', filters.sourceCountry);
    if (filters.targetCountry) params.set('to', filters.targetCountry);
    if (filters.targetCity) params.set('city', filters.targetCity);
    if (filters.amount) params.set('amount', filters.amount);
    onSearch?.();
    router.push(`/offers?${params.toString()}`);
  };

  const targetCountry = NORTH_AFRICAN_COUNTRIES.find((c) => c.name === filters.targetCountry);

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-white shadow-sm',
        variant === 'hero' ? 'p-4 sm:p-5' : 'p-4'
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t('search.fromEurope')}</Label>
          <Select
            value={filters.sourceCountry ?? ''}
            onValueChange={(v) => setFilters({ ...filters, sourceCountry: v })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={t('search.anyCountry')} />
            </SelectTrigger>
            <SelectContent>
              {EUROPEAN_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.name}>
                  {c.flag} {translateCountryName(locale, c.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t('search.toNorthAfrica')}</Label>
          <Select
            value={filters.targetCountry ?? ''}
            onValueChange={(v) => setFilters({ ...filters, targetCountry: v, targetCity: undefined })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={t('search.anyCountry')} />
            </SelectTrigger>
            <SelectContent>
              {NORTH_AFRICAN_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.name}>
                  {c.flag} {translateCountryName(locale, c.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t('search.city')}</Label>
          <Select
            value={filters.targetCity ?? ''}
            onValueChange={(v) => setFilters({ ...filters, targetCity: v })}
            disabled={!targetCountry}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={targetCountry ? t('search.anyCity') : t('search.selectCountryFirst')} />
            </SelectTrigger>
            <SelectContent>
              {targetCountry?.cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t('search.amount')} ({filters.currency ?? 'EUR'})</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={t('search.anyAmount')}
              value={filters.amount ?? ''}
              onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
              className="bg-white"
            />
            <Select
              value={filters.currency ?? 'EUR'}
              onValueChange={(v: 'EUR' | 'USD') => setFilters({ ...filters, currency: v })}
            >
              <SelectTrigger className="w-[80px] bg-white shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button size="lg" className="w-full sm:w-auto gap-2" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          {t('search.searchOffers')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
