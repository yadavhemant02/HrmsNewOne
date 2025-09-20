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
    TablePagination,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    InputBase,
    ToggleButton,
    ToggleButtonGroup,
    Badge,
    Tooltip,
    IconButton,
    Fade
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Work as WorkIcon,
    People as PeopleIcon,
    Refresh as RefreshIcon,
    Block as BlockIcon,
    AllInclusive as AllInclusiveIcon,
    FilterList as FilterListIcon,
    Clear as ClearIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import { base_hr } from '../../../http/services';
import AddJobDrawer from './AddJobDrawer';
import { useNavigate } from 'react-router-dom';
import ShapesLoader from '../../../constent/ShapesLoader';
import { useSelector } from 'react-redux';
import ApiKeyDialog from './ApiKeyDialog';

const AddJob = () => {
    // State Management
    const [data, setData] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [displayedData, setDisplayedData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedJobData, setSelectedJobData] = useState(null);

    const navigate = useNavigate();

    const userDetails = useSelector((state) => state.auth.user);
    // Utility Functions
    const getCounts = () => ({
        active: data.filter(job => job.status === 'active').length,
        inactive: data.filter(job => job.status !== 'active').length,
        total: data.length
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get dynamic table headers based on status filter
    const getTableHeaders = () => {
        const baseHeaders = [
            'Sr. No.',
            'Job ID',
            'Created Date',
            'Job Title',
            'Job Location',
            'Job Type',
            'Status',
            'View API Key',
            'Action',
            'Candidate',
            'Edit',
        ];

        // Only add 'Update Status' header if not viewing inactive jobs
        if (statusFilter !== 'inactive') {
            baseHeaders.push('Update Status');
        }

        return baseHeaders;
    };

    // API Calls
    const fetchJobs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${base_hr}/hr-handler/job/getall/job-post-of-organization?organizationCode=${userDetails.organizationCode}`);
            // Sort by createdAt descending (latest first)
            const sorted = (response.data || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setData(sorted);
            setFilteredData(sorted);
        } catch (error) {
            setError('Failed to fetch jobs. Please try again later.');
            console.error("Error fetching jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (jobData) => {
        try {
            await axios.get(`${base_hr}/hr-handler/job/change-status/of-job?jobId=${jobData.jobId}`);
            fetchJobs(); // Refresh the list after update
        } catch (error) {
            console.error("Error updating job status:", error);
            setError('Failed to update job status. Please try again.');
        }
    };

    // Event Handlers
    const handleDrawerOpen = () => {
        setEditMode(false);
        setSelectedJobData(null);
        setOpenDrawer(true);
    };
    
    const handleDrawerClose = () => {
        setOpenDrawer(false);
        setEditMode(false);
        setSelectedJobData(null);
    };

    const handleEdit = (jobData) => {
        setSelectedJobData(jobData);
        setEditMode(true);
        setOpenDrawer(true);
    };

    const handleStatusChange = (event, newStatus) => {
        if (newStatus !== null) {
            setStatusFilter(newStatus);
        }
    };

    const handleView = (jobData) => {
        navigate(`/dashboard-hr/show-an-jobs/${jobData.jobId}`);
    };

    const handleViewCandidate = (jobData) => {
        navigate(`/dashboard-hr/show-candidate/${jobData.jobId}`);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleGenerateLink = (jobData) => {
        setSelectedJobId(jobData.jobId);
        setApiKeyDialogOpen(true);
    };

    const handleViewApiKey = (jobData) => {

        console.log(jobData)
        navigate(`/dashboard-hr/show-api-key/${jobData.jobId}`);
    };

    // Effects
    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        let filtered = data.slice();

        // Status filter
        if (statusFilter === 'active') {
            filtered = filtered.filter(job => job.status === 'active');
        } else if (statusFilter === 'inactive') {
            filtered = filtered.filter(job => job.status !== 'active');
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(job =>
                job.jobTittel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.jobLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.jobType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.jobId?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Ensure latest first by createdAt
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFilteredData(filtered);
        // reset to first page whenever filters/search change
        setPage(0);
    }, [searchQuery, data, statusFilter]);

    // Update displayedData when filteredData, page or rowsPerPage change
    useEffect(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        setDisplayedData(filteredData.slice(start, end));
    }, [filteredData, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0);
    };

    // Component Rendering
    const renderStatusBadge = (status) => (
        <Box
            sx={{
                backgroundColor: status === 'active' ? '#e8f5e9' : '#ffebee',
                color: status === 'active' ? '#2e7d32' : '#c62828',
                padding: '4px 12px',
                borderRadius: '12px',
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 600
            }}
        >
            {status || "Active"}
        </Box>
    );

    const counts = getCounts();

    return (
        <Box sx={{
            p: 3,
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
            {/* Header Section */}
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
                    Job Listings
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
                    New Job
                </Button>
            </Box>

            {/* Status Filter Section */}
            <Box sx={{ mb: 3 }}>
                <ToggleButtonGroup
                    value={statusFilter}
                    exclusive
                    onChange={handleStatusChange}
                    aria-label="job status filter"
                    sx={{
                        width: '100%',
                        '& .MuiToggleButton-root': {
                            flex: 1,
                            py: 1.5,
                            border: '1px solid #e0e0e0',
                            '&.Mui-selected': {
                                backgroundColor: '#1a237e',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#0d47a1'
                                }
                            }
                        }
                    }}
                >
                    <ToggleButton value="all">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AllInclusiveIcon />
                            <Typography>All Jobs</Typography>
                            <Badge badgeContent={counts.total} color="primary" sx={{ ml: 1 }} />
                        </Box>
                    </ToggleButton>
                    <ToggleButton value="active">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WorkIcon />
                            <Typography>Active Jobs</Typography>
                            <Badge badgeContent={counts.active} color="success" sx={{ ml: 1 }} />
                        </Box>
                    </ToggleButton>
                    <ToggleButton value="inactive">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BlockIcon />
                            <Typography>Inactive Jobs</Typography>
                            <Badge badgeContent={counts.inactive} color="error" sx={{ ml: 1 }} />
                        </Box>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Search Section */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3
            }}>
                <Card
                    elevation={isSearchFocused ? 2 : 0}
                    sx={{
                        flex: 1,
                        maxWidth: '500px',
                        borderRadius: 2,
                        bgcolor: 'white',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
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
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                placeholder="Search jobs by title, location, type or ID..."
                                sx={{
                                    fontSize: '0.875rem',
                                    color: '#1a237e',
                                }}
                            />
                            {searchQuery && (
                                <IconButton size="small" onClick={handleClearSearch}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            )}
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
                    Showing {filteredData.length} of {data.length} jobs
                </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <ShapesLoader size="medium" />
                </Box>
            ) : (
                <>
                    {/* Table Section */}
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
                                    {getTableHeaders().map((header, index) => (
                                        <TableCell key={index} sx={{ color: 'inherit', textAlign: 'center' }}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedData.map((row, index) => (
                                    <TableRow
                                        key={row.jobId || index}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: '#ffffff',
                                            },
                                            '&:nth-of-type(even)': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                            '&:hover': {
                                                backgroundColor: '#eeeeee',
                                            },
                                            '& td': {
                                                padding: '16px',
                                                fontSize: '0.875rem',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center'
                                            }
                                        }}
                                    >
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{row.jobId}</TableCell>
                                        <TableCell>{new Date(row.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}</TableCell>
                                        <TableCell>{row.jobTittel}</TableCell>
                                        <TableCell>{row.jobLocation}</TableCell>
                                        <TableCell>{row.jobType}</TableCell>

                                        <TableCell>
                                            {renderStatusBadge(row.status)}
                                        </TableCell>

                                        <TableCell>
                                            <Tooltip title="View API Key" arrow>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => handleViewApiKey(row)}
                                                    sx={{
                                                        backgroundColor: '#1a237e',
                                                        '&:hover': {
                                                            backgroundColor: '#000051'
                                                        },
                                                        textTransform: 'none',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    View Link
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="View Job Details" arrow>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => handleView(row)}
                                                    sx={{
                                                        backgroundColor: '#1a237e',
                                                        '&:hover': {
                                                            backgroundColor: '#000051'
                                                        },
                                                        textTransform: 'none',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="View Candidates" arrow>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<PeopleIcon />}
                                                    onClick={() => handleViewCandidate(row)}
                                                    sx={{
                                                        backgroundColor: '#4caf50',
                                                        '&:hover': {
                                                            backgroundColor: '#388e3c'
                                                        },
                                                        textTransform: 'none',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    View Candidates
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit Job" arrow>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEdit(row)}
                                                    sx={{
                                                        backgroundColor: '#ff9800',
                                                        '&:hover': {
                                                            backgroundColor: '#f57c00'
                                                        },
                                                        textTransform: 'none',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                        {statusFilter !== 'inactive' && (
                                            <TableCell>
                                                <Tooltip title={`${row.status === 'active' ? 'Deactivate' : 'Activate'} Job`} arrow>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<RefreshIcon />}
                                                        onClick={() => handleUpdate(row)}
                                                        sx={{
                                                            backgroundColor: row.status === 'active' ? '#f44336' : '#4caf50',
                                                            '&:hover': {
                                                                backgroundColor: row.status === 'active' ? '#d32f2f' : '#388e3c'
                                                            },
                                                            textTransform: 'none',
                                                            borderRadius: '8px'
                                                        }}
                                                    >
                                                        {row.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                        )}

                                    </TableRow>
                                ))}
                                {filteredData.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={getTableHeaders().length} align="center" sx={{ py: 3 }}>
                                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                                <FilterListIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
                                                <Typography variant="h6" color="textSecondary">
                                                    No jobs found
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Try adjusting your search or filter criteria
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
                        count={filteredData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </>
            )}

            {/* Job Addition Drawer */}
            <AddJobDrawer
                isOpen={openDrawer}
                onClose={() => {
                    handleDrawerClose();
                    fetchJobs();
                }}
                editMode={editMode}
                jobData={selectedJobData}
            />

            {/* Quick Action Tooltips */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1
                }}
            >
                <Tooltip title="Refresh Jobs" arrow>
                    <Fade in={true}>
                        <IconButton
                            onClick={fetchJobs}
                            sx={{
                                backgroundColor: '#1a237e',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#0d47a1'
                                },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Fade>
                </Tooltip>
                <Tooltip title="Add New Job" arrow>
                    <Fade in={true}>
                        <IconButton
                            onClick={handleDrawerOpen}
                            sx={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#388e3c'
                                },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Fade>
                </Tooltip>
            </Box>

            <ApiKeyDialog
                open={apiKeyDialogOpen}
                onClose={() => setApiKeyDialogOpen(false)}
                contractId={selectedJobId}
                onSuccess={fetchJobs}
            />
        </Box>
    );
};

export default AddJob;