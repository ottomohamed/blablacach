'use client';

import { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';

function renderRichText(text: string): React.ReactNode {
  const parts = text.split(/(<b>.*?<\/b>)/g);
  return parts.map((part, i) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return <span key={i} className="font-bold text-red-700 dark:text-red-400">{part.slice(3, -4)}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

type Props = {
  variant?: 'banner' | 'inline' | 'dismissible';
  className?: string;
};

export function BanWarning({ variant = 'inline', className }: Props) {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (variant === 'banner') {
    return (
      <div className={cn(
        'flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-800',
        className
      )}>
        <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
        <span className="font-medium">{t('ban.shortMessage')}</span>
      </div>
    );
  }

  if (variant === 'dismissible') {
    return (
      <div className={cn(
        'relative rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3',
        className
      )}>
        <ShieldAlert className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800 mb-1">{t('ban.title')}</p>
          <p className="text-sm text-red-700 leading-relaxed">
            {renderRichText(t('ban.message'))}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 rounded text-red-400 hover:bg-red-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3',
      className
    )}>
      <ShieldAlert className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-800 mb-1">{t('ban.title')}</p>
        <p className="text-sm text-red-700 leading-relaxed">
          {renderRichText(t('ban.message'))}
        </p>
      </div>
    </div>
  );
}
