import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  styled,
  alpha,
  keyframes,
  Grid,
  Container,
  IconButton,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  AccessTime,
  Speed,
  Person,
  Update,
  Assessment,
  ArrowUpward,
  Email,
  Phone,
  CalendarToday,
  Work,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { base_emp } from '../../../http/services';

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const DashboardCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  background: 'linear-gradient(135deg, #7BA69A 0%, #5B8D7F 100%)',
  color: 'white',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
}));

const ProfileContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #2A3F4C 0%, #1C2E3A 100%)',
  borderRadius: 20,
  marginBottom: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  margin: '0 auto',
  border: '6px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  animation: `${pulseAnimation} 3s infinite ease-in-out`,
}));

const ProgressCircle = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  animation: `${floatAnimation} 4s infinite ease-in-out`,
}));

const InfoChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.8)',
  marginTop: theme.spacing(1),
}));

const WorkingSpeedDashboard = () => {
  const { empCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    baseImage: "",
    attendancePercentage: 0,
    employeeDetails: {
      name: "",
      empCode: "",
      designation: "",
      email: "",
      phone: "",
      dateOfJoin: "",
      dateOfBirth: "",
    },
    stats: {
      projectsCount: 0,
      tasksCompleted: 0,
    }
  });

  useEffect(() => {
    fetchAllData();
  }, [empCode]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [imageResp, detailsResp, attendanceResp] = await Promise.all([
        axios.get(`${base_emp}/emp-handler/image/get-emp-image?empCode=${empCode}`),
        axios.post(`http://localhost:7000/identity-handler/details/get-emp-details?empCode=${empCode}`),
        axios.post(`http://localhost:7005/emp-handler/attendence/emp-all-attendence?empCode=${empCode}`)
      ]);

      // Process image
      const baseImage = imageResp.status === 201 
        ? `data:image/png;base64,${imageResp.data.result}`
        : "";

      // Process employee details
      const employeeDetails = detailsResp.data ? {
        name: detailsResp.data.name || "",
        empCode: detailsResp.data.empCode || "",
        designation: detailsResp.data.disignation || "",
        email: detailsResp.data.officialEmail || detailsResp.data.personalEmail || "",
        phone: detailsResp.data.primaryPhone || detailsResp.data.alternatePhone || "",
        dateOfJoin: detailsResp.data.dateOfJoin ? new Date(detailsResp.data.dateOfJoin).toLocaleDateString() : "",
        dateOfBirth: detailsResp.data.dateOfBirth ? new Date(detailsResp.data.dateOfBirth).toLocaleDateString() : "",
      } : {};

      // Calculate attendance percentage
      let attendancePercentage = 0;
      if (attendanceResp.data?.result) {
        const records = attendanceResp.data.result;
        const totalRecords = records.length;
        const onTimeRecords = records.filter(record => record.attendenceStatus !== "ABSENT").length;
        attendancePercentage = totalRecords > 0 ? Math.round((onTimeRecords / totalRecords) * 100) : 0;
      }

      setData({
        baseImage,
        attendancePercentage,
        employeeDetails,
        stats: {
          projectsCount: 3, // You can replace these with actual values from API
          tasksCompleted: 12,
        }
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load employee data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 4 }} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 4 }} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchAllData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12}>
          <ProfileContainer>
            <StyledAvatar
              src={data.baseImage || "https://via.placeholder.com/150"}
              alt={data.employeeDetails.name}
            />
            <Typography variant="h4" sx={{ mt: 3, mb: 1, color: 'white', fontWeight: 600 }}>
              {data.employeeDetails.name}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              {data.employeeDetails.designation}
            </Typography>
            
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <InfoChip>
                  <Email fontSize="small" />
                  <Typography variant="body2">{data.employeeDetails.email}</Typography>
                </InfoChip>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoChip>
                  <Phone fontSize="small" />
                  <Typography variant="body2">{data.employeeDetails.phone}</Typography>
                </InfoChip>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoChip>
                  <Work fontSize="small" />
                  <Typography variant="body2">Joined: {data.employeeDetails.dateOfJoin}</Typography>
                </InfoChip>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoChip>
                  <CalendarToday fontSize="small" />
                  <Typography variant="body2">DOB: {data.employeeDetails.dateOfBirth}</Typography>
                </InfoChip>
              </Grid>
            </Grid>
          </ProfileContainer>
        </Grid>

        {/* Attendance Metrics */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Speed sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" fontWeight="600">
                  Attendance Rate
                </Typography>
              </Box>
              
              <ProgressCircle>
                <CircularProgress
                  variant="determinate"
                  value={data.attendancePercentage}
                  size={160}
                  thickness={5}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h3" fontWeight="bold">
                    {data.attendancePercentage}%
                  </Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    On-time Rate
                  </Typography>
                </Box>
              </ProgressCircle>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  startIcon={<Update />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                    },
                  }}
                  onClick={fetchAllData}
                >
                  Refresh Data
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </DashboardCard>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DashboardCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="overline" sx={{ opacity: 0.8 }}>
                        Active Projects
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {data.stats.projectsCount}
                      </Typography>
                    </Box>
                    <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                      <ArrowUpward />
                    </IconButton>
                  </Box>
                </CardContent>
                
              </DashboardCard>
              
            </Grid>
            <Grid item xs={12}>
              <DashboardCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="overline" sx={{ opacity: 0.8 }}>
                        Active Projects
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {data.stats.projectsCount}
                      </Typography>
                    </Box>
                    <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                      <ArrowUpward />
                    </IconButton>
                  </Box>
                </CardContent>
                
              </DashboardCard>
              
            </Grid>
            <Grid item xs={12}>
              <DashboardCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="overline" sx={{ opacity: 0.8 }}>
                        Tasks Completed
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {data.stats.tasksCompleted}
                      </Typography>
                    </Box>
                    <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                      <AccessTime />
                    </IconButton>
                  </Box>
                </CardContent>
              </DashboardCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WorkingSpeedDashboard;