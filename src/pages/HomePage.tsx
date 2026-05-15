import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Code2, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-cyan-500/30">
      <Navbar />
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(138,43,226,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen AI Development Environment</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-bold tracking-tight leading-[1.1]"
            >
              Build your vision at the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500">
                speed of thought.
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              AetherCode AI combines a powerful workspace with elite intelligence to help you ship production-grade code faster than ever before.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold bg-white text-slate-950 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95">
                <Link to="/editor" className="flex items-center gap-2">
                  Start Coding for Free <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </motion.div>
            {/* Mock IDE Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-20" />
              <div className="h-10 bg-slate-800/50 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                </div>
              </div>
              <div className="p-6 text-left font-mono text-sm text-slate-400 space-y-2">
                <p className="text-cyan-400">// Initializing AetherCode Engine...</p>
                <p><span className="text-violet-400">import</span> {'{ Aether }'} <span className="text-violet-400">from</span> <span className="text-emerald-400">'@aethercode/sdk'</span>;</p>
                <p className="pl-4"><span className="text-violet-400">const</span> app = <span className="text-cyan-400">new</span> <span className="text-yellow-400">Aether</span>();</p>
                <p className="pl-4">app.<span className="text-yellow-400">onStream</span>((code) =&gt; {'{'}</p>
                <p className="pl-8 text-slate-500">/* Your vision renders here in real-time */</p>
                <p className="pl-4">{'}'});</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="px-6 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                   Launch Workspace
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Feature Grid */}
      <section className="py-24 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Instant Streaming", desc: "Watch code materialize as the AI thinks, powered by Cloudflare Workers." },
              { icon: ShieldCheck, title: "Crypto Secure", desc: "Native on-chain payments with Bitcoin, Ethereum, and Solana." },
              { icon: Globe, title: "MCP Ready", desc: "Deep integration with Model Context Protocol for real-world tool access." }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:border-cyan-500/50 transition-colors group">
                <f.icon className="w-10 h-10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2024 AetherCode AI. All rights reserved. Built with Cloudflare Agents.</p>
        <p className="mt-2 text-xs">AI generation limits apply to all free accounts.</p>
      </footer>
    </div>
  );
}