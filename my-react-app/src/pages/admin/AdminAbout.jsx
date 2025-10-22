// my-react-app/src/pages/admin/AdminAbout.jsx
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeIcon from '@mui/icons-material/Code';
import WebIcon from '@mui/icons-material/Web';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const AdminAbout = () => {
  const navigate = useNavigate();

  const developers = [
    {
      name: "Neomi Harel",
      role: "Full Stack Developer",
      avatar: "👩‍💻", // או תמונה
      skills: ["React", "Node.js", "Python", "MySQL"],
      email: "your.email@example.com",
      github: "your-github",
      linkedin: "your-linkedin"
    }
    // הוסיפי עוד מפתחים אם יש
  ];

  const technologies = [
    { name: "React", icon: <WebIcon />, description: "Dynamic and advanced user interface" },
    { name: "Node.js", icon: <CodeIcon />, description: "Fast and efficient server" },
    { name: "Python Flask", icon: <StorageIcon />, description: "Advanced and flexible API" },
    { name: "MySQL", icon: <StorageIcon />, description: "Reliable database" },
    { name: "Material-UI", icon: <WebIcon />, description: "Modern and accessible design" },
    { name: "JWT", icon: <SecurityIcon />, description: "Advanced security" }
  ];

  const features = [
    "Advanced User Management",
    "Dynamic Vacation System", 
    "Real-time Data Analysis",
    "Intuitive Management Interface",
    "High-level Data Security",
    "Detailed Reports & Graphics",
    "Multi-language Support",
    "Responsive Design"
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          About Vacation Management System
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Details about the system, technologies and developers
        </Typography>
      </Box>

      {/* System Overview */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          📋 About the System
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
          The Vacation Management System is an advanced platform specially developed for efficient management of vacation packages and users. 
          The system offers a professional management interface with advanced tools for data analysis and performance tracking.
        </Typography>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Chip 
                label={feature} 
                color="primary" 
                variant="outlined" 
                sx={{ width: '100%', justifyContent: 'flex-start' }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Technologies */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          🛠️ Technologies
        </Typography>
        
        <Grid container spacing={3}>
          {technologies.map((tech, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                    {tech.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {tech.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tech.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Developers */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          👨‍💻 Development Team
        </Typography>
        
        <Grid container spacing={3}>
          {developers.map((dev, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 60, height: 60, mr: 2, fontSize: 24 }}>
                      {dev.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{dev.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dev.role}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Technical Skills:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {dev.skills.map((skill, skillIndex) => (
                      <Chip 
                        key={skillIndex}
                        label={skill} 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon><EmailIcon /></ListItemIcon>
                      <ListItemText primary={dev.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><GitHubIcon /></ListItemIcon>
                      <ListItemText primary={dev.github} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><LinkedInIcon /></ListItemIcon>
                      <ListItemText primary={dev.linkedin} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Contact */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          📞 Contact Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Have questions or suggestions for improvement? We'd love to hear from you!
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<EmailIcon />}>
            Send Email
          </Button>
          <Button variant="outlined" startIcon={<PhoneIcon />}>
            Contact by Phone
          </Button>
          <Button variant="outlined" startIcon={<GitHubIcon />}>
            GitHub
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminAbout;