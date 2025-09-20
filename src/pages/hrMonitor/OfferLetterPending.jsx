// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import {
// //     Box, Table, TableBody, TableCell, TableContainer, TableHead,
// //     TableRow, Paper, Button, Typography, CircularProgress,
// //     TablePagination, Dialog, DialogActions, DialogContent,
// //     DialogTitle, Snackbar, Alert, TextField, Grid, Select, MenuItem, FormControl, InputLabel
// // } from '@mui/material';
// // import { base_identity } from '../../http/services';
// // import BackButton from '../../constent/BackButton';

// // const OfferLetterPending = () => {
// //     const [employees, setEmployees] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [page, setPage] = useState(0);
// //     const [rowsPerPage, setRowsPerPage] = useState(5);
// //     const [openDialog, setOpenDialog] = useState(false);
// //     const [selectedEmployee, setSelectedEmployee] = useState(null);
// //     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
// //     const [mobileError, setMobileError] = useState('');

// //     const [formData, setFormData] = useState({
// //         name: '',
// //         organizationName: '',
// //         organizationCode: '',
// //         email: '',
// //         manager: '',
// //         mobileNumber: '',
// //         password: 'Default@123',
// //         role: 'EMP',
// //         designation: '',
// //         empCode: '',
// //         empType: '',
// //     });

// //     const fetchEmployees = async () => {
// //         setLoading(true);
// //         try {
// //             const organizationCode = localStorage.getItem('organizationCode');
// //             const response = await axios.get(
// //                 `${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${organizationCode}`
// //             );
// //             const filtered = Array.isArray(response.data) ? response.data.filter(emp => emp.current === 'NEW') : [];
// //             setEmployees(filtered);
// //         } catch (err) {
// //             console.error('Error fetching employees:', err);
// //             setEmployees([ ]);
// //             setSnackbar({ open: true, message: 'Could not fetch employees. Displaying mock data.', severity: 'info' });
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchEmployees();
// //     }, []);

// //     const handleOnboardClick = (emp) => {
// //         setSelectedEmployee(emp);
// //         setFormData({
// //             name: emp.name || '',
// //             organizationName: emp.organizationName || 'CKD VCS',
// //             organizationCode: localStorage.getItem('organizationCode') || 'HRHaaTCKD0',
// //             email: emp.officialEmail || '',
// //             manager: '',
// //             mobileNumber: emp.mobileNumber || '',
// //             password: 'Default@123',
// //             role: 'EMP',
// //             designation: emp.designation || emp.position || '',
// //             empCode: emp.empCode || '',
// //             empType: '',
// //         });
// //         setOpenDialog(true);
// //     };

// //     const handleCloseDialog = () => {
// //         setOpenDialog(false);
// //         setSelectedEmployee(null);
// //         setMobileError('');
// //         setFormData({
// //             name: '', organizationName: '', organizationCode: '', email: '',
// //             manager: '', mobileNumber: '', password: 'Default@123', role: 'EMP',
// //             designation: '', empCode: '', empType: '',
// //         });
// //     };

// //     const validatePhoneNumber = (number) => {
// //         const phoneRegex = /^[6-9]\d{9}$/;
// //         if (!number || phoneRegex.test(number)) {
// //             setMobileError('');
// //         } else {
// //             setMobileError('Please enter a valid 10-digit mobile number.');
// //         }
// //     };

// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         if (name === 'mobileNumber') {
// //             validatePhoneNumber(value);
// //         }
// //         setFormData(prevState => ({
// //             ...prevState,
// //             [name]: value,
// //         }));
// //     };

// //     const handleFormSubmit = async () => {
// //         if (mobileError) {
// //             setSnackbar({ open: true, message: 'Please fix the errors before submitting.', severity: 'warning' });
// //             return;
// //         }
// //         try {
// //             await axios.post(`${base_identity}/identity-handler/create/register-new-candidate-as-existing`, formData);

// //             setSnackbar({ open: true, message: 'Employee onboarded successfully!', severity: 'success' });
// //             handleCloseDialog();
// //             fetchEmployees();
// //         } catch (err) {
// //             console.error('Failed to onboard employee:', err);
// //             setSnackbar({ open: true, message: 'Failed to onboard employee! Please try again.', severity: 'error' });
// //         }
// //     };

// //     const handleChangePage = (event, newPage) => setPage(newPage);
// //     const handleChangeRowsPerPage = (event) => {
// //         setRowsPerPage(parseInt(event.target.value, 10));
// //         setPage(0);
// //     };

// //     const paginatedData = employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

// //     return (
// //         <Box p={1} sx={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
// //             <BackButton/>
// //             <Paper sx={{ p: 3, borderRadius: '12px' }}>
// //                 <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
// //                     Onboard New Employees
// //                 </Typography>

// //                 {loading ? (
// //                     <Box display="flex" justifyContent="center" alignItems="center" height="300px">
// //                         <CircularProgress />
// //                     </Box>
// //                 ) : (
// //                     <>
// //                         <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}>
// //                             <Table>
// //                                 <TableHead sx={{ backgroundColor: '#3f51b5' }}>
// //                                     <TableRow>
// //                                         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Employee Code</TableCell>
// //                                         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Full Name</TableCell>
// //                                         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Personal Email</TableCell>
// //                                         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Designation</TableCell>
// //                                         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
// //                                         <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
// //                                     </TableRow>
// //                                 </TableHead>
// //                                 <TableBody>
// //                                     {paginatedData.length > 0 ? (
// //                                         paginatedData.map((emp) => (
// //                                             <TableRow key={emp.id || emp.empCode} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
// //                                                 <TableCell>{emp.empCode}</TableCell>
// //                                                 <TableCell>{emp.name}</TableCell>
// //                                                 <TableCell>{emp.personalEmail}</TableCell>
// //                                                  <TableCell>{emp.designation}</TableCell>
// //                                                 <TableCell>
// //                                                 {new Intl.DateTimeFormat("en-GB", {
// //                                                     day: "2-digit",
// //                                                     month: "2-digit",
// //                                                     year: "numeric",
// //                                                 }).format(new Date(emp.offerDate))}
// //                                                 </TableCell>

// //                                                 <TableCell align="center">
// //                                                     <Button
// //                                                         variant="contained"
// //                                                         sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
// //                                                         onClick={() => handleOnboardClick(emp)}
// //                                                     >
// //                                                         Onboard
// //                                                     </Button>
// //                                                 </TableCell>
// //                                             </TableRow>
// //                                         ))
// //                                     ) : (
// //                                         <TableRow>
// //                                             <TableCell colSpan={4} align="center">No New Employees Found</TableCell>
// //                                         </TableRow>
// //                                     )}
// //                                 </TableBody>
// //                             </Table>
// //                         </TableContainer>

// //                         <TablePagination
// //                             component="div"
// //                             count={employees.length}
// //                             page={page}
// //                             onPageChange={handleChangePage}
// //                             rowsPerPage={rowsPerPage}
// //                             onRowsPerPageChange={handleChangeRowsPerPage}
// //                             rowsPerPageOptions={[5, 10, 25, 50]}
// //                         />
// //                     </>
// //                 )}
// //             </Paper>

