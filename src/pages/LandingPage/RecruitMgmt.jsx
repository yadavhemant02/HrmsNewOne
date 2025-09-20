import React from 'react';
import styled from 'styled-components';
import { Box, Typography, Grid, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import recruitImage from "../../assets/images/Recruitmgmt.png";
import { motion, useInView } from 'framer-motion';
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

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-x: hidden;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 40px;
  }
  
  @media (max-width: 576px) {
    padding: 0 16px;
  }
`;

const ImageContainer = styled(motion.div)`
  width: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    width: 100%;
    justify-content: center;
    order: 2; /* Move image below content on mobile */
  }
`;

const ContentContainer = styled.div`
  width: 50%;
  padding-left: 150px;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    width: 100%;
    padding-left: 0;
    order: 1; 
  }
  
  @media (max-width: 576px) {
    padding: 0 5px;
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
  
  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
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
  
  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
  }
`;

const FeatureList = styled(motion.div)`
  margin-top: 2rem;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    margin-bottom: 1.2rem;
  }
`;

const CheckIcon = styled(CheckCircleIcon)`
  color: #1976d2;
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
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.95rem;
  }
`;

const ResponsiveImage = styled.img`
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

const RecruitMgmt = () => {


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
      <ContentWrapper>
        {/* Left side image */}
        <ImageContainer  
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, amount: 0.1 }}
         variants={imageVariants}>
          
          <ResponsiveImage 
            src={recruitImage}
            alt="Recruit Management"
          />
        </ImageContainer>
        
        {/* Right side content */}
        <ContentContainer>
        <MainTitle 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={titleVariants}
            >RECRUITMENT MANAGEMENT</MainTitle>
          <Description  
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.1 }}
           variants={descriptionVariants}>
          Accomplish the high-volume process of sourcing, tracking 
          and recruiting the best 
          talent that is aligned with your business – on a single, comprehensive, 
          centralized platform.
          </Description>



          <FeatureList>
              {[
                "Efficient & Flexible Hiring",
                "Digital Offer Process Management", 
                "Tracking & Analytics",
                "Letters & Mail Merge"
              ].map((feature, index) => (
                <FeatureItem
                  key={feature}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.1 }}
                  variants={featureVariants}
                  transition={{ delay: 0.5 + (index * 0.2) }}
                >
                  <CheckIcon />
                  <FeatureText>{feature}</FeatureText>
                </FeatureItem>
              ))}
            </FeatureList>
          
          
              
        </ContentContainer>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default RecruitMgmt;