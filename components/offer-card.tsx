'use client';

import { Star, BadgeCheck, AlertTriangle, MapPin, ArrowRight, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Offer } from '@/lib/data';
import { useLanguage } from '@/lib/language-context';
import { translateCountryName } from '@/lib/i18n';

type Props = {
  offer: Offer;
  onBook?: (offer: Offer) => void;
};

export function OfferCard({ offer, onBook }: Props) {
  const { locale, t, tc } = useLanguage();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 bg-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {offer.merchantAvatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm text-foreground">{offer.merchantName}</h3>
                {offer.verified ? (
                  <BadgeCheck className="h-4 w-4 text-success" />
                ) : (
                  <Badge variant="outline" className="text-warning border-warning/40 bg-warning/5 text-[10px] px-1.5 py-0 gap-0.5">
                    <AlertTriangle className="h-3 w-3" />
                    {t('offer.new')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex items-center gap-0.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-foreground">{offer.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">({offer.totalDeals} {offer.totalDeals !== 1 ? t('offer.deals') : t('offer.deal')})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50">
          <span className="text-xl">{offer.sourceFlag}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{t('offer.from')}</p>
            <p className="text-sm font-medium truncate">{translateCountryName(locale, offer.sourceCountry)}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xl">{offer.targetFlag}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{t('offer.to')}</p>
            <p className="text-sm font-medium truncate flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {offer.targetCity}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground mb-0.5">{t('offer.exchangeRate')}</p>
            <p className="text-base font-bold text-primary">
              {offer.rate} <span className="text-xs font-normal text-muted-foreground">{offer.targetCurrency}</span>
            </p>
            <p className="text-[10px] text-muted-foreground">{t('offer.perCurrency')} {offer.currency}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground mb-0.5">{t('offer.available')}</p>
            <p className="text-base font-bold text-foreground flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              {offer.availableAmount.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">{offer.currency}</span>
            </p>
          </div>
        </div>

        {offer.notes && (
          <p className="text-xs text-muted-foreground mb-4 line-clamp-2 italic">&ldquo;{offer.notes}&rdquo;</p>
        )}

        {onBook && (
          <Button
            className="w-full"
            onClick={() => onBook(offer)}
            disabled={offer.availableAmount <= 0}
          >
            {offer.availableAmount <= 0 ? t('offer.fullyBooked') : t('offer.bookOffer')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
