import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Loader2, ShieldAlert, Trash2, AlertCircle, Terminal, Lock, Rocket, Zap, Copy, AlertTriangle } from 'lucide-react';
import { chatService } from '@/lib/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../../../worker/types';
import { useTheme } from '@/hooks/use-theme';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
interface ChatInterfaceProps {
  onStreamUpdate: (text: string) => void;
}
const THINKING_MESSAGES = [
  "Bypassing logic gates...",
  "Synthesizing payload vectors...",
  "Analyzing kernel flow...",
  "Mapping network surface...",
  "Decrypting response...",
  "Generating research output..."
];
export function ChatInterface({ onStreamUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [thinkingIdx, setThinkingIdx] = useState(0);
  const { isDark } = useTheme();
  const currentSessionId = useStore(s => s.currentSessionId);
  const userCredits = useStore(s => s.user?.credits ?? 0);
  const userTier = useStore(s => s.user?.tier ?? 'Free');
  const token = useStore(s => s.token);
  const refreshUser = useStore(s => s.refreshUser);
  const logout = useStore(s => s.logout);
  const pendingPrompt = useStore(s => s.pendingPrompt);
  const setPendingPrompt = useStore(s => s.setPendingPrompt);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setThinkingIdx(prev => (prev + 1) % THINKING_MESSAGES.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  useEffect(() => {
    if (pendingPrompt) {
      setInput(pendingPrompt);
      setPendingPrompt(null);
      if (textareaRef.current) textareaRef.current.focus();
    }
  }, [pendingPrompt, setPendingPrompt]);
  useEffect(() => {
    const loadHistory = async () => {
      if (!currentSessionId || !token) {
        setMessages([]);
        onStreamUpdate("");
        return;
      }
      const res = await chatService.getMessages(currentSessionId, token);
      if (res.success && res.data?.messages) {
        setMessages(res.data.messages);
        const lastAssistantMsg = [...res.data.messages].reverse().find(m => m.role === 'assistant');
        if (lastAssistantMsg) onStreamUpdate(lastAssistantMsg.content);
      }
    };
    loadHistory();
  }, [currentSessionId, token, onStreamUpdate]);
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);
  useEffect(scrollToBottom, [scrollToBottom, messages, isLoading]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!token) return toast.error("Operator verification required");
    if (userCredits <= 0) return setShowUpgradeModal(true);
    const targetSessionId = currentSessionId || crypto.randomUUID();
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      let fullStreamedText = "";
      const result = await chatService.sendMessage(
        targetSessionId,
        input,
        undefined,
        (chunk) => {
          fullStreamedText += chunk;
          onStreamUpdate(fullStreamedText);
        },
        token
      );
      if (result.success) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullStreamedText,
          timestamp: Date.now()
        }]);
        await refreshUser();
      } else {
        if (result.error === 'USER_BLOCKED') {
          logout(); navigate('/');
        } else if (result.error === 'OUT_OF_CREDITS') {
          setShowUpgradeModal(true);
        } else {
          toast.error("Logic Engine Error");
        }
      }
    } catch (err) {
      toast.error("Core Interrupted");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopySession = () => {
    if (!currentSessionId) return;
    navigator.clipboard.writeText(currentSessionId);
    toast.success("Engagement ID copied");
  };
  return (
    <div className="flex flex-col h-full bg-background border-r border-border terminal-flicker">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-black text-[10px] text-foreground tracking-widest uppercase italic">
            {currentSessionId ? "Oracle_Active" : "Standby_Mode"}
          </span>
          {currentSessionId && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={handleCopySession}>
              <Copy className="w-3 h-3" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-red-600/5 text-red-600 border-red-600/20 gap-1.5 px-2 py-0.5">
             <Zap className="w-3 h-3 fill-red-600" />
             <span className="text-[10px] font-black uppercase tracking-widest">{userCredits} PWR</span>
           </Badge>
           <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
             {userTier}
           </Badge>
           {currentSessionId && (
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>Purge Logs?</AlertDialogTitle>
                   <AlertDialogDescription>Permanently disconnect engagement artifacts.</AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>Abort</AlertDialogCancel>
                   <AlertDialogAction onClick={async () => {
                     await chatService.clearMessages(currentSessionId, token!);
                     setMessages([]); onStreamUpdate(""); toast.success("Logs purged");
                   }} className="bg-destructive hover:bg-destructive/90">Confirm Purge</AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           )}
        </div>
      </div>
      <ScrollArea className="flex-1 p-4 bg-muted/5">
        <div className="space-y-6 max-w-2xl mx-auto">
          {messages.length === 0 && (
            <div className="py-20 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="p-6 rounded-2xl bg-black text-red-500 border border-red-900 shadow-glow">
                <Lock className="w-12 h-12" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic glitch-text">DARK GPT KERNEL</h3>
                <p className="text-muted-foreground text-xs max-w-xs mx-auto font-bold leading-relaxed uppercase tracking-widest">
                  Awaiting operational parameters. Define target or load tactical payload.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                {["Test for SQL injection", "Generate XSS scanner", "Audit OAuth flows", "Binary logic audit"].map(prompt => (
                  <button key={prompt} onClick={() => setInput(prompt)} className="p-4 rounded-xl bg-card border border-border hover:border-red-500/40 hover:bg-red-500/5 transition-all text-left text-[10px] font-black text-foreground/70 uppercase tracking-tight">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={m.id || i} className={cn("flex flex-col gap-2", m.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn(
                "flex gap-3 p-4 rounded-xl max-w-[95%] border shadow-sm transition-all",
                m.role === 'user' ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
              )}>
                <div className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5",
                  m.role === 'user' ? "bg-primary-foreground text-primary" : "bg-black text-red-500 border border-red-900"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "flex-1 text-[13px] leading-relaxed prose prose-sm max-w-none break-words font-mono",
                  isDark ? "prose-invert" : "prose-slate",
                  m.role === 'user' && "text-primary-foreground"
                )}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 p-4 items-center justify-center">
              <div className="w-7 h-7 rounded-md bg-black border border-red-900 text-red-500 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex flex-col gap-1.5 items-center">
                <span className="text-[10px] font-black uppercase text-red-600 animate-pulse">
                  {THINKING_MESSAGES[thinkingIdx]}
                </span>
                <div className="h-1.5 w-48 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-4 bg-background border-t border-border space-y-3">
        {userCredits <= 2 && userCredits > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">
              Tactical Warning: Power levels critical.
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            placeholder="Initialize operational parameters..."
            className="w-full bg-muted/20 border border-border rounded-xl px-5 py-4 pr-14 focus:outline-none focus:border-red-600/30 transition-all placeholder:text-muted-foreground text-sm text-foreground shadow-sm resize-none min-h-[56px] max-h-32 font-mono"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="absolute right-2 top-2 h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-30 rounded-lg">
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="flex items-center justify-center gap-2 pt-1 opacity-60">
          <AlertTriangle className="w-3 h-3 text-muted-foreground" />
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            AI SERVICE NOTICE: Platform-wide request limits enforced across all active sessions.
          </p>
        </div>
      </div>
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-[440px] bg-slate-950 border-white/10 text-white overflow-hidden p-0">
          <div className="h-1 w-full bg-red-600" />
          <div className="p-8 space-y-6">
            <div className="flex justify-center">
              <div className="p-6 rounded-3xl bg-red-600/10 border border-red-600/20 shadow-glow">
                <ShieldAlert className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-3xl font-black uppercase italic tracking-tighter">Power Expired</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest px-4">
                Operational bandwidth reached limit. Advanced clearance required.
              </p>
            </div>
            <Button onClick={() => navigate('/pricing')} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest gap-2">
              ACQUIRE POWER <Rocket className="w-5 h-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}