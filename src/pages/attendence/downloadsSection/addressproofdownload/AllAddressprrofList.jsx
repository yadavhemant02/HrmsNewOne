import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  styled,
  Button,
  Card,
  CardContent,
  Divider,
  Snackbar
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { base_hr, base_identity } from '../../../../http/services';
import ViewAddressProofDialog from '../../../hrMonitor/generateLetter/addressproof/ViewAddressProofDialog';

// ================================
//        STYLED COMPONENTS
// ================================

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(3),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const InfoGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 0),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    fontSize: '1.2rem',
  },
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  minWidth: 160,
  boxShadow: variant === 'contained' 
    ? '0 4px 12px rgba(33, 150, 243, 0.25)' 
    : '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'contained' 
      ? '0 6px 16px rgba(33, 150, 243, 0.35)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  '&:disabled': {
    transform: 'none',
    boxShadow: 'none',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  gap: theme.spacing(2),
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(4),
}));

// ================================
//        SERVICE LAYER
// ================================

class AddressProofService {
  static getOrganizationCode() {
    return localStorage.getItem('organizationCode');
  }

  static getEmployeeCode() {
    return localStorage.getItem('empCode');
  }

  static async getEmployeeDetails(empCode) {
    const orgCode = this.getOrganizationCode();
    if (!orgCode) throw new Error('Organization code not found');

    const response = await axios.get(
      `${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${orgCode}`
    );
    
    const employees = Array.isArray(response.data) ? response.data : [];
    const employee = employees.find(emp => emp.empCode === empCode);
    
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    return employee;
  }

  static async checkAddressProofExists(empCode) {
    const orgCode = this.getOrganizationCode();
    if (!orgCode) throw new Error('Organization code not found');

    const response = await axios.get(
      `${base_hr}/hr-handler/api/address-letter/get-all-empCode-generated-address-leter?organizationCode=${orgCode}`
    );
    
    const generatedCodes = response.data || [];
    return generatedCodes.includes(empCode);
  }

  static async downloadAddressProof(empCode) {
    const response = await axios.get(
      `${base_hr}/hr-handler/api/address-letter/get-address-proof-pdf-data-download?empCode=${empCode}`,
      {
        responseType: 'blob',
        headers: { accept: '*/*' }
      }
    );
    return response;
  }
}

// ================================
//        UTILITY FUNCTIONS
// ================================

const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const extractFilename = (empCode) => {
  return `address_proof_${empCode}.pdf`;
};

// ================================
//        CUSTOM HOOKS
// ================================

const useAddressProofLetter = (empCode) => {
  const [state, setState] = useState({
    employee: null,
    letterExists: false,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!empCode) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Employee code not found in localStorage'
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [employee, letterExists] = await Promise.all([
        AddressProofService.getEmployeeDetails(empCode),
        AddressProofService.checkAddressProofExists(empCode)
      ]);

      setState({
        employee,
        letterExists,
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to load address proof data';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error('Error fetching address proof data:', err);
    }
  }, [empCode]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refresh };
};

const useViewDialog = () => {
  const [dialogState, setDialogState] = useState({
    open: false,
    selectedLetter: null,
  });

  const openDialog = useCallback((letter) => {
    setDialogState({ open: true, selectedLetter: letter });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState({ open: false, selectedLetter: null });
  }, []);

  return {
    dialogState,
    openDialog,
    closeDialog,
  };
};

const useNotification = () => {
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const showNotification = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const hideNotification = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return { snackbar, showNotification, hideNotification };
};

// ================================
//        MAIN COMPONENT
// ================================

