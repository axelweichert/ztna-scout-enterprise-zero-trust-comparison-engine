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
  const isSampleRoute = location.pathname === '/beispiel' || location.pathname === '/vergleich/sample' || id === 'sample';
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
  const filteredFeatures = useMemo(() => {
    if (!hideSimilar || top3.length < 2) return FEATURE_KEYS;
    return FEATURE_KEYS.filter(fk => {
      const values = top3.map(v => !!(v.features as any)?.[fk.key]);
      return !values.every(v => v === values[0]);
    });
  }, [hideSimilar, top3]);
  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-12 flex-1 w-full text-center">
        <Skeleton className="h-16 w-3/4 mx-auto" />
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
        <p className="text-muted-foreground mb-8">The requested analysis could not be located or has expired.</p>
        <Button asChild size="lg" className="btn-gradient px-12"><Link to="/">Go Back</Link></Button>
      </div>
      <Footer />
    </div>
  );
  const chartData = sortedResults.map(r => ({
    name: r.vendorName,
    tco: r.tcoYear1,
    id: r.vendorId
  }));
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {snapshot.isSample && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border-b border-primary/20 py-3 text-center print:hidden z-50 sticky top-16"
        >
          <p className="text-sm font-bold text-primary flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {t('results.live_sample_mode')}
          </p>
        </motion.div>
      )}
      <div className={cn(
        "fixed top-16 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b transition-transform duration-300 print:hidden shadow-sm",
        scrolled ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">{t('results.badges.top_match')}:</span>
            <Badge className="bg-primary text-[10px] font-bold">{sortedResults[0]?.vendorName}</Badge>
          </div>
          <Button size="sm" className="btn-gradient h-9 px-6 rounded-xl" onClick={() => navigate(`/vergleich/${snapshot.id}/print`)}>
            <Printer className="mr-2 h-3.5 w-3.5" /> {t('results.export_pdf')}
          </Button>
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 md:py-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-primary/10 pb-12 mb-20">
          <div className="space-y-4 text-pretty w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {t('results.meta.rid')}: {snapshot.id.slice(0, 8)}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(snapshot.createdAt, i18n.language)}</span>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                <BadgeCheck className="w-3 h-3 mr-1" /> {t('results.meta.verified')}
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-none">
              {snapshot.isSample ? t('results.sample_title') : t('results.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {t('results.subtitle', { seats: snapshot.inputs?.seats })}
              {snapshot.inputs?.budgetRange && ` • ${t(`form.options.budget_${snapshot.inputs.budgetRange}`)}`}
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto print:hidden">
            <Button variant="outline" onClick={() => navigate('/')} className="hidden sm:flex h-14 px-8 border-2 rounded-2xl">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('form.buttons.back')}
            </Button>
            <Button size="lg" className="h-14 flex-1 md:flex-none px-10 btn-gradient shadow-lg rounded-2xl" onClick={() => navigate(`/vergleich/${snapshot.id}/print`)}>
              <Printer className="mr-2 h-5 w-5" /> {t('results.export_pdf')}
            </Button>
          </div>
        </header>
        <section className="space-y-8 mb-20">
          <h2 className="text-3xl font-display font-bold flex items-center gap-3">
            <Sparkles className="text-primary w-8 h-8" />
            {t('results.badges.top_recommendations')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {top3.map((v, i) => (
                <motion.div
                  key={v.vendorId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                >
                  <Card className={cn("relative h-full overflow-hidden border-2 transition-all duration-300 rounded-3xl", i === 0 ? "border-primary shadow-2xl scale-105 z-10" : "border-muted shadow-sm hover:shadow-md")}>
                    {i === 0 && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">{t('results.badges.best_fit')}</div>}
                    <CardHeader>
                      <CardTitle className="text-2xl font-display font-bold">{v.vendorName}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{getRankLabel(i + 1, t)}</Badge>
                        {v.features.isBSIQualified && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-[9px] border-none uppercase font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> {t('results.bsi_qualified')}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                         <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('results.matrix.total_score')}</span>
                         <span className="text-2xl font-bold text-primary font-mono">{v.scores?.totalScore}</span>
                      </div>
                      <div className="p-5 bg-muted/30 rounded-2xl space-y-2 border border-muted/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{t('results.expert_take_label')}</p>
                        <p className="text-sm leading-relaxed italic text-foreground/80 font-medium text-pretty">
                          {t(`results.expert_take_${i}`)}
                        </p>
                      </div>
                      <Button variant="secondary" className="w-full h-12 font-bold rounded-xl print:hidden transition-transform active:scale-95" onClick={() => setSelectedVendor(v)}>
                        {t('results.matrix.deep_dive')}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
        <section className="space-y-8 mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl font-display font-bold">{t('results.matrix.title')}</h2>
            <Button variant="ghost" size="sm" onClick={() => setHideSimilar(!hideSimilar)} className={cn("gap-2 border px-4 rounded-xl print:hidden", hideSimilar && "text-primary border-primary/20 bg-primary/5")}>
              <Filter className="w-4 h-4" />
              {hideSimilar ? t('results.matrix.show_all') : t('results.matrix.diff_only')}
            </Button>
          </div>
          <div className="overflow-x-auto rounded-3xl border bg-white dark:bg-slate-950 shadow-xl">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b">
                  <th className="p-6 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-1/4">{t('results.matrix.capability')}</th>
                  {top3.map(v => (
                    <th key={v.vendorId} className="p-6 text-center border-l bg-white/50 dark:bg-slate-900/50">
                      <p className="font-bold text-lg whitespace-nowrap">{v.vendorName}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.map(({ key, translationKey }) => (
                  <tr key={key} className="border-b last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td className="p-6 font-semibold text-foreground/80 text-sm">{t(translationKey)}</td>
                    {top3.map(v => (
                      <td key={v.vendorId} className="p-6 text-center border-l bg-white/30 dark:bg-slate-900/30">
                        {(v.features as any)?.[key] ? (
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-2.5 rounded-full inline-flex"><Check className="h-4.5 w-4.5" /></div>
                        ) : (
                          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-300 dark:text-rose-800 p-2.5 rounded-full inline-flex"><X className="h-4.5 w-4.5" /></div>
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
          <Card className="p-4 md:p-10 shadow-2xl border-none bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl overflow-hidden">
            <div className="w-full h-[450px] md:h-[600px] relative min-w-0">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: isMobile ? 20 : 60, right: isMobile ? 40 : 80, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={isMobile ? 110 : 180}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fontSize: isMobile ? 10 : 12, fontWeight: 700, fill: 'hsl(var(--foreground))' }}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--primary)/0.03)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-slate-900 p-5 shadow-3xl border border-primary/10 rounded-2xl min-w-[200px]">
                              <p className="font-bold text-[10px] mb-2 text-muted-foreground uppercase tracking-[0.2em]">{payload[0].payload.name}</p>
                              <p className="text-primary font-bold text-2xl font-mono">{formatCurrency(payload[0].value as number, i18n.language.slice(0, 2))}</p>
                              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
                              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.3em] leading-none">Estimated 12-Month TCO</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="tco" radius={[0, 10, 10, 0]} barSize={isMobile ? 18 : 32}>
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
        <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-3xl p-8 md:p-14 flex flex-col md:flex-row gap-10 items-center border shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg transform -rotate-3">
            <Info className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-4 relative">
            <h4 className="text-2xl md:text-3xl font-display font-bold">{t('results.methodology_title')}</h4>
            <p className="text-lg text-slate-300 leading-relaxed italic max-w-4xl text-pretty">
              {t('results.disclaimer')} {t('results.methodology_desc')}
            </p>
            <p className="text-[10px] text-slate-500 font-mono tracking-[0.4em] uppercase font-bold">{t('common.data_freshness')}</p>
          </div>
        </div>
      </main>
      <Footer />
      <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none rounded-3xl shadow-3xl">
          <div className="bg-primary text-primary-foreground p-10 sm:p-12 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 opacity-10 -mr-12 -mb-12 rotate-12"><ShieldCheck size={240} /></div>
            <DialogHeader>
              <DialogTitle className="text-4xl font-display font-bold leading-tight">
                {selectedVendor?.vendorName}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80 font-mono text-[10px] uppercase tracking-[0.4em] mt-3 font-bold">
                {t('results.matrix.analytical_breakdown')}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 sm:p-12 space-y-10">
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
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{stat.desc}</p>
                    </div>
                    <span className="font-mono font-bold text-xl text-primary">{stat.val}/100</span>
                  </div>
                  <Progress value={stat.val} className="h-3 bg-slate-100 dark:bg-slate-800" />
                </div>
              ))}
            </div>
            <div className="pt-8 border-t dark:border-slate-800">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] mb-2">{t('results.matrix.scout_total')}</p>
                  <p className="text-6xl font-display font-bold text-primary tracking-tighter">{selectedVendor?.scores?.totalScore}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">{t('results.matrix.market_rank')}</p>
                   <Badge variant="outline" className="h-12 px-8 text-2xl font-bold bg-white dark:bg-slate-900 border-2 rounded-2xl shadow-sm">
                    {getRankLabel(sortedResults.findIndex(r => r.vendorId === selectedVendor?.vendorId) + 1, t)}
                   </Badge>
                </div>
              </div>
            </div>
            <Button className="w-full btn-gradient py-9 text-xl rounded-2xl shadow-xl hover:scale-[1.02] transition-transform active:scale-95 font-bold tracking-tight" onClick={() => setSelectedVendor(null)}>
              {t('results.matrix.close_deep_dive')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}