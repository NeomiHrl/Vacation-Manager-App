import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Chip,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Fade,
  Slide,
  Zoom,
  Grow,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { keyframes } from "@mui/material/styles";

// Icons
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import DevicesIcon from "@mui/icons-material/Devices";
import CloudIcon from "@mui/icons-material/Cloud";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import CodeIcon from "@mui/icons-material/Code";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import StorageIcon from "@mui/icons-material/Storage";
import WebIcon from "@mui/icons-material/Web";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LanguageIcon from "@mui/icons-material/Language";
import StarIcon from "@mui/icons-material/Star";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PublicIcon from "@mui/icons-material/Public";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(1deg); }
  66% { transform: translateY(-10px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.5); }
  50% { box-shadow: 0 0 40px rgba(33, 150, 243, 0.8), 0 0 60px rgba(33, 150, 243, 0.3); }
  100% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.5); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

const About = () => {
  const theme = useTheme();
  const [visibleSection, setVisibleSection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSection((prev) => (prev + 1) % 6);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <TravelExploreIcon />,
      title: "Smart Vacation Discovery",
      description:
        "AI-powered recommendations based on your preferences and travel history",
      color: "#2196F3",
    },
    {
      icon: <FavoriteIcon />,
      title: "Social Travel Experience",
      description:
        "Like, share, and discover vacations through community interactions",
      color: "#E91E63",
    },
    {
      icon: <SecurityIcon />,
      title: "Secure & Reliable",
      description:
        "Bank-level security with encrypted data and secure payment processing",
      color: "#4CAF50",
    },
    {
      icon: <SpeedIcon />,
      title: "Lightning Fast",
      description:
        "Optimized performance with real-time updates and instant search",
      color: "#FF9800",
    },
    {
      icon: <DevicesIcon />,
      title: "Cross-Platform",
      description:
        "Seamless experience across all devices - desktop, tablet, and mobile",
      color: "#9C27B0",
    },
    {
      icon: <SupportAgentIcon />,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to help you plan your perfect vacation",
      color: "#00BCD4",
    },
  ];

  const techStack = [
    {
      name: "React 18",
      icon: <WebIcon />,
      category: "Frontend",
      color: "#61DAFB",
    },
    { name: "Python", icon: <CodeIcon />, category: "Backend", color: "#339933" },
    { name: "MySQL", icon: <StorageIcon />, category: "Database", color: "#4479A1" },
    {
      name: "Material-UI",
      icon: <DesignServicesIcon />,
      category: "UI Framework",
      color: "#0081CB",
    }
  ];

  const timeline = [
    {
      phase: "System Planning",
      date: "Phase 1",
      description: "Database design and API architecture for vacation management",
      icon: <DesignServicesIcon />,
      color: "primary",
    },
    {
      phase: "Core Features",
      date: "Phase 2", 
      description: "Vacation display system and user authentication",
      icon: <WebIcon />,
      color: "secondary",
    },
    {
      phase: "Social Features",
      date: "Phase 3",
      description: "Like system implementation and user interactions",
      icon: <FavoriteIcon />,
      color: "success",
    },
    {
      phase: "Admin Panel",
      date: "Phase 4",
      description: "Administrative dashboard and statistics tracking",
      icon: <RocketLaunchIcon />,
      color: "warning",
    }
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.05)} 0%, 
        ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        py: 4,
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Box
            sx={{
              textAlign: "center",
              mb: 8,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -50,
                left: "50%",
                transform: "translateX(-50%)",
                width: 200,
                height: 200,
                background: `radial-gradient(circle, ${alpha(
                  theme.palette.primary.main,
                  0.1
                )} 0%, transparent 70%)`,
                borderRadius: "50%",
                animation: `${pulseGlow} 3s ease-in-out infinite`,
              },
            }}
          >
            <Zoom in timeout={1500}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  animation: `${floatAnimation} 6s ease-in-out infinite`,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: -10,
                    left: -10,
                    right: -10,
                    bottom: -10,
                    borderRadius: "50%",
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    opacity: 0.3,
                    animation: `${pulseGlow} 2s ease-in-out infinite`,
                    zIndex: -1,
                  },
                }}
              >
                <FlightTakeoffIcon sx={{ fontSize: 60, color: "white" }} />
              </Avatar>
            </Zoom>

            <Slide direction="down" in timeout={2000}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.success.main})`,
                  backgroundSize: "300% 300%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: `${gradientShift} 4s ease infinite`,
                  position: "relative",
                }}
              >
                VacationVibe ✈️
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: theme.palette.warning.main,
                    animation: `${sparkle} 2s ease-in-out infinite`,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -5,
                      left: -5,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: theme.palette.info.main,
                      animation: `${sparkle} 2s ease-in-out infinite 0.5s`,
                    },
                  }}
                />
              </Typography>
            </Slide>

            <Slide direction="up" in timeout={2500}>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: "text.secondary",
                  maxWidth: 800,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                🌟 Your Gateway to Extraordinary Travel Experiences! Discover, plan,
                and book amazing vacations with our cutting-edge platform.
              </Typography>
            </Slide>

            <Grow in timeout={3000}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label="AI-Powered"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    animation: `${floatAnimation} 4s ease-in-out infinite`,
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
                <Chip
                  icon={<PublicIcon />}
                  label="Global Destinations"
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    animation: `${floatAnimation} 4s ease-in-out infinite 0.5s`,
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
                <Chip
                  icon={<StarIcon />}
                  label="Premium Experience"
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    animation: `${floatAnimation} 4s ease-in-out infinite 1s`,
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
              </Box>
            </Grow>
          </Box>
        </Fade>

        {/* Features Grid */}
        <Box sx={{ mb: 8 }}>
          <Slide direction="right" in timeout={1000}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              ✨ Why Choose VacationVibe?
            </Typography>
          </Slide>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={feature.title}>
                <Zoom
                  in
                  timeout={1000}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      background: `linear-gradient(135deg, white 0%, ${alpha(
                        feature.color,
                        0.05
                      )} 100%)`,
                      border: `2px solid ${alpha(feature.color, 0.1)}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-10px) scale(1.02)",
                        boxShadow: `0 20px 40px ${alpha(feature.color, 0.3)}`,
                        border: `2px solid ${alpha(feature.color, 0.3)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: feature.color,
                          width: 60,
                          height: 60,
                          mx: "auto",
                          mb: 2,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "rotate(360deg)",
                          },
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          sx: { fontSize: 30, color: "white" },
                        })}
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          mb: 2,
                          color: feature.color,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tech Stack */}
        <Paper
          sx={{
            p: 4,
            mb: 8,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.02
            )} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Slide direction="left" in timeout={1000}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mb: 4,
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              🛠️ Built with Modern Technology
            </Typography>
          </Slide>

          <Grid container spacing={3}>
            {techStack.map((tech, index) => (
              <Grid item xs={12} sm={6} md={4} key={tech.name}>
                <Fade
                  in
                  timeout={1000}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: alpha(tech.color, 0.1),
                        transform: "translateX(10px)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: tech.color,
                        mr: 2,
                        width: 50,
                        height: 50,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                      }}
                    >
                      {React.cloneElement(tech.icon, { sx: { color: "white" } })}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {tech.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tech.category}
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Development Timeline */}
        <Box sx={{ mb: 8 }}>
          <Slide direction="right" in timeout={1000}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              🚀 Development Journey
            </Typography>
          </Slide>

          <Timeline position="alternate">
            {timeline.map((item, index) => (
              <Zoom
                key={item.phase}
                in
                timeout={1000}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      color={item.color}
                      sx={{
                        p: 1,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.3)",
                        },
                      }}
                    >
                      {item.icon}
                    </TimelineDot>
                    {index < timeline.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{
                      py: "12px",
                      px: 2,
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="span"
                      sx={{ fontWeight: "bold" }}
                    >
                      {item.phase}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      display="block"
                    >
                      {item.date}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {item.description}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              </Zoom>
            ))}
          </Timeline>
        </Box>

        {/* Platform Info */}
        <Paper
          sx={{
            p: 4,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.secondary.main,
              0.05
            )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
          }}
        >
          <Slide direction="up" in timeout={1000}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mb: 4,
                fontWeight: "bold",
                color: "secondary.main",
              }}
            >
              🎯 About VacationVibe Platform
            </Typography>
          </Slide>

          <Zoom in timeout={1500}>
            <Card
              sx={{
                maxWidth: 600,
                mx: "auto",
                background: "linear-gradient(135deg, white 0%, #f5f5f5 100%)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: "auto",
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    fontSize: 40,
                    fontWeight: "bold",
                    animation: `${floatAnimation} 4s ease-in-out infinite`,
                  }}
                >
                  <FlightTakeoffIcon sx={{ fontSize: 50 }} />
                </Avatar>

                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  VacationVibe System
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Vacation Management Platform
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  A comprehensive vacation management system built for discovering and exploring amazing travel destinations. 
                  Features include vacation browsing, user preferences tracking through likes, and administrative oversight.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <TravelExploreIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold">Browse Vacations</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Explore curated vacation packages
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <FavoriteIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold">Like System</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Save your favorite destinations
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Zoom>
        </Paper>

        {/* FAQ Section */}
        <Box sx={{ mt: 8 }}>
          <Slide direction="left" in timeout={1000}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mb: 4,
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              ❓ Frequently Asked Questions
            </Typography>
          </Slide>

          {[
            {
              question: "How secure is my personal information?",
              answer:
                "We use bank-level encryption and security measures to protect your data. All user information is stored securely and never shared with third parties.",
            },
            {
              question: "How does the vacation like system work?",
              answer:
                "Simply click the heart icon on any vacation you're interested in! Your liked vacations help us understand your preferences and can be viewed in your personal dashboard.",
            },
            {
              question: "Can I view vacation details and pricing?",
              answer:
                "Yes! Each vacation displays detailed information including destination, dates, pricing, and descriptions. You can browse all available packages without needing to create an account.",
            },
            {
              question: "Is there an admin panel for managing content?",
              answer:
                "The platform includes a comprehensive admin dashboard for managing vacations, viewing user statistics, and tracking system analytics in real-time.",
            },
            {
              question: "What features are planned for the future?",
              answer:
                "We're working on booking capabilities, user reviews, advanced filtering options, and personalized vacation recommendations based on your preferences!",
            }
          ].map((faq, index) => (
            <Fade
              key={faq.question}
              in
              timeout={1000}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <Accordion
                sx={{
                  mb: 2,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Fade>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default About;