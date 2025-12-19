import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from 'sonner';
import { Download, Shield, Trash2, ShieldCheck, Mail, BarChart3, TrendingUp, History, Phone, AlertCircle } from 'lucide-react';
import type { Lead, PricingOverride, AdminStats } from '@shared/types';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from "@/lib/utils";
export function AdminPage() {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [hideOptOuts, setHideOptOuts] = useState(false);
  const { data: leads } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => api<Lead[]>('/api/admin/leads'),
    enabled: isAuthenticated
  });
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api<AdminStats>('/api/admin/stats'),
    enabled: isAuthenticated
  });
  const { data: overrides } = useQuery({
    queryKey: ['admin-pricing'],
    queryFn: () => api<PricingOverride[]>('/api/admin/pricing'),
    enabled: isAuthenticated
  });
  const deleteLead = useMutation({
    mutationFn: (id: string) => api(`/api/admin/leads/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success("Lead purged from secure storage");
    }
  });
  const updatePricing = useMutation({
    mutationFn: (data: PricingOverride) => api('/api/admin/pricing', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      toast.success("Market positioning updated");
    }
  });
  const filteredLeads = leads?.filter(l => !hideOptOuts || l.contactAllowed) || [];
  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="max-w-md w-full p-8 shadow-2xl border-none">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-display">Sentinel Access</CardTitle>
          <CardDescription>Enterprise Admin Portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && password === "admin123" && setIsAuthenticated(true)} className="h-12" />
          <Button onClick={() => password === "admin123" ? setIsAuthenticated(true) : toast.error("Invalid credentials")} className="w-full btn-gradient h-12">Verify Authority</Button>
        </CardContent>
      </Card>
    </div>
  );
  return (
    <AppLayout container className="bg-slate-50/50 min-h-screen" contentClassName="py-12">
      <div className="space-y-12 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold tracking-tight">Executive Dashboard</h1>
            <p className="text-muted-foreground italic">Lead lifecycle and market positioning analytics</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-dashed mr-4">
              <Switch checked={hideOptOuts} onCheckedChange={setHideOptOuts} />
              <Label className="text-xs font-bold whitespace-nowrap">Filter Opt-Outs</Label>
            </div>
            <Button variant="outline" className="h-12 border-2"><Download className="mr-2 w-4 h-4" /> Reports</Button>
          </div>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Inquiries', val: stats?.totalLeads, icon: Mail, color: 'text-primary' },
            { label: 'Verified Leads', val: stats?.confirmedLeads, icon: ShieldCheck, color: 'text-green-600' },
            { label: 'DOI Conversion', val: `${stats?.conversionRate}%`, icon: TrendingUp, color: 'text-blue-600' },
            { label: 'Avg Scale', val: `${stats?.avgSeats} Seats`, icon: History, color: 'text-orange-600' }
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-soft overflow-hidden group">
              <div className={cn("h-1 bg-current", item.color)} />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                  <item.icon className={cn("w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity", item.color)} />
                </div>
                <div className="text-3xl font-bold">{item.val ?? '...'}</div>
              </CardContent>
            </Card>
          ))}
        </section>
        <Tabs defaultValue="pipeline" className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-xl shadow-sm h-12">
            <TabsTrigger value="pipeline" className="px-8 rounded-lg">Pipeline Analytics</TabsTrigger>
            <TabsTrigger value="pricing" className="px-8 rounded-lg">Market Control</TabsTrigger>
          </TabsList>
          <TabsContent value="pipeline" className="space-y-8 animate-in fade-in-50 duration-500">
            <Card className="shadow-lg border-none overflow-hidden rounded-2xl">
              <Table>
                <TableHeader className="bg-slate-50 border-b">
                  <TableRow>
                    <TableHead className="p-4 font-bold uppercase text-[10px] tracking-widest">Received</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Entity & Liaison</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Contact Info</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map(lead => (
                    <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="text-[10px] text-muted-foreground font-mono pl-4">{format(lead.createdAt, 'MMM dd, HH:mm')}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{lead.companyName}</span>
                          <span className="text-xs text-muted-foreground">{lead.contactName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                          <span className="text-xs font-medium flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={lead.status === 'confirmed' ? 'default' : 'outline'} className={cn(lead.status === 'confirmed' ? "bg-green-100 text-green-700 hover:bg-green-200 border-none" : "text-yellow-600 border-yellow-200")}>
                            {lead.status.toUpperCase()}
                          </Badge>
                          {!lead.contactAllowed && (
                            <Badge variant="destructive" className="bg-red-100 text-red-600 border-none flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> OPT-OUT
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Popover>
                            <PopoverTrigger asChild><Button variant="ghost" size="icon"><ShieldCheck className="w-4 h-4 text-muted-foreground" /></Button></PopoverTrigger>
                            <PopoverContent className="w-80 p-6 space-y-4 rounded-2xl shadow-2xl">
                              <h4 className="font-display font-bold text-lg border-b pb-2">GDPR Consent Snapshot</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Disclaimer Accepted:</span>
                                  <Badge variant="default" className="text-[10px]">YES (v2)</Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Contact Status:</span>
                                  <Badge variant={lead.contactAllowed ? 'default' : 'destructive'} className="text-[10px]">
                                    {lead.contactAllowed ? 'ALLOWED' : 'REVOKED'}
                                  </Badge>
                                </div>
                                {!lead.contactAllowed && lead.optedOutAt && (
                                  <div className="text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded">
                                    Revoked on: {format(lead.optedOutAt, 'PPP HH:mm')}
                                  </div>
                                )}
                              </div>
                              <div className="pt-4 border-t text-[10px] text-muted-foreground font-mono bg-slate-50 p-3 rounded-lg">
                                IP Hash: {lead.consentRecord?.ipHash}<br />
                                User-Agent: {lead.consentRecord?.userAgent.slice(0, 40)}...
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Button variant="ghost" size="icon" onClick={() => deleteLead.mutate(lead.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="pricing" className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {overrides?.map(ov => (
                <Card key={ov.vendorId} className="shadow-soft hover:shadow-lg transition-all border-none group overflow-hidden">
                  <CardHeader className="pb-4 bg-slate-50/50 border-b flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest">{ov.vendorId}</CardTitle>
                    {ov.updatedAt > 0 && <Badge variant="secondary" className="text-[9px]">Modified</Badge>}
                  </CardHeader>
                  <CardContent className="pt-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Admin Price Override (EUR/MO)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                        <Input type="number" step="0.01" defaultValue={ov.basePricePerMonth} onBlur={(e) => updatePricing.mutate({ ...ov, basePricePerMonth: parseFloat(e.target.value) })} className="pl-8 h-12 font-bold text-lg" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-bold">Quotation Logic</Label>
                        <p className="text-[10px] text-muted-foreground">Force "Price on Request" display</p>
                      </div>
                      <Switch checked={ov.isQuoteOnly} onCheckedChange={(c) => updatePricing.mutate({ ...ov, isQuoteOnly: c })} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}