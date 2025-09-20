import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Avatar,
  Grid,
  LinearProgress,
  Tooltip,
  Chip,
  Divider,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";
import {
  Refresh as RefreshIcon,
  ExitToApp as LogoutIcon,
  AccessTime as TimeIcon,
  Warning as WarningIcon,
  Assignment as TaskIcon,
  Receipt as PayslipIcon,
  FolderSpecial as ProjectIcon,
  TrendingUp as TrendingUpIcon,
  Circle as CircleIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as BadgeIcon,
  People as PeopleIcon,
  BeachAccess as LeaveIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import axios from "axios";
import { base_emp, base_hr, base_Ip, base_url } from "../../../http/services";
import image1 from "../../../assets/7.jpg";

// Enhanced Card Component with white theme
const DashboardCard = ({ children, title, spacing, hover = true, minHeight = 200 }) => (
  <Card
    sx={{
      background: "#ffffff",
      borderRadius: "16px",
      border: "1px solid rgba(0, 0, 0, 0.08)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      padding: spacing || 3,
      height: "100%",
      minHeight: minHeight,
      color: "#333",
      transition: "all 0.3s ease",
      ...(hover && {
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 30px rgba(33, 150, 243, 0.15)",
          borderColor: "rgba(33, 150, 243, 0.2)",
        },
      }),
    }}
  >
    {title && (
      <>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#333', 
            mb: 2, 
            fontWeight: 600,
            borderBottom: '2px solid #2196f3',
            pb: 1,
            display: 'inline-block'
          }}
        >
          {title}
        </Typography>
      </>
    )}
    {children}
  </Card>
);

// Status Indicator Component
const StatusIndicator = ({ status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case "present":
        return "#4CAF50";
      case "late":
        return "#FFC107";
      case "absent":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: `${getStatusColor()}20`,
        color: getStatusColor(),
        py: 0.5,
        px: 2,
        borderRadius: 20,
        width: "fit-content",
        backdropFilter: "blur(10px)",
      }}
    >
      <CircleIcon sx={{ fontSize: 8 }} />
      <Typography variant="body2" fontWeight="medium">
        {status || "Pending"}
      </Typography>
    </Box>
  );
};

