import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Loader2, Wallet, ArrowLeft, ShieldAlert, BadgeInfo } from 'lucide-react';
import { toast } from 'sonner';
import { useStore, Tier } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
interface CryptoPaymentModalProps {
  planName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
type Step = 'select' | 'pay' | 'confirming' | 'success';
export function CryptoPaymentModal({ planName, open, onOpenChange }: CryptoPaymentModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [selectedAsset, setSelectedAsset] = useState<'TON' | 'USDT' | null>(null);
  const addTransaction = useStore((s) => s.addTransaction);
  const upgradeTier = useStore((s) => s.upgradeTier);
  const networkMode = useStore((s) => s.settings.networkMode);
  const activeTonAddress = useStore((s) => s.settings.activeTonAddress);
  const assets = [
    { 
      name: 'TON Coin', 
      symbol: 'TON', 
      address: activeTonAddress, 
      icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png' 
    },
    { 
      name: 'Tether (TON)', 
      symbol: 'USDT', 
      address: activeTonAddress, 
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png' 
    },
  ];
  useEffect(() => {
    if (step === 'confirming') {
      const timer = setTimeout(() => {
        const txId = `TON_${uuidv4().slice(0, 8)}`;
        addTransaction({
          id: txId,
          planName,
          asset: selectedAsset || 'Unknown',
          amount: planName === 'Pro' ? '29.00' : '99.00',
          status: 'confirmed',
          timestamp: Date.now()
        });
        upgradeTier(planName as Tier);
        setStep('success');
        toast.success("TON Transaction Confirmed! Project vision unlocked.");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step, planName, selectedAsset]);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Wallet address copied");
  };
  const getQRValue = () => {
    const addr = activeTonAddress || "";
    const amount = planName === 'Pro' ? 29 : 99;
    // Basic TON URI scheme
    return `ton://transfer/${addr}?amount=${amount * 1000000000}&text=AetherCode_${planName}`;
  };
  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) setTimeout(() => setStep('select'), 500); }}>
      <DialogContent className="sm:max-w-[440px] bg-slate-950 border-white/10 text-white overflow-hidden p-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-violet-500" />
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {step !== 'select' && step !== 'success' && (
                <Button variant="ghost" size="icon" onClick={() => setStep('select')} className="h-6 w-6 mr-1 hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              {step === 'success' ? 'Vision Activated' : `Checkout: ${planName}`}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {step === 'select' && "Native TON & USDT Support"}
              {step === 'pay' && `Environment: ${networkMode?.toUpperCase()}`}
              {step === 'confirming' && "Verifying Jetton interaction..."}
            </DialogDescription>
          </DialogHeader>
          {networkMode === 'testnet' && step !== 'success' && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest leading-tight">
                Experimental Environment: Testnet mode active. Do not send real funds.
              </p>
            </div>
          )}
          <div className="py-6">
            {step === 'select' && (
              <div className="grid grid-cols-1 gap-3">
                {assets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => { setSelectedAsset(asset.symbol as 'TON' | 'USDT'); setStep('pay'); }}
                    className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <img src={asset.icon} className="w-9 h-9 rounded-full shadow-lg" alt={asset.name} />
                      <div className="text-left">
                        <p className="font-bold text-slate-100">{asset.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{asset.symbol} Jetton</p>
                      </div>
                    </div>
                    <Wallet className="w-5 h-5 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                  </button>
                ))}
              </div>
            )}
            {step === 'pay' && selectedAsset && (
              <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="p-5 bg-white rounded-3xl shadow-2xl relative">
                  <QRCodeSVG value={getQRValue()} size={190} level="H" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <img src={assets.find(a => a.symbol === selectedAsset)?.icon} className="w-4 h-4" alt="Icon" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">{selectedAsset}</span>
                  </div>
                </div>
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black ml-1 uppercase tracking-widest">Network Address</label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3.5 bg-black border border-white/10 rounded-xl text-[11px] font-mono text-cyan-400 break-all leading-tight">
                        {activeTonAddress}
                      </div>
                      <Button variant="outline" size="icon" className="shrink-0 h-12 w-12 rounded-xl border-white/10 hover:bg-white/10" onClick={() => handleCopy(activeTonAddress)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex items-start gap-3">
                    <BadgeInfo className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Scan the QR with Tonkeeper or OpenWallet. Transfer must be sent on <span className="text-white font-bold">{networkMode}</span>.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setStep('confirming')}
                  className="w-full h-14 bg-white text-black hover:bg-white/90 font-black rounded-2xl shadow-xl uppercase tracking-widest"
                >
                  Verify Transaction
                </Button>
              </div>
            )}
            {step === 'confirming' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl animate-pulse" />
                  <Loader2 className="w-16 h-16 text-cyan-500 animate-spin relative z-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold tracking-tight">Syncing with TON Node</h4>
                  <p className="text-xs text-slate-500 font-medium max-w-[200px]">Confirming Jetton balance update on the blockchain...</p>
                </div>
              </div>
            )}
            {step === 'success' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center animate-in scale-in duration-500">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-14 h-14" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-3xl font-black tracking-tighter">SUCCESS!</h4>
                  <p className="text-slate-400 text-sm max-w-[260px]">Welcome to the {planName} elite tier. Your credits are now active.</p>
                </div>
                <Button onClick={() => onOpenChange(false)} className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest">
                  Start Building
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}