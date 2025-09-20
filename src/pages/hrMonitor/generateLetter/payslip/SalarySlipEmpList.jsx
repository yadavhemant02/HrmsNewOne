import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  TablePagination,
  useTheme,
  alpha,
  styled,
  Divider,
  InputAdornment,
  TextField,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { base_hr, base_identity } from '../../../../http/services';

// Styled components for enhanced visuals
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 'calc(100vh - 280px)',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    borderRadius: '4px',
  },
}));

const GenerateNewButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  fontWeight: 600,
  color: 'white',
  padding: '10px 20px',
  minWidth: '200px',
  '&:hover': {
    background: 'linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)',
    boxShadow: '0 6px 14px rgba(33, 150, 243, 0.3)',
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({

  '& .MuiTableCell-head': {
     backgroundColor:" #4372C8",
    color: "white",
    fontWeight: 600,
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
 
    zIndex: 10,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transition: 'background-color 0.2s ease',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: theme.spacing(1.5, 2),
  borderColor: alpha(theme.palette.divider, 0.5),
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    height: 42,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color']),
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px',
    paddingLeft: '8px',
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: 12,
  padding: theme.spacing(1, 2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(2),
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: 12,
  minHeight: 300,
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  fontWeight: 600,
  color: 'white',
  padding: '6px 16px',
  '&:hover': {
    background: 'linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)',
    boxShadow: '0 6px 14px rgba(33, 150, 243, 0.3)',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  minWidth: 120,
  padding: theme.spacing(1.5, 2),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderRadius: '8px 8px 0 0',
  },
}));

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  margin: '0 4px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
  },
}));

