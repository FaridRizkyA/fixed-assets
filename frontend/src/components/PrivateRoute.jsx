import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './layout/Layout';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? <Layout>{children}</Layout> : <Navigate to="/" />;
}

export default PrivateRoute;