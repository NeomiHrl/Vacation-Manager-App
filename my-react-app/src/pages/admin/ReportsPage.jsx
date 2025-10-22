import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Alert,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Fade,
  Slide,
  Zoom,
  Grow
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// תחליפי את הimports - רק מה שקיים!
import { 
  getUsersStats, 
  getVacationStats, 
  getLikesStats,
  getLikesDistribution
} from '../../api/apiAdminStats';
import { getVacations } from '../../api/apiVacations';

import StatCard from '../../components/admin/StatCard';

// Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import PeopleIcon from '@mui/icons-material/People';
import FlightIcon from '@mui/icons-material/Flight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import RecommendIcon from '@mui/icons-material/Recommend';
import SpeedIcon from '@mui/icons-material/Speed';
import TargetIcon from '@mui/icons-material/GpsFixed';

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

const shimmerAnimation = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ReportsPage = () => {
  const navigate = useNavigate();
  const [allStats, setAllStats] = useState({
    users: null,
    vacations: null,
    likes: null,
    likesDistribution: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportDate] = useState(new Date());

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 ReportsPage: Fetching all admin stats...');
      
      const [usersStats, vacationStats, likesStats, likesDistribution, actualVacations] = await Promise.all([
        getUsersStats(),
        getVacationStats(),
        getLikesStats(),
        getLikesDistribution(),
        getVacations()
      ]);
      
      console.log('📊 ReportsPage: All stats received:', {
        usersStats,
        vacationStats,
        likesStats,
        likesDistribution,
        actualVacations: actualVacations?.length || 0
      });
      
      setAllStats({
        users: usersStats,
        vacations: {
          ...vacationStats,
          actual_count: actualVacations?.length || 0
        },
        likes: likesStats,
        likesDistribution: likesDistribution
      });
      
    } catch (err) {
      console.error('❌ ReportsPage: Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    // הוסף לוגים לראות מה בעצם מגיע!
    console.log('🔍 calculateMetrics: allStats =', allStats);
    console.log('🔍 vacations data =', allStats.vacations);
    console.log('🔍 users data =', allStats.users);
    console.log('🔍 likes data =', allStats.likes);

    if (!allStats.users || !allStats.vacations || !allStats.likes) {
      return {
        totalUsers: 0,
        totalVacations: 0,
        totalLikes: 0,
        avgLikesPerUser: 0,
        avgLikesPerVacation: 0,
        engagementRate: 0,
        topDestination: 'N/A',
        systemHealth: 'Loading...'
      };
    }

    // נסה כמה אפשרויות למספר החופשות:
    const totalVacations = 
      allStats.vacations.actual_count ||           // המספר האמיתי מgetVacations!
      allStats.vacations.total_vacations ||        // מהAPI stats
      allStats.vacations.count ||                  // אולי נקרא count
      (allStats.vacations.past_vacations || 0) + (allStats.vacations.on_going_vacations || 0) + (allStats.vacations.future_vacations || 0) ||  // חיבור כל הסטטוסים
      allStats.vacations.length ||                 // אם זה array
      0;

    console.log('🔍 totalVacations calculated =', totalVacations);

    // נסה כמה אפשרויות למספר המשתמשים:
    const totalUsers = 
      allStats.users.total_users ||                // מהAPI stats
      allStats.users.count ||                      // אולי נקרא count
      (allStats.users.admin_users || 0) + (allStats.users.regular_users || 0) ||  // חיבור admin + regular
      allStats.users.length ||                     // אם זה array
      0;

    console.log('🔍 totalUsers calculated =', totalUsers);

    // נסה כמה אפשרויות למספר הלייקים:
    const totalLikes = 
      allStats.likes.total_likes ||                // מהAPI stats
      allStats.likes.count ||                      // אולי נקרא count
      allStats.likes.length ||                     // אם זה array
      0;

    console.log('🔍 totalLikes calculated =', totalLikes);

    const avgLikesPerUser = totalUsers > 0 ? (totalLikes / totalUsers).toFixed(2) : 0;
    const avgLikesPerVacation = totalVacations > 0 ? (totalLikes / totalVacations).toFixed(1) : 0;
    
    // חישוב engagement rate מהנתונים הקיימים
    const engagementRate = totalVacations > 0 ? Math.min(100, (totalLikes / totalVacations) * 10).toFixed(1) : 0;
    
    // מציאת היעד הפופולרי ביותר מהstats
    const topDestination = 
      allStats.vacations.most_popular?.name || 
      allStats.vacations.most_liked?.name || 
      allStats.likes.most_liked_vacation?.name || 
      allStats.vacations.most_expensive?.name ||  // אולי יש most_expensive
      allStats.vacations.cheapest?.name ||        // אולי יש cheapest
      'N/A';

    const systemHealth = parseFloat(engagementRate) > 70 ? 'Excellent' : 
                        parseFloat(engagementRate) > 50 ? 'Good' : 
                        parseFloat(engagementRate) > 30 ? 'Fair' : 'Needs Attention';

    console.log('🔍 Final metrics =', {
      totalUsers,
      totalVacations,
      totalLikes,
      avgLikesPerUser,
      avgLikesPerVacation,
      engagementRate,
      topDestination,
      systemHealth
    });

    return {
      totalUsers,
      totalVacations,
      totalLikes,
      avgLikesPerUser,
      avgLikesPerVacation,
      engagementRate,
      topDestination,
      systemHealth
    };
  };

  const metrics = calculateMetrics();

  const generateInsights = () => {
    const insights = [];
    
    if (parseFloat(metrics.engagementRate) > 70) {
      insights.push({
        type: 'success',
        icon: <CheckCircleIcon />,
        title: 'High User Engagement',
        description: `Strong platform engagement with ${metrics.totalLikes} total likes across ${metrics.totalVacations} vacations.`
      });
    } else if (parseFloat(metrics.engagementRate) < 40) {
      insights.push({
        type: 'warning',
        icon: <WarningIcon />,
        title: 'Low Engagement Alert',
        description: `Consider promotional campaigns to increase user interaction. Current engagement needs improvement.`
      });
    }

    if (metrics.totalVacations > 0 && metrics.totalUsers > 0) {
      insights.push({
        type: 'info',
        icon: <InfoIcon />,
        title: 'Active Platform',
        description: `${metrics.totalVacations} vacation packages available with ${metrics.totalUsers} registered users.`
      });
    }

    if (parseFloat(metrics.avgLikesPerUser) > 1) {
      insights.push({
        type: 'success',
        icon: <TrendingUpIcon />,
        title: 'Strong User Interest',
        description: `Average ${metrics.avgLikesPerUser} likes per user indicates excellent platform engagement.`
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        icon: <InfoIcon />,
        title: 'System Overview',
        description: 'Platform is operational with basic metrics available for analysis.'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const generateActionItems = () => {
    const actions = [];

    if (parseFloat(metrics.engagementRate) < 50) {
      actions.push('Implement marketing campaigns to boost user engagement');
    }

    if (metrics.totalVacations > metrics.totalUsers) {
      actions.push('Focus on user acquisition to match vacation inventory');
    } else if (metrics.totalUsers > metrics.totalVacations * 2) {
      actions.push('Consider expanding vacation offerings to meet user demand');
    }

    if (parseFloat(metrics.avgLikesPerUser) < 0.5) {
      actions.push('Enhance vacation descriptions and photos to increase user interest');
    }

    if (allStats.likesDistribution) {
      actions.push('Analyze likes distribution patterns for optimization opportunities');
    }

    actions.push('Monitor user feedback for platform improvements');
    actions.push('Review top-performing destinations for expansion strategies');

    return actions;
  };

  const actionItems = generateActionItems();

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const reportData = {
      date: reportDate.toISOString(),
      metrics,
      stats: allStats,
      insights,
      actionItems
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-report-${reportDate.toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} sx={{ 
            animation: `${rotateAnimation} 2s linear infinite`
          }} />
          <Typography variant="h6" sx={{ 
            ml: 2,
            animation: `${shimmerAnimation} 2s infinite linear`
          }}>
            Generating comprehensive report...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Slide direction="down" in timeout={1000}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Error loading comprehensive report</Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        </Slide>
        <Zoom in timeout={1500}>
          <Button variant="contained" onClick={fetchAllStats} startIcon={<RefreshIcon />}>
            Retry
          </Button>
        </Zoom>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header עם אנימציות */}
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h3" component="h1" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${slideInAnimation} 1s ease-out`
                }}>
                  Executive Report 📊
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{
                  animation: `${slideInAnimation} 1.2s ease-out`
                }}>
                  Comprehensive system analysis and insights
                </Typography>
              </Box>
              
              <Slide direction="left" in={!loading} timeout={1200}>
                <Box display="flex" gap={1}>
                  <Tooltip title="Print Report">
                    <IconButton 
                      onClick={handlePrint} 
                      color="primary"
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.2) rotate(10deg)',
                          animation: `${pulseAnimation} 0.5s ease`
                        }
                      }}
                    >
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export Report">
                    <IconButton 
                      onClick={handleExport} 
                      color="primary"
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.2) rotate(-10deg)',
                          animation: `${pulseAnimation} 0.5s ease`
                        }
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    onClick={fetchAllStats}
                    startIcon={<RefreshIcon />}
                    disabled={loading}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 8
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Slide>
            </Box>
          </Slide>
          
          <Grow in={!loading} timeout={1500}>
            <Chip 
              label={`Generated on ${reportDate.toLocaleDateString()} at ${reportDate.toLocaleTimeString()}`}
              color="primary"
              variant="outlined"
              sx={{
                animation: `${pulseAnimation} 3s ease infinite`,
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            />
          </Grow>
        </Box>
      </Fade>

      {/* Executive Summary עם אנימציות */}
      <Zoom in={!loading} timeout={1000}>
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 8,
            transform: 'translateY(-2px)'
          }
        }}>
          <Slide direction="right" in={!loading} timeout={1200}>
            <Typography variant="h5" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              <AssessmentIcon color="primary" sx={{ 
                animation: `${floatAnimation} 3s ease-in-out infinite`
              }} />
              Executive Summary
            </Typography>
          </Slide>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {[
              {
                title: "Total Users",
                value: metrics.totalUsers,
                icon: <PeopleIcon />,
                color: "primary",
                description: "Registered users",
                delay: 200
              },
              {
                title: "Total Vacations",
                value: metrics.totalVacations,
                icon: <FlightIcon />,
                color: "success",
                description: "All vacation packages",
                delay: 400
              },
              {
                title: "Total Likes",
                value: metrics.totalLikes,
                icon: <FavoriteIcon />,
                color: "secondary",
                description: "User engagement",
                delay: 600
              },
              {
                title: "System Health",
                value: metrics.systemHealth,
                icon: <SpeedIcon />,
                color: metrics.systemHealth === 'Excellent' ? 'success' :
                       metrics.systemHealth === 'Good' ? 'info' :
                       metrics.systemHealth === 'Fair' ? 'warning' : 'error',
                description: "Overall platform status",
                delay: 800
              }
            ].map((card, index) => (
              <Grid item xs={12} md={3} key={card.title}>
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
        </Paper>
      </Zoom>

      {/* Key Performance Indicators עם אנימציות */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Grow in={!loading} timeout={1500} style={{ transitionDelay: '1000ms' }}>
            <Paper sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              border: '2px solid #90caf9',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(33, 150, 243, 0.3)',
                border: '2px solid #2196f3'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main'
              }}>
                <TargetIcon sx={{ animation: `${pulseAnimation} 2s ease infinite` }} />
                Key Performance Indicators
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                {[
                  {
                    value: metrics.avgLikesPerUser,
                    label: "Avg Likes per User",
                    color: "primary",
                    delay: 1200
                  },
                  {
                    value: metrics.avgLikesPerVacation,
                    label: "Avg Likes per Vacation",
                    color: "secondary",
                    delay: 1400
                  },
                  {
                    value: `${metrics.engagementRate}%`,
                    label: "Engagement Rate",
                    color: "success",
                    delay: 1600
                  },
                  {
                    value: allStats.likesDistribution ? '✓' : '—',
                    label: "Distribution Data",
                    color: "warning",
                    delay: 1800
                  }
                ].map((item, index) => (
                  <Grid item xs={6} key={item.label}>
                    <Fade in={!loading} timeout={1000} style={{ transitionDelay: `${item.delay}ms` }}>
                      <Card 
                        variant="outlined"
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05) rotate(1deg)',
                            boxShadow: 4,
                            backgroundColor: `${item.color}.light`,
                            color: 'white'
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              color: `${item.color}.main`,
                              fontWeight: 'bold',
                              animation: `${countUpAnimation} 1s ease-out`,
                              animationDelay: `${item.delay + 200}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            {item.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grow>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grow in={!loading} timeout={1500} style={{ transitionDelay: '1200ms' }}>
            <Paper sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
              border: '2px solid #ffb74d',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(255, 152, 0, 0.3)',
                border: '2px solid #ff9800'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'warning.dark'
              }}>
                <StarIcon sx={{ animation: `${pulseAnimation} 2s ease infinite` }} />
                Top Performers
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Fade in={!loading} timeout={1000} style={{ transitionDelay: '1400ms' }}>
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Most Popular Destination
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(10px)'
                    }
                  }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.2) rotate(360deg)'
                      }
                    }}>
                      <FlightIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {metrics.topDestination}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Leading in user engagement
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Fade>

              <Fade in={!loading} timeout={1000} style={{ transitionDelay: '1600ms' }}>
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Platform Overview
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    flexWrap: 'wrap'
                  }}>
                    {[
                      {
                        label: `${metrics.totalUsers} Users`,
                        color: "primary",
                        delay: 1800
                      },
                      {
                        label: `${metrics.totalVacations} Vacations`,
                        color: "success",
                        delay: 2000
                      },
                      {
                        label: `${metrics.totalLikes} Likes`,
                        color: "secondary",
                        delay: 2200
                      }
                    ].map((chip, index) => (
                      <Zoom key={chip.label} in={!loading} timeout={500} style={{ transitionDelay: `${chip.delay}ms` }}>
                        <Chip 
                          label={chip.label}
                          color={chip.color}
                          size="small"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              boxShadow: 4
                            }
                          }}
                        />
                      </Zoom>
                    ))}
                  </Box>
                </Box>
              </Fade>

              <Fade in={!loading} timeout={1000} style={{ transitionDelay: '1800ms' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Platform Engagement
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={parseFloat(metrics.engagementRate) || 0}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4, 
                      mb: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        height: 12
                      }
                    }}
                    color={
                      parseFloat(metrics.engagementRate) > 70 ? 'success' :
                      parseFloat(metrics.engagementRate) > 50 ? 'info' :
                      parseFloat(metrics.engagementRate) > 30 ? 'warning' : 'error'
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    {metrics.engagementRate}% engagement rate
                  </Typography>
                </Box>
              </Fade>
            </Paper>
          </Grow>
        </Grid>
      </Grid>

      {/* Insights and Recommendations עם אנימציות */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Grow in={!loading} timeout={1500} style={{ transitionDelay: '2000ms' }}>
            <Paper sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
              border: '2px solid #a5d6a7',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(76, 175, 80, 0.3)',
                border: '2px solid #4caf50'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'success.dark'
              }}>
                <TrendingUpIcon sx={{ animation: `${pulseAnimation} 2s ease infinite` }} />
                System Insights
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List>
                {insights.map((insight, index) => (
                  <Fade key={index} in={!loading} timeout={1000} style={{ transitionDelay: `${2200 + index * 200}ms` }}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{
                        transition: 'all 0.3s ease',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          transform: 'translateX(10px)'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: `${insight.type}.main`,
                            width: 32,
                            height: 32,
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.2) rotate(360deg)'
                            }
                          }}
                        >
                          {insight.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={insight.title}
                        secondary={insight.description}
                      />
                    </ListItem>
                  </Fade>
                ))}
              </List>
            </Paper>
          </Grow>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grow in={!loading} timeout={1500} style={{ transitionDelay: '2200ms' }}>
            <Paper sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
              border: '2px solid #f48fb1',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(233, 30, 99, 0.3)',
                border: '2px solid #e91e63'
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'secondary.dark'
              }}>
                <RecommendIcon sx={{ animation: `${pulseAnimation} 2s ease infinite` }} />
                Recommended Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List>
                {actionItems.map((action, index) => (
                  <Fade key={index} in={!loading} timeout={1000} style={{ transitionDelay: `${2400 + index * 150}ms` }}>
                    <ListItem
                      sx={{
                        transition: 'all 0.3s ease',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(233, 30, 99, 0.1)',
                          transform: 'translateX(10px)'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <CheckCircleIcon 
                          color="primary" 
                          sx={{
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.2)'
                            }
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={action} />
                    </ListItem>
                  </Fade>
                ))}
              </List>
            </Paper>
          </Grow>
        </Grid>
      </Grid>

      {/* Quick Navigation עם אנימציות */}
      <Zoom in={!loading} timeout={1500} style={{ transitionDelay: '3000ms' }}>
        <Paper sx={{ 
          p: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 8,
            transform: 'translateY(-2px)'
          }
        }}>
          <Typography variant="h5" gutterBottom sx={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Detailed Reports
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Access specific analytics for deeper insights
          </Typography>
          
          <Grid container spacing={2}>
            {[
              {
                label: "User Analytics", 
                icon: <PeopleIcon />, 
                path: "/admin/user-stats", 
                delay: 3200,
                color: "primary"
              },
              { 
                label: "Vacation Reports", 
                icon: <FlightIcon />, 
                path: "/admin/vacation-stats", 
                delay: 3400,
                color: "success"
              },
              { 
                label: "Engagement Analysis", 
                icon: <FavoriteIcon />, 
                path: "/admin/likes-stats", 
                delay: 3600,
                color: "secondary"
              }
            ].map((button, index) => (
              <Grid item xs={12} sm={4} key={button.label}>
                <Slide direction="up" in={!loading} timeout={1000} style={{ transitionDelay: `${button.delay}ms` }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={button.icon}
                    onClick={() => navigate(button.path)}
                    sx={{
                      height: 60,
                      transition: 'all 0.3s ease',
                      borderColor: `${button.color}.main`,
                      color: `${button.color}.main`,
                      '&:hover': {
                        transform: 'scale(1.05) translateY(-5px)',
                        boxShadow: 8,
                        backgroundColor: `${button.color}.main`,
                        color: 'white',
                        '& .MuiSvgIcon-root': {
                          animation: `${rotateAnimation} 0.5s ease`
                        }
                      }
                    }}
                  >
                    {button.label}
                  </Button>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Zoom>
    </Container>
  );
};

export default ReportsPage;