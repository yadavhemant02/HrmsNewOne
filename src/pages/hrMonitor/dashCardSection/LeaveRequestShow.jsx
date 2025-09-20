// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   Chip,
//   Divider,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Avatar,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   TextField,
// } from "@mui/material";
// import {
//   CalendarMonth,
//   AccessTime,
//   Email,
//   Person,
//   Description,
//   EventAvailable,
//   EventBusy,
//   Cancel as CancelIcon,
//   Check as CheckIcon,
//   Close as CloseIcon,
//   ArrowBack,
// } from "@mui/icons-material";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { base_emp } from "../../../http/services";

// const LeaveRequestShow = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const leaveId = location.state?.leaveId;

//   const [leaveData, setLeaveData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");
//   const [cancelLoading, setCancelLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [approveDialogOpen, setApproveDialogOpen] = useState(false);
//   const [approveMessage, setApproveMessage] = useState("");
//   const [approveLoading, setApproveLoading] = useState(false);

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const updateStatus = () => {
//     setApproveDialogOpen(true);
//   };

//   const updateStatusForCancel = () => {
//     setCancelDialogOpen(true);
//   };

//   const handleCancelDialogClose = () => {
//     setCancelDialogOpen(false);
//     setCancelReason("");
//   };

//   const handleCancelConfirm = async () => {
//     setCancelLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("reason", cancelReason);
//       formData.append("leaveId", leaveId);
//       formData.append("status","CANCEL")
//       const response = await axios.post(
//         `${base_emp}/emp-handler/leave/cancel-leave/by-manager`,
//         formData
//       );
//       if (response.data?.status === 201) {
//         setSnackbar({ open: true, message: 'Leave cancelled successfully!', severity: 'success' });
//         window.location.reload();
//       } else {
//         throw new Error(response.data?.message || 'Operation failed');
//       }
//     } catch (error) {
//       setSnackbar({ open: true, message: 'Failed to cancel leave. Please try again.', severity: 'error' });
//       console.log(error);
//     } finally {
//       setCancelLoading(false);
//       setCancelDialogOpen(false);
//       setCancelReason("");
//     }
//   };


//    const handleApproveConfirm = async () => {
//     setCancelLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("reason", cancelReason);
//       formData.append("leaveId", leaveId);
//       formData.append("status","APPROVAL")
//       const response = await axios.post(
//         `${base_emp}/emp-handler/leave/cancel-leave/by-manager`,
//         formData
//       );
//       if (response.data?.status === 201) {
//         setSnackbar({ open: true, message: 'Leave cancelled successfully!', severity: 'success' });
//         window.location.reload();
//       } else {
//         throw new Error(response.data?.message || 'Operation failed');
//       }
//     } catch (error) {
//       setSnackbar({ open: true, message: 'Failed to cancel leave. Please try again.', severity: 'error' });
//       console.log(error);
//     } finally {
//       setCancelLoading(false);
//       setCancelDialogOpen(false);
//       setCancelReason("");
//     }
//   };

//   const handleApproveDialogClose = () => {
//     setApproveDialogOpen(false);
//     setApproveMessage("");
//   };


//   useEffect(() => {
//     const fetchLeaveDetails = async () => {
//       if (!leaveId) {
//         setError("Leave ID not found");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${base_emp}/emp-handler/leave/get-an-leave/of-emp?leaveId=${leaveId}`
//         );
//         if (response.data?.status === 201) {
//           setLeaveData(response.data.result);
//         }
//       } catch (error) {
//         setError("Failed to fetch leave details. Please try again later.");
//         console.error("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeaveDetails();
//   }, [leaveId]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const getStatusColor = (status) => {
//     const statusLower = status?.toLowerCase();
//     switch (statusLower) {
//       case "approved":
//         return { bg: "#e8f5e9", color: "#2e7d32", icon: <EventAvailable /> };
//       case "pending":
//         return { bg: "#fff3e0", color: "#e65100", icon: <AccessTime /> };
//       case "rejected":
//         return { bg: "#ffebee", color: "#c62828", icon: <EventBusy /> };
//       case "cencel":
//         return { bg: "#f3e5f5", color: "#6a1b9a", icon: <CancelIcon /> };
//       default:
//         return { bg: "#fff3e0", color: "#e65100", icon: <AccessTime /> };
//     }
//   };

//   if (!leaveId) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error">
//           Leave ID not found. Please select a leave request from the list.
//         </Alert>
//       </Box>
//     );
//   }

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="400px"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ m: 2 }}>
//         {error}
//       </Alert>
//     );
//   }

//   if (!leaveData) {
//     return (
//       <Alert severity="info" sx={{ m: 2 }}>
//         No leave details found.
//       </Alert>
//     );
//   }

//   const statusTheme = getStatusColor(leaveData.status);
//   const statusLower = leaveData?.status?.toLowerCase();
//   const isActionDisabled = statusLower === "approved" || statusLower === "cencel";

//   return (
//     <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
//       <Button
//         variant="outlined"
//         startIcon={<ArrowBack />}
//         onClick={handleBack}
//         sx={{ mb: 2, borderRadius: 2 }}
//       >
//         Back to List
//       </Button>
//       {/* Header Section */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 3,
//           borderRadius: 2,
//           background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
//           color: "white",
//         }}
//       >
//         <Grid container alignItems="center" spacing={2}>
//           <Grid item>
//             <Avatar
//               sx={{
//                 width: 64,
//                 height: 64,
//                 bgcolor: "#fff",
//                 color: "#1a237e",
//               }}
//             >
//               <Person sx={{ fontSize: 40 }} />
//             </Avatar>
//           </Grid>
//           <Grid item xs>
//             <Typography variant="h4" gutterBottom>
//               Leave Request Details
//             </Typography>
//             <Typography variant="subtitle1">
//               Leave ID: {leaveData.leaveId}
//             </Typography>
//           </Grid>
//           <Grid item>
//             <Chip
//               icon={statusTheme.icon}
//               label={leaveData.status}
//               sx={{
//                 bgcolor: statusTheme.bg,
//                 color: statusTheme.color,
//                 fontWeight: 600,
//                 "& .MuiChip-icon": {
//                   color: statusTheme.color,
//                 },
//               }}
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       <Grid container spacing={3}>
//         {/* Main Details */}
//         <Grid item xs={12} md={8}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: 2,
//               boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
//             }}
//           >
//             <CardContent>
//               <Typography variant="h6" gutterBottom color="primary">
//                 Leave Information
//               </Typography>
//               <Divider sx={{ mb: 3 }} />

//               <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Person sx={{ mr: 1, color: "primary.main" }} />
//                     <Box>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Employee Code
//                       </Typography>
//                       <Typography variant="body1">
//                         {leaveData.empCode}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Email sx={{ mr: 1, color: "primary.main" }} />
//                     <Box>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Leave Type
//                       </Typography>
//                       <Typography variant="body1">
//                         {leaveData.mailType}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Description sx={{ mr: 1, color: "primary.main" }} />
//                     <Box>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Subject
//                       </Typography>
//                       <Typography variant="body1">
//                         {leaveData.subject}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Box
//                     sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
//                   >
//                     <Description
//                       sx={{ mr: 1, color: "primary.main", mt: 0.5 }}
//                     />
//                     <Box>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Reason
//                       </Typography>
//                       <Typography variant="body1">
//                         {leaveData.reason}
//                       </Typography>
//                     </Box>

//                      <Box>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Action reason
//                       </Typography>
//                       <Typography variant="body1">
//                         {leaveData.actionReason}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Leave Duration Card */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ height: "100%", borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom color="primary">
//                 Leave Duration
//               </Typography>
//               <Divider sx={{ mb: 3 }} />

//               <Box sx={{ mb: 3 }}>
//                 <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                   <CalendarMonth sx={{ mr: 1, color: "primary.main" }} />
//                   <Box>
//                     <Typography variant="subtitle2" color="text.secondary">
//                       Start Date
//                     </Typography>
//                     <Typography variant="body1">
//                       {formatDate(leaveData.startData)}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                   <CalendarMonth sx={{ mr: 1, color: "primary.main" }} />
//                   <Box>
//                     <Typography variant="subtitle2" color="text.secondary">
//                       End Date
//                     </Typography>
//                     <Typography variant="body1">
//                       {formatDate(leaveData.endDate)}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>

//               <Box
//                 sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}
//               >
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Duration
//                 </Typography>
//                 <Typography variant="h6" color="primary">
//                   {leaveData.countDays}{" "}
//                   {leaveData.countDays === 1 ? "Day" : "Days"}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {leaveData.duration}
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Cancellation Reason */}
//         {['cencel', 'cancelled', 'cancel'].includes(leaveData.status?.toLowerCase()) && leaveData.cancelReason && (
//           <Grid item xs={12}>
//             <Box
//               sx={{
//                 mt: 2,
//                 p: 2,
//                 bgcolor: '#ffebee',
//                 borderRadius: 1,
//                 border: '1px solid #f44336',
//                 display: 'flex',
//                 alignItems: 'flex-start',
//               }}
//             >
//               <CancelIcon sx={{ mr: 1, color: '#d32f2f', mt: 0.5 }} />
//               <Box>
//                 <Typography variant="subtitle2" color="error">
//                   Cancellation Reason
//                 </Typography>
//                 <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#b71c1c' }}>
//                   {leaveData.cancelReason}
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>
//         )}

