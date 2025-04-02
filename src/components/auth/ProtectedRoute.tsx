
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const authenticated = !!data.session;
      const doctorRole = data.session?.user?.user_metadata?.role === 'doctor';
      
      setIsAuthenticated(authenticated);
      setIsDoctor(doctorRole);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  if (requireDoctor && !isDoctor) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
