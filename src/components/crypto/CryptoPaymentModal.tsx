import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Loader2, Wallet, ArrowLeft } from 'lucide-react';
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
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const addTransaction = useStore((s) => s.addTransaction);
  const upgradeTier = useStore((s) => s.upgradeTier);
  const assets = [
    { name: 'Bitcoin', symbol: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0w7h', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { name: 'Ethereum', symbol: 'ETH', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { name: 'Solana', symbol: 'SOL', address: '7xKXv2bdRQF9H382n4zP3gR3GjA7fG5CgX6uX5S5F4', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  ];
  useEffect(() => {
    if (step === 'confirming') {
      const timer = setTimeout(() => {
        const txId = uuidv4();
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
        toast.success("Payment Confirmed! Your account has been upgraded.");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, planName, selectedAsset, addTransaction, upgradeTier]);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Address copied to clipboard");
  };
  const reset = () => {
    setStep('select');
    setSelectedAsset(null);
  };
  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) setTimeout(reset, 500); }}>
      <DialogContent className="sm:max-w-[440px] bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== 'select' && step !== 'success' && (
              <Button variant="ghost" size="icon" onClick={() => setStep('select')} className="h-6 w-6 mr-1">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {step === 'success' ? 'Upgrade Successful' : `Checkout: ${planName}`}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {step === 'select' && "Select your preferred cryptocurrency"}
            {step === 'pay' && `Send payment to the ${selectedAsset} address below`}
            {step === 'confirming' && "Verifying your transaction on the blockchain..."}
            {step === 'success' && "Your account features are now active!"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          {step === 'select' && (
            <div className="grid grid-cols-1 gap-3">
              {assets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => { setSelectedAsset(asset.symbol); setStep('pay'); }}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <img src={asset.icon} className="w-8 h-8 rounded-full" alt={asset.name} />
                    <div className="text-left">
                      <p className="font-bold">{asset.name}</p>
                      <p className="text-xs text-slate-500">{asset.symbol}</p>
                    </div>
                  </div>
                  <Wallet className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
            </div>
          )}
          {step === 'pay' && selectedAsset && (
            <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                <QRCodeSVG
                  value={assets.find(a => a.symbol === selectedAsset)?.address || ""}
                  size={180}
                  level="H"
                />
              </div>
              <div className="w-full space-y-2">
                <label className="text-xs text-slate-500 font-medium ml-1 uppercase tracking-wider">Wallet Address</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono text-cyan-400 truncate">
                    {assets.find(a => a.symbol === selectedAsset)?.address}
                  </div>
                  <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-white/10" onClick={() => handleCopy(assets.find(a => a.symbol === selectedAsset)?.address || "")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => setStep('confirming')}
                className="w-full h-12 bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold rounded-xl"
              >
                I have sent the payment
              </Button>
            </div>
          )}
          {step === 'confirming' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in fade-in duration-300">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
                <Loader2 className="w-16 h-16 text-cyan-500 animate-spin relative z-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold">Scanning Blockchain</h4>
                <p className="text-sm text-slate-400 mt-2">Waiting for network confirmation (1/3)...</p>
              </div>
            </div>
          )}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in scale-in duration-500">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold">Success!</h4>
                <p className="text-slate-400">Welcome to the {planName} tier of AetherCode.</p>
              </div>
              <Button onClick={() => onOpenChange(false)} className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl">
                Start Building
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}