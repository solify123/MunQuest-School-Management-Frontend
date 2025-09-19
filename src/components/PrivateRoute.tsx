import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if user is authenticated by looking for token in localStorage
  const token = localStorage.getItem('token');
  console.log('PrivateRoute - Token in localStorage:', token);
  
  // If no token, redirect to login with the current location as state
  if (!token) {
    console.log('PrivateRoute - No token found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the protected component
  return <>{children}</>;
};

export default PrivateRoute;
