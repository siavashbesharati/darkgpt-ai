import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PricingPackage, SecurityPrompt } from '../../worker/types';
export type Tier = 'Free' | 'Pro' | 'Max' | string;
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
  memo: string;
  timestamp: number;
}
export interface SessionInfo {
  id: string;
  title: string;
  createdAt: number;
  lastActive: number;
}
export interface SystemSettings {
  freeTierLimit: number;
  proTierLimit: number;
  maxTierLimit: number;
  networkMode: 'testnet' | 'mainnet';
  activeTonAddress: string;
  activeTonUsdtAddress: string;
  tonMainnetUsdtAddress: string;
  tonTestnetUsdtAddress: string;
  tonApiUrl: string;
  telegramId: string;
}
interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  settings: SystemSettings;
  packages: PricingPackage[];
  prompts: SecurityPrompt[];
  currentSessionId: string | null;
  sessions: SessionInfo[];
  pendingPrompt: string | null;
  // Actions
  setSessions: (sessions: SessionInfo[]) => void;
  setCurrentSessionId: (id: string | null) => void;
  setAuth: (user: User, token: string) => void;
  setPendingPrompt: (prompt: string | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  fetchPackages: () => Promise<void>;
  fetchPrompts: () => Promise<void>;
  fetchPublicConfig: () => Promise<void>;
  consumeCredit: () => Promise<boolean>;
  addTransaction: (tx: Transaction) => void;
  upgradeTier: (tier: string, credits: number) => Promise<void>;
  updateSettings: (settings: Partial<SystemSettings>) => void;
  adminSavePackage: (pkg: PricingPackage) => Promise<boolean>;
  adminDeletePackage: (id: string) => Promise<boolean>;
  adminSavePrompt: (prompt: SecurityPrompt) => Promise<boolean>;
  adminDeletePrompt: (id: string) => Promise<boolean>;
}
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      transactions: [],
      currentSessionId: null,
      sessions: [],
      packages: [],
      prompts: [],
      pendingPrompt: null,
      settings: {
        freeTierLimit: 10,
        proTierLimit: 1000,
        maxTierLimit: 10000,
        networkMode: 'testnet',
        activeTonAddress: '',
        activeTonUsdtAddress: '',
        tonMainnetUsdtAddress: '',
        tonTestnetUsdtAddress: '',
        tonApiUrl: '',
        telegramId: '',
      },
      setSessions: (sessions) => set({ sessions }),
      setCurrentSessionId: (id) => set({ currentSessionId: id }),
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        if (token) get().refreshUser();
        get().fetchPublicConfig();
        get().fetchPackages();
        get().fetchPrompts();
      },
      setPendingPrompt: (prompt) => set({ pendingPrompt: prompt }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, currentSessionId: null, sessions: [] }),
      fetchPackages: async () => {
        try {
          const res = await fetch('/api/packages');
          const json = await res.json();
          if (json.success && json.data) set({ packages: json.data });
        } catch (e) {
          console.warn('Failed to fetch pricing packages', e);
        }
      },
      fetchPrompts: async () => {
        try {
          const res = await fetch('/api/prompts');
          const json = await res.json();
          if (json.success && json.data) set({ prompts: json.data });
        } catch (e) {
          console.warn('Failed to fetch security prompts', e);
        }
      },
      fetchPublicConfig: async () => {
        try {
          const res = await fetch('/api/config/payment');
          const json = await res.json();
          if (json.success && json.data) {
            set((state) => ({
              settings: {
                ...state.settings,
                networkMode: json.data.networkMode,
                activeTonAddress: json.data.activeTonAddress,
                activeTonUsdtAddress: json.data.activeTonUsdtAddress,
                tonMainnetUsdtAddress: json.data.tonMainnetUsdtAddress,
                tonTestnetUsdtAddress: json.data.tonTestnetUsdtAddress,
                tonApiUrl: json.data.tonApiUrl,
                telegramId: json.data.telegramId,
              }
            }));
          }
        } catch (e) {
          console.warn('Failed to fetch public blockchain config', e);
        }
      },
      refreshUser: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const res = await fetch('/api/auth/me', { headers: { 'Authorization': token } });
          const json = await res.json();
          if (json.success && json.data) {
            set({ user: json.data });
          } else if (res.status === 401 || res.status === 404) {
            set({ user: null, token: null, isAuthenticated: false });
          }
        } catch (e) {
          console.warn('Backend unavailable, using cached user data', e);
        }
      },
      consumeCredit: async () => {
        const token = get().token;
        if (!token) return false;
        try {
          const res = await fetch('/api/credits/consume', {
            method: 'POST',
            headers: { 'Authorization': token }
          });
          const json = await res.json();
          if (json.success) {
            await get().refreshUser();
            return true;
          }
          return false;
        } catch (e) {
          console.error('Credit consumption failed', e);
          return false;
        }
      },
      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions]
      })),
      upgradeTier: async (tier, credits) => {
        const token = get().token;
        if (!token) return;
        try {
          const res = await fetch('/api/upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify({ tier, credits })
          });
          if (res.ok) await get().refreshUser();
        } catch (e) {
          console.error('Upgrade failed', e);
        }
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      adminSavePackage: async (pkg) => {
        const token = get().token;
        if (!token) return false;
        try {
          const res = await fetch('/api/admin/packages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify(pkg)
          });
          if (res.ok) {
            await get().fetchPackages();
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      },
      adminDeletePackage: async (id) => {
        const token = get().token;
        if (!token) return false;
        try {
          const res = await fetch(`/api/admin/packages/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
          });
          if (res.ok) {
            await get().fetchPackages();
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      },
      adminSavePrompt: async (prompt) => {
        const token = get().token;
        if (!token) return false;
        try {
          const res = await fetch('/api/admin/prompts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify(prompt)
          });
          if (res.ok) {
            await get().fetchPrompts();
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      },
      adminDeletePrompt: async (id) => {
        const token = get().token;
        if (!token) return false;
        try {
          const res = await fetch(`/api/admin/prompts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
          });
          if (res.ok) {
            await get().fetchPrompts();
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      }
    }),
    {
      name: 'aethercode-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        transactions: state.transactions,
        currentSessionId: state.currentSessionId,
        settings: {
          freeTierLimit: state.settings.freeTierLimit,
          proTierLimit: state.settings.proTierLimit,
          maxTierLimit: state.settings.maxTierLimit,
          telegramId: state.settings.telegramId
        }
      })
    }
  )
);