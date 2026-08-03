/*
  # FinOptima Database Schema

  1. New Tables
    - `profiles` - User financial profiles
      - `id` (uuid, primary key, references auth.users)
      - `annual_income` (numeric) - Annual income in INR
      - `credit_score` (integer) - Credit score 300-900
      - `age` (integer) - User age
      - `employment_type` (text) - Salaried, Self-Employed, etc.
      - `existing_cards` (text) - Comma-separated existing cards
      - `num_existing_cards` (integer) - Number of existing cards
      - `debt_to_income_ratio` (numeric) - DTI ratio
      - `created_at` / `updated_at` (timestamptz)

    - `spending_data` - User spending distribution
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `annual_spend` (numeric) - Total annual spending
      - `travel` / `dining` / `shopping` / `groceries` / `fuel` / `online` / `others` (numeric) - Category amounts
      - `created_at` / `updated_at` (timestamptz)

    - `cards_metadata` - Credit card catalog
      - `id` (uuid, primary key)
      - `card_name` / `issuer` / `card_type` (text)
      - `annual_fee` / `welcome_bonus` / `min_income` / `min_credit_score` (numeric/integer)
      - `reward_rates` / `caps` (jsonb) - Per-category rates and caps
      - `tags` (text[]) - Card tags
      - `image_url` (text)

    - `recommendations` - Generated recommendations per user
    - `multi_card_results` - Multi-card optimization results
    - `approval_predictions` - Approval prediction results
    - `scenario_results` - Scenario simulation snapshots
    - `chat_history` - AI assistant conversation history

  2. Security
    - RLS enabled on ALL tables
    - Users can only access their own data
    - `cards_metadata` is readable by all authenticated users
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  annual_income numeric DEFAULT 0,
  credit_score integer DEFAULT 700,
  age integer DEFAULT 25,
  employment_type text DEFAULT 'Salaried',
  existing_cards text DEFAULT '',
  num_existing_cards integer DEFAULT 0,
  debt_to_income_ratio numeric DEFAULT 0.3,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Spending data table
CREATE TABLE IF NOT EXISTS spending_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  annual_spend numeric DEFAULT 0,
  travel numeric DEFAULT 0,
  dining numeric DEFAULT 0,
  shopping numeric DEFAULT 0,
  groceries numeric DEFAULT 0,
  fuel numeric DEFAULT 0,
  online numeric DEFAULT 0,
  others numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spending_user_id ON spending_data(user_id);

ALTER TABLE spending_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spending"
  ON spending_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spending"
  ON spending_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spending"
  ON spending_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own spending"
  ON spending_data FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Cards metadata table (catalog)
CREATE TABLE IF NOT EXISTS cards_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_name text NOT NULL,
  issuer text NOT NULL,
  card_type text DEFAULT 'Rewards',
  annual_fee numeric DEFAULT 0,
  welcome_bonus numeric DEFAULT 0,
  min_income numeric DEFAULT 0,
  min_credit_score integer DEFAULT 700,
  reward_rates jsonb DEFAULT '{}'::jsonb,
  caps jsonb DEFAULT '{}'::jsonb,
  tags text[] DEFAULT '{}',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cards_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view cards"
  ON cards_metadata FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  card_id uuid REFERENCES cards_metadata(id) ON DELETE CASCADE NOT NULL,
  net_benefit numeric DEFAULT 0,
  total_rewards numeric DEFAULT 0,
  rank integer DEFAULT 0,
  approval_probability numeric DEFAULT 0,
  risk_level text DEFAULT 'Medium',
  reward_breakdown jsonb DEFAULT '{}'::jsonb,
  calculated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
  ON recommendations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Multi-card results table
CREATE TABLE IF NOT EXISTS multi_card_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  card_a_id uuid REFERENCES cards_metadata(id) ON DELETE CASCADE NOT NULL,
  card_b_id uuid REFERENCES cards_metadata(id) ON DELETE CASCADE NOT NULL,
  category_allocation jsonb DEFAULT '{}'::jsonb,
  combined_net_benefit numeric DEFAULT 0,
  single_best_benefit numeric DEFAULT 0,
  improvement_percentage numeric DEFAULT 0,
  calculated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_multicard_user_id ON multi_card_results(user_id);

ALTER TABLE multi_card_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own multi-card results"
  ON multi_card_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own multi-card results"
  ON multi_card_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own multi-card results"
  ON multi_card_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Approval predictions table
CREATE TABLE IF NOT EXISTS approval_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  card_id uuid REFERENCES cards_metadata(id) ON DELETE CASCADE NOT NULL,
  approval_probability numeric DEFAULT 0,
  risk_level text DEFAULT 'Medium',
  feature_contributions jsonb DEFAULT '{}'::jsonb,
  calculated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_approval_user_id ON approval_predictions(user_id);

ALTER TABLE approval_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own approval predictions"
  ON approval_predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own approval predictions"
  ON approval_predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own approval predictions"
  ON approval_predictions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Scenario results table
CREATE TABLE IF NOT EXISTS scenario_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  modified_params jsonb DEFAULT '{}'::jsonb,
  original_benefit numeric DEFAULT 0,
  new_benefit numeric DEFAULT 0,
  delta_benefit numeric DEFAULT 0,
  best_card_name text DEFAULT '',
  insights jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scenario_user_id ON scenario_results(user_id);

ALTER TABLE scenario_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scenario results"
  ON scenario_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scenario results"
  ON scenario_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scenario results"
  ON scenario_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chat history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  message text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_history(user_id);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat history"
  ON chat_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
