import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography,
  Box,
  Container,
  Grid,
  Button,
  Avatar,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';

import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';

import hrmgmtImage from '../../assets/images/attendance.png';
import rtImage from '../../assets/images/realtimeattendance.png';

// Simplified styled components without theme dependencies
const HeroSection = styled(Box)({
  position: 'relative',
  minHeight: '500px',
  display: 'flex',
  alignItems: 'center',
  padding: '48px 0',
  backgroundColor: '#f5f5f5',
  overflow: 'hidden'
});

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  padding: '32px 0'
});

const HeroImageContainer = styled(Box)({
  position: 'relative',
  height: '100%',
  overflow: 'hidden',
  zIndex: 1,
  '@media (max-width: 900px)': {
    marginTop: '32px'
  }
});

const HeroImageStyled = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
});

const FeatureIcon = styled(Avatar)(({ bgcolor }) => ({
  width: 90,
  height: 90,
  backgroundColor: bgcolor || '#1976d2',
  marginBottom: '24px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 25px rgba(0,0,0,0.15)'
  }
}));

const SecondaryButton = styled(Button)({
  borderRadius: '40px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 32px',
  borderWidth: 2,
  '&:hover': {
    borderWidth: 2
  }
});

const SectionBox = styled(Box)(({ bgColor }) => ({
  padding: '96px 0',
  backgroundColor: bgColor || 'inherit'
}));

const FeatureCard = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '32px',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
  }
});

const ImageContainer = styled(Box)({
  position: 'relative',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)'
  }
});

const AttendanceLanding = () => {
  const isMobile = useMediaQuery('(max-width:900px)');

  const navigate = useNavigate();
  
  return (
    <Box>
      {/* Updated Hero Section with Content on One Side and Image on the Other */}
      <HeroSection>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <HeroContent>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    mb: 3,
                    fontSize: { xs: '2rem', md: '3.5rem' },
                    color: '#252525'
                  }}
                >
                  Attendance Management Simplified
                </Typography>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 500,
                    mb: 4,
                    maxWidth: '95%',
                    lineHeight: 1.5,
                    color: '#4a4a4a',
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Automate your time tracking and boost productivity with our intelligent attendance solution
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 5, 
                    maxWidth: '95%',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.7,
                    color: '#5e5e5e'
                  }}
                >
                  Allow time for greatness and unlock higher productivity through our integrated and advanced time and attendance management system that's designed for the modern workplace.
                </Typography>
               
                <Box sx={{ display: 'flex', gap: 3 }}>
                  {/* Keeping this empty as in the original */}
                </Box>
              </HeroContent>
            </Grid>
            <Grid item xs={12} md={6}>
              <HeroImageContainer>
                <HeroImageStyled 
                  src={hrmgmtImage} 
                  alt="Attendance Management" 
                />
              </HeroImageContainer>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Enhanced Real Time Attendance Section */}
      <SectionBox>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} order={isMobile ? 2 : 1}>
              <ImageContainer>
                <Box 
                  component="img"
                  src={rtImage}
                  alt="Real Time attendance Interface"
                  sx={{ width: '100%', display: 'block' }}
                />
              </ImageContainer>
            </Grid>
            <Grid item xs={12} md={6} order={isMobile ? 1 : 2}>
              <Box sx={{ pl: { md: 4 } }}>
                
                <Typography 
                  variant="h4" 
                  component="h2" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    mb: 3,
                    fontSize: { xs: '1.8rem', md: '2.2rem' }
                  }}
                >
                  Real-Time Attendance That Works
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 4, 
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.7
                  }}
                >
                  Empower your employees with seamless access to time sheets, easy clock-in from multiple sources, and mobile time-off requests. Their time sheets are fully integrated with projects for complete visibility and accountability.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.7,
                    mb: 4
                  }}
                >
                  Work effortlessly with multi-channel attendance inputs including web check-ins, mobile apps, and biometric systems - all synchronized in real-time.
                </Typography>
                
              </Box>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      {/* Enhanced Features Section */}
      <SectionBox bgColor="#F8FAFC">
        <Container>
          <Box sx={{ textAlign: 'center', mb: isMobile ? 6 : 8 }}>
           
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight="bold" 
              gutterBottom 
              sx={{ 
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Comprehensive Attendance Analytics
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Generate detailed reports that highlight attendance patterns, trends, and insights to optimize your workforce management.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard>
                <FeatureIcon bgcolor="#3F51B5">
                  <BarChartIcon fontSize={isMobile ? "medium" : "large"} />
                </FeatureIcon>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '1.3rem', md: '1.5rem' }
                  }}
                >
                  Advanced Analytics
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.7,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  Download comprehensive reports with detailed attendance analytics. Get insights into patterns, trends, and areas for improvement with visual dashboards designed for decision-makers.
                </Typography>
              </FeatureCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard>
                <FeatureIcon bgcolor="#00BCD4">
                  <CalendarMonthIcon fontSize={isMobile ? "medium" : "large"} />
                </FeatureIcon>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '1.3rem', md: '1.5rem' }
                  }}
                >
                  Intelligent Time Tracking
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.7,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  Track employee time and attendance with multiple options including self-service tools, time clocks, biometric systems, and mobile applications - all synchronized in real-time.
                </Typography>
              </FeatureCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard>
                <FeatureIcon bgcolor="#673AB7">
                  <IntegrationInstructionsIcon fontSize={isMobile ? "medium" : "large"} />
                </FeatureIcon>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '1.3rem', md: '1.5rem' }
                  }}
                >
                  Automated Notifications
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.7,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  Reduce administrative work with automated email reporting and notifications. Ensure employees and managers receive timely updates about attendance, time-off approvals, and more.
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      {/* Enhanced Call to Action */}
      <SectionBox bgColor="#E8F5FE">
        <Container>
          <Box 
            sx={{ 
              textAlign: 'center',
              padding: isMobile ? 4 : 6,
              maxWidth: 900,
              mx: 'auto'
            }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight="bold" 
              gutterBottom
              sx={{ 
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Ready to Transform Your HR Operations?
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 5, 
                maxWidth: 700, 
                mx: 'auto', 
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7
              }}
            >
              Join thousands of organizations worldwide who trust HRHaaT to streamline their HR processes,
              increase productivity, and enhance employee satisfaction.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
              
              <SecondaryButton 
                variant="outlined" 
                color="primary"
                size={isMobile ? "medium" : "large"}
                 onClick={() => {
    
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' 
    });
    
    
    navigate('../contact');
    
    
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }}
              >
                Contact 
              </SecondaryButton>
              </Box>
          
          </Box>
        </Container>
      </SectionBox>
    </Box>
  );
};

export default AttendanceLanding;