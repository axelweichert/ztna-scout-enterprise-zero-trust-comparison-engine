import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/i18n";

interface LegalPageProps {
  type: "imprint" | "privacy";
}

export function LegalPage({ type }: LegalPageProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-20 w-full">
        <article className="text-slate-900 dark:text-slate-100 leading-relaxed">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-12 tracking-tight">
            {type === "imprint" ? t("legal.imprint.title") : t("legal.privacy.title")}
          </h1>

          <div className="space-y-16">
            {type === "imprint" ? (
              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-foreground border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    {t("legal.imprint.provider_title")}
                  </h2>
                  <p className="whitespace-pre-line text-lg">
                    von Busch GmbH{"\n"}
                    Alfred-Bozi-Straße 12{"\n"}
                    33602 Bielefeld{"\n"}
                    Deutschland
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                    {t("legal.imprint.contact_title")}
                  </h2>
                  <p className="whitespace-pre-line text-lg">
                    E-Mail: info@vonbusch.de{"\n"}
                    Telefon: +49 (0)521 000000{"\n"}
                    Web: www.vonbusch.digital
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-8">
                <p className="text-lg">
                  Diese Seite verweist auf die vollständige Datenschutzerklärung auf vonbusch.digital. Bitte nutzen Sie
                  den Link im Footer.
                </p>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
