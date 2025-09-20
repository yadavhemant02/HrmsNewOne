import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
  Rating,
  useTheme,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Person,
  Work,
  School,
  Info,
  Email,
  Phone,
  LocationOn,
  Cake,
  Flag,
  Assignment,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  RemoveRedEye as EyeIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { base_candidate } from '../../../http/services';

const CandidateDetails = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState({
    resume: false,
    coverLetter: false
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'info'
  });
  const [pdfData, setPdfData] = useState(null);
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const theme = useTheme();

  const showNotification = (message, type = 'info') => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  // Fetch candidate details
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await axios.get(
          `${base_candidate}/candidate-handler/info/get-candidate-data?candidateId=${candidateId}`,
          null,
          {
            params: {
              candidateId: candidateId
            }
          }
        );
        setCandidate(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch candidate details');
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [candidateId]);

  // Handle resume download
  const handleDownloadResume = async () => {
  setDownloadLoading((prev) => ({ ...prev, resume: true }));
  try {
    const response = await axios.post(
      `${base_candidate}/candidate-handler/doc/get-resume?candidateId=${candidateId}`,
      {}, // Ensure to send the proper body if needed
      {
        responseType: 'blob', // This will handle binary stream as a blob
      }
    );

    if (response.status === 200) {
      // Create a Blob object from the response data (binary stream)
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a download link for the Blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf'); // Dynamically set filename or use default
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.remove(); // Clean up the DOM

      window.URL.revokeObjectURL(url); // Revoke the object URL to free memory

      showNotification('Resume downloaded successfully', 'success');
    } else {
      showNotification('Resume not available', 'error');
    }
  } catch (error) {
    console.error('Error downloading resume:', error);
    showNotification('Failed to download resume', 'error');
  } finally {
    setDownloadLoading((prev) => ({ ...prev, resume: false }));
  }
};


  // Handle show resume
  const handleShowResume = async () => {

    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    setDownloadLoading(prev => ({ ...prev, coverLetter: true }));
    try {
    //   const response = await axios.get(
    //     `https://app.ventureconsultancyservices.com/candidate-handler/doc/get-resume/base-64`,
    //     {
    //       params: {
    //         candidateId: candidateId
    //       }
    //     }
    //   );
    // const response = await axios.get(
    //     `https://app.ventureconsultancyservices.com/candidate-handler/doc/get-resume/base-64?candidateId=C1HEMANT`,
    //   );
//https://app.ventureconsultancyservices.com/candidate-handler/doc/get-resume/base-64?candidateId=C1HEMANT
const response = await axios.post(
    `${base_candidate}/candidate-handler/doc/get-resume/base-64?candidateId=${candidateId}`, {

      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: true
  });
      if (response.data && response.data.resume) {
        setPdfData(response.data.resume);
        setOpenPdfDialog(true);
      } else {
        showNotification('Resume not available', 'error');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      showNotification('Failed to fetch resume', 'error');
    } finally {
      setDownloadLoading(prev => ({ ...prev, coverLetter: false }));
    }
  };

  const handleClosePdfDialog = () => {
    setOpenPdfDialog(false);
  };

  // PDF Viewer Component
  const PdfViewer = ({ base64Data }) => {
    const pdfUrl = `data:application/pdf;base64,${base64Data}`;
    
    return (
      <iframe
        src={pdfUrl}
        style={{
          width: '100%',
          height: '80vh',
          border: 'none'
        }}
        title="Resume Preview"
      />
    );
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: '#f5f5f5' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error" variant="filled">{error}</Alert>
      </Box>
    );
  }

  if (!candidate) {
    return (
      <Box m={2}>
        <Alert severity="info" variant="filled">No candidate data found</Alert>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <Box display="flex" alignItems="center" mb={3} gap={1}>
      <Icon color="primary" />
      <Typography variant="h6" color="primary" fontWeight="600">
        {title}
      </Typography>
    </Box>
  );

  const DetailItem = ({ icon: Icon, label, value }) => (
    <Paper elevation={0} sx={{ p: 2, mb: 2, background: '#f8f9fa', borderRadius: 2 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Icon color="action" sx={{ opacity: 0.7 }} />
        <Box flex={1}>
          <Typography color="textSecondary" variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="body1" fontWeight="500">
            {value || 'Not specified'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ background: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      <Button 
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => window.history.back()}
        sx={{ 
          mb: 3, 
          color: theme.palette.primary.main, 
          borderColor: theme.palette.primary.main, 
          '&:hover': {
            borderColor: theme.palette.primary.dark,
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          },
          textTransform: 'none',
          boxShadow: 'none'
        }}  
      >
        <Typography fontWeight="bold" color={theme.palette.primary.main}>
          Go back
        </Typography>
      </Button>
      <Card elevation={2} sx={{ borderRadius: 3, overflow: 'visible' }}>
        <Box 
          sx={{ 
            background: theme.palette.primary.main,
            height: '150px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            padding: 2
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<DescriptionIcon />}
              onClick={handleDownloadResume}
              disabled={downloadLoading.resume}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: 'white',
                },
                '&:disabled': {
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                },
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {downloadLoading.resume ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : null}
              Download Resume
            </Button>
            <Button
              variant="contained"
              startIcon={<EyeIcon />}
              onClick={handleShowResume}
              disabled={downloadLoading.coverLetter}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: 'white',
                },
                '&:disabled': {
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                },
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {downloadLoading.coverLetter ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : null}
              View Resume
            </Button>
          </Box>
        </Box>
        <CardContent sx={{ mt: -8, position: 'relative' }}>
          <Box display="flex" alignItems="flex-end" mb={4}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                fontSize: '3rem',
                background: theme.palette.primary.light
              }}
            >
              {candidate.name.charAt(0)}
            </Avatar>
            <Box ml={3} color="white">
              <Typography variant="h4" fontWeight="bold">
                {candidate.name}
              </Typography>
              <Typography variant="subtitle1">
                {candidate.designation}
              </Typography>
              <Box mt={1}>
                <Rating value={candidate.rating} readOnly />
              </Box>
            </Box>
            <Chip
              label={candidate.candidateId}
              sx={{ 
                ml: 'auto',
                background: 'white',
                fontWeight: 'bold',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          </Box>

          <Grid container spacing={4}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <SectionHeader icon={Person} title="Personal Information" />
              <DetailItem icon={Person} label="Name" value={candidate.name} />
              <DetailItem icon={Email} label="Email" value={candidate.email} />
              <DetailItem icon={Phone} label="Phone" value={candidate.number} />
              <DetailItem icon={Person} label="Gender" value={candidate.gender} />
              <DetailItem icon={Cake} label="Date of Birth" value={formatDate(candidate.dateOfBirth)} />
              <DetailItem icon={LocationOn} label="Address" value={candidate.address} />
              <DetailItem icon={Flag} label="Citizenship" value={candidate.citizenship} />
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12} md={6}>
              <SectionHeader icon={Work} title="Professional Information" />
              <DetailItem icon={Work} label="Designation" value={candidate.designation} />
              <DetailItem icon={Assignment} label="Overall Experience" value={`${candidate.overAllExperience} years`} />
              <DetailItem icon={Assignment} label="Relevant Experience" value={`${candidate.relevantExperience} years`} />
              <DetailItem icon={Work} label="Current CTC" value={`₹${candidate.currentCTC.toLocaleString()}`} />
              <DetailItem icon={Work} label="Expected CTC" value={`₹${candidate.expectationCTC.toLocaleString()}`} />
              <DetailItem icon={Assignment} label="Notice Period" value={`${candidate.noticePeriod} days`} />
              <Paper elevation={0} sx={{ p: 2, mb: 2, background: '#f8f9fa', borderRadius: 2 }}>
                <Typography color="textSecondary" variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Tech Stack
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                  {candidate.techStack.map((tech, index) => (
                    <Chip 
                      key={index} 
                      label={tech}
                      sx={{
                        background: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': { background: theme.palette.primary.dark }
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Education Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <SectionHeader icon={School} title="Educational Information" />
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <DetailItem icon={School} label="Highest Qualification" value={candidate.highQualification} />
                  <DetailItem icon={School} label="Year of Passing" value={candidate.yearOfPassing} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailItem icon={School} label="10th Percentage" value={`${candidate.tenthPercentage}%`} />
                  <DetailItem icon={School} label="12th Percentage" value={`${candidate.twelvthPercentage}%`} />
                </Grid>
              </Grid>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <SectionHeader icon={Info} title="Additional Information" />
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <DetailItem 
                    icon={LocationOn} 
                    label="Willing to Relocate" 
                    value={candidate.relocate ? 'Yes' : 'No'} 
                  />
                    
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailItem 
                    icon={Info} 
                    label="Last Modified" 
                    value={formatDate(candidate.modifyAt)} 
                  /></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
    
          {/* PDF Viewer Dialog */}
          <Dialog
            open={openPdfDialog}
            onClose={handleClosePdfDialog}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                height: '90vh',
                maxHeight: '90vh'
              }
            }}
          >
            <DialogTitle 
              sx={{ 
                m: 0, 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                bgcolor: theme.palette.primary.main,
                color: 'white'
              }}
            >
              <Typography variant="h6">Resume Preview</Typography>
              <IconButton
                aria-label="close"
                onClick={handleClosePdfDialog}
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent 
              dividers
              sx={{
                p: 0,
                bgcolor: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {pdfData ? (
                <PdfViewer base64Data={pdfData} />
              ) : (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  height="100%"
                  flexDirection="column"
                  gap={2}
                >
                  <CircularProgress />
                  <Typography variant="body1" color="textSecondary">
                    Loading PDF...
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </Dialog>
    
          {/* Notification Snackbar */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseNotification} 
              severity={notification.type} 
              variant="filled"
              sx={{ 
                width: '100%',
                '& .MuiAlert-message': {
                  fontSize: '0.875rem'
                }
              }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
    
          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              variant="filled"
              sx={{ 
                position: 'fixed', 
                bottom: 24, 
                right: 24, 
                maxWidth: '400px' 
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      );
    };
    
    export default CandidateDetails;