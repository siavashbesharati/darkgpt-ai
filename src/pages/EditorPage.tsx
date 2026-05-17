import React, { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { AppLayout } from '@/components/layout/AppLayout';
import { Navbar } from '@/components/layout/Navbar';
import { ChatInterface } from '@/components/editor/ChatInterface';
import { CodeViewer } from '@/components/editor/CodeViewer';
import { AppGallery } from '@/components/editor/AppGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractLatestCodeBlock, ExtractedCode } from '@/lib/code-extractor';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Save, Share2, Terminal, Library } from 'lucide-react';
import { toast } from 'sonner';
export function EditorPage() {
  const [streamingText, setStreamingText] = useState("");
  const [extractedCode, setExtractedCode] = useState<ExtractedCode | null>(null);
  const [activeTab, setActiveTab] = useState<string>("console");
  useEffect(() => {
    const latest = extractLatestCodeBlock(streamingText);
    if (latest) setExtractedCode(latest);
  }, [streamingText]);
  const handleSave = () => {
    toast.success("Engagement snapshot saved", {
      description: "Version locked: " + new Date().toLocaleTimeString()
    });
  };
  return (
    <AppLayout className="bg-background overflow-hidden terminal-flicker">
      <div className="tactical-scanline opacity-10" />
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar showTrigger />
        <main className="flex-1 overflow-hidden relative z-10">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={40} minSize={30} className="flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-border bg-muted/20">
                  <TabsList className="bg-transparent border-none p-0 h-9 gap-1">
                    <TabsTrigger
                      value="console"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 h-7 rounded-lg transition-all"
                    >
                      <Terminal className="w-3 h-3 mr-2" /> Console
                    </TabsTrigger>
                    <TabsTrigger
                      value="library"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 h-7 rounded-lg transition-all"
                    >
                      <Library className="w-3 h-3 mr-2" /> Library
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="console" className="flex-1 m-0 overflow-hidden">
                  <ChatInterface onStreamUpdate={setStreamingText} />
                </TabsContent>
                <TabsContent value="library" className="flex-1 m-0 overflow-hidden">
                  <AppGallery onDeploy={() => setActiveTab("console")} />
                </TabsContent>
              </Tabs>
            </ResizablePanel>
            <ResizableHandle withHandle className="w-1.5 bg-border/50 hover:bg-red-600/30 transition-colors" />
            <ResizablePanel defaultSize={60} minSize={40} className="flex flex-col relative">
              <div className="absolute top-2.5 right-20 z-50 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-muted-foreground hover:text-foreground bg-muted/30 border border-border hover:bg-muted/50 gap-2 px-3 transition-all rounded-lg"
                  onClick={handleSave}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase">Snap</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-muted-foreground hover:text-foreground bg-muted/30 border border-border hover:bg-muted/50 gap-2 px-3 transition-all rounded-lg"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase">Push</span>
                </Button>
              </div>
              <CodeViewer
                code={extractedCode?.code || "// STANDBY FOR KERNEL OUTPUT...\n// START A CONVERSATION TO INJECT CODE."}
                language={extractedCode?.language || "typescript"}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </AppLayout>
  );
}