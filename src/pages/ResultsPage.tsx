import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api-client';
import type { ComparisonSnapshot, ComparisonResult } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Printer, ArrowLeft, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
export function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedVendor, setSelectedVendor] = useState<ComparisonResult | null>(null);
  const { data: snapshot, isLoading, error } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => api<ComparisonSnapshot>(`/api/comparison/${id}`),
    retry: 1
  });
  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
  if (error || !snapshot) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Report Not Found</h2>
      <Button asChild><Link to="/">Go Back</Link></Button>
    </div>
  );
  const sortedResults = [...snapshot.results].sort((a, b) => b.scores.totalScore - a.scores.totalScore);
  const chartData = sortedResults.map(r => ({
    name: r.vendorName,
    tco: r.tcoYear1,
    id: r.vendorId
  }));
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight">{t('results.title')}</h1>
            <p className="text-lg text-muted-foreground">{t('results.subtitle', { seats: snapshot.inputs.seats })}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> {t('form.buttons.back')}</Link>
            </Button>
            <Button variant="default" className="bg-[#F48120] hover:bg-[#E55A1B] text-white" onClick={() => navigate(`/vergleich/${id}/print`)}>
              <Printer className="mr-2 h-4 w-4" /> {t('results.export_pdf')}
            </Button>
          </div>
        </div>
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{t('results.tco_title')}</h2>
            <Badge variant="outline">Enterprise Baseline</Badge>
          </div>
          <Card className="p-8 shadow-lg border-primary/5">
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 60, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.3)' }} formatter={(v: number) => [`€${v.toLocaleString()}`, 'TCO']} />
                  <Bar dataKey="tco" radius={[0, 6, 6, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.id === 'cloudflare' ? '#F48120' : '#1E293B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedResults.map((result) => (
            <Card 
              key={result.vendorId} 
              className={`cursor-pointer transition-all hover:scale-[1.02] ${result.vendorId === 'cloudflare' ? 'ring-2 ring-[#F48120] shadow-xl' : 'shadow-md'}`}
              onClick={() => setSelectedVendor(result)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{result.vendorName}</CardTitle>
                    <CardDescription>Enterprise Platform</CardDescription>
                  </div>
                  <Badge className={result.scores.totalScore > 80 ? "bg-green-600" : ""}>
                    {t('results.score')}: {result.scores.totalScore}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold tracking-tight">€{result.tcoYear1.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Year 1 TCO Estimate</span>
                </div>
                <div className="pt-4 border-t space-y-4">
                  {result.features.isBSIQualified && (
                    <div className="flex items-center text-green-600 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 mr-1.5" /> {t('results.bsi_qualified')}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {result.features.hasZTNA && <Badge variant="secondary" className="text-[10px]">ZTNA</Badge>}
                    {result.features.hasSWG && <Badge variant="secondary" className="text-[10px]">SWG</Badge>}
                    {result.features.hasCASB && <Badge variant="secondary" className="text-[10px]">CASB</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 flex gap-6">
          <Info className="h-6 w-6 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed italic">{t('results.disclaimer')}</p>
        </div>
      </div>
      <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedVendor?.vendorName} Overview</DialogTitle>
            <DialogDescription>Performance breakdown and feature compliance.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Price Score</p>
                <p className="text-xl font-bold">{selectedVendor?.scores.priceScore}/100</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Feature Score</p>
                <p className="text-xl font-bold">{selectedVendor?.scores.featureScore}/100</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold">Included Capabilities</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedVendor?.features || {}).map(([key, val]) => (
                  key.startsWith('has') && <div key={key} className="flex justify-between p-2 bg-muted rounded">
                    <span className="capitalize">{key.replace('has', '')}</span>
                    <span className={val ? "text-green-600" : "text-red-600"}>{val ? '✓' : '×'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}