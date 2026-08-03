import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Brain, CreditCard, Shield, BarChart3,
  ArrowRight, Zap, Target, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Recommendations',
    desc: 'Smart algorithms analyze your spending to find the perfect credit card match.',
  },
  {
    icon: Shield,
    title: 'Approval Prediction',
    desc: 'Know your approval probability before applying, powered by ML scoring.',
  },
  {
    icon: CreditCard,
    title: 'Multi-Card Strategy',
    desc: 'Optimize across card pairs to maximize every rupee of rewards.',
  },
  {
    icon: BarChart3,
    title: 'Spending Analytics',
    desc: 'Visual dashboards reveal missed rewards and optimization opportunities.',
  },
];

const STEPS = [
  { num: '01', title: 'Input Your Profile', desc: 'Share your income, credit score, and spending patterns securely.' },
  { num: '02', title: 'Get AI Analysis', desc: 'Our engine evaluates 18+ cards against your unique spending profile.' },
  { num: '03', title: 'Optimize & Save', desc: 'Implement the strategy and start maximizing your rewards immediately.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTA = () => {
    navigate(user ? '/dashboard' : '/auth?mode=signup');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-fin-dark via-[#050a07] to-fin-dark" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-fin-emerald/[0.03]"
            style={{
              width: 300 + i * 150,
              height: 300 + i * 150,
              left: `${10 + i * 18}%`,
              top: `${-10 + i * 12}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#10B981" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <nav className="flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fin-emerald to-fin-teal flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FinOptima</span>
          </div>
          <div className="flex gap-3">
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm !px-5">
                Go to Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/auth')} className="btn-secondary text-sm !px-5 !py-2.5">
                  Sign In
                </button>
                <button onClick={() => navigate('/auth?mode=signup')} className="btn-primary text-sm !px-5 !py-2.5">
                  Get Started
                </button>
              </>
            )}
          </div>
        </nav>

        <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fin-emerald/20 bg-fin-emerald/5 text-fin-emerald text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Financial Optimization
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
          >
            Optimize Every Rupee.
            <br />
            <span className="gradient-text">Maximize Every Reward.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered credit card optimization tailored to your spending.
            Find the best cards, predict approval, and unlock thousands in hidden rewards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button onClick={handleCTA} className="btn-primary text-lg !px-8 !py-4 glow-emerald flex items-center justify-center gap-2">
              Start Optimizing
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-lg !px-8 !py-4 flex items-center justify-center gap-2"
            >
              Learn More
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 flex items-center justify-center gap-8 md:gap-16 text-center"
          >
            {[
              { value: '18+', label: 'Cards Analyzed' },
              { value: '95%', label: 'Accuracy Rate' },
              { value: '₹12K+', label: 'Avg. Savings' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Intelligence at <span className="gradient-text">Every Step</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From spending analysis to approval prediction, FinOptima covers the full financial optimization lifecycle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card-hover p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-fin-emerald/10 flex items-center justify-center mb-5">
                  <f.icon className="w-6 h-6 text-fin-emerald" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-5xl font-extrabold gradient-text mb-4">{step.num}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <button onClick={handleCTA} className="btn-primary text-lg !px-10 !py-4 glow-emerald inline-flex items-center gap-2">
              <Target className="w-5 h-5" />
              Start Your Analysis
            </button>
          </motion.div>
        </section>

        <footer className="border-t border-white/[0.06] py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-fin-emerald to-fin-teal flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-400">FinOptima</span>
          </div>
          <p className="text-xs text-gray-600">Intelligent Credit Optimization Platform</p>
        </footer>
      </div>
    </div>
  );
}
