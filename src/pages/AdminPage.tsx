import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from 'sonner';
import { Download, Shield, Trash2, ShieldCheck, Mail, TrendingUp, History, Phone, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { Lead, PricingOverride, AdminStats } from '@shared/types';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
export function AdminPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [hideOptOuts, setHideOptOuts] = useState(false);
  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => api<Lead[]>('/api/admin/leads'),
    enabled: isAuthenticated
  });
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api<AdminStats>('/api/admin/stats'),
    enabled: isAuthenticated
  });
  const deleteLead = useMutation({
    mutationFn: (id: string) => api(`/api/admin/leads/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success("Lead purged from secure storage");
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
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="��•••••••"
            onKeyDown={e => e.key === 'Enter' && password === "admin123" && setIsAuthenticated(true)}
          />
          <Button onClick={() => password === "admin123" ? setIsAuthenticated(true) : toast.error("Invalid credentials")} className="w-full btn-gradient">Verify Authority</Button>
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
            <Button variant="outline" className="h-12 border-2">
              <Download className="mr-2 w-4 h-4" /> Reports
            </Button>
          </div>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Inquiries', val: stats?.totalLeads, icon: Mail, color: 'text-primary' },
            { label: 'Verified Leads', val: stats?.confirmedLeads, icon: ShieldCheck, color: 'text-green-600' },
            { label: 'DOI Conversion', val: `${stats?.conversionRate}%`, icon: TrendingUp, color: 'text-blue-600' },
            { label: 'Avg Scale', val: `${stats?.avgSeats} Seats`, icon: History, color: 'text-orange-600' }
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-soft group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <div className="text-3xl font-bold">{item.val ?? '...'}</div>
              </CardContent>
            </Card>
          ))}
        </section>
        <Tabs defaultValue="pipeline" className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-xl h-12">
            <TabsTrigger value="pipeline" className="px-8">Pipeline Analytics</TabsTrigger>
            <TabsTrigger value="pricing" className="px-8">Market Control</TabsTrigger>
          </TabsList>
          <TabsContent value="pipeline" className="animate-in fade-in duration-500">
            <Card className="shadow-lg border-none overflow-hidden rounded-2xl">
              <Table>
                <TableHeader className="bg-slate-50 border-b">
                  <TableRow>
                    <TableHead className="p-4 font-bold uppercase text-[10px]">Received</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Entity</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Status</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Email Status</TableHead>
                    <TableHead className="text-right font-bold uppercase text-[10px] pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadsLoading ? (
                    <TableRow><TableCell colSpan={5} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
                  ) : filteredLeads.map(lead => (
                    <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="text-[10px] text-muted-foreground font-mono pl-4">{format(lead.createdAt, 'MMM dd, HH:mm')}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{lead.companyName}</span>
                          <span className="text-xs text-muted-foreground">{lead.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lead.status === 'confirmed' ? 'default' : 'outline'} className={cn(lead.status === 'confirmed' ? "bg-green-100 text-green-700 border-none" : "text-yellow-600 border-yellow-200")}>
                          {lead.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 cursor-help">
                                {lead.emailStatus === 'sent' ? (
                                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> SENT
                                  </Badge>
                                ) : lead.emailStatus === 'failed' ? (
                                  <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 gap-1">
                                    <XCircle className="w-3 h-3" /> FAILED
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-muted-foreground">PENDING</Badge>
                                )}
                              </div>
                            </TooltipTrigger>
                            {lead.emailError && (
                              <TooltipContent className="bg-red-50 text-red-700 border-red-200 text-xs">
                                {lead.emailError}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { if(window.confirm("Purge lead?")) deleteLead.mutate(lead.id); }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}