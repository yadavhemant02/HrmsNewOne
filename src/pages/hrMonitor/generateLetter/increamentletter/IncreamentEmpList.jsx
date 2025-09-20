// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Box,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   CircularProgress,
//   Alert,
//   TablePagination,
//   useTheme,
//   alpha,
//   styled,
//   Divider,
//   InputAdornment,
//   TextField,
//   Button,
//   Tabs,
//   Tab,
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import AddIcon from '@mui/icons-material/Add';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import { base_identity } from '../../../../http/services';

// // Styled components for enhanced visuals
// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   maxHeight: 'calc(100vh - 280px)',
//   borderRadius: 12,
//   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//   '&::-webkit-scrollbar': {
//     width: '8px',
//     height: '8px',
//   },
//   '&::-webkit-scrollbar-track': {
//     background: '#f1f1f1',
//     borderRadius: '4px',
//   },
//   '&::-webkit-scrollbar-thumb': {
//     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
//     borderRadius: '4px',
//   },
// }));

// const GenerateNewButton = styled(Button)(({ theme }) => ({
//   borderRadius: 8,
//   background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
//   boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
//   transition: 'all 0.3s ease',
//   textTransform: 'none',
//   fontWeight: 600,
//   color: 'white',
//   padding: '10px 20px',
//   minWidth: '220px',
//   '&:hover': {
//     background: 'linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)',
//     boxShadow: '0 6px 14px rgba(33, 150, 243, 0.3)',
//   },
// }));

// const StyledTableHead = styled(TableHead)(({ theme }) => ({
//   backgroundColor: alpha(theme.palette.primary.main, 0.03),
//   '& .MuiTableCell-head': {
//     color: "white",
//     fontWeight: 600,
//     fontSize: '0.875rem',
//     whiteSpace: 'nowrap',
//     position: 'sticky',
//     top: 0,
//     backgroundColor: " #1A237E",
//     zIndex: 10,
//     paddingTop: 16,
//     paddingBottom: 16,
//     borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: alpha(theme.palette.primary.main, 0.02),
//   },
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.primary.main, 0.05),
//     transition: 'background-color 0.2s ease',
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   fontSize: '0.875rem',
//   padding: theme.spacing(1.5, 2),
//   borderColor: alpha(theme.palette.divider, 0.5),
// }));

// const SearchTextField = styled(TextField)(({ theme }) => ({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: 8,
//     backgroundColor: alpha(theme.palette.common.white, 0.9),
//     height: 42,
//     transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color']),
//     '&:hover': {
//       backgroundColor: theme.palette.common.white,
//     },
//     '&.Mui-focused': {
//       backgroundColor: theme.palette.common.white,
//       boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
//     },
//   },
//   '& .MuiInputBase-input': {
//     padding: '10px 14px',
//     paddingLeft: '8px',
//   },
// }));

// const HeaderContainer = styled(Box)(({ theme }) => ({
//   marginBottom: theme.spacing(3),
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   [theme.breakpoints.down('md')]: {
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     gap: theme.spacing(2),
//   },
// }));

// const TabsContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: theme.spacing(3),
//   backgroundColor: alpha(theme.palette.background.paper, 0.7),
//   borderRadius: 12,
//   padding: theme.spacing(1, 2),
//   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
//   [theme.breakpoints.down('md')]: {
//     flexDirection: 'column',
//     alignItems: 'stretch',
//     gap: theme.spacing(2),
//   },
// }));

// const EmptyStateContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: theme.spacing(4),
//   textAlign: 'center',
//   backgroundColor: alpha(theme.palette.background.paper, 0.7),
//   borderRadius: 12,
//   minHeight: 300,
// }));

// const GenerateButton = styled(Button)(({ theme }) => ({
//   borderRadius: 8,
//   background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
//   boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
//   transition: 'all 0.3s ease',
//   textTransform: 'none',
//   fontWeight: 600,
//   color: 'white',
//   padding: '6px 16px',
//   '&:hover': {
//     background: 'linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)',
//     boxShadow: '0 6px 14px rgba(33, 150, 243, 0.3)',
//   },
// }));

// const StyledTab = styled(Tab)(({ theme }) => ({
//   textTransform: 'none',
//   fontWeight: 600,
//   fontSize: '0.95rem',
//   minWidth: 120,
//   padding: theme.spacing(1.5, 2),
//   '&.Mui-selected': {
//     color: theme.palette.primary.main,
//   },
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.primary.main, 0.04),
//     borderRadius: '8px 8px 0 0',
//   },
// }));

