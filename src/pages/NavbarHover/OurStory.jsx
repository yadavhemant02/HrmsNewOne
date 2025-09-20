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

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// TODO: Add these image imports when images are available
import heroBackground from '../../assets/images/ourStory.png';
 import innovationImage from '../../assets/images/journeybegin.png';
 import visionImage from '../../assets/images/hraat.png';

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
   
     background-image: url(${props => props.backgroundImage});

    background-size: cover;
    background-position: center;
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

const StatBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  }
}));

const OurStory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const coreValues = [
    {
      icon: <AutoFixHighIcon fontSize="large" />,
      title: 'Innovation First',
      description: 'We continuously evolve HRHaaT by listening to user feedback, tracking market trends, and integrating the latest in HR tech—from predictive analytics to AI-assisted recruitment tools.',
      bgcolor: '#e3f2fd',
      iconcolor: '#1976d2'
    },
    {
      icon: <PeopleIcon fontSize="large" />,
      title: 'People-Centered',
      description: 'Beyond code and dashboards, we are inspired by the people who use our product daily—HR managers, recruiters, and employees. We build for them.',
      bgcolor: '#e8f5e9',
      iconcolor: '#4caf50'
    },
    {
      icon: <IntegrationInstructionsIcon fontSize="large" />,
      title: 'Seamless Integration',
      description: 'HRHaaT combines automation, real-time analytics, seamless integration, employee self-service, and compliance intelligence into a single, secure platform.',
      bgcolor: '#fff3e0',
      iconcolor: '#ff9800'
    },
    {
      icon: <TrendingUpIcon fontSize="large" />,
      title: 'Scalable Growth',
      description: 'From startups to enterprises, HRHaaT adapts to unique organizational challenges while delivering higher efficiency, better decisions, and stronger teams.',
      bgcolor: '#fce4ec',
      iconcolor: '#e91e63'
    }
  ];

  const achievements = [
    { number: '40%', label: 'HR Time Saved' },
    { number: '100%', label: 'Compliance Rate' },
   { number: '750+', label: 'Happy Clients' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <Box>
      {/* Hero Section */}
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
              Our Story
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
              Empowering the Future of HR with HRHaaT
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
              At KPro Technologies, we believe that great organizations are built on empowered people and seamless operations. That belief led us to develop HRHaaT — a next-generation HRIMS designed to transform HR functions.
            </Typography>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* From Concept to Creation Section */}
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
                🎯 From Concept to Creation
              </Typography>
              <Typography 
                variant="body1" 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 8, maxWidth: 800, mx: 'auto', fontSize: '1.1rem' }}
              >
                Driven by innovation and inspired by a vision for smarter workplaces
              </Typography>
            </Grid>
          </Grid>
          
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <ImageContainer>
  <Box 
    component="img"
    src={innovationImage} 
    alt="Your image description"
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
                  The Journey Behind HRHaaT
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
                  Our journey began with a simple observation: HR teams across industries were overwhelmed with manual processes, disjointed systems, and inefficient workflows that stifled productivity and employee satisfaction.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Our Development Process:
                </Typography>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Assembled expert teams</strong> of HR professionals, software engineers, designers, and business leaders
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Listened to pain points</strong> from real HR professionals across various industries
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Studied workflows</strong> of companies from startups to enterprises
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Built HRHaaT</strong> not just as software, but as a platform for progress
                  </Typography>
                </FeaturePoint>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      {/* What Makes HRHaaT Different Section */}
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
                  🚀 What Makes HRHaaT Different?
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
                  Unlike traditional HR software that focuses on one or two core modules, HRHaaT is designed as an all-in-one, fully integrated ecosystem—built with the end-user in mind.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Our Integrated Platform Combines:
                </Typography>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Automation</strong> that eliminates manual processes and reduces errors
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Real-time analytics</strong> for data-driven decision making
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Seamless integration</strong> with existing business systems
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Employee self-service</strong> portals for enhanced user experience
                  </Typography>
                </FeaturePoint>

                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Compliance intelligence</strong> ensuring regulatory adherence
                  </Typography>
                </FeaturePoint>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                       <ImageContainer>
  <Box 
    component="img"
    src={visionImage} 
    alt="Your image description"
    sx={{ width: '100%', display: 'block' }}
  />
</ImageContainer>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      {/* Achievements Section */}
      <SectionBox bgColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
        <Container>
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{ mb: 2, color: 'black' }}
          >
            🤝 Our Promise to You
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: 6, 
              maxWidth: 800, 
              mx: 'auto',
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.8
            }}
          >
            With HRHaaT, you're not just adopting software. You're investing in a partner who will help you achieve measurable results.
          </Typography>
          
          <Grid container spacing={4}>
            {achievements.map((achievement, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatBox>
                  <Typography 
                    variant="h3" 
                    component="div" 
                    fontWeight="bold"
                    color="primary.main"
                    sx={{ mb: 1 }}
                  >
                    {achievement.number}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    fontWeight="500"
                  >
                    {achievement.label}
                  </Typography>
                </StatBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SectionBox>

      {/* Core Values Section */}
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
            💡 Our Core Values
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
            Built for real-world needs, backed by innovation, and inspired by the people who use our platform every day.
          </Typography>
          <Grid container spacing={4}>
            {coreValues.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard elevation={1}>
                  <FeatureIcon bgcolor={value.bgcolor} iconcolor={value.iconcolor}>
                    {value.icon}
                  </FeatureIcon>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    {value.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {value.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Closing Section */}
      <SectionBox>
        <Container>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography 
              variant="h4" 
              component="h2" 
              fontWeight="bold" 
              gutterBottom
              sx={{ mb: 3 }}
            >
              🔚 HRHaaT is More Than a Product
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary', 
                mb: 4,
                fontSize: '1.2rem',
                lineHeight: 1.8
              }}
            >
              It's a mission to redefine HR. We're proud of how far we've come and even more excited about where we're headed.
            </Typography>
            <Typography 
              variant="h5" 
              component="h3" 
              fontWeight="600" 
              color="primary.main"
              sx={{ mb: 2 }}
            >
              Join us on this journey and let HRHaaT be the heart of your organization's people operations.
            </Typography>
          </Box>
        </Container>
      </SectionBox>
   
    </Box>
  );
};

export default OurStory; 