// //             <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
// //                 <DialogTitle sx={{ fontWeight: 600, backgroundColor: '#3f51b5', color: 'white' }}>
// //                     Onboard New Candidate
// //                 </DialogTitle>
// //                 <DialogContent dividers sx={{ pt: 3 }}>
// //                     <Grid container spacing={3}>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth required />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField label="Employee Code" name="empCode" value={formData.empCode} onChange={handleInputChange} fullWidth required />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField label="Organization Name" name="organizationName" value={formData.organizationName} onChange={handleInputChange} fullWidth required />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField label="Organization Code" name="organizationCode" value={formData.organizationCode} onChange={handleInputChange} fullWidth required />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField label="Official Email" placeholder='Enter Offical Email' name="email" value={formData.email.startsWith("officialEmail")? "" :formData.email} onChange={handleInputChange} fullWidth required />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} fullWidth required />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField label="Manager" name="manager" value={formData.manager} onChange={handleInputChange} fullWidth required />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <TextField
// //                                 label="Mobile Number"
// //                                 name="mobileNumber"
// //                                 value={formData.mobileNumber}
// //                                 onChange={handleInputChange}
// //                                 fullWidth
// //                                 required
// //                                 error={!!mobileError}
// //                                 helperText={mobileError}
// //                             />
// //                         </Grid>
// //                         <Grid item xs={12} sm={6}>
// //                             <FormControl fullWidth required>
// //                                 <InputLabel id="empType-label">Employee Type</InputLabel>
// //                                 <Select
// //                                     labelId="empType-label"
// //                                     id="empType"
// //                                     name="empType"
// //                                     value={formData.empType}
// //                                     onChange={handleInputChange}
// //                                     label="Employee Type"
// //                                 >
// //                                     <MenuItem value="Full time">Full time</MenuItem>
// //                                     <MenuItem value="Intern">Intern</MenuItem>
// //                                     <MenuItem value="Consultant">Consultant</MenuItem>
// //                                     <MenuItem value="Part time">Part time</MenuItem>
// //                                 </Select>
// //                             </FormControl>
// //                         </Grid>
// //                     </Grid>
// //                 </DialogContent>
// //                 <DialogActions sx={{ p: 2 }}>
// //                     <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
// //                     <Button
// //                         variant="contained"
// //                         onClick={handleFormSubmit}
// //                         sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
// //                         disabled={!!mobileError}
// //                     >
// //                         Submit
// //                     </Button>
// //                 </DialogActions>
// //             </Dialog>

// //             <Snackbar
// //                 open={snackbar.open}
// //                 autoHideDuration={4000}
// //                 onClose={() => setSnackbar({ ...snackbar, open: false })}
// //                 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// //             >
// //                 <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
// //                     {snackbar.message}
// //                 </Alert>
// //             </Snackbar>
// //         </Box>
// //     );
// // };

// // export default OfferLetterPending;

// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import axios from 'axios';
// import {
//     Box, Table, TableBody, TableCell, TableContainer, TableHead,
//     TableRow, Paper, Button, Typography, CircularProgress,
//     TablePagination, Dialog, DialogActions, DialogContent,
//     DialogTitle, Snackbar, Alert, TextField, Grid, Select, 
//     MenuItem, FormControl, InputLabel, Card, CardContent,
//     InputAdornment, Chip, Fade, Skeleton,
//     Divider
// } from '@mui/material';
// import {
//     Search as SearchIcon,
//     Person as PersonIcon,
//     Business as BusinessIcon,
//     Email as EmailIcon,
//     Badge as BadgeIcon,
//     Clear as ClearIcon
// } from '@mui/icons-material';
// import { base_identity } from '../../http/services';
// import BackButton from '../../constent/BackButton';

// // Constants for better maintainability
// const EMPLOYEE_TYPES = [
//     { value: 'Full time', label: 'Full Time' },
//     { value: 'Intern', label: 'Intern' },
//     { value: 'Consultant', label: 'Consultant' },
//     { value: 'Part time', label: 'Part Time' }
// ];

// const DEFAULT_FORM_DATA = {
//     name: '',
//     organizationName: 'CKD VCS',
//     organizationCode: '',
//     email: '',
//     manager: '',
//     mobileNumber: '',
//     password: 'Default@123',
//     role: 'EMP',
//     designation: '',
//     empCode: '',
//     empType: '',
// };

// const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

// // Custom hooks for better separation of concerns
// const useEmployees = () => {
//     const [employees, setEmployees] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const fetchEmployees = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const organizationCode = localStorage.getItem('organizationCode');
//             const response = await axios.get(
//                 `${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${organizationCode}`
//             );
//             const filtered = Array.isArray(response.data) 
//                 ? response.data.filter(emp => emp.current === 'NEW') 
//                 : [];
//             setEmployees(filtered);
//         } catch (err) {
//             console.error('Error fetching employees:', err);
//             setError(err.message);
//             setEmployees([]);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     return { employees, loading, error, fetchEmployees };
// };

// const useSnackbar = () => {
//     const [snackbar, setSnackbar] = useState({ 
//         open: false, 
//         message: '', 
//         severity: 'success' 
//     });

//     const showSnackbar = useCallback((message, severity = 'success') => {
//         setSnackbar({ open: true, message, severity });
//     }, []);

//     const hideSnackbar = useCallback(() => {
//         setSnackbar(prev => ({ ...prev, open: false }));
//     }, []);

//     return { snackbar, showSnackbar, hideSnackbar };
// };

// // Validation utilities
// const validatePhoneNumber = (number) => {
//     const phoneRegex = /^[6-9]\d{9}$/;
//     return !number || phoneRegex.test(number) ? '' : 'Please enter a valid 10-digit mobile number.';
// };

// const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return !email || emailRegex.test(email) ? '' : 'Please enter a valid email address.';
// };

// // Table skeleton loader component
// const TableSkeleton = () => (
//     <TableBody>
//         {[...Array(5)].map((_, index) => (
//             <TableRow key={index}>
//                 {[...Array(7)].map((_, cellIndex) => (
//                     <TableCell key={cellIndex}>
//                         <Skeleton variant="text" height={24} />
//                     </TableCell>
//                 ))}
//             </TableRow>
//         ))}
//     </TableBody>
// );

// const OfferLetterPending = () => {
//     // State management
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
//     const [formErrors, setFormErrors] = useState({});
//     const [submitting, setSubmitting] = useState(false);

//     // Custom hooks
//     const { employees, loading, error, fetchEmployees } = useEmployees();
//     const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

//     // Effects
//     useEffect(() => {
//         fetchEmployees();
//     }, [fetchEmployees]);

//     // Memoized filtered and paginated data
//     const filteredEmployees = useMemo(() => {
//         if (!searchTerm.trim()) return employees;
        
//         const term = searchTerm.toLowerCase();
//         return employees.filter(emp => 
//             emp.name?.toLowerCase().includes(term) ||
//             emp.empCode?.toLowerCase().includes(term) ||
//             emp.personalEmail?.toLowerCase().includes(term) ||
//             emp.designation?.toLowerCase().includes(term)
//         );
//     }, [employees, searchTerm]);

//     const paginatedData = useMemo(() => {
//         const start = page * rowsPerPage;
//         return filteredEmployees.slice(start, start + rowsPerPage);
//     }, [filteredEmployees, page, rowsPerPage]);

//     // Event handlers
//     const handleSearchChange = useCallback((event) => {
//         setSearchTerm(event.target.value);
//         setPage(0); // Reset to first page when searching
//     }, []);

//     const handleClearSearch = useCallback(() => {
//         setSearchTerm('');
//         setPage(0);
//     }, []);

//     const handleOnboardClick = useCallback((emp) => {
//         setSelectedEmployee(emp);
//         setFormData({
//             ...DEFAULT_FORM_DATA,
//             name: emp.name || '',
//             organizationName: emp.organizationName || 'CKD VCS',
//             organizationCode: localStorage.getItem('organizationCode') || 'HRHaaTCKD0',
//             email: emp.officialEmail?.startsWith('officialEmail') ? '' : emp.officialEmail || '',
//             mobileNumber: emp.mobileNumber || '',
//             designation: emp.designation || emp.position || '',
//             empCode: emp.empCode || '',
//         });
//         setFormErrors({});
//         setOpenDialog(true);
//     }, []);

//     const handleCloseDialog = useCallback(() => {
//         setOpenDialog(false);
//         setSelectedEmployee(null);
//         setFormData(DEFAULT_FORM_DATA);
//         setFormErrors({});
//         setSubmitting(false);
//     }, []);

//     const handleInputChange = useCallback((e) => {
//         const { name, value } = e.target;
        
//         setFormData(prev => ({
//             ...prev,
//             [name]: value,
//         }));

//         // Real-time validation
//         let error = '';
//         if (name === 'mobileNumber') {
//             error = validatePhoneNumber(value);
//         } else if (name === 'email') {
//             error = validateEmail(value);
//         }

//         setFormErrors(prev => ({
//             ...prev,
//             [name]: error
//         }));
//     }, []);

//     const validateForm = useCallback(() => {
//         const errors = {};
//         const requiredFields = ['name', 'empCode', 'email', 'designation', 'manager', 'mobileNumber', 'empType'];
        
//         requiredFields.forEach(field => {
//             if (!formData[field]?.trim()) {
//                 errors[field] = 'This field is required';
//             }
//         });

