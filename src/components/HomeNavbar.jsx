import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Slide
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import {  TrendingUp  } from '@mui/icons-material';

import HRManagementMegaMenu from '../pages/NavbarHover/HRManagementMegaMenu';
import RecrandOnboard from '../pages/NavbarHover/RecrandOnboard';
import About from '../pages/NavbarHover/About';

import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// recruit and Onboarding Icon 
import DescriptionIcon from '@mui/icons-material/Description';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import WorkIcon from '@mui/icons-material/Work';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import BarChartIcon from '@mui/icons-material/BarChart';
import FeedbackIcon from '@mui/icons-material/Feedback';

// Transition component for dialog animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledAppBar = styled(AppBar)`
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  padding: 0;
  margin: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 1100;
`;

const FullWidthContainer = styled(Container)`
  padding-left: 16px !important;
  padding-right: 10px !important;
  max-width: 100% !important;

  @media (min-width: 1200px) {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
`;

const LogoText = styled.div`
  font-weight: bold;
  font-size: 1.8rem;
  margin-right: 1rem;
  display: flex;
  cursor: pointer;
  align-items: center;
  font-family: 'Arial', sans-serif;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }

  @media (max-width: 450px) {
    font-size: 1.3rem;
  }

  .num {
    color: #0066cc;
  }
  .hr {
    color: #000000;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: #444;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.7rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.3s;
  font-family: 'Arial', sans-serif;

  @media (max-width: 900px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  &:hover {
    color: #0066cc;
  }

  svg {
    margin-left: 4px;
  }
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 4px;
  font-weight: 500;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  font-family: 'Arial', sans-serif;

  @media (max-width: 600px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  &.login {
    background: #4caf50;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
      background: rgb(13, 181, 18);
    }
  }

  &.demo {
    background: #1976d2;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background: #1565c0;
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
  }
`;

const NavContainer = styled(Box)`
  position: relative;
  flex-grow: 1;
  display: flex;

  @media (max-width: 900px) {
    display: none;
  }
`;

const MegaMenuWrapper = styled.div`
  position: static;
`;

const MobileMenu = styled(Menu)`
  .MuiPaper-root {
    width: 100% !important;
    max-width: none;
    margin-top: 8px;
    border-radius: 0;
    background-color: white;
  }

  .MuiMenuItem-root {
    padding: 1rem 1.2rem;
    font-size: 1.05rem;
    font-weight: 500;
    color: #333;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }
`;

// Styled components for improved mobile responsiveness
const ResponsiveDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 100%;
    
    @media (min-width: 480px) {
      width: 380px;
    }
  }
`;

const DrawerHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const StyledAccordion = styled(Accordion)`
  box-shadow: none;
  border-bottom: 1px solid #f0f0f0;
  
  &:before {
    display: none;
  }
  
  .MuiAccordionSummary-root {
    min-height: 56px;
    padding: 0 16px;
  }
  
  .MuiAccordionDetails-root {
    padding: 0;
  }
`;

const StyledListItemButton = styled(ListItemButton)`
  padding: 8px 16px 8px 32px;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  .MuiListItemIcon-root {
    min-width: 40px;
  }
  
  .MuiListItemText-primary {
    font-size: 0.9rem;
  }
  
  @media (max-width: 360px) {
    padding: 6px 12px 6px 24px;
    
    .MuiListItemIcon-root {
      min-width: 36px;
    }
    
    .MuiListItemText-primary {
      font-size: 0.85rem;
    }
  }
`;

const ActionButtonsContainer = styled(Box)`
  padding: 16px;
  
  @media (max-width: 360px) {
    padding: 12px;
  }
`;

// Demo Dialog Styled Components
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 16px;
    padding: 8px;
    max-width: 600px;
    width: 100%;
    margin: 16px;
  }
`;

const DialogHeader = styled(Box)`
  text-align: center;
  padding: 24px 24px 16px;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  color: white;
`;

const FormContainer = styled(Box)`
  padding: 0 24px 24px;
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8px;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #1976d2;
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #1976d2;
    }
  }
`;

const SubmitButton = styled(Button)`
  border-radius: 8px;
  padding: 12px 32px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  
  &:hover {
    box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4);
    transform: translateY(-2px);
  }
`;

const HomeNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery('(max-width:360px)');
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  // Demo Dialog States
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    companySize: '',
    industry: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const [hrMegaMenuVisible, setHrMegaMenuVisible] = useState(false);
  const [recruitMegaMenuVisible, setRecruitMegaMenuVisible] = useState(false);
  const [resourcesMegaMenuVisible, setResourcesMegaMenuVisible] = useState(false);
  const [aboutMenuVisible, setAboutMenuVisible] = useState(false);

  const hrTimerRef = useRef(null);
  const recruitTimerRef = useRef(null);
  const resourcesTimerRef = useRef(null);
  const aboutTimerRef = useRef(null);

  const navigate = useNavigate();

  // Company size options
  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ];

  // Industry options
  const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ];

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = 'Phone number is invalid';
    }
    
    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
    }
    
    if (!formData.companySize) {
      errors.companySize = 'Company size is required';
    }
    
    if (!formData.industry) {
      errors.industry = 'Industry is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle demo form submission
  const handleDemoSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Demo request submitted:', formData);
      
      setShowSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setDemoDialogOpen(false);
        setShowSuccess(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          designation: '',
          companySize: '',
          industry: ''
        });
        
        // Redirect to demo or show demo content
        // navigate('/demo');
        alert('Thank you! We will contact you shortly to schedule your personalized demo.');
        
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting demo request:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle demo button click
  const handleViewDemo = () => {
    setDemoDialogOpen(true);
    if (mobileMenuAnchor) {
      setMobileMenuAnchor(false);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : null);
  };

  const handleHrMenuMouseEnter = () => {
    clearTimeout(hrTimerRef.current);
    setHrMegaMenuVisible(true);
    setRecruitMegaMenuVisible(false);
  };

  const handleHrMenuMouseLeave = () => {
    hrTimerRef.current = setTimeout(() => {
      setHrMegaMenuVisible(false);
    }, 200);
  };

  const handleRecruitMenuMouseEnter = () => {
    clearTimeout(recruitTimerRef.current);
    setRecruitMegaMenuVisible(true);
    setHrMegaMenuVisible(false);
    setResourcesMegaMenuVisible(false);
  };

  const handleRecruitMenuMouseLeave = () => {
    recruitTimerRef.current = setTimeout(() => {
      setRecruitMegaMenuVisible(false);
    }, 200);
  };

  const handleAboutMenuMouseEnter = () => {
    clearTimeout(aboutTimerRef.current);
    setAboutMenuVisible(true);
    setRecruitMegaMenuVisible(false);
    setHrMegaMenuVisible(false);
    setResourcesMegaMenuVisible(false);
  };

  const handleAboutMenuMouseLeave = () => {
    aboutTimerRef.current = setTimeout(() => {
      setAboutMenuVisible(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hrTimerRef.current);
      clearTimeout(recruitTimerRef.current);
      clearTimeout(resourcesTimerRef.current);
      clearTimeout(aboutTimerRef.current);
    };
  }, []);

  const handleHR = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mobileMenuAnchor) {
      setMobileMenuAnchor(false);
    }
  };

  const handleLogin = () => {
    navigate('/login-page');
    if (mobileMenuAnchor) {
      setMobileMenuAnchor(false);
    }
  };

  const handleClick = (path) => {
    setMobileMenuAnchor(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hrmenuItems = [
    { icon: <PeopleIcon sx={{ color: "#1976d2" }} />, text: "Core HR", path: "hr-core" },
    { icon: <AssignmentIcon sx={{ color: "#fbc02d" }} />, text: "Onboarding", path: "onboarding" },
    { icon: <AccessTimeIcon sx={{ color: "#ff7043" }} />, text: "Attendance", path: "" },
    { icon: <PaidIcon sx={{ color: "#66bb6a" }} />, text: "Payroll Management", path: "payrollmgmt" },
    { icon: <EmojiEventsIcon sx={{ color: "#ef5350" }} />, text: "Recruitment", path: "recruitment" },
    { icon: <AssignmentIcon sx={{ color: "#ffa726" }} />, text: "Leave Management", path: "leave" },
    { icon: <TrendingUp sx={{ color: "#4dd0e1" }} />, text: "Performance", path: "performance" },
    { icon: <AssignmentIcon sx={{ color: "#8d6e63" }} />, text: "Task Management", path: "taskmgmt" },
    { icon: <SupportAgentIcon sx={{ color: "#ec407a" }} />, text: "Help & Support", path: "support" },
  ];

  const recruitmenuItems = [
    {
      icon: <PersonSearchIcon sx={{ color: '#1976d2' }} />,
      text: "Candidate Sourcing",
      path: "candidatesourcing",
    },
    {
      icon: <DescriptionIcon sx={{ color: '#1976d2' }} />,
      text: "Job Requisition ",
      path: "jobrequisition"
    },
    {
      icon: <PeopleIcon sx={{ color: '#FF9800' }} />,
      text: 'Candidate Management',
      path: "candmanagement",
    },
    {
      text: 'Career Page',
      icon: <WorkIcon sx={{ color: '#E91E63' }} />,
      path: "careerpage",
    },
    {
      text: 'Pre-boarding',
      icon: <AutorenewIcon sx={{ color: '#9C27B0' }} />,
      path: "preboarding",
    },
    {
      text: 'Reports & Analytics',
      icon: <BarChartIcon sx={{  color: '#3F51B5' }} />,
      path: "report",
    },
    {
      text: 'Surveys',
        icon: <FeedbackIcon sx={{  color: '#8BC34A' }} />,
      path: "report",
    },
  ];

  const aboutItems = [
    { text: 'Company', path: 'company' },
    { text: 'Contact', path: 'contact' }
  ];

  return (
    <>
      <StyledAppBar color="default">
        <FullWidthContainer>
          <Toolbar disableGutters>
            <LogoText onClick={handleHR}>
              <span className="hr">HR</span>
              <span className="num">HaaT</span>
            </LogoText>

            {!isMobile && (
              <>
                <NavContainer>
                  <MegaMenuWrapper
                    onMouseEnter={handleHrMenuMouseEnter}
                    onMouseLeave={handleHrMenuMouseLeave}
                  >
                    <NavButton>
                      HR Management <KeyboardArrowDownIcon fontSize="small" />
                    </NavButton>
                    {hrMegaMenuVisible && (
                      <HRManagementMegaMenu onClose={() => setHrMegaMenuVisible(false)} />
                    )}
                  </MegaMenuWrapper>

                  <MegaMenuWrapper
                    onMouseEnter={handleRecruitMenuMouseEnter}
                    onMouseLeave={handleRecruitMenuMouseLeave}
                  >
                    <NavButton>
                      Recruitment & Onboarding <KeyboardArrowDownIcon fontSize="small" />
                    </NavButton>
                    {recruitMegaMenuVisible && <RecrandOnboard onClose={() => setRecruitMegaMenuVisible(false)} />}
                  </MegaMenuWrapper>

                  <MegaMenuWrapper
                    onMouseEnter={handleAboutMenuMouseEnter}
                    onMouseLeave={handleAboutMenuMouseLeave}
                  >
                    <NavButton>
                      About <KeyboardArrowDownIcon fontSize="small" />
                    </NavButton>
                    {aboutMenuVisible && <About />}
                  </MegaMenuWrapper>
                </NavContainer>

                <ButtonsContainer>
                  <ActionButton className="login" onClick={handleLogin}>
                    Login <LoginIcon />
                  </ActionButton>
                  <ActionButton className="demo" onClick={handleViewDemo}>
                    <VisibilityIcon /> View Demo
                  </ActionButton>
                </ButtonsContainer>
              </>
            )}

            {isMobile && (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setMobileMenuAnchor(true)}
                >
                  <MenuIcon />
                </IconButton>

                <ResponsiveDrawer
                  anchor="right"
                  open={Boolean(mobileMenuAnchor)}
                  onClose={() => setMobileMenuAnchor(false)}
                >
                  <DrawerHeader>
                    <LogoText onClick={handleHR}>
                      <span className="hr">HR-</span>
                      <span className="num">HaaT</span>
                    </LogoText>
                    <IconButton onClick={() => setMobileMenuAnchor(false)}>
                      <CloseIcon />
                    </IconButton>
                  </DrawerHeader>

                  <StyledAccordion 
                    expanded={expandedSection === 'hr'} 
                    onChange={handleAccordionChange('hr')}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="hr-panel-content"
                      id="hr-panel-header"
                    >
                      <Typography fontWeight={600}>HR Management</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <List disablePadding>
                        {hrmenuItems.map((item, index) => (
                          <StyledListItemButton 
                            key={index} 
                            onClick={item.path ? () => handleClick(item.path) : undefined}
                          >
                            <ListItemIcon sx={{ minWidth: isSmallScreen ? 36 : 40 }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={item.text} 
                              primaryTypographyProps={{ 
                                fontSize: isSmallScreen ? '0.85rem' : '0.9rem' 
                              }} 
                            />
                          </StyledListItemButton>
                        ))}
                      </List>
                    </AccordionDetails>
                  </StyledAccordion>

                  <StyledAccordion 
                    expanded={expandedSection === 'recruit'} 
                    onChange={handleAccordionChange('recruit')}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="recruit-panel-content"
                      id="recruit-panel-header"
                    >
                      <Typography fontWeight={600}>Recruitment & Onboarding</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <List disablePadding>
                        {recruitmenuItems.map((item, index) => (
                          <StyledListItemButton 
                            key={index} 
                            onClick={item.path ? () => handleClick(item.path) : undefined}
                          >
                            <ListItemIcon sx={{ minWidth: isSmallScreen ? 36 : 40 }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={item.text} 
                              primaryTypographyProps={{ 
                                fontSize: isSmallScreen ? '0.85rem' : '0.9rem' 
                              }} 
                            />
                          </StyledListItemButton>
                        ))}
                      </List>
                    </AccordionDetails>
                  </StyledAccordion>

                  <StyledAccordion 
                    expanded={expandedSection === 'about'} 
                    onChange={handleAccordionChange('about')}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="about-panel-content"
                      id="about-panel-header"
                    >
                      <Typography fontWeight={600}>About</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <List disablePadding>
                        {aboutItems.map((item, index) => (
                          <StyledListItemButton 
                            key={index} 
                            onClick={item.path ? () => handleClick(item.path) : undefined}
                          >
                            <ListItemText 
                              primary={item.text} 
                              primaryTypographyProps={{ 
                                fontSize: isSmallScreen ? '0.85rem' : '0.9rem' 
                              }} 
                            />
                          </StyledListItemButton>
                        ))}
                      </List>
                    </AccordionDetails>
                  </StyledAccordion>

                  <ActionButtonsContainer>
                    <ActionButton 
                      className="login" 
                      style={{ width: '100%', padding: isSmallScreen ? '8px 16px' : '10px 20px' }}
                      onClick={handleLogin}
                    >
                      <LoginIcon fontSize={isSmallScreen ? 'small' : 'medium'} /> 
                      Login
                    </ActionButton>
                    <Box mt={2} />
                    <ActionButton 
                      className="demo" 
                      style={{ width: '100%', padding: isSmallScreen ? '8px 16px' : '10px 20px' }}
                      onClick={handleViewDemo}
                    >
                      <VisibilityIcon fontSize={isSmallScreen ? 'small' : 'medium'} /> 
                      View Demo
                    </ActionButton>
                  </ActionButtonsContainer>
                </ResponsiveDrawer>
              </>
            )}
          </Toolbar>
        </FullWidthContainer>
      </StyledAppBar>

      {/* Demo Request Dialog */}
      <StyledDialog
        open={demoDialogOpen}
        onClose={() => !loading && setDemoDialogOpen(false)}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <DialogHeader>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            <VisibilityIcon sx={{ mr: 2, fontSize: '2rem' }} />
            Request Your Demo
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Experience HRHaaT's powerful features with a personalized demo
          </Typography>
        </DialogHeader>

        <FormContainer>
          {showSuccess ? (
            <Box textAlign="center" py={4}>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Thank you for your interest!
                </Typography>
                <Typography>
                  We'll contact you shortly to schedule your personalized demo.
                </Typography>
              </Alert>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <form onSubmit={handleDemoSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange('fullName')}
                    error={!!formErrors.fullName}
                    helperText={formErrors.fullName}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Company Name"
                    value={formData.company}
                    onChange={handleInputChange('company')}
                    error={!!formErrors.company}
                    helperText={formErrors.company}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Your Designation"
                    value={formData.designation}
                    onChange={handleInputChange('designation')}
                    placeholder="e.g., HR Manager, CEO, etc."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!formErrors.companySize}>
                    <InputLabel>Company Size</InputLabel>
                    <Select
                      value={formData.companySize}
                      onChange={handleInputChange('companySize')}
                      label="Company Size"
                      sx={{ borderRadius: 2 }}
                      required
                    >
                      {companySizeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.companySize && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {formErrors.companySize}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!formErrors.industry}>
                    <InputLabel>Industry</InputLabel>
                    <Select
                      value={formData.industry}
                      onChange={handleInputChange('industry')}
                      label="Industry"
                      sx={{ borderRadius: 2 }}
                      required
                    >
                      {industryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.industry && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {formErrors.industry}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                <Button
                  onClick={() => setDemoDialogOpen(false)}
                  variant="outlined"
                  size="large"
                  disabled={loading}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Cancel
                </Button>
                <SubmitButton
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VisibilityIcon />}
                >
                  {loading ? 'Submitting...' : 'Request Demo'}
                </SubmitButton>
              </Box>
            </form>
          )}
        </FormContainer>
      </StyledDialog>
    </>
  );
};

export default HomeNavbar; 