import React from 'react';
import {
  Typography,
  Box,
  Container,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import requisitionImage from '../../assets/images/requisition-management.png';
import orgImage from '../../assets/images/org.png';
import workflowImage from '../../assets/images/workflowengine.png';

// Create motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);

// Using a function component for the hero background to apply animations
const AnimatedHeroBackground = ({ backgroundImage }) => {
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
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
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
  minHeight: 300,
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

const FeatureSection = styled(Box)(({ isMobile, bgColor }) => ({
  padding: isMobile ? '40px 0' : '80px 0',
  backgroundColor: bgColor || 'white'
}));

const ImageContainer = styled(MotionBox)`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 16/9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transition: transform 0.3s ease;
  }

  @media (max-width: 900px) {
    aspect-ratio: 7/4;
    max-width: 100%;
  }
`;

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

const imageAnimation = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Feature component with icon
const FeatureIcon = styled(MotionBox)`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${props => props.bgcolor || '#e3f2fd'};
  color: ${props => props.iconcolor || '#1976d2'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    font-size: 32px;
  }
`;

const Section = ({ title, image, description, isImageLeft, icon, features }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <FeatureSection isMobile={isMobile} bgColor={isImageLeft ? '#f8f9fa' : 'white'}>
      <Container maxWidth="lg">
        <MotionGrid 
          container 
          spacing={6} 
          alignItems="center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
        >
          <MotionGrid 
            item 
            xs={12} 
            md={6} 
            order={{ xs: isImageLeft ? 2 : 1, md: isImageLeft ? 2 : 1 }}
            variants={fadeIn}
          >
            <ImageContainer 
              variants={imageAnimation}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img 
                src={image} 
                alt={title}
              />
            </ImageContainer>
          </MotionGrid>
          <MotionGrid 
            item 
            xs={12} 
            md={6} 
            order={{ xs: isImageLeft ? 1 : 2, md: isImageLeft ? 1 : 2 }}
            variants={fadeIn}
          >
            {icon && (
              <FeatureIcon
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                {icon}
              </FeatureIcon>
            )}
            <MotionTypography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight="bold" 
              gutterBottom
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {title}
            </MotionTypography>
            <MotionTypography 
              variant="body1" 
              sx={{ color: 'text.secondary', mb: 4, lineHeight: 2 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {description}
            </MotionTypography>
            
            {features && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {features.map((feature, index) => (
                  <MotionBox 
                    key={index}
                    display="flex"
                    alignItems="flex-start"
                    mb={2}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <Box color="primary.main" mr={1.5} mt={0.5}>
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </MotionBox>
                ))}
              </MotionBox>
            )}
          </MotionGrid>
        </MotionGrid>
      </Container>
    </FeatureSection>
  );
};

const Recruitment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      title: "Source the best talent",
      icon: <PersonSearchIcon />,
      description: "Track and create a rich pipeline of top candidates"
    },
    {
      title: "Job Board Integrations",
      icon: <WorkIcon />,
      description: "Post jobs to over 1000 job boards"
    },
    {
      title: "Multi-Channel Sourcing",
      icon: <GroupsIcon />,
      description: "Internal postings, referrals, and external portals"
    },
    {
      title: "Tracking & Analytics",
      icon: <AnalyticsIcon />,
      description: "Monitor recruitment metrics and performance"
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <AnimatedHeroBackground backgroundImage={requisitionImage} />
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
              Employee Recruitment
            </MotionTypography>
            <MotionTypography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{ mb: 3, fontWeight: 500 }}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Accelerate Recruitment of the Best Talent
            </MotionTypography>
            <MotionTypography
              variant="body1"
              sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7, opacity: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              Accomplish the high-volume process of sourcing, tracking, and recruiting the best talent that is aligned with your business. Do all that on a single, comprehensive, centralized platform built with great attention to detail.
            </MotionTypography>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Job and Requisition Management Section */}
      <Section
        title="Job and Requisition Management"
        image={requisitionImage}
        description="We are aware that effective talent acquisition never happens in a vacuum. With RapidHR, you can now effortlessly align your workforce strategies with your main business objectives."
        isImageLeft={false}
        icon={<WorkIcon fontSize="large" />}
        features={features}
      />

      {/* Candidate Sourcing Section */}
      <Section
        title="Candidate Sourcing"
        image={orgImage}
        description="Track and create a rich pipeline of top candidates capable of taking your business to the next level. Allow multiple recruitment channels such as internal job postings, referrals, exclusive external recruiter portals, and career page APIs."
        isImageLeft={true}
        icon={<PersonSearchIcon fontSize="large" />}
        features={features}
      />

      {/* Candidate Management Section */}
      <Section
        title="Candidate Management"
        image={workflowImage}
        description="Make your recruitment process your competitive edge by building experiences that capture the attention of top talent and keep them engaged from the beginning. Our custom branded and configurable candidate portal has everything you need."
        isImageLeft={false}
        icon={<GroupsIcon fontSize="large" />}
        features={features}
      />
    </Box>
  );
};

export default Recruitment;