import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LaunchIcon from '@mui/icons-material/Launch';
import tskimg from '../../assets/images/tskmgmt.png';
import tskrem from '../../assets/images/tskrem.png';
import prgImg from '../../assets/images/progress.png';
import trcimg from '../../assets/images/tracking.png';
import { base_task_manager } from '../../http/services';

// Configuration for external task manager
const TASK_MANAGER_CONFIG = {
  url: base_task_manager, 
  openInNewTab: true, 
};

const HeroBox = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '500px',
  overflow: 'hidden',
  '@media (max-width: 900px)': {
    height: '400px',
  },
  '@media (max-width: 600px)': {
    height: '300px',
  },
});

const HeroImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
});

const WaveOverlay = styled(Box)({
  position: 'absolute',
  bottom: -2,
  left: 0,
  width: '100%',
  height: '150px',
  backgroundColor: '#fff',
  borderTopLeftRadius: '50% 80%',
  borderTopRightRadius: '50% 80%',
  zIndex: 1,
});

const HeroContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  maxWidth: '800px',
  textAlign: 'center',
  padding: '40px 48px',
  color: '#000',
  textShadow: '1px 1px 4px rgba(255,255,255,0.6)',
  zIndex: 2,
  '@media (max-width: 900px)': {
    width: '70%',
    padding: '32px 40px',
  },
  '@media (max-width: 600px)': {
    width: '80%',
    padding: '24px 32px',
  },
  '@media (max-width: 400px)': {
    width: '90%',
    padding: '230px 30px 48px 30px',
    marginLeft: "10px",
  },
});

const SectionTitle = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '1.8rem',
  '@media (max-width: 900px)': {
    fontSize: '1.8rem',
  },
  '@media (max-width: 600px)': {
    fontSize: '1.6rem',
  },
});

const FeatureItem = styled(Paper)({
  padding: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.15)',
  },
});

const FeatureIcon = styled(Box)(({ bgcolor }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  backgroundColor: bgcolor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 24,
}));

const BlueStarIcon = styled(StarIcon)({
  color: '#2196f3',
});

const SectionContainer = styled(Container)({
  marginTop: 20,
  marginBottom: 64,
});

const GraySection = styled(Box)({
  backgroundColor: '#f5f5f5',
  padding: '64px 0',
});

const CtaSection = styled(Box)({
  backgroundColor: '#E3F2FD',
  color: 'black',
  padding: '48px 0',
  textAlign: 'center',
});

