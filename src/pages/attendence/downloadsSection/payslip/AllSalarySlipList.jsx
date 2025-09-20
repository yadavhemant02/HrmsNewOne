// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   CircularProgress,
//   Alert,
//   IconButton,
//   Tooltip,
//   useTheme,
//   alpha,
//   styled
// } from '@mui/material';
// import DownloadIcon from '@mui/icons-material/Download';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import axios from 'axios';
// import { base_hr } from '../../../../http/services';
// // import ViewSalarySlip from './ViewSalarySlip';

// // Styled components
// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
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

// const StyledTableHead = styled(TableHead)(({ theme }) => ({
 
//   '& .MuiTableCell-head': {
//     color: "white",
//     fontWeight: 600,
//     fontSize: '0.875rem',
//     whiteSpace: 'nowrap',
//     position: 'sticky',
//     top: 0,
//   backgroundColor:" #4372C8",
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

// const ActionButton = styled(Button)(({ theme, color }) => ({
//   borderRadius: 8,
//   textTransform: 'none',
//   fontWeight: 500,
//   padding: '6px 16px',
//   backgroundColor: alpha(theme.palette.primary.main, 0.05),
//   color: theme.palette.primary.main,
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.primary.main, 0.15),
//   },
//   '& .MuiButton-startIcon': {
//     marginRight: 6,
//   },
// }));

// const DownloadButton = styled(ActionButton)(({ theme }) => ({
//   backgroundColor: alpha(theme.palette.success.main, 0.1),
//   color: theme.palette.success.main,
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.success.main, 0.2),
//   },
// }));

// const BackButton = styled(Button)(({ theme }) => ({
//   borderRadius: 8,
//   textTransform: 'none',
//   fontWeight: 600,
//   padding: '8px 16px',
//   backgroundColor: alpha(theme.palette.primary.main, 0.05),
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
//   minHeight: 200,
// }));

// const AllSalarySlipList = () => {
//   const theme = useTheme();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [empCode, setEmpCode] = useState('');
//   const [slips, setSlips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSlip, setSelectedSlip] = useState(null);
//   const [viewDialogOpen, setViewDialogOpen] = useState(false);

// //   useEffect(() => {
// //     let code = '';
// //     if (location.state && location.state.slipData && location.state.slipData.empCode) {
// //       code = location.state.slipData.empCode;
// //     } else if (location.state && location.state.empCode) {
// //       code = location.state.empCode;
// //     }
// //     setEmpCode(code);
// //     if (code) {
// //       fetchSlips(code);
// //     } else {
// //       setLoading(false);
// //       setError('No employee code provided.');
// //     }
// //     // eslint-disable-next-line
// //   }, [location.state]);

// const code = localStorage.getItem("empCode");

//   const fetchSlips = async (code) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`${base_hr}/hr-handler/api/payslip/get-all-salaryslip-of-emp?empCode=${code}`);
//       if (response.data && response.data.result) {
//         setSlips(response.data.result);
//       } else {
//         setSlips([]);
//       }
//     } catch (err) {
//       setError('Failed to fetch salary slips.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async (payslipId, date) => {
//     try {
//       const response = await axios.get(
//         `${base_hr}/hr-handler/api/payslip/get-payslip/of-an-espesific-month?payslipId=${payslipId}`,
//         { responseType: 'blob' }
//       );
//       const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `Salary_Slip_${date}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert('Failed to download salary slip.');
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const handleViewSalarySlip = (slip) => {
//     setSelectedSlip(slip);
//     setViewDialogOpen(true);
//   };

//   const handleCloseViewDialog = () => {
//     setViewDialogOpen(false);
//     setSelectedSlip(null);
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <BackButton
//           variant="text"
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate(-1)}
//         >
//           Back to Employee List
//         </BackButton>
//       </Box>