// const ActionButton = styled(IconButton)(({ theme, color }) => ({
//   backgroundColor: alpha(theme.palette.primary.main, 0.05),
//   margin: '0 4px',
//   transition: 'all 0.2s ease',
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.primary.main, 0.15),
//   },
// }));

// // Constants
// const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];
// const DEFAULT_ROWS_PER_PAGE = 10;
// const EMPLOYEE_STATUS = {
//   EXIST: 'EXIST'
// };

// const IncreamentEmpList = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
  
//   // Tab state
//   const [tabValue, setTabValue] = useState(0);
  
//   // Data states
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [generatedLetters, setGeneratedLetters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Search and pagination states for both tabs
//   const [pendingSearchTerm, setPendingSearchTerm] = useState('');
//   const [pendingPage, setPendingPage] = useState(0);
//   const [pendingRowsPerPage, setPendingRowsPerPage] = useState(10);
  
//   const [generatedSearchTerm, setGeneratedSearchTerm] = useState('');
//   const [generatedPage, setGeneratedPage] = useState(0);
//   const [generatedRowsPerPage, setGeneratedRowsPerPage] = useState(10);

//   useEffect(() => {
//     if (tabValue === 0) {
//       fetchGeneratedLetters();
//     } else {
//       fetchPendingUsers();
//     }
//   }, [tabValue]);

//   // Load both data sets on component mount to enable proper filtering
//   useEffect(() => {
//     refreshAllData();
//   }, []);

//   // Function to refresh all data
//   const refreshAllData = async () => {
//     setLoading(true);
//     try {
//       // Fetch both data sets in parallel
//       const [lettersResponse, usersResponse] = await Promise.all([
//         axios.get(`${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${localStorage.getItem('organizationCode')}`),
//         axios.get(`${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem('organizationCode')}`)
//       ]);
      
//       const lettersData = Array.isArray(lettersResponse.data) ? lettersResponse.data : [];
//       const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : [];
      
//       // Filter existing employees
//       const existingEmployees = lettersData.filter(emp => emp.current === EMPLOYEE_STATUS.EXIST);
//       setGeneratedLetters(existingEmployees);

//       // Filter pending users - those who don't have a generated letter
//       const pending = usersData.filter(user => 
//         !existingEmployees.some(emp => 
//           (emp.officialEmail && user.email && emp.officialEmail.toLowerCase() === user.email.toLowerCase()) || 
//           (emp.empCode && user.empCode && emp.empCode.toLowerCase() === user.empCode.toLowerCase())
//         )
//       );
//       setPendingUsers(pending);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch data. Please try again later.');
//       console.error('Error fetching initial data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchGeneratedLetters = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${localStorage.getItem('organizationCode')}`);
//       const data = Array.isArray(response.data) ? response.data : [];
//       // Filter existing employees
//       const existingEmployees = data.filter(emp => emp.current === EMPLOYEE_STATUS.EXIST);
//       setGeneratedLetters(existingEmployees);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch generated increment letters. Please try again later.');
//       console.error('Error fetching generated letters:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPendingUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem('organizationCode')}`);
//       const data = Array.isArray(response.data) ? response.data : [];
      
//       // Filter pending users - those who don't have a generated letter
//       const pending = data.filter(user => 
//         !generatedLetters.some(emp => 
//           (emp.officialEmail && user.email && emp.officialEmail.toLowerCase() === user.email.toLowerCase()) || 
//           (emp.empCode && user.empCode && emp.empCode.toLowerCase() === user.empCode.toLowerCase())
//         )
//       );
//       setPendingUsers(pending);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch pending users. Please try again later.');
//       console.error('Error fetching pending users:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tab change handler
//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   // Pagination handlers for pending tab
//   const handlePendingPageChange = (event, newPage) => {
//     setPendingPage(newPage);
//   };

//   const handlePendingRowsPerPageChange = (event) => {
//     setPendingRowsPerPage(parseInt(event.target.value, 10));
//     setPendingPage(0);
//   };

//   // Pagination handlers for generated tab
//   const handleGeneratedPageChange = (event, newPage) => {
//     setGeneratedPage(newPage);
//   };

//   const handleGeneratedRowsPerPageChange = (event) => {
//     setGeneratedRowsPerPage(parseInt(event.target.value, 10));
//     setGeneratedPage(0);
//   };

//   // Search handlers
//   const handlePendingSearchChange = (event) => {
//     setPendingSearchTerm(event.target.value);
//     setPendingPage(0);
//   };

//   const handleGeneratedSearchChange = (event) => {
//     setGeneratedSearchTerm(event.target.value);
//     setGeneratedPage(0);
//   };

//   // Filter users based on search term
//   const filteredPendingUsers = pendingUsers.filter(user => {
//     // First check if user exists in generatedLetters by email
//     const hasGeneratedLetter = generatedLetters.some(
//       letter => 
//         (letter.officialEmail && user.email && letter.officialEmail.toLowerCase() === user.email.toLowerCase()) || 
//         (letter.empCode && user.empCode && letter.empCode.toLowerCase() === user.empCode.toLowerCase())
//     );
    
//     // Only include users that don't have generated letters and match search criteria
//     return !hasGeneratedLetter && (
//       user.name?.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(pendingSearchTerm.toLowerCase()) ||
//       user.mobileNumber?.includes(pendingSearchTerm) ||
//       user.empCode?.toLowerCase().includes(pendingSearchTerm.toLowerCase())
//     );
//   });

//   // Filter generated letters based on search term
//   const filteredGeneratedLetters = generatedLetters.filter(letter =>
//     letter.name?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
//     letter.officialEmail?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
//     letter.personalEmail?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
//     letter.empCode?.toLowerCase().includes(generatedSearchTerm.toLowerCase()) ||
//     letter.position?.toLowerCase().includes(generatedSearchTerm.toLowerCase())
//   );

//   // Apply pagination
//   const paginatedPendingUsers = filteredPendingUsers.slice(
//     pendingPage * pendingRowsPerPage,
//     pendingPage * pendingRowsPerPage + pendingRowsPerPage
//   );

//   const paginatedGeneratedLetters = filteredGeneratedLetters.slice(
//     generatedPage * generatedRowsPerPage,
//     generatedPage * generatedRowsPerPage + generatedRowsPerPage
//   );

//   const handleGenerateIncrementLetter = (employee) => {
//     // Navigate to increment letter page with employee data
//     navigate('/dashboard-hr/increment-letter', { 
//       state: { 
//         employeeData: employee,
//         employeeEmail: employee.email
//       } 
//     });
//   };

//   const handleViewIncrementLetter = (letter) => {
//     // Navigate to view increment letter page with letter data
//     navigate('/dashboard-hr/all-increment-emp-list', { 
//       state: { 
//         letterData: letter 
//       } 
//     });
//   };

//   const handleRegenerateIncrementLetter = (letter) => {
//     // Navigate to increment letter page with pre-filled data
//     navigate('/dashboard-hr/increment-letter', { 
//       state: { 
//         employeeData: {
//           employeeId: letter.empCode,
//           employeeName: letter.name,
//           designation: letter.position,
//           department: letter.department,
//           bankName: letter.bankName,
//           bankAccount: letter.bankAccount,
//           panNumber: letter.panNumber,
//           uanNumber: letter.uanNumber,
//           joinDate: letter.joinDate,
//           currentCTC: letter.ctc,
//           officialEmail: letter.officialEmail,
//           personalEmail: letter.personalEmail
//         },
//         employeeEmail: letter.officialEmail || letter.personalEmail,
//         isRegenerate: true
//       } 
//     });
//   };

//   if (loading) {
//     return (
//       <Box 
//         display="flex" 
//         justifyContent="center" 
//         alignItems="center" 
//         minHeight="400px"
//       >
//         <CircularProgress sx={{ color: theme.palette.primary.main }} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert 
//         severity="error" 
//         sx={{ 
//           borderRadius: 2, 
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//           marginTop: 2
//         }}
//         action={
//           <Button 
//             color="inherit" 
//             size="small" 
//             onClick={() => refreshAllData()}
//           >
//             Try Again
//           </Button>
//         }
//       >
//         {error}
//       </Alert>
//     );
//   }

//   return (
//     <Box>
//       <HeaderContainer>
//         <Box>
//           <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
//             Increment Letter Management
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
//             Generate and manage increment letters for your employees
//           </Typography>
//         </Box>

//         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//           <SearchTextField
//             placeholder={tabValue === 0 ? "Search generated letters..." : "Search pending employees..."}
//             value={tabValue === 0 ? generatedSearchTerm : pendingSearchTerm}
//             onChange={tabValue === 0 ? handleGeneratedSearchChange : handlePendingSearchChange}
//             variant="outlined"
//             size="small"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Tooltip title="Refresh Data">
//             <IconButton 
//               onClick={() => refreshAllData()}
//               sx={{ 
//                 backgroundColor: alpha(theme.palette.primary.main, 0.05),
//                 '&:hover': {
//                   backgroundColor: alpha(theme.palette.primary.main, 0.15),
//                 }
//               }}
//             >
//               <RefreshIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </HeaderContainer>

//       <TabsContainer>
//         <Tabs 
//           value={tabValue} 
//           onChange={handleTabChange}
//           sx={{ 
//             '& .MuiTabs-indicator': {
//               height: 3,
//               borderTopLeftRadius: 3,
//               borderTopRightRadius: 3,
//             },
//           }}
//         >
//           <StyledTab label="Generated Increment Letters" />
//           <StyledTab label="Pending Increment Letters" />
//         </Tabs>

//         <GenerateNewButton
//           onClick={() => navigate('/dashboard-hr/increment-letter')}
//           startIcon={<TrendingUpIcon />}
//         >
//           Generate New Increment Letter
//         </GenerateNewButton>
//       </TabsContainer>

//       <Paper 
//         elevation={0} 
//         sx={{ 
//           borderRadius: 3, 
//           overflow: 'hidden', 
//           border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
//           mb: 3,
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
//         }}
//       >
//         <TabPanel value={tabValue} index={0}>
//           <Box sx={{ p: 2 }}>
//             <StyledTableContainer>
//               <Table stickyHeader aria-label="generated letters table">
//                 <StyledTableHead>
//                   <TableRow>
//                     <StyledTableCell>Employee Code</StyledTableCell>
//                     <StyledTableCell>Full Name</StyledTableCell>
//                     <StyledTableCell>Email</StyledTableCell>
//                     <StyledTableCell>Position</StyledTableCell>
//                     <StyledTableCell align="center">Actions</StyledTableCell>
//                   </TableRow>
//                 </StyledTableHead>
//                 <TableBody>
//                   {paginatedGeneratedLetters.length > 0 ? (
//                     paginatedGeneratedLetters.map((letter) => (
//                       <StyledTableRow key={letter.id}>
//                         <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
//                           {letter.empCode}
//                         </StyledTableCell>
//                         <StyledTableCell sx={{ fontWeight: 500 }}>{letter.name}</StyledTableCell>
//                         <StyledTableCell>{letter.officialEmail || letter.personalEmail}</StyledTableCell>
//                         <StyledTableCell>{letter.position}</StyledTableCell>
//                         <StyledTableCell align="center">
//                           <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                             <Tooltip title="View Increment Letter">
//                               <ActionButton 
//                                 size="small" 
//                                 color="primary"
//                                 onClick={() => handleViewIncrementLetter(letter)}
//                               >
//                                 <VisibilityIcon fontSize="small" />
//                               </ActionButton>
//                             </Tooltip>
//                             <Tooltip title="Generate Increment Letter">
//                               <ActionButton 
//                                 size="small" 
//                                 color="secondary"
//                                 onClick={() => handleRegenerateIncrementLetter(letter)}
//                               >
//                                 <RefreshIcon fontSize="small" />
//                               </ActionButton>
//                             </Tooltip>
//                           </Box>
//                         </StyledTableCell>
//                       </StyledTableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={7}>
//                         <EmptyStateContainer>
//                           <Typography variant="h6" color="text.secondary" gutterBottom>
//                             No Generated Increment Letters Found
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             {generatedSearchTerm 
//                               ? "No matching increment letters found. Try adjusting your search criteria." 
//                               : "There are currently no generated increment letters in the system."}
//                           </Typography>
//                           {generatedSearchTerm && (
//                             <Button 
//                               sx={{ mt: 2 }}
//                               size="small" 
//                               onClick={() => setGeneratedSearchTerm('')}
//                             >
//                               Clear Search
//                             </Button>
//                           )}
//                         </EmptyStateContainer>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </StyledTableContainer>
            
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25, 50]}
//               component="div"
//               count={filteredGeneratedLetters.length}
//               rowsPerPage={generatedRowsPerPage}
//               page={generatedPage}
//               onPageChange={handleGeneratedPageChange}
//               onRowsPerPageChange={handleGeneratedRowsPerPageChange}
//               labelRowsPerPage="Items per page:"
//               sx={{
//                 borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
//                 '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
//                   fontSize: '0.875rem',
//                   color: theme.palette.text.secondary,
//                 },
//                 '.MuiTablePagination-select': {
//                   paddingTop: '0.5rem',
//                   paddingBottom: '0.5rem',
//                 }
//               }}
//             />
//           </Box>
//         </TabPanel>

