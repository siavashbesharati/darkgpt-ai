import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Zap, LayoutDashboard, MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const location = useLocation();
  const credits = useStore((s) => s.credits);
  const tier = useStore((s) => s.tier);
  const settings = useStore((s) => s.settings);
  const maxCredits = tier === 'Free' ? settings.freeTierLimit : tier === 'Pro' ? settings.proTierLimit : settings.maxTierLimit;
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Workspace', path: '/editor' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  ];

  const handleFeedback = () => {
    toast.success("Feedback recorded! Thank you for helping us improve AetherCode.");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 transition-transform group-hover:scale-110">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                AetherCode
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2",
                    location.pathname === item.path
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleFeedback} className="hidden lg:flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mr-2">
              <MessageSquarePlus className="w-3.5 h-3.5" />
              Feedback
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-slate-300">Tokens:</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={credits}
                  initial={{ scale: 1.2, color: '#22d3ee' }}
                  animate={{ scale: 1, color: '#22d3ee' }}
                  className="inline-block"
                >
                  <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-none h-5 px-1.5 text-[10px]">
                    {credits}/{maxCredits}
                  </Badge>
                </motion.div>
              </AnimatePresence>
            </div>
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </div>
      </div>
    </nav>
  );
}