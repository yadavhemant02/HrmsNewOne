import React from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import payrollImage from "../../assets/images/payroll.png";
import { motion } from 'framer-motion';

// Styled Components
const SectionContainer = styled.div`
  padding: 80px 20px;
  background-color: #F5F5F5;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 60px 15px;
  }

  @media (max-width: 480px) {
    padding: 40px 10px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 40px;
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
  flex: 1;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;

  @media (max-width: 992px) {
    justify-content: center;
    order: 2;
  }
`;

const ResponsiveImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: contain;
  box-sizing: border-box;

  @media (max-width: 992px) {
    max-width: 350px;
  }
  @media (max-width: 768px) {
    max-width: 300px;
  }
  @media (max-width: 576px) {
    max-width: 220px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding-left: 100px;
  box-sizing: border-box;

  @media (max-width: 992px) {
    padding-left: 0;
    order: 1;
    text-align: center;
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
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
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
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
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
  justify-content: flex-start;
  box-sizing: border-box;

  @media (max-width: 992px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
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
  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 5px;
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

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

// Component
const Payroll = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2, ease: "easeOut" },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, delay: 0.4, ease: "easeOut" },
    },
  };

  return (
    <SectionContainer>
      <ContentWrapper>
        {/* Image Section */}
        <ImageContainer
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={imageVariants}
        >
          <ResponsiveImage src={payrollImage} alt="Payroll Management" />
        </ImageContainer>

        {/* Content Section */}
        <ContentContainer>
          <MainTitle
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={titleVariants}
          >
            PAYROLL MANAGEMENT
          </MainTitle>

          <Description
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={descriptionVariants}
          >
            Streamline complex payroll processes with HRHaaT, a robust,
            secure, and precise automated system with 100% compliance. HRHaaT delivers
            faster processing, accurate payments, and helps businesses avoid
            potential financial and regulatory issues from non-compliance while ensuring
            employees receive correct compensation on schedule with meticulous payroll
            administration.
          </Description>

          <FeatureList>
            {[
              "Rapidly process payroll calculations and deductions",
              "Create detailed and accurate payslips",
              "Utilize payroll data for future financial planning",
              "Enhanced data security and privacy protection"
            ].map((feature, index) => (
              <FeatureItem
                key={feature}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={featureVariants}
                transition={{ delay: 0.5 + (index + 1) * 0.2 }}
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

export default Payroll;
