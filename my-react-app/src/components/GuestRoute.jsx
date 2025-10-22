import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/Context';
import { Box, CircularProgress, Typography } from '@mui/material';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useUser();

  console.log('GuestRoute Debug:', { isAuthenticated, loading, user: !!user }); // ← DEBUG

  // אם עדיין טוען - המתן
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="70vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // אם כבר מחובר - העבר לדף המתאים
  if (isAuthenticated && user) {
    console.log('GuestRoute: User already authenticated, redirecting...'); // ← DEBUG
    
    // אם אדמין - העבר לדשבורד אדמין
    if (user.role_id === 1) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    
    // אם משתמש רגיל - העבר לחופשות
    return <Navigate to="/vacations" replace />;
  }

  // אם לא מחובר - הצג את הדף (login/register)
  console.log('GuestRoute: User not authenticated, showing page'); // ← DEBUG
  return children;
};

export default GuestRoute;