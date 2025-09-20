  import React from 'react';
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Public
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

import contacthero from '../../assets/images/support2.png';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);
const MotionCard = motion(Card);

const AnimatedHeroBackground = () => {
  return (
    <MotionBox
      initial={{ clipPath: 'polygon(100% 0%, 100% 0, 100% 100%, 100% 100%)' }}
      animate={{ clipPath: 'polygon(8% 0%, 100% 0, 100% 100%, 0% 100%)' }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '55%',
        height: '100%',
        backgroundImage: `url(${contacthero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>)',
          opacity: 0.3
        },
        zIndex: 1,
        '@media (max-width: 900px)': {
          width: '100%',
          clipPath: 'none',
          opacity: 0.2,
        }
      }}
    />
  );
};

const HeroSection = styled(Box)(() => ({
  position: 'relative',
  minHeight: 400,
  width: '100%',
  overflow: 'hidden',
  background: 'linear-gradient(to right, #000000 50%, transparent 50%)',
  '@media (max-width: 900px)': {
    background: '#000000',
  }
}));

const HeroContent = styled(MotionBox)(({ isMobile }) => ({
  position: 'relative',
  zIndex: 2,
  padding: isMobile ? '60px 20px' : '50px 0px',
  color: 'white',
  maxWidth: isMobile ? '100%' : '45%',
  textAlign: isMobile ? 'center' : 'left'
}));

const ContactSection = styled(Box)(({ isMobile }) => ({
  padding: isMobile ? '40px 0' : '80px 0',
  backgroundColor: '#f8f9fa'
}));

const ContactCard = styled(MotionCard)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const AllianceCard = styled(MotionCard)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  border: '2px solid transparent',
  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box',
  transition: 'all 0.4s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 0,
  },
  '&:hover::before': {
    opacity: 1,
  }
}));

const IconContainer = styled(Box)(({ theme, bgColor }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
  '& .MuiSvgIcon-root': {
    color: 'white',
    fontSize: 28
  }
}));

const CountryFlag = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
}));

const AllianceSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f8 50%, #f0fff4 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(102,126,234,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>)',
    opacity: 0.4,
  }
}));

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardAnimation = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const ContactInfo = ({ icon, title, content, link, bgColor }) => {
  const handleClick = () => {
    if (link) {
      if (title === 'Email') {
        window.open(`mailto:${content}`, '_blank');
      } else if (title === 'Phone') {
        window.open(`tel:${content}`, '_blank');
      } else if (title === 'Address') {
        window.open(`https://maps.google.com/?q=${encodeURIComponent(content)}`, '_blank');
      }
    }
  };

  return (
    <MotionGrid 
      item 
      xs={12} 
      md={4}
      variants={cardAnimation}
    >
      <ContactCard
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        sx={{ cursor: link ? 'pointer' : 'default' }}
      >
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <IconContainer bgColor={bgColor}>
            {icon}
          </IconContainer>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            gutterBottom
            sx={{ color: '#333' }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary', 
              lineHeight: 1.6,
              wordBreak: 'break-word'
            }}
          >
            {content}
          </Typography>
          {link && (
            <Box sx={{ mt: 2 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 'medium'
                }}
              >
                Click to {title === 'Email' ? 'send email' : title === 'Phone' ? 'call' : 'view on map'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </ContactCard>
    </MotionGrid>
  );
};

const InternationalOffice = ({ flag, country, city, address, timezone }) => {
  const handleAddressClick = () => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(`${address}, ${city}, ${country}`)}`, '_blank');
  };

  return (
    <MotionGrid 
      item 
      xs={12} 
      md={6}
      variants={cardAnimation}
    >
      <AllianceCard
        whileHover={{ y: -12, scale: 1.02 }}
        transition={{ duration: 0.4 }}
        onClick={handleAddressClick}
        sx={{ cursor: 'pointer' }}
      >
        <CardContent sx={{ textAlign: 'center', p: 0, position: 'relative', zIndex: 1 }}>
          <CountryFlag>
            {flag}
          </CountryFlag>
          
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              color: '#1a1a2e',
              mb: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {country}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666',
              fontWeight: 500,
              mb: 3 
            }}
          >
            {city}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <IconContainer bgColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <LocationOn />
            </IconContainer>
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary', 
              lineHeight: 1.6,
              mb: 3,
              fontSize: '0.95rem'
            }}
          >
            {address}
          </Typography>
          
          {timezone && (
            <Box 
              sx={{ 
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: 2,
                p: 1.5,
                mb: 2
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#667eea',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                🕐 {timezone}
              </Typography>
            </Box>
          )}
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 'medium',
              fontSize: '0.75rem'
            }}
          >
            Click to view on map
          </Typography>
        </CardContent>
      </AllianceCard>
    </MotionGrid>
  );
};

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const contactData = [
    {
      icon: <Email />,
      title: 'Email',
      content: 'hrhaat@kpro.co.in',
      link: true,
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <Phone />,
      title: 'Phone',
      content: '+91 9403621934',
      link: true,
      bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <LocationOn />,
      title: 'Address',
      content: 'The Hive at VR Bengaluru, ITPL Main Road, Mahadevpura, Bengaluru - 560048',
      link: true,
      bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  // International Alliance Offices Data
  const internationalOffices = [
    {
      
      country: 'United States',
      city: 'Wyoming',
      address: 'KPro Solutions, 30 N GOULD ST STE 37516 SHERIDAN WY 82801',
     
    },
    {
      
      country: 'United Kingdom',
      city: 'SwanSea',
      address: 'JF Soft Limited,Princess House,Rincess Way,SwanSea,SA1,3LW',
   
    },
   
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <AnimatedHeroBackground />
        <Container>
          <HeroContent 
            isMobile={isMobile}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <MotionTypography
              variant={isMobile ? 'h4' : 'h3'}
              component="h1"
              fontWeight="bold"
              sx={{ mb: 3 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Contact Us
            </MotionTypography>
            <MotionTypography
              variant="body1"
              sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7, opacity: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              Get in touch with our team for sales inquiries, technical support, or any questions about HRHaaT. We're here to help you streamline your HR processes and achieve your organizational goals.
            </MotionTypography>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Contact Information Section */}
      <ContactSection isMobile={isMobile}>
        <Container maxWidth="lg">
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            sx={{ mb: 6 }}
          >
            <MotionTypography
              variant={isMobile ? "h5" : "h4"}
              component="h2"
              fontWeight="bold"
              textAlign="center"
              sx={{ mb: 2 }}
              variants={fadeIn}
            >
              Get In Touch
            </MotionTypography>
            <MotionTypography
              variant="body1"
              textAlign="center"
              sx={{ color: 'text.secondary', mb: 6, maxWidth: 600, mx: 'auto' }}
              variants={fadeIn}
            >
              Reach out to us through any of the following channels. Our team is ready to assist you with your HRHaaT needs.
            </MotionTypography>
          </MotionBox>

          <MotionGrid 
            container 
            spacing={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
            sx={{ mb: 8 }}
          >
            {contactData.map((contact, index) => (
              <ContactInfo 
                key={index}
                {...contact}
              />
            ))}
          </MotionGrid>
        </Container>
      </ContactSection>

      {/* International Alliance Section */}
      <AllianceSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            sx={{ mb: 6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
             
            </Box>
            
            <MotionTypography
              variant={isMobile ? "h5" : "h4"}
              component="h2"
              fontWeight="bold"
              textAlign="center"
              sx={{ mb: 2 }}
              variants={fadeIn}
            >
              🌍 International Alliance
            </MotionTypography>
            <MotionTypography
              variant="body1"
              textAlign="center"
              sx={{ 
                color: 'text.secondary', 
                mb: 6, 
                maxWidth: 700, 
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.7
              }}
              variants={fadeIn}
            >
              HRHaaT extends its reach globally through strategic partnerships and alliance offices. 
              Connect with our international teams for localized support and services.
            </MotionTypography>
          </MotionBox>

          <MotionGrid 
            container 
            spacing={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerChildren}
            justifyContent="center"
            sx={{ maxWidth: '800px', mx: 'auto' }}
          >
            {internationalOffices.map((office, index) => (
              <InternationalOffice 
                key={index}
                {...office}
              />
            ))}
          </MotionGrid>

    
         
        </Container>
      </AllianceSection>
    </Box>
  );
};

export default Contact; 