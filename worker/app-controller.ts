import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, ChatState, Message } from './types';
import type { Env } from './core-utils';
export interface User {
  id: string;
  email: string;
  tier: 'Free' | 'Pro' | 'Max';
  credits: number;
  isAdmin: boolean;
  createdAt: number;
}
export interface AppSettings {
  aiBaseUrl?: string;
  aiApiKey?: string;
  emailApiKey?: string;
  maintenanceMode: boolean;
}
export class AppController extends DurableObject<Env> {
  private users = new Map<string, User>();
  private sessions = new Map<string, SessionInfo>();
  private settings: AppSettings = { maintenanceMode: false };
  private otps = new Map<string, { code: string; expires: number }>();
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const [u, s, set] = await Promise.all([
        this.ctx.storage.get<Record<string, User>>('users'),
        this.ctx.storage.get<Record<string, SessionInfo>>('sessions'),
        this.ctx.storage.get<AppSettings>('settings')
      ]);
      this.users = new Map(Object.entries(u || {}));
      this.sessions = new Map(Object.entries(s || {}));
      this.settings = set || { maintenanceMode: false };
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await Promise.all([
      this.ctx.storage.put('users', Object.fromEntries(this.users)),
      this.ctx.storage.put('sessions', Object.fromEntries(this.sessions)),
      this.ctx.storage.put('settings', this.settings)
    ]);
  }
  async getSettings(): Promise<AppSettings> {
    await this.ensureLoaded();
    return this.settings;
  }
  async updateSettings(newSettings: Partial<AppSettings>): Promise<void> {
    await this.ensureLoaded();
    this.settings = { ...this.settings, ...newSettings };
    await this.persist();
  }
  async createOTP(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.otps.set(email, { code, expires: Date.now() + 600000 }); // 10 mins
    return code;
  }
  async verifyOTP(email: string, code: string): Promise<User | null> {
    await this.ensureLoaded();
    const stored = this.otps.get(email);
    if (!stored || stored.code !== code || stored.expires < Date.now()) return null;
    this.otps.delete(email);
    let user = Array.from(this.users.values()).find(u => u.email === email);
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        tier: 'Free',
        credits: 10,
        isAdmin: email === 'siavashbesharati@gmail.com',
        createdAt: Date.now()
      };
      this.users.set(user.id, user);
      await this.persist();
    }
    return user;
  }
  async getUser(userId: string): Promise<User | null> {
    await this.ensureLoaded();
    return this.users.get(userId) || null;
  }
  async consumeCredits(userId: string, amount: number): Promise<boolean> {
    await this.ensureLoaded();
    const user = this.users.get(userId);
    if (!user || user.credits < amount) return false;
    user.credits -= amount;
    this.users.set(userId, user);
    await this.persist();
    return true;
  }
  async upgradeUser(userId: string, tier: 'Free' | 'Pro' | 'Max', credits: number): Promise<void> {
    await this.ensureLoaded();
    const user = this.users.get(userId);
    if (user) {
      user.tier = tier;
      user.credits = credits;
      this.users.set(userId, user);
      await this.persist();
    }
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persist();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persist();
    return deleted;
  }
}