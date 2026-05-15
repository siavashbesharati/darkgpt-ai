import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Check, Zap, Rocket, Star, Shield } from 'lucide-react';
import { CryptoPaymentModal } from '@/components/crypto/CryptoPaymentModal';
import { motion } from 'framer-motion';
export function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "For hobbyists and explorers",
      features: ["10 messages per day", "Standard speed", "Community support", "Public workspace"],
      icon: Zap,
      cta: "Current Plan",
      highlight: false
    },
    {
      name: "Pro",
      price: "29",
      description: "The developer's choice",
      features: ["Unlimited messages", "Fast generation", "Private workspace", "Advanced MCP Tools", "Priority support"],
      icon: Rocket,
      cta: "Upgrade to Pro",
      highlight: true
    },
    {
      name: "Max",
      price: "99",
      description: "For heavy duty production",
      features: ["Everything in Pro", "Custom MCP endpoints", "24/7 dedicated support", "Team collaboration", "Beta access"],
      icon: Star,
      cta: "Go Max",
      highlight: false
    }
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-bold">Choose your <span className="text-primary italic">Tier</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upgrade your intelligence. Simple, transparent pricing powered by crypto.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border shadow-sm ${plan.highlight ? 'border-primary bg-primary/5' : 'border-border bg-card'} flex flex-col h-full hover:shadow-md transition-all`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => plan.price !== "0" && setSelectedPlan(plan.name)}
                variant={plan.highlight ? "default" : "outline"}
                disabled={plan.price === "0"}
                className={`w-full h-12 rounded-xl font-bold transition-all ${plan.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-border hover:bg-muted'}`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="mt-20 p-8 rounded-3xl border border-border bg-muted/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-card border border-border">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-bold italic">Secure Crypto Payments</h4>
              <p className="text-muted-foreground text-sm">All transactions are processed natively on-chain. No credit cards required.</p>
            </div>
          </div>
          <div className="flex gap-4 grayscale opacity-50">
            <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" className="h-8" alt="BTC" />
            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="h-8" alt="ETH" />
            <img src="https://cryptologos.cc/logos/solana-sol-logo.png" className="h-8" alt="SOL" />
          </div>
        </div>
      </div>
      {selectedPlan && (
        <CryptoPaymentModal
          planName={selectedPlan}
          open={!!selectedPlan}
          onOpenChange={(open) => !open && setSelectedPlan(null)}
        />
      )}
    </div>
  );
}