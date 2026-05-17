import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Zap, Terminal, Cpu, Layers, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
export function HomePage() {
  const securityTerms = ["Kali", "Metasploit", "OWASP", "BurpSuite", "Wireshark", "Nmap", "RedTeam", "BlueTeam"];
  useEffect(() => {
    document.title = 'DARK GPT | Ethical Hacking Workspace';
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <div className="relative pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,0,0,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-foreground text-xs font-black uppercase tracking-[0.2em] mb-8"
          >
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>Operational Security Intelligence</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] mb-8"
          >
            ORCHESTRATE EXPLOITS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-zinc-800 to-black dark:from-red-500 dark:via-zinc-400 dark:to-white">
              DEFEND THE CORE.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
          >
            DARK GPT is the ultimate AI arsenal for security researchers and ethical hackers. Build penetration testing tools and audit architecture at machine speed.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
          >
            <Button asChild size="lg" className="h-14 px-10 text-lg font-black bg-primary text-primary-foreground hover:scale-105 transition-all rounded-2xl shadow-xl uppercase tracking-widest">
              <Link to="/editor" className="flex items-center gap-2">
                Initialize Ops <Terminal className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-border bg-background hover:bg-muted transition-all rounded-2xl uppercase tracking-widest">
              <Link to="/pricing">Power Tiers</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-border bg-black shadow-2xl overflow-hidden aspect-video relative group border-t-4 border-t-red-600">
              <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <div className="ml-4 px-3 py-1 rounded bg-black text-[10px] text-red-500 font-mono font-bold uppercase tracking-widest">
                  dark-gpt-kernel-v4
                </div>
              </div>
              <div className="p-8 text-left font-mono text-sm text-zinc-300 space-y-3 bg-gradient-to-b from-black to-zinc-950">
                <p className="text-red-500 flex items-center gap-2 font-bold"><span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> Establishing Secure Tunnel...</p>
                <div className="pl-4 space-y-1">
                  <p><span className="text-zinc-500"># Initializing Payload Generator</span></p>
                  <p><span className="text-red-400">await</span> DarkCore.<span className="text-white">scan</span>(target_url);</p>
                  <p className="pl-4 text-zinc-500">// Vulnerability found: SQL Injection (Blind)</p>
                  <p className="pl-4 text-red-500 font-bold">>>> Generating POC exploit...</p>
                  <p className="text-emerald-500">[SUCCESS] Exploit logic verified.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="py-10 border-y border-border bg-muted/30 overflow-hidden relative">
        <div className="flex gap-20 whitespace-nowrap animate-marquee px-4">
          {[...securityTerms, ...securityTerms].map((f, i) => (
            <span key={i} className="text-2xl font-display font-black tracking-tighter italic text-muted-foreground/30 hover:text-primary transition-colors cursor-default">
              {f.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Terminal, title: "Vulnerability Analysis", desc: "Deep-trace logic scanning to find hidden entry points in modern architectures." },
              { icon: Shield, title: "Payload Generation", desc: "Instant synthesis of Proof-of-Concept exploits for authorized security testing." },
              { icon: Cpu, title: "Network Auditing", desc: "Intelligent packet and flow analysis powered by specialized DarkCore LLMs." },
              { icon: Lock, title: "On-Chain Security", desc: "Audit smart contracts for reentrancy, overflow, and logic flaws in real-time." }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-border bg-card hover:border-red-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-inherit" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-24 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="space-y-8">
            <p className="text-muted-foreground text-sm font-medium">© 2024 DARK GPT Security Research Group.</p>
            <div className="max-w-2xl mx-auto p-6 rounded-[2rem] bg-red-600/5 border border-red-600/20 inline-block shadow-sm">
              <p className="text-[10px] text-red-600 dark:text-red-400 font-black uppercase tracking-[0.2em] mb-3">Mandatory Ethical Disclosure</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                DARK GPT is a specialized cybersecurity research platform. All generated payloads, scanning logic, and 
                vulnerability research must be conducted strictly within authorized, sandboxed environments. 
                Users are solely responsible for compliance with international and local cyber laws.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}