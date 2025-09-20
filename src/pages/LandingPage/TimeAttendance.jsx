import React, { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Box, Grid, Container, useMediaQuery, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import tadImage from "../../assets/images/tadImage.png";


import tadImage1 from "../../assets/images/tad1.png";
import tadImage2 from "../../assets/images/tad2.png";
import tadImage3 from "../../assets/images/tad3.png";

const SectionContainer = styled.div`
  padding: 80px 0;
  background-color: #ffffff;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
  
  @media (max-width: 480px) {
    padding: 40px 0;
  }
`;

const ContentContainer = styled.div`
  padding: 0 40px;
  
  @media (max-width: 992px) {
    padding: 0 30px;
  }
  
  @media (max-width: 768px) {
    padding: 0 20px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 0 15px;
  }
`;

const MainTitle = styled(motion.h2)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a2b5e;
  margin-bottom: 1.5rem;
  
  @media (max-width: 992px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }
`;

const FeatureList = styled.div`
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 1rem;
  }
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.7rem;
  }
`;

const CheckIcon = styled(CheckCircleIcon)`
  color: rgb(59, 139, 17);
  margin-right: 10px;
  font-size: 1.5rem;
  flex-shrink: 0;
  
  @media (max-width: 992px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-right: 8px;
  }
`;

const FeatureText = styled.span`
  font-size: 1.1rem;
  color: #2d3748;
  
  @media (max-width: 992px) {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

// Updated carousel containers
const CarouselContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const CarouselImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 16/10;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  @media (max-width: 768px) {
    max-width: 90%;
    aspect-ratio: 4/3;
  }
`;

const CarouselImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const CarouselDots = styled.div`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
  
  @media (max-width: 768px) {
    bottom: -35px;
    gap: 6px;
  }
`;

const CarouselDot = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#1a2b5e' : 'rgba(26, 43, 94, 0.3)'};
  cursor: pointer;
  border: 2px solid rgba(26, 43, 94, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #1a2b5e;
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

// Time and Attendance Carousel Component
const TimeAttendanceCarousel = ({ isMobile }) => {
  // Replace these with your actual time attendance images
  const images = [
    { src: tadImage1 || tadImage, alt: 'Employee Clock-in Dashboard' },
    { src: tadImage2 || tadImage, alt: 'Attendance Reports' },
    { src: tadImage3 || tadImage, alt: 'Time Tracking Interface' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds for better readability

    return () => clearInterval(interval);
  }, [images.length]);

  const imageVariants = {
    enter: {
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: isMobile ? 0.8 : 1,
        delay: isMobile ? 0.2 : 0.4,
        ease: "easeOut"
      }
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <CarouselImageWrapper>
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
      </CarouselImageWrapper>
    </CarouselContainer>
  );
};

const TimeAttendance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isVerySmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: isMobile ? 0.8 : 1,
        ease: "easeOut"
      }
    }
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: isMobile ? 0.8 : 1,
        delay: isMobile ? 0.1 : 0.2,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: isMobile ? 20 : 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: isMobile ? 0.7 : 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <SectionContainer>
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={{ xs: 3, sm: 4, md: 6, lg: 8 }} 
          alignItems="center"
          direction={isMobile ? "column-reverse" : "row"}
        >
          {/* Left side content */}
          <Grid item xs={12} md={6}>
            <ContentContainer>
              <MainTitle 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={titleVariants}
              >
                TIME AND ATTENDANCE
              </MainTitle>
              
              <Description
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={descriptionVariants}
              >
                Allow time for greatness and unlock higher productivity through our integrated
                and advanced time and attendance management system. Similarly create a
                digitally seamless onboarding experience so that shortens the new employees'
                time to productivity. Then set them up for success and build delightful employee
                journeys from day one.
              </Description>
              
              <FeatureList>
                {[
                  "Enhanced employee accountability",
                  "Accurate payroll processing", 
                  "Flexible, instantaneous attendance recording",
                  "Attendance policies that are transparent and consistent"
                ].map((feature, index) => (
                  <FeatureItem
                    key={feature}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={featureVariants}
                    transition={{ delay: isMobile ? 0.3 + (index * 0.1) : 0.5 + (index * 0.2) }}
                  >
                    <CheckIcon />
                    <FeatureText>{feature}</FeatureText>
                  </FeatureItem>
                ))}
              </FeatureList>
            </ContentContainer>
          </Grid>
          
          {/* Right side carousel */}
          <Grid item xs={12} md={6}>
            <TimeAttendanceCarousel isMobile={isMobile} />
          </Grid>
        </Grid>
      </Container>
    </SectionContainer>
  );
};

export default TimeAttendance;