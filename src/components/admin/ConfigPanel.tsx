import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, Globe, Key, AlertTriangle, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
export function ConfigPanel() {
  const [config, setConfig] = useState({
    aiBaseUrl: '',
    aiApiKey: '',
    maintenanceMode: false
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
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
        <CardContent className="p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-url" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Base URL
                </Label>
                <Input
                  id="base-url"
                  placeholder="https://gateway.ai.cloudflare.com/v1/..."
                  value={config.aiBaseUrl}
                  onChange={(e) => setConfig({ ...config, aiBaseUrl: e.target.value })}
                  className="bg-background border-border font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Key className="w-3 h-3" /> API Key
                </Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="cf_api_xxxxxxxxxxxxxxxxxxxx"
                    value={config.aiApiKey}
                    onChange={(e) => setConfig({ ...config, aiApiKey: e.target.value })}
                    className="bg-background border-border font-mono text-sm pr-10"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-bold flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" /> Maintenance Mode
                </Label>
                <p className="text-[11px] text-muted-foreground leading-tight max-w-[240px]">
                  When active, non-admin users will be redirected to a splash page.
                </p>
              </div>
              <Switch 
                checked={config.maintenanceMode}
                onCheckedChange={(checked) => setConfig({ ...config, maintenanceMode: checked })}
              />
            </div>
            <div className="pt-4 flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1 bg-primary text-primary-foreground font-bold h-12 rounded-xl shadow-lg hover:scale-[1.02] transition-all">
                {loading ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Sync Global Configuration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="p-6 rounded-2xl border border-border bg-muted/30 text-center">
        <p className="text-xs text-muted-foreground font-medium italic">
          Changes take effect immediately across all active Durable Object instances.
        </p>
      </div>
    </div>
  );
}