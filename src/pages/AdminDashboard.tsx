import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { ControlPanel } from '@/components/admin/ControlPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ShieldCheck, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
const data = [
  { name: 'Mon', rev: 400 },
  { name: 'Tue', rev: 300 },
  { name: 'Wed', rev: 600 },
  { name: 'Thu', rev: 800 },
  { name: 'Fri', rev: 500 },
  { name: 'Sat', rev: 900 },
  { name: 'Sun', rev: 1200 },
];
export function AdminDashboard() {
  const transactions = useStore((s) => s.transactions);
  return (
    <AppLayout container contentClassName="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-500 mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Administrator</span>
          </div>
          <h1 className="text-4xl font-bold font-display tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-1">Platform orchestration and token usage metrics.</p>
        </div>
        <Alert className="max-w-md bg-cyan-500/5 border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-xs font-bold">System Note</AlertTitle>
          <AlertDescription className="text-[10px]">
            Cloudflare Agent DO limits are currently shared across development buckets.
          </AlertDescription>
        </Alert>
      </header>
      <DashboardOverview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900 border-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>Simulated weekly growth metrics.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Bar dataKey="rev" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <ControlPanel />
      </div>
      <Card className="bg-slate-900 border-white/5">
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
          <CardDescription>Blockchain verification log for crypto-tier upgrades.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-slate-400">TXID</TableHead>
                <TableHead className="text-slate-400">Plan</TableHead>
                <TableHead className="text-slate-400">Asset</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400 text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-slate-500 italic">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-mono text-xs text-cyan-400">{tx.id.slice(0, 12)}...</TableCell>
                    <TableCell className="font-medium">{tx.planName}</TableCell>
                    <TableCell className="font-bold">{tx.asset}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-500 text-xs">
                      {format(tx.timestamp, 'MMM d, HH:mm:ss')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}