//         <TabPanel value={tabValue} index={1}>
//           <Box sx={{ p: 2 }}>
//             <StyledTableContainer>
//               <Table stickyHeader aria-label="pending employees table">
//                 <StyledTableHead>
//                   <TableRow>
//                     <StyledTableCell>Employee Code</StyledTableCell>
//                     <StyledTableCell>Full Name</StyledTableCell>
//                     <StyledTableCell>Email Address</StyledTableCell>
//                     <StyledTableCell align="center">Generate Increment Letter</StyledTableCell>
//                   </TableRow>
//                 </StyledTableHead>
//                 <TableBody>
//                   {paginatedPendingUsers.length > 0 ? (
//                     paginatedPendingUsers.map((user) => (
//                       <StyledTableRow key={user.id}>
//                         <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
//                           {user.empCode}
//                         </StyledTableCell>
//                         <StyledTableCell sx={{ fontWeight: 500 }}>{user.name}</StyledTableCell>
//                         <StyledTableCell>{user.email}</StyledTableCell>
//                         <StyledTableCell align="center">
//                           <GenerateButton
//                             onClick={() => handleGenerateIncrementLetter(user)}
//                           >
//                             Create Increment Letter
//                           </GenerateButton>
//                         </StyledTableCell>
//                       </StyledTableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={4}>
//                         <EmptyStateContainer>
//                           <Typography variant="h6" color="text.secondary" gutterBottom>
//                             No Pending Employees Found
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             {pendingSearchTerm 
//                               ? "No matching employees found. Try adjusting your search criteria." 
//                               : "There are currently no pending employees without increment letters in the system."}
//                           </Typography>
//                           {pendingSearchTerm && (
//                             <Button 
//                               sx={{ mt: 2 }}
//                               size="small" 
//                               onClick={() => setPendingSearchTerm('')}
//                             >
//                               Clear Search
//                             </Button>
//                           )}
//                         </EmptyStateContainer>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </StyledTableContainer>
            
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25, 50]}
//               component="div"
//               count={filteredPendingUsers.length}
//               rowsPerPage={pendingRowsPerPage}
//               page={pendingPage}
//               onPageChange={handlePendingPageChange}
//               onRowsPerPageChange={handlePendingRowsPerPageChange}
//               labelRowsPerPage="Employees per page:"
//               sx={{
//                 borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
//                 '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
//                   fontSize: '0.875rem',
//                   color: theme.palette.text.secondary,
//                 },
//                 '.MuiTablePagination-select': {
//                   paddingTop: '0.5rem',
//                   paddingBottom: '0.5rem',
//                 }
//               }}
//             />
//           </Box>
//         </TabPanel>
//       </Paper>
//     </Box>
//   );
// };

