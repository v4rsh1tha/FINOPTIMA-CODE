import type { SpendingData, CardMetadata, MultiCardResult, SpendingCategory } from '../types';
import { SPENDING_CATEGORIES } from '../types';
import { calculateCardRewards } from './recommendation';

export function runMultiCardOptimizer(
  spending: SpendingData,
  eligibleCards: CardMetadata[],
  singleBestBenefit: number
): MultiCardResult[] {
  const results: MultiCardResult[] = [];
  const topCards = eligibleCards.slice(0, 10);

  for (let i = 0; i < topCards.length; i++) {
    for (let j = i + 1; j < topCards.length; j++) {
      const cardA = topCards[i];
      const cardB = topCards[j];
      const allocation: Record<SpendingCategory, string> = {} as Record<SpendingCategory, string>;
      let combinedRewards = 0;

      for (const cat of SPENDING_CATEGORIES) {
        const spendAmt = spending[cat] || 0;
        const rateA = cardA.reward_rates[cat] || 0;
        const rateB = cardB.reward_rates[cat] || 0;
        const capA = cardA.caps[cat] || Infinity;
        const capB = cardB.caps[cat] || Infinity;

        const rewardA = Math.min(spendAmt, capA) * rateA;
        const rewardB = Math.min(spendAmt, capB) * rateB;

        if (rewardA >= rewardB) {
          allocation[cat] = cardA.card_name;
          combinedRewards += rewardA;
        } else {
          allocation[cat] = cardB.card_name;
          combinedRewards += rewardB;
        }
      }

      const combinedFees = cardA.annual_fee + cardB.annual_fee;
      const combinedBonus = (cardA.welcome_bonus + cardB.welcome_bonus) / 3;
      const combinedNetBenefit = Math.round(combinedRewards - combinedFees + combinedBonus);
      const improvement = singleBestBenefit > 0
        ? ((combinedNetBenefit - singleBestBenefit) / singleBestBenefit) * 100
        : 0;

      if (combinedNetBenefit > singleBestBenefit) {
        results.push({
          card_a: cardA,
          card_b: cardB,
          category_allocation: allocation,
          combined_net_benefit: combinedNetBenefit,
          single_best_benefit: singleBestBenefit,
          improvement_percentage: Math.round(improvement * 10) / 10,
        });
      }
    }
  }

  results.sort((a, b) => b.combined_net_benefit - a.combined_net_benefit);
  return results.slice(0, 3);
}

export function calculateMissedRewards(
  spending: SpendingData,
  currentCard: CardMetadata | null,
  bestCard: CardMetadata
): number {
  if (!currentCard) {
    const { totalRewards } = calculateCardRewards(spending, bestCard);
    return Math.round(totalRewards);
  }
  const current = calculateCardRewards(spending, currentCard);
  const best = calculateCardRewards(spending, bestCard);
  return Math.round(best.totalRewards - current.totalRewards);
}
