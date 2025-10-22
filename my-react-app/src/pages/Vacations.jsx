// פונקציה לעיצוב תאריך בפורמט יום.חודש.שנה
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { likeVacation, unlikeVacation, getLikesCount, getAllLikes } from "../api/apiLikes";
import { useUser } from "../contexts/Context";
import { getVacations, deleteVacation } from "../api/apiVacations";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Fade,
  Slide,
  Zoom,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
  Grid,
  Chip
} from "@mui/material";
import { keyframes, styled } from '@mui/material/styles';
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { getVacationImageUrl } from "../api/apiVacations";

// אנימציות מרהיבות בסגנון About
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulseGlow = keyframes`
  0% { 
    transform: scale(1);
    box-shadow: 0 0 20px rgba(33, 150, 243, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(33, 150, 243, 0.8);
  }
  100% { 
    transform: scale(1);
    box-shadow: 0 0 20px rgba(33, 150, 243, 0.4);
  }
`;

const heartBeat = keyframes`
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled Components בסגנון About
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    linear-gradient(135deg, 
      rgba(25, 118, 210, 0.1) 0%, 
      rgba(156, 39, 176, 0.1) 25%,
      rgba(244, 67, 54, 0.1) 50%,
      rgba(255, 193, 7, 0.1) 75%,
      rgba(76, 175, 80, 0.1) 100%
    )
  `,
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 15s ease infinite`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(156, 39, 176, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(255, 193, 7, 0.1) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  }
}));

const CARD_HEIGHT = 420;  // ← גובה קבוע לכל הכרטיסים
const IMAGE_HEIGHT = 180; // ← גובה קבוע לתמונה
const CONTENT_HEIGHT = CARD_HEIGHT - IMAGE_HEIGHT; // ← גובה קבוע לתוכן

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  height: CARD_HEIGHT, // ← גובה קבוע!
  width: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(
        45deg,
        rgba(33, 150, 243, 0.1) 0%,
        rgba(156, 39, 176, 0.1) 50%,
        rgba(255, 193, 7, 0.1) 100%
      )
    `,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    zIndex: 1,
  },
  '&:hover': {
    transform: 'translateY(-15px) scale(1.03)',
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 40px rgba(33, 150, 243, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.6)
    `,
    '&::before': {
      opacity: 1,
    }
  }
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  background: `
    linear-gradient(
      45deg,
      #1976d2 0%,
      #9c27b0 25%,
      #f44336 50%,
      #ff9800 75%,
      #4caf50 100%
    )
  `,
  backgroundSize: '300% 300%',
  animation: `${gradientAnimation} 8s ease infinite`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: { xs: '2.5rem', md: '4rem' },
  letterSpacing: '2px',
  textShadow: '0 4px 8px rgba(0,0,0,0.1)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 100,
    height: 4,
    background: `
      linear-gradient(
        90deg,
        #1976d2,
        #9c27b0,
        #f44336,
        #ff9800,
        #4caf50
      )
    `,
    borderRadius: 2,
    animation: `${shimmer} 3s ease infinite`,
  }
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: 25,
  padding: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  margin: theme.spacing(4, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      )
    `,
    transition: 'left 0.5s ease',
  },
  '&:hover::before': {
    left: '100%',
  }
}));

const getVacationImage = (imageName) =>
  imageName ? `/VacationsImages/${imageName}` : "";

