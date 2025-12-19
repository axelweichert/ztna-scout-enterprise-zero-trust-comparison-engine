import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';
interface LegalPageProps {
  type: 'imprint' | 'privacy';
}
export function LegalPage({ type }: LegalPageProps) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-20 w-full">
        <article className="text-slate-900 dark:text-slate-100 leading-relaxed">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-12 tracking-tight">
            {type === 'imprint' ? t('legal.imprint.title') : t('legal.privacy.title')}
          </h1>
          <div className="space-y-16">
            {type === 'imprint' ? (
              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-foreground border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    {t('legal.imprint.provider_title')}
                  </h2>
                  <p className="whitespace-pre-line text-lg text-slate-600 dark:text-slate-400">
                    {t('legal.imprint.provider_details')}
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    {t('legal.imprint.contact_title')}
                  </h2>
                  <p className="whitespace-pre-line text-lg text-slate-600 dark:text-slate-400">
                    {t('legal.imprint.contact_details')}
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    {t('legal.imprint.register_title')}
                  </h2>
                  <p className="whitespace-pre-line text-lg text-slate-600 dark:text-slate-400">
                    {t('legal.imprint.register_details')}
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-foreground border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    {t('legal.privacy.section1_title')}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {t('legal.privacy.section1_desc')}
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    {t('legal.privacy.section2_title')}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {t('legal.privacy.section2_desc')}
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    {t('legal.privacy.section3_title')}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {t('legal.privacy.section3_desc')}
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    {t('legal.privacy.section4_title')}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {t('legal.privacy.section4_desc')}
                  </p>
                </section>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}