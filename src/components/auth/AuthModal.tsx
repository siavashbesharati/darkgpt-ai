import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
export function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const setAuth = useStore(s => s.setAuth);
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStep('otp');
        toast.success("Security code dispatched", {
          description: "Use global demo code: 123456"
        });
      } else {
        toast.error("Failed to transmit verification code");
      }
    } catch (e) {
      toast.error("Network failure during transmission");
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const json = await res.json();
      if (json.success) {
        setAuth(json.data.user, json.data.token);
        toast.success("Access Granted. Welcome Operator.");
        onOpenChange(false);
      } else {
        toast.error(json.error || "Invalid clearance code");
      }
    } catch (e) {
      toast.error("Verification sequence failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) {
        setTimeout(() => {
          setStep('email');
          setEmail('');
          setCode('');
        }, 300);
      }
    }}>
      <DialogContent className="sm:max-w-[400px] bg-white dark:bg-slate-950 border-slate-200 dark:border-red-900/20">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-red-600/10 text-red-600 border-red-600/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Lock className="w-3 h-3" /> SECURE ACCESS
            </Badge>
          </div>
          <DialogTitle className="flex items-center gap-2 uppercase italic font-black">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            Access DARK GPT
          </DialogTitle>
          <DialogDescription className="font-bold text-xs uppercase tracking-tight">
            {step === 'email' ? 'Join the Elite Security Research Network.' : 'Verification code transmitted to ' + email}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase text-muted-foreground">Operational Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@secure.node"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  className="bg-muted/30 border-border font-mono"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-white font-black uppercase tracking-widest" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Initialize Clearance
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-[10px] font-black uppercase text-muted-foreground">Clearance Key</Label>
                <Input
                  id="code"
                  placeholder="123456"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  autoFocus
                  className="tracking-[0.5em] text-center font-mono font-black text-lg bg-muted/30"
                />
                <p className="text-[11px] text-muted-foreground text-center pt-1 italic font-bold">
                  DEMO BYPASS: <span className="text-red-600 font-black">123456</span>
                </p>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Establish Tunnel
              </Button>
              <Button variant="ghost" className="w-full text-[10px] text-slate-500 font-bold uppercase" onClick={() => setStep('email')}>
                Return to Entry
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}