import React from 'react';
import { useStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
/**
 * TemplateDemo - Placeholder for project specific demonstrations
 * strictly following the Zustand Zero-Tolerance selector rule.
 */
export function TemplateDemo() {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const userTier = useStore(s => s.user?.tier);
  if (!isAuthenticated) return null;
  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-left-4 duration-500">
      <Badge variant="outline" className="bg-background/80 backdrop-blur border-primary/20 px-3 py-1.5 flex items-center gap-2 shadow-lg">
        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {userTier} Workspace Active
        </span>
      </Badge>
    </div>
  );
}