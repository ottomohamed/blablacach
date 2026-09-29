'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Coins, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PACKAGES = [
  { id: 'starter', credits: 100, price: 5, label: 'Starter', popular: false },
  { id: 'popular', credits: 300, price: 12, label: 'Popular', popular: true },
  { id: 'pro', credits: 600, price: 20, label: 'Pro', popular: false },
];

export default function BuyCreditsPage() {
  const { user, credits, refreshCredits } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);

  const handleBuy = async (pkgId: string) => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setLoadingPkg(pkgId);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/buy-credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          package_id: pkgId,
          success_url: `${window.location.origin}/buy-credits?success=1`,
          cancel_url: `${window.location.origin}/buy-credits?canceled=1`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to create checkout session');
        setLoadingPkg(null);
      }
    } catch {
      toast.error('Something went wrong');
      setLoadingPkg(null);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Coins className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">{t('credits.loginRequired')}</h1>
        <p className="text-muted-foreground mb-6">{t('credits.loginRequiredDesc')}</p>
        <Button onClick={() => router.push('/auth')} className="gap-2">
          {t('auth.signIn')} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
          <Coins className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">{t('credits.balance')}: {credits}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{t('credits.title')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t('credits.desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PACKAGES.map((pkg) => (
          <Card key={pkg.id} className={`relative ${pkg.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                {t('credits.mostPopular')}
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{pkg.label}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">{pkg.credits}</span>{' '}
                {t('credits.credits')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold mb-1">€{pkg.price}</p>
              <p className="text-xs text-muted-foreground mb-4">
                €{(pkg.price / pkg.credits).toFixed(2)} {t('credits.perCredit')}
              </p>
              <Button
                className="w-full"
                onClick={() => handleBuy(pkg.id)}
                disabled={loadingPkg !== null}
                variant={pkg.popular ? 'default' : 'outline'}
              >
                {loadingPkg === pkg.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t('credits.buy')
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-3">{t('credits.howItWorks')}</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
              {t('credits.how1')}
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
              {t('credits.how2')}
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
              {t('credits.how3')}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
