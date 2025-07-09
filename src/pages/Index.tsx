
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTypedSelector } from '../hooks/useTypedSelector';
import Home from './Home';

const Index = () => {
  const { isAuthenticated } = useTypedSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Home />;
};

export default Index;
