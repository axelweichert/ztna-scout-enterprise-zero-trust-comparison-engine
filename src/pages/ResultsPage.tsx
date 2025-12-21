import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { ComparisonSnapshot, ComparisonResult } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Printer, ArrowLeft, Info, Check, X, Sparkles, Filter, AlertTriangle, FileText, Calendar, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, formatDate, getRankLabel, formatCurrency } from '@/lib/utils';
const FEATURE_KEYS = [
  { key: 'hasZTNA', translationKey: 'results.matrix.features.hasZTNA' },
  { key: 'hasSWG', translationKey: 'results.matrix.features.hasSWG' },
  { key: 'hasCASB', translationKey: 'results.matrix.features.hasCASB' },
  { key: 'hasDLP', translationKey: 'results.matrix.features.hasDLP' },
  { key: 'hasFWaaS', translationKey: 'results.matrix.features.hasFWaaS' },
  { key: 'hasRBI', translationKey: 'results.matrix.features.hasRBI' }
];
export function ResultsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();
  const [selectedVendor, setSelectedVendor] = useState<ComparisonResult | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hideSimilar, setHideSimilar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isSampleRoute = useMemo(() => {
    const p = location.pathname;
    return p === '/beispiel' || p === '/vergleich/sample' || id === 'sample' || id === 'demo';
  }, [location.pathname, id]);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [id]);
  const { data: snapshot, isLoading, error } = useQuery({
    queryKey: ['comparison', isSampleRoute ? 'sample' : id],
    queryFn: () => api<ComparisonSnapshot>(isSampleRoute ? '/api/sample-comparison' : `/api/comparison/${id}`),
    retry: 1
  });
  const sortedResults = useMemo(() => {
    if (!snapshot) return [];
    return [...snapshot.results].sort((a, b) => (b.scores?.totalScore ?? 0) - (a.scores?.totalScore ?? 0));
  }, [snapshot]);
  const top3 = useMemo(() => sortedResults.slice(0, 3), [sortedResults]);
  if (isLoading) return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-12 flex-1 w-full text-center">
        <Skeleton className="h-16 w-3/4 mx-auto rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
      <Footer />
    </div>
  );
  if (error || !snapshot) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-40 text-center flex-1 w-full">
        <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Report Unavailable</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">The requested analysis has either expired or does not exist in our secure vault.</p>
        <Button asChild size="lg" className="btn-gradient px-12 h-14 rounded-2xl shadow-lg"><Link to="/">Start New Analysis</Link></Button>
      </div>
      <Footer />
    </div>
  );
  const chartData = sortedResults.map(r => ({ name: r.vendorName, tco: r.tcoYear1, id: r.vendorId }));
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {snapshot.isSample && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 border-b border-primary/20 py-3 text-center sticky top-16 z-50 print:hidden">
          <p className="text-xs font-bold text-primary flex items-center justify-center gap-2 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {t('results.live_sample_mode')}
          </p>
        </motion.div>
      )}
      <div className={cn("fixed top-16 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b transition-transform duration-300 print:hidden shadow-sm", scrolled ? "translate-y-0" : "-translate-y-full")}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Market Leader:</span>
            <Badge className="bg-primary text-[10px] font-bold px-3 py-1 rounded-lg">{sortedResults[0]?.vendorName}</Badge>
          </div>
          <Button size="sm" className="btn-gradient h-9 px-6 rounded-xl text-xs font-bold" onClick={() => navigate(`/vergleich/${snapshot.id}/print`)}>
            <Printer className="mr-2 h-3.5 w-3.5" /> {t('results.export_pdf')}
          </Button>
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-primary/10 pb-12 mb-20">
          <div className="space-y-4 text-pretty w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> ID: {snapshot.id.slice(0, 8)}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(snapshot.createdAt, i18n.language)}</span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><BadgeCheck className="w-3 h-3 mr-1" /> Verified</Badge>
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tight leading-none">
              {snapshot.isSample ? t('results.sample_title') : t('results.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {t('results.subtitle', { seats: snapshot.inputs?.seats })}
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto print:hidden">
            <Button size="lg" className="h-14 flex-1 md:flex-none px-10 btn-gradient shadow-xl rounded-2xl text-lg font-bold" onClick={() => navigate(`/vergleich/${snapshot.id}/print`)}>
              <Printer className="mr-2 h-5 w-5" /> {t('results.export_pdf')}
            </Button>
          </div>
        </header>
        <section className="space-y-10 mb-24">
          <h2 className="text-3xl font-display font-bold flex items-center gap-3">
            <Sparkles className="text-primary w-8 h-8" />
            {t('results.badges.top_recommendations')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {top3.map((v, i) => (
              <motion.div key={v.vendorId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex">
                <Card className={cn("relative flex-1 overflow-hidden border-2 transition-all duration-300 rounded-[2rem] flex flex-col", i === 0 ? "border-primary shadow-2xl scale-105 z-10" : "border-muted shadow-sm hover:shadow-md")}>
                  {i === 0 && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">Best Match</div>}
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold font-display">{v.vendorName}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-[10px] font-bold">{getRankLabel(i + 1, t)}</Badge>
                      {v.features.isBSIQualified && <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase"><ShieldCheck className="w-3 h-3 mr-1" /> BSI-Qualifiziert</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Scout Score</span>
                       <span className="text-2xl font-bold text-primary font-mono">{v.scores?.totalScore}</span>
                    </div>
                    <div className="p-5 bg-muted/30 rounded-2xl flex-1 border border-muted/50">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Market Insight</p>
                      <p className="text-sm leading-relaxed italic text-foreground/80 font-medium">
                        {t(`results.expert_take_${i}`)}
                      </p>
                    </div>
                    <Button variant="secondary" className="w-full h-12 font-bold rounded-xl mt-auto" onClick={() => setSelectedVendor(v)}>
                      View Analysis
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="space-y-8 mb-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl font-display font-bold">Capability Comparison</h2>
            <Button variant="ghost" size="sm" onClick={() => setHideSimilar(!hideSimilar)} className={cn("gap-2 border px-4 rounded-xl print:hidden", hideSimilar && "text-primary border-primary/20 bg-primary/5")}>
              <Filter className="w-4 h-4" />
              {hideSimilar ? "Show All Rows" : "Highlight Differences"}
            </Button>
          </div>
          <div className="overflow-x-auto rounded-[2rem] border bg-white dark:bg-slate-950 shadow-xl">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="border-b">
                  <th className="p-6 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-1/4">Capability Matrix</th>
                  {top3.map(v => (
                    <th key={v.vendorId} className="p-6 text-center border-l bg-white/50 dark:bg-slate-900/50">
                      <p className="font-bold text-lg">{v.vendorName}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_KEYS.map(({ key, translationKey }) => (
                  <tr key={key} className="border-b last:border-0 hover:bg-slate-50/30 transition-colors">
                    <td className="p-6 font-semibold text-foreground/80 text-sm">{t(translationKey)}</td>
                    {top3.map(v => (
                      <td key={v.vendorId} className="p-6 text-center border-l">
                        {(v.features as any)?.[key] ? (
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 p-2 rounded-full inline-flex"><Check className="h-4 w-4" /></div>
                        ) : (
                          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-300 p-2 rounded-full inline-flex"><X className="h-4 w-4" /></div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="space-y-8 mb-24">
          <h2 className="text-3xl font-display font-bold">{t('results.tco_title')}</h2>
          <Card className="p-8 md:p-12 shadow-2xl border-none bg-slate-50/50 rounded-[2.5rem] overflow-hidden">
            <div className="w-full aspect-video min-h-[400px] md:min-h-[500px]" style={{ minHeight: '400px' }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: isMobile ? 10 : 60, right: 60, top: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={isMobile ? 100 : 160} tickLine={false} axisLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'hsl(var(--foreground))' }} />
                    <Tooltip cursor={{ fill: 'hsl(var(--primary)/0.03)' }} content={({ active, payload }) => {
                        if (active && payload?.length) {
                          return (
                            <div className="bg-white p-5 shadow-3xl border border-primary/10 rounded-2xl min-w-[200px]">
                              <p className="font-bold text-[10px] mb-2 text-muted-foreground uppercase tracking-widest">{payload[0].payload.name}</p>
                              <p className="text-primary font-bold text-2xl font-mono">{formatCurrency(payload[0].value as number, i18n.language)}</p>
                              <div className="h-px bg-slate-100 my-4" />
                              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Calculated 1-Year TCO</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="tco" radius={[0, 10, 10, 0]} barSize={isMobile ? 20 : 32}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.id === 'cloudflare' ? '#F48120' : (entry.id === 'zscaler' ? '#0045D6' : '#1E293B')} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </section>
        <div className="bg-slate-900 text-slate-100 rounded-[2.5rem] p-8 md:p-14 flex flex-col md:flex-row gap-10 items-center border shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg transform -rotate-3">
            <Info className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-4 relative">
            <h4 className="text-2xl md:text-3xl font-display font-bold">{t('results.methodology_title')}</h4>
            <p className="text-lg text-slate-300 leading-relaxed italic max-w-4xl text-pretty">
              {t('results.disclaimer')} {t('results.methodology_desc')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none rounded-[2rem] shadow-3xl">
          <div className="bg-primary text-primary-foreground p-10 sm:p-12">
            <DialogHeader>
              <DialogTitle className="text-4xl font-display font-bold leading-tight">
                {selectedVendor?.vendorName}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 font-mono text-[10px] uppercase tracking-[0.4em] mt-3 font-bold">
                Analytical Breakdown
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-10 space-y-10">
            <div className="space-y-8">
              {[
                { label: t('results.matrix.feature_score'), val: selectedVendor?.scores?.featureScore ?? 0, desc: t('results.matrix.expert_take_desc.features') },
                { label: t('results.matrix.price_score'), val: selectedVendor?.scores?.priceScore ?? 0, desc: t('results.matrix.expert_take_desc.price') },
                { label: t('results.matrix.compliance_score'), val: selectedVendor?.scores?.complianceScore ?? 0, desc: t('results.matrix.expert_take_desc.compliance') }
              ].map((stat, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-widest leading-none">{stat.label}</span>
                      <p className="text-[10px] text-muted-foreground font-medium">{stat.desc}</p>
                    </div>
                    <span className="font-mono font-bold text-xl text-primary">{stat.val}/100</span>
                  </div>
                  <Progress value={stat.val} className="h-3 bg-slate-100" />
                </div>
              ))}
            </div>
            <div className="pt-8 border-t">
              <div className="flex justify-between items-center bg-slate-50 p-8 rounded-[2rem] border shadow-inner">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Total Scout Score</p>
                  <p className="text-6xl font-display font-bold text-primary tracking-tighter">{selectedVendor?.scores?.totalScore}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Market Position</p>
                   <Badge variant="outline" className="h-12 px-6 text-xl font-bold bg-white border-2 rounded-xl">
                    {getRankLabel(sortedResults.findIndex(r => r.vendorId === selectedVendor?.vendorId) + 1, t)}
                   </Badge>
                </div>
              </div>
            </div>
            <Button className="w-full btn-gradient py-8 text-lg rounded-2xl font-bold" onClick={() => setSelectedVendor(null)}>
              Close Analysis
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}