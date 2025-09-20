import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Avatar,
  Card,
  CardContent,
  useTheme,
  alpha,
  styled,
  CircularProgress,
  Alert,
  IconButton,
  Button,

} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OfferLetterDialog from '../../hrMonitor/generateLetter/OfferLetterDialog';
import { base_identity } from '../../../http/services';


// API Configuration
const API_CONFIG = {
  baseURL: base_identity,
  endpoints: {
    employeeDetails: '/identity-handler/details/get-emp-details',
    offerLetter: '/identity-handler/details/get-offer-letter', 
    downloadOfferLetter: '/details/download-offer-letter' 
  },
  timeout: 10000
};

// API Service Layer
class OfferLetterAPIService {
  static async fetchEmployeeDetails(empCode) {
    try {
      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.employeeDetails}?empCode=${empCode}`,
        {
          timeout: API_CONFIG.timeout,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}` 
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch employee details' 
      };
    }
  }

  

  
}

const useEmployeeData = (empCode) => {
  const [state, setState] = useState({
    employeeData: null,
    loading: true,
    error: null
  });

  const fetchData = useCallback(async () => {
    if (!empCode) {
      setState(prev => ({ ...prev, loading: false, error: 'Employee code is required' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const result = await OfferLetterAPIService.fetchEmployeeDetails(empCode);
    
    if (result.success) {
      setState(prev => ({ ...prev, employeeData: result.data, loading: false }));
    } else {
      setState(prev => ({ ...prev, error: result.error, loading: false }));
    }
  }, [empCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
};
// Styled Components (keeping your existing styles)
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.16)',
    transform: 'translateY(-4px)'
  }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#4372C8",
  padding: theme.spacing(4, 4, 6),
  position: 'relative',
  color: 'white',
  marginBottom: theme.spacing(8),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.common.white}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  position: 'absolute',
  bottom: -75,
  left: 40,
  backgroundColor: theme.palette.primary.light,
  fontSize: '2.5rem',
}));

const DetailCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  }
}));

const DetailCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0,
  }
}));

const DetailIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 8,
  marginRight: theme.spacing(2),
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: variant === 'contained' ? '0 4px 14px rgba(0, 0, 0, 0.12)' : 'none',
  '&:hover': {
    boxShadow: variant === 'contained' ? '0 6px 20px rgba(0, 0, 0, 0.16)' : 'none',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(2),
  marginBottom: theme.spacing(3),
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  backgroundColor: status === 'EXIST' ? 
    alpha(theme.palette.success.main, 0.1) : 
    alpha(theme.palette.error.main, 0.1),
  color: status === 'EXIST' ? theme.palette.success.dark : theme.palette.error.dark,
  borderRadius: 16,
  '& .MuiChip-label': {
    padding: '0 12px',
  }
}));

const DocumentCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
}));

