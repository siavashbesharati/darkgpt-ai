import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Trash2, Info, AlertCircle } from 'lucide-react';
import { chatService } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
interface Message {
  role: 'user' | 'assistant';
  content: string;
  tokens?: number;
}
interface ChatInterfaceProps {
  onStreamUpdate: (text: string) => void;
}
export function ChatInterface({ onStreamUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useStore(s => s.user);
  const consumeCredit = useStore(s => s.consumeCredit);
  const credits = user?.credits ?? 0;
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  useEffect(scrollToBottom, [messages, isLoading]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (credits <= 0) {
      toast.error("Daily Token Limit Reached", {
        description: "Your vision is growing faster than your credits. Upgrade to continue.",
        action: {
          label: "View Pricing",
          onClick: () => navigate('/pricing'),
        },
      });
      return;
    }
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const success = await consumeCredit();
      if (!success) {
        toast.error("Subscription Error", { description: "Please check your account status." });
        setIsLoading(false);
        return;
      }
      let fullStreamedText = "";
      const result = await chatService.sendMessage(input, undefined, (chunk) => {
        fullStreamedText += chunk;
        onStreamUpdate(fullStreamedText);
      });
      if (result.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: fullStreamedText,
          tokens: Math.floor(fullStreamedText.length / 4) // Mock token count
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "System error: " + result.error }]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection Interrupted");
    } finally {
      setIsLoading(false);
    }
  };
  const suggestions = [
    "Build a responsive landing page for a SaaS",
    "Create a glassmorphic dashboard with Tailwind",
    "Write a TypeScript hook for local storage",
    "Design a dark-themed login form"
  ];
  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/30">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold text-sm">Aether Engine</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-red-400 h-8 w-8"
          onClick={() => { setMessages([]); onStreamUpdate(""); chatService.newSession(); }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-2xl mx-auto">
          {messages.length === 0 && (
            <div className="py-12 flex flex-col items-center text-center space-y-6">
              <div className="p-4 rounded-3xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-200">How can I help you build?</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Select a quick-start prompt or describe your project below.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    className="p-3 text-left text-xs font-medium bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/50 transition-all text-slate-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn(
              "group flex flex-col gap-2 transition-all",
              m.role === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "flex gap-4 p-4 rounded-2xl max-w-[90%]",
                m.role === 'user' ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-white/5 border border-white/5"
              )}>
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1",
                  m.role === 'user' ? "bg-cyan-500 text-slate-950" : "bg-violet-500/20 text-violet-400"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="flex-1 text-sm leading-relaxed overflow-hidden prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
              {m.tokens && (
                <span className="text-[10px] text-slate-600 font-mono flex items-center gap-1.5 px-2">
                  <Zap className="w-2.5 h-2.5" />
                  {m.tokens} tokens burned
                </span>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 p-4">
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex-1 animate-pulse space-y-2 py-2">
                <div className="h-2 bg-slate-800 rounded w-3/4" />
                <div className="h-2 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-4 bg-slate-950/80 backdrop-blur-md border-t border-white/5 space-y-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          <p className="text-[10px] text-amber-500/80 font-medium leading-tight">
            Important: AI generation limits apply across all user apps in a given time period.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command or describe a feature..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-slate-600 text-sm text-slate-200"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute right-1.5 top-1.5 h-10 w-10 bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all disabled:bg-slate-800"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}