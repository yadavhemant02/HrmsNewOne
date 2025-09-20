import { styled } from "@mui/material/styles";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  CssBaseline,
  Box,
  Button,
  Drawer,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  ExitToApp as ExitToAppIcon,
  Timer as TimerIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
} from "@mui/icons-material";
import ShapesLoader from "../../../constent/ShapesLoader";
import Navbar from "../../../components/attendenceComponent/Navbar";
import Checkin from "../Checkin";
import Checkout from "../Checkout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_emp } from "../../../http/services";

// Memoized styled component to prevent re-creation
const GradientBanner = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
  padding: "24px",
  color: "white",
  borderTopLeftRadius: "20px",
  borderTopRightRadius: "20px",
  marginLeft: "25px",
  marginRight: "25px",
  width: "calc(100% - 50px)",
  marginTop: "20px",
}));

function AttendenceEmp() {
  // Load user credentials once
  const credentials = useMemo(() => ({
    email: localStorage.getItem("email"),
    name: localStorage.getItem("name"),
    empCode: localStorage.getItem("empCode"),
  }), []);

  // Consolidated drawer state
  const [drawerState, setDrawerState] = useState({ left: false, right: false });
  
  // Consolidated attendance data state
  const [attendanceData, setAttendanceData] = useState({
    checkIn: null,
    checkOut: null,
    attendenceStatus: "",
    todayDate: null,
    workingHours: 0,
    workingMinutes: 0,
    count: 0,
    breakTime: 0,
    isBreakEnabled: false
  });

  // Break timer state
  const [breakState, setBreakState] = useState({
    isBreak: false,
    breakCount: 0,
    currentTime: 0,
    totalBreakTime: 0,
    timer: null,
    lastBreakStart: null,
  });

  // Work timer state
  const [workTimer, setWorkTimer] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Format time functions (memoized to prevent recreation)
  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const formatBreakTime = useCallback((seconds) => {
    if (!seconds) return "0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "#4caf50";
      case "late":
        return "#ff9800";
      case "absent":
        return "#e91e63";
      default:
        return "#757575";
    }
  }, []);

  // Fetch attendance data - moved to a function for reuse
  const fetchAttendanceData = useCallback(async () => {
    try {
      const response = await axios.post(
        `${base_emp}/emp-handler/attendence/today-emp-atttendence?empCode=${credentials.empCode}`
      );
      
      if (response.status === 201) {
        const data = response.data.result;
        
        // Store all attendance data at once
        setAttendanceData({
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          attendenceStatus: data.attendenceStatus,
          todayDate: data.todayDate,
          count: data.noOfBreak || 0,
          breakTime: data.breakTime || 0,
          isBreakEnabled: !!data.checkIn && !data.checkOut,
          workingHours: data.workingHours ? Math.floor(data.workingHours / 3600) : 0,
          workingMinutes: data.workingHours ? Math.floor((data.workingHours % 3600) / 60) : 0
        });

        // Only set these critical values to localStorage (minimized localStorage usage)
        localStorage.setItem("checkin", data.checkIn || "");
        localStorage.setItem("checkout", data.checkOut || "");
        localStorage.setItem("remoteWork", data.remoteWork || "");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  }, [credentials.empCode]);

  // Toggle drawer - simplify with single function
  const toggleDrawer = useCallback((open, side) => () => {
    setDrawerState(prev => ({ ...prev, [side]: open }));
  }, []);

  // Handle break timer
  const handleBreakToggle = useCallback(async () => {
    if (!breakState.isBreak) {
      // Starting break
      const startTime = Date.now();
      
      // Update break state atomically
      setBreakState(prev => {
        // Clear any existing timers
        if (prev.timer) clearInterval(prev.timer);
        
        // Create new timer
        const newTimer = setInterval(() => {
          setBreakState(state => ({
            ...state,
            currentTime: state.currentTime + 1,
            totalBreakTime: state.totalBreakTime + 1
          }));
        }, 1000);
        
        // Store break state in session storage
        sessionStorage.setItem("breakState", "active");
        sessionStorage.setItem("breakStartTime", startTime.toString());
        
        return {
          ...prev,
          isBreak: true,
          breakCount: prev.breakCount + 1,
          lastBreakStart: startTime,
          timer: newTimer
        };
      });
    } else {
      // Ending break - clear timer first to prevent race conditions
      setBreakState(prev => {
        if (prev.timer) clearInterval(prev.timer);
        return { ...prev, timer: null, isBreak: false };
      });
      
      // Clear session storage
      sessionStorage.removeItem("breakState");
      sessionStorage.removeItem("breakStartTime");
      
      // Calculate break duration
      const breakDuration = Math.floor((Date.now() - breakState.lastBreakStart) / 1000);
      
      try {
        // Submit break data
        await axios.post(
          `${base_emp}/emp-handler/attendence/add-break-of-attendence`,
          {
            empCode: credentials.empCode,
            noOfBreak: 1,
            breakTime: breakDuration,
          }
        );
        
        // Refresh attendance data to get updated break counts
        await fetchAttendanceData();
        
        // Reset current time
        setBreakState(prev => ({ ...prev, currentTime: 0 }));
      } catch (error) {
        console.error("Error updating break:", error);
      }
    }
  }, [breakState.isBreak, breakState.lastBreakStart, breakState.timer, credentials.empCode, fetchAttendanceData]);

  // Initialize timers and fetch data on mount
  useEffect(() => {
    // REMOVE THE PAGE RELOAD CODE - this was causing unnecessary reloads
    // and instead fetch data immediately
    fetchAttendanceData();
    
    // Initialize break timer from session storage if exists
    const savedBreakState = sessionStorage.getItem("breakState");
    const savedBreakStart = sessionStorage.getItem("breakStartTime");
    
    if (savedBreakState === "active" && savedBreakStart) {
      const startTime = parseInt(savedBreakStart);
      const currentTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      setBreakState(prev => {
        // Clear any existing timer
        if (prev.timer) clearInterval(prev.timer);
        
        // Create new timer
        const newTimer = setInterval(() => {
          setBreakState(state => ({
            ...state,
            currentTime: state.currentTime + 1,
            totalBreakTime: state.totalBreakTime + 1
          }));
        }, 1000);
        
        return {
          ...prev,
          isBreak: true,
          currentTime: currentTimeSeconds,
          lastBreakStart: startTime,
          timer: newTimer
        };
      });
    }
    
    // Initialize work timer if checked in but not checked out
    const checkIn = localStorage.getItem("checkin");
    const checkOut = localStorage.getItem("checkout");
    
    if (checkIn && !checkOut) {
      let startTime = parseInt(localStorage.getItem("startTime")) || Date.now();
      if (!localStorage.getItem("startTime")) {
        localStorage.setItem("startTime", startTime.toString());
      }
      
      const workTimerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setWorkTimer({
          hours: Math.floor(elapsedTime / 3600),
          minutes: Math.floor((elapsedTime % 3600) / 60),
          seconds: elapsedTime % 60
        });
      }, 1000);
      
      return () => {
        clearInterval(workTimerInterval);
      };
    } else if (checkOut) {
      // If checked out, clear timer storage
      localStorage.removeItem("startTime");
    }
    
    // Cleanup all timers on unmount
    return () => {
      setBreakState(prev => {
        if (prev.timer) clearInterval(prev.timer);
        return prev;
      });
    };
  }, [fetchAttendanceData]);

  // Show loader while fetching data
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ShapesLoader size="large" />
      </Box>
    );
  }

  const { checkIn, checkOut, attendenceStatus, todayDate, workingHours, workingMinutes, count, breakTime, isBreakEnabled } = attendanceData;

  return (
    <div>
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(45deg, #f0f7ff 30%, #ffffff 90%)",
        }}
      >
        <GradientBanner>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="500" gutterBottom>
                {credentials.name}
              </Typography>
              <Typography>EMP Code: {credentials.empCode}</Typography>
            </Box>
          </Box>
        </GradientBanner>

        {/* Break Tracker Card */}
        <Box sx={{ width: "100%", p: 3 }}>
          <Card
            elevation={3}
            sx={{
              boxShadow: "none",
              borderRadius: 2,
              position: "relative",
              overflow: "visible",
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left side content */}
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <TimerIcon color="primary" />
                        Break Tracker
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Track your breaks and monitor total break time
                      </Typography>
                    </Box>

                    {/* Right side buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={breakState.isBreak ? <StopIcon /> : <PlayArrowIcon />}
                        onClick={handleBreakToggle}
                        color={breakState.isBreak ? "error" : "primary"}
                        disabled={!isBreakEnabled}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 4,
                          },
                          transition: "all 0.2s",
                          "&.Mui-disabled": {
                            backgroundColor: "#e0e0e0",
                            color: "#9e9e9e",
                          },
                        }}
                      >
                        {breakState.isBreak ? "End Break" : "Start Break"}
                      </Button>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Card
                    sx={{
                      boxShadow: "none",
                      bgcolor: "#F5F6FB",
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Current Break</Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {formatTime(breakState.currentTime)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Card
                    sx={{
                      boxShadow: "none",
                      bgcolor: "#F5F6FB",
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Break Count</Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Card
                    sx={{
                      boxShadow: "none",
                      bgcolor: "#F5F6FB",
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">Total Break Time</Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {formatBreakTime(breakTime)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Attendance Cards */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ width: "100%", padding: 3 }}
        >
          {/* Check-In Card */}
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                borderRadius: 3,
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 8px 24px rgba(149, 157, 165, 0.2)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(149, 157, 165, 0.2)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#3f51b5",
                    width: 48,
                    height: 48,
                  }}
                >
                  <AccessTimeIcon />
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "600",
                    color: "#3f51b5",
                  }}
                >
                  Sign-In
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "rgba(63, 81, 181, 0.05)",
                  border: "1px solid rgba(63, 81, 181, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <AccessTimeIcon sx={{ color: "#3f51b5" }} fontSize="small" />
                  <Typography variant="body1" fontWeight={500}>
                    {checkIn || "Not signed in yet"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CalendarTodayIcon
                    sx={{ color: "#3f51b5" }}
                    fontSize="small"
                  />
                  <Typography variant="body1" fontWeight={500}>
                    {todayDate || "Pending..."}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<AccessTimeIcon />}
                onClick={toggleDrawer(true, "left")}
                fullWidth
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  bgcolor: "#3f51b5",
                  "&:hover": {
                    bgcolor: "#303f9f",
                  },
                }}
              >
                Open Sign In
              </Button>
            </Paper>
          </Grid>

          {/* Dashboard Card */}
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                borderRadius: 3,
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 8px 24px rgba(149, 157, 165, 0.2)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(149, 157, 165, 0.2)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#4caf50",
                    mb: 2,
                  }}
                >
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {credentials.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    mb: 3,
                    color: "#3f51b5",
                  }}
                >
                  Welcome to HRH<i>aaT</i>
                </Typography>

                <Chip
                  label={attendenceStatus || "Pending..."}
                  sx={{
                    backgroundColor: getStatusColor(attendenceStatus),
                    color: "white",
                    fontSize: "1rem",
                    py: 2,
                    px: 3,
                  }}
                  icon={<CheckCircleIcon sx={{ color: "white !important" }} />}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Check-Out Card */}
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                borderRadius: 3,
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 8px 24px rgba(149, 157, 165, 0.2)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 24px rgba(149, 157, 165, 0.2)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#3f51b5",
                    width: 48,
                    height: 48,
                  }}
                >
                  <ExitToAppIcon />
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "600",
                    color: "#3f51b5",
                  }}
                >
                  Sign-Out
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "rgba(63, 81, 181, 0.05)",
                  border: "1px solid rgba(63, 81, 181, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ExitToAppIcon sx={{ color: "#3f51b5" }} fontSize="small" />
                    <Typography variant="body1" fontWeight={500}>
                      {checkOut || "Not signed out yet"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TimerIcon sx={{ color: "#3f51b5" }} fontSize="small" />
                    <Typography variant="body1" fontWeight={500}>
                      {workingHours >= 1
                        ? `${workingHours} hours`
                        : workingMinutes
                        ? `${workingMinutes} minutes`
                        : "No time recorded"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<ExitToAppIcon />}
                onClick={toggleDrawer(true, "right")}
                fullWidth
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  bgcolor: "#3f51b5",
                  "&:hover": {
                    bgcolor: "#303f9f",
                  },
                }}
              >
                Open Sign Out
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Drawers */}
        <Drawer
          anchor="left"
          open={drawerState.left}
          onClose={toggleDrawer(false, "left")}
          sx={{
            "& .MuiDrawer-paper": {
              width: { xs: "90%", sm: "50%", md: "30%" },
              maxWidth: "600px",
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" fontWeight={600}>
                Sign In
              </Typography>
              <IconButton onClick={toggleDrawer(false, "left")}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Checkin
              onCheckInSuccess={() => {
                fetchAttendanceData();
                toggleDrawer(false, "left")();
              }}
            />
          </Box>
        </Drawer>
        
        <Drawer
          anchor="right"
          open={drawerState.right}
          onClose={toggleDrawer(false, "right")}
          sx={{
            "& .MuiDrawer-paper": {
              width: { xs: "90%", sm: "50%", md: "30%" },
              maxWidth: "600px",
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" fontWeight={600}>
                Check Out
              </Typography>
              <IconButton onClick={toggleDrawer(false, "right")}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Checkout
              onCheckoutSuccess={() => {
                fetchAttendanceData();
                toggleDrawer(false, "right")();
              }}
            />
          </Box>
        </Drawer>
      </Box>
    </div>
  );
}

export default AttendenceEmp;