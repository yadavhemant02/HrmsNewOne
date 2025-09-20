import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import styled from 'styled-components';
import DescriptionIcon from '@mui/icons-material/Description';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AutomationIcon from '@mui/icons-material/AutoFixHigh';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ArticleIcon from '@mui/icons-material/Article';
import WorkflowIcon from '@mui/icons-material/AccountTree';
import heroBackground from '../../assets/images/wttt.png';

// Styled Components with enhanced responsiveness
const HeroSection = styled(Box)`
  position: relative;
  min-height: ${props => props.isMobile ? '350px' : props.isTablet ? '380px' : '450px'};
  width: 100%;
  overflow: hidden;
  background: linear-gradient(to right, #f5f5f5 50%, transparent 50%);
  padding-left:0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: ${props => props.isMobile ? '100%' : props.isTablet ? '55%' : '65%'};
    height: 100%;
    background-image: url(${props => props.backgroundImage});
    background-size: cover;
    background-position: center center ;
    background-repeat: no-repeat;
    z-index: 1;
    clip-path: ${props => props.isMobile ? 'none' : 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'};
    opacity: ${props => props.isMobile ? 0.1 : 1};
  }

  @media (max-width: 900px) {
    background: #f5f5f5;
  }
`;

const HeroContent = styled(Box)`
  position: relative;
  z-index: 2;
  padding: ${props => props.isMobile ? '60px 16px' : props.isTablet ? '60px 24px' : '80px 0px'};
  color: #000000;
  max-width: ${props => props.isMobile ? '100%' : props.isTablet ? '50%' : '40%'};
  text-align: ${props => props.isMobile ? 'center' : 'left'};

  @media (max-width: 900px) {
    max-width: 100%;
    background: rgba(245, 245, 245, 0.9);
  }
`;

