import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Play, Maximize2, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
interface CodeViewerProps {
  code: string;
  language: string;
}
export function CodeViewer({ code, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
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
            <Button variant="ghost" size="sm" className="text-slate-400 h-8 gap-2" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
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
          <div className="h-full flex flex-col items-center justify-center text-slate-900 p-8 text-center space-y-4">
             <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
               <Monitor className="w-12 h-12 text-slate-400" />
             </div>
             <div>
               <h3 className="text-xl font-bold">Live Preview Sandbox</h3>
               <p className="text-slate-500 max-w-sm mx-auto">
                 We are preparing the isolated container to run this {language} code. In Phase 3, this will render your code in real-time.
               </p>
             </div>
             <Button variant="outline" className="gap-2">
               <Play className="w-4 h-4" /> Run Code
             </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}