//         if (formData.mobileNumber) {
//             errors.mobileNumber = validatePhoneNumber(formData.mobileNumber);
//         }

//         if (formData.email) {
//             errors.email = validateEmail(formData.email);
//         }

//         // Remove empty errors
//         Object.keys(errors).forEach(key => {
//             if (!errors[key]) delete errors[key];
//         });

//         setFormErrors(errors);
//         return Object.keys(errors).length === 0;
//     }, [formData]);

//     const handleFormSubmit = useCallback(async () => {
//         if (!validateForm()) {
//             showSnackbar('Please fix all errors before submitting.', 'warning');
//             return;
//         }

//         setSubmitting(true);
//         try {
//             await axios.post(
//                 `${base_identity}/identity-handler/create/create-existing-user`, 
//                 formData
//             );
//             showSnackbar('Employee onboarded successfully!', 'success');
//             // fetchEmployees();
            
//             try {
                
//                 await axios.get(`${base_identity}/identity-handler/details/onboard-candidate?empCode=${formData.empCode}&email=${formData.email}&status=EXIST`);
//             } catch (error) {
//                 console.log(error);
//             }
//             handleCloseDialog();
//         } catch (err) {
//             console.error('Failed to onboard employee:', err);
//             showSnackbar(
//                 err.response?.data?.message || 'Failed to onboard employee! Please try again.', 
//                 'error'
//             );
//         } finally {
//             setSubmitting(false);
//         }
//     }, [formData, validateForm, showSnackbar, handleCloseDialog, fetchEmployees]);

//     const handleChangePage = useCallback((event, newPage) => {
//         setPage(newPage);
//     }, []);

//     const handleChangeRowsPerPage = useCallback((event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     }, []);

//     const formatDate = useCallback((dateString) => {
//         return new Intl.DateTimeFormat("en-GB", {
//             day: "2-digit",
//             month: "2-digit", 
//             year: "numeric",
//         }).format(new Date(dateString));
//     }, []);

//     if (error) {
//         return (
//             <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//                 <Card sx={{ p: 3, textAlign: 'center', maxWidth: 400 }}>
//                     <Typography variant="h6" color="error" gutterBottom>
//                         Error Loading Data
//                     </Typography>
//                     <Typography color="text.secondary" paragraph>
//                         {error}
//                     </Typography>
//                     <Button variant="contained" onClick={fetchEmployees}>
//                         Retry
//                     </Button>
//                 </Card>
//             </Box>
//         );
//     }

//     return (
//         <Box p={2} sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
//             <BackButton />
            
//             {/* Header Section */}
//             <Card sx={{ mb: 3, borderRadius: 3 ,backgroundColor: '#f8f9fa', boxShadow:'none'}}>
//                 <CardContent sx={{ p: 4 }}>
//                     <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//                         <Box>
//                             <Typography variant="h4" sx={{ 
//                                 fontWeight: 700, 
//                                 color: '#1e293b',
//                                 mb: 1
//                             }}>
//                                 Employee Onboarding
//                             </Typography>
                           
//                         </Box>
//                         <Chip 
//                             label={`${filteredEmployees.length} Pending`}
//                             color="primary"
//                             variant="outlined"
//                             sx={{ fontWeight: 600 }}
//                         />
//                     </Box>

//                     {/* Search Bar */}
//                     <TextField
//                         fullWidth
//                         placeholder="Search by name, employee code, email, or designation..."
//                         value={searchTerm}
//                         onChange={handleSearchChange}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon color="action" />
//                                 </InputAdornment>
//                             ),
//                             endAdornment: searchTerm && (
//                                 <InputAdornment position="end">
//                                     <Button
//                                         size="small"
//                                         onClick={handleClearSearch}
//                                         sx={{ minWidth: 'auto', p: 0.5 }}
//                                     >
//                                         <ClearIcon fontSize="small" />
//                                     </Button>
//                                 </InputAdornment>
//                             ),
//                         }}
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 borderRadius: 3,
//                                 backgroundColor: '#fff',
//                                 width:'60%',
//                                 '&:hover fieldset': {
//                                     borderColor: '#3f51b5',
//                                 },
//                             }
//                         }}
//                     />
//                 </CardContent>
//             </Card>

//             {/* Main Content */}
//             <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//                 {loading ? (
//                     <Box p={3}>
//                         <TableContainer>
//                             <Table>
//                                 <TableHead sx={{ backgroundColor: '#3f51b5' }}>
//                                     <TableRow>
//                                         <TableCell sx={{ color: 'white', fontWeight: 600 }}>S.No</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee Code</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 600 }}>Full Name</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 600 }}>Personal Email</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 600 }}>Designation</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 600 }}>Offer Date</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableSkeleton />
//                             </Table>
//                         </TableContainer>
//                     </Box>
//                 ) : (
//                     <Fade in={!loading}>
//                         <Box>
//                             <TableContainer>
//                                 <Table>
//                                     <TableHead sx={{ backgroundColor: '#3f51b5' }}>
//                                         <TableRow>
//                                             <TableCell sx={{ color: 'white', fontWeight: 600, width: 80 }}>S.No</TableCell>
//                                             <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee Code</TableCell>
//                                             <TableCell sx={{ color: 'white', fontWeight: 600 }}>Full Name</TableCell>
//                                             <TableCell sx={{ color: 'white', fontWeight: 600 }}>Personal Email</TableCell>
//                                             <TableCell sx={{ color: 'white', fontWeight: 600 }}>Designation</TableCell>
//                                             <TableCell sx={{ color: 'white', fontWeight: 600 }}>Offer Date</TableCell>
//                                             <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center', width: 120 }}>Actions</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {paginatedData.length > 0 ? (
//                                             paginatedData.map((emp, index) => (
//                                                 <TableRow 
//                                                     key={emp.id || emp.empCode} 
//                                                     hover 
//                                                     sx={{ 
//                                                         '&:nth-of-type(odd)': { backgroundColor: '#f8f9ff' },
//                                                         '&:hover': { backgroundColor: '#e3f2fd' }
//                                                     }}
//                                                 >
//                                                     <TableCell sx={{ fontWeight: 500 }}>
//                                                         {page * rowsPerPage + index + 1}
//                                                     </TableCell>
//                                                     <TableCell sx={{ fontWeight: 500 }}>
//                                                         <Box display="flex" alignItems="center" gap={1}>
//                                                             <BadgeIcon fontSize="small" color="action" />
//                                                             {emp.empCode}
//                                                         </Box>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Box display="flex" alignItems="center" gap={1}>
//                                                             <PersonIcon fontSize="small" color="action" />
//                                                             {emp.name}
//                                                         </Box>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Box display="flex" alignItems="center" gap={1}>
//                                                             <EmailIcon fontSize="small" color="action" />
//                                                             {emp.personalEmail}
//                                                         </Box>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Box display="flex" alignItems="center" gap={1}>
//                                                             <BusinessIcon fontSize="small" color="action" />
//                                                             {emp.designation}
//                                                         </Box>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         {emp.offerDate ? formatDate(emp.offerDate) : 'N/A'}
//                                                     </TableCell>
//                                                     <TableCell align="center">
//                                                         <Button
//                                                             variant="contained"
//                                                             size="small"
//                                                             onClick={() => handleOnboardClick(emp)}
//                                                             sx={{ 
//                                                                 backgroundColor: '#10b981',
//                                                                 '&:hover': { backgroundColor: '#059669' },
//                                                                 borderRadius: 2,
//                                                                 textTransform: 'none',
//                                                                 fontWeight: 600
//                                                             }}
//                                                         >
//                                                             Onboard
//                                                         </Button>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))
//                                         ) : (
//                                             <TableRow>
//                                                 <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
//                                                     <Box textAlign="center">
//                                                         <PersonIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
//                                                         <Typography variant="h6" color="text.secondary" gutterBottom>
//                                                             {searchTerm ? 'No matching employees found' : 'No new employees to onboard'}
//                                                         </Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             {searchTerm ? 'Try adjusting your search criteria' : 'Check back later for new candidates'}
//                                                         </Typography>
//                                                     </Box>
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>

//                             <TablePagination
//                                 component="div"
//                                 count={filteredEmployees.length}
//                                 page={page}
//                                 onPageChange={handleChangePage}
//                                 rowsPerPage={rowsPerPage}
//                                 onRowsPerPageChange={handleChangeRowsPerPage}
//                                 rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
//                                 sx={{
//                                     borderTop: '1px solid #e5e7eb',
//                                     '& .MuiTablePagination-toolbar': {
//                                         paddingX: 3
//                                     }
//                                 }}
//                             />
//                         </Box>
//                     </Fade>
//                 )}
//             </Card>

//             {/* Onboarding Dialog */}
//             {/* <Dialog 
//                 open={openDialog} 
//                 onClose={handleCloseDialog} 
//                 maxWidth="md" 
//                 fullWidth
//                 PaperProps={{
//                     sx: { borderRadius: 3 }
//                 }}
//             >
//                 <DialogTitle sx={{ 
//                     fontWeight: 700, 
//                     backgroundColor: '#3f51b5', 
//                     color: 'white',
//                     fontSize: '1.25rem'
//                 }}>
//                     Onboard New Employee
//                 </DialogTitle>
//                 <DialogContent dividers sx={{ pt: 3 }}>
//                     <Grid container spacing={3}>
//                         <Grid item xs={12} sm={6}>
//                             <TextField 
//                                 label="Full Name" 
//                                 name="name" 
//                                 value={formData.name} 
//                                 onChange={handleInputChange} 
//                                 fullWidth 
//                                 required
//                                 error={!!formErrors.name}
//                                 helperText={formErrors.name}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <TextField 
//                                 label="Employee Code" 
//                                 name="empCode" 
//                                 value={formData.empCode} 
//                                 onChange={handleInputChange} 
//                                 fullWidth 
//                                 required
//                                 error={!!formErrors.empCode}
//                                 helperText={formErrors.empCode}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <TextField 
//                                 label="Organization Name" 
//                                 name="organizationName" 
//                                 value={formData.organizationName} 
//                                 onChange={handleInputChange} 
//                                 fullWidth 
//                                 required
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <TextField 
//                                 label="Organization Code" 
//                                 name="organizationCode" 
//                                 value={formData.organizationCode} 
//                                 onChange={handleInputChange} 
//                                 fullWidth 
//                                 required
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         </Grid>

//                          <Grid item xs={12} sm={6}>
//                             <TextField
//                                 label="Mobile Number"
//                                 name="mobileNumber"
//                                 value={formData.mobileNumber}
//                                 onChange={handleInputChange}
//                                 fullWidth
//                                 required
//                                 error={!!formErrors.mobileNumber}
//                                 helperText={formErrors.mobileNumber}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         </Grid>
//                        <Grid item xs={12}>
//   <Divider sx={{ my: 2 }} />
// </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <TextField 
//                                 label="Official Email" 
//                                 placeholder="Enter official email" 
//                                 name="email" 
//                                 type="email"
//                                 value={formData.email} 
//                                 onChange={handleInputChange} 
//                                 fullWidth 
//                                 required
//                                 error={!!formErrors.email}
//                                 helperText={formErrors.email}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <TextField 
//                                 label="Designation" 
//                                 name="designation" 
//                                 value={formData.designation} 
//                                 onChange={handleInputChange} 
//                                 fullWidth 
//                                 required
//                                 error={!!formErrors.designation}
//                                 helperText={formErrors.designation}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <TextField 
//                                 label="Manager" 
//                                 name="manager" 
//                                 value={formData.manager} 
//                                 onChange={handleInputChange} 
//                                 fullWidth 
//                                 required
//                                 error={!!formErrors.manager}
//                                 helperText={formErrors.manager}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         </Grid>
                       
//                         <Grid item xs={12} sm={6}>
//                             <FormControl fullWidth required error={!!formErrors.empType}>
//                                 <InputLabel id="empType-label">Employee Type</InputLabel>
//                                 <Select
//                                     labelId="empType-label"
//                                     name="empType"
//                                     value={formData.empType}
//                                     onChange={handleInputChange}
//                                     label="Employee Type"
//                                     sx={{ borderRadius: 2 }}
//                                 >
//                                     {EMPLOYEE_TYPES.map((type) => (
//                                         <MenuItem key={type.value} value={type.value}>
//                                             {type.label}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                                 {formErrors.empType && (
//                                     <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
//                                         {formErrors.empType}
//                                     </Typography>
//                                 )}
//                             </FormControl>
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions sx={{ p: 3, gap: 1 }}>
//                     <Button 
//                         onClick={handleCloseDialog} 
//                         variant="outlined"
//                         sx={{ 
//                             borderRadius: 2,
//                             textTransform: 'none',
//                             fontWeight: 600,
//                             minWidth: 100
//                         }}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="contained"
//                         onClick={handleFormSubmit}
//                         disabled={submitting}
//                         sx={{ 
//                             backgroundColor: '#10b981',
//                             '&:hover': { backgroundColor: '#059669' },
//                             borderRadius: 2,
//                             textTransform: 'none',
//                             fontWeight: 600,
//                             minWidth: 120
//                         }}
//                     >
//                         {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
//                     </Button>
//                 </DialogActions>
//             </Dialog> */}
//             <Dialog 
//     open={openDialog} 
//     onClose={handleCloseDialog} 
//     maxWidth="md" 
//     fullWidth
//     PaperProps={{
//         sx: { 
//             borderRadius: 4,
//             boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//             overflow: 'hidden'
//         }
//     }}
// >
//     <DialogTitle sx={{ 
//         fontWeight: 700, 
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         color: 'white',
//         fontSize: '1.5rem',
//         py: 3,
//         textAlign: 'center',
//         position: 'relative',
//         '&::after': {
//             content: '""',
//             position: 'absolute',
//             bottom: 0,
//             left: 0,
//             right: 0,
//             height: '3px',
//             background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
//         }
//     }}>
//         Onboard New Employee
//     </DialogTitle>
    
//     <DialogContent dividers sx={{ 
//         pt: 4, 
//         pb: 3,
//         background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//         '& .MuiDivider-root': {
//             background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
//             height: 2
//         }
//     }}>
//         <Grid container spacing={3}>
//             {/* Personal Information Section */}
//             <Grid item xs={12}>
//                 <Box sx={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: 1, 
//                     mb: 2,
//                     color: '#475569',
//                     fontWeight: 600
//                 }}>
//                     <Box sx={{
//                         width: 8,
//                         height: 8,
//                         borderRadius: '50%',
//                         background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
//                     }} />
//                     Fix Information
//                 </Box>
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//                 <TextField 
//                     disabled
//                     label="Full Name" 
//                     name="name" 
//                     value={formData.name} 
//                     onChange={handleInputChange} 
//                     fullWidth 
//                     required
//                     error={!!formErrors.name}
//                     helperText={formErrors.name}
//                     sx={{ 
//                         '& .MuiOutlinedInput-root': { 
//                             borderRadius: 3,
//                             transition: 'all 0.3s ease',
//                             backgroundColor: 'white',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
//                                 transform: 'translateY(-1px)'
//                             },
//                             '&.Mui-focused': {
//                                 boxShadow: '0 8px 25px rgba(59, 130, 246, 0.25)',
//                                 transform: 'translateY(-2px)'
//                             }
//                         },
//                         '& .MuiInputLabel-root.Mui-focused': {
//                             color: '#3b82f6'
//                         }
//                     }}
//                 />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//                 <TextField 
//                  disabled
//                     label="Employee Code" 
//                     name="empCode" 
//                     value={formData.empCode} 
//                     onChange={handleInputChange} 
//                     fullWidth 
//                     required
//                     error={!!formErrors.empCode}
//                     helperText={formErrors.empCode}
//                     sx={{ 
//                         '& .MuiOutlinedInput-root': { 
//                             borderRadius: 3,
//                             transition: 'all 0.3s ease',
//                             backgroundColor: 'white',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
//                                 transform: 'translateY(-1px)'
//                             },
//                             '&.Mui-focused': {
//                                 boxShadow: '0 8px 25px rgba(59, 130, 246, 0.25)',
//                                 transform: 'translateY(-2px)'
//                             }
//                         },
//                         '& .MuiInputLabel-root.Mui-focused': {
//                             color: '#3b82f6'
//                         }
//                     }}
//                 />
//             </Grid>
            
            

            
            