// // TabPanel component for the tabs
// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`increment-letter-tabpanel-${index}`}
//       aria-labelledby={`increment-letter-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ py: 2 }}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// }

// export default IncreamentEmpList;


import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  InputAdornment,
  TextField,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { base_identity } from '../../../../http/services';

// ================================
//        STYLED COMPONENTS
// ================================

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 'calc(100vh - 280px)',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  '&::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    borderRadius: 4,
  },
}));

const GenerateNewButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  textTransform: 'none',
  fontWeight: 600,
  color: 'white',
  padding: '10px 20px',
  minWidth: 220,
  '&:hover': {
    background: 'linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)',
    boxShadow: '0 6px 14px rgba(33, 150, 243, 0.3)',
    transform: 'translateY(-1px)',
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({

  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 600,
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
 backgroundColor:" #4372C8",
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
    transition: 'background-color 0.2s ease-in-out',
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
    padding: '10px 14px 10px 8px',
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

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: 12,
  padding: theme.spacing(2),
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

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  margin: '0 4px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    transform: 'scale(1.05)',
  },
}));

// ================================
//        CONSTANTS & CONFIG
// ================================

const PAGINATION_CONFIG = {
  rowsPerPageOptions: [5, 10, 25, 50],
  defaultRowsPerPage: 10,
};