const Vacations = () => {
  const [likesCounts, setLikesCounts] = useState({});
  const [vacations, setVacations] = useState([]);
  const [filteredVacations, setFilteredVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [likeError, setLikeError] = useState("");
  const [pendingLikes, setPendingLikes] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vacationToDelete, setVacationToDelete] = useState(null);
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false); // ← הוסף את זה
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const [vacationsData, likesData] = await Promise.all([
          getVacations(),
          getAllLikes().catch(() => ({ likes: [] }))
        ]);
        
        const likesArr = likesData?.likes || [];
        
        let likedSet = new Set();
        if (user) {
          const currentUserId = Number(user.user_id);
          const userLikes = likesArr.filter(l => Number(l.user_id) === currentUserId);
          likedSet = new Set(userLikes.map(l => Number(l.vacation_id)));
        }
        
        const counts = {};
        likesArr.forEach(like => {
          const vacationId = Number(like.vacation_id);
          counts[vacationId] = (counts[vacationId] || 0) + 1;
        });
        
        vacationsData.forEach(vacation => {
          if (vacation.vacation_id && !(vacation.vacation_id in counts)) {
            counts[vacation.vacation_id] = 0;
          }
        });
        
        const sorted = [...vacationsData].sort((a, b) => {
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          return dateA - dateB;
        });
        
        const withLiked = sorted.map(v => ({ 
          ...v, 
          likedByCurrentUser: user ? likedSet.has(Number(v.vacation_id)) : false 
        }));
        
        setVacations(withLiked);
        setFilteredVacations(withLiked);
        setLikesCounts(counts);
        
      } catch (err) {
        console.error("Error fetching vacations:", err);
        setError("לא ניתן לטעון את רשימת החופשות");
      } finally {
        setLoading(false);
      }
    };
    fetchVacations();
  }, [user]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredVacations(vacations);
      return;
    }
    const filtered = vacations.filter((vacation) =>
      (vacation.description &&
        vacation.description.toLowerCase().includes(search.trim().toLowerCase())) ||
      (vacation.name &&
        vacation.name.toLowerCase().includes(search.trim().toLowerCase()))
    );
    setFilteredVacations(filtered);
  }, [search, vacations]);

  const handleDeleteVacation = (vacation) => {
    setVacationToDelete(vacation);
    setShowDeleteDialog(true);
  };

  const confirmDeleteVacation = async () => {
    try {
      await deleteVacation(vacationToDelete.vacation_id);
      setVacations(prev => prev.filter(v => v.vacation_id !== vacationToDelete.vacation_id));
      setFilteredVacations(prev => prev.filter(v => v.vacation_id !== vacationToDelete.vacation_id));
      setShowDeleteDialog(false);
      setVacationToDelete(null);
      
      // הצג הודעת הצלחה
      setShowDeleteSuccessDialog(true);
      
    } catch (err) {
      console.error("Error deleting vacation:", err);
      setError("Failed to delete vacation. Please try again.");
      setShowDeleteDialog(false);
      setVacationToDelete(null);
    }
  };

  const handleDeleteSuccessDialogClose = () => {
    setShowDeleteSuccessDialog(false);
  };

  if (loading) {
    return (
      <StyledContainer maxWidth="xl">
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center",
          minHeight: "50vh",
          gap: 3
        }}>
          <CircularProgress 
            size={80} 
            sx={{ 
              color: '#1976d2',
              animation: `${pulseGlow} 2s ease infinite`
            }} 
          />
          <Typography 
            variant="h5" 
            sx={{ 
              background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${shimmer} 2s ease infinite`
            }}
          >
            Loading Amazing Vacations...
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl" sx={{ py: 4 }}>
      {/* Header עם אנימציות מרהיבות */}
      <Fade in timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 6, position: 'relative' }}>
          <HeaderTitle variant="h2">
            Discover Amazing Vacations
          </HeaderTitle>
          <Slide direction="up" in timeout={1200}>
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 2,
                color: 'text.secondary',
                opacity: 0.8,
                fontWeight: 300,
                animation: `${slideInUp} 1s ease-out 0.5s both`
              }}
            >
              Explore the world's most beautiful destinations ✈️
            </Typography>
          </Slide>
          
          <Grow in timeout={1500}>
            <Box sx={{ mt: 3 }}>
              <Chip 
                icon={<TravelExploreIcon />}
                label={`${vacations.length} Amazing Destinations Available`}
                sx={{ 
                  background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                  color: 'white',
                  fontSize: '1.1rem',
                  py: 3,
                  px: 2,
                  fontWeight: 'bold',
                  animation: `${floatAnimation} 4s ease-in-out infinite`,
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 30px rgba(25, 118, 210, 0.6)',
                  }
                }} 
              />
            </Box>
          </Grow>
        </Box>
      </Fade>

      {/* כפתור הוספת חופשה לאדמין */}
      {user && user.role_id === 1 && (
        <Zoom in timeout={1200}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/addvacation")} // ← תיקון הנתיב
              sx={{
                background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                borderRadius: 25,
                py: 2,
                px: 4,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 12px 35px rgba(76, 175, 80, 0.6)',
                  background: 'linear-gradient(45deg, #66bb6a, #9ccc65)',
                }
              }}
            >
              Add New Vacation
            </Button>
          </Box>
        </Zoom>
      )}

      {/* הודעות שגיאה */}
      {likeError && (
        <Slide direction="down" in timeout={500}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Alert 
              severity="warning" 
              onClose={() => setLikeError("")}
              sx={{ borderRadius: 3, backdropFilter: 'blur(10px)' }}
            >
              {likeError}
            </Alert>
          </Box>
        </Slide>
      )}

      {/* שורת חיפוש מעוצבת */}
      <Zoom in timeout={1400}>
        <SearchContainer>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <SearchIcon sx={{ color: 'primary.main', fontSize: 30 }} />
            <TextField
              variant="outlined"
              placeholder="Search for your dream vacation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ 
                flexGrow: 1,
                maxWidth: 600,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 20,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    '& fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    }
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 0 20px rgba(25, 118, 210, 0.3)',
                  }
                },
                '& .MuiInputBase-input': {
                  fontSize: '1.1rem',
                  py: 2,
                }
              }}
            />
            <FlightTakeoffIcon sx={{ color: 'secondary.main', fontSize: 30 }} />
          </Box>
        </SearchContainer>
      </Zoom>

      {/* רשת הכרטיסים - 3 בכל שורה עם רווחים שווים */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 4, // רווח בין השורות
        mt: 4,
        px: 2
      }}>
        {/* יצירת שורות של 3 כרטיסים */}
        {Array.from({ length: Math.ceil(filteredVacations.length / 3) }, (_, rowIndex) => (
          <Box 
            key={rowIndex}
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 3, // רווח בין הכרטיסים
              flexWrap: 'nowrap'
            }}
          >
            {filteredVacations
              .slice(rowIndex * 3, (rowIndex + 1) * 3)
              .map((vacation, cardIndex) => {
                const likesCount = likesCounts[vacation.vacation_id] ?? 0;
                const likedByUser = vacation.likedByCurrentUser;
                const globalIndex = rowIndex * 3 + cardIndex;

                return (
                  <Box
                    key={vacation.vacation_id}
                    sx={{
                      width: 350, // רוחב קבוע לכל כרטיס
                      maxWidth: 350,
                      minWidth: 350
                    }}
                  >
                    <Zoom 
                      in 
                      timeout={1000} 
                      style={{ 
                        transitionDelay: `${globalIndex * 100}ms` 
                      }}
                    >
                      <StyledCard>
                        {/* כפתורי עריכה ומחיקה לאדמין */}
                        {user && user.role_id === 1 && (
                          <>
                            <IconButton
                              onClick={() => navigate(`/editvacation/${vacation.vacation_id}`)}
                              sx={{
                                position: "absolute",
                                top: 15,
                                right: 15,
                                zIndex: 3,
                                background: 'rgba(25, 118, 210, 0.9)',
                                color: 'white',
                                borderRadius: '50%',
                                width: 45,
                                height: 45,
                                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  background: 'rgba(25, 118, 210, 1)',
                                  transform: 'scale(1.2) rotate(10deg)',
                                  boxShadow: '0 6px 25px rgba(25, 118, 210, 0.6)',
                                }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            
                            <IconButton
                              onClick={() => handleDeleteVacation(vacation)} // ← שלח את כל האובייקט
                              sx={{
                                position: "absolute",
                                top: 70,
                                right: 15,
                                zIndex: 3,
                                background: 'rgba(244, 67, 54, 0.9)',
                                color: 'white',
                                borderRadius: '50%',
                                width: 45,
                                height: 45,
                                boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  background: 'rgba(244, 67, 54, 1)',
                                  transform: 'scale(1.2) rotate(-10deg)',
                                  boxShadow: '0 6px 25px rgba(244, 67, 54, 0.6)',
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}

                        {/* אייקון לייק מעוצב */}
                        <Box sx={{
                          position: "absolute",
                          top: 15,
                          left: 15,
                          zIndex: 3,
                          display: "flex",
                          alignItems: "center",
                          background: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: 25,
                          px: 2,
                          py: 1,
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: user && user.role_id === 2 ? 'scale(1.1)' : 'none',
                            boxShadow: user && user.role_id === 2 ? '0 6px 25px rgba(244, 67, 54, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
                          }
                        }}>
                          {user && user.role_id === 1 ? (
                            // אדמין - רק הצגה
                            <>
                              <FavoriteIcon sx={{ color: "#ff6b6b", fontSize: 24, mr: 1 }} />
                              <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem", color: "#d32f2f" }}>
                                {likesCount}
                              </Typography>
                            </>
                          ) : user && user.role_id === 2 ? (
                            // משתמש רגיל - יכול ללחוץ
                            <>
                              <IconButton
                                onClick={async () => {
                                  if (pendingLikes.has(vacation.vacation_id)) return;
                                  
                                  setPendingLikes(prev => new Set(prev).add(vacation.vacation_id));
                                  try {
                                    const newLikedState = !likedByUser;
                                    const currentCount = likesCounts[vacation.vacation_id] || 0;
                                    const newCount = newLikedState ? currentCount + 1 : Math.max(0, currentCount - 1);
                                    
                                    setVacations(prev => prev.map(v =>
                                      v.vacation_id === vacation.vacation_id
                                        ? { ...v, likedByCurrentUser: newLikedState }
                                        : v
                                    ));
                                    setFilteredVacations(prev => prev.map(v =>
                                      v.vacation_id === vacation.vacation_id
                                        ? { ...v, likedByCurrentUser: newLikedState }
                                        : v
                                    ));
                                    setLikesCounts(prev => ({
                                      ...prev,
                                      [vacation.vacation_id]: newCount
                                    }));
                                    
                                    if (likedByUser) {
                                      await unlikeVacation(vacation.vacation_id);
                                    } else {
                                      await likeVacation(vacation.vacation_id);
                                    }
                                    
                                  } catch (err) {
                                    setVacations(prev => prev.map(v =>
                                      v.vacation_id === vacation.vacation_id
                                        ? { ...v, likedByCurrentUser: likedByUser }
                                        : v
                                    ));
                                    setFilteredVacations(prev => prev.map(v =>
                                      v.vacation_id === vacation.vacation_id
                                        ? { ...v, likedByCurrentUser: likedByUser }
                                        : v
                                    ));
                                    setLikesCounts(prev => ({
                                      ...prev,
                                      [vacation.vacation_id]: likesCounts[vacation.vacation_id]
                                    }));
                                    setLikeError("Error processing your request. Please try again.");
                                  } finally {
                                    setPendingLikes(prev => {
                                      const next = new Set(prev);
                                      next.delete(vacation.vacation_id);
                                      return next;
                                    });
                                  }
                                }}
                                sx={{ p: 0, mr: 1 }}
                              >
                                <FavoriteIcon
                                  sx={{
                                    color: likedByUser ? "#d32f2f" : "#ffcdd2",
                                    fontSize: 24,
                                    transition: "all 0.3s ease",
                                    animation: likedByUser ? `${heartBeat} 1s ease` : 'none',
                                    '&:hover': { transform: 'scale(1.3)' }
                                  }}
                                />
                              </IconButton>
                              <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem", color: "#d32f2f" }}>
                                {likesCount}
                              </Typography>
                            </>
                          ) : (
                            // משתמש לא מחובר
                            <Box 
                              onClick={() => setShowLoginModal(true)}
                              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                              <FavoriteIcon sx={{ color: "#ffcdd2", fontSize: 24, mr: 1 }} />
                              <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem", color: "#d32f2f" }}>
                                {likesCount}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* תמונה - גובה קבוע */}
                        {vacation.image_filename && getVacationImage(vacation.image_filename) ? (
                          <Box sx={{ 
                            height: IMAGE_HEIGHT,
                            width: '100%',
                            overflow: "hidden", 
                            position: 'relative',
                            flexShrink: 0
                          }}>
                            <img
                              src={getVacationImageUrl(vacation.image_filename)}
                              alt={vacation.destination}
                              style={{
                                width: "100%",
                                height: IMAGE_HEIGHT,
                                objectFit: "cover",
                                display: "block"
                              }}
                            />
                            <Box sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: 40,
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                              pointerEvents: 'none'
                            }} />
                          </Box>
                        ) : (
                          <Box sx={{
                            height: IMAGE_HEIGHT,
                            width: '100%',
                            background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                          }}>
                            <TravelExploreIcon sx={{ fontSize: 60, color: '#90a4ae', opacity: 0.5 }} />
                          </Box>
                        )}

                        {/* תוכן הכרטיס - גובה קבוע */}
                        <CardContent sx={{ 
                          height: CONTENT_HEIGHT,
                          display: "flex", 
                          flexDirection: "column", 
                          justifyContent: "space-between",
                          position: 'relative',
                          zIndex: 2,
                          p: 2,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                          }}>
                            <Typography
                              variant="h6"
                              sx={{ 
                                fontWeight: "bold", 
                                textAlign: "center",
                                background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                                fontSize: '1.1rem'
                              }}
                            >
                              {vacation.destination}
                            </Typography>

                            {vacation.start_date && vacation.finish_day && (
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                                <CalendarMonthIcon sx={{ mr: 0.5, color: "#1976d2", fontSize: 16 }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  {`${formatDate(vacation.start_date)} - ${formatDate(vacation.finish_day)}`}
                                </Typography>
                              </Box>
                            )}

                            {vacation.name && (
                              <Typography
                                variant="body2"
                                sx={{ 
                                  textAlign: "center", 
                                  mb: 1, 
                                  fontWeight: "600", 
                                  color: 'text.primary',
                                  fontSize: '0.9rem',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical'
                                }}
                              >
                                {vacation.name}
                              </Typography>
                            )}

                            <Typography
                              variant="body2"
                              sx={{
                                textAlign: "center",
                                color: 'text.secondary',
                                fontSize: '0.8rem',
                                lineHeight: 1.3,
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                flexGrow: 1,
                                maxHeight: '3.9rem'
                              }}
                            >
                              {vacation.description}
                            </Typography>
                          </Box>

                          <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            p: 1.5,
                            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(156, 39, 176, 0.1))',
                            borderRadius: 2,
                            mt: 1,
                            minHeight: 50
                          }}>
                            <BeachAccessIcon sx={{ mr: 1, color: "#1976d2", fontSize: 20 }} />
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: "bold",
                                background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '1rem'
                              }}
                            >
                              {vacation.price} ₪
                            </Typography>
                          </Box>
                        </CardContent>
                      </StyledCard>
                    </Zoom>
                  </Box>
                );
              })}
            
            {/* מילוי ריק אם יש פחות מ-3 כרטיסים בשורה */}
            {filteredVacations.slice(rowIndex * 3, (rowIndex + 1) * 3).length < 3 &&
              Array.from({ 
                length: 3 - filteredVacations.slice(rowIndex * 3, (rowIndex + 1) * 3).length 
              }).map((_, emptyIndex) => (
                <Box 
                  key={`empty-${rowIndex}-${emptyIndex}`}
                  sx={{ 
                    width: 350,
                    minWidth: 350,
                    visibility: 'hidden' // שומר על הרווח אבל לא מציג
                  }}
                />
              ))
            }
          </Box>
        ))}
      </Box>

      {/* Modal להרשמה */}
      <Dialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            overflow: 'hidden'
          }
        }}
      >
        <Fade in={showLoginModal} timeout={500}>
          <Box>
            <DialogTitle sx={{ 
              textAlign: 'center', 
              pb: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                ❤️ Join Our Travel Community!
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ py: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                  Unlock Amazing Features:
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    { icon: '❤️', text: 'Save your favorite vacations' },
                    { icon: '🎯', text: 'Get personalized recommendations' },
                    { icon: '🌟', text: 'Share your travel experiences' },
                    { icon: '💎', text: 'Access exclusive member deals' }
                  ].map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%', 
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                        {feature.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ 
              p: 3, 
              gap: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Button
                onClick={() => setShowLoginModal(false)}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  borderRadius: 3,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
                variant="outlined"
                fullWidth
              >
                Maybe Later
              </Button>
              
              <Button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/register');
                }}
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                    transform: 'scale(1.05)'
                  }
                }}
                variant="contained"
                fullWidth
              >
                🚀 Join Now!
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ff5722 0%, #d32f2f 100%)',
            color: 'white',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(244, 67, 54, 0.4)'
          }
        }}
      >
        <Fade in={showDeleteDialog} timeout={500}>
          <Box>
            <DialogTitle sx={{ 
              textAlign: 'center', 
              pb: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                ⚠️ Delete Vacation
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ py: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                  Are you sure you want to delete this vacation?
                </Typography>
                
                {vacationToDelete && (
                  <Box sx={{ 
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      📍 {vacationToDelete.name}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                      {vacationToDelete.description?.length > 100 
                        ? `${vacationToDelete.description.substring(0, 100)}...`
                        : vacationToDelete.description
                      }
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      💰 {vacationToDelete.price} ₪
                    </Typography>
                  </Box>
                )}
                
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500 
                }}>
                  This action cannot be undone. All vacation data and associated likes will be permanently deleted.
                </Typography>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ 
              p: 3, 
              gap: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Button
                onClick={() => setShowDeleteDialog(false)}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.05)'
                  }
                }}
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
              
              <Button
                onClick={confirmDeleteVacation}
                sx={{
                  background: 'linear-gradient(45deg, #d32f2f, #f44336)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #c62828, #e53935)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 25px rgba(211, 47, 47, 0.6)'
                  }
                }}
                variant="contained"
                fullWidth
              >
                🗑️ Yes, Delete Vacation
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Dialog>

      {/* דיאלוג הצלחת מחיקה */}
      <Dialog 
        open={showDeleteSuccessDialog} 
        onClose={handleDeleteSuccessDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            color: 'white',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(76, 175, 80, 0.4)'
          }
        }}
      >
        <Fade in={showDeleteSuccessDialog} timeout={500}>
          <Box>
            <DialogTitle sx={{ 
              textAlign: 'center', 
              pb: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                ✅ Deleted Successfully!
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ py: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                  Vacation deleted successfully!
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500 
                }}>
                  The vacation and all its data have been permanently removed from the system.
                </Typography>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ 
              p: 3,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Button
                onClick={handleDeleteSuccessDialogClose}
                sx={{
                  background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2e7d32, #388e3c)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 25px rgba(56, 142, 60, 0.6)'
                  }
                }}
                variant="contained"
                fullWidth
              >
                ✨ Continue
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Dialog>
    </StyledContainer>
  );
};

export default Vacations;