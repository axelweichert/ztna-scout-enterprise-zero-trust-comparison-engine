import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Sparkles
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,129,32,0.08),transparent_50%)] -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 uppercase tracking-widest border border-primary/20"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{t('home.hero.badge')}</span>
            </motion.div>
            <motion.h1
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-6xl md:text-[7rem] font-display font-bold tracking-tight mb-8 leading-[0.9] md:leading-[0.85]"
            >
              {t('home.hero.title1')}<br />
              <span className="text-gradient drop-shadow-sm">{t('home.hero.title2')}</span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed"
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
              <Button size="lg" onClick={() => navigate('/vergleich/neu')} className="btn-gradient h-16 px-12 text-lg rounded-2xl group shadow-2xl">
                {t('home.hero.cta_primary')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/vergleich/sample')}
                className="h-16 px-12 text-lg rounded-2xl border-2 hover:bg-slate-50 transition-colors gap-2"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                {t('home.hero.cta_secondary')}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-32 pt-16 border-t flex flex-wrap justify-center gap-12 md:gap-24"
            >
              {[
                { icon: ShieldCheck, label: 'BSI Qualified' },
                { icon: Lock, label: 'GDPR Enforced' },
                { icon: FileText, label: 'PDF Export' },
                { icon: Globe, label: 'Global SASE' }
              ].map((trust, idx) => (
                <div key={idx} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-300">
                  <trust.icon className="w-5 h-5 text-foreground" />
                  <span className="font-bold tracking-[0.2em] text-[10px] uppercase text-foreground">{trust.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Methodology Section with Dark Mode accessibility refinements */}
        <section className="py-32 bg-slate-50/50 dark:bg-slate-950/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight dark:text-slate-100">
                {t('home.steps.title')}
              </h2>
              <p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
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
                  <Card className="border-none dark:border-solid dark:border-slate-800 shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden bg-white dark:bg-slate-900 h-full">
                    <div className="h-1.5 bg-gradient-primary w-full" />
                    <CardContent className="pt-12 pb-14 px-10">
                      <div className="w-16 h-16 rounded-2xl bg-primary/5 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl mb-8 shadow-sm">
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
        <section className="py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center mb-20 space-y-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold dark:text-slate-100">{t('home.faq.title')}</h2>
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
                  <AccordionItem value={`item-${i}`} className="border rounded-3xl px-8 bg-card dark:bg-slate-900/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="text-left font-bold py-8 text-xl hover:no-underline dark:text-slate-200">
                      {t(`home.faq.q${i}`)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground dark:text-slate-400 text-lg pb-8 leading-relaxed max-w-2xl">
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