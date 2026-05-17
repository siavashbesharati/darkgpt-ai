import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Terminal, Cpu, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
export function HomePage() {
  const securityTerms = ["Kali", "Metasploit", "OWASP", "BurpSuite", "Wireshark", "Nmap", "RedTeam", "BlueTeam"];
  const telegramId = useStore(s => s.settings.telegramId);
  const telegramLink = telegramId ? `https://t.me/${telegramId.replace('@', '')}` : '#';
  useEffect(() => {
    document.title = 'DARK GPT | Tactical Intelligence Workspace';
  }, []);
  const headlineVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.05, duration: 0.1 }
    })
  };
  const title = "ORCHESTRATE EXPLOITS. DEFEND THE CORE.";
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
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] mb-8">
            {title.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={headlineVariants}
                className={i > 20 ? "text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-zinc-800 to-black dark:from-red-500 dark:via-zinc-400 dark:to-white" : ""}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
          >
            The elite AI arsenal for security researchers. Build payloads and audit architectures at machine speed with Zero-Day precision.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
          >
            <Button asChild size="lg" className="h-14 px-10 text-lg font-black bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all rounded-2xl shadow-xl uppercase tracking-widest relative group overflow-hidden">
              <Link to="/editor" className="flex items-center gap-2">
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
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
            transition={{ duration: 1, delay: 1.2 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-border bg-black shadow-2xl overflow-hidden aspect-video relative group border-t-4 border-t-red-600">
              <div className="tactical-scanline opacity-30" />
              <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <div className="ml-4 px-3 py-1 rounded bg-black text-[10px] text-red-500 font-mono font-bold uppercase tracking-widest">
                  dark-gpt-kernel-v4.0.8
                </div>
              </div>
              <div className="p-8 text-left font-mono text-sm text-zinc-300 space-y-3 bg-gradient-to-b from-black to-zinc-950">
                <p className="text-red-500 flex items-center gap-2 font-bold"><span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> Establishing Secure Tunnel...</p>
                <div className="pl-4 space-y-1">
                  <p><span className="text-zinc-500"># Initializing Payload Generator</span></p>
                  <p><span className="text-red-400">await</span> DarkCore.<span className="text-white">scan</span>(target_url);</p>
                  <p className="pl-4 text-zinc-500">// Vulnerability found: Logic Flow Bypass</p>
                  <p className="pl-4 text-red-500 font-bold">{">>>"} Generating POC exploit...</p>
                  <p className="text-emerald-500">[SUCCESS] Terminal payload synthesized.</p>
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
              { icon: Terminal, title: "Deep Logic Scan", desc: "Advanced trace analysis to find hidden entry points in modern architectures." },
              { icon: Shield, title: "Payload Synth", desc: "Instant synthesis of Proof-of-Concept exploits for authorized security testing." },
              { icon: Cpu, title: "Flow Analysis", desc: "Intelligent packet and flow analysis powered by specialized DarkCore LLMs." },
              { icon: Lock, title: "On-Chain Audit", desc: "Audit smart contracts for reentrancy, overflow, and logic flaws in real-time." }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, borderColor: 'rgba(220, 38, 38, 0.5)' }}
                className="p-8 rounded-3xl border border-border bg-card transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-inherit" />
                </div>
                <h3 className="text-lg font-bold mb-2 uppercase italic tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-24 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="space-y-8">
            <div className="flex justify-center gap-8 mb-4">
              <Link to="/pricing" className="text-xs font-black uppercase text-muted-foreground hover:text-primary transition-colors">Tiers</Link>
              <Link to="/editor" className="text-xs font-black uppercase text-muted-foreground hover:text-primary transition-colors">Workspace</Link>
              <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase text-muted-foreground hover:text-primary transition-colors">Support Channel</a>
            </div>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">© 2024 DARK GPT Research Group. Access Controlled.</p>
            <div className="max-w-3xl mx-auto p-8 rounded-[2.5rem] bg-red-600/5 border border-red-600/20 text-left relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="w-24 h-24 text-red-600" />
              </div>
              <div className="relative z-10">
                <p className="text-[11px] text-red-600 dark:text-red-400 font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Mandatory Operational Disclosure
                </p>
                <div className="space-y-4 text-xs text-muted-foreground leading-relaxed font-medium">
                  <p>
                    DARK GPT is a specialized cybersecurity research platform. All generated payloads, scanning logic, and vulnerability research must be conducted strictly within authorized, sandboxed environments.
                  </p>
                  <p className="p-3 bg-red-600/10 rounded-xl border border-red-600/10 text-red-600 dark:text-red-400 font-bold italic">
                    AI SERVICE NOTICE: There is a system-wide limit on the number of requests that can be made to the AI servers across all user apps in a given time period. Please manage your Power Credits accordingly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}