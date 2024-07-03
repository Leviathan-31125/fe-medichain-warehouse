import React from 'react'
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({children}) => {
  const isLoggedIn = localStorage.getItem('accessToken');
  return isLoggedIn ? <Navigate to="/dashboard" replace={true} /> : children;
}

export const PrivateRoute = ({children}) => {
  // const isLoggedIn = localStorage.getItem('accessToken');
  // return isLoggedIn ? children : <Navigate to="/" replace={true} />;
  return children;
}
