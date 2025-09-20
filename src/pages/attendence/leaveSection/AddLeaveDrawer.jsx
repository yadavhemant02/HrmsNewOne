import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    MenuItem,
    Grid,
    Drawer,
    IconButton,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import axios from 'axios';
import { base_emp, base_Ip } from '../../../http/services';

// Custom Tab Panel Component
const TabPanel = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`leave-tabpanel-${index}`}
            aria-labelledby={`leave-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
};

// Tab props for accessibility
const a11yProps = (index) => {
    return {
        id: `leave-tab-${index}`,
        'aria-controls': `leave-tabpanel-${index}`,
    };
};

const AddLeaveDrawer = ({ isOpen, onClose, editData = null }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        name: localStorage.getItem('name') || '',
        email: localStorage.getItem('email') || '',
        empCode: localStorage.getItem('empCode') || '',
        manager: localStorage.getItem("manager") || '',
        organizationCode: localStorage.getItem('organizationCode') || '',
        subject: '',
        reason: '',
        duration: '',
        mailType: '',
        startData: '',
        endDate: '',
        actionReason: '',
        leaveId: '',
        leaveCategory: 'next' // 'previous' or 'next'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    // Initialize form data when component mounts or editData changes
    useEffect(() => {
        if (editData) {
            setFormData(prev => ({
                ...prev,
                subject: editData.subject || '',
                reason: editData.reason || '',
                duration: editData.duration || '',
                mailType: editData.mailType || '',
                startData: editData.startData || '',
                endDate: editData.endDate || '',
                leaveId: editData.leaveId || '',
                leaveCategory: editData.leaveCategory || 'next'
            }));
            
            // Set the appropriate tab based on leave category
            setActiveTab(editData.leaveCategory === 'previous' ? 0 : 1);
        } else {
            // Reset form for new leave request
            setFormData(prev => ({
                ...prev,
                subject: '',
                reason: '',
                duration: '',
                mailType: '',
                startData: '',
                endDate: '',
                actionReason: '',
                leaveId: '',
                leaveCategory: 'next'
            }));
            setActiveTab(1); // Default to "Next Leave" tab
        }
    }, [editData, isOpen]);

    const mailTypes = [
        'Sick Leave',
        'Casual Leave',
        'Personal Leave',
        'Vacation Leave',
        'Emergency Leave',
        'Maternity Leave',
        'Paternity Leave',
        'Bereavement Leave'
    ];

    const durations = [
        'Full Day',
        'Half Day - Morning',
        'Half Day - Afternoon'
    ];

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }
        
        if (!formData.reason.trim()) {
            newErrors.reason = 'Reason is required';
        }
        
        if (!formData.duration) {
            newErrors.duration = 'Duration is required';
        }
        
        if (!formData.mailType) {
            newErrors.mailType = 'Leave type is required';
        }
        
        if (!formData.startData) {
            newErrors.startData = 'Start date is required';
        }
        
        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        // Date validation based on leave category
        if (formData.startData && formData.endDate) {
            const startDate = new Date(formData.startData);
            const endDate = new Date(formData.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // For next leave (future dates)
            if (formData.leaveCategory === 'next') {
                if (startDate < today) {
                    newErrors.startData = 'Start date cannot be in the past for future leave';
                }
            }
            
            // Common validation for both categories
            if (endDate < startDate) {
                newErrors.endDate = 'End date cannot be before start date';
            }

            // Additional validation for date range
            const daysDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            if (daysDifference > 365) {
                newErrors.endDate = 'Leave period cannot exceed 365 days';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setFormData(prev => ({
            ...prev,
            leaveCategory: newValue === 0 ? 'previous' : 'next',
            startData: '',
            endDate: ''
        }));
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Handle duration change for date validation
        if (name === 'duration') {
            setFormData(prev => ({
                ...prev,
                startData: '',
                endDate: ''
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setAlertMessage("Please fill in all required fields correctly");
            setAlertSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
      
        try {
            const url = editData 
                ? `${base_emp}/emp-handler/leave/update-leave-of-emp`
                : `${base_emp}/emp-handler/leave/add-request/for-leave`;

            const requestData = {
                ...formData,
                ...(editData && { leaveId: editData.leaveId })
            };

            const response = await axios.post(url, requestData);
            
            if (response.data?.status === 201) {
                const successMessage = editData 
                    ? "Leave request updated successfully!" 
                    : `${formData.leaveCategory === 'previous' ? 'Previous' : 'Future'} leave request submitted successfully!`;
                
                setAlertMessage(successMessage);
                setAlertSeverity("success");
                setOpenSnackbar(true);
                
                setTimeout(() => {
                    onClose?.(); 
                }, 1500);
            } else {
                throw new Error(response.data?.message || 'Failed to process request');
            }
        } catch (error) {
            console.error("Error submitting leave request:", error);
            
            let errorMessage = "An error occurred. Please try again.";
            
            if (error.response?.data?.message?.includes("unable to save you have take leave in this range")) {
                errorMessage = "You already have leave scheduled for these dates. Please select different dates.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 409) {
                errorMessage = "Leave dates conflict with existing leave. Please choose different dates.";
            } else if (error.response?.status === 400) {
                errorMessage = "Invalid leave request data. Please check all fields.";
            }
            
            setAlertMessage(errorMessage);
            setAlertSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get min date for start date based on leave category
    const getStartDateMin = () => {
        if (formData.leaveCategory === 'previous') {
            return null; // No minimum date restriction for previous leave
        }
        
        const today = new Date();
        if (formData.duration === 'Full Day') {
            today.setDate(today.getDate() + 1); // Tomorrow for full day
        }
        return today.toISOString().split('T')[0];
    };

    // Helper to get max date for start date (only for previous leave)
    const getStartDateMax = () => {
        if (formData.leaveCategory === 'previous') {
            const today = new Date();
            return today.toISOString().split('T')[0];
        }
        return null;
    };

    // Helper to get min date for end date
    const getEndDateMin = () => {
        if (!formData.startData) {
            return getStartDateMin();
        }
        
        if (formData.duration === 'Full Day') {
            const baseDate = new Date(formData.startData);
            baseDate.setDate(baseDate.getDate() + 1);
            return baseDate.toISOString().split('T')[0];
        } else {
            return formData.startData;
        }
    };

    // Helper to get max date for end date (only for previous leave)
    const getEndDateMax = () => {
        if (formData.leaveCategory === 'previous') {
            const today = new Date();
            return today.toISOString().split('T')[0];
        }
        return null;
    };

    const resetForm = () => {
        setFormData(prev => ({
            ...prev,
            subject: '',
            reason: '',
            duration: '',
            mailType: '',
            startData: '',
            endDate: '',
            actionReason: ''
        }));
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 600 },
                    backgroundColor: '#f8f9fa',
                    // Reduced margins for better space utilization
                    marginTop: { xs: '60px', sm: '65px' }, // Reduced from 70/80
                    marginBottom: { xs: '5px', sm: '10px' }, // Reduced from 10/20
                    height: { xs: 'calc(100vh - 65px)', sm: 'calc(100vh - 75px)' }, // Adjusted height accordingly
                    borderRadius: { xs: '8px 0 0 8px', sm: '8px 0 0 8px' }
                }
            }}
        >
            <Box sx={{
                height: "100%",
                paddingY: { xs: 1, sm: 2 },
                paddingX: { xs: 1, sm: 2 },
                overflowY: "auto",
                // Add scrollbar styling for better UX
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#2ed189',
                    borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#25b374',
                },
            }}>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: "12px",
                        padding: { xs: "15px", md: "25px" },
                        backgroundColor: "white",
                        border: "1px solid rgba(46, 209, 137, 0.2)",
                        marginBottom: 2
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: "inherit",
                                fontSize: { xs: "1.3rem", md: "1.8rem" },
                                fontWeight: 600,
                                color: "#2ed189",
                            }}
                        >
                            {editData ? 'Edit Leave Request' : 'New Leave Request'}
                        </Typography>
                        <IconButton 
                            onClick={handleClose}
                            sx={{ 
                                color: "#666",
                                '&:hover': { 
                                    backgroundColor: "rgba(46, 209, 137, 0.1)" 
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    minHeight: { xs: 40, sm: 48 },
                                    padding: { xs: '6px 12px', sm: '12px 16px' }
                                },
                                '& .Mui-selected': {
                                    color: '#2ed189 !important'
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#2ed189'
                                }
                            }}
                        >
                            <Tab 
                                icon={<AccessTimeIcon />} 
                                iconPosition="start"
                                label="Previous Leave" 
                                {...a11yProps(0)} 
                            />
                            <Tab 
                                icon={<EventIcon />} 
                                iconPosition="start"
                                label="Leave Request" 
                                {...a11yProps(1)} 
                            />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <TabPanel value={activeTab} index={0}>
                        <Alert 
                            severity="info" 
                            sx={{ 
                                mb: 2, 
                                backgroundColor: '#e3f2fd',
                                fontSize: { xs: '0.85rem', sm: '0.9rem' }
                            }}
                        >
                            <strong>Previous Leave:</strong> You can select any past dates for backdated leave requests.
                        </Alert>
                    </TabPanel>

                    <TabPanel value={activeTab} index={1}>
                        <Alert 
                            severity="success" 
                            sx={{ 
                                mb: 2, 
                                backgroundColor: '#e8f5e8',
                                fontSize: { xs: '0.85rem', sm: '0.9rem' }
                            }}
                        >
                            <strong>Future Leave:</strong> Select dates from tomorrow onwards for upcoming leave requests.
                        </Alert>
                    </TabPanel>

                    {/* Form Fields */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                disabled
                                name="empCode"
                                label="Employee Code"
                                variant="outlined"
                                value={formData.empCode}
                                fullWidth
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="subject"
                                label="Subject *"
                                variant="outlined"
                                value={formData.subject}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                required
                                error={!!errors.subject}
                                helperText={errors.subject}
                                placeholder="Enter leave subject"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="reason"
                                label="Reason *"
                                multiline
                                rows={3}
                                value={formData.reason}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                required
                                error={!!errors.reason}
                                helperText={errors.reason}
                                placeholder="Provide detailed reason for leave"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                select
                                name="duration"
                                label="Duration *"
                                value={formData.duration}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                required
                                error={!!errors.duration}
                                helperText={errors.duration}
                            >
                                {durations.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                select
                                name="mailType"
                                label="Leave Type *"
                                value={formData.mailType}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                required
                                error={!!errors.mailType}
                                helperText={errors.mailType}
                            >
                                {mailTypes.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="startData"
                                label="Start Date *"
                                type="date"
                                value={formData.startData}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                required
                                error={!!errors.startData}
                                helperText={errors.startData}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: getStartDateMin(),
                                    max: getStartDateMax()
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="endDate"
                                label="End Date *"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                required
                                error={!!errors.endDate}
                                helperText={errors.endDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: getEndDateMin(),
                                    max: getEndDateMax()
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 1 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{
                                    width: "100%",
                                    height: 45,
                                    backgroundColor: "#2ed189",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    "&:hover": {
                                        backgroundColor: "#25b374",
                                    },
                                    "&:disabled": {
                                        backgroundColor: "#cccccc",
                                    }
                                }}
                            >
                                {loading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={20} color="inherit" />
                                        Processing...
                                    </Box>
                                ) : (
                                    editData ? "Update Leave Request" : "Submit Leave Request"
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={5000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity={alertSeverity}
                        variant="filled"
                        sx={{ 
                            width: "100%",
                            minWidth: '300px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            '& .MuiAlert-message': {
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }
                        }}
                    >
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Drawer>
    );
};

export default AddLeaveDrawer;