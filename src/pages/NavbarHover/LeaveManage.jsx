 import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BarChartIcon from '@mui/icons-material/BarChart';



import heroBackground from '../../assets/images/leave1.png';

import leave2 from '../../assets/images/leave2.png';
import leave3 from '../../assets/images/leave3.png';

// Styled Components with enhanced visual appeal
const HeroSection = styled(Box)`
  position: relative;
  height: 400px;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(to right, #f8f9fa 50%, transparent 50%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 65%;
    height: 100%;

    background-image: url(${props => props.backgroundImage}); */
    
    background-size: cover;
    background-position: top;
    background-repeat: no-repeat;
    z-index: 1;
    clip-path: polygon(25% 0, 100% 0, 100% 100%, 0% 100%);
    filter: saturate(1.1) contrast(1.05);
    box-shadow: inset 0 0 30px rgba(0,0,0,0.15);
  }

  @media (max-width: 900px) {
    background: #f8f9fa;
    &::before {
      width: 100%;
      clip-path: none;
      opacity: 0.15;
    }
  }
`;

const HeroContent = styled(Box)`
  position: relative;
  z-index: 2;
  padding: ${props => props.isMobile ? '80px 0' : '10px 0'};
  padding-left: ${props => props.isMobile ? '0' : '0px'};
  color: #1a1a2e;
  max-width: ${props => props.isMobile ? '100%' : '35%'};
  text-align: left;

  @media (max-width: 1200px) {
    max-width: 45%;
    margin-left: 20px;
  }

  @media (max-width: 900px) {
    max-width: 100%;
    text-align: center;
    margin-left: 0;
    padding-left: 0;
    background: rgba(248, 249, 250, 0.85);
    border-radius: 16px;
    padding: 60px 24px;
  }
`;

const FeatureCard = styled(Paper)`
  padding: 32px;
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }
`;

