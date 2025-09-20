import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Container, Box, useMediaQuery, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const iconFloat = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(180deg);
  }
  100% {
    transform: translateY(0px) rotate(360deg);
  }
`;



const cardGlow = keyframes`
  0% {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  100% {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
`;

const SectionContainer = styled.div`
  padding: 100px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
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
  
  @media (max-width: 992px) {
    padding: 70px 0;
  }
  
  @media (max-width: 768px) {
    padding: 50px 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg,rgb(1, 2, 8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeIn} 1s ease-out;
  letter-spacing: -0.02em;
  
  @media (max-width: 992px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.4rem;
  text-align: center;
  margin-bottom: 4rem;
  color: #64748b;
  animation: ${fadeIn} 1s ease-out 0.2s backwards;
  font-weight: 500;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 992px) {
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 2rem;
    padding: 0 20px;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
    max-width: 400px;
  }
  
  @media (max-width: 480px) {
    gap: 20px;
    max-width: 350px;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 2.5rem;
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out ${props => props.index * 0.1}s backwards;
  cursor: pointer;
  
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
    animation: ${cardGlow} 2s infinite;
    
    &::before {
      opacity: 0.05;
    }
  }

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
    
    &:hover {
      transform: translateY(-8px) scale(1.01);
    }
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: ${({ gradientColor }) => gradientColor};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  svg {
    font-size: 36px;
    color: white;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    animation: ${iconFloat} 2s infinite ease-in-out;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    
    svg {
      font-size: 30px;
    }
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    
    svg {
      font-size: 24px;
    }
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;

const ExploreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #003396 0%, #86CEFA 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    
    svg {
      transform: translateX(4px);
    }
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.95rem;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

const PlatformFeature = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const features = [
    { 
      id: 'core-hrms', 
      title: 'Core HRMS', 
      description: 'Employee management, directory, workflows, self-service, document management with advanced analytics and reporting.', 
      icon: <PeopleOutlineIcon />, 
      path: "hr-core", 
      gradientColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      id: 'attendance', 
      title: 'Attendance', 
      description: "Empower your workforce with seamless presence monitoring, dynamic shift orchestration, and smart adaptable sign-in methods.", 
      icon: <EventNoteIcon />, 
      path: "attendanceland", 
      gradientColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      id: 'leave-management', 
      title: 'Leave Management', 
      description: 'Tailor every kind of time-away policy—from vacations to sick days—with smart dashboards and comprehensive analytics.', 
      icon: <PaymentIcon />, 
      path: "leave-management", 
      gradientColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      id: 'payroll', 
      title: 'Payroll', 
      description: 'Streamline the full payroll lifecycle—from salary calculations and tax handling to benefits and detailed digital payslips.', 
      icon: <AccountBalanceWalletIcon />, 
      path: "payrollmgmt", 
      gradientColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      id: 'task-management', 
      title: 'Task Management', 
      description: 'Strategically plan tasks, monitor progress in real-time, delegate responsibilities with intelligent reminders.', 
      icon: <AssignmentIcon />, 
      path: "taskmgmt", 
      gradientColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    { 
      id: 'performance-management', 
      title: 'Performance Management', 
      description: "Empower your workforce with meaningful evaluations, aligned goals, and dynamic talent insights with ongoing feedback.", 
      icon: <BarChartIcon />, 
      path: "performance", 
      gradientColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    { 
      id: 'onboarding', 
      title: 'Onboarding', 
      description: 'Welcome new hires with clarity and confidence—bridge skills, culture, and processes for smooth transitions.', 
      icon: <EmojiPeopleIcon />, 
      path: "onboarding", 
      gradientColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    { 
      id: 'recruitment', 
      title: 'Recruitment', 
      description: 'AI-enabled engine for hiring with skill set matches, interview tracking, and comprehensive feedback systems.', 
      icon: <WorkIcon />, 
      path: "recruitment", 
      gradientColor: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    },
  ];

  const handleClick = (path) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const renderFeatureCard = (feature, index) => (
    <FeatureCard 
      key={feature.id} 
      index={index}
      gradientColor={feature.gradientColor}
      onClick={() => handleClick(feature.path)}
    >
      <CardHeader>
        <IconWrapper gradientColor={feature.gradientColor}>
          {feature.icon}
        </IconWrapper>
        <FeatureTitle>{feature.title}</FeatureTitle>
      </CardHeader>
      
      <FeatureDescription>{feature.description}</FeatureDescription>
      
      <ExploreButton>
        Explore more <ArrowForwardIcon />
      </ExploreButton>
    </FeatureCard>
  );

  return (
    <SectionContainer>
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5, lg: 6 } }}>
          <SectionTitle>CORE CAPABILITIES</SectionTitle>
          <SectionSubtitle>Everything you need to create a high-performance culture</SectionSubtitle>
        </Box>

        <CardsGrid>
          {features.map((feature, index) => renderFeatureCard(feature, index))}
        </CardsGrid>
      </Container>
    </SectionContainer>
  );
};

export default PlatformFeature;