const EMPLOYEE_STATUS = {
  EXIST: 'EXIST',
};

const TABLE_COLUMNS = [
  { id: 'empCode', label: 'Employee Code', minWidth: 120 },
  { id: 'name', label: 'Full Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'position', label: 'Position', minWidth: 150 },
  { id: 'actions', label: 'Actions', minWidth: 120, align: 'center' },
];

// ================================
//        CUSTOM HOOKS
// ================================

const useIncrementLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLetters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const organizationCode = localStorage.getItem('organizationCode');
      if (!organizationCode) {
        throw new Error('Organization code not found');
      }

      const response = await axios.get(
        `${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${organizationCode}`
      );
      
      const data = Array.isArray(response.data) ? response.data : [];
      const existingEmployees = data.filter(emp => emp.current === EMPLOYEE_STATUS.EXIST);
      
      setLetters(existingEmployees);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to fetch increment letters. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching increment letters:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLetters = useCallback(() => {
    fetchLetters();
  }, [fetchLetters]);

  return { letters, loading, error, refreshLetters };
};

const useTablePagination = (initialRowsPerPage = PAGINATION_CONFIG.defaultRowsPerPage) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const resetPagination = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    resetPagination,
  };
};

const useSearch = (onSearchChange) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    onSearchChange?.('');
  }, [onSearchChange]);

  return {
    searchTerm,
    handleSearchChange,
    clearSearch,
  };
};

