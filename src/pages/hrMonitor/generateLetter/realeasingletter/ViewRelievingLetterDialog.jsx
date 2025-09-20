import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Alert,
  Typography,
  Button,
  useTheme,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Styled components for consistency
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f5f5f5'
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  padding: theme.spacing(4),
  textAlign: 'center'
}));

const ViewRelievingLetterDialog = ({ 
  open, 
  onClose, 
  empCode,
  pdfData = null,
  isLoading = false,
  error = null,
  onRetry = null
}) => {
  const theme = useTheme();

  const handleRetry = () => {
    if (onRetry && typeof onRetry === 'function') {
      onRetry();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <ContentContainer>
          <Typography variant="body1" color="text.secondary">
            Loading increment letter...
          </Typography>
        </ContentContainer>
      );
    }

    if (error) {
      return (
        <ContentContainer>
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 60, 
              color: theme.palette.error.main,
              mb: 2
            }}
          />
          <Typography variant="h6" gutterBottom>
            Error Loading Increment Letter
          </Typography>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              mb: 2,
              maxWidth: '400px'
            }}
          >
            {error}
          </Alert>
          {onRetry && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleRetry}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          )}
        </ContentContainer>
      );
    }

    if (pdfData) {
      return (
        <Box sx={{ height: '100%', width: '100%' }}>
          <iframe
            src={pdfData}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title="Increment Letter PDF"
          />
        </Box>
      );
    }

    return (
      <ContentContainer>
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 2,
            maxWidth: '400px'
          }}
        >
          No PDF data available for employee code: {empCode || 'N/A'}
        </Alert>
      </ContentContainer>
    );
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
        <Typography variant="h6">Increment Letter</Typography>
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
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ViewRelievingLetterDialog;