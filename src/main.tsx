import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { EditorPage } from '@/pages/EditorPage'
import { PricingPage } from '@/pages/PricingPage'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useStore } from '@/lib/store';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  { path: "/", element: <HomePage />, errorElement: <RouteErrorBoundary /> },
  { path: "/editor", element: <ProtectedRoute><EditorPage /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
  { path: "/pricing", element: <PricingPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/admin", element: <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
]);
export function App() {
  const refreshUser = useStore(s => s.refreshUser);
  const isAuthenticated = useStore(s => s.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [refreshUser, isAuthenticated]);
  return <RouterProvider router={router} />;
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)