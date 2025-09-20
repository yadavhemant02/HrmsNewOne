import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Drawer,
  IconButton,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  InputBase,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Add as AddIcon,
  Close as CloseIcon,
  VideoCall as VideoCallIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { base_hr, base_identity, base_Ip } from '../../../http/services';
import { useSelector } from 'react-redux';

const InterviewEmpShow = () => {
  const credentials = useSelector((state) => state.credential?.credential || {});
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const [formData, setFormData] = useState({
    candidateId: '',
    jobId: '',
    candidateName: '',
    candidateEmail: '',
    candidateLocation: '',
    noOfYearExperince: '',
    meetingLink: '',
    interviewer1: '',
    interviewer2: '',
    interviewer3: '',
    date: '',
    time: '',
    designation: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchInterviews();
    fetchEmployeeEmails();
  }, []);

  useEffect(() => {
    const filtered = interviews.filter(interview => 
      interview.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.candidateId?.toString().includes(searchQuery.toLowerCase()) ||
      interview.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.candidateLocation?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInterviews(filtered);
  }, [searchQuery, interviews]);

  const fetchEmployeeEmails = async () => {
    try {
      const response = await axios.get(`${base_identity}/identity-handler/auth/all-emp`);
      const emails = response.data.map((employee) => ({
        value: employee.email,
      }));
      setEmployeeEmails(emails);
    } catch (error) {
      console.error("Error fetching employee emails:", error);
    }
  };

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_hr}/hr-handler/interview/show-interview?email=${localStorage.getItem("email")}`);
      const data = response.data || [];
      setInterviews(data);
      setFilteredInterviews(data);
    } catch (err) {
      setError('Failed to fetch interviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${base_hr}/hr-handler/interview/schedule-interview`, formData);
      setSnackbar({
        open: true,
        message: 'Interview scheduled successfully!',
        severity: 'success'
      });
      setOpenDrawer(false);
      fetchInterviews();
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to schedule interview',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      candidateId: '',
      jobId: '',
      candidateName: '',
      candidateEmail: '',
      candidateLocation: '',
      noOfYearExperince: '',
      meetingLink: '',
      interviewer1: '',
      interviewer2: '',
      interviewer3: '',
      date: '',
      time: '',
      designation: ''
    });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header with Search */}
      <Button 
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => window.history.back()}
        sx={{ 
          mb: 3,
          textTransform: 'none',
          boxShadow: 'none'
        }}  
      >
        <Typography fontWeight="bold" >
          Go back
        </Typography>
      </Button>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Interview Schedule Management
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{display:'flex', gap:2}}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              bgcolor: 'white',
              transition: 'all 0.2s ease-in-out',
              width:'30%',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ py: '12px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SearchIcon sx={{ color: '#1a237e', mr: 2 }} />
                <InputBase
                  fullWidth
                  placeholder="Search by name, ID, designation, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    fontSize: '0.875rem',
                    color: '#1a237e',
                  }}
                />
                {searchQuery && (
                  <IconButton 
                    size="small" 
                    onClick={() => setSearchQuery('')}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Search Results Count */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="body2" sx={{ 
              color: '#1a237e',
              backgroundColor: 'rgba(26, 35, 126, 0.1)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 500,
            }}>
              Showing {filteredInterviews.length} of {interviews.length} interviews
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Interview Cards Grid */}
      <Grid container spacing={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>
        ) : (
          filteredInterviews.map((interview) => (
            <Grid item xs={12} md={6} lg={4} key={interview.candidateId}>
              <Card 
                sx={{
                  boxShadow: 'none',
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight="bold">
                        {interview.candidateName}
                      </Typography>
                    </Box>
                    <Chip 
                      size="small"
                      label={`ID: ${interview.candidateId}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WorkIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Job ID: {interview.jobId}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.candidateLocation}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.date} at {interview.time}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    variant="contained"
                    startIcon={<VideoCallIcon />}
                    fullWidth
                    href={interview.meetingLink}
                    target="_blank"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      bgcolor: '#1a237e',
                      '&:hover': { bgcolor: '#0d47a1' }
                    }}
                  >
                    Join Meeting
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* No Results Message */}
      {!loading && filteredInterviews.length === 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '200px',
            mt: 4,
            p: 3,
            bgcolor: 'white',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No interviews found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery 
              ? "Try adjusting your search terms or clear the search"
              : "No scheduled interviews available"}
          </Typography>
          {searchQuery && (
            <Button
              variant="outlined"
              onClick={() => setSearchQuery('')}
              sx={{ mt: 2 }}
            >
              Clear Search
            </Button>
          )}
        </Box>
      )}

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default InterviewEmpShow;

