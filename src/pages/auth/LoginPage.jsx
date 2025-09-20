import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Link,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Avatar
} from '@mui/material';

// Import Material UI icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MicrosoftIcon from '@mui/icons-material/Window';
import GoogleIcon from '@mui/icons-material/Google';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';

import Registration from "../../assets/images/Register.jpg";
import { useAlert } from '../../context/AlertContext'; 
import Swal from 'sweetalert2';
import { FcGoogle } from "react-icons/fc";
import MicrosoftLogo from "../../assets/images/Microsoft_logo.svg.png"

// Import Redux hooks
import { useLoginMutation } from '../../redux/services/authApi';
import { setTempAuthData, clearError } from '../../redux/slices/authSlice';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('hr'); // Default to HR login
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showAlert: showContextAlert } = useAlert();
  
  // RTK Query mutation hook
  const [login, { isLoading }] = useLoginMutation();

  // Function to show SweetAlert notifications
  const showSweetAlert = (message, type) => {
    try {
      Swal.fire({
        title: type === "error" ? "Error" : 
               type === "warning" ? "Warning" :
               type === "info" ? "Information" : "Success",
        text: message,
        icon: type,
        confirmButtonColor: "#2563eb",
        timer: type === "success" ? 3000 : undefined,
        timerProgressBar: type === "success",
      });
      return true; // SweetAlert was shown successfully
    } catch (error) {
      console.error("SweetAlert error:", error);
      return false; // SweetAlert failed
    }
  };

  // Use both alert systems to ensure compatibility
  const showNotification = (message, type) => {
    const sweetAlertShown = showSweetAlert(message, type);
    if (!sweetAlertShown) {
      // Fall back to context alert if SweetAlert fails
      showContextAlert(message, type);
    }
  };

  const handleNavigate = () => {
    navigate("/register");
  }
  
  const sliderContent = [
    {
      title: "Performance",
      description: "Facilitate continuous improvement with a streamlined performance management system.",
      bgImage: Registration,
      alt: "HR Performance Management"
    },
    {
      title: "Organization",
      description: "Manage your organizational structure efficiently with our comprehensive tools.",
      bgImage: Registration,
      alt: "Organization Management"
    },
    {
      title: "Payroll",
      description: "Streamline your payroll processes with automated calculations and reporting.",
      bgImage: Registration,
      alt: "Payroll Management"
    },
    {
      title: "Attendance",
      description: "Track employee attendance with ease using our intuitive attendance management system.",
      bgImage: Registration,
      alt: "Attendance Management"
    },
    {
      title: "Employee Services",
      description: "Provide self-service options for employees to manage their information and requests.",
      bgImage: Registration,
      alt: "Employee Services"
    }
  ];

  // Auto-slide functionality with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideTransition();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleSlideTransition = () => {
    setIsTransitioning(true);
    
    // After a short delay, change to the next slide
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderContent.length);
      
      // After changing the slide, reset the transition state
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentSlide(index);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Input validation
    if (!email.trim()) {
      setError('Email is required');
      showNotification('Email is required', 'error');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      showNotification('Password is required', 'error');
      return;
    }
    
    dispatch(clearError());
    setError('');
    
    try {
      // Show loading indicator
      try {
        Swal.fire({
          title: 'Logging in',
          text: 'Please wait...',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      } catch (error) {
        console.log("SweetAlert loading not available");
      }
      
      // Use RTK Query mutation instead of direct axios call
      const response = await login({
        email: email,
        password: password,
        ip: "string" 
      }).unwrap();

    


      if(response.role==="HR" || response.role==="COMPANY"){
             localStorage.setItem("userType",userType.toUpperCase());
      }
      else{
        if(userType.toUpperCase() !="EMP"){
          const errorMessage = 'Login failed. Please check your your Role';
          // setError(errorMessage);
          showNotification(errorMessage, 'error');
          return;   
        }
        else{
          localStorage.setItem("userType",userType.toUpperCase());
        }
      }




      if(response.role!=userType.toUpperCase()){
           console.log(userType);
      }
      
      console.log('Login successful:', response);

      // Store credentials in Redux state and localStorage for OTP verification
      dispatch(setTempAuthData({
        email: email,
        password: password,
      }));
      
      // Close loading indicator if it was opened
      try {
        Swal.close();
      } catch (error) {
        console.log("Error closing SweetAlert");
      }
      
      showNotification('Login successful. Redirecting to OTP verification...', 'success');
      
      setTimeout(() => {
        navigate('/otp-page');
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Close loading indicator if it was opened
      try {
        Swal.close();
      } catch (swalError) {
        console.log("Error closing SweetAlert");
      }
      
      const errorMessage = error.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    }
  };

  const handleSocialLogin = (provider) => {
    showNotification(`${provider} login is not implemented yet`, 'info');
  };

  const handleForgotPassword = () => {
    showNotification("Password reset functionality will be available soon.", "info");
  };

  return (
    <Box sx={{ bgcolor: '#f5f8fa', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        {/* Main Content */}
        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ minHeight: '90vh' }}>
          {/* Image Slider */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: 2,
                height: 500, 
                transition: 'all 0.5s ease',
                opacity: isTransitioning ? 0.7 : 1,
                backgroundImage: `url(${sliderContent[currentSlide].bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Dark overlay for better text visibility */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
                  zIndex: 1
                }}
              />
              
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  color: 'white',
                  textAlign: 'center',
                  padding: 4,
                  zIndex: 2
                }}
              >
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  mb={2}
                  sx={{ 
                    transition: 'transform 0.5s ease',
                    transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)'
                  }}
                >
                  {sliderContent[currentSlide].title}
                </Typography>

                <Typography 
                  variant="body1" 
                  mb={4}
                  sx={{ 
                    maxWidth: '80%',
                    transition: 'transform 0.5s ease',
                    transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                    transitionDelay: '0.1s'
                  }}
                >
                  {sliderContent[currentSlide].description}
                </Typography>

                {/* Pagination dots */}
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  gap={1} 
                  mt={2}
                  sx={{ 
                    transition: 'transform 0.5s ease',
                    transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                    transitionDelay: '0.2s'
                  }}
                >
                  {sliderContent.map((_, index) => (
                    <Box 
                      key={index}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.8)',
                        }
                      }}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Login Form */}
          <Grid item xs={12} md={5}>
            <Card elevation={1} sx={{ borderRadius: 2, maxWidth: 550, mx: 'auto' }}>
              <CardContent sx={{ p: 4 }}>
                {/* Logo and Registration Text */}
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  <Box 
                    onClick={handleNavigate}
                    sx={{
                      mb: 2,
                      px: 3,
                      py: 1,
                      borderRadius: 20,
                      background: 'linear-gradient(135deg, #003396 0%, #86CEFA  100%)',
                      color: 'white',
                      textAlign: 'center',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      }
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        letterSpacing: '0.5px'
                      }}
                    >
                      To Register your Company Click Here 
                    </Typography>
                  </Box>
                  <Typography 
                    onClick={() => navigate("/")}
                    variant="h4" 
                    fontWeight="bold" 
                    sx={{ 
                      cursor: "pointer",
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                      '& .hr': { 
                        background: 'black',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      },
                      '& .haat': { 
                        background: '#0066cc',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }
                    }}
                  >
                    <span className="hr">HR</span><span className="haat">HaaT</span>
                  </Typography>
                </Box>

                {/* User Type Selector */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 3, 
                    p: 0.5, 
                    bgcolor: '#f1f5f9',
                    borderRadius: 28
                  }}
                >
                  <ToggleButtonGroup
                    value={userType}
                    exclusive
                    onChange={handleUserTypeChange}
                    aria-label="user type"
                    sx={{ 
                      width: '100%',
                      '& .MuiToggleButton-root': {
                        borderRadius: 28,
                        py: 1,
                        px: 3,
                        border: 'none',
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #003396 0%, #86CEFA  100%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #003396 0%, #86CEFA  100%)',
                          }
                        }
                      }
                    }}
                  >
                    <ToggleButton 
                      value="hr" 
                      aria-label="HR login"
                      sx={{ 
                        flexGrow: 1,
                        textTransform: 'none',
                        display: 'flex',
                        gap: 1
                      }}
                    >
                      <PeopleIcon fontSize="small" />
                      <Typography variant="body2">HR Login</Typography>
                    </ToggleButton>
                    <ToggleButton 
                      value="emp" 
                      aria-label="Employee login"
                      sx={{ 
                        flexGrow: 1,
                        textTransform: 'none',
                        display: 'flex',
                        gap: 1
                      }}
                    >
                      <PersonIcon fontSize="small" />
                      <Typography variant="body2">EMP Login</Typography>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Paper>
                
                <Typography variant="body2" textAlign="center" color="text.secondary" mb={4}>
                  Welcome back! Please login to your account
                </Typography>
                
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                  {/* Removed Typography error display while keeping the error state */}

                  {/* Email Address */}
                  <TextField
                    label="Email Address *"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderColor: 'primary.main' } }}
                    size='small'
                    error={error === 'Email is required'}
                  />

                  {/* Password field */}
                  <TextField
                    label="Password *"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    sx={{ mb: 1 }}
                    size='small'
                    error={error === 'Password is required'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Forgot Password Link */}
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Link 
                      onClick={handleForgotPassword}
                      underline="hover" 
                      color="primary" 
                      variant="body2"
                      sx={{ cursor: "pointer" }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 28,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #003396 0%, #86CEFA  100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #003396 0%, #86CEFA  100%)',
                      }
                    }}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>

                  {/* Alternative Login Methods */}
                  <Box mt={3} mb={2} display="flex" alignItems="center">
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                      Or continue with
                    </Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<FcGoogle />}
                        onClick={() => handleSocialLogin('Google')}
                        sx={{
                          py: 1,
                          borderRadius: 28,
                          textTransform: 'none',
                          justifyContent: 'center',
                        }}
                      >
                        Google
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Avatar alt="Microsoft" variant='square' src={MicrosoftLogo} sx={{ width: 20, height: 20 }} />}
                        onClick={() => handleSocialLogin('Microsoft')}
                        sx={{
                          py: 1,
                          borderRadius: 28,
                          textTransform: 'none',
                          justifyContent: 'center'
                        }}
                      >
                        Microsoft
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Sign Up Link */}
                  {/* <Box mt={3} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account yet? {' '}
                      <Link sx={{cursor: "pointer"}} onClick={handleNavigate} underline="hover" color="primary">
                        Signup Here
                      </Link>
                    </Typography>
                  </Box> */}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;

