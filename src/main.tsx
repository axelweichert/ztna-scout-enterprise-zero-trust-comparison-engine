import "@/lib/errorReporter";
import { enableMapSet } from "immer";
enableMapSet();

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HomePage } from "@/pages/HomePage";
import { ResultsPage } from "@/pages/ResultsPage";
import { PrintResultsPage } from "@/pages/PrintResultsPage";
import { VerifyPage } from "@/pages/VerifyPage";
import { OptOutPage } from "@/pages/OptOutPage";
import { AdminPage } from "@/pages/AdminPage";
import { LegalPage } from "@/pages/LegalPage";
import { I18nProvider } from "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/vergleich/:leadId", element: <ResultsPage /> },
  { path: "/vergleich/:leadId/print", element: <PrintResultsPage /> },
  { path: "/vergleich/sample", element: <ResultsPage sample /> },
  { path: "/verify/:token", element: <VerifyPage /> },
  { path: "/optout/:token", element: <OptOutPage /> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/impressum", element: <LegalPage type="imprint" /> },
  { path: "/datenschutz", element: <LegalPage type="privacy" /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <I18nProvider>
            <RouterProvider router={router} />
          </I18nProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
