import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Protected({ children }) {
  const token = localStorage.getItem('complaint_token');

  // If no auth token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
