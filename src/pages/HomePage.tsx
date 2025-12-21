import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, Variants } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  ArrowRight,
  FileText,
  Zap,
  Lock,
  Globe,
  HelpCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any
    }
  })
};
export function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 md:pt-40 md:pb-56">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,129,32,0.12),transparent_70%)] -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-10 uppercase tracking-[0.2em] border border-primary/20 shadow-sm"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{t('home.hero.badge')}</span>
            </motion.div>
            <motion.h1
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-6xl md:text-[8rem] font-display font-bold tracking-tight mb-8 leading-[0.85] md:leading-[0.8]"
            >
              {t('home.hero.title1')}<br />
              <span className="text-gradient drop-shadow-sm">{t('home.hero.title2')}</span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed px-4"
            >
              {t('home.hero.description')}
            </motion.p>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Button size="lg" onClick={() => navigate('/vergleich/neu')} className="btn-gradient h-16 px-14 text-lg rounded-2xl group shadow-2xl hover:scale-105 active:scale-95 transition-all">
                {t('home.hero.cta_primary')}
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 px-14 text-lg rounded-2xl border-2 hover:bg-slate-50 transition-all gap-2 hover:border-primary/40">
                <Link to="/vergleich/sample">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t('home.hero.cta_secondary')}
                </Link>
              </Button>
            </motion.div>
            {/* SASE Cloud Map Integration */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">{t('home.hero.sase_map_cta')}</p>
              <a
                href="https://sasecloudmap.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl border bg-white/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm tracking-tight">SASE Cloud Map</span>
                  <span className="block text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Global Infrastructure</span>
                </div>
                <ArrowRight className="ml-4 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </motion.div>
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-32 pt-16 border-t flex flex-wrap justify-center gap-12 md:gap-24"
            >
              {[
                { icon: ShieldCheck, label: t('home.trust.bsi') },
                { icon: Lock, label: t('home.trust.gdpr') },
                { icon: FileText, label: t('home.trust.pdf') },
                { icon: Globe, label: t('home.trust.sase') }
              ].map((trust, idx) => (
                <div key={idx} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                  <trust.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                  <span className="font-bold tracking-[0.2em] text-[10px] uppercase text-foreground">{trust.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Methodology Section */}
        <section className="py-32 md:py-48 bg-slate-50/50 dark:bg-slate-950/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                <BarChart3 className="w-3 h-3" />
                <span>Precision Methodology</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight dark:text-slate-100">
                {t('home.steps.title')}
              </h2>
              <p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {t('home.steps.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: s * 0.1 }}
                >
                  <Card className="group border-none dark:border-solid dark:border-slate-800 shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden bg-white dark:bg-slate-900 h-full">
                    <div className="h-1.5 bg-gradient-primary w-0 group-hover:w-full transition-all duration-700" />
                    <CardContent className="pt-12 pb-14 px-10">
                      <div className="w-16 h-16 rounded-2xl bg-primary/5 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl mb-8 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {s}
                      </div>
                      <h3 className="text-2xl font-bold mb-6 leading-tight dark:text-slate-100">
                        {t(`home.steps.step${s}.title`)}
                      </h3>
                      <p className="text-muted-foreground dark:text-slate-400 text-lg leading-relaxed">
                        {t(`home.steps.step${s}.desc`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="py-32 md:py-48 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center mb-24 space-y-4"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-sm">
                <HelpCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold dark:text-slate-100">{t('home.faq.title')}</h2>
              <p className="text-muted-foreground text-lg">{t('home.hero.badge')}</p>
            </motion.div>
            <Accordion type="single" collapsible className="w-full space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <AccordionItem value={`item-${i}`} className="border rounded-3xl px-8 bg-card dark:bg-slate-900/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                    <AccordionTrigger className="text-left font-bold py-10 text-xl hover:no-underline dark:text-slate-200 group">
                      <span className="group-hover:text-primary transition-colors">{t(`home.faq.q${i}`)}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground dark:text-slate-400 text-lg pb-10 leading-relaxed max-w-2xl border-t pt-6 mt-2">
                      {t(`home.faq.a${i}`, { freshness: t('common.data_freshness') })}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}