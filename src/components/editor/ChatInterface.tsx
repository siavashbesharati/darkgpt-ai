import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
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
}
interface ChatInterfaceProps {
  onStreamUpdate: (text: string) => void;
}
export function ChatInterface({ onStreamUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const consumeCredit = useStore((s) => s.consumeCredit);
  const credits = useStore((s) => s.credits);
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
      toast.error("You have reached your daily token limit.", {
        description: "Upgrade your plan to continue building.",
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
    // Consume credit on submit
    consumeCredit();
    let fullStreamedText = "";
    try {
      const result = await chatService.sendMessage(input, undefined, (chunk) => {
        fullStreamedText += chunk;
        onStreamUpdate(fullStreamedText);
      });
      if (result.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: fullStreamedText }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Error: " + result.error }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/30">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-red-400"
          onClick={() => { setMessages([]); onStreamUpdate(""); chatService.newSession(); }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="h-[200px] flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <p className="text-slate-200 font-medium">Ready to build your next project?</p>
                <p className="text-slate-500 text-sm">Ask me to build a dashboard, a component, or an API.</p>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn(
              "flex gap-4 p-4 rounded-xl",
              m.role === 'user' ? "bg-white/5" : "bg-transparent"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                m.role === 'user' ? "bg-slate-700 text-slate-200" : "bg-cyan-500/20 text-cyan-400"
              )}>
                {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="flex-1 text-sm leading-relaxed overflow-hidden prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 p-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 animate-spin" />
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
      <div className="p-4 bg-slate-950 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-slate-600 text-sm"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute right-1.5 top-1.5 h-10 w-10 bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-500"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="mt-3 text-[10px] text-center text-slate-500">
          AetherCode AI can make mistakes. Verify important code.
        </p>
      </div>
    </div>
  );
}