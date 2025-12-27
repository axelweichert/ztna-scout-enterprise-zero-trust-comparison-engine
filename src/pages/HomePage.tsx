import React from "react";
import { useI18n } from "@/i18n";
import { AppLayout } from "@/components/layout/AppLayout";

export function HomePage() {
  const { t } = useI18n();
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">ZTNA Scout</h1>
        <p className="text-muted-foreground">
          {t("home.subtitle") !== "home.subtitle"
            ? t("home.subtitle")
            : "Zero-Trust & SASE Vergleich – Stand November 2025"}
        </p>
      </div>
    </AppLayout>
  );
}
