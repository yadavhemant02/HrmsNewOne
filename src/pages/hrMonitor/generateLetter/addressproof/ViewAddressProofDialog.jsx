import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Typography,
  Button,
  useTheme,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';
import { base_hr } from '../../../../http/services';

// Styled components for consistency
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f5f5f5'
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  padding: theme.spacing(4)
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  padding: theme.spacing(4),
  textAlign: 'center'
}));

const ViewAddressProofDialog = ({ open, onClose, empCode }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  const fetchPdf = async () => {
    if (!open || !empCode) return;
    setLoading(true);
    setError(null);
    setPdfData(null);

    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/api/address-letter/get-address-proof-pdf-data-view?empCode=${empCode}`,
        {
          headers: {
            'accept': '*/*'
          }
        }
      );

      console.log('API Response:', response.data); // Debug log

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Check if the response is already in base64 format
      if (typeof response.data === 'string' && response.data.startsWith('data:application/pdf;base64,')) {
        setPdfData(response.data);
      } 
      // Check if the response has a result property with base64 data
      else if (response.data.result) {
        const base64Data = response.data.result;
        // Check if the base64 data already includes the data URL prefix
        if (base64Data.startsWith('data:application/pdf;base64,')) {
          setPdfData(base64Data);
        } else {
          setPdfData(`data:application/pdf;base64,${base64Data}`);
        }
      }
      // If the response is just the base64 string
      else if (typeof response.data === 'string') {
        setPdfData(`data:application/pdf;base64,${response.data}`);
      }
      else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error loading address proof PDF:', err);
      setError(err.message || 'Failed to load address proof letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && empCode) {
      fetchPdf();
    }
  }, [open, empCode]);

  const handleRetry = () => {
    fetchPdf();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
          borderRadius: 2
        }
      }}
    >
      <StyledDialogTitle>
        <Typography variant="h6">Address Proof Letter</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent sx={{
        p: 0,
        position: 'relative',
        height: 'calc(100% - 64px)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <LoadingContainer>
            <CircularProgress size={60} />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Loading address proof letter...
            </Typography>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorOutlineIcon 
              sx={{ 
                fontSize: 60, 
                color: theme.palette.error.main,
                mb: 2
              }}
            />
            <Typography variant="h6" gutterBottom>
              Error Loading Address Proof Letter
            </Typography>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2, 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                mb: 2
              }}
            >
              {error}
            </Alert>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleRetry}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </ErrorContainer>
        ) : (
          <Box sx={{ height: '100%', width: '100%' }}>
            {pdfData ? (
              <iframe
                src={pdfData}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                title="Address Proof Letter PDF"
              />
            ) : (
              <ErrorContainer>
                <Alert severity="warning" sx={{ m: 2 }}>
                  No PDF data available
                </Alert>
              </ErrorContainer>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewAddressProofDialog;