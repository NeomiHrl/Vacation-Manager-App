import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Container,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import FlightIcon from '@mui/icons-material/Flight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InfoIcon from '@mui/icons-material/Info';
import LaunchIcon from '@mui/icons-material/Launch';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';

import { 
  getUsersStats, 
  getVacationStats, 
  getLikesStats,
  getLikesDistribution
} from '../api/apiAdminStats';
import StatCard from '../components/admin/StatCard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    // Users
    totalUsers: 0,
    // Vacations
    totalVacations: 0,
    pastVacations: 0,
    onGoingVacations: 0,
    futureVacations: 0,
    // Likes
    totalLikes: 0,
    // Distribution
    likesDistribution: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 AdminDashboard: Fetching all admin data...');
        
        const [usersStats, vacationsStats, likesStats, likesDistribution] = await Promise.all([
          getUsersStats(),      
          getVacationStats(),    
          getLikesStats(),       
          getLikesDistribution() 
       ]);
        
        console.log('📊 AdminDashboard stats received:', { 
          usersStats, 
          vacationsStats, 
          likesStats, 
          likesDistribution 
        });
        
        setStats({
          // Users data
          totalUsers: usersStats.total_users || 0,
          
          // Vacation data - מה שהשרת בעצם מחזיר
          pastVacations: vacationsStats.past_vacations || 0,
          onGoingVacations: vacationsStats.on_going_vacations || 0,
          futureVacations: vacationsStats.future_vacations || 0,
          totalVacations: (vacationsStats.past_vacations || 0) + 
                         (vacationsStats.on_going_vacations || 0) + 
                         (vacationsStats.future_vacations || 0),
          
          // Likes data
          totalLikes: likesStats.total_likes || 0,
          
          // Distribution data
          likesDistribution: likesDistribution || []
        });
        
      } catch (error) {
        console.error('❌ AdminDashboard error:', error);
        setError('Failed to load dashboard data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // חישוב היעד הפופולרי ביותר
  const mostPopularDestination = stats.likesDistribution.length > 0 
    ? stats.likesDistribution.reduce((max, current) => 
        current.likes > max.likes ? current : max, stats.likesDistribution[0]
      )
    : null;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading admin dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section - נשאר זהה */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 56, height: 56 }}>
                  <DashboardIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Vacation Management System
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Administrative Control Center
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.6, opacity: 0.95 }}>
                Welcome to our advanced vacation management system! 🌴
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, opacity: 0.9 }}>
                💼 <strong>Comprehensive Vacation Management:</strong> Advanced platform enabling complete management of vacation packages, 
                users and detailed real-time analytics.
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, opacity: 0.9 }}>
                📊 <strong>Advanced Data Analysis:</strong> Gain deep insights into user behavior, 
                destination popularity and critical performance metrics for smart business decisions.
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, opacity: 0.9 }}>
                🎯 <strong>Advanced Admin Interface:</strong> Professional tools for content management, user activity tracking 
                and generating detailed reports for deep system understanding.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label="Real-time Analytics" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  icon={<AnalyticsIcon sx={{ color: 'white !important' }} />}
                />
                <Chip 
                  label="User Management" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  icon={<PeopleIcon sx={{ color: 'white !important' }} />}
                />
                <Chip 
                  label="Vacation Control" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  icon={<TravelExploreIcon sx={{ color: 'white !important' }} />}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 200, 
                    height: 200, 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 80, opacity: 0.8 }} />
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Advanced Management System
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Complete oversight of all platform aspects
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Background decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            zIndex: 1
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            bgcolor: 'rgba(255,255,255,0.03)',
            borderRadius: '50%',
            zIndex: 1
          }} 
        />
      </Paper>

      {/* Quick Stats Overview - עם הנתונים הנכונים! */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <BarChartIcon color="primary" />
          System Overview
        </Typography>
        
        <Grid container spacing={3}>
          {/* Users Card */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<PeopleIcon />}
              color="primary"
              description="Registered users in system"
              loading={loading}
              clickable={true}
              onClick={() => navigate('/admin/user-stats')}
            />
          </Grid>
          
          {/* Total Vacations Card */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Vacations"
              value={stats.totalVacations}
              icon={<FlightIcon />}
              color="success"
              description="All vacation packages"
              loading={loading}
              clickable={true}
              onClick={() => navigate('/admin/vacation-stats')}
            />
          </Grid>
          
          {/* Total Likes Card */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Likes"
              value={stats.totalLikes}
              icon={<FavoriteIcon />}
              color="error"
              description="User interactions"
              loading={loading}
              clickable={true}
              onClick={() => navigate('/admin/likes-stats')}
            />
          </Grid>

          {/* Most Popular Destination */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Most Popular"
              value={mostPopularDestination?.destination || 'N/A'}
              icon={<TrendingUpIcon />}
              color="warning"
              description={`${mostPopularDestination?.likes || 0} likes`}
              loading={loading}
              clickable={true}
              onClick={() => navigate('/admin/likes-stats')}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Vacation Status Breakdown */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Vacation Status Breakdown
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', color: 'white' }}>
              <Avatar sx={{ bgcolor: 'error.dark', mx: 'auto', mb: 2 }}>
                <HistoryIcon />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">
                {stats.pastVacations}
              </Typography>
              <Typography variant="h6">Past Vacations</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Completed packages
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', color: 'white' }}>
              <Avatar sx={{ bgcolor: 'success.dark', mx: 'auto', mb: 2 }}>
                <EventIcon />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">
                {stats.onGoingVacations}
              </Typography>
              <Typography variant="h6">Ongoing Vacations</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Currently active
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', color: 'white' }}>
              <Avatar sx={{ bgcolor: 'info.dark', mx: 'auto', mb: 2 }}>
                <ScheduleIcon />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">
                {stats.futureVacations}
              </Typography>
              <Typography variant="h6">Future Vacations</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Upcoming packages
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Management Tools - עם קישורים לדפים הקיימים */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Detailed Analytics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                p: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/admin/user-stats')}
            >
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <PeopleIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>User Analytics</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View user statistics and detailed user management
              </Typography>
              <Button 
                variant="contained" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/user-stats');
                }}
                startIcon={<BarChartIcon />}
                fullWidth
              >
                View Analytics
              </Button>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                p: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/admin/vacation-stats')}
            >
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <FlightIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>Vacation Analytics</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Complete vacation statistics and management
              </Typography>
              <Button 
                variant="contained" 
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/vacation-stats');
                }}
                startIcon={<AssessmentIcon />}
                fullWidth
              >
                View Statistics
              </Button>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                p: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/admin/likes-stats')}
            >
              <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <FavoriteIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>Likes Analytics</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Detailed likes distribution and analytics
              </Typography>
              <Button 
                variant="contained" 
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/likes-stats');
                }}
                startIcon={<TrendingUpIcon />}
                fullWidth
              >
                View Analytics
              </Button>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                p: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/admin/reports')}
            >
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <AssessmentIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>Advanced Reports</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Comprehensive reports and data analysis
              </Typography>
              <Button 
                variant="contained" 
                color="warning"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/reports');
                }}
                startIcon={<BarChartIcon />}
                fullWidth
              >
                Generate Report
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* About Section - נשאר זהה */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h6" gutterBottom color="text.secondary">
          Want to learn more about the system and developers?
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/admin/about')}
          startIcon={<InfoIcon />}
          endIcon={<LaunchIcon />}
          sx={{ mt: 2 }}
        >
          About System & Developers
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;