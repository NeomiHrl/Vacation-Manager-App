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
  keyframes,
  Fade,
  Slide,
  Zoom,
  Grow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlightIcon from '@mui/icons-material/Flight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PublicIcon from '@mui/icons-material/Public';

import { getVacationStats } from '../../api/apiAdminStats'; // סטטיסטיקות
import { getVacations } from '../../api/apiVacations'; // רשימת חופשות מלאה
import { getLikesCount } from '../../api/apiLikes'; // ← API לייקים!
import StatCard from '../../components/admin/StatCard';

// הוסיפי אנימציות CSS:
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

const VacationStats = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalVacations: 0,
    pastVacations: 0,
    onGoingVacations: 0,
    futureVacations: 0,
    avgPrice: 0,
    totalLikes: 0,
    mostExpensive: null,
    cheapest: null,
    mostLiked: null
  });
  const [vacations, setVacations] = useState([]);

  useEffect(() => {
    fetchVacationStats();
  }, []);

  const fetchVacationStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Fetching vacation stats...');
      
      // קודם מביא סטטיסטיקות + רשימת חופשות
      const [statsData, vacationsData] = await Promise.all([
        getVacationStats(),  // { "past_vacations": 12, "on_going_vacations": 7, "future_vacations": 15 }
        getVacations()       // רשימת חופשות מלאה
      ]);
      
      console.log('📊 Initial data received:', { statsData, vacationsData });
      
      const vacationsList = vacationsData || [];
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      let pastCount = 0;
      let ongoingCount = 0;
      let futureCount = 0;
      
      // עכשיו מביא לייקים לכל חופשה בנפרד!
      const vacationsWithLikes = await Promise.all(
        vacationsList.map(async (vacation) => {
          try {
            // שליחת vacation_id ל-getLikesCount!
            const likesResponse = await getLikesCount(vacation.vacation_id);
            console.log(`📊 Likes response for vacation ${vacation.vacation_id}:`, likesResponse);
            
            // טיפול בתגובה - יכול להיות מספר או אובייקט
            let likesCount = 0;
            if (typeof likesResponse === 'number') {
              likesCount = likesResponse;
            } else if (typeof likesResponse === 'object' && likesResponse !== null) {
              // אם זה אובייקט, נסה לחלץ את המספר
              likesCount = likesResponse.likes_count || 
                          likesResponse.count || 
                          likesResponse.total || 
                          likesResponse.length || 
                          0;
            }
            
            console.log(`📊 Processed likes count for vacation ${vacation.vacation_id}:`, likesCount);
            
            const start = new Date(vacation.start_date);
            start.setHours(0, 0, 0, 0);
            
            const end = new Date(vacation.finish_day);
            end.setHours(23, 59, 59, 999);
            
            // ספירת סטטוס
            if (now < start) {
              futureCount++;
            } else if (now > end) {
              pastCount++;
            } else {
              ongoingCount++;
            }
            
            // החזרת החופשה עם מספר הלייקים המעודכן
            return {
              ...vacation,
              current_likes: likesCount // ← וודא שזה מספר!
            };
            
          } catch (error) {
            console.error(`❌ Error getting likes for vacation ${vacation.vacation_id}:`, error);
            // אם יש שגיאה, מחזיר 0 לייקים
            return {
              ...vacation,
              current_likes: 0
            };
          }
        })
      );
      
      console.log('📊 Calculated counts:', { pastCount, ongoingCount, futureCount });
      console.log('📊 Vacations with likes:', vacationsWithLikes);
      
      // חישוב סך הלייקים
      const totalCurrentLikes = vacationsWithLikes.reduce((sum, vacation) => {
        const likes = Number(vacation.current_likes) || 0; // ← וודא שזה מספר!
        return sum + likes;
      }, 0);
      
      // חישוב ממוצע מחיר
      const avgPrice =
        vacationsWithLikes.length > 0
          ? (
              vacationsWithLikes.reduce((sum, v) => sum + (Number(v.price) || 0), 0) /
              vacationsWithLikes.length
            ).toFixed(2)
          : 0;
      
      // עדכן סטטיסטיקות
      setStats({
        pastVacations: pastCount,
        onGoingVacations: ongoingCount,
        futureVacations: futureCount,
        totalVacations: vacationsList.length,
        avgPrice: avgPrice, // ← כאן הממוצע שחישבת
        totalLikes: totalCurrentLikes,
        mostExpensive: statsData.most_expensive || null,
        cheapest: statsData.cheapest || null,
        mostLiked: statsData.most_liked || null
      });
      
      // עדכן רשימת חופשות עם לייקים מעודכנים!
      setVacations(vacationsWithLikes);
      
    } catch (err) {
      console.error('❌ VacationStats error:', err);
      setError('Failed to load vacation statistics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // תיקון פונקציית getVacationStatus:
  const getVacationStatus = (startDate, finishDay) => { // ← שם פרמטר מעודכן
    const now = new Date();
    now.setHours(0, 0, 0, 0); // איפוס השעות להשוואה נקייה
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(finishDay); // ← שימוש ב-finishDay
    end.setHours(23, 59, 59, 999); // סוף היום
    
    console.log('📅 Date comparison:', {
      now: now.toDateString(),
      start: start.toDateString(),
      end: end.toDateString(),
      nowTime: now.getTime(),
      startTime: start.getTime(),
      endTime: end.getTime()
    });
    
    // בדיקה מדויקת
    if (now < start) {
      return { 
        status: 'Future', 
        color: 'info', 
        icon: <ScheduleIcon />,
        description: 'Starting soon'
      };
    }
    
    if (now > end) {
      return { 
        status: 'Past', 
        color: 'error', 
        icon: <HistoryIcon />,
        description: 'Completed'
      };
    }
    
    return { 
      status: 'Ongoing', 
      color: 'success', 
      icon: <EventIcon />,
      description: 'Active now'
    };
  };

  const getDaysUntilStart = (startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = start - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysRemaining = (finishDay) => { // ← finishDay במקום endDate
    const now = new Date();
    const end = new Date(finishDay); // ← finishDay
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading vacation statistics...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error loading vacation statistics</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        <Button variant="contained" onClick={fetchVacationStats} startIcon={<RefreshIcon />}>
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
              Vacation Statistics ✈️
            </Typography>
          </Slide>
          
          <Slide direction="up" in={!loading} timeout={1200}>
            <Typography variant="h6" color="text.secondary" sx={{
              animation: `${slideInAnimation} 1.2s ease-out`
            }}>
              Complete vacation analytics and management
            </Typography>
          </Slide>
        </Box>
      </Fade>

      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            title: "Total Vacations", 
            value: stats.totalVacations, 
            icon: <FlightIcon />, 
            color: "primary", 
            description: "All vacation packages",
            delay: 200
          },
          { 
            title: "Total Likes", 
            value: stats.totalLikes, 
            icon: <FavoriteIcon />, 
            color: "error", 
            description: "All vacation likes",
            delay: 400
          },
          { 
            title: "Average Price", 
            value: stats.avgPrice ? `$${stats.avgPrice}` : "N/A", 
            icon: <AttachMoneyIcon />, 
            color: "success", 
            description: "Per vacation",
            delay: 600
          }
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
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

      {/* Vacation Status Breakdown עם אנימציות */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            count: stats.pastVacations, 
            title: "Past Vacations", 
            description: "Completed packages",
            color: 'error',
            icon: <HistoryIcon />,
            delay: 800
          },
          { 
            count: stats.onGoingVacations, 
            title: "Ongoing Vacations", 
            description: "Currently active",
            color: 'success',
            icon: <EventIcon />,
            delay: 1000
          },
          { 
            count: stats.futureVacations, 
            title: "Future Vacations", 
            description: "Upcoming packages",
            color: 'info',
            icon: <ScheduleIcon />,
            delay: 1200
          }
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={item.title}>
            <Grow in={!loading} timeout={1500} style={{ transitionDelay: `${item.delay}ms` }}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 2, 
                bgcolor: `${item.color}.light`, 
                color: 'white',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05) rotateY(5deg)',
                  boxShadow: 12,
                  animation: `${pulseAnimation} 1s ease infinite`
                }
              }}>
                <Avatar sx={{ 
                  bgcolor: `${item.color}.dark`, 
                  mx: 'auto', 
                  mb: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(360deg)'
                  }
                }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h4" fontWeight="bold" sx={{
                  animation: `${countUpAnimation} 1s ease-out`,
                  animationDelay: `${item.delay + 200}ms`,
                  animationFillMode: 'both'
                }}>
                  {item.count}
                </Typography>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {item.description}
                </Typography>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Vacations Table עם אנימציות */}
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
                All Vacations ({vacations.length}) 🌴
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete list of vacation packages with details
              </Typography>
            </Box>
          </Slide>
          
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {['Image', 'Name', 'Price', 'Dates', 'Status', 'Likes', 'Description', 'Days Info'].map((header, index) => (
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
                {vacations.length > 0 ? (
                  vacations.map((vacation, index) => {
                    const statusInfo = getVacationStatus(vacation.start_date, vacation.finish_day);
                    
                    return (
                      <Fade key={vacation.vacation_id} in={!loading} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
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
                          {/* Image Cell עם אנימציה מתקדמת */}
                          <TableCell>
                            <Box 
                              sx={{ 
                                position: 'relative',
                                '&:hover .vacation-image': {
                                  transform: 'scale(1.2) rotate(5deg)',
                                  transition: 'transform 0.5s ease',
                                  boxShadow: 12
                                },
                                '&:hover .image-overlay': {
                                  opacity: 1
                                }
                              }}
                            >
                              <Avatar 
                                className="vacation-image"
                                src={vacation.image_filename ? `http://localhost:5000/uploads/VacationsImages/${vacation.image_filename}` : undefined}
                                sx={{ 
                                  width: 80, 
                                  height: 80,
                                  borderRadius: 3,
                                  border: '3px solid',
                                  borderColor: 'primary.main',
                                  cursor: 'pointer',
                                  transition: 'all 0.5s ease',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&:hover': {
                                    borderColor: 'secondary.main',
                                  }
                                }}
                                variant="rounded"
                                onClick={() => {
                                  console.log('📸 Show large image:', vacation.image_filename);
                                }}
                              >
                                <PublicIcon sx={{ fontSize: 40 }} />
                              </Avatar>
                              
                              {/* Overlay אפקט */}
                             
                            </Box>
                          </TableCell>

                          {/* Name Cell עם אנימציה */}
                          <TableCell>
                            <Typography variant="body1" sx={{ 
                              fontWeight: 500,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                color: 'primary.main',
                                transform: 'translateX(5px)'
                              }
                            }}>
                              {vacation.name}
                            </Typography>
                          </TableCell>

                          {/* Price Cell עם אנימציה */}
                          <TableCell>
                            <Typography variant="h6" sx={{
                              fontWeight: 'bold',
                              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                animation: `${pulseAnimation} 0.5s ease`
                              }
                            }}>
                              ${vacation.price}
                            </Typography>
                          </TableCell>

                          {/* Dates Cell */}
                          <TableCell>
                            <Typography variant="body2" sx={{
                              transition: 'color 0.3s ease',
                              '&:hover': {
                                color: 'primary.main'
                              }
                            }}>
                              <strong>Start:</strong> {new Date(vacation.start_date).toLocaleDateString()}<br />
                              <strong>End:</strong> {new Date(vacation.finish_day).toLocaleDateString()}
                            </Typography>
                          </TableCell>

                          {/* Status Cell עם אנימציה */}
                          <TableCell>
                            <Chip 
                              label={statusInfo.status}
                              color={statusInfo.color}
                              size="small"
                              icon={statusInfo.icon}
                              sx={{ 
                                minWidth: 80,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  boxShadow: 4
                                }
                              }}
                            />
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                              {statusInfo.description}
                            </Typography>
                          </TableCell>

                          {/* Likes Cell עם אנימציה */}
                          <TableCell>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.15)',
                                '& .likes-icon': {
                                  animation: `${pulseAnimation} 0.5s ease infinite`
                                }
                              }
                            }}>
                              <FavoriteIcon 
                                className="likes-icon"
                                color="error" 
                                fontSize="small" 
                                sx={{
                                  transition: 'transform 0.3s ease'
                                }}
                              />
                              <Typography variant="body2" fontWeight="bold" sx={{
                                background: 'linear-gradient(45deg, #f44336, #e91e63)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}>
                                {vacation.current_likes}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Description Cell */}
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                maxWidth: 200, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap', // ← זה מה שהתכוונת אליו!
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  color: 'primary.main',
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              {vacation.description}
                            </Typography>
                          </TableCell>
                          {/* Days Info Cell עם אנימציה */}
                          <TableCell>
                            <Box sx={{
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)'
                              }
                            }}>
                              {statusInfo.status === 'Future' && (
                                <Typography variant="body2" sx={{
                                  color: 'info.main',
                                  fontWeight: 'bold',
                                  animation: `${slideInAnimation} 0.5s ease`
                                }}>
                                  🚀 Starts in {getDaysUntilStart(vacation.start_date)} days
                                </Typography>
                              )}
                              {statusInfo.status === 'Ongoing' && (
                                <Typography variant="body2" sx={{
                                  color: 'success.main',
                                  fontWeight: 'bold',
                                  animation: `${pulseAnimation} 2s ease infinite`
                                }}>
                                  ⏰ {getDaysRemaining(vacation.finish_day)} days left
                                </Typography>
                              )}
                              {statusInfo.status === 'Past' && (
                                <Typography variant="body2" color="text.secondary">
                                  ✅ Ended {Math.abs(getDaysUntilStart(vacation.finish_day))} days ago
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Fade in timeout={2000}>
                        <Typography color="text.secondary" sx={{
                          fontSize: '1.2rem',
                          animation: `${floatAnimation} 3s ease-in-out infinite`
                        }}>
                          🏖️ No vacations data available yet...
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

export default VacationStats;