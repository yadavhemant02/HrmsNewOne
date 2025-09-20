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

import candsor1 from '../../assets/images/candsor1.png';
import candsor2 from '../../assets/images/candsor2.png';
import candsor4 from '../../assets/images/career1.png';
import candsor5 from '../../assets/images/candsor5.png';

// Create motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);

// Using a function component for the hero background to apply animations
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
        backgroundImage: `url(${candsor1})`,
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

const Section = ({ title, image, description, isImageLeft }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <FeatureSection isMobile={isMobile}>
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

const CandidateSourcing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      <HeroSection>
        {/* Animated background image instead of using ::before pseudo-element */}
        <AnimatedHeroBackground />
        <Container>
          <HeroContent 
            isMobile={isMobile}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }} // Delayed to start after background animation begins
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
              Candidate Sourcing
            </MotionTypography>
            <MotionTypography
              variant="body1"
              sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7, opacity: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              HRHaaT empowers you to cast a wider net and land top talent with its robust candidate sourcing capabilities.
            </MotionTypography>
          </HeroContent>
        </Container>
      </HeroSection>

      <Section
        title="Partner with Job Boards"
        image={candsor4}
        description="Maximize your hiring potential by showcasing your job openings on leading platforms like Naukri. Job boards are powerful tools to connect with actively seeking professionals in your industry and region."
        isImageLeft={true}
      />

      <Section
        title="Import Resumes Effortlessly"
        image={candsor2}
        description="The analytics capabilities within HRHaaT enable you to uncover key trends and patterns in your recruitment data. By gaining insights into what strategies deliver the best results, you can make data-driven decisions that enhance the effectiveness of your hiring process."
        isImageLeft={false}
      />

      <Section
        title="Harness the Power of Referrals"
        image={candsor5}
        description="The analytics capabilities within HRHaaT enable you to uncover key trends and patterns in your recruitment data. By gaining insights into what strategies deliver the best results, you can make data-driven decisions that enhance the effectiveness of your hiring process."
        isImageLeft={true}
      />
    </Box>
  );
};

export default CandidateSourcing;