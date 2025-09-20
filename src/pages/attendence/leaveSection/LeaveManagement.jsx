import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { base_emp, base_Ip } from '../../../http/services';
import AddLeaveDrawer from './AddLeaveDrawer';
import { useNavigate } from 'react-router-dom';

// TabPanel component for switching between tabs
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`leave-tabpanel-${index}`}
            aria-labelledby={`leave-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
};

const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
        case 'approved':
            return {
                bg: '#e8f5e9',
                color: '#2e7d32'
            };
        case 'pending':
            return {
                bg: '#fff3e0',
                color: '#e65100'
            };
        case 'rejected':
            return {
                bg: '#ffebee',
                color: '#c62828'
            };
        default:
            return {
                bg: '#fff3e0',
                color: '#e65100'
            };
    }
};

const LeaveManagement = () => {
    const [employeeLeaves, setEmployeeLeaves] = useState([]);
    const [managerLeaves, setManagerLeaves] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isEmployeeDataLoading, setIsEmployeeDataLoading] = useState(false);
    const [isManagerDataLoading, setIsManagerDataLoading] = useState(false);
    const [employeeError, setEmployeeError] = useState(null);
    const [managerError, setManagerError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();
    const [selectedLeave, setSelectedLeave] = useState(null);

    const handleDrawerOpen = () => setOpenDrawer(true);
    const handleDrawerClose = () => {
        setOpenDrawer(false);
        setSelectedLeave(null);
    };

    const [tab, setTab] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTab(newValue)
        setTabValue(newValue);
        // If switching to manager tab and no data loaded yet, fetch manager approvals
        if (newValue === 1 && managerLeaves.length === 0) {
            fetchManagerApprovals();
        }
       
    };

    const fetchEmployeeLeaves = useCallback(async () => {
        setIsEmployeeDataLoading(true);
        setEmployeeError(null);
        try {
            const empCode = localStorage.getItem("empCode");
            const response = await axios.get(
                `${ base_emp}/emp-handler/leave/get-all-leave?empCode=${empCode}`
            );
            
            if (response.data?.status === 201 && Array.isArray(response.data.result)) {
                setEmployeeLeaves(response.data.result);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setEmployeeError('Failed to fetch leave requests. Please try again later.');
            console.error("Error fetching employee leaves:", error);
        } finally {
            setIsEmployeeDataLoading(false);
        }
    }, []);

    const fetchManagerApprovals = useCallback(async () => {
        setIsManagerDataLoading(true);
        setManagerError(null);

        
        
        try {
            const response = await axios.get(
                `${base_emp}/emp-handler/leave/get-all-leaves-approved-by-manager?managerEmpCode=${localStorage.getItem("email")}`
            );

            console.log(response,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
            
            if (response.data?.status === 201 && Array.isArray(response.data.result)) {
                setManagerLeaves(response.data.result);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setManagerError('Failed to fetch manager approvals. Please try again later.');
            console.error("Error fetching manager approvals:", error);
        } finally {
            setIsManagerDataLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployeeLeaves();
        // Only fetch manager approvals if on manager tab
        if (tabValue === 1) {
            fetchManagerApprovals();
        }
    }, [fetchEmployeeLeaves, fetchManagerApprovals, tabValue]);

    //   useEffect(() => {
    //     fetchEmployeeLeaves();
    //     // Only fetch manager approvals if on manager tab
        
    //    fetchManagerApprovals();
        
    // }, [tabValue]);

    const handleView = (leaveData) => {
        console.log(`Viewing leave request with ID: ${leaveData.leaveId}`);
        navigate(`/dashboard-emp/emp-leave-details`, {
            state: { leaveId: leaveData.leaveId ,id:tab}
        });
    };

    const handleEdit = (leaveData) => {
        setSelectedLeave(leaveData);
        setOpenDrawer(true);
    };

    const tableHeaders = [
        'Sr. No.',
        'Employee Name',
        'Subject',
        'Duration',
        'Start Date',
        'End Date',
        'Leave Type',
        'Days',
        'Status',
        'Action'
    ];

    const renderLeaveTable = (isManager = false) => {
        const tableData = isManager ? managerLeaves : employeeLeaves;
        const isLoading = isManager ? isManagerDataLoading : isEmployeeDataLoading;
        const error = isManager ? managerError : employeeError;

        return (
            <>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : tableData.length === 0 ? (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        {isManager 
                            ? "No leave requests pending your approval." 
                            : "You haven't submitted any leave requests yet."}
                    </Alert>
                ) : (
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                            borderRadius: '8px',
                        }}
                    >
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{
                                    backgroundColor: '#1a237e',
                                    '& th': {
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        padding: '16px',
                                        whiteSpace: 'nowrap'
                                    }
                                }}>
                                    {tableHeaders.map((header, index) => (
                                        <TableCell key={index} sx={{ color: 'inherit' }}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row, index) => {
                                    const statusColors = getStatusColor(row.status);
                                    return (
                                        <TableRow
                                            key={row.leaveId || index}
                                            sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: '#ffffff' },
                                                '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' },
                                                '&:hover': { backgroundColor: '#eeeeee' },
                                                '& td': {
                                                    padding: '16px',
                                                    fontSize: '0.875rem',
                                                    whiteSpace: 'nowrap'
                                                }
                                            }}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{row.name ? row.name : "N/A"}</TableCell>
                                            <TableCell>{row.subject}</TableCell>
                                            <TableCell>{row.duration}</TableCell>
                                            <TableCell>{formatDate(row.startData)}</TableCell>
                                            <TableCell>{formatDate(row.endDate)}</TableCell>
                                            <TableCell>{row.mailType}</TableCell>
                                            <TableCell>{row.countDays}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        backgroundColor: statusColors.bg,
                                                        color: statusColors.color,
                                                        padding: '4px 12px',
                                                        borderRadius: '12px',
                                                        display: 'inline-block',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {(tab===0)?row.status : row.status==="managerapproved"? "Done" : row.status}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<VisibilityIcon />}
                                                        onClick={() => handleView(row)}
                                                        sx={{
                                                            backgroundColor: '#1a237e',
                                                            '&:hover': { backgroundColor: '#000051' },
                                                            textTransform: 'none',
                                                            borderRadius: '8px'
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                    {tabValue === 0 && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<EditIcon />}
                                                            onClick={() => handleEdit(row)}
                                                            disabled={row.status === "APPROVED"}
                                                            sx={{
                                                                backgroundColor: row.status === "APPROVED" ? '#cccccc' : '#2ed189',
                                                                '&:hover': { 
                                                                    backgroundColor: row.status === "APPROVED" ? '#cccccc' : '#25b374' 
                                                                },
                                                                textTransform: 'none',
                                                                borderRadius: '8px',
                                                                '&.Mui-disabled': {
                                                                    backgroundColor: '#cccccc',
                                                                    color: '#666666'
                                                                }
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </>
        );
    };

    return (
        <Box sx={{
            p: 3,
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
            <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                mb: 2
            }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: '#757575',
                            '&.Mui-selected': {
                                color: '#1a237e',
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#1a237e',
                            height: 3
                        }
                    }}
                >
                    <Tab label="Leave Request" id="leave-tab-0" aria-controls="leave-tabpanel-0" />
                    <Tab label="Request For the Approval" id="leave-tab-1" aria-controls="leave-tabpanel-1" />
                </Tabs>
            </Box>

            {/* Employee Tab Panel */}
            <TabPanel value={tabValue} index={0}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            color: '#1a237e',
                            borderBottom: '2px solid #1a237e',
                            paddingBottom: '8px',
                            display: 'inline-block'
                        }}
                    >
                        Leave Requests
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleDrawerOpen}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            bgcolor: '#1a237e',
                            '&:hover': { bgcolor: '#0d47a1' }
                        }}
                    >
                        New Leave Request
                    </Button>
                </Box>
                {renderLeaveTable(false)}
            </TabPanel>

            {/* Manager Tab Panel */}
            <TabPanel value={tabValue} index={1}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            color: '#1a237e',
                            borderBottom: '2px solid #1a237e',
                            paddingBottom: '8px',
                            display: 'inline-block'
                        }}
                    >
                        Leaves to Approve
                    </Typography>
                </Box>
                {renderLeaveTable(true)}
            </TabPanel>

            {/* Only show the drawer in Employee view */}
            {tabValue === 0 && (
                <AddLeaveDrawer 
                    isOpen={openDrawer}
                    onClose={() => {
                        handleDrawerClose();
                        fetchEmployeeLeaves();
                    }}
                    editData={selectedLeave}
                />
            )}
        </Box>
    );
};

export default LeaveManagement; 