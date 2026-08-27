import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CardSkeleton } from '../common/SkeletonLoader';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
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

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect user to their own role dashboard if trying to access unauthorized route
    const roleRedirect = `/dashboard/${user.role}`;
    return <Navigate to={roleRedirect} replace />;
  }

  return children;
};

export default ProtectedRoute;
