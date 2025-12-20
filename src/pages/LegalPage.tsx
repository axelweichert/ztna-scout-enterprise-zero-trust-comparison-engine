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
      <main className="flex-1 max-w-4xl mx-auto px-4 py-20 w-full">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-display font-bold mb-12">
            {type === 'imprint' ? t('legal.imprint.title') : t('legal.privacy.title')}
          </h1>
          <div className="space-y-12 text-foreground/80 leading-relaxed">
            {type === 'imprint' ? (
              <div className="space-y-10">
                <section>
                  <h2 className="text-xl font-bold text-foreground border-b pb-2 mb-4">
                    {t('legal.imprint.provider_title')}
                  </h2>
                  <p className="whitespace-pre-line">{t('legal.imprint.provider_details')}</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground border-b pb-2 mb-4">
                    {t('legal.imprint.contact_title')}
                  </h2>
                  <p className="whitespace-pre-line">{t('legal.imprint.contact_details')}</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground border-b pb-2 mb-4">
                    {t('legal.imprint.register_title')}
                  </h2>
                  <p className="whitespace-pre-line">{t('legal.imprint.register_details')}</p>
                </section>
              </div>
            ) : (
              <div className="space-y-10">
                <section>
                  <h2 className="text-xl font-bold text-foreground border-b pb-2 mb-4">
                    {t('legal.privacy.section1_title')}
                  </h2>
                  <p>{t('legal.privacy.section1_desc')}</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground border-b pb-2 mb-4">
                    {t('legal.privacy.section2_title')}
                  </h2>
                  <p>{t('legal.privacy.section2_desc')}</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground border-b pb-2 mb-4">
                    {t('legal.privacy.section3_title')}
                  </h2>
                  <p>{t('legal.privacy.section3_desc')}</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground border-b pb-2 mb-4">
                    {t('legal.privacy.section4_title')}
                  </h2>
                  <p>{t('legal.privacy.section4_desc')}</p>
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