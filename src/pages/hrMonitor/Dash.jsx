import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  BusinessCenter,
  People,
  MonetizationOn,
  Group,
  ArrowForward,
  NotificationsActive,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from "axios";
import { base_emp, base_Ip } from "../../http/services";
import { useNavigate } from "react-router-dom";
import ShapesLoader from "../../constent/ShapesLoader";

// Styled components
const StyledCard = ({ children, gradient, ...props }) => (
  <Card
    {...props}
    sx={{
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
      background: gradient,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      ...props.sx
    }}
  >
    {children}
  </Card>
);

const StyledStatCard = ({ children, ...props }) => (
  <Card
    {...props}
    sx={{
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      },
      ...props.sx
    }}
  >
    {children}
  </Card>
);

const Dash = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [statsCards, setStatsCards] = useState([]);
  const [planDistribution, setPlanDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_emp}/emp-handler/monitor/atttendence-data/monitor-to-dashbord?organizationCode=${localStorage.getItem("organizationCode")}`
      );

      const responseData = response.data.result;
      const totalEmployees = responseData.reduce((sum, item) => sum + item.countEmp, 0);

      // Calculate distribution percentages
      const distribution = responseData.map(item => {
        const percentage = totalEmployees > 0 
          ? ((item.countEmp / totalEmployees) * 100).toFixed(1)
          : 0;

        let color;
        switch (item.tittle) {
          case 'LATE':
            color = '#FFC107';
            break;
          case 'ABSENT':
            color = '#FF5722';
          
            break;
          case 'ONTIME':
            color = '#2196F3';
            break;
          default:
            color = '#757575';
        }

        return {
          label: item.tittle,
          value: parseFloat(percentage),
          count: item.countEmp,
          color: color
        };
      });

      setPlanDistribution(distribution);

      // Process stats cards data
      const totalPersentMonth = responseData.reduce((sum, item) => sum + item.persentMonth, 0);
      const mappedStats = responseData.map(item => {
        let icon, color;
        switch (item.tittle) {
          case "LATE":
            icon = <Group />;
            color = "#03A9F4";
            break;
          case "ABSENT":
            icon = <People />;
            color = "#FF6D00";
            break;
          case "ONTIME":
            icon = <BusinessCenter />; 
            color = "#673AB7";
            break;
          default:
            icon = <MonetizationOn />;
            color = "#4CAF50";
        }

        const change = ((item.persentMonth / (totalPersentMonth || 1)) * 100).toFixed(2);

        return {
          title: `${item.tittle} Employee`,
          value: item.countEmp,
          change: `${change}%`,
          isPositive: item.persentMonth > 0,
          color: color,
          icon: icon,
        };
      });

      setStatsCards(mappedStats);
      setError(null);
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handViewAttendence =()=>{
    navigate('/dashboard-hr/attendance')
  }

  const handleViwEmp = ()=>{
    navigate('/dashboard-hr/total-emp')
  }

  useEffect(() => {
    fetchData();
  }, []);

  const generateConicGradient = () => {
    let totalDegrees = 0;
    return planDistribution.map(item => {
      const degrees = (item.value / 100) * 360;
      const start = totalDegrees;
      totalDegrees += degrees;
      return `${item.color} ${start}deg ${totalDegrees}deg`;
    }).join(',');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <ShapesLoader size="large" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: '#f8fafc' }}>
      {/* Header Card */}
      <StyledCard
        gradient="linear-gradient(135deg, #003396 0%, #86CEFA 100%)"
        sx={{ marginBottom: 4 }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)',
          }}
        />
        <CardContent sx={{ padding: 4 }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                Welcome Back, {localStorage.getItem('name') || 'User'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  onClick={fetchData}
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <NotificationsActive />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Employee Attendance Overview
              </Typography>
              <TrendingUp sx={{ color: '#4CAF50' }} />
              <Button onClick={handleViwEmp} variant="outlined" color="inherit" >Total.Emp</Button>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledStatCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color }}>
                    {stat.icon}
                  </Avatar>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {stat.isPositive ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                  <Typography
                    variant="body2"
                    sx={{ color: stat.isPositive ? 'success.main' : 'error.main', fontWeight: 600 }}
                  >
                    {stat.change} this month
                  </Typography>
                </Box>
              </CardContent>
            </StyledStatCard>
          </Grid>
        ))}
      </Grid>

      {/* Distribution Section */}
      <Grid container spacing={4}>
        {/* Left Section */}
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 2,
                background: 'linear-gradient(45deg, #1a73e8, #0d47a1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Attendance {' '}
              <Box
                component="span"
                sx={{
                  bgcolor: '#1a73e8',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  display: 'inline-block',
                  WebkitTextFillColor: 'white',
                }}
              >
                Overview
              </Box>
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: '600px', lineHeight: 1.8 }}
            >
              Track and monitor employee attendance patterns and statistics across different categories.
            </Typography>
            <Button
             onClick={handViewAttendence}
               to="/homepage-main"
               variant="contained"
               endIcon={<ArrowForward />}
               sx={{
                 borderRadius: '30px',
                 px: 4,
                 py: 1.5,
                 fontSize: '1.1rem',
                 textTransform: 'none',
                 background: 'linear-gradient(45deg, #1a73e8, #0d47a1)',
                 '&:hover': {
                   background: 'linear-gradient(45deg, #0d47a1, #1a73e8)',
                 },
               }}
             >
               Go To Attendence
             </Button>
          </Box>
        </Grid>

        {/* Right Section - Distribution Chart */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '20px',
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="600">
                Attendance Distribution
              </Typography>
              <Chip
                label="Current Month"
                size="small"
                sx={{
                  bgcolor: '#f0f7ff',
                  color: '#1a73e8',
                  fontWeight: 500,
                }}
              />
            </Box>

            <Box sx={{ position: 'relative', width: '60%', paddingBottom: '60%', marginLeft: "20%" }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '90%',
                    height: '90%',
                    position: 'relative',
                    borderRadius: '50%',
                    background: `conic-gradient(${generateConicGradient()})`,
                    transition: 'all 0.3s ease',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60%',
                      height: '60%',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 1 }}>
              {planDistribution.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: `${item.color}10`,
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: item.color,
                      }}
                    />
                    <Typography sx={{ fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 600, color: item.color }}>
                      {item.value}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({item.count} employees)
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dash;