const SalarySlipEmpList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Data states
  const [pendingUsers, setPendingUsers] = useState([]);
  const [generatedSlips, setGeneratedSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alreadygenerate, setalReadygenerate] = useState([]);
  
  // Search and pagination states for both tabs
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingRowsPerPage, setPendingRowsPerPage] = useState(10);
  
  const [generatedSearchTerm, setGeneratedSearchTerm] = useState('');
  const [generatedPage, setGeneratedPage] = useState(0);
  const [generatedRowsPerPage, setGeneratedRowsPerPage] = useState(10);

  // Load initial data when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Get already generated payslips
        const generatedResponse = await axios.get(`${base_hr}/hr-handler/api/payslip/get-all-empCode-current-months?organizationCode=${localStorage.getItem('organizationCode')}`);
        setalReadygenerate(generatedResponse.data.result);

        // Get all employee details and members in parallel
        const [slipsResponse, usersResponse] = await Promise.all([
          axios.get(`${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${localStorage.getItem('organizationCode')}`),
          axios.get(`${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem('organizationCode')}`)
        ]);
        
        const slipsData = slipsResponse.data.filter(item => item.current === "EXIST");
        const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : [];

        // Separate generated and pending slips
        const listA = []; // empCodes that are in alreadygenerate
        const listB = [];

        slipsData.forEach(item => {
          if (generatedResponse.data.result.includes(item.empCode)) {
            listA.push(item);
          } else {
            listB.push(item);
          }
        });

        setGeneratedSlips(listA);
        setPendingUsers(listB);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Update data when tab changes (generated tab is index 1 now)
  useEffect(() => {
    if (tabValue === 1) {
      getGeteneratedPaySlip();
    }
  }, [tabValue]);

  const getGeteneratedPaySlip = async () => {
    try {
      const response = await axios.get(`${base_hr}/hr-handler/api/payslip/get-all-empCode-current-months?organizationCode=${localStorage.getItem('organizationCode')}`);
      setalReadygenerate(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Pagination handlers for pending tab
  const handlePendingPageChange = (event, newPage) => {
    setPendingPage(newPage);
  };

  const handlePendingRowsPerPageChange = (event) => {
    setPendingRowsPerPage(parseInt(event.target.value, 10));
    setPendingPage(0);
  };

  // Pagination handlers for generated tab
  const handleGeneratedPageChange = (event, newPage) => {
    setGeneratedPage(newPage);
  };

  const handleGeneratedRowsPerPageChange = (event) => {
    setGeneratedRowsPerPage(parseInt(event.target.value, 10));
    setGeneratedPage(0);
  };

  // Search handlers
  const handlePendingSearchChange = (event) => {
    setPendingSearchTerm(event.target.value);
    setPendingPage(0);
  };

  const handleGeneratedSearchChange = (event) => {
    setGeneratedSearchTerm(event.target.value);
    setGeneratedPage(0);
  };

  // Filter users based on search term
  const filteredPendingUsers = pendingUsers.filter(user => {
    // First check if user exists in generatedSlips by email
    const hasGeneratedSlip = generatedSlips.some(
      slip => 
        (slip.officialEmail && user.email && slip.officialEmail.toLowerCase() === user.email.toLowerCase()) || 
        (slip.empCode && user.empCode && slip.empCode.toLowerCase() === user.empCode.toLowerCase())
    );
    
    // Only include users that don't have generated slips and match search criteria
    return !hasGeneratedSlip && (
      user.name?.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
      user.mobileNumber?.includes(pendingSearchTerm) ||
      user.empCode?.toLowerCase().includes(pendingSearchTerm.toLowerCase())
    );
  });

  // Filter generated slips based on search term
  const filteredGeneratedSlips = generatedSlips.filter(slip =>
    slip.name?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
    slip.officialEmail?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
    slip.personalEmail?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
    slip.empCode?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
    slip.position?.toLowerCase().includes(generatedSearchTerm.toLowerCase())
  );

  // Apply pagination
  const paginatedPendingUsers = filteredPendingUsers.slice(
    pendingPage * pendingRowsPerPage,
    pendingPage * pendingRowsPerPage + pendingRowsPerPage
  );

  const paginatedGeneratedSlips = filteredGeneratedSlips.slice(
    generatedPage * generatedRowsPerPage,
    generatedPage * generatedRowsPerPage + generatedRowsPerPage
  );

  const handleGenerateSalarySlip = (employee) => {
    // Navigate to salary slip page with employee data
    navigate('/dashboard-hr/salary-slip', { 
      state: { 
        employeeData: employee,
        employeeEmail: employee.email
      } 
    });
  };

  const handleViewSalarySlip = (slip) => {
    // Navigate to view salary slip page with slip data
    navigate('/dashboard-hr/all-salary-emp-list', { 
      state: { 
        slipData: slip 
      } 
    });
  };

  const handleRegenerateSalarySlip = (slip) => {
    // Navigate to salary slip page with pre-filled data
    navigate('/dashboard-hr/salary-slip', { 
      state: { 
        employeeData: {
          employeeId: slip.empCode,
          employeeName: slip.name,
          designation: slip.position,
          department: slip.department,
          bankName: slip.bankName,
          bankAccount: slip.bankAccount,
          panNumber: slip.panNumber,
          uanNumber: slip.uanNumber,
          joinDate: slip.joinDate,
          totalCTC: slip.ctc,
          officialEmail: slip.officialEmail,
          personalEmail: slip.personalEmail
        },
        employeeEmail: slip.officialEmail || slip.personalEmail,
        isRegenerate: true
      } 
    });
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginTop: 2
        }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => loadInitialData()}
          >
            Try Again
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <HeaderContainer>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
            Salary Slip Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            Generate and manage salary slips for your employees
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchTextField
            placeholder={tabValue === 0 ? "Search pending employees..." : "Search generated slips..."}
            value={tabValue === 0 ? pendingSearchTerm : generatedSearchTerm}
            onChange={tabValue === 0 ? handlePendingSearchChange : handleGeneratedSearchChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </HeaderContainer>

      <TabsContainer>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ 
            '& .MuiTabs-indicator': {
              height: 3,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            },
          }}
        >
          <StyledTab label="Pending Salary Slips" />
          <StyledTab label="Generated Salary Slips" />
        </Tabs>

        <GenerateNewButton
          onClick={() => navigate('/dashboard-hr/salary-slip')}
          startIcon={<AddIcon />}
        >
          Generate New Salary Slip
        </GenerateNewButton>
      </TabsContainer>

      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden', 
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          mb: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Pending first */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <StyledTableContainer>
              <Table stickyHeader aria-label="pending employees table">
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Full Name</StyledTableCell>
                    <StyledTableCell>Email Address</StyledTableCell>
                    <StyledTableCell align="center">Generate Salary Slip</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {paginatedPendingUsers.length > 0 ? (
                    paginatedPendingUsers.map((user) => (
                      <StyledTableRow key={user.id}>
                        <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                          {user.empCode}
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: 500 }}>{user.name}</StyledTableCell>
                        <StyledTableCell>{user.officialEmail}</StyledTableCell>
                        <StyledTableCell align="center">
                          <GenerateButton
                            onClick={() => handleGenerateSalarySlip(user)}
                          >
                            Create Salary Slip
                          </GenerateButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <EmptyStateContainer>
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Pending Employees Found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pendingSearchTerm 
                              ? "No matching employees found. Try adjusting your search criteria." 
                              : "There are currently no pending employees without salary slips in the system."}
                          </Typography>
                          {pendingSearchTerm && (
                            <Button 
                              sx={{ mt: 2 }}
                              size="small" 
                              onClick={() => setPendingSearchTerm('')}
                            >
                              Clear Search
                            </Button>
                          )}
                        </EmptyStateContainer>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredPendingUsers.length}
              rowsPerPage={pendingRowsPerPage}
              page={pendingPage}
              onPageChange={handlePendingPageChange}
              onRowsPerPageChange={handlePendingRowsPerPageChange}
              labelRowsPerPage="Employees per page:"
              sx={{
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  fontSize: '0.875rem',
                  color: theme.palette.text.secondary,
                },
                '.MuiTablePagination-select': {
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                }
              }}
            />
          </Box>
        </TabPanel>

        {/* Generated second */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <StyledTableContainer>
              <Table stickyHeader aria-label="generated slips table">
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Full Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Position</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {paginatedGeneratedSlips.length > 0 ? (
                    paginatedGeneratedSlips.map((slip) => (
                      <StyledTableRow key={slip.id}>
                        <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                          {slip.empCode}
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: 500 }}>{slip.name}</StyledTableCell>
                        <StyledTableCell>{slip.officialEmail || slip.personalEmail}</StyledTableCell>
                        <StyledTableCell>{slip.position}</StyledTableCell>
                        <StyledTableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="View Salary Slip">
                              <ActionButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleViewSalarySlip(slip)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Regenerate Salary Slip">
                              <ActionButton 
                                size="small" 
                                color="secondary"
                                onClick={() => handleRegenerateSalarySlip(slip)}
                              >
                                <RefreshIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                          </Box>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <EmptyStateContainer>
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Generated Salary Slips Found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {generatedSearchTerm 
                              ? "No matching salary slips found. Try adjusting your search criteria." 
                              : "There are currently no generated salary slips in the system."}
                          </Typography>
                          {generatedSearchTerm && (
                            <Button 
                              sx={{ mt: 2 }}
                              size="small" 
                              onClick={() => setGeneratedSearchTerm('')}
                            >
                              Clear Search
                            </Button>
                          )}
                        </EmptyStateContainer>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredGeneratedSlips.length}
              rowsPerPage={generatedRowsPerPage}
              page={generatedPage}
              onPageChange={handleGeneratedPageChange}
              onRowsPerPageChange={handleGeneratedRowsPerPageChange}
              labelRowsPerPage="Items per page:"
              sx={{
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  fontSize: '0.875rem',
                  color: theme.palette.text.secondary,
                },
                '.MuiTablePagination-select': {
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                }
              }}
            />
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

// TabPanel component for the tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`salary-slip-tabpanel-${index}`}
      aria-labelledby={`salary-slip-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default SalarySlipEmpList;