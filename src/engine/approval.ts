import type { Profile, CardMetadata, ApprovalPrediction, FeatureContribution } from '../types';

const WEIGHTS = {
  credit_score: 0.35,
  income: 0.25,
  age: 0.10,
  employment: 0.10,
  existing_cards: 0.10,
  dti: 0.10,
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function normalizeScore(score: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (score - min) / (max - min)));
}

const EMPLOYMENT_SCORES: Record<string, number> = {
  'Salaried': 0.85,
  'Business Owner': 0.75,
  'Self-Employed': 0.65,
  'Freelancer': 0.55,
  'Retired': 0.50,
  'Student': 0.30,
};

export function runApprovalPrediction(
  profile: Profile,
  card: CardMetadata
): ApprovalPrediction {
  const creditNorm = normalizeScore(profile.credit_score, 300, 900);
  const incomeRatio = Math.min(profile.annual_income / Math.max(card.min_income, 1), 3) / 3;
  const ageNorm = normalizeScore(profile.age, 18, 65);
  const empScore = EMPLOYMENT_SCORES[profile.employment_type] || 0.5;
  const cardsNorm = normalizeScore(Math.max(0, 5 - profile.num_existing_cards), 0, 5);
  const dtiNorm = normalizeScore(1 - profile.debt_to_income_ratio, 0, 1);

  const rawScore =
    creditNorm * WEIGHTS.credit_score +
    incomeRatio * WEIGHTS.income +
    ageNorm * WEIGHTS.age +
    empScore * WEIGHTS.employment +
    cardsNorm * WEIGHTS.existing_cards +
    dtiNorm * WEIGHTS.dti;

  const scaledScore = (rawScore - 0.3) * 8;
  const probability = Math.round(sigmoid(scaledScore) * 100);

  const riskLevel: 'Low' | 'Medium' | 'High' =
    probability >= 75 ? 'Low' : probability >= 50 ? 'Medium' : 'High';

  const meanCredit = 0.5;
  const meanIncome = 0.5;
  const meanAge = 0.5;
  const meanEmp = 0.6;
  const meanCards = 0.5;
  const meanDti = 0.5;

  const contributions: FeatureContribution[] = [
    {
      feature: 'credit_score',
      label: 'Credit Score',
      value: profile.credit_score,
      contribution: Math.round((creditNorm - meanCredit) * WEIGHTS.credit_score * 100),
      description: `Your credit score of ${profile.credit_score} ${creditNorm > meanCredit ? 'boosts' : 'reduces'} approval by ${Math.abs(Math.round((creditNorm - meanCredit) * WEIGHTS.credit_score * 100))}%`,
    },
    {
      feature: 'income',
      label: 'Income Level',
      value: profile.annual_income,
      contribution: Math.round((incomeRatio - meanIncome) * WEIGHTS.income * 100),
      description: `Your income of Rs.${(profile.annual_income / 100000).toFixed(1)}L ${incomeRatio > meanIncome ? 'increases' : 'decreases'} approval by ${Math.abs(Math.round((incomeRatio - meanIncome) * WEIGHTS.income * 100))}%`,
    },
    {
      feature: 'age',
      label: 'Age',
      value: profile.age,
      contribution: Math.round((ageNorm - meanAge) * WEIGHTS.age * 100),
      description: `Age of ${profile.age} has a ${ageNorm >= meanAge ? 'positive' : 'slight negative'} impact`,
    },
    {
      feature: 'employment',
      label: 'Employment Type',
      value: profile.employment_type as unknown as number,
      contribution: Math.round((empScore - meanEmp) * WEIGHTS.employment * 100),
      description: `${profile.employment_type} employment ${empScore >= meanEmp ? 'supports' : 'slightly lowers'} approval`,
    },
    {
      feature: 'existing_cards',
      label: 'Existing Cards',
      value: profile.num_existing_cards,
      contribution: Math.round((cardsNorm - meanCards) * WEIGHTS.existing_cards * 100),
      description: `Having ${profile.num_existing_cards} existing card(s) ${cardsNorm >= meanCards ? 'is favorable' : 'may reduce chances'}`,
    },
    {
      feature: 'dti',
      label: 'Debt-to-Income',
      value: profile.debt_to_income_ratio,
      contribution: Math.round((dtiNorm - meanDti) * WEIGHTS.dti * 100),
      description: `DTI ratio of ${(profile.debt_to_income_ratio * 100).toFixed(0)}% ${dtiNorm >= meanDti ? 'is healthy' : 'is a concern'}`,
    },
  ];

  return {
    card,
    approval_probability: probability,
    risk_level: riskLevel,
    feature_contributions: contributions,
  };
}
