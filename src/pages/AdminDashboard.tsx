import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { ControlPanel } from '@/components/admin/ControlPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <header>
            <h1 className="text-3xl font-bold font-display">Command Center</h1>
            <p className="text-muted-foreground">Monitor system health and orchestration.</p>
          </header>
          <DashboardOverview />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-slate-900 border-white/5">
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>Simulated weekly growth across all tiers.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
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
              <CardDescription>Real-time blockchain verification log.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-slate-400">Transaction ID</TableHead>
                    <TableHead className="text-slate-400">Plan</TableHead>
                    <TableHead className="text-slate-400">Asset</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400 text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                        No transactions recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-mono text-xs text-cyan-400">{tx.id.slice(0, 12)}...</TableCell>
                        <TableCell>{tx.planName}</TableCell>
                        <TableCell className="font-bold">{tx.asset}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-slate-500 text-xs">
                          {format(tx.timestamp, 'MMM d, HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}