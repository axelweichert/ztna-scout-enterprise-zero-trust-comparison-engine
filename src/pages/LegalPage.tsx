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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-20 w-full">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-display font-bold mb-12 capitalize">
            {type === 'imprint' ? 'Impressum' : 'Privacy Policy'}
          </h1>
          <div className="space-y-8 text-foreground/80 leading-relaxed">
            {type === 'imprint' ? (
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-bold text-foreground">Service Provider</h2>
                  <p>von Busch GmbH<br />Alfred-Bozi-Straße 12<br />33602 Bielefeld<br />Germany</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground">Contact</h2>
                  <p>Email: security@vonbusch.digital<br />Web: www.vonbusch.digital</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground">Commercial Register</h2>
                  <p>Amtsgericht Bielefeld<br />HRB 45678</p>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-bold text-foreground">1. Data Collection</h2>
                  <p>We collect data necessary for the ZTNA analysis, including organization name, contact person, and infrastructure metrics.</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground">2. Legal Basis</h2>
                  <p>Data processing is based on your explicit consent (Art. 6 para. 1 lit. a GDPR) and our legitimate interest in delivering accurate security comparisons.</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground">3. Retention</h2>
                  <p>Confirmed leads are stored for 24 months. Unverified leads are purged automatically after 30 days.</p>
                </section>
                <section>
                  <h2 className="text-xl font-bold text-foreground">4. Your Rights</h2>
                  <p>You have the right to access, rectify, or delete your data at any time. Contact us at security@vonbusch.digital.</p>
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