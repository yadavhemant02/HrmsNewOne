import React from 'react';
import { Box, useTheme, alpha, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define the animation keyframes
const dotsAnimation = keyframes`
  20% {
    background-position: 0% 0%, 50% 50%, 100% 50%;
  }
  40% {
    background-position: 0% 100%, 50% 0%, 100% 50%;
  }
  60% {
    background-position: 0% 50%, 50% 100%, 100% 0%;
  }
  80% {
    background-position: 0% 50%, 50% 50%, 100% 100%;
  }
`;

// Create the styled component with the animation
const DotsLoader = styled(Box)(({ theme, size = 'medium', color }) => {
  // Size variants
  const sizeValues = {
    small: { width: 42, height: 20, dotSize: 10 },
    medium: { width: 56, height: 26.9, dotSize: 13.4 },
    large: { width: 70, height: 33.6, dotSize: 16.7 },
  };
  
  const { width, height, dotSize } = sizeValues[size] || sizeValues.medium;
  
  // Use the color from props or default to primary from theme
  const dotColor = color || theme.palette.primary.main;
  
  return {
    width: `${width}px`,
    height: `${height}px`,
    background: `
      radial-gradient(circle closest-side, ${dotColor} 90%, transparent) 0% 50%,
      radial-gradient(circle closest-side, ${dotColor} 90%, transparent) 50% 50%,
      radial-gradient(circle closest-side, ${dotColor} 90%, transparent) 100% 50%
    `,
    backgroundSize: `calc(100%/3) ${dotSize}px`,
    backgroundRepeat: 'no-repeat',
    animation: `${dotsAnimation} 1s infinite linear`,
  };
});

// The component with props for customization
const ShapesLoader = ({ 
  size = 'medium', 
  color, 
  sx,
  ...otherProps 
}) => {
  const theme = useTheme();
  
  // Use either provided color or a gradient based on the primary color
  const loaderColor = color || 
    `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.7)})`;
  
  return (
    <DotsLoader 
      size={size} 
      color={loaderColor} 
      sx={{
        ...sx,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        },
      }}
      {...otherProps}
    />
  );
};

export default ShapesLoader;