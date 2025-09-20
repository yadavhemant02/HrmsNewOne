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
import { base_hr, base_identity } from '../../../http/services';

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

const GenerateNewButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  fontWeight: 600,
  color: 'white',
  padding: '8px 24px',
  '&:hover': {
    background: 'linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)',
    boxShadow: '0 6px 14px rgba(33, 150, 243, 0.3)',
  },
}));

// const newCandidates = [
//   {
//     id: 1,
//     name: "Amit Sharma",
//     email: "amit.sharma@example.com",
//     phone: "9876543210",
//     position: "Software Engineer",
//     ctc: 600000,
//   },
//   {
//     id: 2,
//     name: "Priya Verma",
//     email: "priya.verma@example.com",
//     phone: "9123456789",
//     position: "UI/UX Designer",
//     ctc: 550000,
//   },
//   {
//     id: 3,
//     name: "Rahul Singh",
//     email: "rahul.singh@example.com",
//     phone: "9988776655",
//     position: "QA Analyst",
//     ctc: 500000,
//   },
//   {
//     id: 4,
//     name: "Sneha Patel",
//     email: "sneha.patel@example.com",
//     phone: "9871234560",
//     position: "HR Executive",
//     ctc: 480000,
//   },
// ];


const OfferLetterEmpList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);

   const navigateToGenerateNewOfferLetter = (candidate) => {
    // navigate('dashboard-hr/generate-new-offer-letter', { state: candidate });

    console.log(candidate,"ffffffffffffffffffff")
    navigate('/dashboard-hr/generate-new-offer-letter', { 
      state: { 
        candidateData: candidate 
      } 
    });
  };
  
  // Data states
  const [pendingUsers, setPendingUsers] = useState([]);
  const [generatedOffers, setGeneratedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and pagination states for both tabs
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingRowsPerPage, setPendingRowsPerPage] = useState(10);
  
  const [generatedSearchTerm, setGeneratedSearchTerm] = useState('');
  const [generatedPage, setGeneratedPage] = useState(0);
  const [generatedRowsPerPage, setGeneratedRowsPerPage] = useState(10);

  const [newCandidates, setNewCandidates] = useState([]);

  // const sapi =  `${base_hr}/hr-handler/result/show-all/panding-result`

  //hr-handler/feedback/get/all/panding-feedback/pending?organizationCode=HRHaaTquic0

  const sapi  = `${base_hr}/hr-handler/feedback/get/all/panding-feedback/selected?organizationCode=${localStorage.getItem("organizationCode")}`
  useEffect(() => {
    axios.get(sapi)
      .then(response => {
        setNewCandidates(response.data);
      })
      .catch(error => {
        console.error('Error fetching new candidates:', error);
      });
  }, []);

  // Load both data sets on component mount to enable proper filtering
  useEffect(() => {
    refreshAllData();
  }, []);

  // Function to refresh all data
  const refreshAllData = async () => {
    setLoading(true);
    try {
      // Fetch both data sets in parallel
      const [offersResponse, usersResponse] = await Promise.all([
        axios.get(`${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${localStorage.getItem('organizationCode')}`),
        axios.get(`${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem('organizationCode')}`)
      ]);

      const offersData = [];
      const usersData = [];
      
      offersResponse.data.forEach((item) => {
        if(item.current === "NEW"){
          usersData.push(item);
        } else {
          offersData.push(item);
        }
      });

      setGeneratedOffers(offersData);
      setPendingUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
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
    // First check if user exists in generatedOffers by email
    const hasGeneratedOffer = generatedOffers.some(
      offer => 
        (offer.officialEmail && user.email && offer.officialEmail.toLowerCase() === user.email.toLowerCase()) || 
        (offer.empCode && user.empCode && offer.empCode.toLowerCase() === user.empCode.toLowerCase())
    );
    
    // Only include users that don't have generated offers and match search criteria
    return !hasGeneratedOffer && (
      user.name?.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
      user.mobileNumber?.includes(pendingSearchTerm) ||
      user.empCode?.toLowerCase().includes(pendingSearchTerm.toLowerCase())
    );
  });

  // Filter generated offers based on search term
  const filteredGeneratedOffers = generatedOffers.filter(offer =>
    offer.name?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
    offer.officialEmail?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
    offer.personalEmail?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
    offer.empCode?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
    offer.position?.toLowerCase().includes(generatedSearchTerm.toLowerCase())
  );

  // Apply pagination
  const paginatedPendingUsers = filteredPendingUsers.slice(
    pendingPage * pendingRowsPerPage,
    pendingPage * pendingRowsPerPage + pendingRowsPerPage
  );

  const paginatedGeneratedOffers = filteredGeneratedOffers.slice(
    generatedPage * generatedRowsPerPage,
    generatedPage * generatedRowsPerPage + generatedRowsPerPage
  );

  const handleGenerateOfferLetter = (employee) => {
    // Navigate to offer letter page with employee data
    console.log(employee,"llllllllllllllllllllllllllll")
    navigate('/dashboard-hr/offer-letter', { 
      state: { 
        employeeData: {
          name: employee.name,
          email: employee.officialEmail || employee.email,
          empCode: employee.empCode,
          position: employee.position,
          function: employee.function,
          designation: employee.designation || employee.position,
          address: employee.address,
          ctc: employee.ctc,
          offerDate: employee.offerDate,
          dateOfJoin: employee.dateOfJoin,
          candidateId: employee.candidateId
        },
        employeeEmail: employee.officialEmail || employee.email
      } 
    });
  };

  const handleViewOfferLetter = (offer) => {
    // Navigate to view offer letter page with offer data
    if (offer.current === "NEW") {
      navigate('/dashboard-hr/view-new-offer-letter', { 
        state: { 
          offerData: offer 
        } 
      });
    } else {
      navigate('/dashboard-hr/view-offer-letter', { 
        state: { 
          offerData: offer 
        } 
      });
    }
  };

  const handleRegenerateOfferLetter = (offer) => {

    console.log(offer,"pppppppppppppppppppppppppppppppp");
    // Navigate to regenerate offer letter page with pre-filled data and email
    navigate('/dashboard-hr/offer-letter', { 
      state: { 
        employeeData: {
          name: offer.name,
          email: offer.officialEmail || offer.personalEmail,
          empCode: offer.empCode,
          position: offer.position,
          function: offer.function,
          designation: offer.designation || offer.position,
          address: offer.address,
          ctc: offer.ctc,
          offerDate: offer.offerDate,
          dateOfJoin: offer.dateOfJoin
          
        },
        employeeEmail: offer.officialEmail || offer.personalEmail,
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
            onClick={() => refreshAllData()}
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
            Offer Letter Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            Generate and manage offer letters for your employees
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchTextField
            placeholder={tabValue === 0 ? "Search generated offers..." : "Search pending employees..."}
            value={tabValue === 0 ? generatedSearchTerm : pendingSearchTerm}
            onChange={tabValue === 0 ? handleGeneratedSearchChange : handlePendingSearchChange}
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
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={() => refreshAllData()}
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </HeaderContainer>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ 
            backgroundColor: 'transparent',
            px: 2,
            pt: 1,
            '& .MuiTabs-indicator': {
              height: 3,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            },
          }}
        >
          <StyledTab label="Generated Offer Letters" />
          <StyledTab label="New Offer Letters" />
          <StyledTab label="New Candidate Offer Letters" />
        </Tabs>
        <GenerateNewButton
          onClick={() => navigate('/dashboard-hr/generate-new-offer-letter')}
          startIcon={<RefreshIcon />}
        >
          Generate New Offer Letter
        </GenerateNewButton>
      </Box>

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
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <StyledTableContainer>
              <Table stickyHeader aria-label="generated offers table">
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Full Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Position</StyledTableCell>
                    <StyledTableCell>Offer Date</StyledTableCell>
                    {/* <StyledTableCell>CTC (₹)</StyledTableCell> */}
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {paginatedGeneratedOffers.length > 0 ? (
                    paginatedGeneratedOffers.map((offer) => (
                      <StyledTableRow key={offer.id}>
                        <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                          {offer.empCode}
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: 500 }}>{offer.name}</StyledTableCell>
                        <StyledTableCell>{offer.officialEmail || offer.personalEmail}</StyledTableCell>
                        <StyledTableCell>{offer.position}</StyledTableCell>
                        <StyledTableCell>
                          {new Date(offer.offerDate).toLocaleDateString('en-IN')}
                        </StyledTableCell>
                        {/* <StyledTableCell>
                          {new Intl.NumberFormat('en-IN').format(offer.ctc)}
                        </StyledTableCell> */}
                        <StyledTableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="View Offer Letter">
                              <ActionButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleViewOfferLetter(offer)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Generate new Offer Letter">
                              <ActionButton 
                                size="small" 
                                color="secondary"
                                onClick={() => handleRegenerateOfferLetter(offer)}
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
                            No Generated Offer Letters Found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {generatedSearchTerm 
                              ? "No matching offer letters found. Try adjusting your search criteria." 
                              : "There are currently no generated offer letters in the system."}
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
              count={filteredGeneratedOffers.length}
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

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <StyledTableContainer>
              <Table stickyHeader aria-label="pending employees table">
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Full Name</StyledTableCell>
                    <StyledTableCell>Personal Email</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
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
                        <StyledTableCell>{user.personalEmail}</StyledTableCell>
                        <StyledTableCell>
                          {new Intl.DateTimeFormat("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(user.createdAt))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title="View Offer Letter">
                              <ActionButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleViewOfferLetter(user)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <GenerateButton
                              onClick={() => handleGenerateOfferLetter(user)}
                            >
                              Modify Offer Letter
                            </GenerateButton>
                          </Box>
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
                              : "There are currently no pending employees without offer letters in the system."}
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
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <StyledTableContainer>
              <Table stickyHeader aria-label="new candidates table">
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Candidate Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Year of Experience</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell align="center" sx={{ minWidth: '190px' }}>Actions</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {Array.isArray(newCandidates) && newCandidates.length > 0 ? (
                    newCandidates.map((candidate) => (
                      <StyledTableRow key={candidate.id}>
                        <StyledTableCell>{candidate.candidateName}</StyledTableCell>
                        <StyledTableCell>{candidate.candidateEmail}</StyledTableCell>
                       
                        
                        <StyledTableCell>
                          {candidate.noOfYearExperince ?? "-"}
                        </StyledTableCell>
                        <StyledTableCell>{candidate.flag}</StyledTableCell>
                        <StyledTableCell>
                          {new Intl.DateTimeFormat("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(candidate.createdAt))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            
                            <GenerateButton
                              size="small"
                              sx={{ minWidth: '180px' }}
                              // onClick={() =>
                              //   handleGenerateOfferLetter({
                              //     name: candidate.candidateName,
                              //     email: candidate.candidateEmail,
                              //     empCode: candidate.empCode || "",
                              //     position: candidate.possition,
                              //     function: candidate.function || "",
                              //     designation: candidate.possition,
                              //     address: candidate.address || "",
                              //     ctc: candidate.packege,
                              //     offerDate: candidate.offerDate || "",
                              //     dateOfJoin: candidate.dateOfJoining,
                              //     candidateId: candidate.candidateId
                              //   })
                              // }


                              onClick={() => navigateToGenerateNewOfferLetter(candidate)}
                            >
                              Generate Offer Letter
                            </GenerateButton>
                          </Box>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <EmptyStateContainer>
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No New Candidates Found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            There are currently no new candidates in the system.
                          </Typography>
                        </EmptyStateContainer>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
            {/* Add pagination if needed, similar to other tabs */}
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
      id={`offer-letter-tabpanel-${index}`}
      aria-labelledby={`offer-letter-tab-${index}`}
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

export default OfferLetterEmpList;