//         {/* Created At section */}
//         <Grid item xs={12}>
//           <Card sx={{ borderRadius: 2 }}>
//             <CardContent>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Created At
//                   </Typography>
//                   <Typography variant="body2">
//                     {new Date(leaveData.createdAt).toLocaleString()}
//                   </Typography>
//                 </Grid>
//                 {leaveData.modifyAt && (
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="text.secondary">
//                       Last Modified
//                     </Typography>
//                     <Typography variant="body2">
//                       {new Date(leaveData.modifyAt).toLocaleString()}
//                     </Typography>
//                   </Grid>
//                 )}
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Action Buttons */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           gap: 2,
//           mt: 3,
//         }}
//       >
//         <Button
//           disabled={isActionDisabled}
//           variant="contained"
//           startIcon={<CheckIcon />}
//           onClick={updateStatus}
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             width: 200,
//             bgcolor: "#2e7d32",
//             "&:hover": { bgcolor: "#1b5e20" },
//           }}
//         >
//           Approve Leave
//         </Button>
//         <Button
//           disabled={isActionDisabled}
//           variant="contained"
//           startIcon={<CloseIcon />}
//           onClick={updateStatusForCancel}
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             width: 200,
//             bgcolor: "#c62828",
//             "&:hover": { bgcolor: "#b71c1c" },
//           }}
//         >
//           Cancel Leave
//         </Button>
//       </Box>
//       <Dialog
//         open={cancelDialogOpen}
//         onClose={handleCancelDialogClose}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Cancel Leave Request</DialogTitle>
//         <DialogContent>
//           <DialogContentText sx={{ mb: 2 }}>
//             Please provide a reason for cancelling this leave request:
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Cancellation Reason"
//             type="text"
//             fullWidth
//             multiline
//             rows={3}
//             value={cancelReason}
//             onChange={(e) => setCancelReason(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelDialogClose} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleCancelConfirm}
//             color="error"
//             variant="contained"
//             disabled={!cancelReason.trim() || cancelLoading}
//           >
//             Confirm Cancellation
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog
//         open={approveDialogOpen}
//         onClose={handleApproveDialogClose}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Approve Leave Request</DialogTitle>
//         <DialogContent>
//           <DialogContentText sx={{ mb: 2 }}>
//             Please provide a message for approving this leave request:
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Approval Message"
//             type="text"
//             fullWidth
//             multiline
//             rows={3}
//             value={approveMessage}
//             onChange={(e) => setApproveMessage(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleApproveDialogClose} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleApproveConfirm}
//             color="success"
//             variant="contained"
//             disabled={!approveMessage.trim() || approveLoading}
//           >
//             Confirm Approval
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default LeaveRequestShow;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
} from "@mui/material";
import {
  CalendarMonth,
  AccessTime,
  Email,
  Person,
  Description,
  EventAvailable,
  EventBusy,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ArrowBack,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { base_emp } from "../../../http/services";

// Constants
const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED', 
  CANCEL: 'CANCEL',
  REJECTED: 'REJECTED'
};

const API_ENDPOINTS = {
  GET_LEAVE: (leaveId) => `${base_emp}/emp-handler/leave/get-an-leave/of-emp?leaveId=${leaveId}`,
  UPDATE_LEAVE: `${base_emp}/emp-handler/leave/cancel-leave/by-manager`
};

