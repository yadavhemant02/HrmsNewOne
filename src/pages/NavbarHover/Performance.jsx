import React from 'react';
import {
  Typography,
  Box,
  Container,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';

import WorkIcon from '@mui/icons-material/Work';

import requisitionImage from '../../assets/images/requisition-management.png';
import orgImage from '../../assets/images/org.png';
import workflowImage from '../../assets/images/workflowengine.png';
import performanceImage from '../../assets/images/performance-management.jpg';

const HeroSection = styled(Box)(({ backgroundImage }) => ({
  position: 'relative',
  minHeight: 400,
  width: '100%',
  overflow: 'hidden',
  background: 'linear-gradient(to right, #000000 50%, transparent 50%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '55%',
    height: '100%',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
    clipPath: 'polygon(8% 0%, 100% 0, 100% 100%, 0% 100%)',
  },
  '@media (max-width: 900px)': {
    background: '#000000',
    '&::before': {
      width: '100%',
      clipPath: 'none',
      opacity: 0.2,
    }
  }
}));

const HeroContent = styled(Box)(({ isMobile }) => ({
  position: 'relative',
  zIndex: 2,
  padding: isMobile ? '60px 20px' : '50px 0px',
  color: 'white',
  maxWidth: isMobile ? '100%' : '45%',
  textAlign: isMobile ? 'center' : 'left'
}));

const FeatureSection = styled(Box)(({ isMobile, bgColor }) => ({
  padding: isMobile ? '40px 0' : '80px 0',
  backgroundColor: bgColor || 'white'
}));

const ImageContainer = styled(Box)`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 16/9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }
  }

  @media (max-width: 900px) {
    aspect-ratio: 4/3;
    max-width: 100%;
  }
`;

const FeatureCard = styled(Box)`
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  transition: all 0.3s ease;
  margin-bottom: 24px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 600px) {
    margin-bottom: 16px;
  }
`;

const CardGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
  margin-top: 32px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FeatureIcon = styled(Box)(({ bgcolor, iconcolor }) => ({
  width: 64,
  height: 64,
  borderRadius: 16,
  background: bgcolor || '#e3f2fd',
  color: iconcolor || '#1976d2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  transition: 'all 0.3s ease',

  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
  },

  svg: {
    fontSize: 32
  }
}));

const FeatureList = styled(Box)`
  margin-top: 24px;
`;

const FeatureItem = styled(Box)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;

  svg {
    color: #1976d2;
    margin-right: 12px;
    margin-top: 4px;
  }
`;

const goalfeatures = [
  {
    title: 'Better alignment with strategy',
    
    
  },
  {
    title: 'Auto-Sync Goal Achievement',

   
  },
  {
    title: 'Library & Goal Plans',
   
  },
  {
    title: 'Cascade Goals',
   
  }
];

const talentfeatures = [
    {
      title: 'Career Plans & IDP',
      
      
    },
    {
      title: 'Efficient employee case management',
  
     
    },
    {
      title: 'Smart HR workflows',
     
    },
    {
      title: 'Insightful analytics',
     
    }
  ];


  const conversationfeatures = [
    {
      title: 'Daily performance management, not an annual event',
      
      
    },
    {
      title: 'Status Updates',
  
     
    },
    {
      title: 'Performance Journals',
     
    },
    {
      title: 'Continuous Feedback',
     
    }
  ];


  const Section = ({ title, image, description, isImageLeft, features }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
    return (
      <FeatureSection isMobile={isMobile}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: isImageLeft ? 1 : 2, md: isImageLeft ? 1 : 2 }}>
              <ImageContainer>
                <img src={image} alt={title} />
              </ImageContainer>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: isImageLeft ? 2 : 1, md: isImageLeft ? 2 : 1 }}>
              <FeatureIcon>
                <WorkIcon fontSize="large" />
              </FeatureIcon>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.7 }}>
                {description}
              </Typography>
              <CardGrid>
                {features.map((feature, index) => (
                  <FeatureCard key={index}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold" 
                      sx={{ mb: 2 }}
                    >
                      {feature.title}
                    </Typography>
                    {feature.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    )}
                  </FeatureCard>
                ))}
              </CardGrid>
            </Grid>
          </Grid>
        </Container>
      </FeatureSection>
    );
  };
  
  const Performance = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
    return (
      <Box>
        <HeroSection backgroundImage={performanceImage}>
          <Container>
            <HeroContent isMobile={isMobile}>
              <Typography
                variant={isMobile ? 'h3' : 'h4'}
                component="h1"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                Performance Management
              </Typography>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{ mb: 3, fontWeight: 500 }}
              >
                Organization with Success
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7, opacity: 0.9 }}
              >
                Encourage employees to think outside the box and drive brilliance at work. Try HRHaaT Performance Management, trusted by top organizations worldwide.
              </Typography>
            </HeroContent>
          </Container>
        </HeroSection>
  
        <Section
          title="Goals Settings"
          image={requisitionImage}
          description="Align performance objectives with company mission. Cascade goals, sync achievements, and align strategy."
          isImageLeft={false}
          features={goalfeatures}
        />
  
        <Section
          title="Talent Development"
          image={orgImage}
          description="Fast-track careers with personalized development plans. Address skill gaps and boost career milestones with learning insights."
          isImageLeft={true}
          features={talentfeatures}
        />
  
        <Section
          title="Conversations"
          image={workflowImage}
          description="Foster a continuous performance culture. Use journals, feedback, and updates to enable dynamic employee engagement."
          isImageLeft={false}
          features={conversationfeatures}
        />
      </Box>
    );
  };
  
  export default Performance;