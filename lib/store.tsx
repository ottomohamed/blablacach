'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Offer, Deal, Review, SearchFilters } from './data';
import { FAIL_REASONS } from './data';

type StoreContextValue = {
  offers: Offer[];
  deals: Deal[];
  reviews: Review[];
  currentMerchantId: string;
  setCurrentMerchantId: (id: string) => void;
  filters: SearchFilters;
  setFilters: (f: SearchFilters) => void;
  addOffer: (o: Omit<Offer, 'id' | 'createdAt' | 'rating' | 'totalDeals' | 'verified' | 'merchantId' | 'merchantName' | 'merchantAvatar'>) => string;
  removeOffer: (id: string) => void;
  createDeal: (offer: Offer, senderName: string) => Deal;
  resolveDeal: (dealId: string, status: 'completed' | 'failed', failReason?: string) => void;
  addReview: (dealId: string, rating: number, comment: string, reviewType: 'seller' | 'buyer') => void;
  getMerchantOffers: (merchantId: string) => Offer[];
  getMerchantDeals: (merchantId: string) => Deal[];
  getMerchantReviews: (merchantId: string) => Review[];
  getBuyerReviews: (merchantId: string) => Review[];
  getMerchantStats: (merchantId: string) => { rating: number; totalDeals: number; completedDeals: number; failedDeals: number; activeOffers: number; buyerRating: number; totalBuyerReviews: number };
  reportUser: (dealId: string, reason: string) => void;
  reportedDeals: string[];
};

const StoreContext = createContext<StoreContextValue | null>(null);

const MERCHANT_ID = 'm-001';

