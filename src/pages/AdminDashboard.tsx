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
import { useTheme } from '@/hooks/use-theme';
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
  const { isDark } = useTheme();
  const themePrimary = isDark ? "#ffffff" : "#0f172a";
  const themeGrid = isDark ? "#1e293b" : "#e2e8f0";
  return (
    <AppLayout container contentClassName="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Administrator</span>
          </div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-1">Platform orchestration and token usage metrics.</p>
        </div>
        <Alert className="max-w-md bg-primary/5 border-primary/20 text-primary">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-xs font-bold uppercase tracking-widest">System Note</AlertTitle>
          <AlertDescription className="text-[10px] font-medium">
            Cloudflare Agent DO limits are currently shared across development buckets.
          </AlertDescription>
        </Alert>
      </header>
      <DashboardOverview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Forecast</CardTitle>
            <CardDescription className="text-muted-foreground">Simulated weekly growth metrics.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={themeGrid} vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip
                  cursor={{fill: isDark ? '#ffffff10' : '#00000005'}}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    border: `1px solid ${themeGrid}`, 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: themePrimary, fontWeight: 'bold' }}
                />
                <Bar dataKey="rev" fill={themePrimary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <ControlPanel />
      </div>
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Transaction Ledger</CardTitle>
          <CardDescription className="text-muted-foreground">Blockchain verification log for crypto-tier upgrades.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">TXID</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Plan</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Asset</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-muted-foreground italic text-sm">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-primary font-bold">{tx.id.slice(0, 12)}...</TableCell>
                      <TableCell className="font-medium text-foreground">{tx.planName}</TableCell>
                      <TableCell className="font-bold text-foreground">{tx.asset}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 font-bold uppercase text-[10px]">
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs font-medium">
                        {format(tx.timestamp, 'MMM d, HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}