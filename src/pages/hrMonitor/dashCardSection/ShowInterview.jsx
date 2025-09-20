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
  Divider,
  InputBase,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { base_hr, base_identity, base_Ip } from '../../../http/services';
import { useAlert } from '../../../context/AlertContext'; // Adjust the import path as needed
import { Link } from 'react-router-dom';
import BackButton from '../../../constent/BackButton';

const ShowInterview = () => {
  const { showAlert } = useAlert(); // Use the alert context
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const [select, setSelect] = useState("all");
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

  useEffect(() => {
    fetchInterviews();
    fetchEmployeeEmails();
  }, []);

  // Utility functions for filtering
  const isToday = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isUpcoming = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    // Upcoming means date is after today
    return date > today;
  };

  // Fetch all interviews (no filter param)
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_hr}/hr-handler/interview/get-all/interview/all?organizationCode=${localStorage.getItem('organizationCode')}`
      );
      const data = response.data || [];
      setInterviews(data);
      // Apply filter after fetching
      filterInterviews(data, select, searchQuery);
    } catch (err) {
      setError('Failed to fetch interviews');
      showAlert('Failed to fetch interviews', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter interviews based on dropdown and search
  const filterInterviews = (data, filterType, search) => {
    let filtered = data;
    if (filterType === 'today') {
      filtered = data.filter((interview) => isToday(interview.date));
    } else if (filterType === 'upcoming') {
      filtered = data.filter((interview) => isUpcoming(interview.date));
    }
    if (search) {
      filtered = filtered.filter((interview) =>
        interview.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
        interview.candidateId?.toString().includes(search.toLowerCase()) ||
        interview.designation?.toLowerCase().includes(search.toLowerCase()) ||
        interview.candidateLocation?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredInterviews(filtered);
  };

  // Update filter when dropdown changes
  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelect(value);
    filterInterviews(interviews, value, searchQuery);
  };

  // Update filter when search changes
  useEffect(() => {
    filterInterviews(interviews, select, searchQuery);
  }, [searchQuery, interviews, select]);

  const fetchEmployeeEmails = async () => {
    try {
      const response = await axios.get(`${base_identity}/identity-handler/auth/all-emp`);
      const emails = response.data.map((employee) => ({
        value: employee.email,
      }));
      setEmployeeEmails(emails);
    } catch (error) {
      console.error("Error fetching employee emails:", error);
      showAlert("Failed to fetch employee emails", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${base_hr}/hr-handler/interview/schedule-interview`, formData);
      showAlert('Interview scheduled successfully!', 'success');
      setOpenDrawer(false);
      fetchInterviews();
      resetForm();
    } catch (err) {
      showAlert('Failed to schedule interview', 'error');
      console.error(err);
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

  // Centralized loading indicator that renders within the component
  const renderLoader = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        height: '200px' 
      }}
    >
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', position: 'relative' }}>
      {/* Header Section */}
      <BackButton/>
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

        {/* Filter and Search Section */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Interview Filter */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="interview-filter-label">Filter Interviews</InputLabel>
            <Select
              labelId="interview-filter-label"
              value={select}
              label="Filter Interviews"
              onChange={handleSelectChange}
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(26, 35, 126, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1a237e',
                },
              }}
            >
              <MenuItem value="all">All Interviews</MenuItem>
              <MenuItem value="upcoming">Upcoming Interviews</MenuItem>
              <MenuItem value="today">Today's Interviews</MenuItem>
            </Select>
          </FormControl>

          {/* Search Bar */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              bgcolor: 'white',
              transition: 'all 0.2s ease-in-out',
              flexGrow: 1,
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

          {/* Results Count */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'rgba(26, 35, 126, 0.1)',
            padding: '8px 16px',
            borderRadius: '8px',
          }}>
            <Typography variant="body2" sx={{ 
              color: '#1a237e',
              fontWeight: 500,
            }}>
              Showing {filteredInterviews.length} of {interviews.length} interviews
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content Area with Loading State */}
      <Box sx={{ position: 'relative', minHeight: '300px' }}>
        {loading ? (
          renderLoader()
        ) : (
          <>
            {/* Interview Cards Grid */}
            <Grid container spacing={3}>
              {error ? (
                <Grid item xs={12}>
                  <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>
                </Grid>
              ) : filteredInterviews.length > 0 ? (
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
              ) : (
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      minHeight: '200px',
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
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Box>

      {/* Form Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '600px' },
            p: 4,
            bgcolor: '#f9fafb'
          }
        }}
      >
        <Box
          sx={{
            border: "1px solid rgba(26, 35, 126, 0.5)",
            borderRadius: "10px",
            padding: { xs: "20px", md: "20px" },
            marginTop: "50px",
            bgcolor: "white",
            height: "100%",
            overflowY: "auto"
          }}
        >
          <Typography
            variant="h4"
            component="p"
            sx={{
              fontFamily: "inherit",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "#1a237e",
              fontWeight: "bold"
            }}
          >
            Schedule New Interview
            <IconButton 
              onClick={() => setOpenDrawer(false)}
              sx={{ 
                position: 'absolute',
                right: '40px',
                top: '40px',
                '&:hover': { bgcolor: 'rgba(26, 35, 126, 0.1)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Candidate ID"
                  required
                  name="candidateId"
                  value={formData.candidateId}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job ID"
                  required
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Candidate Name"
                  required
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  name="candidateEmail"
                  value={formData.candidateEmail}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Years of Experience"
                  required
                  name="noOfYearExperince"
                  value={formData.noOfYearExperince}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  required
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 600,
                    mt: 2,
                    mb: 2
                  }}
                >
                  Location & Meeting Details
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  required
                  name="candidateLocation"
                  value={formData.candidateLocation}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Link"
                  required
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 600,
                    mt: 2,
                    mb: 2
                  }}
                >
                  Interview Panel
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Interviewer 1"
                  required
                  name="interviewer1"
                  value={formData.interviewer1}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                >
                  {employeeEmails.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Interviewer 2"
                  name="interviewer2"
                  value={formData.interviewer2}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                >
                  {employeeEmails.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Interviewer 3"
                  name="interviewer3"
                  value={formData.interviewer3}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                >
                  {employeeEmails.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 600,
                    mt: 2,
                    mb: 2
                  }}
                >
                  Schedule
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  required
                  name="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  required
                  name="time"
                  InputLabelProps={{ shrink: true }}
                  value={formData.time}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1a237e',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 3,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: '#1a237e',
                    '&:hover': { bgcolor: '#0d47a1' },
                    fontSize: '1.1rem',
                    textTransform: 'none'
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Schedule Interview'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ShowInterview;