const SEED_OFFERS: Offer[] = [
  {
    id: 'o-001', merchantId: 'm-001', merchantName: 'Karim Benali', merchantAvatar: 'KB',
    verified: true, rating: 4.9, totalDeals: 127,
    sourceCountry: 'France', sourceFlag: '🇫🇷', targetCountry: 'Algeria', targetFlag: '🇩🇿',
    targetCity: 'Algiers', rate: 265, targetCurrency: 'DZD', availableAmount: 5000,
    currency: 'EUR', createdAt: '2026-09-25T10:00:00Z', notes: 'Fast cash delivery in Algiers city center. Available weekdays.',
  },
  {
    id: 'o-002', merchantId: 'm-002', merchantName: 'Youssef El Amrani', merchantAvatar: 'YA',
    verified: true, rating: 4.8, totalDeals: 89,
    sourceCountry: 'Spain', sourceFlag: '🇪🇸', targetCountry: 'Morocco', targetFlag: '🇲🇦',
    targetCity: 'Casablanca', rate: 11.2, targetCurrency: 'MAD', availableAmount: 3000,
    currency: 'EUR', createdAt: '2026-09-25T12:00:00Z', notes: 'Casablanca and Rabat. Best rates guaranteed.',
  },
  {
    id: 'o-003', merchantId: 'm-003', merchantName: 'Fatima Zahra', merchantAvatar: 'FZ',
    verified: true, rating: 5.0, totalDeals: 203,
    sourceCountry: 'France', sourceFlag: '🇫🇷', targetCountry: 'Morocco', targetFlag: '🇲🇦',
    targetCity: 'Marrakech', rate: 11.25, targetCurrency: 'MAD', availableAmount: 8000,
    currency: 'EUR', createdAt: '2026-09-24T09:00:00Z', notes: 'Marrakech, Agadir and surrounding cities. Trusted service.',
  },
  {
    id: 'o-004', merchantId: 'm-004', merchantName: 'Mohamed Ould Sidi', merchantAvatar: 'MS',
    verified: false, rating: 4.5, totalDeals: 12,
    sourceCountry: 'Belgium', sourceFlag: '🇧🇪', targetCountry: 'Mauritania', targetFlag: '🇲🇷',
    targetCity: 'Nouakchott', rate: 42, targetCurrency: 'MRU', availableAmount: 2000,
    currency: 'EUR', createdAt: '2026-09-26T08:00:00Z', notes: 'New to the platform. Nouakchott only.',
  },
  {
    id: 'o-005', merchantId: 'm-005', merchantName: 'Sofia Romano', merchantAvatar: 'SR',
    verified: true, rating: 4.7, totalDeals: 156,
    sourceCountry: 'Italy', sourceFlag: '🇮🇹', targetCountry: 'Tunisia', targetFlag: '🇹🇳',
    targetCity: 'Tunis', rate: 3.4, targetCurrency: 'TND', availableAmount: 4500,
    currency: 'EUR', createdAt: '2026-09-23T14:00:00Z', notes: 'Tunis and Sfax. Quick response time.',
  },
  {
    id: 'o-006', merchantId: 'm-006', merchantName: 'Ahmed Khaled', merchantAvatar: 'AK',
    verified: true, rating: 4.6, totalDeals: 78,
    sourceCountry: 'Germany', sourceFlag: '🇩🇪', targetCountry: 'Libya', targetFlag: '🇱🇾',
    targetCity: 'Tripoli', rate: 5.35, targetCurrency: 'LYD', availableAmount: 3000,
    currency: 'EUR', createdAt: '2026-09-22T11:00:00Z', notes: 'Tripoli city. Secure transactions only.',
  },
  {
    id: 'o-007', merchantId: 'm-002', merchantName: 'Youssef El Amrani', merchantAvatar: 'YA',
    verified: true, rating: 4.8, totalDeals: 89,
    sourceCountry: 'Spain', sourceFlag: '🇪🇸', targetCountry: 'Morocco', targetFlag: '🇲🇦',
    targetCity: 'Rabat', rate: 11.18, targetCurrency: 'MAD', availableAmount: 2500,
    currency: 'EUR', createdAt: '2026-09-26T07:00:00Z',
  },
  {
    id: 'o-008', merchantId: 'm-001', merchantName: 'Karim Benali', merchantAvatar: 'KB',
    verified: true, rating: 4.9, totalDeals: 127,
    sourceCountry: 'France', sourceFlag: '🇫🇷', targetCountry: 'Algeria', targetFlag: '🇩🇿',
    targetCity: 'Oran', rate: 263, targetCurrency: 'DZD', availableAmount: 3500,
    currency: 'EUR', createdAt: '2026-09-26T09:00:00Z', notes: 'Oran delivery available weekends.',
  },
  {
    id: 'o-009', merchantId: 'm-007', merchantName: 'Nadia Cherif', merchantAvatar: 'NC',
    verified: true, rating: 4.85, totalDeals: 94,
    sourceCountry: 'Netherlands', sourceFlag: '🇳🇱', targetCountry: 'Algeria', targetFlag: '🇩🇿',
    targetCity: 'Constantine', rate: 266, targetCurrency: 'DZD', availableAmount: 6000,
    currency: 'EUR', createdAt: '2026-09-26T06:00:00Z', notes: 'Constantine and Annaba.',
  },
  {
    id: 'o-010', merchantId: 'm-005', merchantName: 'Sofia Romano', merchantAvatar: 'SR',
    verified: true, rating: 4.7, totalDeals: 156,
    sourceCountry: 'Italy', sourceFlag: '🇮🇹', targetCountry: 'Tunisia', targetFlag: '🇹🇳',
    targetCity: 'Sfax', rate: 3.42, targetCurrency: 'TND', availableAmount: 2000,
    currency: 'EUR', createdAt: '2026-09-26T05:00:00Z',
  },
  {
    id: 'o-011', merchantId: 'm-003', merchantName: 'Fatima Zahra', merchantAvatar: 'FZ',
    verified: true, rating: 5.0, totalDeals: 203,
    sourceCountry: 'Spain', sourceFlag: '🇪🇸', targetCountry: 'Morocco', targetFlag: '🇲🇦',
    targetCity: 'Tangier', rate: 11.22, targetCurrency: 'MAD', availableAmount: 4000,
    currency: 'EUR', createdAt: '2026-09-26T04:00:00Z', notes: 'Tangier delivery within 24h.',
  },
  {
    id: 'o-012', merchantId: 'm-008', merchantName: 'Omar Farouk', merchantAvatar: 'OF',
    verified: false, rating: 4.3, totalDeals: 5,
    sourceCountry: 'Germany', sourceFlag: '🇩🇪', targetCountry: 'Morocco', targetFlag: '🇲🇦',
    targetCity: 'Fez', rate: 11.1, targetCurrency: 'MAD', availableAmount: 1500,
    currency: 'EUR', createdAt: '2026-09-27T03:00:00Z', notes: 'New merchant - building reputation.',
  },
];

