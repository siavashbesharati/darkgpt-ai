import React, { useEffect, useRef, useState } from 'react';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface PreviewSandboxProps {
  code: string;
  language: string;
}
export function PreviewSandbox({ code, language }: PreviewSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generateSrcDoc = () => {
    try {
      if (language === 'html' || language === 'xml') {
        if (code.includes('<html') || code.includes('<body')) {
          return code;
        }
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: sans-serif; margin: 0; padding: 20px; background: white; color: #0f172a; }
            </style>
          </head>
          <body>${code}</body>
          </html>
        `;
      }
      if (language === 'javascript' || language === 'typescript') {
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="p-8">
            <div id="root"></div>
            <script type="module">
              try {
                ${code}
              } catch (err) {
                document.body.innerHTML = \`<div style="color: red; padding: 20px; border: 1px solid red; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Runtime Error</h3>
                  <pre>\${err.message}</pre>
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
        <body style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #64748b;">
          <p>Preview not available for ${language}</p>
        </body>
        </html>
      `;
    } catch (err) {
      setError(String(err));
      return '';
    }
  };
  const refresh = () => {
    setIsLoading(true);
    setError(null);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = generateSrcDoc();
    }
  };
  useEffect(() => {
    refresh();
  }, [code, language]);
  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-8 w-8 bg-white/80 backdrop-blur border border-slate-200 shadow-sm hover:bg-white"
          onClick={refresh}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white p-6 text-center">
          <div className="max-w-xs space-y-3">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-slate-900 font-bold">Render Error</h3>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="preview-sandbox"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals allow-forms"
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-[1px]">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      )}
    </div>
  );
}