// ================================
//        UTILITY FUNCTIONS
// ================================

const filterLettersBySearch = (letters, searchTerm) => {
  if (!searchTerm.trim()) return letters;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return letters.filter(letter =>
    letter.name?.toLowerCase().includes(lowerSearchTerm) ||
    letter.officialEmail?.toLowerCase().includes(lowerSearchTerm) ||
    letter.personalEmail?.toLowerCase().includes(lowerSearchTerm) ||
    letter.empCode?.toLowerCase().includes(lowerSearchTerm) ||
    letter.position?.toLowerCase().includes(lowerSearchTerm)
  );
};

const paginateData = (data, page, rowsPerPage) => {
  const startIndex = page * rowsPerPage;
  return data.slice(startIndex, startIndex + rowsPerPage);
};

// ================================
//        SUB COMPONENTS
// ================================

const TableHeader = React.memo(() => (
  <StyledTableHead>
    <TableRow>
      {TABLE_COLUMNS.map((column) => (
        <StyledTableCell 
          key={column.id} 
          align={column.align || 'left'}
          style={{ minWidth: column.minWidth }}
        >
          {column.label}
        </StyledTableCell>
      ))}
    </TableRow>
  </StyledTableHead>
));

const EmptyState = React.memo(({ searchTerm, onClearSearch }) => (
  <TableRow>
    <TableCell colSpan={TABLE_COLUMNS.length}>
      <EmptyStateContainer>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Increment Letters Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {searchTerm 
            ? "No matching increment letters found. Try adjusting your search criteria." 
            : "There are currently no generated increment letters in the system."}
        </Typography>
        {searchTerm && (
          <Button 
            sx={{ mt: 2 }}
            size="small" 
            onClick={onClearSearch}
          >
            Clear Search
          </Button>
        )}
      </EmptyStateContainer>
    </TableCell>
  </TableRow>
));

const LetterRow = React.memo(({ letter, onView, onRegenerate }) => (
  <StyledTableRow>
    <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
      {letter.empCode || 'N/A'}
    </StyledTableCell>
    <StyledTableCell sx={{ fontWeight: 500 }}>
      {letter.name || 'N/A'}
    </StyledTableCell>
    <StyledTableCell>
      {letter.officialEmail || letter.personalEmail || 'N/A'}
    </StyledTableCell>
    <StyledTableCell>
      {letter.position || 'N/A'}
    </StyledTableCell>
    <StyledTableCell align="center">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip title="View Increment Letter">
          <ActionButton 
            size="small" 
            color="primary"
            onClick={() => onView(letter)}
            aria-label="View increment letter"
          >
            <VisibilityIcon fontSize="small" />
          </ActionButton>
        </Tooltip>
        <Tooltip title="Regenerate Increment Letter">
          <ActionButton 
            size="small" 
            color="secondary"
            onClick={() => onRegenerate(letter)}
            aria-label="Regenerate increment letter"
          >
            <RefreshIcon fontSize="small" />
          </ActionButton>
        </Tooltip>
      </Box>
    </StyledTableCell>
  </StyledTableRow>
));

