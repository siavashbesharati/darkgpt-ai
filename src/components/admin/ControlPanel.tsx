import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { Save, ShieldAlert } from 'lucide-react';
export function ControlPanel() {
  // Zustand Zero-Tolerance Rule: Select primitives individually
  const freeTierLimit = useStore((s) => s.settings.freeTierLimit);
  const updateSettings = useStore((s) => s.updateSettings);
  const [localLimit, setLocalLimit] = React.useState(freeTierLimit);
  const handleSave = () => {
    updateSettings({ freeTierLimit: localLimit });
    toast.success("System configurations updated successfully.");
  };
  return (
    <Card className="bg-slate-900 border-white/5 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          Platform Toggles
        </CardTitle>
        <CardDescription>Configure global limits and modes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="free-limit" className="text-xs uppercase text-slate-500">Free Tier Daily Limit ({freeTierLimit})</Label>
          <Input
            id="free-limit"
            type="number"
            value={localLimit}
            onChange={(e) => setLocalLimit(Number(e.target.value))}
            className="bg-slate-950 border-white/10"
          />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Maintenance Mode</Label>
            <p className="text-[10px] text-slate-500">Block all non-admin access.</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Enhanced Logging</Label>
            <p className="text-[10px] text-slate-500">Enable verbose DO monitoring.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Button onClick={handleSave} className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}