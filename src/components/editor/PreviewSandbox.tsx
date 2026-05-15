import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, RefreshCw, AlertCircle, Maximize2, Copy, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
interface PreviewSandboxProps {
  code: string;
  language: string;
}
export function PreviewSandbox({ code, language }: PreviewSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generateSrcDoc = useCallback(() => {
    try {
      if (language === 'html' || language === 'xml' || language === 'svg') {
        const hasFullStructure = code.includes('<html') || code.includes('<body');
        if (hasFullStructure) return code;
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; background: white; color: #0f172a; min-height: 100vh; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>${code}</body>
          </html>
        `;
      }
      if (language === 'javascript' || language === 'typescript' || language === 'jsx' || language === 'tsx') {
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
              const log = (msg) => { console.log('[Aether Preview]', msg); };
              try {
                ${code}
              } catch (err) {
                const root = document.getElementById('root');
                root.innerHTML = \`<div style="padding: 32px; font-family: monospace;">
                  <div style="color: #ef4444; border-bottom: 2px solid #fee2e2; padding-bottom: 12px; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-size: 18px;">Runtime Exception</h3>
                  </div>
                  <pre style="background: #fef2f2; color: #b91c1c; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px;">\${err.stack || err.message}</pre>
                  <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Check the developer console for more detailed stack traces.</p>
                </div>\`;
              }
            </script>
          </body>
          </html>
        `;
      }
      return `
        <!DOCTYPE html>
        <html>
        <body style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #94a3b8; background: #f8fafc; text-align: center;">
          <div>
            <p style="font-size: 14px;">Preview not supported for <b>${language}</b></p>
            <p style="font-size: 12px; opacity: 0.7;">Try generating HTML or React code.</p>
          </div>
        </body>
        </html>
      `;
    } catch (err) {
      setError(String(err));
      return '';
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
    refresh();
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
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      {error && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white p-8">
          <div className="max-w-md w-full bg-red-50 border border-red-100 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <Terminal className="w-6 h-6" />
              <h3 className="font-bold text-lg">Compilation Failure</h3>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-red-400 overflow-x-auto">
              {error}
            </div>
            <Button onClick={refresh} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-100">
              Retry Render
            </Button>
          </div>
        </div>
      )}
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
}