const Dashboard = () => {
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const credentials = { email, name };

  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [late, setLate] = useState(0);
  const [ontime, setOntime] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [workinghours, setWorkingHours] = useState(0);
  const [workinghoursPer, setWorkingHoursPer] = useState(0);
  const [lengthPro, setLengthPro] = useState(0);

  // Sample data for dashboard cards (replace with your actual data)
  const dashboardData = {
    celebrations: [
      { id: 1, type: 'Birthday', name: 'Someone Birthday', date: 'Today' },
      { id: 2, type: 'Anniversary', name: 'Someone Anniversary', date: 'Today' }
    ],
    teamMembers: [
      { id: 1, name: 'Mr Test 2', role: 'Product Manager', avatar: '/api/placeholder/40/40' },
      { id: 2, name: 'Mr Test 3', role: 'Team Lead', avatar: '/api/placeholder/40/40' }
    ],
    leaveBalance: {
      total: 20,
      left: 10,
      earned: 2
    },
    tasks: {
      pending: 12,
      assigned: 2
    },
    plannedLeaves: [
      { id: 1, name: 'Mr Test', status: 'on leave today' }
    ]
  };

  const CompareHours = (time) => {
    if (time.checkOut === null) {
      const checkInTime = new Date(time.createdAt);
      const currentTime = new Date();
      const differenceInMs = currentTime - checkInTime;
      const differenceInHours = differenceInMs / (1000 * 60 * 60);
      setWorkingHours(differenceInHours.toFixed(2));
      const percentageOfDay = Math.min((differenceInHours / 8) * 100, 100);
      setWorkingHoursPer(percentageOfDay.toFixed(2));
    } else {
      const checkInTime = new Date(time.createdAt);
      const checkOutTime = new Date(time.checkOut);
      const totalWorkedMs = checkOutTime - checkInTime;
      const totalWorkedHours = totalWorkedMs / (1000 * 60 * 60);
      setWorkingHours(totalWorkedHours.toFixed(2));
      const percentageWorked = Math.min((totalWorkedHours / 8) * 100, 100);
      setWorkingHoursPer(percentageWorked.toFixed(2));
    }
  };

  const fetchAll = async () => {
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/project/get/project-data/by-emp-code?empCode=${credentials.email}`
      );
      setLengthPro(response.data.result.length || 0);
    } catch (error) {
      console.error("Error during fetching:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceResponse, monitorResponse] = await Promise.all([
        axios.post(
          `${base_emp}/emp-handler/attendence/today-emp-atttendence?empCode=${localStorage.getItem(
            "empCode"
          )}`
        ),
        axios.post(
          `${base_emp}/emp-handler/attendence/emp-chart-mounth/attendence-monitor?empCode=${localStorage.getItem(
            "empCode"
          )}`
        ),
      ]);
      CompareHours(attendanceResponse.data.result);

      if (attendanceResponse.status === 201) {
        setStatus(attendanceResponse.data.result.attendenceStatus);
      }

      if (monitorResponse.status === 201) {
        setLate(monitorResponse.data.result.late);
        setAbsent(monitorResponse.data.result.absent);
        setOntime(monitorResponse.data.result.onTime);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAll();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f5f5",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "center", sm: "flex-start" }}
        spacing={2}
        mb={4}
      >
        <Stack spacing={1}>
          <Typography
            variant="h3"
            color="#333"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              textShadow: "none",
            }}
          >
            Hi, {credentials.name}!
          </Typography>
          <Typography
            variant="h6"
            color="rgba(0,0,0,0.7)"
            sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}
          >
            Welcome to HRHaaT
          </Typography>
          <StatusIndicator status={status} />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh Dashboard">
            <IconButton
              onClick={() => fetchData()}
              sx={{
                color: "#333",
                bgcolor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  bgcolor: "#2196f3",
                  color: "#fff",
                  transform: "rotate(180deg)",
                  transition: "transform 0.5s ease",
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              sx={{
                color: "#333",
                bgcolor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": { 
                  bgcolor: "#f44336",
                  color: "#fff"
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Dashboard Grid Layout */}
      <Grid container spacing={3}>
        {/* Row 1 */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Today Celebration">
            <Box sx={{ mt: 2 }}>
              {dashboardData.celebrations.map((celebration) => (
                <Box key={celebration.id} sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: 500, mb: 1 }}>
                    {celebration.name}
                  </Typography>
                  <Chip
                    label={celebration.type}
                    size="small"
                    sx={{ 
                      bgcolor: '#2196f3', 
                      color: '#fff',
                      fontWeight: 500
                    }}
                  />
                </Box>
              ))}
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard title="Emp Assigned Projects">
            <Box sx={{ mt: 2 }}>
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="body1" sx={{ color: '#333', fontWeight: 600, mb: 1 }}>
                  Project Name
                </Typography>
                <Typography variant="body2" sx={{ color: '#2196f3', mb: 2 }}>
                  Current Active Projects
                </Typography>
                <Typography variant="body1" sx={{ color: '#333', fontWeight: 600, mb: 1 }}>
                  Your Role
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Multi-Stack Developer
                </Typography>
              </Box>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard title="Calendar">
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <CalendarIcon sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
              <Typography variant="body1" sx={{ color: '#333', mb: 2 }}>
                All holidays and other leaves will be shown here
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Row 2 */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Badge Received">
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <BadgeIcon sx={{ fontSize: 64, color: '#ffc107', mb: 2 }} />
              <Typography variant="body1" sx={{ color: '#666' }}>
                No badges earned yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                Complete tasks to earn badges
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>

         <Grid item xs={12} md={4}>
          <DashboardCard title="Attendance Trend Analysis">
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Working Hours Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={workinghoursPer}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': { 
                      bgcolor: '#4caf50',
                      borderRadius: 6
                    }
                  }}
                />
                <Typography variant="h6" sx={{ color: '#4caf50', mt: 1, fontWeight: 600 }}>
                  {workinghoursPer}% Complete
                </Typography>
                <Typography
                  color="#666"
                  variant="body2"
                  mt={1}
                >
                  {workinghours > 8 ? 8 : workinghours}/8 hours worked
                </Typography>
              </Box>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Row 3 */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Team Planned Leaves">
            <Box sx={{ mt: 2 }}>
              {dashboardData.plannedLeaves.map((leave) => (
                <Box key={leave.id} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="body1" sx={{ color: '#333' }}>
                    <strong>{leave.name}</strong> is {leave.status}.
                  </Typography>
                </Box>
              ))}
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>  {/* Changed from md={8} to md={6} */}
  <DashboardCard title="Leave Balance" minHeight={150}>  {/* Reduced minHeight */}
    <Grid container spacing={2} sx={{ mt: 0.5 }}>  {/* Reduced spacing and margin-top */}
      <Grid item xs={4} sx={{ textAlign: 'center' }}>
        <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>  {/* Reduced padding */}
          <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold', mb: 0.5 }}>  {/* Smaller heading */}
            {dashboardData.leaveBalance.total}
          </Typography>
          <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>  {/* Smaller text */}
            Total Leaves
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'center' }}>
        <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold', mb: 0.5 }}>
            {dashboardData.leaveBalance.left}
          </Typography>
          <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
            Left Leaves
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'center' }}>
        <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 0.5 }}>
            {dashboardData.leaveBalance.earned}
          </Typography>
          <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
            Earned Leaves
          </Typography>
        </Box>
      </Grid>
    </Grid>
    <Box sx={{ mt: 2 }}>  {/* Reduced margin-top */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          bgcolor: '#2196f3',
          py: 1,  // Reduced padding
          fontWeight: 600,
          fontSize: '0.875rem',  // Smaller font
          '&:hover': { bgcolor: '#1976d2' }
        }}
        onClick={() => navigate("/dashboard-emp/emp-leave")}
      >
        Apply Leave
      </Button>
    </Box>
  </DashboardCard>
</Grid>

        {/* Attendance Overview Chart */}
        <Grid item xs={12} md={4}>
          <DashboardCard title="Attendance Overview">
            <Box sx={{ height: 250, mt: 2 }}>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: absent,
                        label: "Absent",
                        color: "#FF5252",
                      },
                      {
                        id: 1,
                        value: ontime || 0,
                        label: "On Time",
                        color: "#2ED189",
                      },
                      { id: 2, value: late, label: "Late", color: "#FFA726" },
                    ],
                    innerRadius: 40,
                    paddingAngle: 2,
                    cornerRadius: 5,
                    highlightScope: { faded: "global", highlighted: "item" },
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "bottom", horizontal: "left" },
                    labelStyle: {
                      fill: "white",
                      fontSize: "12px",
                    },
                  },
                }}
              />
            </Box>
          </DashboardCard>
        </Grid>

       
      </Grid>
    </Box>
  );
};

export default Dashboard;