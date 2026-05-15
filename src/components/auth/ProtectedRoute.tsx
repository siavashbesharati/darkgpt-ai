import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { AuthModal } from './AuthModal';
import { Loader2 } from 'lucide-react';
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}
export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  // Zustand Zero-Tolerance Rule: Select primitives individually
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const userIsAdmin = useStore(s => s.user?.isAdmin ?? false);
  const userExists = useStore(s => !!s.user);
  const token = useStore(s => s.token);
  const [showAuth, setShowAuth] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated && !token) {
      setShowAuth(true);
    }
  }, [isAuthenticated, token]);
  // If we have a token but user data hasn't refreshed yet, show loader
  if (token && !userExists) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <>
        <Navigate to="/" replace state={{ from: location }} />
        <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      </>
    );
  }
  if (adminOnly && !userIsAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}