import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Button,
  useTheme,
  alpha,
  styled,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import { base_identity } from '../../../http/services';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden' 
  }
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  background: 'linear-gradient(135deg, #1A237E 0%, #3949AB 100%)',
  color: 'white',
  flexShrink: 0 // Prevent header from shrinking
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.16)',
  }
}));

const ViewerContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  minWidth: 120,
  color: 'white',
  padding: theme.spacing(1.5, 2),
  '&.Mui-selected': {
    color: 'white',
    fontWeight: 700,
  },
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.12),
    borderRadius: '8px 8px 0 0',
  },
}));

// New styled component for the PDF container with its own scrolling
const PDFViewerContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'auto', // Enable scrolling for this container only
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
}));

const OfferLetterDialog = ({ open, onClose, employeeData, initialTab = 0 }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [tabValue, setTabValue] = useState(initialTab); // 0 for previous, 1 for current

  const fetchOfferLetter = async (type) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!employeeData || !employeeData.empCode) {
        throw new Error('Employee code not found');
      }
      
      // Determine which version of the offer letter to fetch
      const suffix = type === 'current' ? "first" : "last";
      
      const response = await axios.get(
        `${base_identity}/identity-handler/details/get-offer-letter?empCode=${employeeData.empCode + suffix}`,
        {
          headers: {
            'Accept': '*/*'
          }
        }
      );

      // Handle base64 content
      const base64Content = response.data;
      const binaryString = window.atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(blob);
      
      setFileData({
        url: fileUrl,
        blob: blob,
        contentType: 'application/pdf'
      });
      
    } catch (err) {
      console.error(`Error fetching ${type} offer letter:`, err);
      setError(`Failed to load the ${type} offer letter. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!employeeData || !employeeData.empCode) return;
    try {
      // Determine which version of the offer letter to download
      const suffix = tabValue === 0 ? "last" : "first";
      const offerType = tabValue === 0 ? "Previous" : "Current";
      
      const response = await axios.get(
        `${base_identity}/identity-handler/details/download-offer-letter?empCode=${employeeData.empCode + suffix}`,
        {
          responseType: 'blob',
          headers: {
            'Accept': '*/*'
          }
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${employeeData.name}_${offerType}_Offer_Letter.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading offer letter:', err);
      // Optionally, show an error to the user
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Fetch the appropriate offer letter when tab changes
    fetchOfferLetter(newValue === 0 ? 'previous' : 'current');
  };

  useEffect(() => {
    if (open && employeeData) {
      // Set tab value based on initialTab prop
      setTabValue(initialTab);
      // Fetch the initial offer letter based on initialTab prop
      fetchOfferLetter(initialTab === 0 ? 'previous' : 'current');
    }
    // Cleanup function to revoke blob URL when component unmounts
    return () => {
      if (fileData?.url) {
        URL.revokeObjectURL(fileData.url);
      }
    };
  }, [open, employeeData, initialTab]);

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      aria-labelledby="offer-letter-dialog-title"
      disableScrollLock={false} // Important for preventing background scroll
    >
      <DialogHeader>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" component="h2" id="offer-letter-dialog-title" fontWeight={600}>
            Offer Letter - {employeeData?.name}
          </Typography>
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              mt: 1,
              minHeight: '36px',
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
            }}
          >
              <StyledTab 
              label="Previous Offer" 
              icon={<HistoryIcon sx={{ fontSize: 18, mr: 0.5 }} />} 
              iconPosition="start"
            />
            <StyledTab 
              label="Current Offer" 
              icon={<DescriptionIcon sx={{ fontSize: 18, mr: 0.5 }} />} 
              iconPosition="start"
            />
          
          </Tabs>
        </Box>
        
        <Box>
          {fileData && (
            <IconButton 
              onClick={handleDownload}
              sx={{ 
                color: 'white',
                mr: 1,
                '&:hover': { background: alpha('#ffffff', 0.2) } 
              }}
              aria-label="Download offer letter"
            >
              <DownloadIcon />
            </IconButton>
          )}
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: 'white',
              '&:hover': { background: alpha('#ffffff', 0.2) } 
            }}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogHeader>
      
      <DialogContent sx={{ 
        p: 0, 
        flex: 1, 
        overflow: 'hidden', // Prevents scrolling at the DialogContent level
        display: 'flex',
        flexDirection: 'column'
      }}>
        <ViewerContainer>
          {loading && (
            <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
          )}
          
          {error && !loading && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%',
                borderRadius: 2, 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                mx: 2
              }}
            >
              {error}
              <Box mt={2}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={() => fetchOfferLetter(tabValue === 0 ? 'previous':'current')}
                >
                  Try Again
                </Button>
              </Box>
            </Alert>
          )}
          
          {!loading && !error && fileData && (
            <PDFViewerContainer>
              <iframe 
                src={`${fileData.url}#toolbar=0`}
                title={`${tabValue === 0 ? 'Previous':'Current'} Offer Letter`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </PDFViewerContainer>
          )}
        </ViewerContainer>
      </DialogContent>
    </StyledDialog>
  );
};

export default OfferLetterDialog;