import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';
export function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 md:pt-32 md:pb-48">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8"
            >
              <Zap className="w-4 h-4" /> 
              <span>{t('home.hero.badge')}</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1]"
            >
              {t('home.hero.title1')}<br />
              <span className="text-gradient">{t('home.hero.title2')}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
            >
              {t('home.hero.description')}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" onClick={() => navigate('/vergleich/neu')} className="btn-gradient h-16 px-10 text-lg rounded-2xl group">
                {t('home.hero.cta_primary')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl border-2">
                {t('home.hero.cta_secondary')}
              </Button>
            </motion.div>
            {/* Trust Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-24 pt-12 border-t flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <div className="flex items-center gap-2"><ShieldCheck className="w-6 h-6" /><span className="font-bold tracking-widest text-xs uppercase">BSI Qualified</span></div>
              <div className="flex items-center gap-2"><Lock className="w-6 h-6" /><span className="font-bold tracking-widest text-xs uppercase">GDPR Compliant</span></div>
              <div className="flex items-center gap-2"><FileText className="w-6 h-6" /><span className="font-bold tracking-widest text-xs uppercase">PDF Analysis</span></div>
              <div className="flex items-center gap-2"><Globe className="w-6 h-6" /><span className="font-bold tracking-widest text-xs uppercase">Enterprise Ready</span></div>
            </motion.div>
          </div>
        </section>
        {/* How it Works */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{t('home.steps.title')}</h2>
              <p className="text-muted-foreground">{t('home.steps.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((s) => (
                <Card key={s} className="border-none shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white">
                  <div className="h-2 bg-primary" />
                  <CardContent className="pt-8 pb-10 px-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-6">
                      {s}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{t(`home.steps.step${s}.title`)}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t(`home.steps.step${s}.desc`)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-display font-bold">{t('home.faq.title')}</h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border rounded-2xl px-6 bg-card">
                  <AccordionTrigger className="text-left font-bold py-6 hover:no-underline">
                    {t(`home.faq.q${i}`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    {t(`home.faq.a${i}`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}