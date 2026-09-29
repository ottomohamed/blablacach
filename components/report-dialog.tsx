'use client';

import { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { useLanguage } from '@/lib/language-context';
import { toast } from 'sonner';

type Props = {
  dealId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const REPORT_REASONS = ['report.fraud', 'report.noShow', 'report.abuse', 'report.fakeListing', 'report.stolenFunds', 'report.other'];

export function ReportDialog({ dealId, open, onOpenChange }: Props) {
  const { reportUser, reportedDeals } = useStore();
  const { t } = useLanguage();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [processing, setProcessing] = useState(false);

  const alreadyReported = reportedDeals.includes(dealId);

  const handleSubmit = () => {
    if (!reason) return;
    setProcessing(true);
    setTimeout(() => {
      reportUser(dealId, reason);
      setProcessing(false);
      toast.success(t('report.submitted'));
      onOpenChange(false);
      setReason('');
      setDetails('');
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {alreadyReported ? (
          <div className="py-8 text-center">
            <Flag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t('report.submitted')}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-destructive" />
                {t('report.title')}
              </DialogTitle>
              <DialogDescription>
                {t('deal.reportDesc')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>{t('report.reason')}</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('report.selectReason')} />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_REASONS.map((r) => (
                      <SelectItem key={r} value={r}>{t(r)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-details">{t('deal.reviewOptional')}</Label>
                <Textarea
                  id="report-details"
                  placeholder={t('deal.shareExperience')}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>{t('report.cancel')}</Button>
              <Button variant="destructive" onClick={handleSubmit} disabled={!reason || processing} className="gap-2">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
                {t('report.submit')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