//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" fontWeight={600} gutterBottom>
//           Salary Slip History
//         </Typography>
//         <Typography variant="subtitle1" color="text.secondary">
//           View and download salary slips for employee code: {empCode}
//         </Typography>
//       </Box>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
//           <CircularProgress sx={{ color: theme.palette.primary.main }} />
//         </Box>
//       ) : error ? (
//         <Alert 
//           severity="error" 
//           sx={{ 
//             borderRadius: 2, 
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//             mb: 3
//           }}
//         >
//           {error}
//         </Alert>
//       ) : (
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             borderRadius: 3, 
//             overflow: 'hidden', 
//             border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
//             boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
//           }}
//         >
//           <StyledTableContainer>
//             <Table>
//               <StyledTableHead>
//                 <TableRow>
//                   <StyledTableCell>Month</StyledTableCell>
//                   <StyledTableCell>Generated Date</StyledTableCell>
//                   <StyledTableCell align="center">Actions</StyledTableCell>
//                 </TableRow>
//               </StyledTableHead>
//               <TableBody>
//                 {slips.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={3}>
//                       <EmptyStateContainer>
//                         <PictureAsPdfIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                         <Typography variant="h6" color="text.secondary" gutterBottom>
//                           No Salary Slips Found
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           There are no salary slips available for this employee.
//                         </Typography>
//                       </EmptyStateContainer>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   slips.map((slip) => (
//                     <StyledTableRow key={slip.payslipId}>
//                       <StyledTableCell sx={{ fontWeight: 500 }}>
//                         {formatDate(slip.generatedDate)}
//                       </StyledTableCell>
//                       <StyledTableCell>
//                         {formatDate(slip.generatedDate)}
//                       </StyledTableCell>
//                       <StyledTableCell align="center">
//                         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
//                           <ActionButton
//                             startIcon={<VisibilityIcon />}
//                             onClick={() => handleViewSalarySlip(slip)}
//                           >
//                             View Slip
//                           </ActionButton>
//                           <DownloadButton
//                             startIcon={<DownloadIcon />}
//                             onClick={() => handleDownload(slip.payslipId, slip.generatedDate)}
//                           >
//                             Download
//                           </DownloadButton>
//                         </Box>
//                       </StyledTableCell>
//                     </StyledTableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </StyledTableContainer>
//         </Paper>
//       )}

//       {viewDialogOpen && selectedSlip && (
//         <ViewSalarySlip
//           open={viewDialogOpen}
//           onClose={handleCloseViewDialog}
//           payslipId={selectedSlip.payslipId}
//         />
//       )}
//     </Box>
//   );
// };

// export default AllSalarySlipList;





import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import axios from 'axios';
import { base_hr } from '../../../../http/services';
import ViewSalarySlip from '../../../hrMonitor/generateLetter/payslip/ViewSalarySlip';
// import ViewSalarySlip from '';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
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
    color: "white",
    fontWeight: 600,
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    backgroundColor: " #4372C8",
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

const ActionButton = styled(Button)(({ theme, color }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  padding: '6px 16px',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
  },
  '& .MuiButton-startIcon': {
    marginRight: 6,
  },
}));

const DownloadButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  color: theme.palette.success.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.success.main, 0.2),
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
  minHeight: 200,
}));

const AllSalarySlipList = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [empCode, setEmpCode] = useState('');
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    let code = '';
    
    // First, try to get empCode from location state
    if (location.state && location.state.slipData && location.state.slipData.empCode) {
      code = location.state.slipData.empCode;
    } else if (location.state && location.state.empCode) {
      code = location.state.empCode;
    } else {
      // If not available in location state, get from localStorage
      code = localStorage.getItem("empCode");
    }
    
    setEmpCode(code);
    
    if (code) {
      fetchSlips(code);
    } else {
      setLoading(false);
      setError('No employee code provided.');
    }
  }, [location.state]);

  const fetchSlips = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${base_hr}/hr-handler/api/payslip/get-all-salaryslip-of-emp?empCode=${code}`);
      if (response.data && response.data.result) {
        setSlips(response.data.result);
      } else {
        setSlips([]);
      }
    } catch (err) {
      console.error('Error fetching salary slips:', err);
      setError('Failed to fetch salary slips.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (payslipId, date) => {
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/api/payslip/get-payslip/of-an-espesific-month?payslipId=${payslipId}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Salary_Slip_${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading salary slip:', err);
      alert('Failed to download salary slip.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewSalarySlip = (slip) => {
    setSelectedSlip(slip);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedSlip(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BackButton
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back to Employee List
        </BackButton>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Salary Slip History
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and download salary slips for employee code: {empCode}
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            mb: 3
          }}
        >
          {error}
        </Alert>
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <StyledTableContainer>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <StyledTableCell>Month</StyledTableCell>
                  <StyledTableCell>Generated Date</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {slips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <EmptyStateContainer>
                        <PictureAsPdfIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Salary Slips Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          There are no salary slips available for this employee.
                        </Typography>
                      </EmptyStateContainer>
                    </TableCell>
                  </TableRow>
                ) : (
                  slips.map((slip) => (
                    <StyledTableRow key={slip.payslipId}>
                      <StyledTableCell sx={{ fontWeight: 500 }}>
                        {formatDate(slip.generatedDate)}
                      </StyledTableCell>
                      <StyledTableCell>
                        {formatDate(slip.generatedDate)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                          <ActionButton
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewSalarySlip(slip)}
                          >
                            View Slip
                          </ActionButton>
                          <DownloadButton
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownload(slip.payslipId, slip.generatedDate)}
                          >
                            Download
                          </DownloadButton>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>
      )}

      {viewDialogOpen && selectedSlip && (
        <ViewSalarySlip
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          payslipId={selectedSlip.payslipId}
        />
      )}
    </Box>
  );
};

export default AllSalarySlipList;