import React, { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Navbar } from '@/components/layout/Navbar';
import { ChatInterface } from '@/components/editor/ChatInterface';
import { CodeViewer } from '@/components/editor/CodeViewer';
import { extractLatestCodeBlock, ExtractedCode } from '@/lib/code-extractor';
import { Toaster } from '@/components/ui/sonner';
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
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={30} className="flex flex-col border-r border-white/10">
            <ChatInterface onStreamUpdate={setStreamingText} />
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-white/5 hover:bg-cyan-500/20 transition-colors" />
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