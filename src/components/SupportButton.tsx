import React from 'react';
import { Send } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export function SupportButton() {
  const telegramId = useStore(s => s.settings.telegramId);
  if (!telegramId) return null;
  const telegramLink = `https://t.me/${telegramId.replace('@', '')}`;
  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-primary/20 group"
            >
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 pointer-events-none" />
              <div className="absolute inset-0 rounded-full bg-primary/40 blur-lg group-hover:bg-primary/60 transition-all" />
              <Send className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
            </motion.a>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-background border-border text-foreground font-black uppercase text-[10px] tracking-widest px-4 py-2 mr-2">
            Contact Command
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}