import React from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal, Shield, Zap, Search, LayoutGrid, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
interface AppGalleryProps {
  onDeploy: () => void;
}
export function AppGallery({ onDeploy }: AppGalleryProps) {
  const prompts = useStore(s => s.prompts);
  const setPendingPrompt = useStore(s => s.setPendingPrompt);
  const handleDeploy = (text: string) => {
    setPendingPrompt(text);
    onDeploy();
  };
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'EXPLOIT': return 'text-red-600 bg-red-600/10 border-red-600/20';
      case 'AUDIT': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      case 'RECON': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'DEFENSE': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3 mb-2">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Intelligence Library</h2>
        </div>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">
          Select tactical payloads to initialize automated security operations.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-red-600/50 transition-all group overflow-hidden shadow-sm hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-black uppercase italic">{prompt.title}</CardTitle>
                      <Badge variant="outline" className={getCategoryColor(prompt.category)}>
                        {prompt.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm font-medium text-muted-foreground line-clamp-1">
                      {prompt.description}
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-10 px-4 bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest gap-2 rounded-xl group-hover:scale-105 transition-all"
                    onClick={() => handleDeploy(prompt.promptText)}
                  >
                    Deploy <Rocket className="w-3.5 h-3.5" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border font-mono text-[11px] text-muted-foreground line-clamp-2 italic">
                    "{prompt.promptText}"
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {prompts.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
              <Shield className="w-16 h-16 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Library Empty. Awaiting Uplink.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}