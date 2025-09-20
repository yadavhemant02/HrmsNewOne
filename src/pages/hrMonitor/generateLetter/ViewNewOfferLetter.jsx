import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Button,
  Avatar,
  Card,
  CardContent,
  useTheme,
  alpha,
  styled,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  ButtonGroup
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OfferLetterDialog from './OfferLetterDialog';


// Styled components for enhanced visuals
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
  background: 'linear-gradient(135deg, #1A237E 0%, #3949AB 100%)',
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
  padding: theme.spacing(1, 3),
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
  backgroundColor: status === 'ON' ? 
    alpha(theme.palette.success.main, 0.1) : 
    alpha(theme.palette.error.main, 0.1),
  color: status === 'ON' ? theme.palette.success.dark : theme.palette.error.dark,
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

const ViewNewOfferLetter = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // State to determine which version to initially show in the dialog
  const [initialTab, setInitialTab] = useState(0); // 0 for previous, 1 for current

  useEffect(() => {
    if (location.state?.offerData) {
      setEmployeeData(location.state.offerData);
      setLoading(false);
    } else {
      setError('No employee data found. Please go back and try again.');
      setLoading(false);
    }
  }, [location]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleViewOfferLetter = (tab = 0) => {
    setInitialTab(tab);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" >
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleGoBack}
            >
              Go Back
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box >
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
          Employee Offer Letter Details
        </Typography>
      </Box>

      <div>
        <StyledPaper>
          <HeaderSection>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                  {employeeData.name}
                </Typography>
                <Typography variant="h6" fontWeight={500} sx={{ opacity: 0.9 }}>
                  {employeeData.position} • {employeeData.disignation}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <BadgeIcon sx={{ fontSize: 20, mr: 1, opacity: 0.9 }} />
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {employeeData.empCode}
                  </Typography>
                  <Box mx={2} sx={{ opacity: 0.5 }}>•</Box>
                  <StatusChip 
                    label={employeeData.status === 'ON' ? 'Active' : 'Inactive'} 
                    status={employeeData.status}
                    size="small"
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" align="right" fontWeight={600}>
                  {formatCurrency(employeeData.ctc)} /year
                </Typography>
                <Typography variant="body2" align="right" sx={{ opacity: 0.9 }}>
                  Total CTC
                </Typography>
              </Box>
            </Box>
            <ProfileAvatar>
              {employeeData.name.charAt(0).toUpperCase()}
            </ProfileAvatar>
          </HeaderSection>

          <Container sx={{ mb: 6 }}>
            {/* Document Card for Offer Letters */}
            <DocumentCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Offer Letter Documents
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body1" paragraph>
                Access and manage this employee's offer letter documents. You can view both the current and previous versions of the offer letter.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <StyledButton
                  variant="outlined"
                  color="secondary"
                  startIcon={<HistoryIcon />}
                  onClick={() => handleViewOfferLetter(0)}
                  sx={{
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                    flex: 1,
                    maxWidth: 300
                  }}
                >
                  View Previous Offer Letter
                </StyledButton>
                <StyledButton
                  variant="contained"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  onClick={() => handleViewOfferLetter(1)}
                  sx={{
                    background: 'linear-gradient(45deg, #1565C0 30%, #0D47A1 90%)',
                    color: 'white',
                    flex: 1,
                    maxWidth: 300
                  }}
                >
                  View Current Offer Letter
                </StyledButton>
              </Box>
            </DocumentCard>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Offer Generated: {formatDate(employeeData.offerDate)}
                  </Typography>
                </Box>

                <SectionTitle variant="h5" component="h2" fontWeight={600}>
                  Personal Information
                </SectionTitle>
              </Grid>

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
                          {employeeData.officialEmail}
                        </Typography>
                      </Box>
                    </DetailItem>
                    
                    {employeeData.personalEmail && (
                      <DetailItem>
                        <DetailIcon>
                          <EmailIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Personal Email
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {employeeData.personalEmail}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                    
                    {employeeData.primaryPhone && (
                      <DetailItem>
                        <DetailIcon>
                          <PhoneIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Primary Phone
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {employeeData.primaryPhone}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                    
                    {employeeData.alternatePhone && (
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

              <Grid item xs={12} md={6}>
                <DetailCard>
                  <DetailCardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Address Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {employeeData.address && (
                      <DetailItem>
                        <DetailIcon>
                          <LocationOnIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Address
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {employeeData.address}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                    
                    {(employeeData.city || employeeData.state || employeeData.pinCode) && (
                      <DetailItem>
                        <DetailIcon>
                          <LocationOnIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            City, State & Pin Code
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {`${employeeData.city || ''}${employeeData.city && (employeeData.state || employeeData.pinCode) ? ', ' : ''}${employeeData.state || ''}${employeeData.state && employeeData.pinCode ? ' - ' : ''}${employeeData.pinCode || ''}`}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                  </DetailCardContent>
                </DetailCard>
              </Grid>

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
                          {employeeData.position}
                        </Typography>
                      </Box>
                    </DetailItem>
                    
                    {employeeData.disignation && (
                      <DetailItem>
                        <DetailIcon>
                          <WorkIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Designation
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {employeeData.disignation}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                    
                    {employeeData.function && (
                      <DetailItem>
                        <DetailIcon>
                          <WorkIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Function/Department
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {employeeData.function}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
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
                    
                    {employeeData.dateOfBirth && (
                      <DetailItem>
                        <DetailIcon>
                          <CalendarTodayIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Date of Birth
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(employeeData.dateOfBirth)}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                    
                    {employeeData.offerDate && (
                      <DetailItem>
                        <DetailIcon>
                          <CalendarTodayIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Offer Date
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(employeeData.offerDate)}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                    
                    {employeeData.dateOfJoin && (
                      <DetailItem>
                        <DetailIcon>
                          <CalendarTodayIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Date of Joining
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(employeeData.dateOfJoin)}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                  </DetailCardContent>
                </DetailCard>
              </Grid>

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
                    
                    {employeeData.bankName && (
                      <DetailItem>
                        <DetailIcon>
                          <AccountBalanceIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Bank Name
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {employeeData.bankName}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                    
                    {employeeData.accountNumber && (
                      <DetailItem>
                        <DetailIcon>
                          <CreditCardIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Account Number
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {employeeData.accountNumber}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
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
                    
                    {employeeData.ctc && (
                      <DetailItem>
                        <DetailIcon>
                          <AttachMoneyIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            CTC (Annual)
                          </Typography>
                          <Typography variant="body1" fontWeight={600} color="primary.main">
                            {formatCurrency(employeeData.ctc)}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                    
                    {employeeData.panNumber && (
                      <DetailItem>
                        <DetailIcon>
                          <BadgeIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            PAN Number
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {employeeData.panNumber}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                    
                    {employeeData.aadharNumber && (
                      <DetailItem>
                        <DetailIcon>
                          <BadgeIcon />
                        </DetailIcon>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Aadhar Number
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {employeeData.aadharNumber}
                          </Typography>
                        </Box>
                      </DetailItem>
                    )}
                  </DetailCardContent>
                </DetailCard>
              </Grid>
            </Grid>
          </Container>
        </StyledPaper>
      </div>

      {/* Dialog for viewing offer letter with initialTab prop */}
      <OfferLetterDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        employeeData={employeeData}
        initialTab={initialTab}
      />
    </Box>
  );
};

export default ViewNewOfferLetter;

