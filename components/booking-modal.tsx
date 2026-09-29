'use client';

import { useState } from 'react';
import { ShieldCheck, Phone, MessageCircle, MapPin, Info, ArrowRight, CheckCircle2, Loader2, Coins, Lock } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Offer, Deal } from '@/lib/data';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { BanWarning } from '@/components/ban-warning';
import { toast } from 'sonner';

type Props = {
  offer: Offer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealCreated?: (deal: Deal) => void;
};

function renderRichText(text: string): React.ReactNode {
  const parts = text.split(/(<b>.*?<\/b>)/g);
  return parts.map((part, i) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return <span key={i} className="font-semibold text-foreground">{part.slice(3, -4)}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function BookingModal({ offer, open, onOpenChange, onDealCreated }: Props) {
  const { createDeal } = useStore();
  const { t, tc } = useLanguage();
  const { user, credits, refreshCredits } = useAuth();
  const [step, setStep] = useState<'details' | 'contact' | 'processing'>('details');
  const [senderName, setSenderName] = useState('');
  const [createdDeal, setCreatedDeal] = useState<Deal | null>(null);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [revealing, setRevealing] = useState(false);

  if (!offer) return null;

  const fee = Math.round(offer.availableAmount * 0.02 * 100) / 100;
  const targetAmount = Math.round(offer.availableAmount * offer.rate * 100) / 100;
  const revealCost = Math.max(1, Math.round(offer.availableAmount * 0.02 * 100));

  const handleConfirm = () => {
    if (!senderName.trim()) return;
    setStep('processing');
    setTimeout(() => {
      const deal = createDeal(offer, senderName.trim());
      setCreatedDeal(deal);
      setStep('contact');
      onDealCreated?.(deal);
    }, 1200);
  };

  const handleRevealPhone = async () => {
    if (!user || !createdDeal) return;
    setRevealing(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const { data, error } = await supabase.rpc('spend_credits', {
        p_user_id: user.id,
        p_amount: revealCost,
        p_description: `Phone reveal: ${createdDeal.id.slice(0, 12)}`,
      });
      if (error || data === false) {
        toast.error(t('credits.insufficient', { needed: String(revealCost) }));
      } else {
        setPhoneRevealed(true);
        await refreshCredits();
        toast.success(t('credits.phoneRevealed'));
      }
    } catch {
      toast.error(t('credits.revealFailed'));
    }
    setRevealing(false);
  };

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setStep('details');
        setSenderName('');
        setCreatedDeal(null);
        setPhoneRevealed(false);
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-lg">{offer.sourceFlag}</span>
                {t('booking.title')}
                <span className="text-lg">{offer.targetFlag}</span>
              </DialogTitle>
              <DialogDescription>
                {t('booking.review')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.merchant')}</span>
                  <span className="font-semibold">{offer.merchantName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.corridor')}</span>
                  <span className="font-semibold flex items-center gap-1.5">
                    {tc(offer.sourceCountry)} <ArrowRight className="h-3 w-3 text-primary" /> {offer.targetCity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.exchangeRate')}</span>
                  <span className="font-semibold text-primary">
                    1 {offer.currency} = {offer.rate} {offer.targetCurrency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.amount')}</span>
                  <span className="font-semibold">{offer.availableAmount.toLocaleString()} {offer.currency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.youReceive')}</span>
                  <span className="font-bold text-success">
                    {targetAmount.toLocaleString()} {offer.targetCurrency}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-primary">{t('booking.feeTitle')}</p>
                    <p className="text-muted-foreground mt-1">
                      {renderRichText(t('booking.feeDesc', { fee: String(fee), currency: offer.currency }))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender-name">{t('booking.yourName')}</Label>
                <Input
                  id="sender-name"
                  placeholder={t('booking.enterName')}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <BanWarning variant="inline" />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)}>{t('booking.cancel')}</Button>
              <Button onClick={handleConfirm} disabled={!senderName.trim()}>
                {t('booking.confirm', { fee: String(fee), currency: offer.currency })}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'processing' && (
          <div className="py-16 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">{t('booking.processing')}</p>
          </div>
        )}

        {step === 'contact' && createdDeal && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                {t('booking.confirmed')}
              </DialogTitle>
              <DialogDescription>
                {t('booking.contactDirectly')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.dealId')}</span>
                  <span className="font-mono text-xs font-semibold">{createdDeal.id.slice(0, 12)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.amount')}</span>
                  <span className="font-semibold">{createdDeal.amount.toLocaleString()} {createdDeal.currency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.feeRefundable')}</span>
                  <span className="font-semibold text-warning">{createdDeal.fee} {createdDeal.currency}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {t('booking.contactDetails')}
                </h4>
                {phoneRevealed && createdDeal ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <a href={`tel:${createdDeal.contactPhone}`}>
                        <Button variant="outline" className="w-full gap-2">
                          <Phone className="h-4 w-4" />
                          {t('booking.call')}
                        </Button>
                      </a>
                      <a href={`https://wa.me/${createdDeal.contactWhatsApp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                          <MessageCircle className="h-4 w-4" />
                          {t('booking.whatsapp')}
                        </Button>
                      </a>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm font-medium text-foreground">{createdDeal.contactPhone}</p>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-border p-6 text-center space-y-3">
                    <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm font-semibold mb-1">{t('credits.revealPhone')}</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {t('credits.revealCost', { cost: String(revealCost), amount: String(offer.availableAmount), currency: offer.currency })}
                      </p>
                      {!user ? (
                        <a href="/auth">
                          <Button size="sm" className="w-full">{t('nav.login')}</Button>
                        </a>
                      ) : credits < revealCost ? (
                        <a href="/buy-credits">
                          <Button size="sm" variant="outline" className="w-full gap-1.5">
                            <Coins className="h-4 w-4" />
                            {t('credits.buyMore')}
                          </Button>
                        </a>
                      ) : (
                        <Button size="sm" className="w-full" onClick={handleRevealPhone} disabled={revealing}>
                          {revealing ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                            <span className="flex items-center gap-1.5">
                              <Coins className="h-4 w-4" />
                              {t('credits.revealPhone')}
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{t('booking.deliveryTitle')}</p>
                    <p className="text-muted-foreground mt-1">{createdDeal.deliveryInstructions}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  {t('booking.disclaimer')}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => handleClose(false)} className="w-full">{t('booking.done')}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
