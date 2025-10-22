import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  description,
  loading = false 
}) => {
  
  // Color mapping for gradients
  const getGradientColors = (color) => {
    switch (color) {
      case 'primary':
        return { start: '#1976d2', end: '#42a5f5' };
      case 'secondary':
        return { start: '#dc004e', end: '#f06292' };
      case 'success':
        return { start: '#2e7d32', end: '#66bb6a' };
      case 'warning':
        return { start: '#ed6c02', end: '#ffb74d' };
      case 'error':
        return { start: '#d32f2f', end: '#f44336' };
      case 'info':
        return { start: '#0288d1', end: '#29b6f6' };
      default:
        return { start: '#1976d2', end: '#42a5f5' };
    }
  };

  const gradientColors = getGradientColors(color);

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`,
        color: 'white',
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                mb: 1, 
                fontWeight: 500,
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    width: '60%',
                    height: '1em',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 1,
                    animation: 'pulse 1.5s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 },
                    },
                  }}
                />
              ) : (
                value?.toLocaleString() || '0'
              )}
            </Typography>
            
            {description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.85,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  lineHeight: 1.4
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              width: { xs: 48, sm: 56 }, 
              height: { xs: 48, sm: 56 },
              ml: 2,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {React.cloneElement(icon, { 
              sx: { 
                fontSize: { xs: 24, sm: 32 },
                color: 'white'
              } 
            })}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;