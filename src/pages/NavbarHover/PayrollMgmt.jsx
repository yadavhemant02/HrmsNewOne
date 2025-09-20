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

import DescriptionIcon from '@mui/icons-material/Description';
import DataUsageIcon from '@mui/icons-material/DataUsage';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PaymentsIcon from '@mui/icons-material/Payments';
import AutorenewIcon from '@mui/icons-material/Autorenew';


import heroBackground from '../../assets/images/pay.png';
import adImage from '../../assets/images/administration.png';
import adImage2 from '../../assets/images/payroll(2).png';

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

const PayrollMgmt = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <AutorenewIcon fontSize="large" />,
      title: 'Accurate Processing',
      description: 'Eliminate errors with HRHaaT automated inputs and comprehensive system validations that ensure precision in every payroll run.',
      bgcolor: '#e3f2fd',
      iconcolor: '#1976d2'
    },
    {
      icon: <DataUsageIcon fontSize="large" />,
      title: 'Enterprise Security',
      description: 'Protect sensitive data with granular permissions, clear audit trails, and a central locking system for secure payroll operations.',
      bgcolor: '#e8f5e9',
      iconcolor: '#4caf50'
    },
    {
      icon: <PaymentsIcon fontSize="large" />,
      title: 'Integrated Payroll',
      description: 'Dramatically reduce processing time and minimize errors by seamlessly integrating inputs directly from your employees and other systems.',
      bgcolor: '#fff3e0',
      iconcolor: '#ff9800'
    },
    {
      icon: <DescriptionIcon fontSize="large" />,
      title: 'Digital Payslips',
      description: 'Provide instant access to electronic payslips through a secure employee self-service portal with historical records and analysis.',
      bgcolor: '#fce4ec',
      iconcolor: '#e91e63'
    }
  ];

  return (
    <Box>
      {/* Hero Section with enhanced visual appeal */}
      <HeroSection backgroundImage={heroBackground}>
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
              Payroll Management
            </Typography>
            <Typography 
              variant={isMobile ? 'h6' : 'h5'} 
              sx={{ 
                mb: 3,
                color: "balck",
                fontWeight: 600,
                maxWidth: '95%',
                letterSpacing: '-0.5px',
              }}
            >
              Don't worry about Payroll
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
              Simplify complex payroll processes with HRHaaT, a powerful, secure, accurate, automated, and 100% compliant system that adapts to your business needs!
            </Typography>
            
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Administration Section - Now positioned above HRHaaT Features */}
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
                Administration
              </Typography>
              <Typography 
                variant="body1" 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 8, maxWidth: 800, mx: 'auto', fontSize: '1.1rem' }}
              >
                Configure your payroll system to match your exact business requirements with flexible administration tools
              </Typography>
            </Grid>
          </Grid>
          
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <ImageContainer>
                <Box 
                  component="img"
                  src={adImage}
                  alt="Administration Interface"
                  sx={{ width: '100%', display: 'block' }}
                />
              </ImageContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 4 } }}>
                <Typography 
                  variant={isMobile ? "h6" :"h4"}
                  component="h3" 
                  fontWeight="bold" 
                  color="primary.main"
                  gutterBottom
                  sx={{ mb: 3,color:" #000000" }}
                >
                  Powerful Configuration Tools
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
                HRHaaT allows you to easily configure complex requirements. Together with out-of-the-box configurations, improve setup time considerably and bring agility to evolve as your business grows.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Key Administrative Features:
                </Typography>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Configurable pay scale groups</strong> to match your organizational structure
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Pre-determined flexi benefits and perks</strong> with customizable allocation rules
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Adjustable salary structures</strong> with advanced formula builder capabilities
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Customizable payslip design</strong> with branding and layout options
                  </Typography>
                </FeaturePoint>
                
                <Box sx={{ mt: 4 }}>
                 
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

    
      <SectionBox bgColor="#f5f8ff">
        <Container>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography 
                   variant={isMobile ? "h6" :"h4"}
                  component="h3" 
                  fontWeight="bold" 
                  
                  gutterBottom
                  sx={{ mb: 3,color:" #000000"}}
                >
                  Comprehensive Payroll Reporting
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
                  Generate detailed reports to gain valuable insights into your payroll operations. Our advanced reporting tools allow you to analyze trends, track expenses, and make data-driven decisions to optimize your payroll processes.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Available Reports:
                </Typography>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Detailed payroll summaries</strong> with departmental breakdowns
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Tax and compliance reports</strong> for regulatory submissions
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Compensation analysis</strong> with historical comparisons
                  </Typography>
                </FeaturePoint>
                
                <FeaturePoint>
                  <FeatureIcon2>
                    <ArrowForwardIcon color="primary" />
                  </FeatureIcon2>
                  <Typography variant="body1">
                    <strong>Custom report builder</strong> for specialized reporting needs
                  </Typography>
                </FeaturePoint>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageContainer>
                <Box 
                  component="img"
                  src={adImage2} 
                  alt="Payroll Reporting Dashboard"
                  sx={{ width: '100%', display: 'block' }}
                />
              </ImageContainer>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      {/* HRHaaT Features Section */}
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
            HRHaaT Features
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
            Avoid paperwork! Go green with HRHaaT! Enable HR teams to demonstrate to new recruits why your organisation is a great place to work, by going paperless on the first day.
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
          
          <Box sx={{ textAlign: 'center', mt: 8 }}>
           
           
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PayrollMgmt;