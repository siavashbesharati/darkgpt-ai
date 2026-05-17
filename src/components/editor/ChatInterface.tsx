import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Trash2, AlertCircle, Terminal } from 'lucide-react';
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
interface ChatInterfaceProps {
  onStreamUpdate: (text: string) => void;
}
export function ChatInterface({ onStreamUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();
  const currentSessionId = useStore(s => s.currentSessionId);
  const userCredits = useStore(s => s.user?.credits ?? 0);
  const token = useStore(s => s.token);
  const refreshUser = useStore(s => s.refreshUser);
  const logout = useStore(s => s.logout);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  // Reactive History Loading
  useEffect(() => {
    const loadHistory = async () => {
      if (!currentSessionId || !token) {
        setMessages([]);
        onStreamUpdate("");
        return;
      }
      setMessages([]); // Instant feedback
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
      toast.error("Authentication required");
      return;
    }
    if (userCredits <= 0) {
      toast.error("Daily Token Limit Reached", {
        description: "Your vision is growing faster than your credits. Upgrade to continue.",
        action: { label: "View Pricing", onClick: () => navigate('/pricing') },
      });
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
        } else {
          toast.error("Generation Failed", { description: result.error || "A connection error occurred" });
        }
      }
    } catch (err) {
      toast.error("Connection Interrupted");
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
      toast.success("Workspace cleared");
    }
  };
  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm text-foreground tracking-tight">
            {currentSessionId ? "Aether Engine" : "Ready to Build"}
          </span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{userCredits} Credits</span>
           {currentSessionId && (
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 transition-colors">
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>Clear History?</AlertDialogTitle>
                   <AlertDialogDescription>
                     This will delete all messages in this session. Code snapshots are not affected.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction onClick={handleClear} className="bg-destructive hover:bg-destructive/90">Clear</AlertDialogAction>
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
              <div className="p-6 rounded-[2rem] bg-muted text-primary border border-border shadow-inner">
                <Sparkles className="w-12 h-12" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black tracking-tighter text-foreground">Aether Workspace</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto font-medium leading-relaxed">
                  Start a new vision by describing a component, a full page, or a technical architecture.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                {[
                  "Build a crypto landing page",
                  "Create a dashboard sidebar",
                  "Explain TON smart contracts",
                  "Write a React hook for API"
                ].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-muted/50 transition-all text-left text-xs font-bold text-foreground/70"
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
                  m.role === 'user' ? "bg-primary-foreground text-primary" : "bg-muted text-primary"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "flex-1 text-sm leading-relaxed prose prose-sm max-w-none break-words",
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
              <div className="w-7 h-7 rounded-lg bg-muted text-primary flex items-center justify-center shrink-0">
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
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border">
          <AlertCircle className="w-3.5 h-3.5 text-primary" />
          <p className="text-[10px] text-muted-foreground font-bold leading-tight uppercase tracking-[0.1em]">
            Elite Tier: Gemini 2.0 Flash is currently orchestrating.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Describe your vision..."
            className="w-full bg-background border border-border rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground text-sm text-foreground shadow-sm resize-none min-h-[56px] max-h-32"
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
    </div>
  );
}