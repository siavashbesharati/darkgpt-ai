import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, ShieldAlert, Trash2, AlertCircle, Terminal, Lock, Rocket } from 'lucide-react';
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
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
interface ChatInterfaceProps {
  onStreamUpdate: (text: string) => void;
}
export function ChatInterface({ onStreamUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isDark } = useTheme();
  const currentSessionId = useStore(s => s.currentSessionId);
  const userCredits = useStore(s => s.user?.credits ?? 0);
  const token = useStore(s => s.token);
  const refreshUser = useStore(s => s.refreshUser);
  const logout = useStore(s => s.logout);
  const pendingPrompt = useStore(s => s.pendingPrompt);
  const setPendingPrompt = useStore(s => s.setPendingPrompt);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (pendingPrompt) {
      setInput(pendingPrompt);
      setPendingPrompt(null);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [pendingPrompt, setPendingPrompt]);
  useEffect(() => {
    const loadHistory = async () => {
      if (!currentSessionId || !token) {
        setMessages([]);
        onStreamUpdate("");
        return;
      }
      setMessages([]);
      const res = await chatService.getMessages(currentSessionId, token);
      if (res.success && res.data?.messages) {
        setMessages(res.data.messages);
        const lastAssistantMsg = [...res.data.messages].reverse().find(m => m.role === 'assistant');
        if (lastAssistantMsg) {
          onStreamUpdate(lastAssistantMsg.content);
        } else {
          onStreamUpdate("");
        }
      }
    };
    loadHistory();
  }, [currentSessionId, token, onStreamUpdate]);
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  useEffect(scrollToBottom, [scrollToBottom, messages, isLoading]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!token) {
      toast.error("Operator verification required");
      return;
    }
    if (userCredits <= 0) {
      setShowUpgradeModal(true);
      return;
    }
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
          timestamp: Date.now(),
          toolCalls: []
        }]);
        await refreshUser();
      } else {
        if (result.error === 'USER_BLOCKED') {
          logout();
          navigate('/');
        } else if (result.error === 'OUT_OF_CREDITS') {
          setShowUpgradeModal(true);
        } else {
          toast.error("Logic Engine Error", { description: result.error || "Tunnel connection failed" });
        }
      }
    } catch (err) {
      toast.error("Core Interrupted");
    } finally {
      setIsLoading(false);
    }
  };
  const handleClear = async () => {
    if (!currentSessionId) return;
    const res = await chatService.clearMessages(currentSessionId, token ?? undefined);
    if (res.success) {
      setMessages([]);
      onStreamUpdate("");
      toast.success("Engagement logs purged");
    }
  };
  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-black text-sm text-foreground tracking-widest uppercase italic">
            {currentSessionId ? "DarkCore Oracle" : "Standby for Target"}
          </span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{userCredits} POWER</span>
           {currentSessionId && (
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 transition-colors">
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>Purge Logs?</AlertDialogTitle>
                   <AlertDialogDescription>
                     This will permanently disconnect this engagement. All research artifacts will be lost.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>Abort</AlertDialogCancel>
                   <AlertDialogAction onClick={handleClear} className="bg-destructive hover:bg-destructive/90">Confirm Purge</AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           )}
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-2xl mx-auto">
          {messages.length === 0 && (
            <div className="py-20 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="p-6 rounded-[2rem] bg-black text-red-500 border border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                <Lock className="w-12 h-12" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">DARK GPT KERNEL</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto font-bold leading-relaxed uppercase">
                  Initialize research by defining target parameters, vulnerability vectors, or defensive audits.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                {[
                  "Test for SQL injection",
                  "Generate XSS payload scanner",
                  "Audit OAuth flows",
                  "Reverse engineer binary logic"
                ].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="p-4 rounded-2xl bg-card border border-border hover:border-red-500/40 hover:bg-red-500/5 transition-all text-left text-xs font-black text-foreground/70 uppercase tracking-tight"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={m.id || i} className={cn(
              "flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
              m.role === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "flex gap-4 p-4 rounded-2xl max-w-[95%] border shadow-sm",
                m.role === 'user' ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
              )}>
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1",
                  m.role === 'user' ? "bg-primary-foreground text-primary" : "bg-black text-red-500 border border-red-900"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "flex-1 text-sm leading-relaxed prose prose-sm max-w-none break-words font-mono",
                  isDark ? "prose-invert" : "prose-slate",
                  m.role === 'user' && "text-primary-foreground"
                )}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 p-4">
              <div className="w-7 h-7 rounded-lg bg-black border border-red-900 text-red-500 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex-1 animate-pulse space-y-2 py-2">
                <div className="h-2 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-4 bg-background/95 backdrop-blur border-t border-border space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600/5 border border-red-600/20">
          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          <p className="text-[10px] text-red-600 font-black leading-tight uppercase tracking-[0.1em]">
            KERNEL STATUS: DARKCORE 2.0 ORACLE IS CURRENTLY SYNTHESIZING.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Input research parameters..."
            className="w-full bg-background border border-border rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-muted-foreground text-sm text-foreground shadow-sm resize-none min-h-[56px] max-h-32 font-mono"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute right-2 top-2 h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-30 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-[440px] bg-slate-950 border-white/10 text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
          <DialogHeader className="pt-4">
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-full bg-red-600/10 border border-red-600/20">
                <ShieldAlert className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-black text-center uppercase tracking-tighter italic">Power Limit Exceeded</DialogTitle>
            <DialogDescription className="text-center text-slate-400 font-bold uppercase text-xs px-4">
              Your research depth has exceeded the current tier allocation. Advanced kernel synthesis requires higher clearance.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-widest">Active Credits</p>
                  <p className="text-xs text-slate-500 uppercase font-bold">0 units remaining</p>
                </div>
              </div>
              <Badge variant="outline" className="border-red-600/50 text-red-600 uppercase font-black text-[10px]">LOCKED</Badge>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button
              onClick={() => navigate('/pricing')}
              className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest gap-2"
            >
              Request Clearance <Rocket className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowUpgradeModal(false)}
              className="w-full h-12 text-slate-500 hover:text-white uppercase font-black text-[10px]"
            >
              Return to Console
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}