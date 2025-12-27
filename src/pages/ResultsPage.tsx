import React from "react";
import { useI18n } from "@/i18n";
import { AppLayout } from "@/components/layout/AppLayout";

export function ResultsPage({ sample = false }: { sample?: boolean }) {
  const { t } = useI18n();
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("results.title") !== "results.title" ? t("results.title") : "Ergebnis"}</h1>
        <p className="text-muted-foreground">
          {sample ? "Live-Beispiel" : "Report"}
        </p>
      </div>
    </AppLayout>
  );
}
