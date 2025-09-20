import React from 'react';
import styled from 'styled-components';
import { Box, Paper } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';

const ResourcesContainer = styled(Paper)`
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

const ResourceItemWrapper = styled(Box)`
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
`;

const ResourceIcon = styled(Box)`
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
  
  ${ResourceItemWrapper}:hover & {
    transform: scale(1.15);
    background-color: #e3f2fd;
    
    svg {
      color: #1565C0;
    }
  }
`;

const ResourceContent = styled(Box)`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const ResourceTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 1rem;
  color: #333;
  transition: color 0.3s ease;
  
  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
  
  ${ResourceItemWrapper}:hover & {
    color: #1565C0;
  }
`;

const ResourceDescription = styled.div`
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
  transition: color 0.3s ease;
  
  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
  
  ${ResourceItemWrapper}:hover & {
    color: #444;
  }
`;

const Resources = () => {
  const resourceItems = [
    {
      title: 'Downloads',
      icon: <DownloadIcon />,
      description: 'Desktop/Mobile Utility for Data Synchronization'
    },
    {
      title: 'Case Studies',
      icon: <DescriptionIcon />,
      description: 'Essential Documents and Policies Templates'
    }
  ];

  return (
    <ResourcesContainer elevation={3}>
      {resourceItems.map((item, index) => (
        <ResourceItemWrapper key={index}>
          <ResourceIcon>
            {item.icon}
          </ResourceIcon>
          <ResourceContent>
            <ResourceTitle>{item.title}</ResourceTitle>
            <ResourceDescription>{item.description}</ResourceDescription>
          </ResourceContent>
        </ResourceItemWrapper>
      ))}
    </ResourcesContainer>
  );
};

export default Resources;