const TaskManagerButton = styled(Button)({
  backgroundColor: '#1976d2',
  color: 'white',
  padding: '12px 32px',
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#1565c0',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

const TaskManagement = () => {
  // Handler for task manager button click
  const handleTaskManagerClick = () => {
    try {
      if (TASK_MANAGER_CONFIG.openInNewTab) {
        // Open in new tab/window
        window.open(TASK_MANAGER_CONFIG.url, '_blank', 'noopener,noreferrer');
      } else {
        // Navigate in same tab
        window.location.href = TASK_MANAGER_CONFIG.url;
      }
    } catch (error) {
      console.error('Error opening task manager:', error);
      // Fallback: try opening in new tab
      window.open(TASK_MANAGER_CONFIG.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Hero Section */}
      <HeroBox>
        <HeroImage src={tskimg} alt="Team members" />
        <WaveOverlay />
        <HeroContent>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.4rem', sm: '2.2rem', md: '2.5rem' },
              marginRight: { xs: "10px" }
            }}
          >
            Task Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
              paddingRight: { xs: '20px' },
            }}
          >
            Task management helps HR staff to create tasks that must be completed to recruit,
            onboard, terminate, or transfer employees.
          </Typography>
        </HeroContent>
      </HeroBox>

      {/* Task Manager Button Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 4, 
        backgroundColor: '#fff'
      }}>
        <Container maxWidth="lg">
          <TaskManagerButton
            onClick={handleTaskManagerClick}
            startIcon={<LaunchIcon />}
            size="large"
          >
            Go to Task Manager
          </TaskManagerButton>
        </Container>
      </Box>

      {/* Delegate Tasks Section */}
      <SectionContainer maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box
              component="img"
              src={tskrem}
              alt="Task reminder"
              sx={{
                width: '100%',
                height: '350px',
                objectFit: 'cover',
                borderRadius: '8px',
                '@media (max-width: 900px)': {
                  height: '250px',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <SectionTitle variant="h4" component="h2" gutterBottom>
              Delegate tasks and set reminders
            </SectionTitle>
            <Typography variant="body1" paragraph sx={{ mb: 3, color: 'text.secondary' }}>
              A must-have set of productivity and time management tools. You may make
              sure that jobs are performed quickly and successfully as well as that you never
              forget significant deadlines or events by adhering to these rules.
            </Typography>
            <List>
              {[
                'Delegate tasks to individuals, managers or teams.',
                'Every staff member can access their own message board',
                'Advance notification to right people of action and deadlines.',
                'Send notes so ensure the employee has everything to complete the task.',
              ].map((text, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <BlueStarIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </SectionContainer>

      {/* Progress Notifications */}
      <GraySection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h4" component="h2" gutterBottom>
                Progress notifications
              </SectionTitle>
              <Typography variant="body1" paragraph sx={{ mb: 3, color: 'text.secondary' }}>
                Users can utilise HRHaaT to stay updated on the status of their tasks or
                requests. Users can remain informed and involved during the
                application process by delivering real-time updates, push notifications,
                email notifications, dashboard updates, tailored notifications, feedback,
                and confirmation.
              </Typography>
              <List>
                {[
                  'Monitor all company projects and tasks in one place.',
                  'Delegate to, and notify, only the relevant staff.',
                  'Setup reminders for milestones and deadlines.',
                  'View and download reports on the progress of your tasks.',
                ].map((text, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <BlueStarIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={prgImg}
                alt="Progress update"
                sx={{
                  width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  '@media (max-width: 900px)': {
                    height: '250px',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </GraySection>

      {/* Features Section */}
      <SectionContainer maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 6,
            fontSize: { xs: '1.6rem', sm: '2rem', md: '2.2rem' },
          }}
        >
          Features
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
          {[
            {
              title: 'Email Notifications',
              description: 'Give users email notifications to let them know how their work or request is progressing. This is especially helpful for longer or more difficult activities.',
              color: '#FFC107',
            },
            {
              title: 'Real-time Status Updates',
              description: 'Update the status of a task or request in real time. This can be accomplished by employing progress bars, status updates, or notifications that show when particular milestones have been reached.',
              color: '#26A69A',
            },
            {
              title: 'User Dashboard',
              description: 'The user\'s dashboard with information on how tasks or requests are doing. Users can use this to quickly determine the status of their requests and take appropriate action.',
              color: '#212121',
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureItem elevation={2}>
                <FeatureIcon bgcolor={feature.color} />
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureItem>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>

      {/* Tracking Section */}
      <GraySection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={trcimg}
                alt="Tracking Tasks"
                sx={{
                  width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  '@media (max-width: 900px)': {
                    height: '250px',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SectionTitle variant="h4" component="h2" gutterBottom>
                Tracking
              </SectionTitle>
              <Typography variant="body1" paragraph sx={{ mb: 3, color: 'text.secondary' }}>
                HRHaaT can keep tabs on the status of tasks and give managers and
                workers real-time updates. This can ensure that work is finished on
                schedule and that any possible bottlenecks are found and dealt with. It
                helps organizations streamline workflows, increase productivity, and
                improve task visibility.
              </Typography>
              <List>
                {[
                  'Task scheduling',
                  'Prioritization',
                  'Reminders and notifications',
                  'Message boards for tasks and teams',
                ].map((text, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <BlueStarIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Container>
      </GraySection>

      {/* CTA Section */}
      <CtaSection>
        <Container maxWidth="md">
          <SectionTitle variant="h4" component="h2" gutterBottom>
            Ready to streamline your task management?
          </SectionTitle>
          <Typography variant="body1" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of organizations already using HRHaaT to improve their workflow
          </Typography>
        </Container>
      </CtaSection>
    </Box>
  );
};

export default TaskManagement;