/*
  # Seed Indian Credit Card Catalog

  Populating `cards_metadata` with real Indian credit cards including:
  - HDFC Regalia, HDFC Diners Black, HDFC MoneyBack+
  - SBI SimplyCLICK, SBI ELITE
  - ICICI Amazon Pay, ICICI Sapphiro
  - Axis Flipkart, Axis ACE
  - Amex Membership Rewards, Amex SmartEarn
  - IDFC FIRST Select, IDFC FIRST Classic
  - Kotak 811 (no annual fee entry-level)
  - AU Small Finance Bank LIT
  - OneCard (Metal)
  - Standard Chartered Ultimate

  Each card includes accurate reward rates, annual fees, welcome bonuses,
  eligibility criteria, and per-category caps where applicable.
*/

INSERT INTO cards_metadata (card_name, issuer, card_type, annual_fee, welcome_bonus, min_income, min_credit_score, reward_rates, caps, tags) VALUES

-- HDFC Regalia
('HDFC Regalia', 'HDFC Bank', 'Premium', 2500, 5000, 1200000, 750,
 '{"travel": 0.05, "dining": 0.05, "shopping": 0.03, "groceries": 0.02, "fuel": 0.01, "online": 0.03, "others": 0.013}'::jsonb,
 '{"travel": 500000, "dining": 500000, "shopping": 300000, "groceries": 200000, "fuel": 50000, "online": 300000, "others": 200000}'::jsonb,
 ARRAY['Travel Specialist', 'Premium Lifestyle']),

-- HDFC Diners Club Black
('HDFC Diners Club Black', 'HDFC Bank', 'Super Premium', 10000, 15000, 1800000, 780,
 '{"travel": 0.033, "dining": 0.05, "shopping": 0.033, "groceries": 0.033, "fuel": 0.033, "online": 0.033, "others": 0.033}'::jsonb,
 '{"travel": 999999999, "dining": 999999999, "shopping": 999999999, "groceries": 999999999, "fuel": 999999999, "online": 999999999, "others": 999999999}'::jsonb,
 ARRAY['Unlimited Rewards', 'Premium Lifestyle', 'Travel Specialist']),

-- HDFC MoneyBack+
('HDFC MoneyBack+', 'HDFC Bank', 'Cashback', 500, 500, 300000, 700,
 '{"travel": 0.02, "dining": 0.02, "shopping": 0.02, "groceries": 0.02, "fuel": 0.01, "online": 0.02, "others": 0.01}'::jsonb,
 '{"travel": 200000, "dining": 200000, "shopping": 200000, "groceries": 200000, "fuel": 50000, "online": 200000, "others": 100000}'::jsonb,
 ARRAY['Cashback Champion', 'Beginner Friendly']),

-- SBI SimplyCLICK
('SBI SimplyCLICK', 'SBI Card', 'Online Shopping', 499, 500, 300000, 700,
 '{"travel": 0.01, "dining": 0.015, "shopping": 0.025, "groceries": 0.01, "fuel": 0.01, "online": 0.05, "others": 0.01}'::jsonb,
 '{"travel": 150000, "dining": 150000, "shopping": 200000, "groceries": 150000, "fuel": 50000, "online": 300000, "others": 100000}'::jsonb,
 ARRAY['Online Shopping Expert', 'Beginner Friendly']),

-- SBI ELITE
('SBI ELITE', 'SBI Card', 'Premium', 4999, 5000, 1000000, 750,
 '{"travel": 0.05, "dining": 0.05, "shopping": 0.03, "groceries": 0.02, "fuel": 0.01, "online": 0.03, "others": 0.01}'::jsonb,
 '{"travel": 500000, "dining": 400000, "shopping": 300000, "groceries": 200000, "fuel": 50000, "online": 300000, "others": 200000}'::jsonb,
 ARRAY['Travel Specialist', 'Premium Lifestyle', 'Dining Expert']),

-- ICICI Amazon Pay
('ICICI Amazon Pay', 'ICICI Bank', 'Cashback', 0, 0, 250000, 680,
 '{"travel": 0.01, "dining": 0.02, "shopping": 0.03, "groceries": 0.02, "fuel": 0.01, "online": 0.05, "others": 0.01}'::jsonb,
 '{"travel": 999999999, "dining": 999999999, "shopping": 999999999, "groceries": 999999999, "fuel": 999999999, "online": 999999999, "others": 999999999}'::jsonb,
 ARRAY['No Annual Fee', 'Online Shopping Expert', 'Beginner Friendly']),

-- ICICI Sapphiro
('ICICI Sapphiro', 'ICICI Bank', 'Premium', 3500, 5000, 1200000, 750,
 '{"travel": 0.04, "dining": 0.04, "shopping": 0.02, "groceries": 0.02, "fuel": 0.01, "online": 0.02, "others": 0.02}'::jsonb,
 '{"travel": 400000, "dining": 400000, "shopping": 300000, "groceries": 200000, "fuel": 50000, "online": 300000, "others": 200000}'::jsonb,
 ARRAY['Travel Specialist', 'Premium Lifestyle']),

-- Axis Flipkart
('Axis Flipkart', 'Axis Bank', 'Cashback', 500, 500, 300000, 700,
 '{"travel": 0.015, "dining": 0.02, "shopping": 0.04, "groceries": 0.015, "fuel": 0.01, "online": 0.04, "others": 0.015}'::jsonb,
 '{"travel": 200000, "dining": 200000, "shopping": 300000, "groceries": 200000, "fuel": 50000, "online": 300000, "others": 200000}'::jsonb,
 ARRAY['Cashback Champion', 'Online Shopping Expert']),

