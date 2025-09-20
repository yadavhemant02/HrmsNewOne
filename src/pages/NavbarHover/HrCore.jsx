import React, { useState, useEffect } from 'react';
import { 
  Typography,
  Box,
  Container,
  Grid,
  Avatar,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsIcon from '@mui/icons-material/Settings';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import workflowImage from '../../assets/images/workflowengine.png';
import orgImage from '../../assets/images/org.png';
import empdirImage from '../../assets/images/empdir.png';
import hrmgmtImage from '../../assets/images/hrmgmt.png';
import letterGeneration from '../../assets/images/letterGeneration.png';

// Add these additional images for the carousel
// You'll need to import your actual letter generation images
import letterImage1 from '../../assets/images/genletter-2.png';
import letterImage2 from '../../assets/images/genletter-3.png';
import letterImage3 from '../../assets/images/genletter-6.png';

// Create motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);

// Animated Carousel Container
const CarouselContainer = styled(MotionBox)`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  @media (max-width: 900px) {
    aspect-ratio: 4/3;
    max-width: 100%;
  }
`;

const CarouselImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
`;

const CarouselDots = styled(Box)`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const CarouselDot = styled(motion.div)(({ active }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  border: '2px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
}));


const LetterGenerationCarousel = () => {
  
  const images = [
    { src: letterImage1 || letterGeneration, alt: 'Offer Letter Generation' },
    { src: letterImage2 || letterGeneration, alt: 'Employment Certificate' },
    { src: letterImage3 || letterGeneration, alt: 'Relieving Letter' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [images.length]);

  const imageVariants = {
    enter: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
    >
      <AnimatePresence mode="wait">
        <CarouselImage
          key={currentIndex}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          loading="lazy"
        />
      </AnimatePresence>
      
      <CarouselDots>
        {images.map((_, index) => (
          <CarouselDot
            key={index}
            active={index === currentIndex}
            onClick={() => handleDotClick(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </CarouselDots>
    </CarouselContainer>
  );
};


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
        backgroundImage: `url(${hrmgmtImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
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
    aspect-ratio: 4/3;
    max-width: 100%;
  }
`;

const FeatureIcon = styled(motion(Avatar))(({ bgcolor }) => ({
  width: 80,
  height: 80,
  backgroundColor: bgcolor || '#1976d2',
  marginBottom: '16px'
}));

const FeatureBox = styled(MotionBox)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '20px',
  cursor: 'pointer'
});

const FeaturesGrid = styled(MotionGrid)({
  marginTop: '40px'
});

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

const iconAnimation = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Regular Section Component
const Section = ({ title, image, description, isImageLeft, bgColor }) => {
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <FeatureSection isMobile={isMobile} bgColor={bgColor}>
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
            order={{ xs: isImageLeft ? 1 : 2, md: isImageLeft ? 1 : 2 }}
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
            order={{ xs: isImageLeft ? 2 : 1, md: isImageLeft ? 2 : 1 }}
            variants={fadeIn}
          >
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
          </MotionGrid>
        </MotionGrid>
      </Container>
    </FeatureSection>
  );
};

// Special Letter Generation Section with Carousel
const LetterGenerationSection = ({ title, description, isImageLeft, bgColor }) => {
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <FeatureSection isMobile={isMobile} bgColor={bgColor}>
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
            order={{ xs: isImageLeft ? 1 : 2, md: isImageLeft ? 1 : 2 }}
            variants={fadeIn}
          >
            <LetterGenerationCarousel />
          </MotionGrid>
          <MotionGrid 
            item 
            xs={12} 
            md={6} 
            order={{ xs: isImageLeft ? 2 : 1, md: isImageLeft ? 2 : 1 }}
            variants={fadeIn}
          >
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
          </MotionGrid>
        </MotionGrid>
      </Container>
    </FeatureSection>
  );
};

const HrCore = () => {
  const isMobile = useMediaQuery('(max-width:900px)');

  const features = [
    {
      icon: <SettingsIcon fontSize={isMobile ? "medium" : "large"} />,
      title: "Highly Configurable",
      description: "Configure HRHaaT for any combinations of locations, departments, business units, employment types, cost center, and much more.",
      bgcolor: "#FFC107"
    },
    {
      icon: <AccountTreeIcon fontSize={isMobile ? "medium" : "large"} />,
      title: "High Scalability",
      description: "Merge, acquire, scale up or down, de-layer, consolidate, and support agile business transformations.",
      bgcolor: "#26A69A"
    },
    {
      icon: <IntegrationInstructionsIcon fontSize={isMobile ? "medium" : "large"} sx={{ color: 'white' }} />,
      title: "Seamless Integration",
      description: "Your organization's single source of information. No matter how complex your structure, employee attributes or policies.",
      bgcolor: "#000000"
    },
    {
      icon: <LockPersonIcon fontSize={isMobile ? "medium" : "large"} sx={{ color: 'white' }} />,
      title: "Advanced Security",
      description: "Protect sensitive employee data with role-based access controls and comprehensive security measures that comply with global data protection standards.",
      bgcolor: "#1A237E"
    },
    {
      icon: <DescriptionIcon fontSize={isMobile ? "medium" : "large"} />,
      title: "Comprehensive Reporting",
      description: "Generate insightful reports with customizable templates and dynamic dashboards for data-driven decision making at all organizational levels.",
      bgcolor: "#90CAF9"
    }
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
              sx={{ mb: 2 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              HR Management Software
            </MotionTypography>
            <MotionTypography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{ mb: 3, fontWeight: 500 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              Brilliance in your Hands!
            </MotionTypography>
            <MotionTypography
              variant="body1"
              sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7, opacity: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              Adapt to new realities. Work faster and smarter. Define the future of work for your 
              organization with a flexible, robust, global Core-HR module in HRHaaT.
            </MotionTypography>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Employee Directory Section */}
      <Section
        title="Employee Listing"
        image={empdirImage}
        description="Suitable for organizations of any size, regardless of their diversity. Easily set up and access all employee information promptly. Input, store, and retrieve extensive employee data efficiently within minutes, utilizing simple bulk actions."
        isImageLeft={true}
      />

      {/* Organization Section */}
      <Section
        title="Organization"
        image={orgImage}
        description="One control center, limitless possibilities! Model, visualize and configure the system for both simple and complex organisational structures. Leverage unusually good design that radically improves setup time and brings in the agility to evolve. Create flexible reporting structures, functional units, and position organograms with summary and insights."
        isImageLeft={false}
        bgColor="#F5F7FA"
      />
      
      {/* Workflow Engine Section */}
      <Section
        title="Business Flow Engine"
        image={workflowImage}
        description="Efficiently automate important processes with built-in checks using custom workflows so you never waste mental energy on standard operating procedures. Capture and route approvals with full history logs for auditing."
        isImageLeft={true}
      />

      {/* Letter Generation Section with Carousel */}
      <LetterGenerationSection
        title="Letter Generation"
        description="The Core HR module of HR HaaT simplifies and automates essential employee documentation, enabling HR teams to quickly generate professional, standardized documents such as offer letters, payslips, relieving letters, and employment or address proof certificates directly from a computer"
        isImageLeft={false}
        bgColor="#F5F7FA"
      />

      {/* Features Section */}
      <FeatureSection isMobile={isMobile} bgColor="#FFFFFF">
        <Container>
          <MotionTypography 
            variant={isMobile ? "h4" : "h3"} 
            component="h2" 
            align="center" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              mb: isMobile ? 4 : 6,
              fontSize: isMobile ? '1.8rem' : '2.5rem'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Features
          </MotionTypography>
          
          <FeaturesGrid 
            container 
            spacing={isMobile ? 3 : 4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureBox
                  variants={fadeIn}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  <FeatureIcon 
                    bgcolor={feature.bgcolor}
                    variants={iconAnimation}
                    whileHover={{ 
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                  >
                    {feature.icon}
                  </FeatureIcon>
                  <MotionTypography 
                    variant="h6" 
                    component="h3" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}
                    variants={fadeIn}
                  >
                    {feature.title}
                  </MotionTypography>
                  <MotionTypography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}
                    variants={fadeIn}
                  >
                    {feature.description}
                  </MotionTypography>
                </FeatureBox>
              </Grid>
            ))}
          </FeaturesGrid>
        </Container>
      </FeatureSection>
    </Box>
  );
};

export default HrCore;