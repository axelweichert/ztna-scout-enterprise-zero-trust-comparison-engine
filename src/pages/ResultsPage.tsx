import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api-client';
import type { ComparisonSnapshot, ComparisonResult } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Printer, ArrowLeft, Info, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
export function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedVendor, setSelectedVendor] = useState<ComparisonResult | null>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { data: snapshot, isLoading, error } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => api<ComparisonSnapshot>(`/api/comparison/${id}`),
    retry: 1
  });
  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-12 flex-1 w-full">
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
      <Footer />
    </div>
  );
  if (error || !snapshot) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-40 text-center flex-1 w-full">
        <h2 className="text-3xl font-bold mb-6">Report Not Found</h2>
        <Button asChild size="lg" className="btn-gradient px-12"><Link to="/">Go Back</Link></Button>
      </div>
      <Footer />
    </div>
  );
  const sortedResults = [...snapshot.results].sort((a, b) => b.scores.totalScore - a.scores.totalScore);
  const top3 = sortedResults.slice(0, 3);
  const chartData = sortedResults.map(r => ({
    name: r.vendorName,
    tco: r.tcoYear1,
    id: r.vendorId
  }));
  const featureKeys = ['hasZTNA', 'hasSWG', 'hasCASB', 'hasDLP', 'hasFWaaS', 'hasRBI'];
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className={cn(
        "fixed top-16 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b transition-transform duration-300",
        scrolled ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Top:</span>
            <Badge className="bg-primary text-[10px]">{sortedResults[0].vendorName}</Badge>
          </div>
          <Button size="sm" className="btn-gradient h-8" onClick={() => navigate(`/vergleich/${id}/print`)}>
            <Printer className="mr-2 h-3.5 w-3.5" /> Export Report
          </Button>
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20">
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-primary/10 pb-12 mb-20">
          <div className="space-y-4">
            <h1 className="text-display tracking-tight leading-none">{t('results.title')}</h1>
            <p className="text-xl text-muted-foreground">{t('results.subtitle', { seats: snapshot.inputs.seats })}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild className="hidden sm:flex h-14 px-8">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> {t('form.buttons.back')}</Link>
            </Button>
            <Button size="lg" className="h-14 px-10 btn-gradient" onClick={() => navigate(`/vergleich/${id}/print`)}>
              <Printer className="mr-2 h-5 w-5" /> {t('results.export_pdf')}
            </Button>
          </div>
        </header>
        <section className="space-y-8 mb-20">
          <h2 className="text-3xl font-display font-bold">{t('results.tco_title')}</h2>
          <Card className="p-6 md:p-10 shadow-2xl border-primary/5 bg-slate-50/30">
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fontWeight: 700, fill: 'hsl(var(--foreground))' }} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--primary)/0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 shadow-xl border rounded-lg">
                            <p className="font-bold mb-1">{payload[0].payload.name}</p>
                            <p className="text-primary font-bold text-lg">€{payload[0].value?.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-2">12-Month Est. TCO</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="tco" radius={[0, 8, 8, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.id === 'cloudflare' ? '#F48120' : '#1E293B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
        <section className="space-y-8 mb-20">
          <h2 className="text-3xl font-display font-bold">Feature Matrix (Top 3)</h2>
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-6 text-left text-sm font-bold uppercase tracking-wider text-muted-foreground">Capabilities</th>
                  {top3.map(v => (
                    <th key={v.vendorId} className="p-6 text-center">
                      <p className="font-bold text-lg">{v.vendorName}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureKeys.map(key => (
                  <tr key={key} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-semibold capitalize text-foreground/80">{key.replace('has', '')}</td>
                    {top3.map(v => (
                      <td key={v.vendorId} className="p-6 text-center">
                        {(v.features as any)[key] ? (
                          <div className="bg-green-100 text-green-700 p-1.5 rounded-full inline-flex"><Check className="h-4 w-4" /></div>
                        ) : (
                          <div className="bg-red-50 text-red-300 p-1.5 rounded-full inline-flex"><X className="h-4 w-4" /></div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {sortedResults.map((result) => (
            <Card
              key={result.vendorId}
              className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
                result.vendorId === 'cloudflare' ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'
              )}
              onClick={() => setSelectedVendor(result)}
            >
              <CardHeader className="pb-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-display">{result.vendorName}</CardTitle>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Provider Analysis</p>
                  </div>
                  <Badge className={cn("px-2 py-0.5 text-xs font-bold", result.scores.totalScore > 80 ? "bg-green-600" : "bg-primary")}>
                    {result.scores.totalScore}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold tracking-tight">€{result.tcoYear1.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Year 1 Est. TCO</span>
                </div>
                <div className="pt-4 border-t border-primary/10">
                  {result.features.isBSIQualified && (
                    <div className="flex items-center text-green-600 font-bold text-xs bg-green-50 p-2 rounded-lg mb-4">
                      <ShieldCheck className="w-4 h-4 mr-2" /> {t('results.bsi_qualified')}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {result.features.hasZTNA && <Badge variant="secondary" className="text-[10px] bg-slate-200/50">ZTNA</Badge>}
                    {result.features.hasSWG && <Badge variant="secondary" className="text-[10px] bg-slate-200/50">SWG</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 md:p-10 flex gap-6 md:gap-8 items-center border shadow-2xl">
          <Info className="h-10 w-10 text-primary shrink-0" />
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Transparency & Data Accuracy</h4>
            <p className="text-sm text-slate-300 leading-relaxed italic">{t('results.disclaimer')}</p>
          </div>
        </div>
      </main>
      <Footer />
      <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-3xl font-display">{selectedVendor?.vendorName} Analysis</DialogTitle>
          </DialogHeader>
          <div className="space-y-8 py-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Price', val: selectedVendor?.scores.priceScore },
                { label: 'Feature', val: selectedVendor?.scores.featureScore },
                { label: 'Compliance', val: selectedVendor?.scores.complianceScore }
              ].map(stat => (
                <div key={stat.label} className="p-4 bg-slate-50 border rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.val}/100</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-bold">Capabilities</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedVendor?.features || {}).map(([key, val]) => (
                  key.startsWith('has') && <div key={key} className="flex justify-between p-2 bg-muted/30 rounded-lg border">
                    <span className="font-semibold text-foreground/70">{key.replace('has', '').toUpperCase()}</span>
                    <span className={val ? "text-green-600 font-bold" : "text-red-400 font-bold"}>{val ? 'YES' : 'NO'}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full btn-gradient py-6 text-lg" onClick={() => setSelectedVendor(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}