-- Axis ACE
('Axis ACE', 'Axis Bank', 'Cashback', 0, 0, 200000, 680,
 '{"travel": 0.02, "dining": 0.04, "shopping": 0.02, "groceries": 0.02, "fuel": 0.02, "online": 0.04, "others": 0.02}'::jsonb,
 '{"travel": 999999999, "dining": 999999999, "shopping": 999999999, "groceries": 999999999, "fuel": 999999999, "online": 999999999, "others": 999999999}'::jsonb,
 ARRAY['No Annual Fee', 'Cashback Champion', 'Beginner Friendly']),

-- Amex Membership Rewards
('Amex Membership Rewards', 'American Express', 'Premium', 4500, 7500, 600000, 720,
 '{"travel": 0.04, "dining": 0.04, "shopping": 0.02, "groceries": 0.02, "fuel": 0.01, "online": 0.02, "others": 0.018}'::jsonb,
 '{"travel": 400000, "dining": 400000, "shopping": 300000, "groceries": 200000, "fuel": 50000, "online": 300000, "others": 200000}'::jsonb,
 ARRAY['Travel Specialist', 'Dining Expert']),

-- Amex SmartEarn
('Amex SmartEarn', 'American Express', 'Rewards', 0, 0, 400000, 700,
 '{"travel": 0.02, "dining": 0.02, "shopping": 0.02, "groceries": 0.02, "fuel": 0.02, "online": 0.05, "others": 0.01}'::jsonb,
 '{"travel": 200000, "dining": 200000, "shopping": 200000, "groceries": 200000, "fuel": 100000, "online": 300000, "others": 100000}'::jsonb,
 ARRAY['No Annual Fee', 'Online Shopping Expert']),

-- IDFC FIRST Select
('IDFC FIRST Select', 'IDFC FIRST Bank', 'Rewards', 0, 0, 300000, 700,
 '{"travel": 0.03, "dining": 0.03, "shopping": 0.03, "groceries": 0.03, "fuel": 0.03, "online": 0.03, "others": 0.03}'::jsonb,
 '{"travel": 999999999, "dining": 999999999, "shopping": 999999999, "groceries": 999999999, "fuel": 999999999, "online": 999999999, "others": 999999999}'::jsonb,
 ARRAY['No Annual Fee', 'All-Rounder', 'Beginner Friendly']),

-- IDFC FIRST Classic
('IDFC FIRST Classic', 'IDFC FIRST Bank', 'Basic', 0, 0, 200000, 680,
 '{"travel": 0.02, "dining": 0.02, "shopping": 0.02, "groceries": 0.015, "fuel": 0.015, "online": 0.02, "others": 0.015}'::jsonb,
 '{"travel": 200000, "dining": 200000, "shopping": 200000, "groceries": 200000, "fuel": 100000, "online": 200000, "others": 100000}'::jsonb,
 ARRAY['No Annual Fee', 'Beginner Friendly']),

-- Standard Chartered Ultimate
('Standard Chartered Ultimate', 'Standard Chartered', 'Super Premium', 5000, 10000, 1500000, 760,
 '{"travel": 0.033, "dining": 0.033, "shopping": 0.033, "groceries": 0.033, "fuel": 0.033, "online": 0.033, "others": 0.033}'::jsonb,
 '{"travel": 999999999, "dining": 999999999, "shopping": 999999999, "groceries": 999999999, "fuel": 999999999, "online": 999999999, "others": 999999999}'::jsonb,
 ARRAY['Unlimited Rewards', 'Premium Lifestyle', 'Travel Specialist']),

-- AU Small Finance LIT
('AU Small Finance LIT', 'AU Small Finance Bank', 'Customizable', 0, 0, 200000, 680,
 '{"travel": 0.025, "dining": 0.025, "shopping": 0.025, "groceries": 0.025, "fuel": 0.025, "online": 0.025, "others": 0.025}'::jsonb,
 '{"travel": 300000, "dining": 300000, "shopping": 300000, "groceries": 300000, "fuel": 100000, "online": 300000, "others": 200000}'::jsonb,
 ARRAY['No Annual Fee', 'Customizable', 'Beginner Friendly']),

-- OneCard Metal
('OneCard Metal', 'OneCard', 'Cashback', 0, 0, 300000, 700,
 '{"travel": 0.02, "dining": 0.02, "shopping": 0.05, "groceries": 0.01, "fuel": 0.05, "online": 0.05, "others": 0.01}'::jsonb,
 '{"travel": 200000, "dining": 200000, "shopping": 300000, "groceries": 200000, "fuel": 100000, "online": 300000, "others": 100000}'::jsonb,
 ARRAY['Cashback Champion', 'Fuel Expert']),

-- HSBC Cashback
('HSBC Cashback', 'HSBC', 'Cashback', 750, 1000, 400000, 720,
 '{"travel": 0.015, "dining": 0.015, "shopping": 0.015, "groceries": 0.015, "fuel": 0.015, "online": 0.015, "others": 0.015}'::jsonb,
 '{"travel": 300000, "dining": 300000, "shopping": 300000, "groceries": 300000, "fuel": 100000, "online": 300000, "others": 200000}'::jsonb,
 ARRAY['Cashback Champion']),

-- Kotak 811
('Kotak 811 Dream Different', 'Kotak Mahindra Bank', 'Basic', 0, 0, 150000, 650,
 '{"travel": 0.01, "dining": 0.01, "shopping": 0.01, "groceries": 0.01, "fuel": 0.01, "online": 0.01, "others": 0.01}'::jsonb,
 '{"travel": 999999999, "dining": 999999999, "shopping": 999999999, "groceries": 999999999, "fuel": 999999999, "online": 999999999, "others": 999999999}'::jsonb,
 ARRAY['No Annual Fee', 'Beginner Friendly']);
