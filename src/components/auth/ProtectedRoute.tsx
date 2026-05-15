import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { AuthModal } from './AuthModal';
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}
export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const user = useStore(s => s.user);
  const [showAuth, setShowAuth] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuth(true);
    }
  }, [isAuthenticated]);
  if (!isAuthenticated) {
    return (
      <>
        <Navigate to="/" replace state={{ from: location }} />
        <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      </>
    );
  }
  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}