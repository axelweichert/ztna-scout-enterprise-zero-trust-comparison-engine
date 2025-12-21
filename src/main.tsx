import '@/lib/errorReporter';
import './i18n';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage';
import { LeadFormPage } from '@/pages/LeadFormPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { AdminPage } from '@/pages/AdminPage';
import { PrintResultsPage } from '@/pages/PrintResultsPage';
import { VerifyPage } from '@/pages/VerifyPage';
import { LegalPage } from '@/pages/LegalPage';
import { OptOutPage } from '@/pages/OptOutPage';
import { Toaster } from '@/components/ui/sonner';
const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { 
      refetchOnWindowFocus: false, 
      staleTime: 1000 * 60 * 5,
      retry: 1
    } 
  },
});
const router = createBrowserRouter([
  { path: "/", element: <HomePage />, errorElement: <RouteErrorBoundary /> },
  { path: "/beispiel", element: <ResultsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/vergleich/sample", element: <ResultsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/vergleich/neu", element: <LeadFormPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/vergleich/:id", element: <ResultsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/vergleich/:id/print", element: <PrintResultsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/verify/:token", element: <VerifyPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/opt-out", element: <OptOutPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/admin", element: <AdminPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/impressum", element: <LegalPage type="imprint" />, errorElement: <RouteErrorBoundary /> },
  { path: "/datenschutz", element: <LegalPage type="privacy" />, errorElement: <RouteErrorBoundary /> },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
          <Toaster richColors position="top-center" closeButton />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
)