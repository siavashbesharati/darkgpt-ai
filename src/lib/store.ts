import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type Tier = 'Free' | 'Pro' | 'Max';
export interface User {
  id: string;
  email: string;
  tier: Tier;
  credits: number;
  isAdmin: boolean;
}
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
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  settings: SystemSettings;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  addTransaction: (tx: Transaction) => void;
  upgradeTier: (tier: Tier) => Promise<void>;
  updateSettings: (settings: Partial<SystemSettings>) => void;
}
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      transactions: [],
      settings: {
        freeTierLimit: 10,
        proTierLimit: 1000,
        maxTierLimit: 10000,
      },
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      refreshUser: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': token }
          });
          const json = await res.json();
          if (json.success) set({ user: json.data });
        } catch (e) {
          console.error('Failed to refresh user', e);
        }
      },
      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions]
      })),
      upgradeTier: async (tier) => {
        const token = get().token;
        if (!token) return;
        const credits = tier === 'Pro' ? 1000 : 10000;
        try {
          await fetch('/api/upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify({ tier, credits })
          });
          await get().refreshUser();
        } catch (e) {
          console.error('Upgrade failed', e);
        }
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    { name: 'aethercode-storage' }
  )
);