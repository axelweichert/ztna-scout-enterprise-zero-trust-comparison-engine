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
import { toast } from 'sonner';
import { Download, Search, TrendingUp, Users, Shield, Target } from 'lucide-react';
import type { Lead, PricingOverride } from '@shared/types';
import { format } from 'date-fns';
export function AdminPage() {
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    const avgSeats = Math.round(leads.reduce((acc, l) => acc + l.seats, 0) / leads.length);
    const vpnCounts = leads.reduce((acc, l) => ({ ...acc, [l.vpnStatus]: (acc[l.vpnStatus] || 0) + 1 }), {} as Record<string, number>);
    const mostCommonVpn = Object.entries(vpnCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return { totalLeads: leads.length, avgSeats, mostCommonVpn };
  }, [leads]);
  const filteredOverrides = useMemo(() => {
    return overrides?.filter(o => o.vendorId.toLowerCase().includes(vendorSearch.toLowerCase()));
  }, [overrides, vendorSearch]);
  const updatePricing = useMutation({
    mutationFn: (data: PricingOverride) => api('/api/admin/pricing', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      toast.success("Enterprise pricing updated successfully");
    }
  });
  const downloadCSV = () => {
    if (!leads) return;
    const headers = "Date,Company,Contact,Email,Seats,VPN Status\n";
    const rows = leads.map(l => `${format(l.createdAt, 'yyyy-MM-dd')},"${l.companyName}","${l.contactName}",${l.email},${l.seats},${l.vpnStatus}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="w-full max-w-md shadow-2xl border-primary/10">
          <CardHeader className="text-center pt-8">
            <div className="mx-auto w-12 h-12 bg-primary rounded-xl mb-4 flex items-center justify-center shadow-lg">
              <Shield className="text-white h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-display">System Administration</CardTitle>
            <CardDescription>Authenticated Access Required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-10">
            <div className="space-y-2">
              <Label>Access Key</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && password === "admin123" && setIsAuthenticated(true)}
                className="h-12"
              />
            </div>
            <Button className="w-full h-12 btn-gradient text-lg" onClick={() => password === "admin123" ? setIsAuthenticated(true) : toast.error("Verification failed")}>Verify Identity</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <AppLayout container className="bg-slate-50/50 min-h-screen">
      <div className="space-y-12">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold">Business Intelligence</h1>
            <p className="text-muted-foreground">Monitor funnel performance and adjust market positioning.</p>
          </div>
          <Button variant="outline" onClick={downloadCSV} className="h-12 px-6">
            <Download className="mr-2 h-4 w-4" /> Export CRM Data
          </Button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-md border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Inquiries</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalLeads ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Avg. Enterprise Scale</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.avgSeats ?? 0} Seats</div>
              <p className="text-xs text-muted-foreground mt-1">Primary market: Mid-Market</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Legacy Prevalence</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">{stats?.mostCommonVpn?.replace('_', ' ') ?? 'N/A'}</div>
              <p className="text-xs text-muted-foreground mt-1">Highest replacement opportunity</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="bg-slate-200/50 p-1">
            <TabsTrigger value="leads" className="px-8 py-2">Lead Pipeline</TabsTrigger>
            <TabsTrigger value="pricing" className="px-8 py-2">Market Pricing</TabsTrigger>
          </TabsList>
          <TabsContent value="leads" className="mt-8">
            <Card className="shadow-lg border-none overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="p-6">Submission Date</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Key Stakeholder</TableHead>
                      <TableHead>Licensing</TableHead>
                      <TableHead>Legacy State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads?.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-slate-50/50">
                        <TableCell className="p-6 text-xs text-muted-foreground font-mono">
                          {format(lead.createdAt, 'yyyy-MM-dd HH:mm')}
                        </TableCell>
                        <TableCell className="font-bold text-slate-800">{lead.companyName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{lead.contactName}</span>
                            <span className="text-xs text-muted-foreground">{lead.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-100 font-bold">{lead.seats} Seats</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{lead.vpnStatus.replace('_', ' ')}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!leads?.length && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-24 text-muted-foreground">No leads in the pipeline.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pricing" className="mt-8 space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filter vendors..." 
                className="pl-10 h-12" 
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOverrides?.map((ov) => (
                <Card key={ov.vendorId} className="shadow-md border-none hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4 bg-slate-50/50 rounded-t-xl border-b">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">{ov.vendorId}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Baseline (EUR / User / Mo)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={ov.basePricePerMonth}
                        className="h-12 font-bold"
                        onBlur={(e) => updatePricing.mutate({ ...ov, basePricePerMonth: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="font-bold">Quote Only</Label>
                        <p className="text-[10px] text-muted-foreground uppercase">Hide exact pricing in UI</p>
                      </div>
                      <Switch
                        checked={ov.isQuoteOnly}
                        onCheckedChange={(checked) => updatePricing.mutate({ ...ov, isQuoteOnly: checked })}
                      />
                    </div>
                    {ov.updatedAt > 0 && (
                      <p className="text-[9px] text-muted-foreground text-right uppercase tracking-tighter">
                        Last Modified: {format(ov.updatedAt, 'PPP')}
                      </p>
                    )}
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