import React from "react";
import { useI18n } from "@/i18n";
import { AppLayout } from "@/components/layout/AppLayout";

export function VerifyPage() {
  const { t } = useI18n();
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold">
        {t("verify.title") !== "verify.title" ? t("verify.title") : "E-Mail bestätigen"}
      </h1>
    </AppLayout>
  );
}
