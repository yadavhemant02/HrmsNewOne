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
    Chip,
    Tooltip,
    IconButton,
    Badge,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionIcon from '@mui/icons-material/Description';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { base_identity } from '../../../http/services';
import AddPaySlipDrawer from './AddPaySlipDrawer';

// Custom Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payslip-tabpanel-${index}`}
      aria-labelledby={`payslip-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EmployeePayslipList = () => {
    const [employees, setEmployees] = useState([]);
    const [generatedPayslips, setGeneratedPayslips] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPayslipsLoading, setIsPayslipsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [filteredPayslipData, setFilteredPayslipData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchGeneratedPayslips = async () => {
        setIsPayslipsLoading(true);
        try {
            const response = await axios.get(`http://localhost:7002/hr-handler/api/payslip/get-generate-payslip-currect-months`);
            if (response.data && response.data.result) {
                setGeneratedPayslips(response.data.result);
                setFilteredPayslipData(response.data.result);
            }
        } catch (error) {
            console.error("Error fetching generated payslips:", error);
        } finally {
            setIsPayslipsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchGeneratedPayslips();
    }, [refreshTrigger]);

    const fetchEmployees = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${base_identity}/identity-handler/details/get-all-all-emp/by-type?type=all`);
            setEmployees(response.data);
            setFilteredData(response.data);
        } catch (error) {
            setError('Failed to fetch employees. Please try again later.');
            console.error("Error fetching employees:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [refreshTrigger]);

    useEffect(() => {
        // Filter employees
        const filtered = employees.filter(emp => 
            emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.empCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);

        // Filter payslips
        const filteredPayslips = generatedPayslips.filter(slip => 
            slip.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            slip.empCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            slip.payslipId?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPayslipData(filteredPayslips);
    }, [searchQuery, employees, generatedPayslips]);

    // Get list of employees who already have payslips
    const employeesWithPayslip = generatedPayslips.map(slip => slip.empCode);
    
    // Filter employees who don't have payslips yet
    const employeesWithoutPayslip = filteredData.filter(
        emp => !employeesWithPayslip.includes(emp.empCode)
    );

    const handleAddPayslip = (employee) => {
        setSelectedEmployee(employee);
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
        setSelectedEmployee(null);
        // Refresh data after drawer closes
        setRefreshTrigger(prev => prev + 1);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };


  

    const handleDownloadPayslip = async (payslipId) => {
        try {
            const response = await axios.get(
                `http://localhost:7002/hr-handler/api/payslip/download/${payslipId}`,
                { responseType: 'blob' }
            );
            
            // Find the payslip data
            const payslip = generatedPayslips.find(slip => slip.payslipId === payslipId);
            
            // Create filename with employee name and current date
            const today = new Date().toISOString().split('T')[0];
            const fileName = `${payslip.employeeName.replace(/\s+/g, '_')}_Payslip_${today}.pdf`;
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading payslip:", error);
        }
    };

    const pendingTableHeaders = [
        'Sr. No.',
        'Employee Name',
        'Email',
        'Employee Code',
        'Employee Number',
        'Status',
        'Actions'
    ];

    const generatedTableHeaders = [
        'Sr. No.',
        'Payslip ID',
        'Employee Name',
        'Employee Code',
        'Designation',
        'Basic Salary',
        'Gross Earnings',
        'Total Deductions',
        'Net Pay',
        'Actions'
    ];

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
                    Employee Payslip Management
                </Typography>
                
                <IconButton 
                    onClick={handleRefresh}
                    sx={{
                        backgroundColor: '#e3f2fd',
                        '&:hover': { backgroundColor: '#bbdefb' },
                        transition: 'all 0.2s'
                    }}
                >
                    <RefreshIcon />
                </IconButton>
            </Box>

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
                                placeholder="Search by name, email, or employee code..."
                                sx={{
                                    fontSize: '0.875rem',
                                    color: '#1a237e',
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Badge 
                        badgeContent={employeesWithoutPayslip.length} 
                        color="error"
                        max={999}
                        sx={{ 
                            '& .MuiBadge-badge': {
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }
                        }}
                    >
                        <Chip
                            icon={<PendingIcon />}
                            label="Pending"
                            color={activeTab === 0 ? "primary" : "default"}
                            onClick={() => setActiveTab(0)}
                            sx={{ 
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                '&:hover': { opacity: 0.9 },
                            }}
                        />
                    </Badge>
                    
                    <Badge 
                        badgeContent={filteredPayslipData.length} 
                        color="success"
                        max={999}
                        sx={{ 
                            '& .MuiBadge-badge': {
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }
                        }}
                    >
                        <Chip
                            icon={<CheckCircleIcon />}
                            label="Generated"
                            color={activeTab === 1 ? "primary" : "default"}
                            onClick={() => setActiveTab(1)}
                            sx={{ 
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                '&:hover': { opacity: 0.9 },
                            }}
                        />
                    </Badge>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#1a237e',
                            height: 3
                        },
                        '& .Mui-selected': {
                            color: '#1a237e !important',
                            fontWeight: 'bold'
                        }
                    }}
                >
                    <Tab 
                        label="Pending Payslips" 
                        icon={<PendingIcon />} 
                        iconPosition="start"
                        sx={{ 
                            textTransform: 'none', 
                            fontWeight: 500,
                            fontSize: '0.9rem'
                        }}
                    />
                    <Tab 
                        label="Generated Payslips" 
                        icon={<DescriptionIcon />} 
                        iconPosition="start"
                        sx={{ 
                            textTransform: 'none', 
                            fontWeight: 500,
                            fontSize: '0.9rem'
                        }}
                    />
                </Tabs>
            </Box>

            {/* Pending Payslips Tab */}
            <TabPanel value={activeTab} index={0}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : employeesWithoutPayslip.length === 0 ? (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        flexDirection: 'column',
                        my: 4,
                        py: 4,
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px'
                    }}>
                        <CheckCircleIcon sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">
                            All employees have payslips generated for the current month
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}
                    >
                        <Table sx={{ minWidth: 650, overflowX:'scroll' }}>
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
                                    {pendingTableHeaders.map((header, index) => (
                                        <TableCell key={index} sx={{ color: 'inherit' }}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employeesWithoutPayslip.map((employee, index) => (
                                    <TableRow
                                        key={employee.id}
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
                                                whiteSpace: 'nowrap'
                                            }
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.email || employee.officialEmail || 'N/A'}</TableCell>
                                        <TableCell>{employee.empCode}</TableCell>
                                        <TableCell>{employee.empNumber}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label="Pending"
                                                size="small"
                                                icon={<PendingIcon sx={{ fontSize: '16px !important' }} />}
                                                sx={{
                                                    backgroundColor: '#fff3e0',
                                                    color: '#e65100',
                                                    fontWeight: 600,
                                                    '& .MuiChip-icon': {
                                                        color: '#e65100'
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<ReceiptLongIcon />}
                                                onClick={() => handleAddPayslip(employee)}
                                                sx={{
                                                    backgroundColor: '#1a237e',
                                                    '&:hover': {
                                                        backgroundColor: '#000051'
                                                    },
                                                    textTransform: 'none',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                Generate Payslip
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </TabPanel>

            {/* Generated Payslips Tab */}
            <TabPanel value={activeTab} index={1}>
                {isPayslipsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredPayslipData.length === 0 ? (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        flexDirection: 'column',
                        my: 4,
                        py: 4,
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        // overflow:'scroll'
                    }}>
                        <DescriptionIcon sx={{ fontSize: 60, color: '#616161', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">
                            No payslips have been generated yet
                        </Typography>
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
                                    overflow:'scroll',
                                    backgroundColor: '#004d40',
                                    '& th': {
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        padding: '16px',
                                        whiteSpace: 'nowrap'
                                    }
                                }}>
                                    {generatedTableHeaders.map((header, index) => (
                                        <TableCell key={index} sx={{ color: 'inherit' }}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{overflow:'scroll'}}>
                                {filteredPayslipData.map((payslip, index) => (
                                    <TableRow
                                 
                                        key={payslip.id}
                                        sx={{
                                            overflow:'scroll',
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
                                                whiteSpace: 'nowrap'
                                            }
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Tooltip title={`Generated on: ${payslip.modifyAt ? new Date(payslip.modifyAt).toLocaleString() : 'N/A'}`}>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                    {payslip.payslipId}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{payslip.employeeName}</TableCell>
                                        <TableCell>{payslip.empCode}</TableCell>
                                        <TableCell>{payslip.designation}</TableCell>
                                        <TableCell sx={{ fontWeight: 'medium' }}>₹{payslip.basicSalary.toLocaleString()}</TableCell>
                                        <TableCell sx={{ fontWeight: 'medium' }}>₹{payslip.grossEarnings.toLocaleString()}</TableCell>
                                        <TableCell sx={{ color: '#d32f2f', fontWeight: 'medium' }}>
                                            ₹{payslip.totalDeductions.toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
                                            ₹{payslip.netPay.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Download Payslip">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<FileDownloadIcon />}
                                                    onClick={() => handleDownloadPayslip(payslip.payslipId)}
                                                    sx={{
                                                        backgroundColor: '#004d40',
                                                        '&:hover': {
                                                            backgroundColor: '#00251a'
                                                        },
                                                        textTransform: 'none',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    Download
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </TabPanel>

            <AddPaySlipDrawer 
                isOpen={openDrawer}
                onClose={handleDrawerClose}
                employeeData={selectedEmployee}
            />
        </Box>
    );
};

export default EmployeePayslipList;