import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { ControlPanel } from '@/components/admin/ControlPanel';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { ConfigPanel } from '@/components/admin/ConfigPanel';
import { PackagesManagement } from '@/components/admin/PackagesManagement';
import { PromptsManagement } from '@/components/admin/PromptsManagement';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ShieldCheck, Info, Users, LayoutDashboard, Settings2, BarChart3, TrendingUp, Package, Library } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTheme } from '@/hooks/use-theme';
const chartData = [
  { name: 'Mon', rev: 400 },
  { name: 'Tue', rev: 300 },
  { name: 'Wed', rev: 600 },
  { name: 'Thu', rev: 800 },
  { name: 'Fri', rev: 500 },
  { name: 'Sat', rev: 900 },
  { name: 'Sun', rev: 1200 },
];
export function AdminDashboard() {
  const transactions = useStore(useShallow(s => s.transactions));
  const { isDark } = useTheme();
  const themePrimary = isDark ? "#ffffff" : "#0f172a";
  const themeGrid = isDark ? "#1e293b" : "#e2e8f0";
  return (
    <AppLayout container contentClassName="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Platform Authority</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-2 max-w-lg font-medium">Orchestrate aether engines, monitor blockchain jettons, and manage global user quotas.</p>
        </div>
        <Alert className="max-w-md bg-primary/5 border-primary/20 text-primary rounded-2xl shadow-sm">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-[10px] font-black uppercase tracking-widest mb-1">Compute Environment</AlertTitle>
          <AlertDescription className="text-xs font-medium leading-relaxed opacity-80">
            Durable Objects are currently isolated per worker binding. Local overrides affect current instance only.
          </AlertDescription>
        </Alert>
      </header>
      <Tabs defaultValue="overview" className="space-y-10">
        <TabsList className="bg-muted p-1 border border-border inline-flex h-12 items-center justify-center rounded-2xl shadow-sm overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-xl px-8 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg text-sm font-bold">
            <BarChart3 className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl px-8 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg text-sm font-bold">
            <Users className="w-4 h-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="packages" className="rounded-xl px-8 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg text-sm font-bold">
            <Package className="w-4 h-4" /> Packages
          </TabsTrigger>
          <TabsTrigger value="prompts" className="rounded-xl px-8 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg text-sm font-bold">
            <Library className="w-4 h-4" /> Prompts
          </TabsTrigger>
          <TabsTrigger value="config" className="rounded-xl px-8 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg text-sm font-bold">
            <Settings2 className="w-4 h-4" /> API Configuration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-10 animate-in fade-in duration-500">
          <DashboardOverview />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-card border-border shadow-soft rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border py-6 px-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-primary" />
                      Revenue Projections
                    </CardTitle>
                    <CardDescription className="font-medium">Real-time Jetton verification flow metrics.</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                    <TrendingUp className="w-3 h-3 mr-1" /> +24.8%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] pt-10 px-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={themeGrid} vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 600}} dy={10} />
                    <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 600}} dx={-10} />
                    <Tooltip
                      cursor={{fill: isDark ? '#ffffff05' : '#00000003'}}
                      contentStyle={{
                        backgroundColor: isDark ? '#020617' : '#ffffff',
                        border: `1px solid ${themeGrid}`,
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                      itemStyle={{ color: themePrimary, fontWeight: '800', fontSize: '14px' }}
                    />
                    <Bar dataKey="rev" fill={themePrimary} radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <ControlPanel />
          </div>
          <Card className="bg-card border-border shadow-soft rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border py-6 px-8">
              <CardTitle className="text-xl font-black tracking-tight">On-Chain Transaction Logs</CardTitle>
              <CardDescription className="font-medium">Verified TON Jetton interactions with platform memos.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="pl-8 py-5 text-muted-foreground font-black uppercase text-[10px] tracking-widest">Transaction ID</TableHead>
                      <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Plan</TableHead>
                      <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Asset Pair</TableHead>
                      <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">Invoice Memo</TableHead>
                      <TableHead className="text-muted-foreground font-black uppercase text-[10px] tracking-widest text-right pr-8">Verification Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-24 text-muted-foreground italic font-medium">
                          No blockchain interactions recorded in this environment yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx.id} className="border-border hover:bg-muted/20 transition-colors">
                          <TableCell className="pl-8 py-5 font-mono text-xs text-primary font-bold">{tx.id}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-bold uppercase text-[10px] tracking-wider px-2 py-0.5">
                              {tx.planName}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-black text-xs text-foreground">{tx.asset} / USD</TableCell>
                          <TableCell className="font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                             {tx.memo}
                          </TableCell>
                          <TableCell className="text-right pr-8 text-muted-foreground text-xs font-bold">
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
        </TabsContent>
        <TabsContent value="users" className="animate-in slide-in-from-bottom-6 duration-500">
          <UsersManagement />
        </TabsContent>
        <TabsContent value="packages" className="animate-in slide-in-from-bottom-6 duration-500">
          <PackagesManagement />
        </TabsContent>
        <TabsContent value="prompts" className="animate-in slide-in-from-bottom-6 duration-500">
          <PromptsManagement />
        </TabsContent>
        <TabsContent value="config" className="animate-in slide-in-from-bottom-6 duration-500">
          <ConfigPanel />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}