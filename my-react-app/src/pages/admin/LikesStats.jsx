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
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { getLikesStats } from '../../api/apiAdminStats';
import { getLikesCount } from '../../api/apiLikes';
import { getVacations } from '../../api/apiVacations';
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

const heartBeat = keyframes`
  0% { transform: scale(1); }
  14% { transform: scale(1.2); }
  28% { transform: scale(1); }
  42% { transform: scale(1.2); }
  70% { transform: scale(1); }
`;

const LikesStats = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalLikes: 0,
    totalVacations: 0,
    totalUsers: 0,
    avgLikesPerVacation: 0,
    mostLikedVacation: null,
    topUsers: []
  });
  const [likesData, setLikesData] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [likesStats, setLikesStats] = useState(null);

  // פונקציה לעיבוד חופשות עם מספר לייקים
  const getVacationsWithLikes = () => {
    console.log('🔍 getVacationsWithLikes called');
    console.log('📊 likesData:', likesData);
    
    // אם יש נתונים מ-fetchData עם לייקים מעודכנים
    if (likesData && Array.isArray(likesData) && likesData.length > 0) {
      console.log('🎯 Using processed vacation data with likes');
      
      // עבד את הנתונים והוסף רמות פופולריות
      const maxLikes = Math.max(...likesData.map(d => d.likes_count || 0), 1);
      
      const processedData = likesData.map((vacation, index) => {
        const likesCount = vacation.likes_count || 0;
        const popularityPercentage = maxLikes > 0 ? (likesCount / maxLikes) * 100 : 0;
        
        let popularityLevel = 'No Likes';
        let popularityColor = 'default';
        
        if (likesCount > 0) {
          if (popularityPercentage >= 80) {
            popularityLevel = 'Hot 🔥';
            popularityColor = 'error';
          } else if (popularityPercentage >= 60) {
            popularityLevel = 'Popular ⭐';
            popularityColor = 'warning';
          } else if (popularityPercentage >= 30) {
            popularityLevel = 'Good 👍';
            popularityColor = 'success';
          } else {
            popularityLevel = 'Rising 📈';
            popularityColor = 'info';
          }
        }

        return {
          ...vacation,
          popularity_percentage: Math.round(popularityPercentage),
          popularity_level: popularityLevel,
          popularity_color: popularityColor
          // השתמש ב-vacation.name ו-vacation.country_name ישירות מהשרת
        };
      });
      
      // מיון לפי מספר לייקים
      return processedData.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    }
    
    console.log('❌ No processed vacation data available');
    return [];
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('❤️ LikesStats: Starting data fetch...');
      
      // קודם מביא חופשות + משתמשים
      const [vacationsData, usersData] = await Promise.all([
        getVacations(),      // רשימת חופשות מלאה
        getUsers()           // רשימת משתמשים
      ]);
      
      console.log('📊 Initial data received:', { vacationsData, usersData });
      
      const vacationsList = Array.isArray(vacationsData) ? vacationsData : [];
      const usersList = Array.isArray(usersData) ? usersData : (usersData?.users || []);
      
      // שמור את הנתונים ב-state
      setVacations(vacationsList);
      
      // עכשיו מביא לייקים לכל חופשה בנפרד - כמו ב-VacationStats!
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
            
            // החזרת החופשה עם מספר הלייקים המעודכן
            return {
              ...vacation,
              likes_count: likesCount
              // השתמש ב-vacation.name ו-vacation.country_name ישירות מהשרת - כמו ב-VacationStats
            };
            
          } catch (error) {
            console.error(`❌ Error getting likes for vacation ${vacation.vacation_id}:`, error);
            // אם יש שגיאה, מחזיר 0 לייקים
            return {
              ...vacation,
              likes_count: 0
              // השתמש ב-vacation.name ו-vacation.country_name ישירות מהשרת - כמו ב-VacationStats
            };
          }
        })
      );
      
      console.log('📊 Vacations with likes:', vacationsWithLikes);
      
      // חישוב סך הלייקים
      const totalCurrentLikes = vacationsWithLikes.reduce((sum, vacation) => {
        const likes = Number(vacation.likes_count) || 0;
        return sum + likes;
      }, 0);
      
      // מצא את החופשה הכי אהובה
      const mostLikedVacation = vacationsWithLikes.reduce((max, vacation) => {
        return (vacation.likes_count > (max?.likes_count || 0)) ? vacation : max;
      }, null);
      
      // מצא משתמשים פעילים (אפשר להשאיר ריק אם אין נתונים)
      const topUsers = [];
      
      // עדכן סטטיסטיקות
      setStats({
        totalLikes: totalCurrentLikes,      // ← לייקים מעודכנים!
        totalVacations: vacationsList.length,
        totalUsers: usersList.length,
        avgLikesPerVacation: vacationsList.length > 0 ? (totalCurrentLikes / vacationsList.length).toFixed(1) : 0,
        mostLikedVacation: mostLikedVacation,
        topUsers: topUsers
      });
      
      // שמור את נתוני החופשות עם לייקים עבור הטבלה
      setLikesData(vacationsWithLikes);
      
    } catch (error) {
      console.error('❌ LikesStats error:', error);
      setError('Failed to load likes data: ' + error.message);
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
            Loading likes statistics...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error loading likes statistics</Typography>
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
              background: 'linear-gradient(45deg, #E91E63 30%, #FF6B9D 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${slideInAnimation} 1s ease-out`
            }}>
              Likes Statistics ❤️
            </Typography>
          </Slide>
          
          <Slide direction="up" in={!loading} timeout={1200}>
            <Typography variant="h6" color="text.secondary" sx={{
              animation: `${slideInAnimation} 1.2s ease-out`
            }}>
              User engagement and vacation popularity analytics
            </Typography>
          </Slide>
        </Box>
      </Fade>

      {/* Statistics Cards עם אנימציות */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            title: "Total Likes", 
            value: stats.totalLikes, 
            icon: <FavoriteIcon />, 
            color: "error", 
            description: "All vacation likes",
            delay: 200
          },
          
          { 
            title: "Total Vacations", 
            value: stats.totalVacations, 
            icon: <FlightTakeoffIcon />, 
            color: "info", 
            description: "Available packages",
            delay: 600
          }
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}> {/* ← שנה מ-md={3} ל-md={4} */}
            <Zoom in={!loading} timeout={1000} style={{ transitionDelay: `${card.delay}ms` }}>
              <Box sx={{
                '&:hover': {
                  animation: card.title === "Total Likes" ? 
                    `${heartBeat} 1s ease-in-out infinite` : 
                    `${floatAnimation} 2s ease-in-out infinite`,
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

      {/* Most Liked Vacation & Top Users */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Most Liked Vacation */}
        <Grid item xs={12} md={6}>
          <Grow in={!loading} timeout={1500} style={{ transitionDelay: '1000ms' }}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
              border: '2px solid #f8bbd9',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(233, 30, 99, 0.3)',
                border: '2px solid #e91e63'
              }
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}>
                  <StarIcon sx={{ animation: `${pulseAnimation} 2s ease infinite` }} />
                  Most Liked Vacation
                </Typography>
                
                {stats.mostLikedVacation ? (
                  <>
                    <Avatar 
                      src={stats.mostLikedVacation.image_filename ? 
                        `http://localhost:5000/uploads/vacationsImages/${stats.mostLikedVacation.image_filename}` : 
                        undefined
                      }
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mx: 'auto', 
                        mb: 2,
                        border: '3px solid #e91e63',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.2) rotate(5deg)'
                        }
                      }}
                      variant="rounded"
                    >
                      <PublicIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stats.mostLikedVacation.name}
                    </Typography>
                    
                    <Typography variant="body1" color="success.main" sx={{ fontWeight: 'bold', mb: 2 }}>
                      ${stats.mostLikedVacation.price}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: 1,
                      animation: `${heartBeat} 2s ease infinite`
                    }}>
                      <FavoriteIcon color="error" />
                      <Typography variant="h5" color="error.main" fontWeight="bold">
                        {stats.mostLikedVacation.likes_count} Likes
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography color="text.secondary">
                    No likes data available yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        
      </Grid>

      {/* Vacations Likes Table עם אנימציות */}
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
                Vacations Popularity ({getVacationsWithLikes().length} vacations) 🏖️
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All vacations sorted by number of likes
              </Typography>
            </Box>
          </Slide>
          
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {['Vacation', 'Destination', 'Likes Count', 'Popularity'].map((header, index) => ( /* ← הסרתי Price */
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
                {getVacationsWithLikes().length > 0 ? (
                  getVacationsWithLikes().map((vacation, index) => (
                    <Fade key={vacation.vacation_id || index} in={!loading} timeout={1000} style={{ transitionDelay: `${index * 50}ms` }}>
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              src={vacation.image_filename ? 
                                `http://localhost:5000/uploads/VacationsImages/${vacation.image_filename}` : 
                                undefined
                              }
                              sx={{ 
                                width: 60, 
                                height: 60,
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.2)'
                                }
                              }}
                              variant="rounded"
                            >
                              <PublicIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" sx={{ 
                                fontWeight: 500,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  color: 'primary.main',
                                  transform: 'translateX(5px)'
                                }
                              }}>
                              
                              </Typography>
                             
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 'bold',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}>
                            🌍 {vacation.name} {/* ← רק vacation.country_name כמו ב-VacationStats */}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            animation: vacation.likes_count > 0 ? `${heartBeat} 2s ease infinite` : 'none'
                          }}>
                            <FavoriteIcon 
                              color={vacation.likes_count > 0 ? "error" : "disabled"}
                              sx={{
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.3)'
                                }
                              }}
                            />
                            <Typography 
                              variant="h6" 
                              sx={{
                                fontWeight: 'bold',
                                color: vacation.likes_count > 0 ? 'error.main' : 'text.secondary',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.2)'
                                }
                              }}
                            >
                              {vacation.likes_count || 0}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Progress Bar */}
                            <Box sx={{ 
                              width: 100, 
                              height: 8, 
                              backgroundColor: 'grey.300', 
                              borderRadius: 1,
                              overflow: 'hidden'
                            }}>
                              <Box sx={{ 
                                width: `${vacation.popularity_percentage || 0}%`, 
                                height: '100%', 
                                backgroundColor: vacation.likes_count > 0 ? 'error.main' : 'grey.400',
                                transition: 'width 1s ease',
                                borderRadius: 1
                              }} />
                            </Box>
                            
                            <Chip 
                              label={vacation.popularity_level || 'No Likes'}
                              color={vacation.popularity_color || 'default'}
                              size="small"
                              variant="outlined"
                              sx={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)'
                                }
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Fade in timeout={2000}>
                        <Box sx={{ py: 4 }}>
                          <Typography variant="h6" color="text.secondary" sx={{
                            fontSize: '1.2rem',
                            animation: `${floatAnimation} 3s ease-in-out infinite`,
                            mb: 2
                          }}>
                            🏖️ No vacations data available yet...
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Debug info: likesData length = {likesData?.length || 0}, 
                            vacations length = {vacations?.length || 0}
                          </Typography>
                        </Box>
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

export default LikesStats;