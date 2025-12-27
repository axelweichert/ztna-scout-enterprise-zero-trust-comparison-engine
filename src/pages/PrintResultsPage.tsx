import React from "react";
import { useI18n } from "@/i18n";
import { AppLayout } from "@/components/layout/AppLayout";

export function PrintResultsPage() {
  const { t } = useI18n();
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold">
        {t("results.print") !== "results.print" ? t("results.print") : "Druckansicht"}
      </h1>
    </AppLayout>
  );
}
