import React, { useState, useEffect } from 'react';
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
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    // Cancel as CancelIcon
} from '@mui/material';
import {
    CalendarMonth,
    AccessTime,
    Email,
    Person,
    Description,
    EventAvailable,
    EventBusy,
    ArrowBack,
    ThumbUp,
    ThumbDown
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { base_emp, base_Ip } from '../../../http/services';

const LeaveDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const leaveId = location.state?.leaveId;
    const id = location.state?.id || 0; // Default to 0 if id is not provided
    
    const [leaveData, setLeaveData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalLoading, setApprovalLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', title: '', message: '' });
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const fetchLeaveDetails = async () => {
            if (!leaveId) {
                setError('Leave ID not found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${ base_emp}/emp-handler/leave/get-an-leave/of-emp?leaveId=${leaveId}`);
                if (response.data?.status === 201) {
                    setLeaveData(response.data.result);
                }
            } catch (error) {
                setError('Failed to fetch leave details. Please try again later.');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveDetails();
    }, [leaveId]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'approved': return { bg: '#e8f5e9', color: '#2e7d32', icon: <EventAvailable /> };
            case 'pending': return { bg: '#fff3e0', color: '#e65100', icon: <AccessTime /> };
            case 'rejected': return { bg: '#ffebee', color: '#c62828', icon: <EventBusy /> };
            default: return { bg: '#fff3e0', color: '#e65100', icon: <AccessTime /> };
        }
    };

    const handleApproveLeave = async () => {
        setConfirmDialog({
            open: true,
            action: 'approve',
            title: 'Approve Leave Request',
            message: 'Are you sure you want to approve this leave request?'
        });
    };

    const handleRejectLeave = async () => {
        setConfirmDialog({
            open: true,
            action: 'reject',
            title: 'Reject Leave Request',
            message: 'Please provide a reason for rejection:'
        });
    };

    // const handleConfirmAction = async () => {

    //     setApprovalLoading(true);
    //     setConfirmDialog({ ...confirmDialog, open: false });
        
    //     try {
    //         const endpoint = confirmDialog.action === 'approve' 
    //             ? `${ base_emp}/emp-handler/leave/approved-by-manager?leaveId=${leaveId}` 
    //             : `${ base_emp}/emp-handler/leave/reject-leave`;

    //         const payload = {
    //             leaveId: leaveData.leaveId,
    //             managerEmpCode: localStorage.getItem("empCode"),
    //             ...( confirmDialog.action === 'reject' && { reason: rejectionReason })
    //         };


    //         const response = null;

    //         if(confirmDialog.action === 'approve'){
    //             response = await axios.get(endpoint, payload);
    //         }
    //         else{

    //             const formData = new FormData();

    //             formData.append("reason",rejectionReason)
    //             formData.append("leaveId",leaveId)

    //             response= await axios.post(endpoint,formData); 
                
    //         }
            
    //         if (response.data?.status === 201) {
    //             setSnackbar({
    //                 open: true,
    //                 message: `Leave request ${confirmDialog.action === 'approve' ? 'approved' : 'rejected'} successfully!`,
    //                 severity: 'success'
    //             });
                
    //             // Update the local state to reflect the change
    //             setLeaveData({
    //                 ...leaveData,
    //                 status: confirmDialog.action === 'approve' ? 'Approved' : 'Rejected',
    //                 modifyAt: new Date().toISOString()
    //             });
    //         } else {
    //             throw new Error(response.data?.message || 'Operation failed');
    //         }
    //     } catch (error) {
    //         setSnackbar({
    //             open: true,
    //             message: `Failed to ${confirmDialog.action} leave request: ${error.message}`,
    //             severity: 'error'
    //         });
    //         console.error(`Error while ${confirmDialog.action}ing leave:`, error);
    //     } finally {
    //         setApprovalLoading(false);
    //         setRejectionReason('');
    //     }
    // };


    const handleConfirmAction = async () => {
        setApprovalLoading(true);
        setConfirmDialog({ ...confirmDialog, open: false });
    
        try {
            const endpoint =
                confirmDialog.action === 'approve'
                    ? `${base_emp}/emp-handler/leave/approved-by-manager?leaveId=${leaveId}`
                    : `${base_emp}/emp-handler/leave/cancel-leave/by-manager`;
    
            const payload = {
                leaveId: leaveData.leaveId,
                managerEmpCode: localStorage.getItem("empCode"),
                ...(confirmDialog.action === 'reject' && { reason: rejectionReason })
            };
    
            let response; // ✅ use let, not const
    
            if (confirmDialog.action === 'approve') {
                response = await axios.get(endpoint); // ✅ axios.get does NOT take payload as second argument unless it's config
            } else {
                const formData = new FormData();
                formData.append("reason", rejectionReason);
                formData.append("leaveId", leaveId);
    
                response = await axios.post(endpoint, formData);
            }
    
            if (response.data?.status === 201) {
                setSnackbar({
                    open: true,
                    message: `Leave request ${confirmDialog.action === 'approve' ? 'approved' : 'rejected'} successfully!`,
                    severity: 'success'
                });
    
                setLeaveData({
                    ...leaveData,
                    status: confirmDialog.action === 'approve' ? 'Approved' : 'Rejected',
                    modifyAt: new Date().toISOString()
                });
            } else {
                throw new Error(response.data?.message || 'Operation failed');
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Failed to ${confirmDialog.action} leave request: ${error.message}`,
                severity: 'error'
            });
            console.error(`Error while ${confirmDialog.action}ing leave:`, error);
        } finally {
            setApprovalLoading(false);
            setRejectionReason('');
        }
    };
    
    const handleBack = () => {
        navigate(-1); 
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleCloseDialog = () => {
        setConfirmDialog({ ...confirmDialog, open: false });
        setRejectionReason('');
    };

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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        );
    }

    if (!leaveData) {
        return (
            <Alert severity="info" sx={{ m: 2 }}>No leave details found.</Alert>
        );
    }

    const statusTheme = getStatusColor(leaveData.status);
    const isPending = leaveData.status?.toLowerCase() === 'pending';

    return (
        <Box sx={{  maxWidth: 1200, margin: '0 auto' }}>
            {/* Back Button */}
            <Button 
                variant="outlined" 
                startIcon={<ArrowBack />} 
                onClick={handleBack} 
                sx={{ mb: 2, borderRadius: 2 }}
            >
                Back to List
            </Button>
            
            {/* Header Section */}
            <Paper 
                elevation={3}
                sx={{ 
                    p: 3, 
                    mb: 3, 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}
            >
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <Avatar 
                            sx={{ 
                                width: 64, 
                                height: 64, 
                                bgcolor: '#fff',
                                color: '#1a237e',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                            }}
                        >
                            <Person sx={{ fontSize: 40 }} />
                        </Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                            Leave Request Details
                        </Typography>
                        <Typography variant="subtitle1">
                            Leave ID: {leaveData.leaveId}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Chip
                            icon={statusTheme.icon}
                            label={leaveData.status}
                            sx={{
                                bgcolor: statusTheme.bg,
                                color: statusTheme.color,
                                fontWeight: 600,
                                padding: '4px',
                                height: 'auto',
                                '& .MuiChip-label': {
                                    padding: '4px 8px',
                                },
                                '& .MuiChip-icon': {
                                    color: statusTheme.color
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Manager Approval Actions */}
            {id === 1 && isPending && (
                <Paper 
                    elevation={2} 
                    sx={{ 
                        p: 3, 
                        mb: 3, 
                        borderRadius: 2,
                        bgcolor: '#f5f5f5',
                        border: '1px dashed #1a237e'
                    }}
                >
                    <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 500 }}>
                        Manager Actions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<ThumbUp />}
                            onClick={handleApproveLeave}
                            disabled={approvalLoading}
                            sx={{ 
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(46,125,50,0.3)',
                                textTransform: 'none',
                                padding: '8px 24px'
                            }}
                        >
                            Approve Leave
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<ThumbDown />}
                            onClick={handleRejectLeave}
                            disabled={approvalLoading}
                            sx={{ 
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(198,40,40,0.3)',
                                textTransform: 'none',
                                padding: '8px 24px'
                            }}
                        >
                            Reject Leave
                        </Button>
                    </Box>
                </Paper>
            )}

            <Grid container spacing={3}>
                {/* Main Details */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ 
                        height: '100%', 
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            transform: 'translateY(-2px)'
                        }
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                                Leave Information
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Person sx={{ mr: 1, color: 'primary.main' }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Employee Code
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {leaveData.empCode}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Email sx={{ mr: 1, color: 'primary.main' }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Leave Type
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {leaveData.mailType}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Description sx={{ mr: 1, color: 'primary.main' }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Subject
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {leaveData.subject}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start', 
                                        mb: 2,
                                        p: 2,
                                        bgcolor: '#f8f9fa',
                                        borderRadius: 1
                                    }}>
                                        <Description sx={{ mr: 1, color: 'primary.main', mt: 0.5 }} />
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
                                {leaveData.status?.toLowerCase() === 'cencel' && leaveData.cancelReason && (
    <Grid item xs={12}>
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            mb: 2,
            p: 2,
            bgcolor: '#ffebee',
            borderRadius: 1,
            border: '1px solid #f44336'
        }}>
            {/* <CancelIcon sx={{ mr: 1, color: '#d32f2f', mt: 0.5 }} /> */}
            <Box>
                <Typography variant="subtitle2" color="error">
                    Cancellation Reason
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#b71c1c' }}>
                    {leaveData.cancelReason}
                </Typography>
            </Box>
        </Box>
    </Grid>
)}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Leave Duration Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ 
                        height: '100%', 
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            transform: 'translateY(-2px)'
                        }
                    }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                                Leave Duration
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Start Date
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {formatDate(leaveData.startData)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            End Date
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {formatDate(leaveData.endDate || leaveData.endtime)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ 
                                p: 2, 
                                bgcolor: '#e3f2fd', 
                                borderRadius: 1,
                                border: '1px solid #bbdefb'
                            }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Duration
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                                    {leaveData.countDays} {leaveData.countDays === 1 ? 'Day' : 'Days'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {leaveData.duration}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Timestamps Card */}
                <Grid item xs={12}>
                    <Card sx={{ 
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Created At
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {new Date(leaveData.createdAt).toLocaleString()}
                                    </Typography>
                                </Grid>
                                {leaveData.modifyAt && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Last Modified
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {new Date(leaveData.modifyAt).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{confirmDialog.title}</DialogTitle>
                <DialogContent>
                    {confirmDialog.action === 'approve' ? (
                        <DialogContentText>
                            {confirmDialog.message}
                        </DialogContentText>
                    ) : (
                        <>
                            <DialogContentText sx={{ mb: 2 }}>
                                {confirmDialog.message}
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Rejection Reason"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmAction} 
                        color={confirmDialog.action === 'approve' ? 'success' : 'error'}
                        variant="contained"
                        disabled={confirmDialog.action === 'reject' && !rejectionReason.trim()}
                    >
                        Confirm {confirmDialog.action === 'approve' ? 'Approval' : 'Rejection'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LeaveDetails; 

// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Paper,
//     Typography,
//     Grid,
//     Chip,
//     Divider,
//     CircularProgress,
//     Alert,
//     Card,
//     CardContent,
//     Avatar,
//     Button
// } from '@mui/material';
// import {
//     CalendarMonth,
//     AccessTime,
//     Email,
//     Person,
//     Description,
//     EventAvailable,
//     EventBusy,
//     ArrowBack,
//     Cancel as CancelIcon
// } from '@mui/icons-material';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { base_emp } from '../../../http/services';

// const LeaveDetails = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const leaveId = location.state?.leaveId;
    
//     const [leaveData, setLeaveData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchLeaveDetails = async () => {
//             if (!leaveId) {
//                 setError('Leave ID not found');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axios.get(`${base_emp}/emp-handler/leave/get-an-leave/of-emp?leaveId=${leaveId}`);
//                 if (response.data?.status === 201) {
//                     setLeaveData(response.data.result);
//                 }
//             } catch (error) {
//                 setError('Failed to fetch leave details. Please try again later.');
//                 console.error('Error:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLeaveDetails();
//     }, [leaveId]);

//     const formatDate = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric'
//         });
//     };

//     const getStatusColor = (status) => {
//         const statusLower = status?.toLowerCase();
//         switch (statusLower) {
//             case 'approved': return { bg: '#e8f5e9', color: '#2e7d32', icon: <EventAvailable /> };
//             case 'pending': return { bg: '#fff3e0', color: '#e65100', icon: <AccessTime /> };
//             case 'rejected': return { bg: '#ffebee', color: '#c62828', icon: <EventBusy /> };
//             case 'cencel': return { bg: '#f3e5f5', color: '#6a1b9a', icon: <CancelIcon /> };
//             default: return { bg: '#fff3e0', color: '#e65100', icon: <AccessTime /> };
//         }
//     };

//     const handleBack = () => {
//         navigate(-1); 
//     };

//     if (!leaveId) {
//         return (
//             <Box sx={{ p: 3 }}>
//                 <Alert severity="error">
//                     Leave ID not found. Please select a leave request from the list.
//                 </Alert>
//             </Box>
//         );
//     }

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
//         );
//     }

//     if (!leaveData) {
//         return (
//             <Alert severity="info" sx={{ m: 2 }}>No leave details found.</Alert>
//         );
//     }

//     const statusTheme = getStatusColor(leaveData.status);

//     return (
//         <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
//             {/* Back Button */}
//             <Button 
//                 variant="outlined" 
//                 startIcon={<ArrowBack />} 
//                 onClick={handleBack} 
//                 sx={{ mb: 2, borderRadius: 2 }}
//             >
//                 Back to List
//             </Button>
            
//             {/* Header Section */}
//             <Paper 
//                 elevation={3}
//                 sx={{ 
//                     p: 3, 
//                     mb: 3, 
//                     borderRadius: 2,
//                     background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
//                     color: 'white',
//                     boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
//                 }}
//             >
//                 <Grid container alignItems="center" spacing={2}>
//                     <Grid item>
//                         <Avatar 
//                             sx={{ 
//                                 width: 64, 
//                                 height: 64, 
//                                 bgcolor: '#fff',
//                                 color: '#1a237e',
//                                 boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
//                             }}
//                         >
//                             <Person sx={{ fontSize: 40 }} />
//                         </Avatar>
//                     </Grid>
//                     <Grid item xs>
//                         <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
//                             Leave Request Details
//                         </Typography>
//                         <Typography variant="subtitle1">
//                             Leave ID: {leaveData.leaveId}
//                         </Typography>
//                     </Grid>
//                     <Grid item>
//                         <Chip
//                             icon={statusTheme.icon}
//                             label={leaveData.status}
//                             sx={{
//                                 bgcolor: statusTheme.bg,
//                                 color: statusTheme.color,
//                                 fontWeight: 600,
//                                 padding: '4px',
//                                 height: 'auto',
//                                 '& .MuiChip-label': {
//                                     padding: '4px 8px',
//                                 },
//                                 '& .MuiChip-icon': {
//                                     color: statusTheme.color
//                                 }
//                             }}
//                         />
//                     </Grid>
//                 </Grid>
//             </Paper>

//             <Grid container spacing={3}>
//                 {/* Main Details */}
//                 <Grid item xs={12} md={8}>
//                     <Card sx={{ height: '100%', borderRadius: 2 }}>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
//                                 Leave Information
//                             </Typography>
//                             <Divider sx={{ mb: 3 }} />
                            
//                             <Grid container spacing={3}>
//                                 <Grid item xs={12} sm={6}>
//                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                                         <Person sx={{ mr: 1, color: 'primary.main' }} />
//                                         <Box>
//                                             <Typography variant="subtitle2" color="text.secondary">
//                                                 Employee Name
//                                             </Typography>
//                                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                                                 {leaveData.name}
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </Grid>

//                                 <Grid item xs={12} sm={6}>
//                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                                         <Email sx={{ mr: 1, color: 'primary.main' }} />
//                                         <Box>
//                                             <Typography variant="subtitle2" color="text.secondary">
//                                                 Employee Email
//                                             </Typography>
//                                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                                                 {leaveData.email}
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </Grid>

//                                 <Grid item xs={12} sm={6}>
//                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                                         <Description sx={{ mr: 1, color: 'primary.main' }} />
//                                         <Box>
//                                             <Typography variant="subtitle2" color="text.secondary">
//                                                 Leave Type
//                                             </Typography>
//                                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                                                 {leaveData.mailType}
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </Grid>

//                                 <Grid item xs={12} sm={6}>
//                                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                                         <Description sx={{ mr: 1, color: 'primary.main' }} />
//                                         <Box>
//                                             <Typography variant="subtitle2" color="text.secondary">
//                                                 Subject
//                                             </Typography>
//                                             <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                                                 {leaveData.subject}
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </Grid>

//                                 <Grid item xs={12}>
//                                     <Box sx={{ 
//                                         display: 'flex', 
//                                         alignItems: 'flex-start', 
//                                         mb: 2,
//                                         p: 2,
//                                         bgcolor: '#f8f9fa',
//                                         borderRadius: 1
//                                     }}>
//                                         <Description sx={{ mr: 1, color: 'primary.main', mt: 0.5 }} />
//                                         <Box>
//                                             <Typography variant="subtitle2" color="text.secondary">
//                                                 Reason
//                                             </Typography>
//                                             <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
//                                                 {leaveData.reason}
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </Grid>

//                                 {/* Cancel Reason Section */}
//                                 {leaveData.status?.toLowerCase() === 'cencel' && leaveData.cancelReason && (
//                                     <Grid item xs={12}>
//                                         <Box sx={{ 
//                                             display: 'flex', 
//                                             alignItems: 'flex-start', 
//                                             mb: 2,
//                                             p: 2,
//                                             bgcolor: '#ffebee',
//                                             borderRadius: 1,
//                                             border: '1px solid #f44336'
//                                         }}>
//                                             <CancelIcon sx={{ mr: 1, color: '#d32f2f', mt: 0.5 }} />
//                                             <Box>
//                                                 <Typography variant="subtitle2" color="error">
//                                                     Cancellation Reason
//                                                 </Typography>
//                                                 <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#b71c1c' }}>
//                                                     {leaveData.cancelReason}
//                                                 </Typography>
//                                             </Box>
//                                         </Box>
//                                     </Grid>
//                                 )}
//                             </Grid>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Leave Duration Card */}
//                 <Grid item xs={12} md={4}>
//                     <Card sx={{ height: '100%', borderRadius: 2 }}>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
//                                 Leave Duration
//                             </Typography>
//                             <Divider sx={{ mb: 3 }} />

//                             <Box sx={{ mb: 3 }}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                                     <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
//                                     <Box>
//                                         <Typography variant="subtitle2" color="text.secondary">
//                                             Start Date
//                                         </Typography>
//                                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                                             {formatDate(leaveData.startData)}
//                                         </Typography>
//                                     </Box>
//                                 </Box>

//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                                     <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
//                                     <Box>
//                                         <Typography variant="subtitle2" color="text.secondary">
//                                             End Date
//                                         </Typography>
//                                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                                             {formatDate(leaveData.endDate)}
//                                         </Typography>
//                                     </Box>
//                                 </Box>
//                             </Box>

//                             <Box sx={{ 
//                                 p: 2, 
//                                 bgcolor: '#e3f2fd', 
//                                 borderRadius: 1,
//                                 border: '1px solid #bbdefb'
//                             }}>
//                                 <Typography variant="subtitle2" color="text.secondary">
//                                     Duration
//                                 </Typography>
//                                 <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
//                                     {leaveData.countDays} {leaveData.countDays === 1 ? 'Day' : 'Days'}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary">
//                                     {leaveData.duration}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Timestamps Card */}
//                 <Grid item xs={12}>
//                     <Card sx={{ borderRadius: 2 }}>
//                         <CardContent>
//                             <Grid container spacing={3}>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle2" color="text.secondary">
//                                         Created At
//                                     </Typography>
//                                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                                         {new Date(leaveData.createdAt).toLocaleString()}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle2" color="text.secondary">
//                                         Last Modified
//                                     </Typography>
//                                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                                         {new Date(leaveData.modifyAt).toLocaleString()}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle2" color="text.secondary">
//                                         Organization Code
//                                     </Typography>
//                                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                                         {leaveData.organizationCode}
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default LeaveDetails;