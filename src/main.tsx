import '@/lib/errorReporter';
import './i18n';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { LeadFormPage } from '@/pages/LeadFormPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { AdminPage } from '@/pages/AdminPage';
import { PrintResultsPage } from '@/pages/PrintResultsPage';
import { Toaster } from '@/components/ui/sonner';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <LeadFormPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/vergleich/:id",
    element: <ResultsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/vergleich/:id/print",
    element: <PrintResultsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <Toaster richColors position="top-center" closeButton />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)