//             <Grid item xs={12} sm={6}>
//                 <TextField 
//                   disabled
//                     label="Organization Name" 
//                     name="organizationName" 
//                     value={formData.organizationName} 
//                     onChange={handleInputChange} 
//                     fullWidth 
//                     required
//                     sx={{ 
//                         '& .MuiOutlinedInput-root': { 
//                             borderRadius: 3,
//                             transition: 'all 0.3s ease',
//                             backgroundColor: 'white',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
//                                 transform: 'translateY(-1px)'
//                             },
//                             '&.Mui-focused': {
//                                 boxShadow: '0 8px 25px rgba(16, 185, 129, 0.25)',
//                                 transform: 'translateY(-2px)'
//                             }
//                         },
//                         '& .MuiInputLabel-root.Mui-focused': {
//                             color: '#10b981'
//                         }
//                     }}
//                 />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//                 <TextField 
//                     disabled
//                     label="Organization Code" 
//                     name="organizationCode" 
//                     value={formData.organizationCode} 
//                     onChange={handleInputChange} 
//                     fullWidth 
//                     required
//                     sx={{ 
//                         '& .MuiOutlinedInput-root': { 
//                             borderRadius: 3,
//                             transition: 'all 0.3s ease',
//                             backgroundColor: 'white',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
//                                 transform: 'translateY(-1px)'
//                             },
//                             '&.Mui-focused': {
//                                 boxShadow: '0 8px 25px rgba(16, 185, 129, 0.25)',
//                                 transform: 'translateY(-2px)'
//                             }
//                         },
//                         '& .MuiInputLabel-root.Mui-focused': {
//                             color: '#10b981'
//                         }
//                     }}
//                 />
//             </Grid>

//             {/* Professional Information Section */}
//             <Grid item xs={12}>
//                 <Divider sx={{ my: 2 }} />
//                 <Box sx={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: 1, 
//                     mb: 2,
//                     color: '#475569',
//                     fontWeight: 600
//                 }}>
//                     <Box sx={{
//                         width: 8,
//                         height: 8,
//                         borderRadius: '50%',
//                         background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
//                     }} />
//                     changeable Information
//                 </Box>
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//                 <TextField 
//                     label="Official Email" 
//                     placeholder="Enter official email" 
//                     name="email" 
//                     type="email"
//                     value={formData.email} 
//                     onChange={handleInputChange} 
//                     fullWidth 
//                     required
//                     error={!!formErrors.email}
//                     helperText={formErrors.email}
//                     sx={{ 
//                         '& .MuiOutlinedInput-root': { 
//                             borderRadius: 3,
//                             transition: 'all 0.3s ease',
//                             backgroundColor: 'white',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
//                                 transform: 'translateY(-1px)'
//                             },
//                             '&.Mui-focused': {
//                                 boxShadow: '0 8px 25px rgba(139, 92, 246, 0.25)',
//                                 transform: 'translateY(-2px)'
//                             }
//                         },
//                         '& .MuiInputLabel-root.Mui-focused': {
//                             color: '#8b5cf6'
//                         }
//                     }}
//                 />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//                 <TextField 
//                     label="Mobile Number"
//                     name="mobileNumber"
//                     value={formData.mobileNumber}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                     error={!!formErrors.mobileNumber}
//                     helperText={formErrors.mobileNumber}
//                     sx={{ 
//                         '& .MuiOutlinedInput-root': { 
//                             borderRadius: 3,
//                             transition: 'all 0.3s ease',
//                             backgroundColor: 'white',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
//                                 transform: 'translateY(-1px)'
//                             },
//                             '&.Mui-focused': {
//                                 boxShadow: '0 8px 25px rgba(59, 130, 246, 0.25)',
//                                 transform: 'translateY(-2px)'
//                             }
//                         },
//                         '& .MuiInputLabel-root.Mui-focused': {
//                             color: '#3b82f6'
//                         }
//                     }}
//                 />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//                 <TextField 
//                     label="Designation" 
//                     name="designation" 
//                     value={formData.designation} 
//                     onChange={handleInputChange} 
//                     fullWidth 
//                     required
//                     error={!!formErrors.designation}
//                     helperText={formErrors.designation}
//                     sx={{ 
//                         '& .MuiOutlinedInput-root': { 
//                             borderRadius: 3,
//                             transition: 'all 0.3s ease',
//                             backgroundColor: 'white',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
//                                 transform: 'translateY(-1px)'
//                             },
//                             '&.Mui-focused': {
//                                 boxShadow: '0 8px 25px rgba(139, 92, 246, 0.25)',
//                                 transform: 'translateY(-2px)'
//                             }
//                         },
//                         '& .MuiInputLabel-root.Mui-focused': {
//                             color: '#8b5cf6'
//                         }
//                     }}
//                 />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//                 <TextField 
//                     label="Manager" 
//                     name="manager" 
//                     value={formData.manager} 
//                     onChange={handleInputChange} 
//                     fullWidth 
//                     required
//                     error={!!formErrors.manager}
//                     helperText={formErrors.manager}
//                     sx={{ 
//                         '& .MuiOutlinedInput-root': { 
//                             borderRadius: 3,
//                             transition: 'all 0.3s ease',
//                             backgroundColor: 'white',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
//                                 transform: 'translateY(-1px)'
//                             },
//                             '&.Mui-focused': {
//                                 boxShadow: '0 8px 25px rgba(139, 92, 246, 0.25)',
//                                 transform: 'translateY(-2px)'
//                             }
//                         },
//                         '& .MuiInputLabel-root.Mui-focused': {
//                             color: '#8b5cf6'
//                         }
//                     }}
//                 />
//             </Grid>
           
//             <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth required error={!!formErrors.empType}>
//                     <InputLabel 
//                         id="empType-label"
//                         sx={{
//                             '&.Mui-focused': {
//                                 color: '#8b5cf6'
//                             }
//                         }}
//                     >
//                         Employee Type
//                     </InputLabel>
//                     <Select
//                         labelId="empType-label"
//                         name="empType"
//                         value={formData.empType}
//                         onChange={handleInputChange}
//                         label="Employee Type"
//                         sx={{ 
//                             borderRadius: 3,
//                             backgroundColor: 'white',
//                             transition: 'all 0.3s ease',
//                             '&:hover .MuiOutlinedInput-notchedOutline': {
//                                 boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
//                             },
//                             '&.Mui-focused': {
//                                 '& .MuiOutlinedInput-notchedOutline': {
//                                     borderColor: '#8b5cf6',
//                                     boxShadow: '0 8px 25px rgba(139, 92, 246, 0.25)'
//                                 }
//                             }
//                         }}
//                     >
//                         {EMPLOYEE_TYPES.map((type) => (
//                             <MenuItem 
//                                 key={type.value} 
//                                 value={type.value}
//                                 sx={{
//                                     '&:hover': {
//                                         backgroundColor: 'rgba(139, 92, 246, 0.08)'
//                                     }
//                                 }}
//                             >
//                                 {type.label}
//                             </MenuItem>
//                         ))}
//                     </Select>
//                     {formErrors.empType && (
//                         <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
//                             {formErrors.empType}
//                         </Typography>
//                     )}
//                 </FormControl>
//             </Grid>
//         </Grid>
//     </DialogContent>
    
//     <DialogActions sx={{ 
//         p: 3, 
//         gap: 2,
//         background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//         justifyContent: 'center'
//     }}>
//         <Button 
//             onClick={handleCloseDialog} 
//             variant="outlined"
//             sx={{ 
//                 borderRadius: 3,
//                 textTransform: 'none',
//                 fontWeight: 600,
//                 minWidth: 120,
//                 py: 1.5,
//                 px: 3,
//                 borderColor: '#e2e8f0',
//                 color: '#64748b',
//                 transition: 'all 0.3s ease',
//                 '&:hover': { 
//                     borderColor: '#cbd5e1',
//                     backgroundColor: '#f8fafc',
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
//                 }
//             }}
//         >
//             ✕ Cancel
//         </Button>
//         <Button
//             variant="contained"
//             onClick={handleFormSubmit}
//             disabled={submitting}
//             sx={{ 
//                 background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                 borderRadius: 3,
//                 textTransform: 'none',
//                 fontWeight: 600,
//                 minWidth: 140,
//                 py: 1.5,
//                 px: 3,
//                 transition: 'all 0.3s ease',
//                 boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
//                 '&:hover': { 
//                     background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
//                     transform: 'translateY(-2px)',
//                     boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
//                 },
//                 '&:disabled': {
//                     background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
//                 }
//             }}
//         >
//             {submitting ? <CircularProgress size={20} color="inherit" /> : '✓ Submit'}
//         </Button>
//     </DialogActions>
// </Dialog>

