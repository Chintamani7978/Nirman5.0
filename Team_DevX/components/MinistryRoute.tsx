import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth'; // Assuming you have an auth hook
import SuspenseLoader from './SuspenseLoader';

const MinistryRoute = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <SuspenseLoader />;
  }

  const isAuthorized = profile?.role === 'ministry' || profile?.role === 'admin';

  if (!isAuthorized) {
    // Redirect them to the home page, or a specific 'unauthorized' page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default MinistryRoute;
