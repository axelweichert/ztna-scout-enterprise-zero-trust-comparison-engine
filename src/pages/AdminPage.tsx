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
import { toast } from 'sonner';
import type { Lead, PricingOverride, Vendor } from '@shared/types';
import { format } from 'date-fns';
export function AdminPage() {
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  const updatePricing = useMutation({
    mutationFn: (data: PricingOverride) => api('/api/admin/pricing', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      toast.success("Pricing updated");
    }
  });
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter password to manage ZTNA Scout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && password === "admin123" && setIsAuthenticated(true)}
            />
            <Button className="w-full" onClick={() => password === "admin123" ? setIsAuthenticated(true) : toast.error("Invalid password")}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage leads and vendor pricing overrides.</p>
        </div>
        <Tabs defaultValue="leads" className="w-full">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Overrides</TabsTrigger>
          </TabsList>
          <TabsContent value="leads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads?.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(lead.createdAt, 'yyyy-MM-dd HH:mm')}
                        </TableCell>
                        <TableCell className="font-medium">{lead.companyName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{lead.contactName}</span>
                            <span className="text-xs text-muted-foreground">{lead.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{lead.seats}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{lead.vpnStatus}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!leads?.length && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No leads found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pricing" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overrides?.map((ov) => (
                <Card key={ov.vendorId}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold uppercase">{ov.vendorId}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Base Price (EUR/mo)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        defaultValue={ov.basePricePerMonth} 
                        onBlur={(e) => updatePricing.mutate({ ...ov, basePricePerMonth: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Quote Only</Label>
                      <Switch 
                        checked={ov.isQuoteOnly} 
                        onCheckedChange={(checked) => updatePricing.mutate({ ...ov, isQuoteOnly: checked })}
                      />
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