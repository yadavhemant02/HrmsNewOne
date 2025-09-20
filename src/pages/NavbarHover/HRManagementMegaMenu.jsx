import React from 'react';
import styled from 'styled-components';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SpeedIcon from '@mui/icons-material/Speed';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HelpIcon from '@mui/icons-material/Help';
import WorkIcon from '@mui/icons-material/Work';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useTheme, useMediaQuery } from '@mui/material';

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
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
`;

const MenuContentWrapper = styled(Box)`
  max-width: 1200px;
  margin: 20px auto;
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
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
  
  ${MenuItemCard}:hover & {
    transform: scale(1.15);
  }
`;

const MenuItemContent = styled(Box)`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const MenuItemTitle = styled(Typography)`
  font-weight: 600 !important;
  margin-bottom: 8px !important;
  font-size: 1rem !important;
  color: #333;
  transition: color 0.3s ease;
  
  ${MenuItemCard}:hover & {
    color: #1565C0;
  }
`;

const MenuItemDescription = styled(Typography)`
  color: #666;
  font-size: 0.85rem !important;
  line-height: 1.5 !important;
  transition: color 0.3s ease;
  
  ${MenuItemCard}:hover & {
    color: #444;
  }
`;

const HRManagementMegaMenu = ({ onClose }) => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    // Navigate to the path 
    if (path) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Close the menu
    if (onClose) {
      onClose();
    }
  };

  const menuItems = [
    {
      title: 'Core HR',
      icon: <PeopleIcon sx={{ fontSize: 24, color: '#1976d2' }} />,
      description: 'Empowering organizations with seamless management of their human capital.',
      path: "hr-core"
    },
    {
      title: 'Onboarding',
      icon: <AutorenewIcon sx={{ fontSize: 24, color: '#4CAF50' }} />,
      description: 'Navigating the path to seamless integration and success.',
      path: "onboarding"
    },
    {
      title: 'Attendance',
      icon: <AccessTimeIcon sx={{ fontSize: 24, color: '#FF9800' }} />,
      description: 'Tracking presence, empowering productivity.',
      path: "attendanceland"
    },
    {
      title: 'Payroll Management',
      icon: <PaymentsIcon sx={{ fontSize: 24, color: '#E91E63' }} />,
      description: 'Efficiently streamline and automate your payroll processes with precision and reliability.',
      path: "payrollmgmt"
    },
    
    {
      title: 'Leave Management',
      icon: <EventNoteIcon sx={{ fontSize: 24, color: '#607D8B' }} />,
      description: 'Streamlining time off for a balanced and productive workforce.',
      path: "leave-management"
    },
    {
      title: 'Performance',
      icon: <SpeedIcon sx={{ fontSize: 24, color: '#00BCD4' }} />,
      description: 'Unleashing the full potential of speed and efficiency.',
      path: "performance"
    },
    {
      title: 'Task Management',
      icon: <AssignmentIcon sx={{ fontSize: 24, color: '#3F51B5' }} />,
      description: 'Efficiently organizing and prioritizing actions to maximize productivity.',
      path: "taskmgmt"
    },
    
    {
      title: 'Help & Support',
      icon: <HelpIcon sx={{ fontSize: 24, color: '#F44336' }} />,
      description: 'Guiding you towards solutions with expertise and empathy.',
      path: "support"
    }
  ];

  return (
    <MegaMenuContainer elevation={3}>
      <MenuContentWrapper>
        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <MenuItemCard 
                onClick={item.path 
                  ? () => handleClick(item.path) 
                  : undefined
                }
              >
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

export default HRManagementMegaMenu;