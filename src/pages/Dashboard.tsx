import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Award, CreditCard, AlertTriangle, Target,
  ArrowRight, BarChart3, PieChart as PieChartIcon, Zap,
  ShieldCheck, Activity, IndianRupee,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import AnimatedCounter from '../components/AnimatedCounter';
import { CATEGORY_LABELS, CATEGORY_COLORS, SPENDING_CATEGORIES } from '../types';
import type { SpendingCategory } from '../types';

const riskColors = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, spending, recommendations, multiCardResults, approvalPredictions } = useData();

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (!profile || !spending || recommendations.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-fin-emerald/10 flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-fin-emerald" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Complete Your Profile First</h2>
          <p className="text-gray-400 mb-8">
            We need your financial information and spending patterns to generate personalized recommendations.
          </p>
          <button onClick={() => navigate('/profile')} className="btn-primary inline-flex items-center gap-2">
            Set Up Profile <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  const topCard = recommendations[0];
  const totalPotentialRewards = topCard?.total_rewards ?? 0;
  const bestNetBenefit = topCard?.net_benefit ?? 0;
  const efficiencyScore = spending.annual_spend > 0
    ? ((totalPotentialRewards / spending.annual_spend) * 100)
    : 0;
  const avgImprovement = recommendations.length > 1
    ? ((recommendations[0].net_benefit - recommendations[recommendations.length - 1].net_benefit) / Math.max(recommendations[recommendations.length - 1].net_benefit, 1) * 100)
    : 0;
  const multiImprovement = multiCardResults.length > 0 ? multiCardResults[0].improvement_percentage : 0;
  const topApproval = approvalPredictions.length > 0 ? approvalPredictions[0].approval_probability : 0;

  const pieData = SPENDING_CATEGORIES.map(c => ({
    name: CATEGORY_LABELS[c],
    value: spending[c] || 0,
    color: CATEGORY_COLORS[c],
  })).filter(d => d.value > 0);

  const rewardBarData = topCard?.reward_breakdown.map(rb => ({
    category: CATEGORY_LABELS[rb.category],
    reward: Math.round(rb.reward),
    spend: rb.spend,
    fill: CATEGORY_COLORS[rb.category as SpendingCategory],
  })) ?? [];

  const missedRewards = recommendations.length > 0
    ? Math.round(recommendations[0].total_rewards * 0.4)
    : 0;

  const breakEven = topCard
    ? Math.round(topCard.card.annual_fee / Math.max(efficiencyScore / 100, 0.001))
    : 0;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-1">
            Financial <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Your personalized credit card optimization overview
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: IndianRupee,
              label: 'Best Net Benefit',
              value: bestNetBenefit,
              prefix: '\u20B9',
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
            },
            {
              icon: Activity,
              label: 'Efficiency Score',
              value: efficiencyScore,
              suffix: '%',
              decimals: 1,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10',
            },
            {
              icon: ShieldCheck,
              label: 'Top Approval Rate',
              value: topApproval,
              suffix: '%',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              icon: TrendingUp,
              label: 'Multi-Card Gain',
              value: multiImprovement,
              suffix: '%',
              decimals: 1,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card p-5"
            >
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-4 h-4 text-fin-emerald" />
              <h3 className="font-semibold">Spending Distribution</h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
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
                    formatter={(val) => `\u20B9${Number(val).toLocaleString('en-IN')}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-fin-emerald" />
              <h3 className="font-semibold">Rewards by Category</h3>
              <span className="ml-auto text-xs text-gray-500">
                Best Card: {topCard?.card.card_name}
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer>
                <BarChart data={rewardBarData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `\u20B9${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111',
                      border: '1px solid #1E1E1E',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val) => `\u20B9${Number(val).toLocaleString('en-IN')}`}
                  />
                  <Bar dataKey="reward" radius={[6, 6, 0, 0]}>
                    {rewardBarData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6 border-amber-500/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-amber-400">Missed Rewards</h3>
            </div>
            <p className="text-3xl font-bold text-amber-400 mb-2">
              <AnimatedCounter value={missedRewards} prefix={'\u20B9'} />
            </p>
            <p className="text-sm text-gray-400">
              Estimated annual rewards you may be leaving on the table without the optimal card.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-fin-emerald" />
              <h3 className="font-semibold">Break-Even Spend</h3>
            </div>
            <p className="text-3xl font-bold mb-2">
              <AnimatedCounter value={breakEven} prefix={'\u20B9'} />
            </p>
            <p className="text-sm text-gray-400">
              Minimum annual spend to recover the annual fee through rewards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-fin-emerald" />
              <h3 className="font-semibold">Evaluation Metrics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Reward Improvement</span>
                <span className="font-medium text-emerald-400">{avgImprovement.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prediction Confidence</span>
                <span className="font-medium text-blue-400">{topApproval}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Multi-Card Uplift</span>
                <span className="font-medium text-amber-400">{multiImprovement.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Efficiency Score</span>
                <span className="font-medium text-teal-400">{efficiencyScore.toFixed(2)}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-fin-emerald" />
              <h2 className="text-xl font-bold">Top Recommendations</h2>
            </div>
            <button
              onClick={() => navigate('/compare')}
              className="text-sm text-fin-emerald hover:text-fin-emerald-light transition-colors flex items-center gap-1"
            >
              Compare All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {recommendations.slice(0, 6).map((rec, i) => (
              <motion.div
                key={rec.card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="glass-card-hover p-6 relative overflow-hidden"
              >
                {i === 0 && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-fin-emerald/20 text-fin-emerald text-xs font-semibold">
                    Best Match
                  </div>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fin-emerald/20 to-fin-teal/20 flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6 text-fin-emerald" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{rec.card.card_name}</h3>
                    <p className="text-xs text-gray-500">{rec.card.issuer}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Net Benefit</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {'\u20B9'}{rec.net_benefit.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Annual Fee</div>
                    <div className="text-lg font-bold">
                      {rec.card.annual_fee === 0 ? 'FREE' : `\u20B9${rec.card.annual_fee.toLocaleString('en-IN')}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: riskColors[rec.risk_level] }}
                    />
                    <span className="text-xs text-gray-400">
                      Approval: <span className="font-medium text-white">{rec.approval_probability}%</span>
                    </span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: `${riskColors[rec.risk_level]}15`,
                      color: riskColors[rec.risk_level],
                    }}
                  >
                    {rec.risk_level} Risk
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {rec.card.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {multiCardResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold">Multi-Card Strategy</h2>
              </div>
              <button
                onClick={() => navigate('/optimize')}
                className="text-sm text-fin-emerald hover:text-fin-emerald-light transition-colors flex items-center gap-1"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fin-emerald/20 to-fin-teal/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-fin-emerald" />
                  </div>
                  <span className="font-medium text-sm">{multiCardResults[0].card_a.card_name}</span>
                </div>
                <span className="text-gray-500 text-xl font-bold">+</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="font-medium text-sm">{multiCardResults[0].card_b.card_name}</span>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-gray-500">Combined Net Benefit</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {'\u20B9'}{multiCardResults[0].combined_net_benefit.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-amber-400 font-medium">
                    +{multiCardResults[0].improvement_percentage}% over single card
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
