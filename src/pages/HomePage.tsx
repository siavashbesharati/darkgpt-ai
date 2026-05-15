import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Code2, ShieldCheck, Zap, Globe, Cpu, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
export function HomePage() {
  const frameworks = ["React", "Vue", "TypeScript", "Tailwind", "Vite", "Cloudflare"];
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-cyan-500/30 overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <div className="relative pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen AI Workspace</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] mb-8"
          >
            CODE AT THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500">
              SPEED OF LIGHT.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            AetherCode AI combines deep intelligence with a premium IDE to help you ship production-grade code in minutes, not days.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
          >
            <Button asChild size="lg" className="h-14 px-10 text-lg font-bold bg-white text-slate-950 hover:bg-cyan-500 hover:text-slate-950 transition-all hover:scale-105 rounded-2xl shadow-xl shadow-white/10">
              <Link to="/editor" className="flex items-center gap-2">
                Start Building <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all rounded-2xl">
              <Link to="/pricing">View Tiers</Link>
            </Button>
          </motion.div>
          {/* Floating IDE Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative mx-auto max-w-5xl"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-3xl shadow-[0_0_100px_rgba(6,182,212,0.2)] overflow-hidden aspect-video relative group"
            >
              <div className="h-10 bg-slate-800/80 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <div className="ml-4 px-3 py-1 rounded bg-slate-700/50 text-[10px] text-slate-400 font-mono">
                  aether-workspace-v2
                </div>
              </div>
              <div className="p-8 text-left font-mono text-sm text-slate-300 space-y-3">
                <p className="text-cyan-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Connecting to Aether Engine...</p>
                <div className="pl-4 space-y-1">
                  <p><span className="text-violet-400">async function</span> <span className="text-yellow-400">deployVision</span>() {'{'}</p>
                  <p className="pl-4 text-slate-500">// Processing prompt: "Build a high-conv crypto landing page"</p>
                  <p className="pl-4"><span className="text-cyan-400">const</span> result = <span className="text-violet-400">await</span> engine.<span className="text-yellow-400">generate</span>();</p>
                  <p className="pl-4 text-emerald-400">return result.preview();</p>
                  <p>{'}'}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Marquee Section */}
      <div className="py-10 border-y border-white/5 bg-slate-900/20 overflow-hidden relative">
        <div className="flex gap-20 whitespace-nowrap animate-marquee px-4">
          {[...frameworks, ...frameworks].map((f, i) => (
            <span key={i} className="text-2xl font-display font-black tracking-tighter italic text-slate-700 hover:text-cyan-500/50 transition-colors cursor-default">
              {f.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      {/* Feature Grid */}
      <section className="py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Edge Streaming", desc: "Real-time code generation powered by Cloudflare Workers." },
              { icon: ShieldCheck, title: "On-Chain Tiers", desc: "Native crypto payments with BTC, ETH, and Solana." },
              { icon: Cpu, title: "Elite Models", desc: "Access Gemini 2.0 and Pro models for maximum precision." },
              { icon: Layers, title: "Multi-Session", desc: "Organize infinite projects with persistent history." }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-white/5 bg-white/5 hover:border-cyan-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                  <f.icon className="w-6 h-6 text-cyan-400 group-hover:text-inherit" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer / Mandatory Disclosure */}
      <footer className="py-20 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8 grayscale opacity-50">
             <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" className="h-6" alt="BTC" />
             <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="h-6" alt="ETH" />
             <img src="https://cryptologos.cc/logos/solana-sol-logo.png" className="h-6" alt="SOL" />
          </div>
          <div className="space-y-4">
            <p className="text-slate-500 text-sm">© 2024 AetherCode AI. All rights reserved.</p>
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-slate-900/50 border border-white/5 inline-block">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-1">Mandatory Disclosure</p>
              <p className="text-xs text-slate-500">
                Although this project has AI capabilities, there is a limit on the number of requests that can be made 
                to the AI servers across all user apps in a given time period. Shared resource limits apply.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}