// Custom hooks
const useLeaveData = (leaveId) => {
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaveDetails = useCallback(async () => {
    if (!leaveId) {
      setError("Leave ID not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_LEAVE(leaveId));
      
      if (response.data?.status === 201) {
        setLeaveData(response.data.result);
        setError(null);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch leave details');
      }
    } catch (error) {
      setError("Failed to fetch leave details. Please try again later.");
      console.error("Error fetching leave details:", error);
    } finally {
      setLoading(false);
    }
  }, [leaveId]);

  useEffect(() => {
    fetchLeaveDetails();
  }, [fetchLeaveDetails]);

  return { leaveData, loading, error, refetch: fetchLeaveDetails };
};

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusConfig = (status) => {
  const statusUpper = status?.toUpperCase();
  const configs = {
    [LEAVE_STATUS.APPROVED]: {
      bg: "#e8f5e9",
      color: "#2e7d32",
      icon: <EventAvailable />,
      label: "Approved"
    },
    [LEAVE_STATUS.PENDING]: {
      bg: "#fff3e0",
      color: "#e65100",
      icon: <AccessTime />,
      label: "Pending"
    },
    [LEAVE_STATUS.REJECTED]: {
      bg: "#ffebee",
      color: "#c62828",
      icon: <EventBusy />,
      label: "Rejected"
    },
    [LEAVE_STATUS.CANCEL]: {
      bg: "#f3e5f5",
      color: "#6a1b9a",
      icon: <CancelIcon />,
      label: "Cancelled"
    }
  };

  return configs[statusUpper] || configs[LEAVE_STATUS.PENDING];
};

// Components
const ActionReasonDisplay = ({ actionReason, status }) => {
  if (!actionReason) return null;

  const statusUpper = status?.toUpperCase();
  const isCancelled = statusUpper === LEAVE_STATUS.CANCEL;
  
  const config = {
    backgroundColor: isCancelled ? '#ffebee' : '#e8f5e9',
    borderColor: isCancelled ? '#f44336' : '#4caf50',
    iconColor: isCancelled ? '#d32f2f' : '#2e7d32',
    textColor: isCancelled ? '#b71c1c' : '#1b5e20',
    title: isCancelled ? 'Cancellation Reason' : 'Approval Message'
  };

  return (
    <Grid item xs={12}>
      <Card
        sx={{
          borderRadius: 2,
          border: `2px solid ${config.borderColor}`,
          backgroundColor: config.backgroundColor,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <AdminPanelSettings 
              sx={{ 
                color: config.iconColor, 
                mt: 0.5,
                fontSize: 28 
              }} 
            />
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: config.iconColor,
                  fontWeight: 600,
                  mb: 1
                }}
              >
                {config.title}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: config.textColor,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  fontSize: '1rem'
                }}
              >
                {actionReason}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

const LeaveActionDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  loading, 
  title, 
  message, 
  value, 
  onChange, 
  actionType 
}) => {
  const isApproval = actionType === 'approve';
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {message}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label={isApproval ? "Approval Message" : "Cancellation Reason"}
          type="text"
          fullWidth
          multiline
          rows={3}
          value={value}
          onChange={onChange}
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={isApproval ? "success" : "error"}
          variant="contained"
          disabled={!value.trim() || loading}
          sx={{ 
            borderRadius: 2,
            minWidth: 140
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            `Confirm ${isApproval ? 'Approval' : 'Cancellation'}`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LeaveRequestShow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const leaveId = location.state?.leaveId;

  const { leaveData, loading, error } = useLeaveData(leaveId);

  // State management
  const [dialogs, setDialogs] = useState({
    cancel: { open: false, reason: '', loading: false },
    approve: { open: false, message: '', loading: false }
  });
  
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Memoized values
  const statusConfig = useMemo(() => 
    leaveData ? getStatusConfig(leaveData.status) : null, 
    [leaveData?.status]
  );

  const isActionDisabled = useMemo(() => {
    if (!leaveData) return true;
    const status = leaveData.status?.toUpperCase();
    return [LEAVE_STATUS.APPROVED, LEAVE_STATUS.CANCEL].includes(status);
  }, [leaveData?.status]);

  // Event handlers
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const openDialog = useCallback((dialogType) => {
    setDialogs(prev => ({
      ...prev,
      [dialogType]: { ...prev[dialogType], open: true }
    }));
  }, []);

  const closeDialog = useCallback((dialogType) => {
    setDialogs(prev => ({
      ...prev,
      [dialogType]: { 
        open: false, 
        reason: '', 
        message: '', 
        loading: false 
      }
    }));
  }, []);

  const updateDialogValue = useCallback((dialogType, field, value) => {
    setDialogs(prev => ({
      ...prev,
      [dialogType]: { ...prev[dialogType], [field]: value }
    }));
  }, []);

  const handleLeaveAction = useCallback(async (actionType) => {
    const dialog = dialogs[actionType];
    const actionValue = actionType === 'approve' ? dialog.message : dialog.reason;
    const status = actionType === 'approve' ? LEAVE_STATUS.APPROVED : LEAVE_STATUS.CANCEL;

    if (!actionValue.trim()) return;

    setDialogs(prev => ({
      ...prev,
      [actionType]: { ...prev[actionType], loading: true }
    }));

    try {
      const formData = new FormData();
      formData.append("reason", actionValue);
      formData.append("leaveId", leaveId);
      formData.append("status", status);

      const response = await axios.post(API_ENDPOINTS.UPDATE_LEAVE, formData);

      if (response.data?.status === 201) {
        const successMessage = actionType === 'approve' 
          ? 'Leave approved successfully!' 
          : 'Leave cancelled successfully!';
        
        setSnackbar({ 
          open: true, 
          message: successMessage, 
          severity: 'success' 
        });
        
        // Reload the page to reflect changes
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error(response.data?.message || 'Operation failed');
      }
    } catch (error) {
      const errorMessage = actionType === 'approve'
        ? 'Failed to approve leave. Please try again.'
        : 'Failed to cancel leave. Please try again.';
      
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
      console.error(`Error ${actionType}ing leave:`, error);
    } finally {
      closeDialog(actionType);
    }
  }, [dialogs, leaveId, closeDialog]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Early returns for error states
  if (!leaveId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Leave ID not found. Please select a leave request from the list.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!leaveData) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No leave details found.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
      {/* Back Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3, borderRadius: 2 }}
      >
        Back to List
      </Button>

      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
          color: "white",
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#fff",
                color: "#1a237e",
              }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Leave Request Details
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Leave ID: {leaveData.leaveId}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              sx={{
                bgcolor: statusConfig.bg,
                color: statusConfig.color,
                fontWeight: 600,
                fontSize: '0.875rem',
                height: 40,
                "& .MuiChip-icon": {
                  color: statusConfig.color,
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Details */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                Leave Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Person sx={{ mr: 2, color: "primary.main" }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Employee Code
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {leaveData.empCode}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Email sx={{ mr: 2, color: "primary.main" }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Leave Type
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {leaveData.mailType}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Description sx={{ mr: 2, color: "primary.main" }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Subject
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {leaveData.subject}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <Description sx={{ mr: 2, color: "primary.main", mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Reason
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {leaveData.reason}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Duration Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                Leave Duration
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarMonth sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDate(leaveData.startData)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarMonth sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      End Date
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatDate(leaveData.endDate)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{ 
                  p: 2, 
                  bgcolor: "background.default", 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="h6" color="primary" fontWeight={600}>
                  {leaveData.countDays}{" "}
                  {leaveData.countDays === 1 ? "Day" : "Days"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {leaveData.duration}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Reason Display */}
        <ActionReasonDisplay 
          actionReason={leaveData.actionReason} 
          status={leaveData.status}
        />

        {/* Created At section */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {new Date(leaveData.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                {leaveData.modifyAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Modified
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {new Date(leaveData.modifyAt).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 4,
          mb: 2
        }}
      >
        <Button
          disabled={isActionDisabled}
          variant="contained"
          startIcon={<CheckIcon />}
          onClick={() => openDialog('approve')}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            width: 200,
            height: 48,
            fontSize: '1rem',
            fontWeight: 600,
            bgcolor: "#2e7d32",
            "&:hover": { bgcolor: "#1b5e20" },
            "&:disabled": { bgcolor: "action.disabledBackground" }
          }}
        >
          Approve Leave
        </Button>
        <Button
          disabled={isActionDisabled}
          variant="contained"
          startIcon={<CloseIcon />}
          onClick={() => openDialog('cancel')}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            width: 200,
            height: 48,
            fontSize: '1rem',
            fontWeight: 600,
            bgcolor: "#c62828",
            "&:hover": { bgcolor: "#b71c1c" },
            "&:disabled": { bgcolor: "action.disabledBackground" }
          }}
        >
          Cancel Leave
        </Button>
      </Box>

      {/* Dialogs */}
      <LeaveActionDialog
        open={dialogs.cancel.open}
        onClose={() => closeDialog('cancel')}
        onConfirm={() => handleLeaveAction('cancel')}
        loading={dialogs.cancel.loading}
        title="Cancel Leave Request"
        message="Please provide a reason for cancelling this leave request:"
        value={dialogs.cancel.reason}
        onChange={(e) => updateDialogValue('cancel', 'reason', e.target.value)}
        actionType="cancel"
      />

      <LeaveActionDialog
        open={dialogs.approve.open}
        onClose={() => closeDialog('approve')}
        onConfirm={() => handleLeaveAction('approve')}
        loading={dialogs.approve.loading}
        title="Approve Leave Request"
        message="Please provide a message for approving this leave request:"
        value={dialogs.approve.message}
        onChange={(e) => updateDialogValue('approve', 'message', e.target.value)}
        actionType="approve"
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaveRequestShow;