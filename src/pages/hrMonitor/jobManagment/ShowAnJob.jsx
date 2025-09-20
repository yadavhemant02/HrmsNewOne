import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Work,
  LocationOn,
  BusinessCenter,
  Computer,
  Schedule,
  Group,
  DateRange,
  ArrowRight,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { base_hr } from '../../../http/services';
import ShapesLoader from '../../../constent/ShapesLoader';
import AddJobDrawer from './AddJobDrawer';

const ShowAnJob = () => {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_hr}/hr-handler/job/getdata-by-jobId?jobId=${jobId}`);
        // Find the specific job from the array
        const job = response.data.find(job => job.jobId === jobId);
        if (job) {
          setJobData(job);
        } else {
          setError("Job not found");
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditJob = () => {
    setOpenEditDrawer(true);
  };

  const handleCloseEditDrawer = () => {
    setOpenEditDrawer(false);
    // Refresh job data after edit
    if (jobId) {
      const fetchJobDetails = async () => {
        try {
          const response = await axios.get(`${base_hr}/hr-handler/job/getdata-by-jobId?jobId=${jobId}`);
          const job = response.data.find(job => job.jobId === jobId);
          if (job) {
            setJobData(job);
          }
        } catch (err) {
          console.error("Error refreshing job details:", err);
        }
      };
      fetchJobDetails();
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <ShapesLoader size="medium" />
      </Container>
    );
  }

  if (error || !jobData) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || "Job data not available"}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          color="primary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} />
          <Typography variant="button" color="primary">
            Back to Job List
          </Typography>
        </Button>
        
        <Button
          variant="contained"
          onClick={handleEditJob}
          startIcon={<EditIcon />}
          sx={{
            backgroundColor: '#ff9800',
            '&:hover': {
              backgroundColor: '#f57c00'
            },
            textTransform: 'none',
            borderRadius: '8px'
          }}
        >
          Edit Job
        </Button>
      </Box>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 2,
        background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="primary" sx={{ 
            mb: 2,
            fontWeight: 600,
          }}>
            {jobData.jobTittel || "No Title"}
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item>
              <Chip
                icon={<Work />}
                label={jobData.jobType || "Not Specified"}
                color="primary"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<Computer />}
                label={jobData.workEnvironment || "Not Specified"}
                color="secondary"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<LocationOn />}
                label={jobData.jobLocation || "Not Specified"}
                variant="outlined"
                sx={{ borderColor: '#4caf50', color: '#4caf50' }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Job ID: {jobData.jobId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Posted on: {formatDate(jobData.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Job Contents Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ 
                mb: 2,
                color: '#1976d2',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <BusinessCenter />
                Job Details
              </Typography>
              
              {jobData.jobContents && Object.entries(jobData.jobContents).map(([section, items]) => (
                <Box key={section} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ 
                    mb: 1,
                    fontWeight: 600,
                    color: '#333',
                    textTransform: 'capitalize'
                  }}>
                    {section.replace('additionalProp', 'Section ')}
                  </Typography>
                  <List dense>
                    {Array.isArray(items) && items.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <ArrowRight color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: '#f8f9fa'
            }}>
              <List disablePadding>
                <ListItem sx={{ pb: 2 }}>
                  <ListItemIcon>
                    <Schedule color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Experience Required"
                    secondary={jobData.experince || "Not specified"}
                  />
                </ListItem>

                <ListItem sx={{ pb: 2 }}>
                  <ListItemIcon>
                    <Group color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Team"
                    secondary={jobData.team || "Not specified"}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <DateRange color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Last Modified"
                    secondary={formatDate(jobData.modifyAt)}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Job Drawer */}
      <AddJobDrawer
        isOpen={openEditDrawer}
        onClose={handleCloseEditDrawer}
        editMode={true}
        jobData={jobData}
      />
    </Container>
  );
};

export default ShowAnJob;