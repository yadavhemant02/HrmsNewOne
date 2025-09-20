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
  useTheme,
  alpha,
  styled,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';
import { base_hr } from '../../../../http/services';

// Styled components matching your existing app style
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

const ViewSalarySlip = ({ open, onClose, payslipId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  const fetchPdf = async () => {
    if (!payslipId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/api/payslip/view-payslip-pdf?payslipId=${payslipId}`,
        { 
          headers: {
            'Accept': '*/*'
          }
        }
      );

      if (response.data && response.data.result) {
        const pdfDataUrl = `data:application/pdf;base64,${response.data.result}`;
        setPdfData(pdfDataUrl);
      } else {
        throw new Error('Invalid or empty PDF data received');
      }
    } catch (err) {
      console.error('Error loading salary slip PDF:', err);
      setError(err.response?.data?.message || 'Failed to load salary slip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && payslipId) {
      fetchPdf();
    }
  }, [open, payslipId]);

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
        <Typography variant="h6">Salary Slip</Typography>
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
              Loading salary slip...
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
              Error Loading Salary Slip
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
                title="Salary Slip PDF"
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

export default ViewSalarySlip;


