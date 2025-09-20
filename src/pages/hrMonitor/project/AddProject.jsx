
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
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddProjectDrawer from "./AddProjectDrawer";
import { base_hr, base_Ip } from '../../../http/services';

const AllProject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_hr}/hr-handler/project/get-all/project-data`
      );
      const allProjects = response.data.result || [];
      setData(allProjects);
      const completedProjects = allProjects.filter(project => 
        project.status?.toLowerCase() === 'completed'
      );
      setSearchedData(completedProjects);
      setError(null);
    } catch (error) {
      console.error("Error during fetching:", error);
      setError("Failed to load project data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First filter completed projects
    const completedProjects = data.filter(project => 
      project.status?.toLowerCase() === 'completed'
    );
    
    // Then apply search filter
    const searchFiltered = completedProjects.filter(project => 
      project.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectManager?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchedData(searchFiltered);
  }, [searchQuery, data]);

  const handleNavigation = (projectId) => {
    navigate(`/dashboard-hr/detail-project/${projectId}`);
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

  const filteredData = data.filter(project => 
    project.status?.toLowerCase() === 'completed'
  );

  const summaryData = [
    {
      title: "Total Completed Projects",
      value: searchedData.length,
      icon: <AssignmentIcon />,
      color: "#4caf50"
    },
    {
      title: "Average Completion Time",
      value: searchedData.length ? 
        Math.round(searchedData.reduce((acc, curr) => {
          const start = new Date(curr.startDate);
          const end = new Date(curr.endDate);
          return acc + (end - start) / (1000 * 60 * 60 * 24);
        }, 0) / searchedData.length) + " days" : 
        "N/A",
      icon: <ScheduleIcon />,
      color: "#2196f3"
    },
    {
      title: "Team Members Involved",
      value: searchedData.reduce((acc, curr) => 
        acc + (Object.keys(curr.teamsMember || {}).length), 0),
      icon: <PeopleIcon />,
      color: "#9c27b0"
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
      {/* Header and Search Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Completed Project Dashboard
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2
        }}>
          <Card
            elevation={0}
            sx={{
              flex: 1,
              maxWidth: '500px',
              borderRadius: 3,
              bgcolor: 'white',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ py: '12px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SearchIcon sx={{ color: '#4caf50', mr: 1 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search completed projects by name, manager or ID..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '1rem',
                    padding: '8px 0',
                    color: '#1a237e',
                    backgroundColor: 'transparent',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
          <Typography variant="body2" sx={{ 
            color: '#4caf50',
            fontWeight: 500,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            padding: '8px 16px',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
          }}>
            Showing {searchedData.length} of {filteredData.length} completed projects
          </Typography>
        </Box>
      </Box>

      <AddProjectDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                },
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
        {searchedData.map((project) => {
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