import type { Profile, SpendingData, CardRecommendation, MultiCardResult } from '../types';
import { CATEGORY_LABELS } from '../types';

interface ChatContext {
  profile: Profile | null;
  spending: SpendingData | null;
  recommendations: CardRecommendation[];
  multiCardResults: MultiCardResult[];
}

function generateResponse(message: string, ctx: ChatContext): string {
  const lower = message.toLowerCase();
  const { profile, spending, recommendations, multiCardResults } = ctx;

  if (!profile || !spending || recommendations.length === 0) {
    return "I'd love to help you with personalized advice, but I need your financial profile and spending data first. Please complete the Profile Input page so I can analyze your situation.";
  }

  const topCard = recommendations[0];
  const topBenefit = topCard.net_benefit;
  const topCardName = topCard.card.card_name;
  const income = profile.annual_income;
  const score = profile.credit_score;
  const annualSpend = spending.annual_spend;

  if (lower.includes('right card') || lower.includes('correct card') || lower.includes('best card') || lower.includes('which card')) {
    const topThree = recommendations.slice(0, 3).map((r, i) =>
      `${i + 1}. ${r.card.card_name} - Net benefit: Rs.${r.net_benefit.toLocaleString('en-IN')} (Approval: ${r.approval_probability}%)`
    ).join('\n');

    return `Based on your income of Rs.${(income / 100000).toFixed(1)}L, credit score of ${score}, and annual spending of Rs.${annualSpend.toLocaleString('en-IN')}, here are your top matches:\n\n${topThree}\n\n${topCardName} is the strongest match for your spending pattern, offering a net annual benefit of Rs.${topBenefit.toLocaleString('en-IN')}.`;
  }

  if (lower.includes('overspend') || lower.includes('spending') || lower.includes('where am i')) {
    const categories = recommendations[0].reward_breakdown
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 3);

    const topCats = categories.map(c =>
      `${CATEGORY_LABELS[c.category]}: Rs.${c.spend.toLocaleString('en-IN')} (earning ${(c.rate * 100).toFixed(1)}% back)`
    ).join('\n');

    const lowReward = recommendations[0].reward_breakdown
      .filter(c => c.spend > 0)
      .sort((a, b) => a.rate - b.rate)[0];

    return `Your highest spending categories:\n\n${topCats}\n\nYour lowest reward rate is in ${CATEGORY_LABELS[lowReward?.category || 'others']} at ${((lowReward?.rate || 0) * 100).toFixed(1)}%. Consider shifting some of this spend to a card that offers better rates in that category, or reducing this category if possible.`;
  }

  if (lower.includes('premium') || lower.includes('upgrade') || lower.includes('worth')) {
    const premiumCards = recommendations.filter(r => r.card.annual_fee >= 2000);
    if (premiumCards.length === 0) {
      return `With your current income of Rs.${(income / 100000).toFixed(1)}L and spending of Rs.${annualSpend.toLocaleString('en-IN')}, free or low-fee cards offer better value right now. Premium cards typically make sense when annual spending exceeds Rs.8-10L, as the higher rewards can justify the annual fees.`;
    }
    const best = premiumCards[0];
    return `For your profile, ${best.card.card_name} (fee: Rs.${best.card.annual_fee.toLocaleString('en-IN')}) delivers a net benefit of Rs.${best.net_benefit.toLocaleString('en-IN')} after accounting for the fee. It's ${best.net_benefit > 0 ? 'worth considering' : 'currently not cost-effective'}. The break-even spend for this card is approximately Rs.${Math.round(best.card.annual_fee / 0.03).toLocaleString('en-IN')} annually.`;
  }

  if (lower.includes('multi') || lower.includes('two card') || lower.includes('dual') || lower.includes('combo')) {
    if (multiCardResults.length === 0) {
      return `Multi-card optimization is most effective when annual spending exceeds Rs.7,00,000. Your current spend is Rs.${annualSpend.toLocaleString('en-IN')}. ${annualSpend < 700000 ? 'I recommend focusing on a single optimized card for now.' : 'Let me check if there are beneficial combinations...'}`;
    }
    const best = multiCardResults[0];
    return `The best dual-card strategy combines ${best.card_a.card_name} + ${best.card_b.card_name}:\n\n- Combined net benefit: Rs.${best.combined_net_benefit.toLocaleString('en-IN')}\n- That's ${best.improvement_percentage}% more than using a single card\n- Extra earnings: Rs.${(best.combined_net_benefit - best.single_best_benefit).toLocaleString('en-IN')}/year\n\nEach card handles the categories where it has the highest reward rate, maximizing your total returns.`;
  }

  if (lower.includes('approval') || lower.includes('approve') || lower.includes('chance') || lower.includes('probability')) {
    const topApproval = [...recommendations].sort((a, b) => b.approval_probability - a.approval_probability)[0];
    return `Your highest approval probability is for ${topApproval.card.card_name} at ${topApproval.approval_probability}% (${topApproval.risk_level} risk).\n\nKey factors:\n- Credit score of ${score} ${score >= 750 ? 'is strong' : score >= 650 ? 'is fair' : 'needs improvement'}\n- Income of Rs.${(income / 100000).toFixed(1)}L ${income >= 1000000 ? 'opens premium options' : 'qualifies for standard cards'}\n- ${profile.num_existing_cards} existing card(s) ${profile.num_existing_cards <= 2 ? 'is a positive signal' : 'may affect new approvals'}\n\n${score < 750 ? 'Tip: Improving your credit score above 750 could significantly boost approval chances across all premium cards.' : 'Your credit score is in a strong range for most cards.'}`;
  }

  if (lower.includes('save') || lower.includes('reward') || lower.includes('earn') || lower.includes('benefit')) {
    const totalRewards = topCard.total_rewards;
    return `With ${topCardName}, you can earn Rs.${totalRewards.toLocaleString('en-IN')} in annual rewards from your Rs.${annualSpend.toLocaleString('en-IN')} spending. After the annual fee of Rs.${topCard.card.annual_fee.toLocaleString('en-IN')}, your net benefit is Rs.${topBenefit.toLocaleString('en-IN')}.\n\nYour reward efficiency is ${((totalRewards / annualSpend) * 100).toFixed(2)}%, meaning you earn back about Rs.${((totalRewards / annualSpend) * 100).toFixed(0)} for every Rs.100 spent.`;
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello! I'm your FinOptima AI financial advisor. I can help you with:\n\n- Finding the right credit card for you\n- Understanding your spending patterns\n- Multi-card strategies\n- Approval probability insights\n- Whether premium cards are worth it\n\nWhat would you like to know?`;
  }

  if (lower.includes('improve') || lower.includes('tip') || lower.includes('advice') || lower.includes('suggest')) {
    const lowRewardCats = topCard.reward_breakdown
      .filter(c => c.spend > 0 && c.rate < 0.02)
      .map(c => CATEGORY_LABELS[c.category]);

    let tips = `Here are personalized tips based on your profile:\n\n`;
    tips += `1. ${topCardName} is currently your best match at Rs.${topBenefit.toLocaleString('en-IN')}/year net benefit.\n`;

    if (lowRewardCats.length > 0) {
      tips += `2. Your ${lowRewardCats.join(', ')} spending earns below 2% back. Consider a secondary card targeting these categories.\n`;
    }

    if (score < 750) {
      tips += `3. Improving your credit score from ${score} to 750+ could unlock premium cards with significantly higher rewards.\n`;
    }

    if (multiCardResults.length > 0) {
      tips += `4. A dual-card strategy could earn you ${multiCardResults[0].improvement_percentage}% more in rewards.\n`;
    }

    tips += `\nWant me to dive deeper into any of these areas?`;
    return tips;
  }

  return `I can help you with credit card optimization based on your profile. Try asking me:\n\n- "Am I choosing the right card?"\n- "Where am I overspending?"\n- "Should I get a premium card?"\n- "Is multi-card worth it?"\n- "What are my approval chances?"\n- "Give me tips to improve my rewards"\n\nWhat would you like to know?`;
}

export { generateResponse, type ChatContext };

