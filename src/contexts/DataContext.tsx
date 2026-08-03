import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Profile, SpendingData, CardMetadata, CardRecommendation, MultiCardResult } from '../types';
import { runRecommendationEngine } from '../engine/recommendation';
import { runMultiCardOptimizer } from '../engine/multicard';
import { runApprovalPrediction } from '../engine/approval';
import type { ApprovalPrediction } from '../types';

interface DataContextType {
  profile: Profile | null;
  spending: SpendingData | null;
  cards: CardMetadata[];
  recommendations: CardRecommendation[];
  multiCardResults: MultiCardResult[];
  approvalPredictions: ApprovalPrediction[];
  loading: boolean;
  saveProfile: (data: Partial<Profile>) => Promise<void>;
  saveSpending: (data: Partial<SpendingData>) => Promise<void>;
  runEngine: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [spending, setSpending] = useState<SpendingData | null>(null);
  const [cards, setCards] = useState<CardMetadata[]>([]);
  const [recommendations, setRecommendations] = useState<CardRecommendation[]>([]);
  const [multiCardResults, setMultiCardResults] = useState<MultiCardResult[]>([]);
  const [approvalPredictions, setApprovalPredictions] = useState<ApprovalPrediction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCards = useCallback(async () => {
    const { data } = await supabase.from('cards_metadata').select('*');
    if (data) setCards(data as CardMetadata[]);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (data) setProfile(data as Profile);
  }, [user]);

  const fetchSpending = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('spending_data')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) setSpending(data as SpendingData);
  }, [user]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchCards(), fetchProfile(), fetchSpending()]);
    setLoading(false);
  }, [fetchCards, fetchProfile, fetchSpending]);

  useEffect(() => {
    if (user) refreshData();
  }, [user, refreshData]);

  const saveProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    await supabase.from('profiles').update({ ...data, updated_at: new Date().toISOString() }).eq('id', user.id);
    await fetchProfile();
  };

  const saveSpending = async (data: Partial<SpendingData>) => {
    if (!user) return;
    const existing = spending;
    if (existing) {
      await supabase.from('spending_data').update({ ...data, updated_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await supabase.from('spending_data').insert({ ...data, user_id: user.id });
    }
    await fetchSpending();
  };

  const runEngine = async () => {
    if (!profile || !spending || cards.length === 0) return;
    setLoading(true);

    const recs = runRecommendationEngine(profile, spending, cards);
    setRecommendations(recs);

    const approvals = recs.map(rec =>
      runApprovalPrediction(profile, rec.card)
    );
    setApprovalPredictions(approvals);

    recs.forEach((r, i) => {
      r.approval_probability = approvals[i].approval_probability;
      r.risk_level = approvals[i].risk_level;
    });

    if (spending.annual_spend > 700000 && recs.length >= 2) {
      const multiResults = runMultiCardOptimizer(spending, recs.map(r => r.card), recs[0]?.net_benefit ?? 0);
      setMultiCardResults(multiResults);
    }

    if (user) {
      await supabase.from('recommendations').delete().eq('user_id', user.id);
      const inserts = recs.map(r => ({
        user_id: user.id,
        card_id: r.card.id,
        net_benefit: r.net_benefit,
        total_rewards: r.total_rewards,
        rank: r.rank,
        approval_probability: r.approval_probability,
        risk_level: r.risk_level,
        reward_breakdown: r.reward_breakdown,
      }));
      await supabase.from('recommendations').insert(inserts);
    }

    setLoading(false);
  };

  return (
    <DataContext.Provider value={{
      profile, spending, cards, recommendations, multiCardResults,
      approvalPredictions, loading, saveProfile, saveSpending, runEngine, refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
