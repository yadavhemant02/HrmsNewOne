import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Paper,
  Alert,
  Snackbar,
  Box,
  LinearProgress,
  Fade
} from '@mui/material';
import { 
  Close, 
  ContentCopy, 
  Key,
  CheckCircleOutline
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { hrApi } from '../../../utils/axiosConfig';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { base_hr } from '../../../http/services';

// Custom styled components
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3a0ca3 30%, #4361ee 90%)',
  borderRadius: 8,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 15px rgba(67, 97, 238, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #4361ee 30%, #3a0ca3 90%)',
    boxShadow: '0 4px 20px rgba(67, 97, 238, 0.5)',
    transform: 'translateY(-2px)'
  }
}));

const KeyPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 12,
  background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
  border: '1px solid #e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
}));

const CopyIconButton = styled(IconButton)(({ theme }) => ({
  color: '#3a0ca3',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(58, 12, 163, 0.1)',
    transform: 'scale(1.1)'
  }
}));

const ApiKeyDialog = ({ open, onClose, jobId, onSuccess }) => {


  console.log(jobId+"Ppppppppppppppppppp")
  const [apiKey, setApiKey] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.empCode || localStorage.getItem('empCode');

  const generateApiKey = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const prefix = 'sk_live_default_';
    let result = prefix;
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setApiKey(result);
  };

  useEffect(() => {
    if (open) {
      generateApiKey();
      setShowSuccess(false);
      setCopySuccess(false);
    }
  }, [open]);

  const handleApplyKey = async () => {
    setLoading(true);

    console.log(jobId)
    try {
       const response = await axios.post(`${base_hr}/hr-handler/api-key/add-key/for-form`, {
        jobId,
        organizationCode: localStorage.getItem("organizationCode"),
        apiKey
      });
      setShowSuccess(true);
      // Call onSuccess callback to refresh parent component
      if (onSuccess) onSuccess();
      
      // Close after showing success message
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Error applying API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <>
      <Dialog 
        open={open} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        {loading && (
          <LinearProgress 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #3a0ca3, #4361ee)'
              }
            }} 
          />
        )}
        
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          pb: 1,
          background: 'linear-gradient(90deg, #f0f0ff, #fafaff)',
          borderBottom: '1px solid #f0f0f7'
        }}>
          <Key sx={{ color: '#3a0ca3' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#3a0ca3', letterSpacing: '0.5px' }}>
            API Key Generator
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ 
              ml: 'auto',
              color: '#6c757d',
              '&:hover': { 
                bgcolor: '#f5f5f5',
                color: '#3a0ca3'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 3 }}>
          <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            Here's your generated API key for Contract ID: <Box component="span" sx={{ fontWeight: 600, color: '#3a0ca3' }}>{jobId}</Box>. 
            Make sure to copy and apply it before closing this dialog.
          </Typography>

          <KeyPaper>
            <Typography 
              sx={{ 
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#3a0ca3',
                fontWeight: 500,
                width: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {apiKey}
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <CopyIconButton
                onClick={handleCopyKey}
                disabled={copySuccess}
              >
                {copySuccess ? <CheckCircleOutline color="success" /> : <ContentCopy />}
              </CopyIconButton>
              
              <Fade in={copySuccess}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -32,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    pointerEvents: 'none'
                  }}
                >
                  Copied!
                </Box>
              </Fade>
            </Box>
            
            {/* Decorative element */}
            <Box 
              sx={{ 
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                background: 'linear-gradient(to bottom, #3a0ca3, #4361ee)'
              }} 
            />
          </KeyPaper>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 2, background: 'linear-gradient(90deg, #f0f0ff, #fafaff)' }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            disabled={loading}
            sx={{
              borderRadius: 2,
              borderColor: '#3a0ca3',
              color: '#3a0ca3',
              px: 3,
              '&:hover': {
                borderColor: '#3a0ca3',
                bgcolor: 'rgba(58, 12, 163, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <GradientButton
            onClick={handleApplyKey}
            startIcon={<Key />}
            disabled={loading || showSuccess}
          >
            {showSuccess ? 'Key Applied!' : 'Apply Key'}
          </GradientButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            '& .MuiAlert-icon': {
              color: '#4caf50'
            }
          }}
          icon={<CheckCircleOutline />}
        >
          API key applied successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApiKeyDialog; 