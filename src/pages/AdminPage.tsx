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
  Settings2, Euro, Phone, ExternalLink, Copy, Search, AlertCircle
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
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads
      .filter(l => !hideOptOuts || l.contactAllowed)
      .filter(l =>
        l.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.contactName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [leads, hideOptOuts, searchTerm]);
  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
    <AppLayout container className="bg-slate-50/50 min-h-screen" contentClassName="py-12">
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
              <RefreshCw className={cn("mr-2 w-4 h-4", leadsRefetching && "animate-spin")} />
              {t('admin.sync_data')}
            </Button>
            <Button className="h-12 btn-gradient px-6 rounded-xl shadow-lg">
              <Download className="mr-2 w-4 h-4" /> {t('admin.export_csv')}
            </Button>
          </div>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: t('admin.stats.total'), val: stats?.totalLeads, icon: Mail, color: 'text-primary', bg: 'bg-primary/5' },
            { label: t('admin.stats.verified'), val: stats?.confirmedLeads, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: t('admin.stats.conversion'), val: stats?.conversionRate !== undefined ? `${stats.conversionRate}%` : '...', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: t('admin.stats.avg_seats'), val: stats?.avgSeats !== undefined ? `${stats.avgSeats}` : '...', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' }
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-soft rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-2.5 rounded-xl", item.bg)}>
                    <item.icon className={cn("w-5 h-5", item.color)} />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground tracking-tighter uppercase">{t('admin.stats.lifetime')}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold tracking-tight">
                    {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (item.val ?? '0')}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <Tabs defaultValue="pipeline" className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <TabsList className="bg-white border p-1.5 rounded-2xl h-14 w-full md:w-auto shadow-sm">
              <TabsTrigger value="pipeline" className="px-8 h-full rounded-xl data-[state=active]:shadow-sm">{t('admin.tabs.pipeline')}</TabsTrigger>
              <TabsTrigger value="pricing" className="px-8 h-full rounded-xl data-[state=active]:shadow-sm">{t('admin.tabs.pricing')}</TabsTrigger>
              <TabsTrigger value="settings" className="px-8 h-full rounded-xl data-[state=active]:shadow-sm">{t('admin.tabs.settings')}</TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search leads..."
                className="pl-10 h-14 bg-white border-2 rounded-2xl shadow-sm focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <TabsContent value="pipeline" className="animate-in fade-in duration-500">
            <Card className="shadow-2xl border-none overflow-hidden rounded-3xl bg-white">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80 border-b">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="p-5 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t('admin.table.timestamp')}</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t('admin.table.org')}</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t('admin.table.stakeholder')}</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{t('admin.table.infra')}</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground text-center">{t('admin.table.verification')}</TableHead>
                      <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground pr-8">{t('admin.table.management')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leadsLoading ? (
                      <TableRow><TableCell colSpan={6} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary w-10 h-10" /></TableCell></TableRow>
                    ) : filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="p-20 text-center">
                          <div className="flex flex-col items-center gap-2">
                             <AlertCircle className="w-10 h-10 text-muted-foreground/30" />
                             <p className="text-muted-foreground font-medium">{t('admin.table.no_leads')}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredLeads.map(lead => (
                      <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="text-[10px] text-muted-foreground font-mono pl-5">
                          {format(lead.createdAt, 'MMM dd')}<br/>
                          <span className="opacity-50">{format(lead.createdAt, 'HH:mm:ss')}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-base leading-none mb-1.5 flex items-center gap-2">
                              {lead.companyName}
                              {lead.status === 'confirmed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[9px] h-4 font-mono px-1.5 border-slate-200">ID: {lead.id.slice(0, 8)}</Badge>
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
                              <span className="text-xs font-bold">{lead.seats} Seats</span>
                              <span className="text-[10px] text-muted-foreground">• {lead.vpnStatus.toUpperCase()} VPN</span>
                            </div>
                            <Badge variant="secondary" className="text-[9px] w-fit font-bold uppercase tracking-tighter bg-slate-100 text-slate-600">
                              {lead.timing.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <Badge className={cn("px-2.5 py-0.5 text-[10px] uppercase font-bold border-none",
                              lead.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                              {lead.status}
                            </Badge>
                            {lead.emailStatus === 'failed' && (
                              <Badge variant="destructive" className="text-[9px] h-4">Email Failed</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {lead.comparisonId && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  className="h-9 w-9 text-blue-500"
                                >
                                  <Link to={`/vergleich/${lead.comparisonId}`} target="_blank"><ExternalLink className="w-4 h-4" /></Link>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { if(window.confirm(t('admin.table.purge_confirm'))) deleteLead.mutate(lead.id); }}
                                className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
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
              {pricingLoading ? (
                <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary w-12 h-12" /></div>
              ) : pricingData?.map((p) => (
                <Card key={p.vendorId} className="border-none shadow-soft overflow-hidden rounded-2xl bg-white hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-slate-50/80 border-b py-4 px-6">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span className="font-bold tracking-tight">{p.vendorId.charAt(0).toUpperCase() + p.vendorId.slice(1)}</span>
                      {p.updatedAt > 0 && <span className="text-[10px] font-mono text-muted-foreground">{format(p.updatedAt, 'MMM dd, HH:mm')}</span>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('admin.pricing.market_rate')}</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r pr-3 border-slate-200">
                          <Euro className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <Input
                          type="number"
                          defaultValue={p.basePricePerMonth}
                          className="pl-16 h-12 text-lg font-bold rounded-xl border-2 focus:ring-primary/20"
                          step="0.01"
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (val !== p.basePricePerMonth) {
                              updatePricing.mutate({ ...p, basePricePerMonth: val });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
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
             <Card className="shadow-2xl border-none p-10 rounded-3xl bg-white">
                <div className="max-w-2xl space-y-10">
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-900 rounded-lg"><Settings2 className="w-5 h-5 text-white" /></div>
                         <h3 className="text-2xl font-bold font-display">Privacy & Visibility Controls</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">Adjust how sensitive lead data is processed and displayed within this administrative interface.</p>
                   </div>
                   <div className="h-px bg-slate-100" />
                   <div className="flex items-center justify-between gap-8">
                      <div className="space-y-1">
                         <h4 className="font-bold text-lg">Lead Pipeline Filtering</h4>
                         <p className="text-sm text-muted-foreground">Automatically hide inquiries from the main pipeline if the user has formally objected to professional follow-up (Opt-Out).</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                         <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{hideOptOuts ? "Active" : "Disabled"}</span>
                         <Switch
                           checked={hideOptOuts}
                           onCheckedChange={setHideOptOuts}
                         />
                      </div>
                   </div>
                   <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
                      <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                      <div className="space-y-1">
                         <p className="text-sm font-bold text-amber-900">GDPR Compliance Note</p>
                         <p className="text-xs text-amber-800 leading-relaxed">Opted-out leads should be processed for data deletion within 30 days unless a specific business justification exists. Use the trash icon in the pipeline to purge records permanently.</p>
                      </div>
                   </div>
                </div>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}