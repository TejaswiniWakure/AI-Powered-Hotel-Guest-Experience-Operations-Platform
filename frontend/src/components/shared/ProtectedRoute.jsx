import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-accent rounded-full animate-spin" />
          <p className="text-text-muted text-sm font-medium">Loading StayFlow...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !localStorage.getItem('stayflow_token')) {
    if (location.pathname.startsWith('/guest')) {
      return <Navigate to="/guest-access" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role doesn't match allowed roles, redirect to appropriate role home
  const currentRole = role || user?.role || localStorage.getItem('stayflow_role');

  if (allowedRoles.length > 0 && currentRole && !allowedRoles.includes(currentRole)) {
    const roleRedirectMap = {
      admin: '/admin',
      manager: '/manager',
      staff: '/staff',
      guest: '/guest'
    };
    return <Navigate to={roleRedirectMap[currentRole] || '/'} replace />;
  }

  return children;
}
