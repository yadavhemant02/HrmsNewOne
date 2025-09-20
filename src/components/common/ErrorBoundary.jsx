import React, { Component } from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { ErrorOutline, Refresh, ArrowBack } from '@mui/icons-material';
import { useNavigate, useRouteError, useLocation } from 'react-router-dom';

// Wrapper for class component to use hooks
const ErrorBoundaryWithHooks = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeError = useRouteError();
  
  return <ErrorBoundaryClass 
    {...props} 
    navigate={navigate} 
    location={location}
    routeError={routeError}
  />;
};

// Main error boundary class component
class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    this.props.navigate(-1);
  };

  handleGoHome = () => {
    this.props.navigate('/');
  };

  render() {
    // Check for route error first (from React Router)
    if (this.props.routeError) {
      return this.renderErrorUI(this.props.routeError);
    }
    
    // Then check for errors caught by the error boundary
    if (this.state.hasError) {
      return this.renderErrorUI(this.state.error);
    }

    // Otherwise, render children normally
    return this.props.children;
  }

  renderErrorUI(error) {
    const errorMessage = error?.message || 'An unexpected error occurred';
    const isInfiniteLoop = errorMessage.includes('Too many re-renders');
    
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ErrorOutline 
              color="error" 
              sx={{ fontSize: 48, mr: 2 }} 
            />
            <Typography variant="h4" color="error" fontWeight="medium">
              Oops! Something went wrong
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            {isInfiniteLoop 
              ? "We detected an infinite render loop. This usually happens when a component's render method continually updates state that triggers re-rendering."
              : "We've encountered an error and are working to resolve it."}
          </Typography>

          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              mb: 4, 
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              fontFamily: 'monospace',
              overflowX: 'auto'
            }}
          >
            <Typography variant="body2" color="error" whiteSpace="pre-wrap">
              {errorMessage}
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Refresh />}
              onClick={this.handleRefresh}
            >
              Refresh Page
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />}
              onClick={this.handleGoBack}
            >
              Go Back
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={this.handleGoHome}
            >
              Go to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
}

export default ErrorBoundaryWithHooks; 