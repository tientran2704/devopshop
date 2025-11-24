import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api/services';

function PrivateRoute({ children, adminOnly = false }) {
  const user = authService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !authService.isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return children;
}

export default PrivateRoute;
