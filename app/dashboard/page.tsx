'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import {
  Star, TrendingUp, CheckCircle2, XCircle, Clock, Wallet, BadgeCheck, ArrowRight,
  Phone, MapPin, Copy,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OfferCard } from '@/components/offer-card';
import { DealResolution } from '@/components/deal-resolution';
import { useStore } from '@/lib/store';
import type { Deal } from '@/lib/data';
import { useLanguage } from '@/lib/language-context';
import { toast } from 'sonner';

function StatTile({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DealRow({ deal, onResolve }: { deal: Deal; onResolve: (deal: Deal) => void }) {
  const { t, tc } = useLanguage();
  const statusConfig = {
    pending: { label: t('dash.pending'), color: 'bg-amber-100 text-amber-700', icon: Clock },
    completed: { label: t('dash.completedLabel'), color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    failed: { label: t('dash.failed'), color: 'bg-red-100 text-red-700', icon: XCircle },
    cancelled: { label: t('dash.cancelled'), color: 'bg-slate-100 text-slate-600', icon: XCircle },
  };
  const config = statusConfig[deal.status];
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={config.color + ' border-transparent gap-1'}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">{deal.id.slice(0, 12)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{deal.amount.toLocaleString()} {deal.currency}</span>
              <ArrowRight className="h-3 w-3 text-primary" />
              <span className="font-semibold text-success">{deal.targetAmount.toLocaleString()} {deal.targetCurrency}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {tc(deal.sourceCountry)} → {deal.targetCity}
              </span>
              <span>{t('dash.rate')}: {deal.rate} {deal.targetCurrency}</span>
              <span>{t('dash.fee')}: {deal.fee} {deal.currency}</span>
            </div>
            {deal.failReason && (
              <p className="text-xs text-destructive">{t('dash.reason')}: {deal.failReason}</p>
            )}
            {deal.status === 'pending' && deal.contactPhone && (
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className="gap-1 text-xs">
                  <Phone className="h-3 w-3" />
                  {deal.contactPhone}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs gap-1"
                  onClick={() => {
                    navigator.clipboard?.writeText(deal.contactPhone ?? '');
                    toast.success(t('toast.phoneCopied'));
                  }}
                >
                  <Copy className="h-3 w-3" />
                  {t('dash.copy')}
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            {deal.status === 'pending' && (
              <Button size="sm" onClick={() => onResolve(deal)}>
                {t('dash.resolveDeal')}
              </Button>
            )}
            {deal.status === 'completed' && !deal.rated && (
              <Button size="sm" variant="outline" onClick={() => onResolve(deal)}>
                {t('dash.leaveReview')}
              </Button>
            )}
            {deal.status === 'completed' && deal.rated && (
              <Badge variant="outline" className="gap-1 text-success border-success/30">
                <CheckCircle2 className="h-3 w-3" />
                {t('dash.reviewed')}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const {
    currentMerchantId, getMerchantOffers, getMerchantDeals, getMerchantReviews, getBuyerReviews, getMerchantStats, removeOffer,
  } = useStore();
  const [resolveDeal, setResolveDeal] = useState<Deal | null>(null);
  const [resolveOpen, setResolveOpen] = useState(false);

  const stats = getMerchantStats(currentMerchantId);
  const myOffers = getMerchantOffers(currentMerchantId);
  const myDeals = getMerchantDeals(currentMerchantId);
  const mySellerReviews = getMerchantReviews(currentMerchantId);
  const myBuyerReviews = getBuyerReviews(currentMerchantId);

  const handleResolve = (deal: Deal) => {
    setResolveDeal(deal);
    setResolveOpen(true);
  };

  const handleRemove = (id: string) => {
    removeOffer(id);
    toast.success(t('toast.offerRemoved'));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Avatar className="h-16 w-16 bg-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">KB</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Karim Benali</h1>
                <BadgeCheck className="h-5 w-5 text-success" />
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {stats.rating.toFixed(1)}
                </span>
                <span>{stats.totalDeals} {t('dash.dealsCompleted')}</span>
                {stats.totalBuyerReviews > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="text-muted-foreground">·</span>
                    <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
                    {stats.buyerRating.toFixed(1)} ({stats.totalBuyerReviews} {t('deal.totalBuyerReviews')})
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile icon={Star} label={t('dash.rating')} value={stats.rating.toFixed(1)} color="bg-amber-100 text-amber-600" />
        <StatTile icon={TrendingUp} label={t('dash.totalDeals')} value={stats.totalDeals} color="bg-blue-100 text-blue-600" />
        <StatTile icon={CheckCircle2} label={t('dash.completed')} value={stats.completedDeals} color="bg-green-100 text-green-600" />
        <StatTile icon={Wallet} label={t('dash.activeOffers')} value={stats.activeOffers} color="bg-slate-100 text-slate-600" />
        {stats.totalBuyerReviews > 0 && (
          <StatTile icon={Star} label={t('deal.buyerRating')} value={stats.buyerRating.toFixed(1)} color="bg-blue-100 text-blue-600" />
        )}
      </div>

      <Tabs defaultValue="offers">
        <TabsList className="mb-6">
          <TabsTrigger value="offers">{t('dash.myOffers')} ({myOffers.length})</TabsTrigger>
          <TabsTrigger value="deals">{t('dash.deals')} ({myDeals.length})</TabsTrigger>
          <TabsTrigger value="reviews">{t('dash.reviews')} ({mySellerReviews.length + myBuyerReviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="offers">
          {myOffers.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground mb-4">{t('dash.noOffersYet')}</p>
                <a href="/post-offer"><Button>{t('dash.postFirstOffer')}</Button></a>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myOffers.map((offer) => (
                <div key={offer.id} className="relative group">
                  <OfferCard offer={offer} />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-7"
                    onClick={() => handleRemove(offer.id)}
                  >
                    {t('dash.remove')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="deals">
          {myDeals.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">{t('dash.noDealsYet')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-w-3xl">
              {myDeals.map((deal) => (
                <DealRow key={deal.id} deal={deal} onResolve={handleResolve} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          {mySellerReviews.length === 0 && myBuyerReviews.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">{t('dash.noReviewsYet')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 max-w-3xl">
              {mySellerReviews.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{t('deal.sellerReviews')}</h3>
                  <div className="space-y-3">
                    {mySellerReviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="font-semibold text-sm">{review.author}</p>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <Star key={n} className={`h-3.5 w-3.5 ${n <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {myBuyerReviews.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{t('deal.buyerReviews')}</h3>
                  <div className="space-y-3">
                    {myBuyerReviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="font-semibold text-sm">{review.author}</p>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <Star key={n} className={`h-3.5 w-3.5 ${n <= review.rating ? 'fill-blue-400 text-blue-400' : 'fill-muted text-muted'}`} />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {myBuyerReviews.length === 0 && (
                <p className="text-sm text-muted-foreground italic">{t('deal.noBuyerReviews')}</p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {resolveDeal && (
        <DealResolution
          deal={resolveDeal}
          open={resolveOpen}
          onOpenChange={setResolveOpen}
        />
      )}
    </div>
  );
}
