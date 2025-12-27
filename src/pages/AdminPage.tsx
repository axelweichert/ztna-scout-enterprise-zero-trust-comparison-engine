import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";

export function AdminPage() {
  return (
    <AppLayout container>
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="text-muted-foreground">E-Mail Events & Leads (kommt als nächster Schritt).</p>
    </AppLayout>
  );
}
