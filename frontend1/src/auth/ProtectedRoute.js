import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    // User not authenticated or not in allowed roles, redirect to login
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute