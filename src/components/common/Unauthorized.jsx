// src/components/common/Unauthorized.js
import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Unauthorized = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleGoBack = () => {
    // If user is logged in, redirect to the appropriate dashboard
    if (isAuthenticated) {
      const role = user?.role?.toUpperCase();
      console.log(role)
      if (role === 'COMPANY' || role === 'HR') {
        console.log("kkkkkkkkkkkkkkk")
        navigate('/dashboard-hr');
      } else {
        console.log("pppppppppppppp")
        navigate('/dashboard-emp');
      }
    } else {
      console.log("nnnnnnnnnnnnnnnnnnnn")
      // If not logged in, go to login
      navigate('/login-page');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        bgcolor: '#f5f8fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden', 
            textAlign: 'center',
            p: { xs: 3, md: 5 }
          }}
        >
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center' 
                }}
              >
                <Box 
                  sx={{
                    height: 100,
                    width: 100,
                    borderRadius: '50%',
                    bgcolor: 'error.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}
                >
                  <BlockIcon 
                    sx={{ 
                      fontSize: 60, 
                      color: 'white'
                    }} 
                  />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="error.main" gutterBottom>
                  Access Denied
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ maxWidth: 600, mx: 'auto' }}
                >
                  You don't have permission to access this page
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 4, px: { xs: 1, md: 6 } }}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'info.light',
                    p: 3,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 28, color: 'info.dark', mr: 2 }} />
                  <Typography variant="body1" color="info.dark" align="left">
                    This area is restricted based on your user role. If you believe this is a mistake, please contact your administrator for assistance.
                  </Typography>
                </Paper>

                <Typography variant="body2" color="text.secondary" paragraph>
                  You're trying to access a page that requires different permissions than what your current role provides. Please navigate to an authorized area or contact support if you need additional access.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{ 
                  borderRadius: 28,
                  px: 3
                }}
              >
                Go to Dashboard
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGoHome}
                sx={{ 
                  borderRadius: 28,
                  px: 3
                }}
              >
                Go to Home
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            If you need assistance, please contact the system administrator
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Unauthorized;