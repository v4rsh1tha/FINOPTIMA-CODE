import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IndianRupee, CreditCard, Briefcase, User, Gauge,
  ArrowRight, Loader2, Sliders,
} from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { SPENDING_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, EMPLOYMENT_TYPES } from '../types';
import type { SpendingCategory } from '../types';

const DEFAULTS: Record<string, Record<SpendingCategory, number>> = {
  'Salaried': { travel: 10, dining: 15, shopping: 20, groceries: 25, fuel: 10, online: 15, others: 5 },
  'Self-Employed': { travel: 15, dining: 10, shopping: 15, groceries: 20, fuel: 10, online: 20, others: 10 },
  'Business Owner': { travel: 20, dining: 15, shopping: 15, groceries: 15, fuel: 10, online: 15, others: 10 },
  'Freelancer': { travel: 10, dining: 15, shopping: 15, groceries: 20, fuel: 5, online: 25, others: 10 },
  'Student': { travel: 5, dining: 20, shopping: 20, groceries: 15, fuel: 5, online: 25, others: 10 },
  'Retired': { travel: 15, dining: 10, shopping: 10, groceries: 30, fuel: 10, online: 10, others: 15 },
};

export default function ProfileInput() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, spending, saveProfile, saveSpending, runEngine, loading } = useData();
  const [saving, setSaving] = useState(false);

  const [income, setIncome] = useState(800000);
  const [creditScore, setCreditScore] = useState(750);
  const [age, setAge] = useState(30);
  const [employment, setEmployment] = useState('Salaried');
  const [existingCards, setExistingCards] = useState('');
  const [numCards, setNumCards] = useState(1);
  const [dti, setDti] = useState(30);
  const [annualSpend, setAnnualSpend] = useState(500000);
  const [sliders, setSliders] = useState<Record<SpendingCategory, number>>(DEFAULTS['Salaried']);

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setIncome(profile.annual_income || 800000);
      setCreditScore(profile.credit_score || 750);
      setAge(profile.age || 30);
      setEmployment(profile.employment_type || 'Salaried');
      setExistingCards(profile.existing_cards || '');
      setNumCards(profile.num_existing_cards || 1);
      setDti(Math.round((profile.debt_to_income_ratio || 0.3) * 100));
    }
    if (spending) {
      setAnnualSpend(spending.annual_spend || 500000);
      const total = SPENDING_CATEGORIES.reduce((s, c) => s + (spending[c] || 0), 0);
      if (total > 0) {
        const pcts: Record<string, number> = {};
        SPENDING_CATEGORIES.forEach(c => { pcts[c] = Math.round(((spending[c] || 0) / total) * 100); });
        setSliders(pcts as Record<SpendingCategory, number>);
      }
    }
  }, [profile, spending]);

  const handleEmploymentChange = (emp: string) => {
    setEmployment(emp);
    if (!spending && DEFAULTS[emp]) setSliders(DEFAULTS[emp]);
  };

  const totalPct = useMemo(() =>
    SPENDING_CATEGORIES.reduce((s, c) => s + (sliders[c] || 0), 0),
    [sliders]
  );

  const handleSlider = (cat: SpendingCategory, val: number) => {
    setSliders(prev => ({ ...prev, [cat]: val }));
  };

  const pieData = useMemo(() =>
    SPENDING_CATEGORIES.map(c => ({
      name: CATEGORY_LABELS[c],
      value: sliders[c] || 0,
      color: CATEGORY_COLORS[c],
    })).filter(d => d.value > 0),
    [sliders]
  );

  const handleSubmit = async () => {
    if (totalPct !== 100) return;
    setSaving(true);

    await saveProfile({
      annual_income: income,
      credit_score: creditScore,
      age,
      employment_type: employment,
      existing_cards: existingCards,
      num_existing_cards: numCards,
      debt_to_income_ratio: dti / 100,
    });

    const spendingAmounts: Record<string, number> = { annual_spend: annualSpend };
    SPENDING_CATEGORIES.forEach(c => {
      spendingAmounts[c] = Math.round(annualSpend * (sliders[c] / 100));
    });
    await saveSpending(spendingAmounts);
    await runEngine();
    setSaving(false);
    navigate('/dashboard');
  };

  const scoreColor = creditScore >= 750 ? 'text-emerald-400' : creditScore >= 650 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Build Your <span className="gradient-text">Financial Profile</span>
          </h1>
          <p className="text-gray-400">
            Help us understand your finances to deliver personalized recommendations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-fin-emerald/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-fin-emerald" />
              </div>
              <h2 className="text-xl font-semibold">Financial Information</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Annual Income</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={income}
                    onChange={e => setIncome(Number(e.target.value))}
                    className="input-field !pl-10"
                    min={0}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1 block">
                  {(income / 100000).toFixed(1)}L per annum
                </span>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm text-gray-400">Credit Score</label>
                  <span className={`text-sm font-semibold ${scoreColor}`}>{creditScore}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={900}
                  value={creditScore}
                  onChange={e => setCreditScore(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>300</span>
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Excellent</span>
                  <span>900</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Age</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      value={age}
                      onChange={e => setAge(Number(e.target.value))}
                      className="input-field !pl-10"
                      min={18}
                      max={80}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Employment</label>
                  <select
                    value={employment}
                    onChange={e => handleEmploymentChange(e.target.value)}
                    className="input-field"
                  >
                    {EMPLOYMENT_TYPES.map(t => (
                      <option key={t} value={t} className="bg-fin-dark">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Existing Cards (optional)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={existingCards}
                    onChange={e => setExistingCards(e.target.value)}
                    placeholder="e.g., HDFC Regalia, SBI ELITE"
                    className="input-field !pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Number of Cards</label>
                  <input
                    type="number"
                    value={numCards}
                    onChange={e => setNumCards(Number(e.target.value))}
                    className="input-field"
                    min={0}
                    max={20}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm text-gray-400">Debt-to-Income %</label>
                    <span className="text-sm text-gray-300">{dti}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    value={dti}
                    onChange={e => setDti(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-fin-emerald/10 flex items-center justify-center">
                <Sliders className="w-5 h-5 text-fin-emerald" />
              </div>
              <h2 className="text-xl font-semibold">Spending Distribution</h2>
            </div>

            <div className="mb-5">
              <label className="text-sm text-gray-400 mb-1.5 block">Annual Spending</label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={annualSpend}
                  onChange={e => setAnnualSpend(Number(e.target.value))}
                  className="input-field !pl-10"
                  min={0}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                Monthly: {'\u20B9'}{Math.round(annualSpend / 12).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {SPENDING_CATEGORIES.map(cat => (
                <div key={cat}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">{CATEGORY_LABELS[cat]}</span>
                    <div className="flex gap-3 text-sm">
                      <span className="text-gray-500">
                        {'\u20B9'}{Math.round(annualSpend * (sliders[cat] / 100)).toLocaleString('en-IN')}
                      </span>
                      <span className="text-fin-emerald font-medium w-10 text-right">{sliders[cat]}%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={sliders[cat]}
                    onChange={e => handleSlider(cat, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>

            <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg mb-6 ${
              totalPct === 100 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'
            }`}>
              <span className="text-sm">Total Allocation</span>
              <span className={`font-semibold ${totalPct === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {totalPct}%
              </span>
            </div>

            {pieData.length > 0 && (
              <div className="flex items-center justify-center mb-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer>
                    <RePie>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111',
                          border: '1px solid #1E1E1E',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                        formatter={(val) => `${val}%`}
                      />
                    </RePie>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="flex gap-3 flex-wrap justify-center mb-4">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <button
            onClick={handleSubmit}
            disabled={totalPct !== 100 || saving || loading}
            className="btn-primary text-lg !px-10 !py-4 glow-emerald flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving || loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Gauge className="w-5 h-5" />
                Generate Recommendations
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
