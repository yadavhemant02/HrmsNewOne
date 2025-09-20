import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { 
  CalendarMonth, 
  Person, 
  Work, 
  CalendarToday, 
  ArrowUpward, 
  ArrowDownward, 
  AttachMoney,
  Save,
  Print,
  Share,
  GetApp,
  Download as DownloadIcon,
  Close as CloseIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { base_hr } from '../../../http/services';

// PDF Viewer Component
const PayslipPDFViewer = ({ payslipId, employeeName, payDate }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);

  const handleOpen = async () => {
    setOpen(true);
    if (!pdfUrl) {
      await fetchPdf();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchPdf = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${base_hr}/hr-handler/api/payslip/get-payslip/of-an-espesific-month?payslipId=${payslipId}`,
        { responseType: 'blob' }
      );
      
      // Create a URL for the PDF blob
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfObjectUrl);
      
    } catch (err) {
      console.error('Error fetching PDF:', err);
      setError('Failed to load PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = pdfUrl;
      
      // Format filename
      const dateStr = payDate ? new Date(payDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      const fileName = `${employeeName.replace(/\s+/g, '_')}_Payslip_${dateStr}.pdf`;
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Clean up URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Handle zoom controls
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  // Page navigation
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1));

  // Set up PDF.js when the PDF loads
  useEffect(() => {
    if (pdfUrl && open) {
      // We'll use the embedded PDF viewer and not implement manual page control
      // as that would require PDF.js library integration which is beyond the scope here
      setCurrentPage(1);
      setTotalPages(1); // This would normally come from PDF.js
    }
  }, [pdfUrl, open]);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={handleOpen}
        sx={{ 
          backgroundColor: '#1a237e',
          '&:hover': { backgroundColor: '#000051' }
        }}
      >
        View Payslip
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: 1,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="h6" component="div" sx={{ ml: 2 }}>
            Payslip Viewer
          </Typography>
          <Box>
            <IconButton onClick={handleClose} color="inherit" aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        
        <DialogContent sx={{ 
          padding: 0, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden'
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: 2,
              p: 3,
              textAlign: 'center'
            }}>
              <Typography color="error" variant="h6">
                {error}
              </Typography>
              <Button 
                variant="outlined" 
                onClick={fetchPdf}
                color="primary"
              >
                Try Again
              </Button>
            </Box>
          ) : pdfUrl ? (
            <Box sx={{ 
              flexGrow: 1, 
              overflow: 'auto',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                title="Payslip PDF Viewer"
                width="100%"
                height="100%"
                style={{ 
                  border: 'none',
                  transform: `scale(${scale})`,
                  transformOrigin: 'center top'
                }}
              />
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <Typography>No PDF available</Typography>
            </Box>
          )}
        </DialogContent>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: 1,
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <IconButton onClick={zoomOut} disabled={scale <= 0.5}>
              <ZoomOutIcon />
            </IconButton>
            <Typography variant="body2" sx={{ mx: 1 }}>
              {Math.round(scale * 100)}%
            </Typography>
            <IconButton onClick={zoomIn} disabled={scale >= 2.5}>
              <ZoomInIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={goToPrevPage} disabled={currentPage <= 1}>
              <PrevIcon />
            </IconButton>
            <Typography variant="body2" sx={{ mx: 1 }}>
              Page {currentPage}{totalPages > 0 ? ` of ${totalPages}` : ''}
            </Typography>
            <IconButton onClick={goToNextPage} disabled={currentPage >= totalPages}>
              <NextIcon />
            </IconButton>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={!pdfUrl}
            sx={{ 
              backgroundColor: '#2ed189',
              '&:hover': { backgroundColor: '#25b374' },
              mr: 1
            }}
          >
            Download PDF
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

// Company logo component (you can replace with your actual logo)
const CompanyLogo = () => (
  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
    <span style={{ color: '#2ed189' }}>Acme</span>Corp
  </Typography>
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const PayslipDetailsPage = () => {
  const { empCode } = useParams();
  const [payslipData, setPayslipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPayslipData = async () => {
      try {
        setLoading(true);
        // Using the empCode from URL params, could also come from props
        const code = empCode || localStorage.getItem('empCode')|| 'C3AKKI240302'; // default for testing
        const response = await axios.get(`${base_hr}/hr-handler/api/payslip/get-all-payslip/of-an-emp?empCode=${code}`);
        
        if (response.data && response.data.result && response.data.result.length > 0) {
          setPayslipData(response.data.result[0]);
        } else {
          setError('No payslip data found for this employee');
        }
      } catch (err) {
        console.error('Error fetching payslip data:', err);
        setError('Failed to fetch payslip data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayslipData();
  }, [empCode]);

  // Helper function to render a section with key-value items from object
  const renderItemsFromObject = (obj) => {
    if (!obj || Object.keys(obj).length === 0) return <Typography>No data available</Typography>;
    
    return Object.entries(obj).map(([key, value]) => (
      <TableRow key={key}>
        <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
        </TableCell>
        <TableCell align="right">{formatCurrency(value)}</TableCell>
      </TableRow>
    ));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!payslipData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No payslip data available</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundImage: 'linear-gradient(135deg, rgba(250, 250, 250, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '8px',
            backgroundColor: '#2ed189'
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            top: 8,
            right: 0,
            width: '70%',
            height: '8px',
            backgroundColor: '#1a237e'
          }}
        />

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <CompanyLogo />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              Payslip
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {payslipData.payslipId}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Employee Info */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              backgroundColor: '#f5f9ff', 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: '#1a237e', 
                      width: 56, 
                      height: 56,
                      mr: 2
                    }}
                  >
                    {payslipData.employeeName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {payslipData.employeeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {payslipData.designation}
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ color: '#1a237e', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Employee Code
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', pl: 4 }}>
                      {payslipData.empCode}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Work sx={{ color: '#1a237e', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Designation
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', pl: 4 }}>
                      {payslipData.designation}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ color: '#1a237e', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Joining Date
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', pl: 4 }}>
                      {formatDate(payslipData.joiningDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              backgroundColor: '#f9f9f9',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1a237e' }}>
                  Payslip Period
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarMonth sx={{ color: '#1a237e', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Pay Period
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', pl: 4 }}>
                      {payslipData.payPeriod || 'Monthly'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ color: '#2ed189', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Start Date
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', pl: 4 }}>
                      {formatDate(payslipData.startDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ color: '#e53935', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        End Date
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', pl: 4 }}>
                      {formatDate(payslipData.endDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney sx={{ color: '#1a237e', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Pay Date
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', pl: 4 }}>
                      {formatDate(payslipData.payDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Salary Breakdown */}
        <Grid container spacing={3}>
          {/* Earnings */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              backgroundColor: '#f0f9f4',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArrowUpward sx={{ color: '#2e7d32', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    Earnings
                  </Typography>
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Component</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                          Basic Salary
                        </TableCell>
                        <TableCell align="right">{formatCurrency(payslipData.basicSalary)}</TableCell>
                      </TableRow>
                      
                      {/* Allowances */}
                      {renderItemsFromObject(payslipData.allowances)}
                      
                      {/* Benefits */}
                      {renderItemsFromObject(payslipData.benefits)}
                      
                      <TableRow sx={{ backgroundColor: 'rgba(46, 125, 50, 0.1)' }}>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          Gross Earnings
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(payslipData.grossEarnings)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Deductions */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              backgroundColor: '#fef7f7',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArrowDownward sx={{ color: '#c62828', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c62828' }}>
                    Deductions
                  </Typography>
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Component</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                          Provident Fund (PF)
                        </TableCell>
                        <TableCell align="right">{formatCurrency(payslipData.pf)}</TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                          Tax Deducted at Source (TDS)
                        </TableCell>
                        <TableCell align="right">{formatCurrency(payslipData.tds)}</TableCell>
                      </TableRow>
                      
                      {/* Other Deductions */}
                      {renderItemsFromObject(payslipData.otherDeductions)}
                      
                      <TableRow sx={{ backgroundColor: 'rgba(198, 40, 40, 0.1)' }}>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          Total Deductions
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(payslipData.totalDeductions)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Reimbursements */}
          {(payslipData.reimbursement && Object.keys(payslipData.reimbursement).length > 0) && (
            <Grid item xs={12}>
              <Card sx={{ 
                backgroundColor: '#fff9f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ed6c02' }}>
                    Reimbursements
                  </Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {renderItemsFromObject(payslipData.reimbursement)}
                        
                        <TableRow sx={{ backgroundColor: 'rgba(237, 108, 2, 0.1)' }}>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Total Reimbursements
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(payslipData.totalReimbursements)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Net Pay */}
          <Grid item xs={12}>
            <Card sx={{ 
              backgroundColor: '#e8f5e9',
              boxShadow: '0 4px 20px rgba(46, 125, 50, 0.15)',
              border: '1px solid #81c784'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Grid container alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                      Net Pay
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                      {formatCurrency(payslipData.netPay)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {/* Convert number to words - simplified version */}
                      {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(payslipData.netPay)} Rupees Only
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 3, md: 0 } }}>
                    <PayslipPDFViewer 
                      payslipId={payslipData.payslipId}
                      employeeName={payslipData.employeeName}
                      payDate={payslipData.payDate}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Footer */}
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This is a computer-generated payslip and does not require a signature.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            For any queries regarding this payslip, please contact the HR department.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PayslipDetailsPage;