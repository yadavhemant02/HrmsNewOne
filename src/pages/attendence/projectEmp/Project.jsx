import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  Divider,
  IconButton,
  LinearProgress,
  AvatarGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  DateRange as DateRangeIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { base_hr, base_identity, base_Ip } from '../../../http/services';
import { useSelector } from 'react-redux';
//  import AddProjectDrawer from "./AddProjectDrawer";

const AllProject = () => {
  const credentials = useSelector((state) => state.credential?.credential || {});

  console.log(credentials,"Llllllllllllllllllllll");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_hr}/hr-handler/project/get/project-data/by-emp-code?empCode=${credentials.email}`
      );
      setData(response.data.result || []);
      setError(null);
    } catch (error) {
      console.error("Error during fetching:", error);
      setError("Failed to load project data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (projectId) => {
    navigate(`/dashboard-emp/detail-project-emp/${projectId}`);
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const getStatusColor = (status) => {
    if (!status) return '#757575';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4caf50';
      case 'in progress':
        return '#2196f3';
      case 'pending':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return '#4caf50';
    if (progress >= 50) return '#2196f3';
    if (progress >= 25) return '#ff9800';
    return '#f44336';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate progress based on dates
  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (today < start) return 0;
    if (today > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  };

  // Summary Cards Data
  const summaryData = [
    {
      title: "Total Projects",
      value: data.length,
      icon: <AssignmentIcon />,
      color: "#2196f3"
    },
    {
      title: "Pending Projects",
      value: data.filter(p => p.status?.toLowerCase() === "pending").length,
      icon: <ScheduleIcon />,
      color: "#ff9800"
    },
    {
      title: "Team Members",
      value: data.reduce((acc, curr) => acc + (Object.keys(curr.teamsMember || {}).length), 0),
      icon: <PeopleIcon />,
      color: "#4caf50"
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
         Assigned Project
        </Typography>
      </Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color={item.color}>
                      {item.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: `${item.color}15`,
                      color: item.color,
                      width: 48,
                      height: 48
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {data.map((project) => {
          const progress = calculateProgress(project.startDate, project.endDate);
          const teamMembers = Object.entries(project.teamsMember || {});

          return (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card 
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="#1a237e">
                      {project.projectName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.projectId}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.discription || 'No description available'}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#1a237e', width: 32, height: 32, mr: 1 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Project Manager
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {project.projectManager}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DateRangeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#e3f2fd',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getProgressColor(progress),
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <AvatarGroup max={4}>
                        {teamMembers.map(([email, role], index) => (
                          <Avatar
                            key={index}
                            sx={{ width: 30, height: 30, bgcolor: '#1a237e' }}
                          >
                            {email[0].toUpperCase()}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <Chip
                        label={project.status}
                        sx={{
                          bgcolor: `${getStatusColor(project.status)}15`,
                          color: getStatusColor(project.status),
                          fontWeight: 'medium',
                          borderRadius: '8px',
                        }}
                      />
                    </Box>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      // onClick={() => handleNavigation(project.id)}
                      onClick={() => handleNavigation(project.projectId)}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        bgcolor: '#1a237e',
                        '&:hover': { bgcolor: '#0d47a1' }
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AllProject;