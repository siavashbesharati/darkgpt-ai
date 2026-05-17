import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Check, Zap, Rocket, Star, Shield, Network, Loader2, Lock, Terminal } from 'lucide-react';
import { CryptoPaymentModal } from '@/components/crypto/CryptoPaymentModal';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
export function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCredits, setSelectedCredits] = useState<number>(0);
  const packages = useStore(s => s.packages);
  const fetchPackages = useStore(s => s.fetchPackages);
  const [loading, setLoading] = useState(packages.length === 0);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchPackages();
      setLoading(false);
    };
    init();
  }, [fetchPackages]);
  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('pro')) return Rocket;
    if (lower.includes('max')) return Star;
    return Zap;
  };
  const handleUpgradeClick = (name: string, credits: number) => {
    setSelectedPlan(name);
    setSelectedCredits(credits);
  };
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Lock className="w-3.5 h-3.5" /> SECURE CLEARANCE LEVELS
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic">Select your <span className="text-red-600">Operational Power</span></h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-bold">
            Acquire higher-bandwidth access to the DarkCore Engine. Instant verification via TON.
          </p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Scanning Tiers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {packages.map((pkg, i) => {
              const Icon = getIcon(pkg.name);
              // Override feature lists for security focus if they match defaults
              let displayFeatures = pkg.features;
              if (pkg.name === 'Free') displayFeatures = ['10 basic scans/day', 'Standard speed', 'Community intelligence', 'Public audit log'];
              if (pkg.name === 'Pro') displayFeatures = ['1,000 Power units', 'Advanced Exploitation Tools', 'Private Security Audits', 'Fast DarkCore Access', '24/7 Priority Tunnel'];
              if (pkg.name === 'Max') displayFeatures = ['10,000 Power units', 'Full Penetration Suite', 'Zero-Day Research Support', 'Team Collaboration', 'Alpha API Endpoints'];
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-8 rounded-[2.5rem] border shadow-sm ${pkg.isHighlight ? 'border-red-600 bg-red-600/5 ring-1 ring-red-600/20' : 'border-border bg-card'} flex flex-col h-full hover:shadow-xl transition-all duration-500 group`}
                >
                  {pkg.isHighlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      ELITE CHOICE
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-2xl ${pkg.isHighlight ? 'bg-red-600 text-white' : 'bg-muted text-foreground'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight uppercase italic">{pkg.name}</h3>
                  </div>
                  <div className="mb-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black tracking-tighter">${pkg.price}</span>
                      <span className="text-muted-foreground font-black uppercase text-xs tracking-widest">/cycle</span>
                    </div>
                    <p className="text-muted-foreground mt-3 text-sm font-bold uppercase tracking-tight">{pkg.name === 'Free' ? 'Basic Recon' : pkg.description}</p>
                  </div>
                  <ul className="space-y-4 mb-12 flex-1">
                    {displayFeatures.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-bold text-foreground/80 uppercase tracking-tighter">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => pkg.price !== "0" && handleUpgradeClick(pkg.name, pkg.credits)}
                    variant={pkg.isHighlight ? "default" : "outline"}
                    disabled={pkg.price === "0"}
                    className={`w-full h-14 rounded-2xl font-black text-base shadow-sm transition-all duration-300 uppercase tracking-widest ${pkg.isHighlight ? 'bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02]' : 'border-border hover:bg-muted hover:border-red-600/50'}`}
                  >
                    {pkg.price === "0" ? "ACTIVE ACCESS" : `ACQUIRE ${pkg.name}`}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
        <div className="mt-24 p-10 rounded-[3rem] border border-border bg-muted/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="p-6 rounded-3xl bg-black border border-red-900/20 shadow-inner">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-black italic tracking-tight uppercase">DarkCore Infrastructure</h4>
              <p className="text-muted-foreground text-sm max-w-md font-bold uppercase tracking-tighter">
                All clearance upgrades are immutable and verified via <span className="text-red-600 underline decoration-red-600/30">TON Protocol</span>. No centralized billing involved.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 px-8 py-4 rounded-full bg-background border border-border shadow-sm">
             <Terminal className="w-8 h-8 text-muted-foreground/40" />
             <div className="w-px h-10 bg-border" />
             <Shield className="w-8 h-8 text-red-600/40" />
          </div>
        </div>
      </div>
      {selectedPlan && (
        <CryptoPaymentModal
          planName={selectedPlan}
          credits={selectedCredits}
          open={!!selectedPlan}
          onOpenChange={(open) => !open && setSelectedPlan(null)}
        />
      )}
    </div>
  );
}