// Main Component
const ViewOffLetter = () => {
  const theme = useTheme();
  const empCode = localStorage.getItem('empCode') || 'KPN25104';
  const navigate = useNavigate();
  
  // Custom hooks for data management
  const { employeeData, loading, error, refetch } = useEmployeeData(empCode);
  

  // State management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Event handlers
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleViewOfferLetter = async () => {
    
    setIsDialogOpen(true);
};

// Utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  const formatCurrency = useCallback((amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  // Loading state
  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Loading employee details...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          action={
            <Box>
              <Button color="inherit" size="small" onClick={refetch} sx={{ mr: 1 }}>
                Retry
              </Button>
              <Button color="inherit" size="small" onClick={handleGoBack}>
                Go Back
              </Button>
            </Box>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton 
          onClick={handleGoBack}
          sx={{ 
            mr: 2,
            background: alpha(theme.palette.primary.main, 0.1),
            '&:hover': { background: alpha(theme.palette.primary.main, 0.2) } 
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight={600}>
          Employee Offer Letter
        </Typography>
      </Box>

      <StyledPaper>
        <HeaderSection>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                {employeeData?.name}
              </Typography>
              <Typography variant="h6" fontWeight={500} sx={{ opacity: 0.9 }}>
                {employeeData?.position} • {employeeData?.disignation}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <BadgeIcon sx={{ fontSize: 20, mr: 1, opacity: 0.9 }} />
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {employeeData?.empCode}
                </Typography>
                <Box mx={2} sx={{ opacity: 0.5 }}>•</Box>
                <StatusChip 
                  label={employeeData?.current === 'EXIST' ? 'Active' : 'Inactive'} 
                  status={employeeData?.current}
                  size="small"
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="h6" align="right" fontWeight={600}>
                {formatCurrency(employeeData?.ctc)} /year
              </Typography>
              <Typography variant="body2" align="right" sx={{ opacity: 0.9 }}>
                Total CTC
              </Typography>
            </Box>
          </Box>
          <ProfileAvatar>
            {employeeData?.name?.charAt(0)?.toUpperCase()}
          </ProfileAvatar>
        </HeaderSection>

        <Container sx={{ mb: 6 }}>
          {/* Enhanced Document Card for Offer Letter */}
          <DocumentCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Offer Letter Document
              </Typography>
             
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" paragraph>
              Access your offer letter document with all the employment details and terms.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 3}}>
              <StyledButton
                variant="contained"
                color="primary"
                startIcon={<VisibilityIcon />}
                onClick={handleViewOfferLetter}
              
                sx={{
                  background: 'linear-gradient(45deg, #1565C0 30%, #0D47A1 90%)',
                  minWidth: 200
                }}
              >
                 View Offer Letter
              </StyledButton>
              
             
            </Box>

          </DocumentCard>

          {/* Rest of your existing Grid components for employee details */}
          <Grid container spacing={3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Offer Generated: {formatDate(employeeData?.offerDate)}
                </Typography>
              </Box>
              <SectionTitle variant="h5" component="h2" fontWeight={600}>
                Personal Information
              </SectionTitle>
            </Grid>

            {/* Contact Details Card */}
            <Grid item xs={12} md={6}>
              <DetailCard>
                <DetailCardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Contact Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <DetailItem>
                    <DetailIcon>
                      <EmailIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Official Email
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.officialEmail || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <EmailIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Personal Email
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.personalEmail || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <PhoneIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Primary Phone
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.primaryPhone || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                  {employeeData?.alternatePhone && (
                    <DetailItem>
                      <DetailIcon>
                        <PhoneIcon />
                      </DetailIcon>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Alternate Phone
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {employeeData.alternatePhone}
                        </Typography>
                      </Box>
                    </DetailItem>
                  )}
                </DetailCardContent>
              </DetailCard>
            </Grid>

            {/* Address Information Card */}
            <Grid item xs={12} md={6}>
              <DetailCard>
                <DetailCardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Address Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <DetailItem>
                    <DetailIcon>
                      <LocationOnIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.address || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <LocationOnIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        City, State & Pin Code
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {`${employeeData?.city || 'N/A'}, ${employeeData?.state || 'N/A'} - ${employeeData?.pinCode || 'N/A'}`}
                      </Typography>
                    </Box>
                  </DetailItem>
                </DetailCardContent>
              </DetailCard>
            </Grid>

            {/* Professional Information Section */}
            <Grid item xs={12}>
              <SectionTitle variant="h5" component="h2" fontWeight={600} sx={{ mt: 3 }}>
                Professional Information
              </SectionTitle>
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailCard>
                <DetailCardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Job Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <DetailItem>
                    <DetailIcon>
                      <WorkIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Position
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.position || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <WorkIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Designation
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.disignation || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <WorkIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Function/Department
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.function || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>

                  <DetailItem>
                    <DetailIcon>
                      <BusinessIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Organization Code
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.organizationCode || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                </DetailCardContent>
              </DetailCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailCard>
                <DetailCardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Important Dates
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <DetailItem>
                    <DetailIcon>
                      <CalendarTodayIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(employeeData?.dateOfBirth)}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <CalendarTodayIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Offer Date
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(employeeData?.offerDate)}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <CalendarTodayIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date of Joining
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(employeeData?.dateOfJoin)}
                      </Typography>
                    </Box>
                  </DetailItem>
                </DetailCardContent>
              </DetailCard>
            </Grid>

            {/* Financial Information Section */}
            <Grid item xs={12}>
              <SectionTitle variant="h5" component="h2" fontWeight={600} sx={{ mt: 3 }}>
                Financial Information
              </SectionTitle>
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailCard>
                <DetailCardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Banking Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <DetailItem>
                    <DetailIcon>
                      <AccountBalanceIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Bank Name
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.bankName || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <CreditCardIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Account Number
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.accountNumber || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>

                  <DetailItem>
                    <DetailIcon>
                      <AccountBalanceIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        IFSC Code
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.ifseCode || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>

                  <DetailItem>
                    <DetailIcon>
                      <AccountBalanceIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Branch Name
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.branchName || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                </DetailCardContent>
              </DetailCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <DetailCard>
                <DetailCardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Compensation & ID Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <DetailItem>
                    <DetailIcon>
                      <AttachMoneyIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        CTC (Annual)
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="primary.main">
                        {formatCurrency(employeeData?.ctc)}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <BadgeIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        PAN Number
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.panNumber || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailIcon>
                      <BadgeIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Aadhar Number
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.aadharNumber || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>

                  <DetailItem>
                    <DetailIcon>
                      <BadgeIcon />
                    </DetailIcon>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        UAN Number
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {employeeData?.uanNumber || 'Not provided'}
                      </Typography>
                    </Box>
                  </DetailItem>
                </DetailCardContent>
              </DetailCard>
            </Grid>
          </Grid>
        </Container>
      </StyledPaper>

      {/* Enhanced Dialog for viewing offer letter */}
      <OfferLetterDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        employeeData={employeeData}
        
      />
 </Box>
  );
};

export default ViewOffLetter;