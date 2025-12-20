// src/pages/HomePage.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  CheckCircle,
  FileText,
  Globe,
  ArrowRight,
  Sparkles,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-primary/8 to-background p-8 md:p-12">
          <div className="absolute inset-0 pointer-events-none opacity-60 [mask-image:radial-gradient(circle_at_top,black,transparent_70%)]">
            <div className="h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <motion.div {...fadeIn} className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t("home.hero.badge")}</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-display font-bold tracking-tight leading-[1.02]">
              {t("home.hero.title1")}{" "}
              <span className="text-primary">{t("home.hero.title2")}</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg md:text-xl text-muted-foreground">
              {t("home.hero.description")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="btn-gradient h-12 px-7">
                <Link to="/vergleich/neu">
                  {t("home.hero.cta_primary")}{" "}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="h-12 px-7">
                <Link to="/beispiel">{t("home.hero.cta_secondary")}</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border bg-background/70 p-4">
                <Shield className="h-5 w-5 text-primary" />
                <div className="text-sm font-semibold">{t("home.trust.bsi")}</div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border bg-background/70 p-4">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div className="text-sm font-semibold">{t("home.trust.gdpr")}</div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border bg-background/70 p-4">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-sm font-semibold">{t("home.trust.pdf")}</div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border bg-background/70 p-4">
                <Globe className="h-5 w-5 text-primary" />
                <div className="text-sm font-semibold">{t("home.trust.global")}</div>
              </div>
            </div>

            {/* SASE Cloud Map button */}
            <div className="mt-6 flex justify-center">
              <a
                href="https://sasecloudmap.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-5 py-3 text-sm font-semibold hover:bg-background transition"
              >
                <Network className="h-4 w-4 text-primary" />
                {t("home.trust.sase_map")}
              </a>
            </div>
          </motion.div>
        </section>

        {/* Methodology */}
        <section className="mt-14 md:mt-18">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              {t("home.steps.title")}
            </h2>
            <p className="mt-2 text-muted-foreground text-lg">
              {t("home.steps.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  {t("home.steps.step1.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {t("home.steps.step1.desc")}
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  {t("home.steps.step2.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {t("home.steps.step2.desc")}
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  {t("home.steps.step3.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {t("home.steps.step3.desc")}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
