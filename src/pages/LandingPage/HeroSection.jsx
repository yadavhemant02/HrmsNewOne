import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Grid,
  Typography,
  Container,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AppsIcon from '@mui/icons-material/Apps';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Visibility from '@mui/icons-material/Visibility';
import LandingImage from "../../assets/images/LandingImage.png";
import heroBackgroundGif from "../../assets/animations/hero-background-5.gif";

// Animation keyframes
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const numberCount = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const iconFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(180deg);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const GifBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.5;
  pointer-events: none;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    transform: scale(1);
    
    @media (max-width: 768px) {
      object-fit: cover;
      opacity: 0.2;
    }
  }
`;

const HeroContainer = styled.div`
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
  padding: 40px 0 60px;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 40px 0 60px;
    min-height: auto;
  }
  
  @media (max-width: 480px) {
    padding: 30px 0 50px;
  }
`;

const ContentWrapper = styled(Container)`
  padding: 0 24px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const HeadingContainer = styled.div`
  margin-bottom: 16px;
  
  @media (max-width: 1200px) {
    text-align: center;
  }
`;

const BrandName = styled.span`
  font-size: inherit;
  font-weight: 700;
  display: inline-block;
`;

const BrandPrefix = styled(BrandName)`
  color: black;
`;

const BrandHighlight = styled(BrandName)`
  color: #0066cc;
`;

const TaglineContainer = styled.div`
  height: 70px; 
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 60px;
  }
  
  @media (max-width: 480px) {
    height: 70px;
  }
`;

const AnimatedTagline = styled(motion.div)`
  position: absolute;
  font-size: inherit;
  font-weight: 700;
  width: 100%;
  color: rgb(1, 4, 6);
`;

const Description = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 1.5rem;
  margin-bottom: 32px;
  max-width: 600px;
  
  @media (max-width: 1200px) {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 1rem;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 1200px) {
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`;

const StyledButton = styled(Button)`
  padding: 12px 32px !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 10px 24px !important;
    font-size: 0.9rem !important;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
  }
`;



const InfoContainer = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
  
  @media (max-width: 1200px) {
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    gap: 24px;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
`;

const CheckIcon = styled(CheckCircleOutlineIcon)`
  color: #4CAF50;
  margin-right: 8px;
  
  @media (max-width: 480px) {
    font-size: 20px !important;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 1200px) {
    margin-top: 20px;
  }
`;

const ResponsiveImage = styled(Box)`
  width: 100%;
  max-width: 800px;
  height: auto;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 1200px) {
    max-width: 600px;
  }
  
  @media (max-width: 768px) {
    max-width: 90%;
  }
`;

// IMPROVED STATS SECTION STYLES
const StatsSection = styled(motion.div)`
  margin-top: 80px;
  padding: 60px 16px;
  position: relative;
  z-index: 1;

  border-radius: 32px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    margin-top: 60px;
    padding: 40px 16px;
    border-radius: 24px;
  }
  
  @media (max-width: 480px) {
    margin-top: 50px;
    padding: 30px 16px;
    border-radius: 20px;
  }
`;

const StatsHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const StatsTitle = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg,rgb(4, 6, 13));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const StatsSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #64748b;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0 20px;
  }
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
    max-width: 350px;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ gradientColor }) => gradientColor};
    opacity: 0;
    transition: opacity 0.4s ease;
    border-radius: 24px;
  }
  
  &:hover {
    transform: translateY(-15px) scale(1.02);
    animation: ${pulseGlow} 2s infinite;
    
    &::before {
      opacity: 0.1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 20px;
    
    &:hover {
      transform: translateY(-8px) scale(1.01);
    }
  }
`;

const StatIconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  background: ${({ gradientColor }) => gradientColor};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  
  svg {
    font-size: 40px;
    color: white;
   
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    border-radius: 16px;
    
    svg {
      font-size: 35px;
    }
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    
    svg {
      font-size: 30px;
    }
  }
`;

const StatNumber = styled(motion.div)`
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
  animation: ${numberCount} 0.8s ease-out;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled(motion.div)`
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 600;
  position: relative;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const FloatingDecoration = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  pointer-events: none;
  
  &:nth-child(1) {
    top: 10%;
    left: 5%;
  }
  
  &:nth-child(2) {
    top: 70%;
    right: 10%;
    width: 150px;
    height: 150px;
  }
  
  &:nth-child(3) {
    bottom: 20%;
    left: 15%;
    width: 80px;
    height: 80px;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const decorationVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 2,
      ease: "easeOut"
    }
  }
};

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Taglines
  const taglines = [
    "Workforce Solutions",
    "Free for Lifetime",
    "Easy to Customize",
    "Boost Productivity",
    "Simplify Workflows",
    "AI Enabled"
  ];
  
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [taglines.length]);

  const fadeOutVariant = {
    initial: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15, transition: { duration: 0.6 } }
  };
  
  const fadeInVariant = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const statsData = [
    {
      id: 'companies',
      icon: <BusinessIcon />,
      number: '10+',
      label: 'Companies',
      gradientColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'employees',
      icon: <PeopleIcon />,
      number: '1.5k',
      label: 'Employees',
      gradientColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'features',
      icon: <AppsIcon />,
      number: '100+',
      label: 'Features',
      gradientColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  return (
    <HeroContainer>
      {/* GIF Background */}
      {/* <GifBackground>
        <img src={heroBackgroundGif} alt="Animated background" />
      </GifBackground> */}
      
      <ContentWrapper maxWidth="lg">
        {/* Hero Content */}
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Text Content */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <HeadingContainer>
                <Typography 
                  variant="h1" 
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div>
                    <BrandPrefix>HR</BrandPrefix>
                    <BrandHighlight>HaaT</BrandHighlight>
                  </div>
                  <TaglineContainer>
                    <AnimatePresence mode="wait">
                      <AnimatedTagline
                        key={currentTaglineIndex}
                        initial={fadeInVariant.initial}
                        animate={fadeInVariant.animate}
                        exit={fadeOutVariant.exit}
                      >
                        {taglines[currentTaglineIndex]}
                      </AnimatedTagline>
                    </AnimatePresence>
                  </TaglineContainer>
                </Typography>
              </HeadingContainer>
              
              <Description>
                Core HR management, performance management, workflows, attendance management,
                payroll, leave management, task management, onboarding and recruitment made simple.
              </Description>
              
              {/* Additional Info */}
              <InfoContainer>
                <InfoItem>
                  <CheckIcon fontSize={isExtraSmall ? "small" : "medium"} />
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    No Credit Card Required
                  </Typography>
                </InfoItem>
                
                <InfoItem>
                  <CheckIcon fontSize={isExtraSmall ? "small" : "medium"} />
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    No Commitment
                  </Typography>
                </InfoItem>
              </InfoContainer>
            </motion.div>
          </Grid>
          
          {/* Right Side - Image */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <ImageContainer>
                <ResponsiveImage
                  component="img"
                  src={LandingImage}
                  alt="HR Dashboard Mockup"
                />
              </ImageContainer>
            </motion.div>
          </Grid>
        </Grid>

        {/* Improved Trusted by Stats */}
        <StatsSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
            <StatsHeader>
            <StatsTitle
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Trusted by
            </StatsTitle>
            
            <StatsSubtitle
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Join thousands of organizations worldwide
            </StatsSubtitle>
          </StatsHeader>

          <StatsGrid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {statsData.map((stat, index) => (
              <StatCard
                key={stat.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                gradientColor={stat.gradientColor}
              >
                <StatIconWrapper
                  gradientColor={stat.gradientColor}
                  whileHover={{ 
                    rotate: 360,
                    transition: { duration: 0.8 }
                  }}
                >
                  {stat.icon}
                </StatIconWrapper>
                
                <StatNumber
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {stat.number}
                </StatNumber>
                
                <StatLabel>
                  {stat.label}
                </StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </StatsSection>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default HeroSection;