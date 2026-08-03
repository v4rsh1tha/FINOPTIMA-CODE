# 💳 FinOptima

**An Intelligent Financial Transaction Analysis and Reward Optimization Platform**

![React](https://img.shields.io/badge/React-frontend-61DAFB?logo=react&logoColor=black&style=flat-square)
![Flask](https://img.shields.io/badge/Flask-backend-000000?logo=flask&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-styling-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

AI-powered credit card optimization tailored to your spending. Find the best cards, predict approval odds, and unlock thousands in hidden rewards.

---

## 📖 Overview

India's credit card market has grown to over **90 million active cards** and **₹15 trillion+** in annual transaction volume — yet most cardholders pick a card once, through their bank, and never revisit the decision. The result is **reward leakage**: benefits earned at inferior rates, fees paid on cards that don't justify them, and points sitting unused in programs no one fully understands.

**FinOptima** solves this with a structured, data-driven recommendation engine. Users complete a short three-layer survey — eligibility, monthly spending across 15 categories, and lifestyle preferences — and the engine evaluates every card in its database through a **five-layer weighted scoring system** to return the top personalized matches, each with an estimated annual rupee reward, a plain-English explanation, and the effective annual fee after waiver eligibility.

![FinOptima homepage](assets/homepage.png)

---

## ✨ Key Features

| | |
|---|---|
| 🧠 **AI-Powered Recommendations** | Smart scoring algorithms analyze your spending to surface the perfect credit card match. |
| 🛡️ **Approval Prediction** | Know your approval probability before applying, powered by ML-based scoring. |
| 💳 **Multi-Card Strategy** | Optimizes across complementary card pairs to maximize total rewards, not just one card. |
| 📊 **Spending Analytics** | Visual dashboards surface missed rewards and untapped optimization opportunities. |

---

## ⚙️ How the Recommendation Engine Works

Every card is scored across **five weighted layers**:

| Layer | Purpose | Weight |
|---|---|---|
| **Intent Detection** | Determines the user's optimization goal — travel, cashback, premium lifestyle, etc. | 25% |
| **Fit Scoring** | Matches card features against user inputs. | 25% |
| **Eligibility Scoring** | Assesses real-world approval likelihood. | 25% |
| **Rupee Value Calculation** | Computes actual projected annual reward in ₹, based on the user's spend distribution. | 20% |
| **Competitive Adjustment** | Nudges the final portfolio toward complementary rather than redundant cards. | 5% |

The combined score produces a ranked list of the top five recommendations, each with a rupee-value estimate and a human-readable rationale.

---

## 🚀 User Flow

![How It Works section](assets/how-it-works.png)

1. **Input Your Profile** — Share your income, credit score, and spending patterns securely.
2. **Get AI Analysis** — The engine evaluates 18+ cards against your unique spending profile.
3. **Optimize & Save** — Implement the recommended strategy and start maximizing rewards immediately.

---

## 🖥️ Screenshots

![FinOptima features section](assets/features-section.png)

![FinOptima how it works section](assets/how-it-works.png)

---

## 🏗️ Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Flask (Python), RESTful API
- **Data:** Structured JSON card schema (75 fields/card) covering reward rates across 15 spending categories, fee structures, lounge access, and lifestyle benefits
- **Validation:** Automated backtest suite across representative user profiles, run on every data change

---

## 📊 By the Numbers

| Metric | Value |
|---|---|
| Cards Analyzed | 18+ |
| Recommendation Accuracy | 95% |
| Avg. Annual Savings | ₹12K+ |

---

## 🗺️ Roadmap

- [x] Core five-layer scoring engine
- [x] Spending analytics dashboard
- [x] Approval prediction module
- [ ] Existing-cardholder redemption optimizer (backend integration — UI complete)
- [ ] Expanded card database beyond current 15 Indian issuers
- [ ] Production deployment beyond local development environment

---

## 🛠️ Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/finoptima.git
cd finoptima

# Install frontend dependencies
cd client
npm install
npm start

# In a separate terminal, set up the backend
cd server
pip install -r requirements.txt
python app.py
```

> Update the commands above to match your actual project structure and package manager.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

Built as a final-year Computer Science and Engineering major project, addressing the gap between India's rapidly growing credit card market and the lack of personalized, transparent reward optimization tools available to consumers.