const LoadingSpinner = React.memo(() => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="400px"
  >
    <CircularProgress sx={{ color: 'primary.main' }} />
  </Box>
));

const ErrorAlert = React.memo(({ error, onRetry }) => (
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
        onClick={onRetry}
      >
        Try Again
      </Button>
    }
  >
    {error}
  </Alert>
));

// ================================
//        MAIN COMPONENT
// ================================

const IncrementEmpList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Custom hooks
  const { letters, loading, error, refreshLetters } = useIncrementLetters();
  const { 
    page, 
    rowsPerPage, 
    handlePageChange, 
    handleRowsPerPageChange, 
    resetPagination 
  } = useTablePagination();
  
  const { searchTerm, handleSearchChange, clearSearch } = useSearch(resetPagination);

  // Effects
  useEffect(() => {
    refreshLetters();
  }, [refreshLetters]);

  // Memoized computed values
  const filteredLetters = useMemo(() => 
    filterLettersBySearch(letters, searchTerm), 
    [letters, searchTerm]
  );

  const paginatedLetters = useMemo(() => 
    paginateData(filteredLetters, page, rowsPerPage), 
    [filteredLetters, page, rowsPerPage]
  );

  // Event handlers
  const handleViewLetter = useCallback((letter) => {
    navigate('/dashboard-hr/all-increment-emp-list', { 
      state: { letterData: letter } 
    });
  }, [navigate]);

  const handleRegenerateLetter = useCallback((letter) => {
    const employeeData = {
      employeeId: letter.empCode,
      employeeName: letter.name,
      designation: letter.position,
      department: letter.department,
      bankName: letter.bankName,
      bankAccount: letter.bankAccount,
      panNumber: letter.panNumber,
      uanNumber: letter.uanNumber,
      joinDate: letter.joinDate,
      currentCTC: letter.ctc,
      officialEmail: letter.officialEmail,
      personalEmail: letter.personalEmail,
    };

    navigate('/dashboard-hr/increment-letter', { 
      state: { 
        employeeData,
        employeeEmail: letter.officialEmail || letter.personalEmail,
        isRegenerate: true
      } 
    });
  }, [navigate]);

  const handleGenerateNew = useCallback(() => {
    navigate('/dashboard-hr/increment-letter');
  }, [navigate]);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render error state
  if (error) {
    return <ErrorAlert error={error} onRetry={refreshLetters} />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <HeaderContainer>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
            Generated Increment Letters
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            View and manage all generated increment letters
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchTextField
            placeholder="Search increment letters..."
            value={searchTerm}
            onChange={handleSearchChange}
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
              onClick={refreshLetters}
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                }
              }}
              aria-label="Refresh data"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </HeaderContainer>

      <ControlsContainer>
        <Typography variant="h6" color="text.secondary">
          Total Letters: {filteredLetters.length}
          {searchTerm && ` (filtered from ${letters.length})`}
        </Typography>

        <GenerateNewButton
          onClick={handleGenerateNew}
          startIcon={<TrendingUpIcon />}
        >
          Generate New Increment Letter
        </GenerateNewButton>
      </ControlsContainer>

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
        <StyledTableContainer>
          <Table stickyHeader aria-label="increment letters table">
            <TableHeader />
            <TableBody>
              {paginatedLetters.length > 0 ? (
                paginatedLetters.map((letter) => (
                  <LetterRow
                    key={letter.id || letter.empCode}
                    letter={letter}
                    onView={handleViewLetter}
                    onRegenerate={handleRegenerateLetter}
                  />
                ))
              ) : (
                <EmptyState 
                  searchTerm={searchTerm} 
                  onClearSearch={clearSearch} 
                />
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        
        <TablePagination
          rowsPerPageOptions={PAGINATION_CONFIG.rowsPerPageOptions}
          component="div"
          count={filteredLetters.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Letters per page:"
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              color: 'text.secondary',
            },
            '.MuiTablePagination-select': {
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            }
          }}
        />
      </Paper>
    </Container>
  );
};

export default IncrementEmpList;