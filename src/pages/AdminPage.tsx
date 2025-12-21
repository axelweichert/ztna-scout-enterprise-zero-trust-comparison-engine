import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import {
  Download, Shield, Trash2, ShieldCheck, Mail, TrendingUp,
  Loader2, CheckCircle2, RefreshCw, Users, Clock,
  Settings2, Euro, Phone, ExternalLink, Copy, Search, AlertCircle, Zap
} from 'lucide-react';
import type { Lead, AdminStats, PricingOverride } from '@shared/types';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
export function AdminPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hideOptOuts, setHideOptOuts] = useState(false);
  const { data: leads, isLoading: leadsLoading, isRefetching: leadsRefetching } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => api<Lead[]>('/api/admin/leads'),
    enabled: isAuthenticated
  });
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api<AdminStats>('/api/admin/stats'),
    enabled: isAuthenticated
  });
  const { data: pricingData, isLoading: pricingLoading } = useQuery({
    queryKey: ['admin-pricing'],
    queryFn: () => api<PricingOverride[]>('/api/admin/pricing'),
    enabled: isAuthenticated
  });
  const updatePricing = useMutation({
    mutationFn: (data: PricingOverride) => api('/api/admin/pricing', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      toast.success(t('admin.pricing.updated_success'));
    }
  });
  const deleteLead = useMutation({
    mutationFn: (id: string) => api(`/api/admin/leads/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success("Lead purged from secure storage");
    }
  });
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
  };
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    const normalizedTerm = searchTerm.toLowerCase().trim();
    return leads
      .filter(l => !hideOptOuts || l.contactAllowed)
      .filter(l => {
        if (!normalizedTerm) return true;
        const name = (l.companyName || "").toLowerCase();
        const email = (l.email || "").toLowerCase();
        const contact = (l.contactName || "").toLowerCase();
        const id = (l.id || "").toLowerCase();
        return name.includes(normalizedTerm) || 
               email.includes(normalizedTerm) || 
               contact.includes(normalizedTerm) || 
               id.includes(normalizedTerm);
      });
  }, [leads, hideOptOuts, searchTerm]);
  const handleExportCSV = () => {
    if (!filteredLeads.length) {
      toast.error("No data to export");
      return;
    }
    const headers = ["ID", "Company", "Contact", "Email", "Phone", "Seats", "VPN", "Timing", "Status", "CreatedAt"];
    const rows = filteredLeads.map(l => {
      const escape = (str: any) => `"${String(str || "").replace(/"/g, '""')}"`;
      return [
        escape(l.id),
        escape(l.companyName),
        escape(l.contactName),
        escape(l.email),
        escape(l.phone),
        l.seats || 0,
        escape(l.vpnStatus),
        escape(l.timing),
        escape(l.status),
        escape(l.createdAt ? new Date(l.createdAt).toISOString() : '')
      ];
    });
    const BOM = '\uFEFF';
    const csvContent = BOM + [headers, ...rows].map(e => e.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ztna-scout-leads-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="max-w-md w-full p-8 shadow-2xl border-none rounded-3xl">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Shield className="text-white w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-display font-bold">{t('admin.terminal_title')}</CardTitle>
          <CardDescription className="text-base">{t('admin.terminal_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('admin.terminal_key')}</Label>
            <Input
              type="password"
              value={password}
              autoFocus
              className="h-14 text-center text-xl tracking-[0.5em] rounded-xl"
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && password === "admin123" && setIsAuthenticated(true)}
            />
          </div>
          <Button onClick={() => password === "admin123" ? setIsAuthenticated(true) : toast.error("Verification failed")} className="w-full h-14 btn-gradient text-lg rounded-xl">{t('admin.terminal_unlock')}</Button>
        </CardContent>
      </Card>
    </div>
  );
  return (
    <AppLayout container className="bg-slate-50/50 dark:bg-slate-950/50 min-h-screen" contentClassName="py-12">
      <div className="space-y-12 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold tracking-tight">{t('admin.dashboard_title')}</h1>
            <p className="text-muted-foreground italic flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              {t('admin.dashboard_desc')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 border-2 rounded-xl" onClick={handleRefresh} disabled={leadsRefetching}>
              <RefreshCw className={cn("mr-2 w-4 h-4", (leadsRefetching || statsLoading) && "animate-spin")} />
              {t('admin.sync_data')}
            </Button>
            <Button onClick={handleExportCSV} className="h-12 btn-gradient px-6 rounded-xl shadow-lg">
              <Download className="mr-2 w-4 h-4" /> {t('admin.export_csv')}
            </Button>
          </div>
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { label: t('admin.stats.total'), val: stats?.totalLeads, icon: Mail, color: 'text-primary', bg: 'bg-primary/5' },
            { label: t('admin.stats.verified'), val: stats?.confirmedLeads, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: t('admin.stats.conversion'), val: stats?.conversionRate !== undefined ? `${stats.conversionRate}%` : null, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: t('admin.stats.avg_seats'), val: stats?.avgSeats !== undefined ? `${stats.avgSeats}` : null, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: t('admin.stats.common_vpn'), val: stats?.mostCommonVpn && stats.mostCommonVpn !== "none" ? stats.mostCommonVpn.toUpperCase() : 'N/A', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' }
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-soft rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-2.5 rounded-xl", item.bg)}>
                    <item.icon className={cn("w-5 h-5", item.color)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold tracking-tight flex items-center h-10">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : item.val ?? '0'}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <Tabs defaultValue="pipeline" className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <TabsList className="bg-white dark:bg-slate-900 border p-1.5 rounded-2xl h-14 w-full md:w-auto shadow-sm">
              <TabsTrigger value="pipeline" className="px-8 h-full rounded-xl data-[state=active]:shadow-sm">{t('admin.tabs.pipeline')}</TabsTrigger>
              <TabsTrigger value="pricing" className="px-8 h-full rounded-xl data-[state=active]:shadow-sm">{t('admin.tabs.pricing')}</TabsTrigger>
              <TabsTrigger value="settings" className="px-8 h-full rounded-xl data-[state=active]:shadow-sm">{t('admin.tabs.settings')}</TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter results..."
                className="pl-10 h-14 bg-white dark:bg-slate-900 border-2 rounded-2xl shadow-sm focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <TabsContent value="pipeline" className="animate-in fade-in duration-500">
            <Card className="shadow-2xl border-none overflow-hidden rounded-3xl bg-white dark:bg-slate-900">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80 dark:bg-slate-800/80 border-b">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="p-5 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t('admin.table.timestamp')}</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t('admin.table.org')}</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t('admin.table.stakeholder')}</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t('admin.table.infra')}</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground text-right pr-12">{t('admin.table.verification')}</TableHead>
                      <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground pr-8">{t('admin.table.management')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadsLoading ? (
                      <TableRow><TableCell colSpan={6} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary w-10 h-10" /></TableCell></TableRow>
                    ) : filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="p-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                             <AlertCircle className="w-10 h-10 text-muted-foreground/30" />
                             <p className="text-muted-foreground font-medium">{searchTerm ? "No leads matching filter" : t('admin.table.no_leads')}</p>
                             {searchTerm && <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>Clear search</Button>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredLeads.map(lead => (
                      <TableRow key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                        <TableCell className="text-[10px] text-muted-foreground font-mono pl-5">
                          {lead.createdAt ? format(lead.createdAt, 'MMM dd') : 'N/A'}<br/>
                          <span className="opacity-50">{lead.createdAt ? format(lead.createdAt, 'HH:mm') : ''}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-base leading-none mb-1.5 flex items-center gap-2">
                              {lead.companyName}
                              {lead.status === 'confirmed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[9px] h-4 font-mono px-1.5 border-slate-200 dark:border-slate-700">ID: {(lead.id || "").slice(0, 8)}</Badge>
                              {!lead.contactAllowed && <Badge variant="destructive" className="text-[9px] h-4 py-0 uppercase">{t('admin.table.opt_out')}</Badge>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{lead.contactName}</span>
                            <div className="flex items-center gap-3 mt-1.5">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <a href={`mailto:${lead.email}`} className="text-primary hover:scale-110 transition-transform"><Mail className="w-4 h-4" /></a>
                                  </TooltipTrigger>
                                  <TooltipContent>{lead.email}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <a href={`tel:${lead.phone}`} className="text-muted-foreground hover:text-foreground"><Phone className="w-3.5 h-3.5" /></a>
                              <button onClick={() => copyToClipboard(lead.email)} className="text-muted-foreground hover:text-foreground"><Copy className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">{lead.seats || 0} Seats</span>
                              <span className="text-[10px] text-muted-foreground">• {(lead.vpnStatus || "none").toUpperCase()} VPN</span>
                            </div>
                            <Badge variant="secondary" className="text-[9px] w-fit font-bold uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {(lead.timing || "").replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-12">
                          <div className="flex flex-col items-end gap-1.5">
                            <Badge className={cn("px-2.5 py-0.5 text-[10px] uppercase font-bold border-none",
                              lead.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                              {lead.status === 'confirmed' ? 'Verified' : 'Inquiry'}
                            </Badge>
                            {lead.emailStatus === 'failed' && <Badge variant="destructive" className="text-[9px] h-4">Email Failed</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {lead.comparisonId && (
                                <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-blue-500">
                                  <Link to={`/vergleich/${lead.comparisonId}`} target="_blank"><ExternalLink className="w-4 h-4" /></Link>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { if(window.confirm(t('admin.table.purge_confirm'))) deleteLead.mutate(lead.id); }}
                                className="h-9 w-9 text-red-400 hover:text-red-600"
                                disabled={deleteLead.isPending}
                              >
                                {deleteLead.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </Button>
                           </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="pricing" className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricingLoading ? <Loader2 className="animate-spin mx-auto text-primary w-12 h-12" /> : pricingData?.map((p) => (
                <Card key={p.vendorId} className="border-none shadow-soft overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
                  <CardHeader className="bg-slate-50/80 dark:bg-slate-800/80 border-b py-4 px-6">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span className="font-bold tracking-tight">{p.vendorId.charAt(0).toUpperCase() + p.vendorId.slice(1)}</span>
                      {p.updatedAt > 0 && <span className="text-[10px] font-mono text-muted-foreground">{format(p.updatedAt, 'MMM dd')}</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('admin.pricing.market_rate')}</Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r pr-3 border-slate-200 dark:border-slate-700">
                          <Euro className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <Input
                          type="number"
                          defaultValue={p.basePricePerMonth}
                          className="pl-16 h-12 text-lg font-bold rounded-xl border-2"
                          step="0.01"
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (val !== p.basePricePerMonth) updatePricing.mutate({ ...p, basePricePerMonth: val });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-bold">{t('admin.pricing.quote_required')}</Label>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono">{t('admin.pricing.quote_desc')}</p>
                      </div>
                      <Switch
                        checked={p.isQuoteOnly}
                        onCheckedChange={(checked) => updatePricing.mutate({ ...p, isQuoteOnly: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="settings">
             <Card className="shadow-2xl border-none p-10 rounded-3xl bg-white dark:bg-slate-900">
                <div className="max-w-2xl space-y-10">
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-900 dark:bg-slate-100 rounded-lg"><Settings2 className="w-5 h-5 text-white dark:text-slate-900" /></div>
                         <h3 className="text-2xl font-bold font-display">Privacy Controls</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">Manage how sensitive lead data is processed within this administrative interface.</p>
                   </div>
                   <div className="h-px bg-slate-100 dark:bg-slate-800" />
                   <div className="flex items-center justify-between gap-8">
                      <div className="space-y-1">
                         <h4 className="font-bold text-lg">Hide Opt-Out Records</h4>
                         <p className="text-sm text-muted-foreground">Filter out leads that have formally requested no further contact from the main pipeline.</p>
                      </div>
                      <Switch checked={hideOptOuts} onCheckedChange={setHideOptOuts} />
                   </div>
                </div>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}