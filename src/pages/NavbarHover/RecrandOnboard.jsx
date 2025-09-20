import React from 'react';
import styled from 'styled-components';
import { Box, Grid, Typography, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import WorkIcon from '@mui/icons-material/Work';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

import BarChartIcon from '@mui/icons-material/BarChart';

import SupportIcon from '@mui/icons-material/ContactSupport';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MegaMenuContainer = styled(Paper)`
  width: 90vw;
  position: absolute;
  top: 100%;
  left: 5vw;
  right: 5vw;
  margin-top: 0.7rem;
  z-index: 1000;
  padding: 20px 40px;
  background-color: #fff;
  margin-left: 50%;
  transform: translateX(-50%);
`;

const MenuContentWrapper = styled(Box)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
`;

const MenuItemCard = styled(Box)`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  
  &:hover {
    background-color: #f5f9ff;
    border-color: #e0e9ff;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    
    &:before {
      opacity: 1;
    }
  }
`;

const MenuItemIcon = styled(Box)`
  margin-right: 16px;
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
`;

const MenuItemContent = styled(Box)`
  flex: 1;
`;

const MenuItemTitle = styled(Typography)`
  font-weight: 600 !important;
  margin-bottom: 8px !important;
  font-size: 1rem !important;
  color: #333;
`;

const MenuItemDescription = styled(Typography)`
  color: #666;
  font-size: 0.85rem !important;
  line-height: 1.5 !important;
`;

// The Recruitment and Onboarding Management Mega Menu Component
const RecrandOnboard = ({onClose}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();


  const handleClick=(path)=>{
    if(path){
      navigate(path);
    }

    if(onClose){
      onClose();
    }
  }

  const menuItems = [
    {
      title: 'Candidate Sourcing',
      icon: <PersonSearchIcon sx={{ fontSize: 24, color: '#1976d2' }} />,
      description: 'Find top talent faster and easier.',
      path:"candidatesourcing"
    },
    {
      title: 'Job Requisition Management',
      icon: <DescriptionIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
      description: 'Streamline job posting and approval workflows.',
      path:"jobrequisition",
    },
    {
      title: 'Candidate Management',
      icon: <PeopleIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
      description: 'Organize and track candidates throughout the hiring process.',
      path: "candmanagement",
          },
    {
      title: 'Career Page',
      icon: <WorkIcon sx={{ fontSize: 24, color: '#E91E63' }} />,
      description: 'Attract top talent with a stunning and informative career page.',
      path:"careerpage",
    },
    {
      title: 'Pre-boarding',
      icon: <AutorenewIcon sx={{ fontSize: 24, color: '#9C27B0' }} />,
      description: 'Welcome new hires with a smooth and efficient onboarding experience.',
      path:"preboarding",
    },

        {
          title: 'Recruitment',
          icon: <WorkIcon sx={{ fontSize: 24, color: '#9C27B0' }} />,
          description: 'Unlocking potential by connecting talent with opportunity.',
          path: "recruitment"
        
        },
  
  
    {
      title: 'Reports and Analytics',
      icon: <BarChartIcon sx={{ fontSize: 24, color: '#3F51B5' }} />,
      description: 'Make data-driven hiring decisions with actionable insights.',
      path:"report"
    },
    {
      title: 'Surveys',
      icon: <FeedbackIcon sx={{ fontSize: 24, color: '#8BC34A' }} />,
      description: 'Gather valuable candidate feedback and improve your hiring process.',
      path:"surveys"
    },
    {
      title: 'Support and Assistance',
      icon: <SupportIcon sx={{ fontSize: 24, color: '#F44336' }} />,
      description: 'Dedicated support to guide you through the process.',
      path:"support"
    }
  ];

  return (
    <MegaMenuContainer elevation={1}>
      <MenuContentWrapper>
        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <MenuItemCard  onClick={item.path 
                  ? () => handleClick(item.path) 
                  : undefined
                }>
                <MenuItemIcon>
                  {item.icon}
                </MenuItemIcon>
                <MenuItemContent>
                  <MenuItemTitle variant="h6">{item.title}</MenuItemTitle>
                  <MenuItemDescription variant="body2">{item.description}</MenuItemDescription>
                </MenuItemContent>
              </MenuItemCard>
            </Grid>
          ))}
        </Grid>
      </MenuContentWrapper>
    </MegaMenuContainer>
  );
};

export default RecrandOnboard;