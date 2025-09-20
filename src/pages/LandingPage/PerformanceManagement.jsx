import React from 'react';
import styled from 'styled-components';
import { Box, Typography, Grid, Container, useMediaQuery, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import performanceImage from '../../assets/images/performance-mgmt.png';
import { motion, useInView } from "framer-motion";

// Styled components
const SectionContainer = styled.div`
  padding: 80px 0;
  background-color: #F5F5F5;
  overflow-x: hidden;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
  
  @media (max-width: 480px) {
    padding: 40px 0;
  }
`;

const ContentWrapper = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-x: hidden;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 30px;
  }
  
  @media (max-width: 768px) {
    gap: 25px;
  }
  
  @media (max-width: 576px) {
    gap: 20px;
    padding: 0 16px;
  }
`;

const ContentContainer = styled.div`
  width: 50%;
  padding-right: 40px;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    width: 100%;
    padding-right: 0;
    order: 2; // On mobile, content goes below image
  }
  
  @media (max-width: 768px) {
    padding: 0 10px;
  }
  
  @media (max-width: 576px) {
    padding: 0 5px;
  }
`;

const ImageContainer = styled(motion.div)`
  width: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    width: 100%;
    justify-content: center;
    order: 1; // On mobile, image goes above content
  }
`;

const MainTitle = styled(motion.h2)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #18254a;
  margin-bottom: 1.5rem;
  margin-top: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    font-size: 1.6rem;
    white-space: normal; /* Allow wrapping on smaller screens */
    text-align: center;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 2rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    font-size: 1rem;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }
`;

const FeatureList = styled(motion.div)`
  margin-top: 1.5rem;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    max-width: 500px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 576px) {
    margin-bottom: 0.7rem;
  }
`;

const CheckIcon = styled(CheckCircleIcon)`
  color: rgb(59, 139, 17);
  margin-right: 10px;
  font-size: 1.5rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.2rem;
    margin-right: 8px;
  }
`;

const FeatureText = styled.span`
  font-size: 1.1rem;
  color: #2d3748;
  word-wrap: break-word;
  overflow-wrap: break-word;
  flex: 1;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const ResponsiveImage = styled(Box)`
  width: 100%;
  max-width: 600px;
  height: auto;
  object-fit: contain;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    max-width: 500px;
  }
  
  @media (max-width: 768px) {
    max-width: 400px;
  }
  
  @media (max-width: 576px) {
    max-width: 300px;
  }
`;

const PerformanceManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1,
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
        duration: 1,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 1,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };


  return (
    <SectionContainer>
      <ContentWrapper maxWidth="lg">
        {/* Left side content */}
        <ContentContainer>
          <MainTitle 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={titleVariants}
          >
            PERFORMANCE MANAGEMENT
          </MainTitle>
          
          <Description 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={descriptionVariants}
          >
            Regular performance management with HRHaaT encourages your employees to
            aim for excellence. Then, your organization is set up for success and growth
            while.
          </Description>

          <FeatureList
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ 
              hidden: {}, 
              visible: {} 
            }}
          >
            {[
              "360 Performance reviews and templates",
              "Management By Objectives", 
              "Self-Evaluation Tools",
              "Performance reports"
            ].map((feature, index) => (
              <FeatureItem
                key={feature}
                variants={featureVariants}
                transition={{ delay: isMobile ? 0.3 + (index * 0.1) : 0.5 + (index * 0.2) }}
                custom={index}
              >
                <CheckIcon />
                <FeatureText>{feature}</FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </ContentContainer>
        
        {/* Right side image */}
        <ImageContainer   
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={imageVariants}
        >
          <ResponsiveImage
            component="img"
            src={performanceImage}
            alt="Performance Management System"
          />
        </ImageContainer>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default PerformanceManagement;