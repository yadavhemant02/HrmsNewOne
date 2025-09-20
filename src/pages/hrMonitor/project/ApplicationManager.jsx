import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  Avatar,
  InputAdornment,
  CircularProgress,
  IconButton,
  Fade,
  useTheme,
  Grid,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  TablePagination,
  Container,
  Zoom,
  Slide,
  Breadcrumbs,
  Link,
  Tooltip,
  Stack,
  Badge,
  LinearProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  Clear as ClearIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  ManageAccounts as ManageAccountsIcon,
  Analytics as AnalyticsIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { base_identity } from "../../../http/services";
import MemberDetailsDialog from "./MemberDetailsDialog";

const ApplicationManager = () => {
  const theme = useTheme();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organizationCode, setOrganizationCode] = useState("CKD%20");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedMembers, setPaginatedMembers] = useState([]);

  // Function to fetch assignment status
  const fetchAssignmentStatus = async () => {
    try {


      console.log("lllllllllllllllllll")
      const managerCode = localStorage.getItem('empCode');
      console.log("000000000000000000000")
      // if (!managerCode) {
      //   console.error("Manager code not found in localStorage");
      //   return;
      // }

      console.log("uuuuuuuuuuuuuuuuuuuuu")
      
      const response = await axios.get(
        `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem("organizationCode")}`,
        {
          headers: {
            accept: "*/*",
          },
        }
      );
      
      const assignmentData = await fetchAssignmentData(managerCode);
      
      // Map the assigned status to the members
      const membersWithAssignedStatus = response.data.map(member => {
        const isAssigned = assignmentData.some(assignment => 
          assignment.empCode === member.empCode
        );
        return {
          ...member,
          assigned: isAssigned
        };
      });
      
      setMembers(membersWithAssignedStatus);
      setFilteredMembers(membersWithAssignedStatus);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load members. Please try again later.");
      setLoading(false);
    }
  };
  
  const fetchAssignmentData = async (managerCode) => {
    
    return new Promise(resolve => {
      // Simulate API delay
      setTimeout(() => {
        resolve([
          { managerCode, empCode: members[0]?.empCode || 'EMP001' },
          { managerCode, empCode: members[2]?.empCode || 'EMP003' },
        ]);
      }, 300);
    });
  };

  useEffect(() => {
    fetchAssignmentStatus();
  }, [organizationCode]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.empCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, members]);

  // Update paginated members when filteredMembers, page, or rowsPerPage changes
  useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedMembers(filteredMembers.slice(startIndex, endIndex));
  }, [filteredMembers, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenDialog = (member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMember(null);
  };
  
  // Handle successful assignment
  const handleAssignSuccess = (empCode) => {
    const updatedMembers = members.map(member => {
      if (member.empCode === empCode) {
        return { ...member, assigned: true };
      }
      return member;
    });
    
    setMembers(updatedMembers);
    setFilteredMembers(updatedMembers);
    
    // Show success message
    setSnackbarMessage(`${selectedMember?.name || 'Employee'} successfully assigned as Application Manager`);
    setSnackbarOpen(true);
  };

  // Function to get initials from a name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("");
  };

  // Function to get statistics
  const getStatistics = () => {
    const assignedCount = members.filter(member => member.manager !== "").length;
    const unassignedCount = members.length - assignedCount;
    const assignmentRate = members.length > 0 ? Math.round((assignedCount / members.length) * 100) : 0;
    
    return {
      total: members.length,
      assigned: assignedCount,
      unassigned: unassignedCount,
      assignmentRate
    };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <CircularProgress size={60} thickness={4} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" paragraph>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 28 }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: '#fafbfc' }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Professional Header with Breadcrumbs */}
          <Card
            elevation={0}
            sx={{
              mb: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3,
              }
            }}
          >
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              {/* Breadcrumbs */}
              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{
                  mb: 2,
                  '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,0.7)' }
                }}
              >
                <Link
                  color="inherit"
                  href="#"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    opacity: 0.8,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                  Dashboard
                </Link>
                <Link
                  color="inherit"
                  href="#"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    opacity: 0.8,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <BusinessIcon sx={{ mr: 0.5, fontSize: 18 }} />
                  HR Management
                </Link>
                <Typography
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600
                  }}
                >
                  <ManageAccountsIcon sx={{ mr: 0.5, fontSize: 18 }} />
                  Operations Manager
                </Typography>
              </Breadcrumbs>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="700"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Operations Management
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      opacity: 0.9, 
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      maxWidth: 600
                    }}
                  >
                    Efficiently manage, assign, and monitor operations team members with advanced analytics and insights
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} sx={{ mt: { xs: 2, md: 0 } }}>
                  <Tooltip title="Refresh Data">
                    <Button
                      variant="contained"
                      startIcon={<RefreshIcon />}
                      onClick={() => window.location.reload()}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        }
                      }}
                    >
                      Refresh
                    </Button>
                  </Tooltip>
                  <Tooltip title="Export Data">
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        }
                      }}
                    >
                      Export
                    </Button>
                  </Tooltip>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* Professional Statistics Dashboard */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} timeout={600}>
                <Card
                  elevation={0}
                  sx={{
                    background: '#fff',
                    border: '1px solid #e1e5e9',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                      borderColor: '#667eea',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                   
                    <Typography variant="h3" fontWeight="700" color="text.primary" mb={0.5}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">
                      Total Team Members
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{
                        mt: 2,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 3,
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} timeout={800}>
                <Card
                  elevation={0}
                  sx={{
                    background: '#fff',
                    border: '1px solid #e1e5e9',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                      borderColor: '#4caf50',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h3" fontWeight="700" color="text.primary" mb={0.5}>
                      {stats.assigned}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">
                      Successfully Assigned
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.round((stats.assigned / stats.total) * 100)}
                      sx={{
                        mt: 2,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                          borderRadius: 3,
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} timeout={1000}>
                <Card
                  elevation={0}
                  sx={{
                    background: '#fff',
                    border: '1px solid #e1e5e9',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                      borderColor: '#ff9800',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h3" fontWeight="700" color="text.primary" mb={0.5}>
                      {stats.unassigned}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">
                      Awaiting Assignment
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.round((stats.unassigned / stats.total) * 100)}
                      sx={{
                        mt: 2,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                          borderRadius: 3,
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} timeout={1200}>
                <Card
                  elevation={0}
                  sx={{
                    background: '#fff',
                    border: '1px solid #e1e5e9',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                      borderColor: '#2196f3',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h3" fontWeight="700" color="text.primary" mb={0.5}>
                      {stats.assignmentRate}%
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">
                      Assignment Success Rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats.assignmentRate}
                      sx={{
                        mt: 2,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(33, 150, 243, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                          borderRadius: 3,
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>

          {/* Professional Search & Filter Section */}
          <Slide direction="up" in={true} timeout={1000}>
            {/* <Card
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: 3,
                // background: '#fff',
                border: '1px solid #e1e5e9',
                // '&:hover': {
                //   boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                // }
              }}
            >
            
            </Card> */}

              <CardContent sx={{ p: 3 }}>
               
                
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      placeholder="Search by name, email, employee code, or department..."
                      variant="outlined"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <Tooltip title="Clear search">
                              <IconButton 
                                onClick={() => setSearchTerm('')} 
                                size="small"
                                sx={{
                                  color: '#667eea',
                                  '&:hover': {
                                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                  }
                                }}
                              >
                                <ClearIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover fieldset': {
                              borderColor: '#667eea',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#667eea',
                              borderWidth: '2px',
                              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                            },
                          },
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box 
                      display="flex" 
                      justifyContent={{ xs: 'flex-start', md: 'flex-end' }} 
                      alignItems="center"
                      gap={2}
                    >
                      <Badge
                        badgeContent={filteredMembers.length}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.2)'
                          }}
                        >
                          <PeopleIcon sx={{ fontSize: 20, color: '#667eea' }} />
                          <Typography variant="body2" color="#667eea" fontWeight="600">
                            Results
                          </Typography>
                        </Box>
                      </Badge>
                      
                      <Typography variant="body2" color="text.secondary">
                        of {members.length} total
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
          </Slide>

          {/* Professional Members Management Table */}
          <Slide direction="up" in={true} timeout={1200}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: '#fff',
                border: '1px solid #e1e5e9',
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                },
              }}
            >
              {/* Table Header */}
              <Box
                sx={{
                  p: 3,
                  borderBottom: '1px solid #e1e5e9',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" fontWeight="600" color="text.primary">
                      Team Members Directory
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage assignments and monitor team member status
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`${stats.assigned} Assigned`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                    <Chip
                      icon={<CancelIcon />}
                      label={`${stats.unassigned} Pending`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: '#f8f9fa',
                        borderBottom: '2px solid #e1e5e9'
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          fontWeight: "700", 
                          color: '#374151',
                          fontSize: "0.875rem",
                          py: 2.5,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          borderBottom: 'none'
                        }}
                      >
                        Team Member
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: "700", 
                          color: '#374151',
                          fontSize: "0.875rem",
                          py: 2.5,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          borderBottom: 'none'
                        }}
                      >
                        Contact Details
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: "700", 
                          color: '#374151',
                          fontSize: "0.875rem",
                          py: 2.5,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          borderBottom: 'none'
                        }}
                        align="center"
                      >
                        Status
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: "700", 
                          color: '#374151',
                          fontSize: "0.875rem",
                          py: 2.5,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          borderBottom: 'none'
                        }}
                        align="center"
                      >
                        Management
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedMembers.length > 0 ? (
                      paginatedMembers.map((member, index) => (
                        <Fade in={true} timeout={800 + (index * 100)} key={member.id}>
                          <TableRow
                            hover
                            sx={{
                              "&:hover": {
                                backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                transform: 'scale(1.01)',
                              },
                              transition: 'all 0.2s ease',
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}
                          >
                            <TableCell sx={{ py: 2 }}>
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: "bold",
                                    width: 50,
                                    height: 50,
                                    fontSize: '1.2rem',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                                  }}
                                >
                                  {getInitials(member.name)}
                                </Avatar>
                                <Box ml={2}>
                                  <Typography variant="h6" fontWeight="600" color="primary">
                                    {member.name}
                                  </Typography>
                                  <Chip 
                                    label={member.empCode} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ 
                                      borderColor: theme.palette.primary.main,
                                      color: theme.palette.primary.main,
                                      fontWeight: 500
                                    }}
                                  />
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Box>
                                <Typography variant="body1" fontWeight="500">
                                  📧 {member.email}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                  📱 {member.mobileNumber}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center" sx={{ py: 2 }}>
                              {member.manager !== "" ? (
                                <Chip
                                  icon={<CheckCircleIcon />}
                                  label="Assigned"
                                  color="success"
                                  variant="filled"
                                  sx={{ 
                                    fontWeight: 600,
                                    px: 2,
                                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                                  }}
                                />
                              ) : (
                                <Chip
                                  icon={<CancelIcon />}
                                  label="Unassigned"
                                  color="error"
                                  variant="filled"
                                  sx={{ 
                                    fontWeight: 600,
                                    px: 2,
                                    boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)'
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center" sx={{ py: 2 }}>
                              <Button
                                variant="contained"
                                size="medium"
                                startIcon={<ViewIcon />}
                                onClick={() => handleOpenDialog(member)}
                                sx={{
                                  borderRadius: "25px",
                                  textTransform: "none",
                                  minWidth: "120px",
                                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                  fontWeight: 600,
                                  py: 1,
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                                  }
                                }}
                              >
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                        </Fade>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                          <Box>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              🔍 No members found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Try adjusting your search criteria
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Enhanced Pagination */}
              <Box
                sx={{
                  borderTop: '1px solid rgba(0,0,0,0.08)',
                  background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)',
                }}
              >
                <TablePagination
                  component="div"
                  count={filteredMembers.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{
                    '& .MuiTablePagination-toolbar': {
                      px: 3,
                      py: 2,
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontWeight: 500,
                      color: theme.palette.primary.main,
                    },
                    '& .MuiTablePagination-select': {
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.primary.main}`,
                      px: 1,
                    },
                    '& .MuiTablePagination-actions button': {
                      borderRadius: 2,
                      mx: 0.5,
                      '&:hover': {
                        background: theme.palette.primary.main,
                        color: 'white',
                      }
                    }
                  }}
                />
              </Box>
            </Card>
          </Slide>

          {/* Member Details Dialog */}
          <MemberDetailsDialog
            open={dialogOpen}
            handleClose={handleCloseDialog}
            organizationCode={organizationCode}
            member={selectedMember}
            onAssignSuccess={handleAssignSuccess}
          />

          {/* Success Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={() => setSnackbarOpen(false)} 
              severity="success" 
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
};

export default ApplicationManager; 