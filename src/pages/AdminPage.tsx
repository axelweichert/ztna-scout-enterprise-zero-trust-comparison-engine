import React, { useState, useMemo } from 'react';
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
import { Download, Search, TrendingUp, Users, Shield, Target, Trash2, ShieldCheck, Mail } from 'lucide-react';
import type { Lead, PricingOverride } from '@shared/types';
import { format } from 'date-fns';
export function AdminPage() {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const { data: leads } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => api<Lead[]>('/api/admin/leads'),
    enabled: isAuthenticated
  });
  const { data: overrides } = useQuery({
    queryKey: ['admin-pricing'],
    queryFn: () => api<PricingOverride[]>('/api/admin/pricing'),
    enabled: isAuthenticated
  });
  const stats = useMemo(() => {
    if (!leads?.length) return null;
    const confirmed = leads.filter(l => l.status === 'confirmed').length;
    return {
      total: leads.length,
      confirmed,
      rate: Math.round((confirmed / leads.length) * 100),
      avgSeats: Math.round(leads.reduce((acc, l) => acc + l.seats, 0) / leads.length)
    };
  }, [leads]);
  const deleteLead = useMutation({
    mutationFn: (id: string) => api(`/api/admin/leads/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success("Lead permanently removed (GDPR deletion completed)");
    }
  });
  const updatePricing = useMutation({
    mutationFn: (data: PricingOverride) => api('/api/admin/pricing', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      toast.success("Pricing updated");
    }
  });
  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="max-w-md w-full p-8 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" />
          </div>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Enter security key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && password === "admin123" && setIsAuthenticated(true)} />
          <Button onClick={() => password === "admin123" ? setIsAuthenticated(true) : toast.error("Invalid key")} className="w-full btn-gradient">Verify</Button>
        </CardContent>
      </Card>
    </div>
  );
  return (
    <AppLayout container className="bg-slate-50/50 min-h-screen">
      <div className="space-y-8">
        <header className="flex justify-between items-end">
          <h1 className="text-4xl font-display font-bold tracking-tight">Lead Lifecycle Management</h1>
          <Button variant="outline" className="h-12"><Download className="mr-2 w-4 h-4" /> Export CSV</Button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground">Total Inquiries</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{stats?.total}</div></CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground">Verified Leads</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-green-600">{stats?.confirmed}</div></CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground">DOI Conv. Rate</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{stats?.rate}%</div></CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground">Avg. Seats</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{stats?.avgSeats}</div></CardContent>
          </Card>
        </div>
        <Tabs defaultValue="leads">
          <TabsList className="bg-slate-200/50 p-1">
            <TabsTrigger value="leads" className="px-8">Pipeline</TabsTrigger>
            <TabsTrigger value="pricing" className="px-8">Market Positioning</TabsTrigger>
          </TabsList>
          <TabsContent value="leads" className="mt-8">
            <Card className="shadow-lg border-none overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="p-4">Submission</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>GDPR Consents</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads?.map(lead => (
                    <TableRow key={lead.id}>
                      <TableCell className="text-xs text-muted-foreground font-mono">{format(lead.createdAt, 'yyyy-MM-dd HH:mm')}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold">{lead.companyName}</span>
                          <span className="text-xs text-muted-foreground">{lead.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={lead.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {lead.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild><Button variant="ghost" size="sm"><ShieldCheck className="w-4 h-4 mr-2" /> View</Button></PopoverTrigger>
                          <PopoverContent className="w-64 space-y-2 p-4">
                            <h4 className="font-bold border-b pb-2 mb-2">Consent Details</h4>
                            <div className="text-xs flex justify-between"><span>Processing:</span><Badge variant="outline">{lead.consentRecord?.processingAccepted ? 'YES' : 'NO'}</Badge></div>
                            <div className="text-xs flex justify-between"><span>Follow-up:</span><Badge variant="outline">{lead.consentRecord?.followUpAccepted ? 'YES' : 'NO'}</Badge></div>
                            <div className="text-xs flex justify-between"><span>Marketing:</span><Badge variant="outline">{lead.consentRecord?.marketingAccepted ? 'YES' : 'NO'}</Badge></div>
                            <div className="mt-4 pt-2 border-t text-[10px] text-muted-foreground">IP Hash: {lead.consentRecord?.ipHash}</div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteLead.mutate(lead.id)} className="text-red-500 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="pricing" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {overrides?.map(ov => (
                <Card key={ov.vendorId} className="shadow-md">
                  <CardHeader className="pb-4 border-b bg-slate-50/50"><CardTitle className="text-sm font-bold">{ov.vendorId}</CardTitle></CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Baseline EUR/Mo</Label>
                      <Input type="number" step="0.01" defaultValue={ov.basePricePerMonth} onBlur={(e) => updatePricing.mutate({ ...ov, basePricePerMonth: parseFloat(e.target.value) })} />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <Label className="text-xs font-bold">Quote Only</Label>
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