//             {/* Snackbar */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={4000}
//                 onClose={hideSnackbar}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             >
//                 <Alert 
//                     onClose={hideSnackbar} 
//                     severity={snackbar.severity} 
//                     sx={{ 
//                         width: '100%',
//                         borderRadius: 2,
//                         fontWeight: 500
//                     }} 
//                     variant="filled"
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default OfferLetterPending;



import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Typography, CircularProgress,
    TablePagination, Dialog, DialogActions, DialogContent,
    DialogTitle, Snackbar, Alert, TextField, Grid, Select, 
    MenuItem, FormControl, InputLabel, Card, CardContent,
    InputAdornment, Chip, Fade, Skeleton,
    Divider, Tabs, Tab, Autocomplete, FormHelperText, IconButton,
    styled
} from '@mui/material';
import {
    Search as SearchIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    Badge as BadgeIcon,
    Clear as ClearIcon,
    HowToReg as OnboardedIcon,
    Cancel as RejectedIcon,
    Phone as PhoneIcon,
    Add as AddIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { base_identity } from '../../http/services';
import BackButton from '../../constent/BackButton';

// Constants for better maintainability
const EMPLOYEE_TYPES = [
    { value: 'Full Time', label: 'Full Time' },
    { value: 'Intern', label: 'Intern' },
    { value: 'Part Time', label: 'Part Time' },
    { value: 'Consultant', label: 'Consultant' },
    { value: 'Others', label: 'Others' }
];

// Styled Components (adapted from AddEmployeeDrawer)
const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
        borderRadius: 12,
        transition: "all 0.3s ease",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        height: 50,
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
        },
        "&.Mui-focused": {
            backgroundColor: "rgba(255, 255, 255, 0.98)",
        },
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(33, 150, 243, 0.3)",
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
        color: theme.palette.primary.main,
        fontSize: 20,
    },
    "& .MuiFormLabel-root": {
        fontSize: "0.95rem",
        fontWeight: 500,
    },
    "& .MuiInputBase-input": {
        paddingLeft: "8px",
    },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
        borderRadius: 12,
        transition: "all 0.3s ease",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        height: 50,
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
        },
        "&.Mui-focused": {
            backgroundColor: "rgba(255, 255, 255, 0.98)",
        },
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(33, 150, 243, 0.3)",
    },
    "& .MuiFormLabel-root": {
        fontSize: "0.95rem",
        fontWeight: 500,
    },
    "& .MuiSelect-select": {
        display: "flex",
        alignItems: "center",
        paddingLeft: "8px",
    },
    "& .MuiInputAdornment-root": {
        marginRight: theme.spacing(1),
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
        color: theme.palette.primary.main,
        fontSize: 20,
    },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: 12,
        transition: "all 0.3s ease",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        minHeight: 50,
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
        },
        "&.Mui-focused": {
            backgroundColor: "rgba(255, 255, 255, 0.98)",
        },
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(33, 150, 243, 0.3)",
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
        color: theme.palette.primary.main,
        fontSize: 20,
    },
}));

const AddButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    height: "100%",
    minWidth: 40,
    borderRadius: 8,
    background: "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
    color: "white",
    boxShadow: "0 2px 8px rgba(33, 150, 243, 0.2)",
    "&:hover": {
        background: "linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)",
    },
}));

// Designation options (from AddEmployeeDrawer)
const DESIGNATION_OPTIONS = [
    // HR Role Designations
    "HR Manager",
    "HR Assistant",
    "HR Director",
    "HR Specialist",
    "HR Coordinator",
    "HR Consultant",
    "HR Administrator",
    // Employee Role Designations
    "Project Manager",
    "Product Manager",
    "Operations Manager",
    "Department Manager",
    "Technical Manager",
    "Team Lead",
    "Engineering Manager",
    "Software Developer",
    "Senior Developer",
    "UI/UX Designer",
    "QA Engineer",
    "DevOps Engineer",
    "Data Analyst",
    "System Administrator",
    "Frontend Developer",
    "Backend Developer"
];

const DEFAULT_FORM_DATA = {
    name: '',
    organizationName: 'CKD VCS',
    organizationCode: '',
    email: '',
    manager: '',
    mobileNumber: '',
    password: 'Default@123',
    role: 'EMP',
    designation: '',
    empCode: '',
    empType: '',
};

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

