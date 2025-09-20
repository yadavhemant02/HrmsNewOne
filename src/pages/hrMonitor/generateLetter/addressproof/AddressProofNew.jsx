import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Grid, 
  TextField, 
  Typography, 
  Paper, 
  Button, 
  Box, 
  FormControl,
  InputLabel,
  InputAdornment,
  Select,
  MenuItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { 
  Print as PrintIcon, 
  Save as SaveIcon,
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  List as ListIcon,
  Download as DownloadIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAlert } from '../../../../context/AlertContext';
import axios from 'axios';
import { base_hr, base_identity } from '../../../../http/services';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

// Application theme with enhanced colors and proper spacing
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.05)',
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// A4 page dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// Page margins in mm
const PAGE_MARGIN_MM = 15;

// Document styling for print/PDF
const documentStyles = `
  @page {
    size: A4;
    margin: ${PAGE_MARGIN_MM}mm;
  }
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    font-size: 11pt;
    line-height: 1.5;
    background-color: white;
    color: black;
  }
  .page-container {
    width: ${A4_WIDTH_MM - (PAGE_MARGIN_MM * 2)}mm;
    padding: 0;
    box-sizing: border-box;
    position: relative;
  }
  .letter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .company-logo {
    width: 80px;
    height: 40px;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .letter-date {
    margin: 20px 0;
  }
  .letter-body {
    margin-bottom: 30px;
  }
  .letter-body p {
    margin: 12px 0;
    text-align: justify;
  }
  .signature-container {
    margin-top: 50px;
  }
  .signature-placeholder {
    height: 50px;
    width: 150px;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 10px 0;
  }
`;

// Form steps
const steps = ['Employee Information', 'Address Details', 'Preview & Print'];

// Letter types
const letterTypes = [
  'To Whom It May Concern',
  'For Bank Verification',
  'For Visa Application',
  'For Rental Agreement',
  'For Government Verification'
];

