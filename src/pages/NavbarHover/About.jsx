import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';

const AboutContainer = styled(Paper)`
  width: 300px;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  margin-top: 0.7rem;
  background-color: #fff;
  border-radius: 12px;
  
  @media (max-width: 600px) {
    width: 280px;
    padding: 16px;
  }
`;

const AboutItemWrapper = styled(Box)`
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 12px;
  width: 100%;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 600px) {
    padding: 12px;
    margin-bottom: 8px;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
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
  
  &:active {
    transform: translateY(-2px);
    transition: all 0.1s ease;
  }
`;

const AboutIcon = styled(Box)`
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f0f7ff;
  border-radius: 8px;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease, background-color 0.3s ease;
  
  @media (max-width: 600px) {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
  
  svg {
    color: #1976d2;
    font-size: 22px;
    transition: color 0.3s ease;
    
    @media (max-width: 600px) {
      font-size: 20px;
    }
  }
  
  ${AboutItemWrapper}:hover & {
    transform: scale(1.15);
    background-color: #e3f2fd;
    
    svg {
      color: #1565C0;
    }
  }
`;

const AboutContent = styled(Box)`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const AboutTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 1rem;
  color: #333;
  transition: color 0.3s ease;
  
  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
  
  ${AboutItemWrapper}:hover & {
    color: #1565C0;
  }
`;

const AboutDescription = styled.div`
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
  transition: color 0.3s ease;
  
  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
  
  ${AboutItemWrapper}:hover & {
    color: #444;
  }
`;

const About = ({ onClose, onNavigate }) => {
  const navigate = useNavigate();

  // Configuration for about items
  const aboutItems = [
    {
      id: 'our-story',
      title: 'Our Story',
      icon: <DescriptionIcon />,
      description: 'Discover our value and journey easier',
      path: '/ourstory',
      action: 'navigate'
    },
    {
      id: 'contact-us',
      title: 'Contact Us',
      icon: <EmailIcon />,
      description: 'Reach out for support and Inquiries',
      path: '/contact',
      action: 'navigate'
    }
  ];

  /**
   * Handles click events for about items
   * @param {Object} item - The clicked item object
   */
  const handleClick = (item) => {
    try {
      switch (item.action) {
        case 'navigate':
          if (navigate) {
            navigate(item.path);
          } else if (onNavigate) {
            onNavigate(item.path);
          } else {
            // Fallback to window location
            window.location.href = item.path;
          }
          break;
        
        case 'external':
          window.open(item.path, '_blank', 'noopener,noreferrer');
          break;
        
        case 'email':
          window.location.href = `mailto:${item.path}`;
          break;
        
        case 'phone':
          window.location.href = `tel:${item.path}`;
          break;
        
        default:
          console.warn(`Unknown action type: ${item.action}`);
      }
      
      // Close dropdown if onClose callback is provided
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    } catch (error) {
      console.error('Error handling about item click:', error);
    }
  };


  const handleKeyPress = (event, item) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(item);
    }
  };

  return (
    <AboutContainer 
      elevation={1}
      role="menu"
      aria-label="About menu"
    >
      {aboutItems.map((item) => (
        <AboutItemWrapper 
          key={item.id}
          onClick={() => handleClick(item)}
          onKeyPress={(e) => handleKeyPress(e, item)}
          role="menuitem"
          tabIndex={0}
          aria-label={`${item.title}: ${item.description}`}
        >
          <AboutIcon aria-hidden="true">
            {item.icon}
          </AboutIcon>
          <AboutContent>
            <AboutTitle>{item.title}</AboutTitle>
            <AboutDescription>{item.description}</AboutDescription>
          </AboutContent>
        </AboutItemWrapper>
      ))}
    </AboutContainer>
  );
};

export default About;