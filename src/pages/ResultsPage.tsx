import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api-client';
import type { ComparisonSnapshot, ComparisonResult } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Printer, ArrowLeft, Info, Check, X, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
export function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedVendor, setSelectedVendor] = useState<ComparisonResult | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hideSimilar, setHideSimilar] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { data: snapshot, isLoading, error } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => api<ComparisonSnapshot>(id === 'sample' ? '/api/sample-comparison' : `/api/comparison/${id}`),
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
  const featureKeys = [
    { key: 'hasZTNA', label: 'ZTNA' },
    { key: 'hasSWG', label: 'SWG' },
    { key: 'hasCASB', label: 'CASB' },
    { key: 'hasDLP', label: 'DLP' },
    { key: 'hasFWaaS', label: 'Firewall-as-a-Service' },
    { key: 'hasRBI', label: 'Remote Browser Isolation' }
  ];
  const filteredFeatures = hideSimilar 
    ? featureKeys.filter(fk => {
        const values = top3.map(v => (v.features as any)[fk.key]);
        return !values.every(v => v === values[0]);
      })
    : featureKeys;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className={cn(
        "fixed top-16 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b transition-transform duration-300 print:hidden",
        scrolled ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Top Match:</span>
            <Badge className="bg-primary text-[10px]">{sortedResults[0].vendorName}</Badge>
          </div>
          <Button size="sm" className="btn-gradient h-8" onClick={() => navigate(`/vergleich/${id}/print`)}>
            <Printer className="mr-2 h-3.5 w-3.5" /> Export PDF
          </Button>
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-16">
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-primary/10 pb-12 mb-20">
          <div className="space-y-4">
            <h1 className="text-display tracking-tight leading-none">
              {snapshot.isSample ? "Sample Security Analysis" : t('results.title')}
            </h1>
            <p className="text-xl text-muted-foreground">{t('results.subtitle', { seats: snapshot.inputs.seats })}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild className="hidden sm:flex h-14 px-8 border">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> {t('form.buttons.back')}</Link>
            </Button>
            <Button size="lg" className="h-14 px-10 btn-gradient" onClick={() => navigate(`/vergleich/${id}/print`)}>
              <Printer className="mr-2 h-5 w-5" /> {t('results.export_pdf')}
            </Button>
          </div>
        </header>
        <section className="space-y-8 mb-20">
          <h2 className="text-3xl font-display font-bold flex items-center gap-3">
            <Sparkles className="text-primary w-8 h-8" />
            Top Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {top3.map((v, i) => (
              <Card key={v.vendorId} className={cn("relative overflow-hidden border-2", i === 0 ? "border-primary shadow-xl" : "border-muted shadow-sm")}>
                {i === 0 && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Best Fit</div>}
                <CardHeader>
                  <CardTitle className="text-2xl">{v.vendorName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Expert Take</p>
                    <p className="text-sm leading-relaxed italic">
                      {i === 0 ? "Exceptional balance of cost and compliance. Ideal for regulated industries." : 
                       i === 1 ? "Premium feature set with advanced threat protection. Recommended for high-risk profiles." : 
                       "Scalable architecture with simple implementation paths."}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedVendor(v)}>Analysis Deep-Dive</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="space-y-8 mb-20">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-display font-bold">Capability Matrix</h2>
            <Button variant="ghost" size="sm" onClick={() => setHideSimilar(!hideSimilar)} className={cn("gap-2", hideSimilar && "text-primary")}>
              <Filter className="w-4 h-4" />
              {hideSimilar ? "Show All Rows" : "Highlight Differences"}
            </Button>
          </div>
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-lg">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 border-b">
                  <th className="p-6 text-left text-sm font-bold uppercase tracking-wider text-muted-foreground w-1/4">Capability</th>
                  {top3.map(v => (
                    <th key={v.vendorId} className="p-6 text-center">
                      <p className="font-bold text-lg">{v.vendorName}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.map(({ key, label }) => (
                  <tr key={key} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-semibold text-foreground/80">{label}</td>
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
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 md:p-10 flex gap-6 md:gap-8 items-center border shadow-2xl">
          <Info className="h-10 w-10 text-primary shrink-0" />
          <div className="space-y-2">
            <h4 className="text-xl font-bold">Methodology Note</h4>
            <p className="text-sm text-slate-300 leading-relaxed italic">{t('results.disclaimer')}</p>
          </div>
        </div>
      </main>
      <Footer />
      <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none rounded-3xl">
          <div className="bg-primary text-primary-foreground p-8">
            <DialogHeader>
              <DialogTitle className="text-3xl font-display">{selectedVendor?.vendorName} Scorecard</DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Weighted Analysis</h4>
              <div className="space-y-4">
                {[
                  { label: 'Feature Richness (40%)', val: selectedVendor?.scores.featureScore },
                  { label: 'Price Competitiveness (40%)', val: selectedVendor?.scores.priceScore },
                  { label: 'Regulatory Compliance (20%)', val: selectedVendor?.scores.complianceScore }
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{stat.label}</span>
                      <span>{stat.val}/100</span>
                    </div>
                    <Progress value={stat.val} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Total Score</p>
                  <p className="text-4xl font-display font-bold text-primary">{selectedVendor?.scores.totalScore}</p>
                </div>
                <Badge variant="outline" className="h-10 px-4 text-lg font-bold">
                  Ranked #{sortedResults.findIndex(r => r.vendorId === selectedVendor?.vendorId) + 1}
                </Badge>
              </div>
            </div>
            <Button className="w-full btn-gradient py-6 text-lg rounded-xl shadow-xl" onClick={() => setSelectedVendor(null)}>Close Analysis</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}