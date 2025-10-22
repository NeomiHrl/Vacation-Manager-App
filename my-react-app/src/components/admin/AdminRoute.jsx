import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/Context';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useUser();

  console.log('AdminRoute Debug:', { isAuthenticated, user, loading, roleId: user?.role_id }); // ← DEBUG

  // אם עדיין טוען את נתוני המשתמש - המתן!
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
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Checking permissions...
        </Typography>
      </Box>
    );
  }

  // אם לא מחובר בכלל - העבר ללוגין
  if (!isAuthenticated || !user) {
    console.log('Not authenticated, redirecting to login'); // ← DEBUG
    return <Navigate to="/login" replace />;
  }

  // בדיקה אם המשתמש הוא אדמין
  const isAdmin = user.role_id === 1;
  
  console.log('Admin check:', { isAdmin, role_id: user.role_id }); // ← DEBUG
  
  // אם לא אדמין - הצגת הודעת שגיאה
  if (!isAdmin) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="70vh"
        flexDirection="column"
        gap={3}
        sx={{ p: 4 }}
      >
        <AdminPanelSettingsIcon 
          sx={{ 
            fontSize: 80, 
            color: 'error.main',
            opacity: 0.5 
          }} 
        />
        
        <Alert 
          severity="error" 
          sx={{ 
            maxWidth: 500,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" component="div" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You need administrator privileges to access this page.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Current role: {user?.role_id === 2 ? 'Regular User' : `Role ID: ${user?.role_id}`}
          </Typography>
        </Alert>

        <Typography variant="body2" color="text.secondary">
          If you believe this is an error, please contact your system administrator.
        </Typography>
      </Box>
    );
  }

  // אם הכל בסדר - הצג את הקומפוננט
  console.log('Admin access granted'); // ← DEBUG
  return children;
};

export default AdminRoute;