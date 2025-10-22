import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Container,
  Fade,
  Slide,
  Zoom,
  Grow
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';

import { getUsersStats } from '../../api/apiAdminStats';
import { getUsers } from '../../api/apiUser';
import StatCard from '../../components/admin/StatCard';

// אנימציות יפות
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInAnimation = keyframes`
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const countUpAnimation = keyframes`
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
`;

const UserStats = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentSignups: 0
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 UserStats: Fetching data...');
      
      const [statsData, usersData] = await Promise.all([
        getUsersStats(),
        getUsers()
      ]);
      
      console.log('📊 UserStats data received:', { statsData, usersData });
      
      setStats({
        totalUsers: statsData.total_users || 0,
        adminUsers: statsData.admin_users || 0,
        regularUsers: statsData.regular_users || 0,
        recentSignups: statsData.recent_signups || 0
      });
      
      setUsers(usersData?.users || usersData || []);
      
    } catch (error) {
      console.error('❌ UserStats error:', error);
      setError('Failed to load user data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading user statistics...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error loading user statistics</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        <Button variant="contained" onClick={fetchData} startIcon={<RefreshIcon />}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header עם אנימציה */}
      <Fade in={!loading} timeout={1000}>
        <Box mb={4}>
          <Slide direction="right" in={!loading} timeout={800}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/dashboard')}
              sx={{ 
                mb: 2,
                '&:hover': {
                  transform: 'translateX(-5px)',
                  transition: 'transform 0.3s ease'
                }
              }}
            >
              Back to Dashboard
            </Button>
          </Slide>
          
          <Slide direction="down" in={!loading} timeout={1000}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${slideInAnimation} 1s ease-out`
            }}>
              User Statistics 👥
            </Typography>
          </Slide>
          
          <Slide direction="up" in={!loading} timeout={1200}>
            <Typography variant="h6" color="text.secondary" sx={{
              animation: `${slideInAnimation} 1.2s ease-out`
            }}>
              Complete user analytics and management
            </Typography>
          </Slide>
        </Box>
      </Fade>

      {/* Statistics Cards עם אנימציות */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            title: "Total Users", 
            value: stats.totalUsers, 
            icon: <PeopleIcon />, 
            color: "primary", 
            description: "All registered users",
            delay: 200
          },
          { 
            title: "Admin Users", 
            value: stats.adminUsers, 
            icon: <AdminPanelSettingsIcon />, 
            color: "secondary", 
            description: "System administrators",
            delay: 400
          },
          { 
            title: "Regular Users", 
            value: stats.regularUsers, 
            icon: <PersonIcon />, 
            color: "success", 
            description: "Standard users",
            delay: 600
          }
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Zoom in={!loading} timeout={1000} style={{ transitionDelay: `${card.delay}ms` }}>
              <Box sx={{
                '&:hover': {
                  animation: `${floatAnimation} 2s ease-in-out infinite`,
                }
              }}>
                <StatCard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                  description={card.description}
                  loading={loading}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    }
                  }}
                />
              </Box>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Users Table עם אנימציות */}
      <Fade in={!loading} timeout={2000}>
        <Paper sx={{ 
          width: '100%', 
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 8
          }
        }}>
          <Slide direction="up" in={!loading} timeout={1500}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h5" component="h2" sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                All Users ({users.length}) 👥
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete list of registered users with details
              </Typography>
            </Box>
          </Slide>
          
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {['Avatar', 'Name', 'Email', 'Role', 'Registration Date', 'Status'].map((header, index) => (
                    <Slide key={header} direction="down" in={!loading} timeout={800} style={{ transitionDelay: `${index * 100}ms` }}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {header}
                        </Typography>
                      </TableCell>
                    </Slide>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <Fade key={user.user_id} in={!loading} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                      <TableRow 
                        hover 
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            transform: 'scale(1.01)',
                            boxShadow: 2
                          }
                        }}
                      >
                        <TableCell>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              bgcolor: user.role_id === 1 ? 'secondary.main' : 'primary.main',
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.2) rotate(360deg)'
                              }
                            }}
                          >
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              color: 'primary.main',
                              transform: 'translateX(5px)'
                            }
                          }}>
                            {user.first_name} {user.last_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{
                            transition: 'color 0.3s ease',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}>
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role_id === 1 ? 'Admin' : 'User'} 
                            color={user.role_id === 1 ? 'secondary' : 'primary'}
                            size="small"
                            icon={user.role_id === 1 ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: 4
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{
                            transition: 'color 0.3s ease',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}>
                            {user.registration_date ? 
                              new Date(user.registration_date).toLocaleDateString() : 
                              'N/A'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Active" 
                            color="success"
                            size="small"
                            variant="outlined"
                            sx={{
                              transition: 'all 0.3s ease',
                              animation: `${pulseAnimation} 2s ease infinite`,
                              '&:hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Fade in timeout={2000}>
                        <Typography color="text.secondary" sx={{
                          fontSize: '1.2rem',
                          animation: `${floatAnimation} 3s ease-in-out infinite`
                        }}>
                          👥 No users data available yet...
                        </Typography>
                      </Fade>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Fade>
    </Container>
  );
};

export default UserStats;