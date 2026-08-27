import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CardSkeleton } from '../common/SkeletonLoader';

const GuestRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return children;
};

export default GuestRoute;
