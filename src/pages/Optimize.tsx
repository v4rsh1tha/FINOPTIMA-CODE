import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Zap, ArrowRight, Target, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import AnimatedCounter from '../components/AnimatedCounter';
import { SPENDING_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS } from '../types';

export default function Optimize() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { recommendations, multiCardResults, spending } = useData();

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-fin-emerald/10 flex items-center justify-center mx-auto mb-6">
          <Layers className="w-8 h-8 text-fin-emerald" />
        </div>
        <h2 className="text-2xl font-bold mb-3">No Recommendations Yet</h2>
        <p className="text-gray-400 mb-6">Complete your profile to see optimization strategies.</p>
        <button onClick={() => navigate('/profile')} className="btn-primary inline-flex items-center gap-2">
          Set Up Profile <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const bestSingle = recommendations[0];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-1">
            Multi-Card <span className="gradient-text">Optimization</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Maximize rewards by combining the strengths of two cards
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-fin-emerald" />
            <h2 className="text-lg font-semibold">Best Single Card</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fin-emerald/20 to-fin-teal/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-fin-emerald" />
              </div>
              <div>
                <h3 className="font-semibold">{bestSingle.card.card_name}</h3>
                <p className="text-xs text-gray-500">{bestSingle.card.issuer}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Net Benefit</div>
              <div className="text-2xl font-bold text-emerald-400">
                <AnimatedCounter value={bestSingle.net_benefit} prefix={'\u20B9'} />
              </div>
            </div>
          </div>
        </motion.div>

        {spending && spending.annual_spend <= 700000 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 text-center"
          >
            <Target className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Multi-Card Not Recommended</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Multi-card optimization is most beneficial when annual spending exceeds Rs.7,00,000.
              Your current spend is Rs.{spending.annual_spend.toLocaleString('en-IN')}.
            </p>
          </motion.div>
        )}

        {multiCardResults.length > 0 && (
          <div className="space-y-6">
            {multiCardResults.map((result, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  {i === 0 && <Zap className="w-4 h-4 text-amber-400" />}
                  <h3 className="font-semibold">
                    {i === 0 ? 'Best Duo Strategy' : `Strategy #${i + 1}`}
                  </h3>
                  {i === 0 && (
                    <span className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fin-emerald/20 to-fin-teal/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-fin-emerald" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{result.card_a.card_name}</p>
                      <p className="text-xs text-gray-500">{result.card_a.issuer}</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-2xl font-bold">+</span>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{result.card_b.card_name}</p>
                      <p className="text-xs text-gray-500">{result.card_b.issuer}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-white/[0.02]">
                    <div className="text-xs text-gray-500 mb-1">Combined Benefit</div>
                    <div className="text-xl font-bold text-emerald-400">
                      {'\u20B9'}{result.combined_net_benefit.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/[0.02]">
                    <div className="text-xs text-gray-500 mb-1">vs Single Card</div>
                    <div className="text-xl font-bold text-amber-400">
                      +{result.improvement_percentage}%
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/[0.02]">
                    <div className="text-xs text-gray-500 mb-1">Extra Earned</div>
                    <div className="text-xl font-bold text-teal-400">
                      {'\u20B9'}{(result.combined_net_benefit - result.single_best_benefit).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-semibold mb-3 text-gray-300">Category Allocation</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SPENDING_CATEGORIES.map(cat => (
                    <div key={cat} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02]">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-400">{CATEGORY_LABELS[cat]}</div>
                        <div className="text-xs font-medium truncate">
                          {result.category_allocation[cat]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
