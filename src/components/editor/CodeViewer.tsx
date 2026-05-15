import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Play, Maximize2, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PreviewSandbox } from './PreviewSandbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CodeViewerProps {
  code: string;
  language: string;
}
export function CodeViewer({ code, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePopOut = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-900/50">
          <TabsList className="bg-slate-800/50 border border-white/5">
            <TabsTrigger value="code" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-950">Code</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-950">Preview</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
              <Label htmlFor="auto-refresh" className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Live</Label>
              <Switch 
                id="auto-refresh" 
                checked={autoRefresh} 
                onCheckedChange={setAutoRefresh}
                className="scale-75 data-[state=checked]:bg-cyan-500" 
              />
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 h-8 gap-2" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8" onClick={handlePopOut}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <TabsContent value="code" className="flex-1 m-0">
          <Editor
            height="100%"
            defaultLanguage={language}
            theme="vs-dark"
            value={code}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20 },
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3
            }}
          />
        </TabsContent>
        <TabsContent value="preview" className="flex-1 m-0 bg-white">
          {autoRefresh ? (
            <PreviewSandbox code={code} language={language} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-900 p-8 text-center space-y-4">
               <Monitor className="w-12 h-12 text-slate-300" />
               <p className="text-slate-500 text-sm">Live preview is paused.</p>
               <Button onClick={() => setAutoRefresh(true)} variant="outline">Resume Live View</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}