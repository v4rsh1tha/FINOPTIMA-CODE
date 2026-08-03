export interface Profile {
  id: string;
  annual_income: number;
  credit_score: number;
  age: number;
  employment_type: string;
  existing_cards: string;
  num_existing_cards: number;
  debt_to_income_ratio: number;
  created_at: string;
  updated_at: string;
}

export interface SpendingData {
  id: string;
  user_id: string;
  annual_spend: number;
  travel: number;
  dining: number;
  shopping: number;
  groceries: number;
  fuel: number;
  online: number;
  others: number;
  created_at: string;
  updated_at: string;
}

export type SpendingCategory = 'travel' | 'dining' | 'shopping' | 'groceries' | 'fuel' | 'online' | 'others';

export const SPENDING_CATEGORIES: SpendingCategory[] = [
  'travel', 'dining', 'shopping', 'groceries', 'fuel', 'online', 'others'
];

export const CATEGORY_COLORS: Record<SpendingCategory, string> = {
  travel: '#10B981',
  dining: '#14B8A6',
  shopping: '#06B6D4',
  groceries: '#22D3EE',
  fuel: '#F59E0B',
  online: '#8B5CF6',
  others: '#6B7280',
};

export const CATEGORY_LABELS: Record<SpendingCategory, string> = {
  travel: 'Travel',
  dining: 'Dining',
  shopping: 'Shopping',
  groceries: 'Groceries',
  fuel: 'Fuel',
  online: 'Online',
  others: 'Others',
};

export interface CardMetadata {
  id: string;
  card_name: string;
  issuer: string;
  card_type: string;
  annual_fee: number;
  welcome_bonus: number;
  min_income: number;
  min_credit_score: number;
  reward_rates: Record<SpendingCategory, number>;
  caps: Record<SpendingCategory, number>;
  tags: string[];
  image_url: string;
  created_at: string;
}

export interface RewardBreakdown {
  category: SpendingCategory;
  spend: number;
  rate: number;
  cap: number;
  reward: number;
}

export interface CardRecommendation {
  card: CardMetadata;
  net_benefit: number;
  total_rewards: number;
  reward_breakdown: RewardBreakdown[];
  approval_probability: number;
  risk_level: 'Low' | 'Medium' | 'High';
  rank: number;
}

export interface MultiCardResult {
  card_a: CardMetadata;
  card_b: CardMetadata;
  category_allocation: Record<SpendingCategory, string>;
  combined_net_benefit: number;
  single_best_benefit: number;
  improvement_percentage: number;
}

export interface ApprovalPrediction {
  card: CardMetadata;
  approval_probability: number;
  risk_level: 'Low' | 'Medium' | 'High';
  feature_contributions: FeatureContribution[];
}

export interface FeatureContribution {
  feature: string;
  label: string;
  value: number;
  contribution: number;
  description: string;
}

export interface ScenarioResult {
  modified_params: Partial<SpendingData & Profile>;
  original_benefit: number;
  new_benefit: number;
  delta_benefit: number;
  best_card_name: string;
  insights: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export const EMPLOYMENT_TYPES = [
  'Salaried',
  'Self-Employed',
  'Business Owner',
  'Freelancer',
  'Student',
  'Retired',
] as const;
