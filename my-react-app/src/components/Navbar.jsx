import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/Context';
import InfoIcon from '@mui/icons-material/Info';
import FlightIcon from '@mui/icons-material/Flight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, userFullName, userInitials } = useUser();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#000000';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const isAdmin = user?.role_id === 1 || user?.role === 'Admin';

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            {/* Left side - Navigation Links */}
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/about"
                startIcon={<InfoIcon />}
              >
                About
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/vacations"
                startIcon={<FlightIcon />}
              >
                Vacations
              </Button>
              
              {/* כפתור סטטיסטיקות - רק לאדמין */}
              {isAuthenticated && isAdmin && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/admin/dashboard"
                  startIcon={<BarChartIcon />}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  Statistics
                </Button>
              )}
            </Box>

            {/* Right side - Auth Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              
              {isAuthenticated ? (
                <>
                  {/* הצגת תג אדמין */}
                  {isAdmin && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      backgroundColor: 'secondary.main',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      mr: 1
                    }}>
                      <AdminPanelSettingsIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        ADMIN
                      </Typography>
                    </Box>
                  )}

                  {/* User Menu */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="inherit" sx={{ mr: 1 }}>
                      Welcome, {userFullName}
                    </Typography>
                    <IconButton
                      onClick={handleMenuOpen}
                      color="inherit"
                      sx={{ p: 0.5 }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: isAdmin ? 'secondary.main' : 'primary.light',
                          fontSize: '0.875rem'
                        }}
                      >
                        {userInitials}
                      </Avatar>
                    </IconButton>
                  </Box>
                  
                  {/* User Dropdown Menu */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/profile");
                      }}
                    >
                      <AccountCircleIcon sx={{ mr: 1 }} />
                      Profile
                    </MenuItem>
                    
                    {isAdmin && (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/admin/dashboard");
                        }}
                      >
                        <BarChartIcon sx={{ mr: 1 }} />
                        Admin Dashboard
                      </MenuItem>
                    )}
                    
                    <MenuItem onClick={handleLogoutClick}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>

                </>
              ) : (
                <>
                  {/* Login Button */}
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={handleLoginClick}
                    sx={{ 
                      borderColor: 'white', 
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Login
                  </Button>
                  
                  {/* Register Button */}
                  <Button
                    color="primary"
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{ 
                      backgroundColor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}

              {/* Theme Toggle Switch - עוד יותר ימינה! */}
              <Box sx={{ 
                ml: 4, // ← הגדלתי מ-2 ל-4 למרווח גדול יותר
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                padding: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                width: '50px',
                height: '26px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={toggleTheme}
              >
                {/* Background של המתג */}
                <Box sx={{
                  position: 'absolute',
                  top: '2px',
                  left: isDarkMode ? '26px' : '2px',
                  width: '22px',
                  height: '22px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {/* האייקון בתוך הכדור */}
                  {isDarkMode ? (
                    <Brightness4Icon sx={{ fontSize: 14, color: '#1976d2' }} />
                  ) : (
                    <Brightness7Icon sx={{ fontSize: 14, color: '#ffb300' }} />
                  )}
                </Box>
                
                {/* טקסט קטן */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    position: 'absolute',
                    right: isDarkMode ? '6px' : 'auto',
                    left: isDarkMode ? 'auto' : '6px',
                    fontSize: '8px',
                    color: 'white',
                    fontWeight: 'bold',
                    opacity: 0.8
                  }}
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </Typography>
              </Box>

            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout? You will need to login again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleLogoutCancel} 
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogoutConfirm} 
            color="error"
            variant="contained"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavBar;