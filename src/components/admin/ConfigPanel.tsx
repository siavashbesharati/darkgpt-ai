import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Globe, Key, AlertTriangle, RefreshCcw, Wallet, Network, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
export function ConfigPanel() {
  const [config, setConfig] = useState({
    aiBaseUrl: '',
    aiApiKey: '',
    maintenanceMode: false,
    networkMode: 'testnet',
    tonMainnetAddress: '',
    tonTestnetAddress: '',
    tonMainnetUsdtAddress: '',
    tonTestnetUsdtAddress: '',
    tonApiUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const token = useStore(s => s.token);
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/settings', {
          headers: { 'Authorization': token || '' }
        });
        const json = await res.json();
        if (json.success) setConfig(json.data);
      } catch (e) {
        console.error("Failed to load platform settings");
      }
    };
    fetchConfig();
  }, [token]);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Authorization': token || '', 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        toast.success("Platform settings updated successfully");
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error("Configuration sync failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <form onSubmit={handleSave} className="space-y-8">
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Provider Orchestration</CardTitle>
                <CardDescription>Dynamic endpoint management for Cloudflare AI Gateway.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base URL</Label>
                <Input
                  value={config.aiBaseUrl}
                  onChange={(e) => setConfig({ ...config, aiBaseUrl: e.target.value })}
                  className="bg-background border-border font-mono text-sm"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">API Key</Label>
                <Input
                  type="password"
                  value={config.aiApiKey}
                  onChange={(e) => setConfig({ ...config, aiApiKey: e.target.value })}
                  className="bg-background border-border font-mono text-sm"
                  placeholder="cf_api_..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="border-b border-border/50 bg-muted/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl">TON Blockchain Configuration</CardTitle>
                <CardDescription>Manage network environments and payment destinations.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between p-6 rounded-2xl border border-border bg-muted/20">
              <div className="space-y-1">
                <Label className="text-base font-bold">Network Mode</Label>
                <p className="text-xs text-muted-foreground">Switching to Mainnet enables real-value transactions.</p>
              </div>
              <RadioGroup
                value={config.networkMode}
                onValueChange={(val) => setConfig({ ...config, networkMode: val as 'testnet' | 'mainnet' })}
                className="flex items-center gap-4"
              >
                <div className="flex items-center space-x-2 bg-background p-3 rounded-xl border border-border">
                  <RadioGroupItem value="testnet" id="testnet" />
                  <Label htmlFor="testnet" className="font-bold text-sm cursor-pointer">Testnet</Label>
                </div>
                <div className="flex items-center space-x-2 bg-background p-3 rounded-xl border border-border">
                  <RadioGroupItem value="mainnet" id="mainnet" />
                  <Label htmlFor="mainnet" className="font-bold text-sm cursor-pointer text-amber-500">Mainnet</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Wallet className="w-3.5 h-3.5" /> Native TON Wallets
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground font-bold">MAINNET TON</Label>
                    <Input
                      value={config.tonMainnetAddress}
                      onChange={(e) => setConfig({ ...config, tonMainnetAddress: e.target.value })}
                      className="bg-background border-border font-mono text-xs"
                      placeholder="EQ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground font-bold">TESTNET TON</Label>
                    <Input
                      value={config.tonTestnetAddress}
                      onChange={(e) => setConfig({ ...config, tonTestnetAddress: e.target.value })}
                      className="bg-background border-border font-mono text-xs"
                      placeholder="EQ..."
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Coins className="w-3.5 h-3.5" /> USDT Jetton Wallets
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground font-bold text-cyan-500">MAINNET USDT</Label>
                    <Input
                      value={config.tonMainnetUsdtAddress}
                      onChange={(e) => setConfig({ ...config, tonMainnetUsdtAddress: e.target.value })}
                      className="bg-background border-border font-mono text-xs"
                      placeholder="EQ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground font-bold text-cyan-500">TESTNET USDT</Label>
                    <Input
                      value={config.tonTestnetUsdtAddress}
                      onChange={(e) => setConfig({ ...config, tonTestnetUsdtAddress: e.target.value })}
                      className="bg-background border-border font-mono text-xs"
                      placeholder="EQ..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <Globe className="w-3.5 h-3.5" /> Platform Health & API
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground font-bold uppercase">TonAPI Explorer URL</Label>
                  <Input
                    value={config.tonApiUrl}
                    onChange={(e) => setConfig({ ...config, tonApiUrl: e.target.value })}
                    className="bg-background border-border font-mono text-xs"
                    placeholder="https://..."
                  />
                </div>
                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-destructive flex items-center gap-1.5 uppercase">
                      <AlertTriangle className="w-3 h-3" /> Maintenance
                    </Label>
                    <p className="text-[9px] text-muted-foreground">Redirect all non-admin users.</p>
                  </div>
                  <Switch
                    checked={config.maintenanceMode}
                    onCheckedChange={(checked) => setConfig({ ...config, maintenanceMode: checked })}
                  />
                </div>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl hover:scale-[1.01] transition-all">
              {loading ? <RefreshCcw className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              Sync & Orchestrate Platform
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}