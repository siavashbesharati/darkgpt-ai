import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Loader2, RefreshCw, Maximize2, Copy, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
interface PreviewSandboxProps {
  code: string;
  language: string;
}
export const PreviewSandbox = memo(function PreviewSandbox({ code, language }: PreviewSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generateSrcDoc = useCallback(() => {
    try {
      if (['html', 'xml', 'svg'].includes(language)) {
        const hasFullStructure = code.includes('<html') || code.includes('<body');
        if (hasFullStructure) return code;
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { margin: 0; padding: 24px; background: white; color: #0f172a; min-height: 100vh; font-family: sans-serif; }
            </style>
          </head>
          <body>${code}</body>
          </html>
        `;
      }
      if (['javascript', 'typescript', 'jsx', 'tsx', 'js', 'ts'].includes(language)) {
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
               body { background: #f8fafc; margin: 0; padding: 20px; font-family: sans-serif; }
               #root { background: white; border-radius: 12px; min-height: calc(100vh - 40px); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="module">
              try {
                ${code}
              } catch (err) {
                const root = document.getElementById('root');
                root.innerHTML = \`<div style="padding: 32px; font-family: monospace; color: #ef4444; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px;">
                  <h3 style="margin: 0 0 16px 0;">Runtime Error</h3>
                  <pre style="white-space: pre-wrap; font-size: 13px;">\${err.stack || err.message}</pre>
                </div>\`;
              }
            </script>
          </body>
          </html>
        `;
      }
      return `<!DOCTYPE html><html><body style="display:flex;align-items:center;justify-content:center;height:100vh;color:#94a3b8;font-family:sans-serif">Preview not available for ${language}</body></html>`;
    } catch (err) {
      return `<!DOCTYPE html><html><body>Error generating preview</body></html>`;
    }
  }, [code, language]);
  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = generateSrcDoc();
    }
  }, [generateSrcDoc]);
  useEffect(() => {
    const timer = setTimeout(refresh, 500); // Debounce for streaming
    return () => clearTimeout(timer);
  }, [refresh]);
  const copySrc = () => {
    navigator.clipboard.writeText(generateSrcDoc());
    toast.success("Source doc copied to clipboard");
  };
  const popOut = () => {
    const blob = new Blob([generateSrcDoc()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };
  return (
    <div className="relative w-full h-full bg-[#f8fafc] overflow-hidden flex flex-col group">
      <div className="absolute top-3 right-3 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white/90 backdrop-blur border border-slate-200 shadow-sm hover:bg-white"
          onClick={copySrc}
          title="Copy Source"
        >
          <Copy className="w-3.5 h-3.5 text-slate-600" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white/90 backdrop-blur border border-slate-200 shadow-sm hover:bg-white"
          onClick={popOut}
          title="Pop out"
        >
          <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white/90 backdrop-blur border border-slate-200 shadow-sm hover:bg-white"
          onClick={refresh}
          title="Reset & Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <iframe
        ref={iframeRef}
        title="preview-sandbox"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals allow-forms allow-popups"
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-3">
             <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rendering...</span>
          </div>
        </div>
      )}
    </div>
  );
});