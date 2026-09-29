'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Star, RotateCcw, Loader2, Flag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { FAIL_REASONS, type Deal } from '@/lib/data';
import { useLanguage } from '@/lib/language-context';
import { BanWarning } from '@/components/ban-warning';
import { ReportDialog } from '@/components/report-dialog';
import { toast } from 'sonner';

type Props = {
  deal: Deal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FAIL_REASON_KEYS: Record<string, string> = {
  'Merchant did not respond': 'fail.merchantNotRespond',
  'Rate changed at the last minute': 'fail.rateChanged',
  'Amount no longer available': 'fail.amountNotAvailable',
  'Could not agree on meeting point': 'fail.noMeetingPoint',
  'Payment method mismatch': 'fail.paymentMismatch',
  'Other': 'fail.other',
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

function StarRating({ rating, hoverRating, setRating, setHoverRating }: {
  rating: number; hoverRating: number; setRating: (n: number) => void; setHoverRating: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onMouseEnter={() => setHoverRating(n)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(n)}
          className="p-1"
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              (hoverRating || rating) >= n
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function DealResolution({ deal, open, onOpenChange }: Props) {
  const { resolveDeal, addReview } = useStore();
  const { t, tc } = useLanguage();
  const [action, setAction] = useState<'choose' | 'failed' | 'reviewSeller' | 'reviewBuyer'>('choose');
  const [failReason, setFailReason] = useState('');
  const [sellerRating, setSellerRating] = useState(0);
  const [sellerHover, setSellerHover] = useState(0);
  const [sellerComment, setSellerComment] = useState('');
  const [buyerRating, setBuyerRating] = useState(0);
  const [buyerHover, setBuyerHover] = useState(0);
  const [buyerComment, setBuyerComment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  if (!deal) return null;

  const handleComplete = () => {
    setProcessing(true);
    setTimeout(() => {
      resolveDeal(deal.id, 'completed');
      setProcessing(false);
      setAction('reviewSeller');
      toast.success(t('toast.dealCompleted'));
    }, 800);
  };

  const handleFailed = () => {
    if (!failReason) return;
    setProcessing(true);
    setTimeout(() => {
      resolveDeal(deal.id, 'failed', failReason);
      setProcessing(false);
      toast.success(t('toast.dealFailed'));
      onOpenChange(false);
      resetState();
    }, 800);
  };

  const handleSellerReview = () => {
    if (sellerRating === 0) return;
    setProcessing(true);
    setTimeout(() => {
      addReview(deal.id, sellerRating, sellerComment.trim() || t('toast.noComment'), 'seller');
      setProcessing(false);
      setAction('reviewBuyer');
    }, 800);
  };

  const handleBuyerReview = () => {
    if (buyerRating === 0) {
      onOpenChange(false);
      resetState();
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      addReview(deal.id, buyerRating, buyerComment.trim() || t('toast.noComment'), 'buyer');
      setProcessing(false);
      toast.success(t('toast.reviewSubmitted'));
      onOpenChange(false);
      resetState();
    }, 800);
  };

  const resetState = () => {
    setTimeout(() => {
      setAction('choose');
      setFailReason('');
      setSellerRating(0); setSellerHover(0); setSellerComment('');
      setBuyerRating(0); setBuyerHover(0); setBuyerComment('');
    }, 200);
  };

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) resetState();
  };

  const ratingLabels = ['', t('deal.poor'), t('deal.fair'), t('deal.good'), t('deal.veryGood'), t('deal.excellent')];

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          {action === 'choose' && (
            <>
              <DialogHeader>
                <DialogTitle>{t('deal.resolve')}</DialogTitle>
                <DialogDescription>
                  {t('deal.howDidItGo', { name: deal.merchantName })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2">
                <div className="rounded-lg border border-border p-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('deal.amount')}</span>
                    <span className="font-semibold">{deal.amount.toLocaleString()} {deal.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('deal.corridor')}</span>
                    <span className="font-semibold">{tc(deal.sourceCountry)} → {deal.targetCity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('deal.fee')}</span>
                    <span className="font-semibold text-warning">{deal.fee} {deal.currency} ({t('deal.refundable')})</span>
                  </div>
                </div>

                <Button
                  className="w-full gap-2 bg-success hover:bg-success/90"
                  onClick={handleComplete}
                  disabled={processing}
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {t('deal.markCompleted')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={() => setAction('failed')}
                  disabled={processing}
                >
                  <XCircle className="h-4 w-4" />
                  {t('deal.markFailed')}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full gap-2 text-destructive hover:bg-destructive/5"
                  onClick={() => setReportOpen(true)}
                >
                  <Flag className="h-4 w-4" />
                  {t('deal.reportUser')}
                </Button>
              </div>
            </>
          )}

          {action === 'failed' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  {t('deal.failed')}
                </DialogTitle>
                <DialogDescription>
                  {t('deal.selectReasonDesc', { fee: String(deal.fee), currency: deal.currency })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>{t('deal.reasonLabel')}</Label>
                  <Select value={failReason} onValueChange={setFailReason}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('deal.selectReason')} />
                    </SelectTrigger>
                    <SelectContent>
                      {FAIL_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {t(FAIL_REASON_KEYS[r] ?? 'fail.other')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                  <RotateCcw className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {renderRichText(t('deal.feeRefunded', { fee: String(deal.fee), currency: deal.currency }))}
                  </p>
                </div>

                <BanWarning variant="inline" />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAction('choose')}>{t('deal.back')}</Button>
                <Button variant="destructive" onClick={handleFailed} disabled={!failReason || processing}>
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t('deal.confirmRefund')}
                </Button>
              </DialogFooter>
            </>
          )}

          {action === 'reviewSeller' && (
            <>
              <DialogHeader>
                <DialogTitle>{t('deal.rateSeller')}</DialogTitle>
                <DialogDescription>
                  {t('deal.rateSellerDesc')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>{t('deal.rating')}</Label>
                  <StarRating rating={sellerRating} hoverRating={sellerHover} setRating={setSellerRating} setHoverRating={setSellerHover} />
                  {sellerRating > 0 && (
                    <span className="text-sm font-medium text-muted-foreground">{ratingLabels[sellerRating]}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seller-comment">{t('deal.reviewOptional')}</Label>
                  <Textarea
                    id="seller-comment"
                    placeholder={t('deal.shareExperience')}
                    value={sellerComment}
                    onChange={(e) => setSellerComment(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSellerReview} disabled={sellerRating === 0 || processing} className="w-full gap-2">
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t('deal.nextStep')} <ArrowRight className="h-4 w-4" />
                </Button>
              </DialogFooter>
            </>
          )}

          {action === 'reviewBuyer' && (
            <>
              <DialogHeader>
                <DialogTitle>{t('deal.rateBuyer')}</DialogTitle>
                <DialogDescription>
                  {t('deal.rateBuyerDesc')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>{t('deal.rating')}</Label>
                  <StarRating rating={buyerRating} hoverRating={buyerHover} setRating={setBuyerRating} setHoverRating={setBuyerHover} />
                  {buyerRating > 0 && (
                    <span className="text-sm font-medium text-muted-foreground">{ratingLabels[buyerRating]}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-comment">{t('deal.reviewOptional')}</Label>
                  <Textarea
                    id="buyer-comment"
                    placeholder={t('deal.shareExperience')}
                    value={buyerComment}
                    onChange={(e) => setBuyerComment(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => { onOpenChange(false); resetState(); }}>
                  {t('deal.skipReview')}
                </Button>
                <Button onClick={handleBuyerReview} disabled={processing} className="flex-1 gap-2">
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t('deal.submitReview')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ReportDialog dealId={deal.id} open={reportOpen} onOpenChange={setReportOpen} />
    </>
  );
}
