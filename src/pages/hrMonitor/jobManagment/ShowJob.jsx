import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Paper,
  Container,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { base_hr } from '../../../http/services';
import ShapesLoader from '../../../constent/ShapesLoader';

const ShowJob = () => {
  const [selectedJob, setSelectedJob] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchRole, setSearchRole] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_hr}/hr-handler/job/getall/job-post`);
      setJobs(response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesRole = job.jobTittel.toLowerCase().includes(searchRole.toLowerCase());
    const matchesLocation = job.jobLocation.toLowerCase().includes(searchLocation.toLowerCase());
    return matchesRole && matchesLocation;
  });

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <ShapesLoader size="medium" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ p: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          fontWeight: 600,
          color: 'primary.main' 
        }}
      >
        Current Job Openings
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          p: 2,
          borderRadius: 2,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        }}>
          <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search Role"
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
        </Paper>

        <Paper elevation={3} sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          p: 2,
          borderRadius: 2,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        }}>
          <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
        </Paper>
      </Stack>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 2fr', 
        gap: 4
      }}>
        <Box>
          <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'primary.main',
              fontWeight: 500,
              
            }}>
              <WorkIcon />
              {filteredJobs.length} Jobs Available
            </Typography>
          </Paper>

          <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            {filteredJobs.map((job, index) => (
              <ListItem 
                key={job.id}
                component={Paper} 
                elevation={selectedJob === index ? 3 : 1}
                onClick={() => setSelectedJob(index)}
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: selectedJob === index ? '2px solid' : '2px solid transparent',
                  borderColor: selectedJob === index ? 'primary.main' : 'transparent',
                  transition: 'all 0.2s',
                 // boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Typography color="primary" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {job.jobTittel}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        my: 1
                      }}>
                        <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.jobLocation}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          size="small" 
                          label={job.jobType}
                          sx={{ bgcolor: 'primary.light', color: 'white' }}
                        />
                        <Chip 
                          size="small" 
                          label={job.workEnvironment}
                          sx={{ bgcolor: 'secondary.light', color: 'white' }}
                        />
                      </Stack>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {filteredJobs.length > 0 && (
          <Card elevation={4} sx={{ borderRadius: 2, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {filteredJobs[selectedJob].jobTittel}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 3 }}>
                <Chip
                  icon={<LocationOnIcon />}
                  label={filteredJobs[selectedJob].jobLocation}
                  variant="outlined"
                />
                <Chip
                  icon={<BusinessIcon />}
                  label={filteredJobs[selectedJob].workEnvironment}
                  variant="outlined"
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={filteredJobs[selectedJob].experince}
                  variant="outlined"
                />
                <Chip
                  icon={<GroupsIcon />}
                  label={filteredJobs[selectedJob].team}
                  variant="outlined"
                />
              </Stack>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Posted on: {formatDate(filteredJobs[selectedJob].createdAt)}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                Job Details
              </Typography>

              {Object.entries(filteredJobs[selectedJob].jobContents).map(([section, items]) => (
                <Box key={section} sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {section.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {items.map((item, index) => (
                      <Typography key={index} component="li" paragraph>
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate(`/dashboard-hr/show-an-jobs/${filteredJobs[selectedJob].jobId}`)}
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  py: 1.5,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                View Full Details
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default ShowJob;