const SEED_REVIEWS: Review[] = [
  { id: 'r-001', dealId: 'd-old-001', merchantId: 'm-001', rating: 5, comment: 'Karim was super fast and reliable. Got my money the same day in Algiers!', author: 'Sara M.', createdAt: '2026-09-20T10:00:00Z', reviewType: 'seller', targetId: 'm-001', targetName: 'Karim Benali' },
  { id: 'r-002', dealId: 'd-old-002', merchantId: 'm-001', rating: 5, comment: 'Excellent service, best rate in town.', author: 'Reda B.', createdAt: '2026-09-18T14:00:00Z', reviewType: 'seller', targetId: 'm-001', targetName: 'Karim Benali' },
  { id: 'r-003', dealId: 'd-old-003', merchantId: 'm-002', rating: 5, comment: 'Smooth transaction from Barcelona to Casa. Highly recommend.', author: 'Hassan T.', createdAt: '2026-09-19T09:00:00Z', reviewType: 'seller', targetId: 'm-002', targetName: 'Youssef El Amrani' },
  { id: 'r-004', dealId: 'd-old-004', merchantId: 'm-003', rating: 5, comment: 'Fatima is the best! Always trustworthy and fair rates.', author: 'Leila K.', createdAt: '2026-09-17T11:00:00Z', reviewType: 'seller', targetId: 'm-003', targetName: 'Fatima Zahra' },
  { id: 'r-005', dealId: 'd-old-005', merchantId: 'm-005', rating: 4, comment: 'Good service, slight delay but overall satisfied.', author: 'Marco P.', createdAt: '2026-09-16T15:00:00Z', reviewType: 'seller', targetId: 'm-005', targetName: 'Sofia Romano' },
  { id: 'r-006', dealId: 'd-old-006', merchantId: 'm-003', rating: 5, comment: 'Second time using Fatima. Consistently excellent.', author: 'Younes A.', createdAt: '2026-09-15T08:00:00Z', reviewType: 'seller', targetId: 'm-003', targetName: 'Fatima Zahra' },
  { id: 'r-007', dealId: 'd-old-007', merchantId: 'm-001', rating: 4, comment: 'Good rate, friendly merchant. Would use again.', author: 'Amira D.', createdAt: '2026-09-14T13:00:00Z', reviewType: 'seller', targetId: 'm-001', targetName: 'Karim Benali' },
];