// Tab panel component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`employee-tabpanel-${index}`}
            aria-labelledby={`employee-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

// Custom hooks for better separation of concerns
const useEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const organizationCode = localStorage.getItem('organizationCode');
            const response = await axios.get(
                `${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${organizationCode}`
            );
            setEmployees(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError(err.message);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { employees, loading, error, fetchEmployees };
};

// Hook for managing managers
const useManagers = () => {
    const [managers, setManagers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(false);
    
    const fetchManagers = useCallback(async (orgCode) => {
        if (!orgCode) return;
        setLoadingManagers(true);
        try {
            const response = await axios.get(
                `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${orgCode}`
            );
            if (response.data) {
                setManagers(response.data);
            }
        } catch (error) {
            console.error("Error fetching managers:", error);
            setManagers([]);
        } finally {
            setLoadingManagers(false);
        }
    }, []);
    
    useEffect(() => {
        const orgCode = localStorage.getItem('organizationCode');
        if (orgCode) {
            fetchManagers(orgCode);
        }
    }, [fetchManagers]);
    
    return { managers, loadingManagers, fetchManagers };
};

const useSnackbar = () => {
    const [snackbar, setSnackbar] = useState({ 
        open: false, 
        message: '', 
        severity: 'success' 
    });

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const hideSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    return { snackbar, showSnackbar, hideSnackbar };
};

// Enhanced Validation utilities
const validatePhoneNumber = (number) => {
    if (!number) return 'Mobile Number is required';
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number) ? '' : 'Mobile Number should be 10 digits starting with 6-9';
};

const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
};

const validateRequired = (value, fieldName) => {
    return !value?.trim() ? `${fieldName} is required` : '';
};

const validateForm = (formData) => {
    const errors = {};
    
    // Required field validation
    errors.name = validateRequired(formData.name, 'Full Name');
    errors.empCode = validateRequired(formData.empCode, 'Employee Code');
    errors.designation = validateRequired(formData.designation, 'Designation');
    errors.manager = validateRequired(formData.manager, 'Manager');
    errors.empType = validateRequired(formData.empType, 'Employee Type');
    
    // Specific field validation
    errors.email = validateEmail(formData.email);
    errors.mobileNumber = validatePhoneNumber(formData.mobileNumber);
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
        if (!errors[key]) delete errors[key];
    });
    
    return errors;
};

// Table skeleton loader component
const TableSkeleton = () => (
    <TableBody>
        {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
                {[...Array(7)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                        <Skeleton variant="text" height={24} />
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </TableBody>
);

const OfferLetterPending = () => {
    // State management
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    
    // Additional state for enhanced functionality
    const [designationOptions, setDesignationOptions] = useState(DESIGNATION_OPTIONS);
    const [openDesignationDialog, setOpenDesignationDialog] = useState(false);
    const [newDesignation, setNewDesignation] = useState('');
    const [newDesignationError, setNewDesignationError] = useState('');

    // Custom hooks
    const { employees, loading, error, fetchEmployees } = useEmployees();
    const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
    const { managers, loadingManagers } = useManagers();

    // Effects
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0); // Reset to first page when changing tabs
    };

    // Memoized filtered and paginated data
    const filteredEmployees = useMemo(() => {
        if (!employees.length) return [];
        
        let filtered = [];
        if (tabValue === 0) {
            // Onboarding candidates (NEW status)
            filtered = employees.filter(emp => emp.current === 'NEW');
        } else if (tabValue === 1) {
            // Rejected candidates (REJECTED status)
            filtered = employees.filter(emp => emp.current === 'REJECTED');
        }
        
        if (!searchTerm.trim()) return filtered;
        
        const term = searchTerm.toLowerCase();
        return filtered.filter(emp => 
            emp.name?.toLowerCase().includes(term) ||
            emp.empCode?.toLowerCase().includes(term) ||
            emp.personalEmail?.toLowerCase().includes(term) ||
            emp.designation?.toLowerCase().includes(term)
        );
    }, [employees, searchTerm, tabValue]);

    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredEmployees.slice(start, start + rowsPerPage);
    }, [filteredEmployees, page, rowsPerPage]);

    // Event handlers
    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page when searching
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        setPage(0);
    }, []);

    const handleOnboardClick = useCallback((emp) => {
        setSelectedEmployee(emp);
        setFormData({
            ...DEFAULT_FORM_DATA,
            name: emp.name || '',
            organizationName: localStorage.getItem('organizationName') || '',
            organizationCode: localStorage.getItem('organizationCode') || '',
            email: emp.officialEmail?.startsWith('officialEmail') ? '' : emp.officialEmail || '',
            mobileNumber: emp.primaryPhone || '',
            designation: emp.designation || emp.position || '',
            empCode: emp.empCode || '',
        });
        setFormErrors({});
        setOpenDialog(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog(false);
        setSelectedEmployee(null);
        setFormData(DEFAULT_FORM_DATA);
        setFormErrors({});
        setSubmitting(false);
        // Reset designation dialog state
        setOpenDesignationDialog(false);
        setNewDesignation('');
        setNewDesignationError('');
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Real-time validation for specific fields
        let error = '';
        if (name === 'mobileNumber') {
            error = validatePhoneNumber(value);
        } else if (name === 'email') {
            error = validateEmail(value);
        } else if (['name', 'empCode', 'designation', 'manager', 'empType'].includes(name)) {
            error = validateRequired(value, name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'));
        }

        setFormErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }, []);
    
    // Handle designation change from Autocomplete
    const handleDesignationChange = useCallback((event, newValue) => {
        setFormData(prev => ({ ...prev, designation: newValue || "" }));
        const error = validateRequired(newValue, 'Designation');
        setFormErrors(prev => ({ ...prev, designation: error }));
    }, []);
    
    // Handle manager change from Autocomplete
    const handleManagerChange = useCallback((event, newValue) => {
        setFormData(prev => ({ ...prev, manager: newValue ? newValue.email : "" }));
        const error = validateRequired(newValue ? newValue.email : '', 'Manager');
        setFormErrors(prev => ({ ...prev, manager: error }));
    }, []);
    
    // Handle designation dialog
    const handleOpenDesignationDialog = useCallback(() => {
        setOpenDesignationDialog(true);
        setNewDesignation("");
        setNewDesignationError("");
    }, []);
    
    const handleCloseDesignationDialog = useCallback(() => {
        setOpenDesignationDialog(false);
    }, []);
    
    const handleAddDesignation = useCallback(() => {
        if (!newDesignation.trim()) {
            setNewDesignationError("Designation cannot be empty");
            return;
        }

        if (designationOptions.includes(newDesignation.trim())) {
            setNewDesignationError("This designation already exists");
            return;
        }

        // Add new designation to options
        setDesignationOptions(prev => [...prev, newDesignation.trim()]);
        // Set it as the current selection
        setFormData(prev => ({ ...prev, designation: newDesignation.trim() }));
        // Close dialog
        setOpenDesignationDialog(false);
    }, [newDesignation, designationOptions]);
    
    // Filter designations based on role (like AddEmployeeDrawer)
    const getFilteredDesignations = useCallback(() => {
        if (!formData.role) return designationOptions;
        
        switch (formData.role) {
            case "HR":
                return designationOptions.filter(d => 
                    d.toLowerCase().includes("hr") || 
                    ["director", "coordinator", "specialist", "consultant", "administrator"].some(term => 
                        d.toLowerCase().includes(term)
                    )
                );
            case "EMP":
                return designationOptions.filter(d => 
                    !d.toLowerCase().includes("hr")
                );
            default:
                return designationOptions;
        }
    }, [formData.role, designationOptions]);

    const validateFormSubmission = useCallback(() => {
        const errors = validateForm(formData);
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const handleRejectCandidate = useCallback(async (emp) => {
        try {
            await axios.get(`${base_identity}/identity-handler/details/onboard-candidate?empCode=${emp.empCode}&email=''&status=REJECTED`);
            showSnackbar('Candidate rejected successfully!', 'success');
            fetchEmployees(); // Refresh the list
        } catch (error) {
            console.error('Failed to reject candidate:', error);
            showSnackbar('Failed to reject candidate! Please try again.', 'error');
        }
    }, [fetchEmployees, showSnackbar]);

    const handleFormSubmit = useCallback(async () => {

        console.log("Submitting form dataiiiiiiiiiiiiiiiiiiiii:");
        if (!validateFormSubmission()) {
            showSnackbar('Please fix all errors before submitting.', 'warning');
            return;
        }

        setSubmitting(true);
           console.log("Submitting form yyyyyyyyyyyyyyyyyyyyyyyyyyy:");
        try {
            const userData = await axios.post(
                `${base_identity}/identity-handler/create/create-existing-user`, 
                formData
            );
            showSnackbar('Employee onboarded successfully!', 'success');
            
            await axios.get(`${base_identity}/identity-handler/details/onboard-candidate?empCode=${userData.empCode}&email=${formData.email}&status=EXIST`);
            
            fetchEmployees(); // Refresh the list
            handleCloseDialog();
        } catch (err) {
            console.error('Failed to onboard employee:', err);
            showSnackbar(
                err.response?.data?.message || 'Failed to onboard employee! Please try again.', 
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    }, [formData, validateFormSubmission, showSnackbar, handleCloseDialog, fetchEmployees]);

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const formatDate = useCallback((dateString) => {
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit", 
            year: "numeric",
        }).format(new Date(dateString));
    }, []);

    if (error) {
        return (
            <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Card sx={{ p: 3, textAlign: 'center', maxWidth: 400 }}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Error Loading Data
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                        {error}
                    </Typography>
                    <Button variant="contained" onClick={fetchEmployees}>
                        Retry
                    </Button>
                </Card>
            </Box>
        );
    }

    return (
        <Box p={2} sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <BackButton />
            
            {/* Header Section */}
            <Card sx={{ mb: 3, borderRadius: 3, backgroundColor: '#f8f9fa', boxShadow: 'none' }}>
                <CardContent sx={{ p: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700, 
                                color: '#1e293b',
                                mb: 1
                            }}>
                                Employee Onboarding
                            </Typography>
                        </Box>
                        <Chip 
                            label={`${filteredEmployees.length} ${tabValue === 0 ? 'Pending' : 'Rejected'}`}
                            color={tabValue === 0 ? 'primary' : 'error'}
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>

                    {/* Search Bar */}
                    <TextField
                        fullWidth
                        placeholder="Search by name, employee code, email, or designation..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <Button
                                        size="small"
                                        onClick={handleClearSearch}
                                        sx={{ minWidth: 'auto', p: 0.5 }}
                                    >
                                        <ClearIcon fontSize="small" />
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: '#fff',
                                width: '60%',
                                '&:hover fieldset': {
                                    borderColor: '#3f51b5',
                                },
                            }
                        }}
                    />
                </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="employee tabs">
                        <Tab 
                            icon={<OnboardedIcon />} 
                            iconPosition="start"
                            label="Onboarding Candidates" 
                            sx={{ fontWeight: 600, py: 2, minHeight: '64px' }} 
                        />
                        <Tab 
                            icon={<RejectedIcon />} 
                            iconPosition="start"
                            label="Rejected Candidates" 
                            sx={{ fontWeight: 600, py: 2, minHeight: '64px' }} 
                        />
                    </Tabs>
                </Box>

                {/* Onboarding Candidates Tab */}
                <TabPanel value={tabValue} index={0}>
                    {loading ? (
                        <Box p={3}>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#3f51b5' }}>
                                        <TableRow>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>S.No</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee Code</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Full Name</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Personal Email</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Designation</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Offer Date</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableSkeleton />
                                </Table>
                            </TableContainer>
                        </Box>
                    ) : (
                        <Fade in={!loading}>
                            <Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: '#3f51b5' }}>
                                            <TableRow>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, width: 80 }}>S.No</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee Code</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Full Name</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Personal Email</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Designation</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Offer Date</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center', width: 120 }}>OnBoard</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center', width: 120 }}>Reject</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedData.length > 0 ? (
                                                paginatedData.map((emp, index) => (
                                                    <TableRow 
                                                        key={emp.id || emp.empCode} 
                                                        hover 
                                                        sx={{ 
                                                            '&:nth-of-type(odd)': { backgroundColor: '#f8f9ff' },
                                                            '&:hover': { backgroundColor: '#e3f2fd' }
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            {page * rowsPerPage + index + 1}
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <BadgeIcon fontSize="small" color="action" />
                                                                {emp.empCode}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <PersonIcon fontSize="small" color="action" />
                                                                {emp.name}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <EmailIcon fontSize="small" color="action" />
                                                                {emp.personalEmail}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <BusinessIcon fontSize="small" color="action" />
                                                                {emp.designation}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            {emp.offerDate ? formatDate(emp.offerDate) : 'N/A'}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleOnboardClick(emp)}
                                                                sx={{ 
                                                                    backgroundColor: '#10b981',
                                                                    '&:hover': { backgroundColor: '#059669' },
                                                                    borderRadius: 2,
                                                                    textTransform: 'none',
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                Onboard
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                size="small"
                                                                onClick={() => handleRejectCandidate(emp)}
                                                                sx={{ 
                                                                    borderRadius: 2,
                                                                    textTransform: 'none',
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                                        <Box textAlign="center">
                                                            <PersonIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
                                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                                {searchTerm ? 'No matching employees found' : 'No new employees to onboard'}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {searchTerm ? 'Try adjusting your search criteria' : 'Check back later for new candidates'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <TablePagination
                                    component="div"
                                    count={filteredEmployees.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                                    sx={{
                                        borderTop: '1px solid #e5e7eb',
                                        '& .MuiTablePagination-toolbar': {
                                            paddingX: 3
                                        }
                                    }}
                                />
                            </Box>
                        </Fade>
                    )}
                </TabPanel>

                {/* Rejected Candidates Tab */}
                <TabPanel value={tabValue} index={1}>
                    {loading ? (
                        <Box p={3}>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#d32f2f' }}>
                                        <TableRow>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>S.No</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee Code</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Full Name</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Personal Email</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Designation</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Offer Date</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Rejection Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableSkeleton />
                                </Table>
                            </TableContainer>
                        </Box>
                    ) : (
                        <Fade in={!loading}>
                            <Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: '#d32f2f' }}>
                                            <TableRow>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, width: 80 }}>S.No</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee Code</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Full Name</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Personal Email</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Designation</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Offer Date</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Rejection Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedData.length > 0 ? (
                                                paginatedData.map((emp, index) => (
                                                    <TableRow 
                                                        key={emp.id || emp.empCode} 
                                                        hover 
                                                        sx={{ 
                                                            '&:nth-of-type(odd)': { backgroundColor: '#fff5f5' },
                                                            '&:hover': { backgroundColor: '#ffe4e6' }
                                                        }}
                                                    >
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            {page * rowsPerPage + index + 1}
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <BadgeIcon fontSize="small" color="action" />
                                                                {emp.empCode}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <PersonIcon fontSize="small" color="action" />
                                                                {emp.name}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <EmailIcon fontSize="small" color="action" />
                                                                {emp.personalEmail}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <BusinessIcon fontSize="small" color="action" />
                                                                {emp.designation}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            {emp.offerDate ? formatDate(emp.offerDate) : 'N/A'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {emp.rejectionDate ? formatDate(emp.rejectionDate) : 'N/A'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                                        <Box textAlign="center">
                                                            <RejectedIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
                                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                                {searchTerm ? 'No matching rejected employees found' : 'No rejected employees'}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {searchTerm ? 'Try adjusting your search criteria' : 'All candidates are currently in process'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <TablePagination
                                    component="div"
                                    count={filteredEmployees.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                                    sx={{
                                        borderTop: '1px solid #e5e7eb',
                                        '& .MuiTablePagination-toolbar': {
                                            paddingX: 3
                                        }
                                    }}
                                />
                            </Box>
                        </Fade>
                    )}
                </TabPanel>
            </Card>

            {/* Onboarding Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ 
                    fontWeight: 700, 
                    backgroundColor: '#3f51b5', 
                    color: 'white',
                    fontSize: '1.25rem'
                }}>
                    Onboard New Employee
                </DialogTitle>
                <DialogContent dividers sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField 
                                label="Full Name" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={6}>
                            <StyledTextField 
                                label="Employee Code" 
                                name="empCode" 
                                value={formData.empCode} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required
                                error={!!formErrors.empCode}
                                helperText={formErrors.empCode}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid> */}
                        <Grid item xs={12} sm={6}>
                            <StyledTextField 
                                label="Organization Name" 
                                name="organizationName" 
                                value={formData.organizationName} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BusinessIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField 
                                label="Organization Code" 
                                name="organizationCode" 
                                value={formData.organizationCode} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                         <Grid item xs={12} sm={6}>
                            <StyledTextField
                                label="Mobile Number"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                error={!!formErrors.mobileNumber}
                                helperText={formErrors.mobileNumber}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                       <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField 
                                label="Official Email" 
                                placeholder="Enter official email" 
                                name="email" 
                                type="email"
                                value={formData.email} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <StyledAutocomplete
                                    fullWidth
                                    id="designation-select"
                                    options={getFilteredDesignations()}
                                    value={formData.designation}
                                    onChange={handleDesignationChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Designation"
                                            error={!!formErrors.designation}
                                            helperText={formErrors.designation}
                                            required
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <BadgeIcon />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                    freeSolo
                                    clearOnBlur={false}
                                />
                                <AddButton
                                    variant="contained"
                                    onClick={handleOpenDesignationDialog}
                                    title="Add Custom Designation"
                                >
                                    <AddIcon />
                                </AddButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledAutocomplete
                                fullWidth
                                id="manager-select"
                                options={managers}
                                value={managers.find(m => m.email === formData.manager) || null}
                                onChange={handleManagerChange}
                                getOptionLabel={(option) => option.email || ''}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Manager"
                                        placeholder="Search by email"
                                        error={!!formErrors.manager}
                                        helperText={formErrors.manager}
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                    {params.InputProps.startAdornment}
                                                </>
                                            )
                                        }}
                                    />
                                )}
                                loading={loadingManagers}
                                loadingText="Loading managers..."
                                noOptionsText="No managers found"
                                disabled={loadingManagers}
                            />
                        </Grid>
                       
                        <Grid item xs={12} sm={6}>
                            <StyledFormControl fullWidth error={!!formErrors.empType}>
                                <InputLabel id="empType-label">Employee Type</InputLabel>
                                <Select
                                    labelId="empType-label"
                                    name="empType"
                                    value={formData.empType}
                                    onChange={handleInputChange}
                                    label="Employee Type"
                                    required
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <BadgeIcon />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select Employee Type</em>
                                    </MenuItem>
                                    {EMPLOYEE_TYPES.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.empType && <FormHelperText>{formErrors.empType}</FormHelperText>}
                            </StyledFormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button 
                        onClick={handleCloseDialog} 
                        variant="outlined"
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            minWidth: 100
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleFormSubmit}
                        disabled={submitting}
                        sx={{ 
                            backgroundColor: '#10b981',
                            '&:hover': { backgroundColor: '#059669' },
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            minWidth: 120
                        }}
                    >
                        {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for adding custom designation */}
            <Dialog 
                open={openDesignationDialog} 
                onClose={handleCloseDesignationDialog}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">Add Custom Designation</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <StyledTextField
                        fullWidth
                        label="Designation Name"
                        value={newDesignation}
                        onChange={(e) => setNewDesignation(e.target.value)}
                        error={!!newDesignationError}
                        helperText={newDesignationError}
                        sx={{ mt: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BadgeIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDesignationDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddDesignation}
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        Add Designation
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={hideSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={hideSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ 
                        width: '100%',
                        borderRadius: 2,
                        fontWeight: 500
                    }} 
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OfferLetterPending;