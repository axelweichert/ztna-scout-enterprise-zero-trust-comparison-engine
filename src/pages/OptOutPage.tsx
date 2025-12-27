import React from "react";
import { useI18n } from "@/i18n";
import { AppLayout } from "@/components/layout/AppLayout";

export function OptOutPage() {
  const { t } = useI18n();
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold">
        {t("optout.title") !== "optout.title" ? t("optout.title") : "Abmelden"}
      </h1>
    </AppLayout>
  );
}
