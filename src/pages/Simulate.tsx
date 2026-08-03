import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FlaskConical, ArrowRight, TrendingUp, TrendingDown,
  Lightbulb, RotateCcw, IndianRupee, Zap,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import AnimatedCounter from '../components/AnimatedCounter';
import { SPENDING_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS } from '../types';
import { runRecommendationEngine } from '../engine/recommendation';
import type { SpendingCategory, SpendingData } from '../types';

const PRESETS = [
  { label: 'More Travel', changes: { travel: 30, dining: 10, shopping: 15, groceries: 15, fuel: 10, online: 15, others: 5 } },
  { label: 'Online Heavy', changes: { travel: 5, dining: 10, shopping: 15, groceries: 15, fuel: 5, online: 40, others: 10 } },
  { label: 'Balanced', changes: { travel: 14, dining: 14, shopping: 15, groceries: 15, fuel: 14, online: 14, others: 14 } },
  { label: 'Fuel Focus', changes: { travel: 10, dining: 10, shopping: 10, groceries: 20, fuel: 30, online: 10, others: 10 } },
];

export default function Simulate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, spending, cards, recommendations } = useData();

  const [simSliders, setSimSliders] = useState<Record<SpendingCategory, number>>({
    travel: 15, dining: 15, shopping: 15, groceries: 20, fuel: 10, online: 15, others: 10,
  });
  const [simIncome, setSimIncome] = useState(0);
  const [simScore, setSimScore] = useState(750);
  const [simSpend, setSimSpend] = useState(500000);

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  useEffect(() => {
    if (spending && profile) {
      setSimSpend(spending.annual_spend);
      setSimIncome(profile.annual_income);
      setSimScore(profile.credit_score);
      const total = SPENDING_CATEGORIES.reduce((s, c) => s + (spending[c] || 0), 0);
      if (total > 0) {
        const pcts: Record<string, number> = {};
        SPENDING_CATEGORIES.forEach(c => { pcts[c] = Math.round(((spending[c] || 0) / total) * 100); });
        setSimSliders(pcts as Record<SpendingCategory, number>);
      }
    }
  }, [spending, profile]);

  const originalBenefit = recommendations.length > 0 ? recommendations[0].net_benefit : 0;
  const originalCard = recommendations.length > 0 ? recommendations[0].card.card_name : '';

  const simResults = useMemo(() => {
    if (!profile || cards.length === 0) return null;

    const simProfile = { ...profile, annual_income: simIncome, credit_score: simScore };
    const simSpending: SpendingData = {
      id: '', user_id: '', created_at: '', updated_at: '',
      annual_spend: simSpend,
      travel: Math.round(simSpend * simSliders.travel / 100),
      dining: Math.round(simSpend * simSliders.dining / 100),
      shopping: Math.round(simSpend * simSliders.shopping / 100),
      groceries: Math.round(simSpend * simSliders.groceries / 100),
      fuel: Math.round(simSpend * simSliders.fuel / 100),
      online: Math.round(simSpend * simSliders.online / 100),
      others: Math.round(simSpend * simSliders.others / 100),
    };

    const recs = runRecommendationEngine(simProfile, simSpending, cards);
    if (recs.length === 0) return null;

    const newBenefit = recs[0].net_benefit;
    const delta = newBenefit - originalBenefit;

    const sensitivityData = SPENDING_CATEGORIES.map(cat => {
      const boosted = { ...simSliders };
      const current = boosted[cat];
      boosted[cat] = Math.min(current + 10, 60);
      const remaining = 100 - boosted[cat];
      const othersTotal = Object.entries(boosted)
        .filter(([k]) => k !== cat)
        .reduce((s, [, v]) => s + v, 0);

      if (othersTotal > 0) {
        for (const k of SPENDING_CATEGORIES) {
          if (k !== cat) boosted[k] = Math.round(boosted[k] * remaining / othersTotal);
        }
      }

      const boostedSpending: SpendingData = {
        id: '', user_id: '', created_at: '', updated_at: '',
        annual_spend: simSpend,
        travel: Math.round(simSpend * boosted.travel / 100),
        dining: Math.round(simSpend * boosted.dining / 100),
        shopping: Math.round(simSpend * boosted.shopping / 100),
        groceries: Math.round(simSpend * boosted.groceries / 100),
        fuel: Math.round(simSpend * boosted.fuel / 100),
        online: Math.round(simSpend * boosted.online / 100),
        others: Math.round(simSpend * boosted.others / 100),
      };

      const boostedRecs = runRecommendationEngine(simProfile, boostedSpending, cards);
      const boostedBenefit = boostedRecs.length > 0 ? boostedRecs[0].net_benefit : 0;

      return {
        category: CATEGORY_LABELS[cat],
        impact: boostedBenefit - newBenefit,
        fill: CATEGORY_COLORS[cat],
      };
    });

    return { bestCard: recs[0].card.card_name, newBenefit, delta, sensitivityData, topRecs: recs.slice(0, 3) };
  }, [profile, cards, simSliders, simIncome, simScore, simSpend, originalBenefit]);

  const totalPct = SPENDING_CATEGORIES.reduce((s, c) => s + simSliders[c], 0);

  const resetSliders = () => {
    if (spending && profile) {
      setSimSpend(spending.annual_spend);
      setSimIncome(profile.annual_income);
      setSimScore(profile.credit_score);
      const total = SPENDING_CATEGORIES.reduce((s, c) => s + (spending[c] || 0), 0);
      if (total > 0) {
        const pcts: Record<string, number> = {};
        SPENDING_CATEGORIES.forEach(c => { pcts[c] = Math.round(((spending[c] || 0) / total) * 100); });
        setSimSliders(pcts as Record<SpendingCategory, number>);
      }
    }
  };

  if (!profile || !spending) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-fin-emerald/10 flex items-center justify-center mx-auto mb-6">
          <FlaskConical className="w-8 h-8 text-fin-emerald" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Set Up Your Profile First</h2>
        <p className="text-gray-400 mb-6">Complete your profile to run scenario simulations.</p>
        <button onClick={() => navigate('/profile')} className="btn-primary inline-flex items-center gap-2">
          Set Up Profile <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-1">
            Scenario <span className="gradient-text">Simulator</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Adjust your financial parameters and see how recommendations change in real-time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Adjust Parameters</h2>
              <button onClick={resetSliders} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Annual Income</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="number"
                    value={simIncome}
                    onChange={e => setSimIncome(Number(e.target.value))}
                    className="input-field !pl-9 !py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-400">Credit Score</label>
                  <span className="text-sm font-medium">{simScore}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={900}
                  value={simScore}
                  onChange={e => setSimScore(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Annual Spend</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="number"
                    value={simSpend}
                    onChange={e => setSimSpend(Number(e.target.value))}
                    className="input-field !pl-9 !py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {SPENDING_CATEGORIES.map(cat => (
                <div key={cat}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs text-gray-400">{CATEGORY_LABELS[cat]}</span>
                    <span className="text-xs text-fin-emerald font-medium">{simSliders[cat]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={simSliders[cat]}
                    onChange={e => setSimSliders(prev => ({ ...prev, [cat]: Number(e.target.value) }))}
                  />
                </div>
              ))}
            </div>

            <div className={`text-center text-xs px-3 py-2 rounded-lg ${
              totalPct === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              Total: {totalPct}%
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => setSimSliders(p.changes as Record<SpendingCategory, number>)}
                  className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-gray-400 hover:border-fin-emerald/30 hover:text-white transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {simResults && totalPct === 100 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-5">
                    <div className="text-xs text-gray-500 mb-1">Original Best</div>
                    <div className="text-lg font-bold">{originalCard || 'N/A'}</div>
                    <div className="text-xl font-bold text-gray-400 mt-1">
                      {'\u20B9'}{originalBenefit.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="glass-card p-5">
                    <div className="text-xs text-gray-500 mb-1">Scenario Best</div>
                    <div className="text-lg font-bold">{simResults.bestCard}</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1">
                      {'\u20B9'}{simResults.newBenefit.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className={`glass-card p-5 flex items-center gap-4 ${
                  simResults.delta >= 0 ? 'border-emerald-500/20' : 'border-red-500/20'
                }`}>
                  {simResults.delta >= 0 ? (
                    <TrendingUp className="w-8 h-8 text-emerald-400 shrink-0" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-400 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Delta Benefit</div>
                    <div className={`text-3xl font-bold ${simResults.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {simResults.delta >= 0 ? '+' : ''}<AnimatedCounter value={simResults.delta} prefix={'\u20B9'} />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-fin-emerald" />
                    <h3 className="font-semibold">Sensitivity Analysis</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Impact of increasing each category by 10% on your total benefit
                  </p>
                  <div className="h-56">
                    <ResponsiveContainer>
                      <BarChart data={simResults.sensitivityData} barSize={24}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
                        <XAxis
                          dataKey="category"
                          tick={{ fontSize: 10, fill: '#6B7280' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: '#6B7280' }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v: number) => `${v >= 0 ? '+' : ''}\u20B9${Math.abs(v)}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#111',
                            border: '1px solid #1E1E1E',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                          formatter={(val) => { const n = Number(val); return `${n >= 0 ? '+' : ''}\u20B9${n.toLocaleString('en-IN')}`; }}
                        />
                        <Bar dataKey="impact" radius={[6, 6, 0, 0]}>
                          {simResults.sensitivityData.map((d, i) => (
                            <Cell key={i} fill={d.impact >= 0 ? d.fill : '#EF4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {simResults.sensitivityData.filter(d => d.impact > 100).length > 0 && (
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <h3 className="font-semibold text-amber-400">Insights</h3>
                    </div>
                    <ul className="space-y-2">
                      {simResults.sensitivityData
                        .filter(d => d.impact > 100)
                        .sort((a, b) => b.impact - a.impact)
                        .slice(0, 3)
                        .map(d => (
                          <li key={d.category} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-fin-emerald mt-1">+</span>
                            Increasing {d.category} spending by 10% could earn you an additional{' '}
                            {'\u20B9'}{d.impact.toLocaleString('en-IN')} annually.
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {totalPct !== 100 && (
              <div className="glass-card p-8 text-center">
                <p className="text-amber-400 text-sm">
                  Adjust spending sliders to total 100% to see simulation results.
                  Current total: {totalPct}%
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
