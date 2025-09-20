
import React, { useState, useEffect } from 'react';
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
    Card,
    CardContent,
    InputBase,
    Tabs,
    Tab,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { base_emp } from '../../../http/services';
import BackButton from '../../../constent/BackButton';

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

const LeaveRequestData = () => {
    const [data, setData] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [selectedTab, setSelectedTab] = useState('all');
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        setAction(newValue);
        fetchLeaves(newValue);
    };

    const [action, setAction] = useState("all");

    const fetchLeaves = async (filterType = action) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `${ base_emp}/emp-handler/leave/approved-leave/of-emp/${filterType}?organizationCode=${localStorage.getItem("organizationCode")}`
            );
            
            if (response.data?.status === 201 && Array.isArray(response.data.result)) {
                setData(response.data.result);
                setFilteredData(response.data.result);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setError('Failed to fetch leave requests. Please try again later.');
            console.error("Error fetching leaves:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    useEffect(() => {
        const filtered = data.filter(leave => 
            leave.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            leave.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            leave.mailType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            leave.status?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, data]);

    const handleView = (leaveData) => {
        console.log(`Viewing leave request with ID: ${leaveData.leaveId}`);
        navigate(`/dashboard-hr/leave-monitor-show`, { state: { leaveId: leaveData.leaveId } });
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

    return (
        <Box sx={{
            p: 3,
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
            <BackButton/>
            {/* Header */}
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
            </Box>

            {/* Tab Selector */}
            <Card 
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: 'white',
                    overflow: 'hidden',
                }}
            >
                <Tabs 
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            minHeight: '48px',
                            color: '#1a237e',
                        },
                        '& .Mui-selected': {
                            color: '#1a237e',
                            fontWeight: 700,
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#1a237e',
                        },
                    }}
                >
                    <Tab 
                        icon={<ListAltIcon />}
                        iconPosition="start"
                        label="All Leaves" 
                        value="all"
                    />
                    <Tab 
                        icon={<CalendarTodayIcon />}
                        iconPosition="start"
                        label="Today's Leave" 
                        value="todayleave"
                    />
                    <Tab 
                        icon={<AccessTimeIcon />}
                        iconPosition="start"
                        label="Active Leave" 
                        value="activeleave"
                    />
                </Tabs>
            </Card>

            {/* Search Section */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 2,
                mb: 3
            }}>
                <Card
                    elevation={0}
                    sx={{
                        flex: 1,
                        maxWidth: '500px',
                        borderRadius: 2,
                        bgcolor: 'white',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    <CardContent sx={{ py: '12px !important' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SearchIcon sx={{ color: '#1a237e', mr: 1 }} />
                            <InputBase
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by employee name, subject, leave type or status..."
                                sx={{
                                    fontSize: '0.875rem',
                                    color: '#1a237e',
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
                <Typography variant="body2" sx={{ 
                    color: '#1a237e',
                    fontWeight: 500,
                    backgroundColor: 'rgba(26, 35, 126, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                }}>
                    Showing {filteredData.length} of {data.length} requests
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        borderRadius: '8px',
                        // overflow: 'hidden'
                    }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{
                                backgroundColor:" #4372C8",
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
                            {filteredData.map((row, index) => {
                                const statusColors = getStatusColor(row.status);
                                return (
                                    <TableRow
                                        key={row.id || index}
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
                                        <TableCell>{row.name}</TableCell>
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
                                                {row.status}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => handleView(row)}
                                                sx={{
                                                   backgroundColor:" #4372C8",
                                                    '&:hover': { backgroundColor: '#000051' },
                                                    textTransform: 'none',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default LeaveRequestData; 