const AddressProofNew = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [organizationCode] = useState(localStorage.getItem('organizationCode')); 
  const previewRef = useRef();

  // Fetch company logo
  useEffect(() => {
    const fetchLogo = async () => {
      if (!organizationCode) {
        showAlert('Organization code is required', 'error');
        return;
      }

      try {
        setLoadingLogo(true);
        const response = await axios.get(`${base_identity}/identity-handler/logo/get-comapny-logo?organizationCode=${organizationCode}`);
        
        if (response.data && response.data.logo) {
          setLogo(response.data.logo);
        } else {
          showAlert('No logo found for the organization', 'warning');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        if (error.response) {
          showAlert(`Error loading company logo: ${error.response.data.message || 'Server error'}`, 'error');
        } else if (error.request) {
          showAlert('Error loading company logo: No response from server', 'error');
        } else {
          showAlert('Error loading company logo: ' + error.message, 'error');
        }
      } finally {
        setLoadingLogo(false);
      }
    };

    fetchLogo();
  }, [showAlert, organizationCode]);

  // State for tracking active step
  const [activeStep, setActiveStep] = useState(0);
  
  // Get current date
  const currentDate = new Date();
  
  // State for form fields
  const [formData, setFormData] = useState({
    // Letter details
    letterDate: currentDate,
    referenceNumber: '',
    letterType: 'To Whom It May Concern',
    
    // Employee details
    employeeId: '',
    employeeName: '',
    designation: '',
    department: '',
    joiningDate: new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate()),
    
    // Address details
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    
    // Additional details
    additionalNote: '',
    
    // Signatory
    signatoryName: 'Smita Kashyap',
    signatoryDesignation: 'Director, Human Resources'
  });

  // State for loading operations
  const [loading, setLoading] = useState({
    saving: false,
    printing: false,
    downloading: false
  });

  // Generate reference number if empty
  useEffect(() => {
    if (!formData.referenceNumber && formData.employeeId) {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      setFormData(prev => ({
        ...prev,
        referenceNumber: `ADR/${year}/${month}/${formData.employeeId}`
      }));
    }
  }, [formData.employeeId]);

  // Get formatted full address
  const getFormattedAddress = () => {
    const addressParts = [
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
      formData.state,
      formData.postalCode,
      formData.country
    ].filter(part => part.trim() !== '');
    
    return addressParts.join(', ');
  };

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };

  // Navigation functions
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Replace printAddressProofLetter with handleDownloadAndSavePDF
  const handleDownloadAndSavePDF = async () => {
    try {
      setLoading(prev => ({ ...prev, printing: true }));
      const element = previewRef.current;
      if (!element) {
        showAlert('Preview not found!', 'error');
        setLoading(prev => ({ ...prev, printing: false }));
        return;
      }
      // Remove maxHeight/overflow for clean PDF
      const prevMaxHeight = element.style.maxHeight;
      const prevOverflow = element.style.overflowY;
      element.style.maxHeight = 'none';
      element.style.overflowY = 'visible';
      const filename = `AddressProofLetter_${formData.employeeId || formData.employeeName || 'employee'}.pdf`;
      const opt = {
        margin: [0, 0, 0, 0],
        filename,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      // Generate the PDF and get the Blob
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');

      // Download locally
      html2pdf().from(element).set(opt).save();

      // Prepare FormData for API
      const formDataToSend = new FormData();
      formDataToSend.append('file', pdfBlob, filename);

      // Build API URL with query params
      const apiUrl = `${base_hr}/hr-handler/api/address-letter/save-address-pdf-data` +
        `?empCode=${encodeURIComponent(formData.employeeId)}` +
        `&name=${encodeURIComponent(formData.employeeName)}` +
        `&email=${encodeURIComponent(formData.email)}` +
        `&organizationCode=${encodeURIComponent(organizationCode)}`;

      // POST to API
      await axios.post(apiUrl, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showAlert('PDF generated and saved to server successfully!', 'success');
      setTimeout(() => {
        element.style.maxHeight = prevMaxHeight;
        element.style.overflowY = prevOverflow;
      }, 1000);
    } catch (error) {
      console.error('PDF generation or upload error:', error);
      showAlert('Error generating or saving PDF: ' + error.message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, printing: false }));
    }
  };

  // Save form data
  const saveFormData = () => {
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      localStorage.setItem('addressProofLetterData', JSON.stringify(formData));
      
      setTimeout(() => {
        showAlert('Address proof letter data saved successfully!', 'success');
        setLoading(prev => ({ ...prev, saving: false }));
      }, 500);
      
    } catch (error) {
      console.error('Save error:', error);
      showAlert('Error saving form data: ' + error.message, 'error');
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  // Load saved form data
  useEffect(() => {
    const savedData = localStorage.getItem('addressProofLetterData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Convert date strings back to Date objects
        if (parsedData.letterDate) {
          parsedData.letterDate = new Date(parsedData.letterDate);
        }
        if (parsedData.joiningDate) {
          parsedData.joiningDate = new Date(parsedData.joiningDate);
        }
        
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Form validation
  const validateCurrentStep = () => {
    if (activeStep === 0) {
      // Validate employee information
      return formData.employeeId && formData.employeeName && formData.designation && formData.department;
    } else if (activeStep === 1) {
      // Validate address details
      return formData.addressLine1 && formData.city && formData.state && formData.postalCode;
    }
    return true;
  };

  // Form content based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Employee Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date of Joining"
                value={formData.joiningDate}
                onChange={(date) => handleDateChange('joiningDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Reference Number"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                helperText="Auto-generated if left empty"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Letter Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Letter Date"
                value={formData.letterDate}
                onChange={(date) => handleDateChange('letterDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="letter-type-label">Letter Type</InputLabel>
                <Select
                  labelId="letter-type-label"
                  id="letter-type"
                  name="letterType"
                  value={formData.letterType}
                  onChange={handleChange}
                  label="Letter Type"
                >
                  {letterTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Signatory Name"
                name="signatoryName"
                value={formData.signatoryName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Signatory Designation"
                name="signatoryDesignation"
                value={formData.signatoryDesignation}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Residential Address Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                placeholder="House/Flat Number, Building Name, Street"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Address Line 2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Locality, Area (Optional)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Postal/ZIP Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Additional Note (Optional)"
                name="additionalNote"
                value={formData.additionalNote}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                placeholder="Any additional information or specific purpose for the letter"
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom>
                  Address Proof Letter Preview
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    ml: 2
                  }}
                >
                  Edit Letter Content
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Box id="address-proof-preview" sx={{ 
                border: '1px solid #ddd',
                p: 3,
                bgcolor: '#fff',
                maxHeight: '650px',
                overflowY: 'auto',
                boxSizing: 'border-box',
                width: '100%',
                boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
              }} ref={previewRef}>
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">K-Pro Solutions Pvt. Ltd.</Typography>
                    <Typography variant="body2">Tech Park, Sector 21, Gurugram, Haryana 122001</Typography>
                    <Typography variant="body2">Email: hr@kprosolutions.com | Phone: +91 124 4567890</Typography>
                  </Box>
                  <Box sx={{ width: '80px', height: '40px', bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {loadingLogo ? (
                      <CircularProgress size={24} />
                    ) : logo ? (
                      <img 
                        src={`data:image/png;base64,${logo}`} 
                        alt="Company Logo" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                      />
                    ) : (
                      <Typography variant="body2">LOGO</Typography>
                    )}
                  </Box>
                </Box>
                
                {/* Title */}
                <Box sx={{ textAlign: 'center', my: 3 }}>
                  <Typography variant="h6" sx={{ textTransform: 'uppercase', textDecoration: 'underline' }}>
                    ADDRESS PROOF LETTER
                  </Typography>
                </Box>
                
                {/* Reference Number and Date */}
                <Box>
                  <Typography variant="body1"><strong>Reference:</strong> {formData.referenceNumber}</Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}><strong>Date:</strong> {format(new Date(formData.letterDate), 'dd MMMM yyyy')}</Typography>
                </Box>
                
                {/* Letter Body */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1"><strong>{formData.letterType}</strong></Typography>
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    This is to certify that <strong>{formData.employeeName}</strong> (Employee ID: {formData.employeeId}) is an employee of <strong>K-Pro Solutions Pvt. Ltd.</strong> and has been working with us as <strong>{formData.designation}</strong> in the <strong>{formData.department}</strong> department since <strong>{format(new Date(formData.joiningDate), 'dd MMMM yyyy')}</strong>.
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    We confirm that the residential address of <strong>{formData.employeeName}</strong> as per our records is:
                  </Typography>
                  
                  <Box sx={{ ml: 4, my: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formData.addressLine1}
                    </Typography>
                    {formData.addressLine2 && (
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formData.addressLine2}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formData.city}, {formData.state} - {formData.postalCode}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formData.country}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    This letter is issued at the request of the employee for the purpose of address verification.
                  </Typography>
                  
                  {formData.additionalNote && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {formData.additionalNote}
                    </Typography>
                  )}
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    For any further clarification or information, please feel free to contact the undersigned.
                  </Typography>
                </Box>
                
                {/* Signature */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body1">For <strong>K-Pro Solutions Pvt. Ltd.</strong>,</Typography>
                  <Box sx={{ mt: 2, mb: 2, height: '50px', width: '150px', bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2">Signature</Typography>
                  </Box>
                  <Typography variant="body1"><strong>{formData.signatoryName}</strong></Typography>
                  <Typography variant="body1">{formData.signatoryDesignation}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  // Navigation buttons based on active step
  const renderNavigationButtons = () => {
    if (activeStep === steps.length - 1) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadAndSavePDF}
            startIcon={<SaveIcon />}
            sx={{
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              color: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
                backgroundColor: '#388e3c',
              },
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            disabled={loading.printing}
          >
            {loading.printing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Downloading...
              </>
            ) : (
              'Download & Save'
            )}
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Box>
          {activeStep > 0 && (
            <Button
              color="primary"
              onClick={handleBack}
              startIcon={<PrevIcon />}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
          )}
        </Box>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            endIcon={<NextIcon />}
            disabled={!validateCurrentStep()}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" sx={{ mb: 6 }}>
          <Box 
  sx={{ 
    display: 'flex',  
    alignItems: 'center', 
    mb: 3, 
    mt: 3,
    gap: 2 // Small gap between button and heading
  }}
>             
  <Button               
    variant="outlined"               
    color="primary"               
    startIcon={<ListIcon />}               
    onClick={() => navigate('/dashboard-hr/address-proof-emp-list')}               
    sx={{                 
      borderRadius: 2,                 
      textTransform: 'none',                 
      px: 3,                 
      py: 1,                 
      '&:hover': {                   
        backgroundColor: 'rgba(25, 118, 210, 0.04)',                 
      },               
    }}             
  >               
    Back to List             
  </Button>             

  <Typography 
    variant="h4" 
    component="h1"
    sx={{ 
      ml: 2 // Small left margin for spacing from button
    }}
  >               
    Address Proof Letter Generator             
  </Typography>           
</Box>
          
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {getStepContent(activeStep)}
            
            {renderNavigationButtons()}
          </Paper>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default AddressProofNew;