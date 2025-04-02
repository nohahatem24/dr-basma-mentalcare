
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireDoctor?: boolean;
}

const ProtectedRoute = ({ 
  children,
  requireAuth = true,
  requireDoctor = false 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { session } = useAuth();
  
  if (session.isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (requireAuth && !session.isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  if (requireDoctor && !session.isDoctor) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