const FeatureCard = styled(Paper)`
  padding: ${props => props.isMobile ? '20px' : '24px'};
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled(Box)`
  width: ${props => props.isMobile ? '50px' : '60px'};
  height: ${props => props.isMobile ? '50px' : '60px'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background: ${props => props.bgcolor || '#e3f2fd'};
  color: ${props => props.iconcolor || '#1976d2'};
`;

const SectionWrapper = styled(Box)`
  padding: ${props => props.isMobile ? '60px 0' : props.isTablet ? '70px 0' : '80px 0'};
  background: ${props => props.background || 'transparent'};
`;

const WorkflowCard = styled(Paper)`
  padding: ${props => props.isMobile ? '20px' : '24px'};
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  transition: all 0.3s ease;
  gap: ${props => props.isMobile ? '20px' : '30px'};
  margin-bottom: ${props => props.isMobile ? '20px' : '0'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const Onboarding = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const features = [
    {
      icon: <DescriptionIcon fontSize={isMobile ? "medium" : "large"} />,
      title: 'Digital Offer Letters',
      description: 'Generate and send professional offer letters digitally',
      bgcolor: '#e3f2fd',
      iconcolor: '#1976d2'
    },
    {
      icon: <DataUsageIcon fontSize={isMobile ? "medium" : "large"} />,
      title: 'Smart Forms for Data Capture',
      description: 'Efficiently collect and process employee information',
      bgcolor: '#e8f5e9',
      iconcolor: '#4caf50'
    },
    {
      icon: <LocationOnIcon fontSize={isMobile ? "medium" : "large"} />,
      title: 'Location-Specific Configurability',
      description: 'Customize onboarding processes for different locations',
      bgcolor: '#fff3e0',
      iconcolor: '#ff9800'
    },
    {
      icon: <AssessmentIcon fontSize={isMobile ? "medium" : "large"} />,
      title: 'Insightful Analytics',
      description: 'Track and analyze onboarding metrics and performance',
      bgcolor: '#fce4ec',
      iconcolor: '#e91e63'
    }
  ];

  const workflows = [
    {
      icon: <AutomationIcon fontSize={isMobile ? "medium" : "large"} />,
      title: 'Custom Workflows',
      description: 'Design and automate custom onboarding workflows'
    },
    {
      icon: <DocumentScannerIcon fontSize={isMobile ? "medium" : "large"} />,
      title: 'Document Validation',
      description: 'Automated verification of employee documents'
    },
    {
      icon: <ArticleIcon fontSize={isMobile ? "medium" : "large"} />,
      title: 'Statutory Document Generation',
      description: 'Auto-generate required legal and compliance documents'
    },
    {
      icon: <WorkflowIcon fontSize={isMobile ? "medium" : "large"} />,
      title: 'Process Automation',
      description: 'Streamline and automate repetitive tasks'
    }
  ];

  return (
    <Box component="section">
      {/* Hero Section */}
      <HeroSection 
        backgroundImage={heroBackground} 
        isMobile={isMobile} 
        isTablet={isTablet}
      >
        <Container maxWidth="lg">
          <HeroContent isMobile={isMobile} isTablet={isTablet}>
            <Typography 
              variant={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'} 
              component="h1"
              sx={{ 
                fontWeight: 700,
                mb: isMobile ? 1.5 : 2,
                color: '#000000',
                maxWidth: '95%',
                fontSize: {
                  xs: '2rem',
                  sm: '2.5rem',
                  md: '3rem'
                }
              }}
            >
              Onboarding
            </Typography>
            <Typography 
              variant={isMobile ? 'h6' : isTablet ? 'h5' : 'h4'} 
              sx={{ 
                mb: isMobile ? 2 : 3,
                color: '#000000',
                fontWeight: 500,
                maxWidth: '95%',
                fontSize: {
                  xs: '1.25rem',
                  sm: '1.5rem',
                  md: '1.75rem'
                }
              }}
            >
              Memorable First Impressions!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: isMobile ? 3 : 4,
                color: '#000000',
                lineHeight: 1.7,
                fontSize: {
                  xs: '0.9rem',
                  sm: '0.95rem',
                  md: '1rem'
                },
                maxWidth: '95%'
              }}
            >
              HRHaaT helps you to create a digitally seamless employee onboarding software 
              experience that shortens the new employees' time to productivity. 
              Set them up for success and build pleasant employee journeys.
            </Typography>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Digital Onboarding Section */}
      <SectionWrapper isMobile={isMobile} isTablet={isTablet}>
        <Container maxWidth="lg">
          <Typography 
            variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'} 
            component="h2" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              mb: 2,
              fontSize: {
                xs: '1.5rem',
                sm: '1.75rem',
                md: '2.25rem'
              }
            }}
          >
            Digital Onboarding
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: isMobile ? 4 : 6, 
              maxWidth: 800, 
              mx: 'auto',
              px: isMobile ? 2 : 0,
              fontSize: {
                xs: '0.9rem',
                sm: '0.95rem',
                md: '1rem'
              }
            }}
          >
            Avoid paperwork! Go green with HRHaaT. Enable HR teams to demonstrate to new recruits 
            why your organisation is a great place to work, by going paperless on the first day.
          </Typography>
          <Grid container spacing={isMobile ? 2 : 3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard elevation={2} isMobile={isMobile}>
                  <FeatureIcon 
                    bgcolor={feature.bgcolor} 
                    iconcolor={feature.iconcolor}
                    isMobile={isMobile}
                  >
                    {feature.icon}
                  </FeatureIcon>
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"} 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{
                      fontSize: {
                        xs: '1rem',
                        sm: '1.1rem',
                        md: '1.25rem'
                      }
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.85rem',
                        md: '0.9rem'
                      }
                    }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SectionWrapper>

      {/* Automated Workflows Section */}
      <SectionWrapper background="#f5f5f5" isMobile={isMobile} isTablet={isTablet}>
        <Container maxWidth="lg">
          <Typography 
            variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'} 
            component="h2" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              mb: 2,
              fontSize: {
                xs: '1.5rem',
                sm: '1.75rem',
                md: '2.25rem'
              }
            }}
          >
            Automated Workflows
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: isMobile ? 4 : 6, 
              maxWidth: 800, 
              mx: 'auto',
              px: isMobile ? 2 : 0,
              fontSize: {
                xs: '0.9rem',
                sm: '0.95rem',
                md: '1rem'
              }
            }}
          >
            Reduce friction and improve your onboarding processes with HRHaaT's integrated technology platform 
            specifically built to handle scale and complexity.
          </Typography>
          <Grid container spacing={isMobile ? 5 : 3}>
            {workflows.map((workflow, index) => (
              <Grid item xs={12} sm={8} md={3} key={index}>
                src
                <WorkflowCard elevation={2} isMobile={isMobile}>
                  <FeatureIcon isMobile={isMobile}>
                    {workflow.icon}
                  </FeatureIcon>
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"} 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{
                      fontSize: {
                        xs: '1rem',
                        sm: '1.1rem',
                        md: '1.25rem'
                      }
                    }}
                  >
                    {workflow.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: '0.8rem',
                        sm: '0.85rem',
                        md: '0.9rem'
                      }
                    }}
                  >
                    {workflow.description}
                  </Typography>
                </WorkflowCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SectionWrapper>
    </Box>
  );
};

export default Onboarding;