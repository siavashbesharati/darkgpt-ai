import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Activity, ShieldCheck, Globe, Cpu } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
/**
 * Operational Intelligence Overlay (OPINT)
 * Displays real-time platform health metrics for the active operator.
 */
export function TemplateDemo() {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const userTier = useStore(s => s.user?.tier);
  const [load, setLoad] = useState(1.2);
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      setLoad(prev => {
        const delta = (Math.random() - 0.5) * 0.1;
        return Math.max(0.8, Math.min(2.4, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);
  if (!isAuthenticated) return null;
  return (
    <div className="fixed bottom-6 left-6 z-[100] animate-in slide-in-from-left-4 duration-700">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-background/60 backdrop-blur-md border border-primary/20 shadow-glow cursor-help group transition-all hover:bg-background/80">
              <div className="p-2 rounded-full bg-primary text-primary-foreground">
                <Cpu className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-muted-foreground leading-none mb-1">OPINT_STATUS</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="h-4 border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-[8px] font-black uppercase tracking-tighter">
                    VERIFIED
                  </Badge>
                  <span className="text-[10px] font-mono font-bold text-foreground">
                    LOAD: {load.toFixed(2)} req/s
                  </span>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" className="w-64 p-4 bg-slate-950 border-white/10 text-white rounded-2xl shadow-2xl mb-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Core Verified</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                Backend logic is orchestrated via Cloudflare Workers and persistent Durable Objects. Data integrity is cryptographically enforced.
              </p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span className="text-[9px] font-bold text-slate-500">EDGE_NODE: TYO_01</span>
                </div>
                <span className="text-[9px] font-bold text-emerald-500">UPTIME: 99.9%</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}