function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [currentMerchantId, setCurrentMerchantId] = useState<string>(MERCHANT_ID);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [reportedDeals, setReportedDeals] = useState<string[]>([]);

  const addOffer = useCallback<StoreContextValue['addOffer']>((o) => {
    const id = genId('o');
    setOffers((prev) => [
      {
        ...o,
        id,
        merchantId: currentMerchantId,
        merchantName: 'Karim Benali',
        merchantAvatar: 'KB',
        verified: true,
        rating: 4.9,
        totalDeals: 127,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    return id;
  }, [currentMerchantId]);

  const removeOffer = useCallback((id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const createDeal = useCallback<StoreContextValue['createDeal']>((offer, senderName) => {
    const amount = offer.availableAmount;
    const fee = Math.round(amount * 0.02 * 100) / 100;
    const targetAmount = Math.round(amount * offer.rate * 100) / 100;
    const deal: Deal = {
      id: genId('d'),
      offerId: offer.id,
      merchantId: offer.merchantId,
      merchantName: offer.merchantName,
      senderName,
      amount,
      currency: offer.currency,
      fee,
      rate: offer.rate,
      targetCurrency: offer.targetCurrency,
      targetAmount,
      sourceCountry: offer.sourceCountry,
      targetCountry: offer.targetCountry,
      targetCity: offer.targetCity,
      status: 'pending',
      createdAt: new Date().toISOString(),
      contactPhone: '+213 770 12 34 56',
      contactWhatsApp: '+213770123456',
      deliveryInstructions: `Contact the merchant to arrange cash handover in ${offer.targetCity}. Meet in a public, well-lit location. Do not send money online — this is a cash-to-cash exchange only.`,
      rated: false,
      buyerRated: false,
      sellerRated: false,
    };
    setDeals((prev) => [deal, ...prev]);
    setOffers((prev) =>
      prev.map((o) => (o.id === offer.id ? { ...o, availableAmount: Math.max(0, o.availableAmount - amount) } : o))
    );
    return deal;
  }, []);

  const resolveDeal = useCallback<StoreContextValue['resolveDeal']>((dealId, status, failReason) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? { ...d, status, failReason: status === 'failed' ? failReason : undefined }
          : d
      )
    );
    if (status === 'completed') {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === deals.find((d) => d.id === dealId)?.offerId
            ? { ...o, totalDeals: o.totalDeals + 1 }
            : o
        )
      );
    }
  }, [deals]);

  const addReview = useCallback<StoreContextValue['addReview']>((dealId, rating, comment, reviewType) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;
    const review: Review = {
      id: genId('r'),
      dealId,
      merchantId: deal.merchantId,
      rating,
      comment,
      author: reviewType === 'seller' ? (deal.senderName || 'Anonymous') : deal.merchantName,
      createdAt: new Date().toISOString(),
      reviewType,
      targetId: reviewType === 'seller' ? deal.merchantId : deal.senderName,
      targetName: reviewType === 'seller' ? deal.merchantName : deal.senderName,
    };
    setReviews((prev) => [review, ...prev]);

    if (reviewType === 'seller') {
      setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, rated: true, buyerRated: true } : d)));
      setOffers((prev) =>
        prev.map((o) => {
          if (o.merchantId !== deal.merchantId) return o;
          const merchantReviews = [...reviews.filter((r) => r.merchantId === deal.merchantId && r.reviewType === 'seller'), review];
          const avg = merchantReviews.reduce((s, r) => s + r.rating, 0) / merchantReviews.length;
          return { ...o, rating: Math.round(avg * 100) / 100 };
        })
      );
    } else {
      setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, sellerRated: true, buyerRating: rating, buyerComment: comment } : d)));
    }
  }, [deals, reviews]);

  const reportUser = useCallback((dealId: string, _reason: string) => {
    setReportedDeals((prev) => [...prev, dealId]);
  }, []);

  const getMerchantOffers = useCallback((mid: string) => offers.filter((o) => o.merchantId === mid), [offers]);
  const getMerchantDeals = useCallback((mid: string) => deals.filter((d) => d.merchantId === mid), [deals]);
  const getMerchantReviews = useCallback((mid: string) => reviews.filter((r) => r.merchantId === mid && r.reviewType === 'seller'), [reviews]);
  const getBuyerReviews = useCallback((mid: string) => reviews.filter((r) => r.reviewType === 'buyer' && r.targetId === mid), [reviews]);

  const getMerchantStats = useCallback<StoreContextValue['getMerchantStats']>((mid) => {
    const merchantDeals = deals.filter((d) => d.merchantId === mid);
    const completed = merchantDeals.filter((d) => d.status === 'completed').length;
    const failed = merchantDeals.filter((d) => d.status === 'failed').length;
    const active = offers.filter((o) => o.merchantId === mid && o.availableAmount > 0).length;
    const offer = offers.find((o) => o.merchantId === mid);
    const buyerReviews = reviews.filter((r) => r.reviewType === 'buyer' && r.targetId === mid);
    const buyerRating = buyerReviews.length > 0
      ? Math.round((buyerReviews.reduce((s, r) => s + r.rating, 0) / buyerReviews.length) * 100) / 100
      : 0;
    return {
      rating: offer?.rating ?? 0,
      totalDeals: (offer?.totalDeals ?? 0) + completed,
      completedDeals: completed,
      failedDeals: failed,
      activeOffers: active,
      buyerRating,
      totalBuyerReviews: buyerReviews.length,
    };
  }, [deals, offers, reviews]);

  const value = useMemo<StoreContextValue>(() => ({
    offers, deals, reviews, currentMerchantId, setCurrentMerchantId,
    filters, setFilters, addOffer, removeOffer, createDeal, resolveDeal, addReview,
    getMerchantOffers, getMerchantDeals, getMerchantReviews, getBuyerReviews, getMerchantStats,
    reportUser, reportedDeals,
  }), [offers, deals, reviews, currentMerchantId, filters, addOffer, removeOffer, createDeal, resolveDeal, addReview, getMerchantOffers, getMerchantDeals, getMerchantReviews, getBuyerReviews, getMerchantStats, reportUser, reportedDeals]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
