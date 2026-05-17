import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, ChatState, Message, PricingPackage, SecurityPrompt } from './types';
import type { Env } from './core-utils';
export interface User {
  id: string;
  email: string;
  tier: string;
  credits: number;
  isAdmin: boolean;
  blocked: boolean;
  createdAt: number;
}
export interface AppSettings {
  aiBaseUrl?: string;
  aiApiKey?: string;
  emailApiKey?: string;
  maintenanceMode: boolean;
  networkMode: 'testnet' | 'mainnet';
  tonMainnetAddress: string;
  tonTestnetAddress: string;
  tonMainnetUsdtAddress: string;
  tonTestnetUsdtAddress: string;
  tonApiUrl: string;
  telegramId: string;
}
export class AppController extends DurableObject<Env> {
  private users = new Map<string, User>();
  private sessions = new Map<string, SessionInfo>();
  private packages = new Map<string, PricingPackage>();
  private prompts = new Map<string, SecurityPrompt>();
  private settings: AppSettings = {
    maintenanceMode: false,
    networkMode: 'testnet',
    tonMainnetAddress: '',
    tonTestnetAddress: 'EQBvW8ZVMYMv-7s6R8e74q8D-Y_R8Z-R8Z-R8Z-R8Z-R8Z-R8',
    tonMainnetUsdtAddress: '',
    tonTestnetUsdtAddress: 'EQBvW8ZVMYMv-7s6R8e74q8D-Y_R8Z-R8Z-R8Z-R8Z-R8Z-R8',
    tonApiUrl: 'https://testnet.tonapi.io',
    telegramId: ''
  };
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const [u, s, set, p, pr] = await Promise.all([
        this.ctx.storage.get<Record<string, User>>('users'),
        this.ctx.storage.get<Record<string, SessionInfo>>('sessions'),
        this.ctx.storage.get<AppSettings>('settings'),
        this.ctx.storage.get<Record<string, PricingPackage>>('packages'),
        this.ctx.storage.get<Record<string, SecurityPrompt>>('prompts')
      ]);
      this.users = new Map(Object.entries(u || {}));
      this.sessions = new Map(Object.entries(s || {}));
      if (set) this.settings = { ...this.settings, ...set };
      if (p) {
        this.packages = new Map(Object.entries(p));
      } else {
        const defaults: PricingPackage[] = [
          { id: 'free', name: 'Free', price: '0', description: 'For hobbyists and explorers', credits: 10, features: ['10 messages per day', 'Standard speed', 'Community support', 'Public workspace'], isHighlight: false },
          { id: 'pro', name: 'Pro', price: '29', description: "The developer's choice", credits: 1000, features: ['Unlimited messages', 'Fast generation', 'Private workspace', 'Advanced MCP Tools', 'Priority support'], isHighlight: true },
          { id: 'max', name: 'Max', price: '99', description: 'For heavy duty production', credits: 10000, features: ['Everything in Pro', 'Custom MCP endpoints', '24/7 dedicated support', 'Team collaboration', 'Beta access'], isHighlight: false }
        ];
        defaults.forEach(pkg => this.packages.set(pkg.id, pkg));
        await this.ctx.storage.put('packages', Object.fromEntries(this.packages));
      }
      if (pr) {
        this.prompts = new Map(Object.entries(pr));
      } else {
        const defaultPrompts: SecurityPrompt[] = [
          { id: 'sql-scan', title: 'SQL Injection Audit', description: 'Identify blind and error-based SQL vulnerabilities.', promptText: 'Conduct a thorough security audit of the following application endpoint for SQL injection vulnerabilities. Analyze parameters: [INSERT PARAMETERS].', category: 'AUDIT' },
          { id: 'payload-synth', title: 'Payload Synthesis', description: 'Generate Proof-of-Concept exploit payloads.', promptText: 'Generate a non-destructive Proof-of-Concept payload for testing [VULNERABILITY] on a [PLATFORM] target. Ensure the payload is strictly for authorized testing.', category: 'EXPLOIT' },
          { id: 'oauth-flow', title: 'OAuth Flow Audit', description: 'Check for redirect URI leakage and state flaws.', promptText: 'Audit the OAuth 2.0 implementation flow. Specifically check for redirect_uri validation bypasses and proper CSRF state token usage.', category: 'AUDIT' },
          { id: 'recon-sub', title: 'Subdomain Recon', description: 'Passive discovery of attack surfaces.', promptText: 'Outline a comprehensive strategy for passive subdomain discovery for the target [DOMAIN]. Include specific tools and API endpoints to query.', category: 'RECON' }
        ];
        defaultPrompts.forEach(p => this.prompts.set(p.id, p));
        await this.ctx.storage.put('prompts', Object.fromEntries(this.prompts));
      }
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await Promise.all([
      this.ctx.storage.put('users', Object.fromEntries(this.users)),
      this.ctx.storage.put('sessions', Object.fromEntries(this.sessions)),
      this.ctx.storage.put('settings', this.settings),
      this.ctx.storage.put('packages', Object.fromEntries(this.packages)),
      this.ctx.storage.put('prompts', Object.fromEntries(this.prompts))
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
  async listPackages(): Promise<PricingPackage[]> {
    await this.ensureLoaded();
    return Array.from(this.packages.values());
  }
  async savePackage(pkg: PricingPackage): Promise<void> {
    await this.ensureLoaded();
    this.packages.set(pkg.id, pkg);
    await this.persist();
  }
  async deletePackage(id: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.packages.delete(id);
    if (deleted) await this.persist();
    return deleted;
  }
  async listPrompts(): Promise<SecurityPrompt[]> {
    await this.ensureLoaded();
    return Array.from(this.prompts.values());
  }
  async savePrompt(prompt: SecurityPrompt): Promise<void> {
    await this.ensureLoaded();
    this.prompts.set(prompt.id, prompt);
    await this.persist();
  }
  async deletePrompt(id: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.prompts.delete(id);
    if (deleted) await this.persist();
    return deleted;
  }
  async createOTP(email: string): Promise<string> {
    return "123456";
  }
  async verifyOTP(email: string, code: string): Promise<User | null> {
    await this.ensureLoaded();
    if (code !== "123456") return null;
    let user = Array.from(this.users.values()).find(u => u.email === email);
    if (user?.blocked) return null;
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email,
        tier: 'Free',
        credits: 10,
        isAdmin: email === 'siavashbesharati@gmail.com',
        blocked: false,
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
  async listUsers(): Promise<User[]> {
    await this.ensureLoaded();
    return Array.from(this.users.values()).sort((a, b) => b.createdAt - a.createdAt);
  }
  async updateUserStatus(userId: string, blocked: boolean): Promise<boolean> {
    await this.ensureLoaded();
    const user = this.users.get(userId);
    if (!user) return false;
    user.blocked = blocked;
    this.users.set(userId, user);
    await this.persist();
    return true;
  }
  async consumeCredits(userId: string, amount: number): Promise<boolean> {
    await this.ensureLoaded();
    const user = this.users.get(userId);
    if (!user || user.blocked || user.credits < amount) return false;
    user.credits -= amount;
    this.users.set(userId, user);
    await this.persist();
    return true;
  }
  async upgradeUser(userId: string, tier: string, credits: number): Promise<void> {
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
      title: title || `Workspace ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persist();
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      this.sessions.set(sessionId, session);
      await this.persist();
      return true;
    }
    return false;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      this.sessions.set(sessionId, session);
      await this.persist();
    }
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persist();
    return deleted;
  }
}