// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Avatar,
//   Typography,
//   Box,
//   CircularProgress,
//   Chip,
//   IconButton,
//   Divider,
//   useTheme,
//   Checkbox,
//   Tooltip,
//   Paper,
//   Fade,
//   Badge,
//   TextField,
//   InputAdornment,
//   Alert,
//   Snackbar
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Assignment as AssignmentIcon,
//   Business as BusinessIcon,
//   CheckCircle as CheckCircleIcon,
//   AssignmentInd as AssignmentIndIcon,
//   Search as SearchIcon,
//   FilterList as FilterListIcon,
//   Clear as ClearIcon
// } from '@mui/icons-material';
// import { base_identity } from '../../../http/services';

// const MemberDetailsDialog = ({ open, handleClose, organizationCode = 'CKD%20', member, onAssignSuccess }) => {
//   const theme = useTheme();
//   const [members, setMembers] = useState([]);
//   const [filteredMembers, setFilteredMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [assignLoading, setAssignLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [successMessage, setSuccessMessage] = useState(false);

//   useEffect(() => {
//     const fetchMembers = async () => {
//       if (!open) return;
      
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem('organizationCode')}`,
//           {
//             headers: {
//               accept: '*/*'
//             }
//           }
//         );

//         const filtered = response.data.filter(m => m.empCode !== member?.empCode);
//         setMembers(filtered);
//         setFilteredMembers(filtered);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching members:', err);
//         setError('Failed to load members. Please try again later.');
//         setLoading(false);
//       }
//     };

//     fetchMembers();
//     // Reset selection when dialog opens
//     setSelectedMember(null);
//     setSearchQuery('');
//   }, [open, organizationCode]);

//   // Search functionality
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredMembers(members);
//       return;
//     }

//     const lowercaseQuery = searchQuery.toLowerCase();
//     const filtered = members.filter(member => 
//       member.name.toLowerCase().includes(lowercaseQuery) ||
//       member.email.toLowerCase().includes(lowercaseQuery) ||
//       member.empCode.toLowerCase().includes(lowercaseQuery)
//     );
//     setFilteredMembers(filtered);
//   }, [searchQuery, members]);

//   // Function to get initials from a name
//   const getInitials = (name) => {
//     return name
//       .split(' ')
//       .map(part => part[0])
//       .join('');
//   };

//   // Function to format date string
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     }).format(date);
//   };

//   const handleSelectMember = (empCode) => {

//     console.log(empCode)
//     setSelectedMember(empCode);
//   };

//   const handleAssign = async () => {
//     if (!selectedMember) return;
    
//     setAssignLoading(true);
    
//     try {
//       // Get the manager code from localStorage
//       const managerCode = selectedMember;
      
//       // Get the selected member's empCode
//       // const selectedMemberDetails = members.find(m => m.id === selectedMember);
//       const empCode = member?.empCode;



      
//       if (!managerCode || !empCode) {
//         throw new Error('Manager code or employee code not found');
//       }


//       console.log(selectedMember,"llllllllllllllllll");
      
//       // Call the API to assign manager
//       await axios.get(
//         `${base_identity}/identity-handler/auth/assign-manager?managerEmpCode=${managerCode}&empCode=${empCode}`,
//         {
//           headers: {
//             'accept': '*/*',
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       setSuccessMessage(true);
      
//       // Call the success callback to update parent component
//       if (onAssignSuccess && typeof onAssignSuccess === 'function') {
//         onAssignSuccess(empCode);
//       }
      
//       // Auto close after successful assignment (optional)
//       setTimeout(() => {
//         handleClose();
//       }, 2000);
//     } catch (err) {
//       console.error('Error assigning manager:', err);
//       setError('Failed to assign manager. Please try again.');
//     } finally {
//       setAssignLoading(false);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//   };

//   // Get selected member details
//   const selectedMemberDetails = selectedMember ? 
//     members.find(m => m.id === selectedMember) : null;

//   return (
//     <>
//       <Dialog 
//         open={open} 
//         onClose={handleClose}
//         fullWidth
//         maxWidth="md"
//         PaperProps={{
//           sx: {
//             borderRadius: 2,
//             overflow: 'hidden',
//             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
//           }
//         }}
//       >
//         <Box 
//           sx={{ 
//             p: 3, 
//             backgroundColor: theme.palette.primary.main,
//             color: 'white',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}
//         >
//           <Box>
//             <Typography variant="h6" fontWeight="bold">
//               Assign Application Manager
//             </Typography>
//             <Typography variant="subtitle2">
//               Organization: {decodeURIComponent(organizationCode)}
//             </Typography>
//           </Box>
//           <IconButton 
//             onClick={handleClose} 
//             sx={{ color: 'white' }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
//           <TextField
//             fullWidth
//             placeholder="Search by name, email, employee code or role..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             variant="outlined"
//             size="small"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon color="action" />
//                 </InputAdornment>
//               ),
//               endAdornment: searchQuery && (
//                 <InputAdornment position="end">
//                   <IconButton
//                     size="small"
//                     onClick={handleClearSearch}
//                     edge="end"
//                   >
//                     <ClearIcon fontSize="small" />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//               sx: { 
//                 borderRadius: 2,
//                 bgcolor: theme.palette.background.paper,
//                 '&:hover': {
//                   bgcolor: theme.palette.background.paper
//                 }
//               }
//             }}
//           />
//         </Box>
      
//         <DialogContent sx={{ p: 0, maxHeight: 'calc(100vh - 300px)' }}>
//           {loading ? (
//             <Box display="flex" justifyContent="center" alignItems="center" py={6}>
//               <CircularProgress size={40} />
//             </Box>
//           ) : error ? (
//             <Box display="flex" justifyContent="center" alignItems="center" p={4}>
//               <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
//             </Box>
//           ) : (
//             <>
//               {filteredMembers.length === 0 ? (
//                 <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
//                   <SearchIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, opacity: 0.4, mb: 2 }} />
//                   <Typography variant="body1" color="textSecondary">
//                     No members match your search criteria
//                   </Typography>
//                   <Button 
//                     startIcon={<ClearIcon />} 
//                     onClick={handleClearSearch} 
//                     sx={{ mt: 2 }}
//                   >
//                     Clear Search
//                   </Button>
//                 </Box>
//               ) : (
//                 <TableContainer>
//                   <Table stickyHeader>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
//                         <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
//                         <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
//                         <TableCell sx={{ fontWeight: 'bold', width: 80 }} align="center">Select</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredMembers.map((memberItem) => (
//                         <TableRow 
//                           key={memberItem.id} 
//                           hover
//                           onClick={() => handleSelectMember(memberItem.empCode)}
//                           sx={{ 
//                             '&:hover': { 
//                               backgroundColor: `${theme.palette.primary.light}10`
//                             },
//                             cursor: 'pointer',
//                             backgroundColor: memberItem.id === selectedMember ? 
//                               `${theme.palette.primary.light}20` : 'inherit',
//                             transition: 'background-color 0.15s ease-in-out'
//                           }}
//                         >
//                           <TableCell>
//                             <Box display="flex" alignItems="center">
//                               <Badge
//                                 overlap="circular"
//                                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                                 badgeContent={
//                                   memberItem.id === selectedMember ? 
//                                     <CheckCircleIcon 
//                                       sx={{ 
//                                         color: theme.palette.success.main,
//                                         backgroundColor: 'white',
//                                         borderRadius: '50%',
//                                         fontSize: 16
//                                       }} 
//                                     /> : null
//                                 }
//                               >
//                                 <Avatar 
//                                   sx={{ 
//                                     bgcolor: memberItem.id === selectedMember 
//                                       ? theme.palette.primary.main 
//                                       : theme.palette.primary.light,
//                                     color: 'white',
//                                     fontWeight: 'bold',
//                                     transition: 'all 0.2s ease'
//                                   }}
//                                 >
//                                   {getInitials(memberItem.name)}
//                                 </Avatar>
//                               </Badge>
//                               <Box ml={2}>
//                                 <Typography variant="body1" fontWeight="medium">
//                                   {memberItem.name}
//                                 </Typography>
//                                 <Typography variant="body2" color="textSecondary">
//                                   {memberItem.empCode}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box display="flex" alignItems="center" mb={0.5}>
//                               <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
//                               <Typography variant="body2">
//                                 {memberItem.email}
//                               </Typography>
//                             </Box>
//                             <Box display="flex" alignItems="center">
//                               <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
//                               <Typography variant="body2" color="textSecondary">
//                                 {memberItem.mobileNumber}
//                               </Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2" color="textSecondary">
//                               Emp #: {memberItem.empNumber}
//                             </Typography>
//                             <Typography variant="body2" color="textSecondary">
//                               Created: {formatDate(memberItem.createdAt)}
//                             </Typography>
//                           </TableCell>
//                           <TableCell align="center">
//                             <Checkbox
//                               checked={memberItem.id === selectedMember}
//                               onChange={() => handleSelectMember(memberItem.empCode)}
//                               color="primary"
//                               sx={{ 
//                                 '& .MuiSvgIcon-root': { 
//                                   fontSize: 24,
//                                   transition: 'transform 0.2s',
//                                   transform: memberItem.id === selectedMember ? 'scale(1.2)' : 'scale(1)'
//                                 }
//                               }}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </>
//           )}
//         </DialogContent>
        
//         <Divider />
        
//         <DialogActions sx={{ px: 3, py: 2, bgcolor: theme.palette.background.paper }}>
//           <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
//             <Box>
//               {selectedMemberDetails && (
//                 <Box sx={{ 
//                   display: 'flex', 
//                   alignItems: 'center',
//                   p: 1,
//                   borderRadius: 1,
//                   bgcolor: `${theme.palette.primary.light}10`,
//                 }}>
//                   <Avatar 
//                     sx={{ 
//                       bgcolor: theme.palette.primary.main,
//                       color: 'white',
//                       width: 32,
//                       height: 32,
//                       fontSize: '0.875rem'
//                     }}
//                   >
//                     {getInitials(selectedMemberDetails.name)}
//                   </Avatar>
//                   <Box ml={1}>
//                     <Typography variant="body2" fontWeight="medium">
//                       {selectedMemberDetails.name}
//                     </Typography>
//                   </Box>
//                 </Box>
//               )}
//             </Box>
//             <Box>
//               <Button 
//                 onClick={handleClose}
//                 variant="outlined" 
//                 color="inherit"
//                 startIcon={<CloseIcon />}
//                 sx={{ 
//                   borderRadius: 2,
//                   textTransform: 'none',
//                   mr: 2
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleAssign}
//                 variant="contained" 
//                 color="primary"
//                 disabled={!selectedMember || assignLoading}
//                 startIcon={assignLoading ? <CircularProgress size={16} color="inherit" /> : <AssignmentIndIcon />}
//                 sx={{ 
//                   borderRadius: 2,
//                   textTransform: 'none',
//                   px: 3
//                 }}
//               >
//                 Assign as Manager
//               </Button>
//             </Box>
//           </Box>
//         </DialogActions>
//       </Dialog>

//       {/* Success Snackbar - Fixed anchorOrigin */}
//       <Snackbar
//         open={successMessage}
//         autoHideDuration={3000}
//         onClose={() => setSuccessMessage(false)}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert
//           severity="success"
//           variant="filled"
//           sx={{ width: '100%' }}
//           icon={<CheckCircleIcon />}
//         >
//           {selectedMemberDetails?.name} successfully assigned as Application Manager
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default MemberDetailsDialog; 






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  Divider,
  useTheme,
  Checkbox,
  Tooltip,
  Paper,
  Fade,
  Badge,
  TextField,
  InputAdornment,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  AssignmentInd as AssignmentIndIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { base_identity } from '../../../http/services';

const MemberDetailsDialog = ({ open, handleClose, organizationCode = 'CKD%20', member, onAssignSuccess }) => {
  const theme = useTheme();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem('organizationCode')}`,
          {
            headers: {
              accept: '*/*'
            }
          }
        );

        const filtered = response.data.filter(m => m.empCode !== member?.empCode);
        setMembers(filtered);
        setFilteredMembers(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Failed to load members. Please try again later.');
        setLoading(false);
      }
    };

    fetchMembers();
    // Reset selection when dialog opens
    setSelectedMember(null);
    setSearchQuery('');
  }, [open, organizationCode]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = members.filter(member => 
      member.name.toLowerCase().includes(lowercaseQuery) ||
      member.email.toLowerCase().includes(lowercaseQuery) ||
      member.empCode.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  // Function to get initials from a name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  };

  // Function to format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleSelectMember = (memberId) => {
    setSelectedMember(memberId === selectedMember ? null : memberId);
  };

  const handleAssign = async () => {
    if (!selectedMember) return;
    
    setAssignLoading(true);
    
    try {
      // Get the manager code from localStorage
      const managerCode = selectedMember;
      
      // Get the selected member's empCode
      // const selectedMemberDetails = members.find(m => m.id === selectedMember);
      const empCode = member?.empCode;



      console.log(managerCode,";;;;;;;;;;;;;;;");



      
      if (!managerCode || !empCode) {
        throw new Error('Manager code or employee code not found');
      }
      
      // Call the API to assign manager
      await axios.get(
        `${base_identity}/identity-handler/auth/assign-manager?managerEmpCode=${managerCode}&empCode=${empCode}`,
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccessMessage(true);
      
      // Call the success callback to update parent component
      if (onAssignSuccess && typeof onAssignSuccess === 'function') {
        onAssignSuccess(empCode);
      }
      
      // Auto close after successful assignment (optional)
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Error assigning manager:', err);
      setError('Unable to Assign this Manager');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Get selected member details
  const selectedMemberDetails = selectedMember ? 
    members.find(m => m.id === selectedMember) : null;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Assign Application Manager
            </Typography>
            <Typography variant="subtitle2">
              Organization: {decodeURIComponent(organizationCode)}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <TextField
            fullWidth
            placeholder="Search by name, email, employee code or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                  bgcolor: theme.palette.background.paper
                }
              }
            }}
          />
        </Box>
      
        <DialogContent sx={{ p: 0, maxHeight: 'calc(100vh - 300px)' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={6}>
              <CircularProgress size={40} />
            </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
            </Box>
          ) : (
            <>
              {filteredMembers.length === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
                  <SearchIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, opacity: 0.4, mb: 2 }} />
                  <Typography variant="body1" color="textSecondary">
                    No members match your search criteria
                  </Typography>
                  <Button 
                    startIcon={<ClearIcon />} 
                    onClick={handleClearSearch} 
                    sx={{ mt: 2 }}
                  >
                    Clear Search
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 80 }} align="center">Select</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMembers.map((memberItem) => (
                        <TableRow 
                          key={memberItem.id} 
                          hover
                          onClick={() => handleSelectMember(memberItem.id)}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: `${theme.palette.primary.light}10`
                            },
                            cursor: 'pointer',
                            backgroundColor: memberItem.id === selectedMember ? 
                              `${theme.palette.primary.light}20` : 'inherit',
                            transition: 'background-color 0.15s ease-in-out'
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                  memberItem.id === selectedMember ? 
                                    <CheckCircleIcon 
                                      sx={{ 
                                        color: theme.palette.success.main,
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        fontSize: 16
                                      }} 
                                    /> : null
                                }
                              >
                                <Avatar 
                                  sx={{ 
                                    bgcolor: memberItem.id === selectedMember 
                                      ? theme.palette.primary.main 
                                      : theme.palette.primary.light,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  {getInitials(memberItem.name)}
                                </Avatar>
                              </Badge>
                              <Box ml={2}>
                                <Typography variant="body1" fontWeight="medium">
                                  {memberItem.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {memberItem.empCode}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" mb={0.5}>
                              <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {memberItem.email}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2" color="textSecondary">
                                {memberItem.mobileNumber}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="textSecondary">
                              Emp #: {memberItem.empNumber}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Created: {formatDate(memberItem.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              checked={memberItem.empCode === selectedMember}
                              onChange={() => handleSelectMember(memberItem.empCode)}
                              color="primary"
                              sx={{ 
                                '& .MuiSvgIcon-root': { 
                                  fontSize: 24,
                                  transition: 'transform 0.2s',
                                  transform: memberItem.empCode === selectedMember ? 'scale(1.2)' : 'scale(1)'
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ px: 3, py: 2, bgcolor: theme.palette.background.paper }}>
          <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
            <Box>
              {selectedMemberDetails && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: `${theme.palette.primary.light}10`,
                }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      width: 32,
                      height: 32,
                      fontSize: '0.875rem'
                    }}
                  >
                    {getInitials(selectedMemberDetails.name)}
                  </Avatar>
                  <Box ml={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {selectedMemberDetails.name}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            <Box>
              <Button 
                onClick={handleClose}
                variant="outlined" 
                color="inherit"
                startIcon={<CloseIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  mr: 2
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAssign}
                variant="contained" 
                color="primary"
                disabled={!selectedMember || assignLoading}
                startIcon={assignLoading ? <CircularProgress size={16} color="inherit" /> : <AssignmentIndIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Assign as Manager
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar - Fixed anchorOrigin */}
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
          icon={<CheckCircleIcon />}
        >
          {selectedMemberDetails?.name} successfully assigned as Application Manager
        </Alert>
      </Snackbar>
    </>
  );
};

export default MemberDetailsDialog; 