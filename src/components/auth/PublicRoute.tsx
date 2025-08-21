"use client";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Skeleton className="h-screen w-full bg-white/10" />
      </div>
    );
  }

  if (user) {
    return null; // Redirect handled by useEffect
  }

  return <>{children}</>;
};

export default PublicRoute;