import type { Profile, SpendingData, CardMetadata, CardRecommendation, RewardBreakdown, SpendingCategory } from '../types';
import { SPENDING_CATEGORIES } from '../types';

export function calculateCardRewards(
  spending: SpendingData,
  card: CardMetadata
): { totalRewards: number; breakdown: RewardBreakdown[] } {
  const breakdown: RewardBreakdown[] = [];
  let totalRewards = 0;

  for (const cat of SPENDING_CATEGORIES) {
    const spend = spending[cat] || 0;
    const rate = card.reward_rates[cat] || 0;
    const cap = card.caps[cat] || Infinity;
    const effectiveSpend = Math.min(spend, cap);
    const reward = effectiveSpend * rate;
    totalRewards += reward;
    breakdown.push({ category: cat, spend, rate, cap, reward });
  }

  return { totalRewards, breakdown };
}

export function calculateNetBenefit(
  totalRewards: number,
  annualFee: number,
  welcomeBonus: number
): number {
  return totalRewards - annualFee + (welcomeBonus / 3);
}

export function runRecommendationEngine(
  profile: Profile,
  spending: SpendingData,
  cards: CardMetadata[]
): CardRecommendation[] {
  const eligible = cards.filter(card =>
    profile.annual_income >= card.min_income &&
    profile.credit_score >= card.min_credit_score
  );

  const scored: CardRecommendation[] = eligible.map(card => {
    const { totalRewards, breakdown } = calculateCardRewards(spending, card);
    const netBenefit = calculateNetBenefit(totalRewards, card.annual_fee, card.welcome_bonus);

    return {
      card,
      net_benefit: Math.round(netBenefit),
      total_rewards: Math.round(totalRewards),
      reward_breakdown: breakdown,
      approval_probability: 0,
      risk_level: 'Medium' as const,
      rank: 0,
    };
  });

  scored.sort((a, b) => b.net_benefit - a.net_benefit);
  scored.forEach((s, i) => { s.rank = i + 1; });

  return scored.slice(0, 8);
}

export function getBestCategoryCard(
  cards: CardMetadata[],
  category: SpendingCategory
): CardMetadata | null {
  if (cards.length === 0) return null;
  return cards.reduce((best, card) =>
    (card.reward_rates[category] || 0) > (best.reward_rates[category] || 0) ? card : best
  , cards[0]);
}