const FeatureIcon = styled(Box)`
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background: ${props => props.bgcolor || '#e3f2fd'};
  color: ${props => props.iconcolor || '#1976d2'};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const SectionBox = styled(Box)(({ theme, bgColor }) => ({
  padding: theme.spacing(12, 0),
  backgroundColor: bgColor || 'inherit',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(6),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '400px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  fontSize: '1.1rem',
  fontWeight: 500,
  textAlign: 'center',
  padding: theme.spacing(3),
}));

const FeaturePoint = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2.5),
}));

const FeatureIcon2 = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  marginTop: '2px',
}));

const LeaveManage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <CalendarTodayIcon fontSize="large" />,
      title: 'Smart Leave Tracking',
      description: 'Automated leave calculations with real-time balance updates, holiday integration, and intelligent conflict detection for seamless leave management.',
      bgcolor: '#e3f2fd',
      iconcolor: '#1976d2'
    },
    {
      icon: <AssignmentTurnedInIcon fontSize="large" />,
      title: 'Approval Workflows',
      description: 'Streamlined approval processes with configurable hierarchies, automated notifications, and escalation rules for efficient leave management.',
      bgcolor: '#e8f5e9',
      iconcolor: '#4caf50'
    },
    {
      icon: <NotificationsActiveIcon fontSize="large" />,
      title: 'Real-time Notifications',
      description: 'Instant alerts for leave requests, approvals, and policy updates keeping all stakeholders informed throughout the leave lifecycle.',
      bgcolor: '#fff3e0',
      iconcolor: '#ff9800'
    },
    {
      icon: <BarChartIcon fontSize="large" />,
      title: 'Advanced Analytics',
      description: 'Comprehensive leave reports and analytics with trend analysis, team insights, and predictive planning for better workforce management.',
      bgcolor: '#fce4ec',
      iconcolor: '#e91e63'
    }
  ];

  return (
    <Box>
      {/* Hero Section with enhanced visual appeal */}
      <HeroSection backgroundImage={heroBackground} >
        <Container sx={{ pl: { xs: 2, md: 0 } }}>
          <HeroContent isMobile={isMobile}>
            <Typography 
              variant={isMobile ? 'h5' : 'h3'} 
              component="h1"
              sx={{ 
                fontWeight: 700,
                mb: 2,
                color: '#1a1a2e',
                maxWidth: '95%',
                letterSpacing: '-0.5px',
              }}
            >
              Leave Management
            </Typography>
            <Typography 
              variant={isMobile ? 'h6' : 'h5'} 
              sx={{ 
                mb: 3,
                color: "black",
                fontWeight: 600,
                maxWidth: '95%',
                letterSpacing: '-0.5px',
              }}
            >
              Effortless Leave Management
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 5,
                color: '#3a3a50',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                maxWidth: '95%'
              }}
            >
              Transform your leave management with HRHaaT's intelligent system that automates approvals, tracks balances, and ensures policy compliance while providing transparency for all stakeholders.
            </Typography>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Leave Administration Section */}
      <SectionBox>
        <Container>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                component="h2" 
                fontWeight="bold" 
                gutterBottom
                align="center"
                sx={{ mb: 1 }}
              >
                Leave Administration
              </Typography>
              <Typography 
                variant="body1" 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 8, maxWidth: 800, mx: 'auto', fontSize: '1.1rem' }}
              >
                Configure comprehensive leave policies and manage employee leave requests with powerful administrative tools
              </Typography>
            </Grid>
          </Grid>
          
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <ImageContainer>
                {/* TODO: Replace with actual image when available */}
                <Box 
                  component="img"
                  src={leave3}
                  alt="Leave Administration Interface"
                  sx={{ width: '100%', display: 'block' }}
                />
                
              </ImageContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 4 } }}>
                <Typography 
                  variant={isMobile ? "h6" : "h4"}
                  component="h3" 
                  fontWeight="bold" 
                  color="primary.main"
                  gutterBottom
                  sx={{ mb: 3, color: "#000000" }}
                >
                  Comprehensive Leave Configuration
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.8
                  }}
                >
                  HRHaaT provides flexible leave policy management with automated calculations, policy enforcement, and seamless integration with attendance systems for complete workforce management.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Key Administrative Features:
                </Typography>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Flexible leave types and policies</strong> customizable to your organizational needs
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Automated accrual calculations</strong> with pro-rata adjustments and carry-forward rules
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Multi-level approval workflows</strong> with delegation and escalation capabilities
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Holiday calendar integration</strong> with location-based and custom holiday management
                  </Typography>
                </FeaturePoint>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      {/* Leave Reports Section */}
      <SectionBox bgColor="#f5f8ff">
        <Container>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography 
                  variant={isMobile ? "h6" : "h4"}
                  component="h3" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ mb: 3, color: "#000000" }}
                >
                  Comprehensive Leave Analytics
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 4,
                    fontSize: '1.1rem',
                    lineHeight: 1.8
                  }}
                >
                  Gain deep insights into leave patterns, team availability, and workforce planning with advanced reporting and analytics tools that help optimize resource allocation and planning.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Available Reports & Analytics:
                </Typography>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Leave balance summaries</strong> with individual and team-level breakdowns
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Attendance pattern analysis</strong> with trend identification and forecasting
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Team availability calendars</strong> for effective resource planning
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Custom dashboard widgets</strong> for real-time leave management insights
                  </Typography>
                </FeaturePoint>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageContainer>
                {/* TODO: Replace with actual image when available */}
                <Box 
                  component="img"
                  src={leave2} 
                  alt="Leave Analytics Dashboard"
                  sx={{ width: '100%', display: 'block' }}
                />
               
              </ImageContainer>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      {/* HRHaaT Leave Features Section */}
      <Box sx={{ py: isMobile ? 8 : 12, backgroundColor: '#f8f9fa' }}>
        <Container>
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            HRHaaT Leave Features
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: 8, 
              maxWidth: 800, 
              mx: 'auto',
              fontSize: '1.1rem',
              color: 'text.secondary',
              lineHeight: 1.8
            }}
          >
            Streamline leave management with intelligent automation, real-time tracking, and comprehensive reporting that keeps your workforce organized and productive.
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard elevation={1}>
                  <FeatureIcon bgcolor={feature.bgcolor} iconcolor={feature.iconcolor}>
                    {feature.icon}
                  </FeatureIcon>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LeaveManage;