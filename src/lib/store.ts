import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type Tier = 'Free' | 'Pro' | 'Max';
export interface Transaction {
  id: string;
  planName: string;
  asset: string;
  amount: string;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: number;
}
export interface SystemSettings {
  freeTierLimit: number;
  proTierLimit: number;
  maxTierLimit: number;
}
interface AppState {
  // User Slice
  tier: Tier;
  credits: number;
  // Admin Slice
  transactions: Transaction[];
  // System Slice
  settings: SystemSettings;
  // Actions
  addTransaction: (tx: Transaction) => void;
  upgradeTier: (tier: Tier) => void;
  consumeCredit: () => boolean;
  updateSettings: (settings: Partial<SystemSettings>) => void;
}
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tier: 'Free',
      credits: 10,
      transactions: [],
      settings: {
        freeTierLimit: 10,
        proTierLimit: 1000,
        maxTierLimit: 10000,
      },
      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions]
      })),
      upgradeTier: (tier) => set((state) => {
        let newCredits = state.credits;
        if (tier === 'Pro') newCredits = Math.max(newCredits, state.settings.proTierLimit);
        if (tier === 'Max') newCredits = Math.max(newCredits, state.settings.maxTierLimit);
        return { tier, credits: newCredits };
      }),
      consumeCredit: () => {
        const { credits } = get();
        if (credits <= 0) return false;
        set((state) => ({ credits: state.credits - 1 }));
        return true;
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'aethercode-storage',
    }
  )
);