const AllAddressprrofList = () => {
  const theme = useTheme();
  
  // Get empCode from localStorage
  const empCode = AddressProofService.getEmployeeCode();
  
  // Custom hooks
  const { employee, letterExists, loading, error, refresh } = useAddressProofLetter(empCode);
  const { dialogState, openDialog, closeDialog } = useViewDialog();
  const { snackbar, showNotification, hideNotification } = useNotification();
  
  // Local state
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Effects
  useEffect(() => {
    if (empCode) {
      refresh();
    }
  }, [empCode, refresh]);

  // Event handlers
  const handleViewLetter = useCallback(() => {
    if (!empCode || !employee) return;
    openDialog(employee);
  }, [empCode, employee, openDialog]);

  const handleDownloadLetter = useCallback(async () => {
    if (!empCode) return;

    try {
      setDownloadLoading(true);
      
      const response = await AddressProofService.downloadAddressProof(empCode);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      const filename = extractFilename(empCode);
      downloadFile(blob, filename);
      
      showNotification('Address proof letter downloaded successfully');
      
    } catch (error) {
      console.error('Error downloading address proof letter:', error);
      showNotification('Failed to download address proof letter', 'error');
    } finally {
      setDownloadLoading(false);
    }
  }, [empCode, showNotification]);

  // Render loading state
  if (loading) {
    return (
      <Box>
        <LoadingContainer>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">
            Loading address proof letter...
          </Typography>
        </LoadingContainer>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box>
        <ErrorContainer>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: 500
            }}
          >
            {error}
          </Alert>
          <ActionButton 
            variant="contained" 
            onClick={refresh}
            sx={{ mt: 2 }}
          >
            Try Again
          </ActionButton>
        </ErrorContainer>
      </Box>
    );
  }

  // Render no letter found state
  if (!letterExists) {
    return (
      <Box>
        <ErrorContainer>
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: 500
            }}
          >
            No address proof letter found for employee code: {empCode}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please contact HR to generate your address proof letter.
          </Typography>
        </ErrorContainer>
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1" 
        fontWeight="bold" 
        color="primary.main"
        sx={{ mb: 4, textAlign: 'center' }}
      >
        Your Address Proof Letter
      </Typography>

      <StyledCard>
        <HeaderSection>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Employee Information
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Address proof letter is available for download
          </Typography>
        </HeaderSection>

        <CardContent sx={{ p: 4 }}>
          <InfoGrid>
            {/* Basic Information */}
            <Box>
              <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              
              <InfoItem>
                <BadgeIcon />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Employee Code
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {employee?.empCode || 'N/A'}
                  </Typography>
                </Box>
              </InfoItem>

              <InfoItem>
                <PersonIcon />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {employee?.name || 'N/A'}
                  </Typography>
                </Box>
              </InfoItem>

              <InfoItem>
                <WorkIcon />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Position
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {employee?.position || 'N/A'}
                  </Typography>
                </Box>
              </InfoItem>
            </Box>

            {/* Contact Information */}
            <Box>
              <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              
              <InfoItem>
                <EmailIcon />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {employee?.officialEmail || employee?.personalEmail || 'N/A'}
                  </Typography>
                </Box>
              </InfoItem>

              <InfoItem>
                <PhoneIcon />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {employee?.primaryPhone || employee?.alternatePhone || 'N/A'}
                  </Typography>
                </Box>
              </InfoItem>

              <InfoItem>
                <LocationOnIcon />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {employee?.address ? (
                      `${employee.address}${employee.city ? `, ${employee.city}` : ''}${employee.state ? `, ${employee.state}` : ''}${employee.pinCode ? ` - ${employee.pinCode}` : ''}`
                    ) : 'N/A'}
                  </Typography>
                </Box>
              </InfoItem>
            </Box>
          </InfoGrid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <ActionButton
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={handleViewLetter}
            >
              View Letter
            </ActionButton>

            <ActionButton
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadLetter}
              disabled={downloadLoading}
            >
              {downloadLoading ? 'Downloading...' : 'Download Letter'}
            </ActionButton>
          </Box>
        </CardContent>
      </StyledCard>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* View Dialog */}
      <ViewAddressProofDialog
        open={dialogState.open}
        onClose={closeDialog}
        empCode={dialogState.selectedLetter?.empCode}
      />
    </Box>
  );
};

export default AllAddressprrofList;