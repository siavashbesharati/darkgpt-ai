import React, { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Navbar } from '@/components/layout/Navbar';
import { ChatInterface } from '@/components/editor/ChatInterface';
import { CodeViewer } from '@/components/editor/CodeViewer';
import { extractLatestCodeBlock, ExtractedCode } from '@/lib/code-extractor';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export function EditorPage() {
  const [streamingText, setStreamingText] = useState("");
  const [extractedCode, setExtractedCode] = useState<ExtractedCode | null>(null);
  // Sync extracted code with the latest code block found in streaming text
  useEffect(() => {
    const latest = extractLatestCodeBlock(streamingText);
    if (latest) {
      setExtractedCode(latest);
    }
  }, [streamingText]);

  const handleSave = () => {
    toast.success("Project version saved successfully", {
      description: "Snapshot created at " + new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50 overflow-hidden max-w-screen-2xl mx-auto border-x border-white/5 shadow-2xl">
      <Navbar />
      <div className="absolute top-2 right-16 z-[60] flex items-center gap-2">
        <Button size="sm" variant="ghost" className="h-8 bg-white/5 border border-white/10 hover:bg-white/10 gap-2" onClick={handleSave}>
          <Save className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Save</span>
        </Button>
      </div>
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={30} className="flex flex-col border-r border-white/10">
            <ChatInterface onStreamUpdate={setStreamingText} />
          </ResizablePanel>
          <ResizableHandle withHandle className="w-1 bg-white/5 hover:bg-cyan-500/40 transition-colors data-[drag=active]:bg-cyan-500/60" />
          <ResizablePanel defaultSize={60} minSize={40}>
            <CodeViewer
              code={extractedCode?.code || "// Start a conversation to generate code..."}
              language={extractedCode?.language || "typescript"}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}