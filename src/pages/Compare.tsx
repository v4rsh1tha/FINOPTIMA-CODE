import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitCompare, CreditCard, ArrowRight, Check, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { SPENDING_CATEGORIES, CATEGORY_LABELS } from '../types';
import type { CardRecommendation } from '../types';

const riskColors = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' };

export default function Compare() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { recommendations } = useData();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  useEffect(() => {
    if (recommendations.length >= 2) {
      setSelected(recommendations.slice(0, 3).map(r => r.card.id));
    }
  }, [recommendations]);

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-fin-emerald/10 flex items-center justify-center mx-auto mb-6">
          <GitCompare className="w-8 h-8 text-fin-emerald" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Nothing to Compare</h2>
        <p className="text-gray-400 mb-6">Complete your profile to get card recommendations first.</p>
        <button onClick={() => navigate('/profile')} className="btn-primary inline-flex items-center gap-2">
          Set Up Profile <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const toggleCard = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const compareCards = recommendations.filter(r => selected.includes(r.card.id));

  const rows: { label: string; getValue: (r: CardRecommendation) => string | number; highlight?: 'max' | 'min' }[] = [
    { label: 'Net Benefit', getValue: r => r.net_benefit, highlight: 'max' },
    { label: 'Total Rewards', getValue: r => r.total_rewards, highlight: 'max' },
    { label: 'Annual Fee', getValue: r => r.card.annual_fee, highlight: 'min' },
    { label: 'Welcome Bonus', getValue: r => r.card.welcome_bonus, highlight: 'max' },
    { label: 'Approval Probability', getValue: r => `${r.approval_probability}%`, highlight: 'max' },
    { label: 'Risk Level', getValue: r => r.risk_level },
    ...SPENDING_CATEGORIES.map(cat => ({
      label: `${CATEGORY_LABELS[cat]} Rate`,
      getValue: (r: CardRecommendation) => `${((r.card.reward_rates[cat] || 0) * 100).toFixed(1)}%`,
      highlight: 'max' as const,
    })),
    { label: 'Min Income', getValue: r => r.card.min_income, highlight: 'min' },
    { label: 'Min Credit Score', getValue: r => r.card.min_credit_score, highlight: 'min' },
  ];

  const getBestIdx = (row: typeof rows[0]) => {
    if (!row.highlight || compareCards.length === 0) return -1;
    const vals = compareCards.map(r => {
      const v = row.getValue(r);
      return typeof v === 'number' ? v : parseFloat(String(v));
    });
    if (vals.some(isNaN)) return -1;
    return row.highlight === 'max'
      ? vals.indexOf(Math.max(...vals))
      : vals.indexOf(Math.min(...vals));
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-1">
            Card <span className="gradient-text">Comparison</span>
          </h1>
          <p className="text-gray-400 text-sm">Select up to 4 cards to compare side by side</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {recommendations.map(rec => {
            const isSelected = selected.includes(rec.card.id);
            return (
              <button
                key={rec.card.id}
                onClick={() => toggleCard(rec.card.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                  isSelected
                    ? 'bg-fin-emerald/15 border border-fin-emerald/30 text-fin-emerald'
                    : 'bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:border-white/10'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                {rec.card.card_name}
              </button>
            );
          })}
        </motion.div>

        {compareCards.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 w-48">Feature</th>
                  {compareCards.map((rec) => (
                    <th key={rec.card.id} className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fin-emerald/20 to-fin-teal/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-fin-emerald" />
                        </div>
                        <span className="text-sm font-semibold">{rec.card.card_name}</span>
                        <span className="text-xs text-gray-500">{rec.card.issuer}</span>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {rec.card.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-fin-emerald/10 text-fin-emerald">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const bestIdx = getBestIdx(row);
                  return (
                    <tr key={ri} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-sm text-gray-400">{row.label}</td>
                      {compareCards.map((rec, ci) => {
                        const val = row.getValue(rec);
                        const isBest = ci === bestIdx;
                        const displayVal = typeof val === 'number'
                          ? (row.label.includes('Fee') || row.label.includes('Benefit') || row.label.includes('Reward') || row.label.includes('Income') || row.label.includes('Bonus'))
                            ? `\u20B9${val.toLocaleString('en-IN')}`
                            : val
                          : val;
                        return (
                          <td
                            key={rec.card.id}
                            className={`py-3 px-4 text-center text-sm font-medium ${
                              isBest ? 'text-fin-emerald' : 'text-gray-300'
                            }`}
                          >
                            {row.label === 'Risk Level' ? (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${riskColors[val as keyof typeof riskColors]}15`,
                                  color: riskColors[val as keyof typeof riskColors],
                                }}
                              >
                                <Shield className="w-3 h-3" />
                                {val}
                              </span>
                            ) : (
                              displayVal
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}

        {compareCards.length < 2 && (
          <div className="text-center py-12 text-gray-500">
            Select at least 2 cards above to compare
          </div>
        )}
      </div>
    </div>
  );
}
