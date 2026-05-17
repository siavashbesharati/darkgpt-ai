import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { Save, Settings } from 'lucide-react';
export function ControlPanel() {
  const freeTierLimit = useStore((s) => s.settings.freeTierLimit);
  const updateSettings = useStore((s) => s.updateSettings);
  const [localLimit, setLocalLimit] = React.useState(freeTierLimit);
  const handleSave = () => {
    updateSettings({ freeTierLimit: localLimit });
    toast.success("Platform configurations updated successfully.");
  };
  return (
    <Card className="bg-slate-900 border-white/5 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-500" />
          Resource Quotas
        </CardTitle>
        <CardDescription>Configure global limits for the free tier.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="free-limit" className="text-xs uppercase text-slate-500">
            Free Tier Daily Limit
          </Label>
          <div className="relative">
            <Input
              id="free-limit"
              type="number"
              value={localLimit}
              onChange={(e) => setLocalLimit(Number(e.target.value))}
              className="bg-slate-950 border-white/10 pr-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase">
              Tokens
            </div>
          </div>
          <p className="text-[10px] text-slate-600 italic">
            Current system value: {freeTierLimit}
          </p>
        </div>
        <Button onClick={handleSave} className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}