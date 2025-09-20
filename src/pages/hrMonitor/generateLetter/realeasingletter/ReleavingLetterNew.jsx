import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Divider,
  styled,
  alpha,
  useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { base_identity } from '../../../../http/services';
import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: '10px 24px',
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
  '&:hover': {
    background: 'linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)',
    boxShadow: '0 6px 14px rgba(33, 150, 243, 0.3)',
  },
}));

const ReleavingLetterNew = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const employeeData = location.state?.employeeData || {};
  const isRegenerate = location.state?.isRegenerate || false;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: employeeData.employeeId || '',
    employeeName: employeeData.employeeName || '',
    designation: employeeData.designation || '',
    department: employeeData.department || '',
    joinDate: employeeData.joinDate ? new Date(employeeData.joinDate) : null,
    relievingDate: null,
    reason: '',
    bankName: employeeData.bankName || '',
    bankAccount: employeeData.bankAccount || '',
    panNumber: employeeData.panNumber || '',
    uanNumber: employeeData.uanNumber || '',
    currentCTC: employeeData.currentCTC || '',
    officialEmail: employeeData.officialEmail || '',
    personalEmail: employeeData.personalEmail || '',
    noticePeriod: '',
    lastWorkingDay: null,
    handoverTo: '',
    handoverDate: null,
    clearanceStatus: 'pending',
    remarks: '',
    address: employeeData.address || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get the preview element
      const element = document.getElementById('releasing-letter-preview');
      if (!element) {
        setError('Relieving letter preview not found!');
        setLoading(false);
        return;
      }

      // Remove maxHeight/overflow for clean PDF
      const prevMaxHeight = element.style.maxHeight;
      const prevOverflow = element.style.overflowY;
      element.style.maxHeight = 'none';
      element.style.overflowY = 'visible';

      const empCodeValue = formData.employeeId || (formData.employeeName ? formData.employeeName.replace(/\s+/g, '_') : 'employee');
      const filename = `Relieving_Letter_${empCodeValue}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      
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
      
      // Trigger download
      html2pdf().from(element).set(opt).save();

      // Restore styles
      setTimeout(() => {
        element.style.maxHeight = prevMaxHeight;
        element.style.overflowY = prevOverflow;
      }, 1000);

      // Save to backend
      try {
        const formDataForUpload = new FormData();
        formDataForUpload.append('file', pdfBlob, filename);
        
        const response = await axios.post(
          `${base_identity}/identity-handler/details/create-releaving-letter`,
          {
            ...formData,
            organizationCode: localStorage.getItem('organizationCode'),
            joinDate: formData.joinDate?.toISOString(),
            relievingDate: formData.relievingDate?.toISOString(),
            lastWorkingDay: formData.lastWorkingDay?.toISOString(),
            handoverDate: formData.handoverDate?.toISOString()
          }
        );

        if (response.data) {
          setSuccess(true);
          setTimeout(() => {
            navigate('/dashboard-hr/realeaving-emp-list');
          }, 2000);
        }
      } catch (err) {
        setError('Error saving relieving letter to server: ' + (err.response?.data?.message || err.message));
      }
    } catch (err) {
      setError('Error generating PDF: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          {isRegenerate ? 'Regenerate' : 'Generate New'} Relieving Letter
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details below to {isRegenerate ? 'regenerate' : 'generate'} a relieving letter
        </Typography>

        <StyledPaper>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Relieving letter generated successfully! Redirecting...
              </Alert>
            )}

            <FormSection>
              <SectionTitle variant="h6">Employee Information</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee Name"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
            </FormSection>

            <Divider sx={{ my: 4 }} />

            <FormSection>
              <SectionTitle variant="h6">Employment Details</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Join Date"
                      value={formData.joinDate}
                      onChange={handleDateChange('joinDate')}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Relieving Date"
                      value={formData.relievingDate}
                      onChange={handleDateChange('relievingDate')}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason for Relieving"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
              </Grid>
            </FormSection>

            <Divider sx={{ my: 4 }} />

            <FormSection>
              <SectionTitle variant="h6">Financial Information</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bank Account Number"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="PAN Number"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="UAN Number"
                    name="uanNumber"
                    value={formData.uanNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current CTC"
                    name="currentCTC"
                    value={formData.currentCTC}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
              </Grid>
            </FormSection>

            <Divider sx={{ my: 4 }} />

            <FormSection>
              <SectionTitle variant="h6">Contact Information</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Official Email"
                    name="officialEmail"
                    value={formData.officialEmail}
                    onChange={handleChange}
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Personal Email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    type="email"
                  />
                </Grid>
              </Grid>
            </FormSection>

            <Divider sx={{ my: 4 }} />

            <FormSection>
              <SectionTitle variant="h6">Exit Process Details</SectionTitle>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Notice Period (in days)"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Last Working Day"
                      value={formData.lastWorkingDay}
                      onChange={handleDateChange('lastWorkingDay')}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Handover To"
                    name="handoverTo"
                    value={formData.handoverTo}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Handover Date"
                      value={formData.handoverDate}
                      onChange={handleDateChange('handoverDate')}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Clearance Status</InputLabel>
                    <Select
                      name="clearanceStatus"
                      value={formData.clearanceStatus}
                      onChange={handleChange}
                      label="Clearance Status"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Add Preview Section */}
            <FormSection>
              <SectionTitle variant="h6">Preview</SectionTitle>
              <Box id="releasing-letter-preview" sx={{ 
                border: '1px solid #ddd',
                p: 3,
                bgcolor: '#fff',
                maxHeight: '650px',
                overflowY: 'auto',
                boxSizing: 'border-box',
                width: '100%',
                boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
              }}>
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">K-Pro Solutions Pvt. Ltd.</Typography>
                    <Typography variant="body2">Tech Park, Sector 21, Gurugram, Haryana 122001</Typography>
                    <Typography variant="body2">Email: hr@kprosolutions.com | Phone: +91 124 4567890</Typography>
                  </Box>
                </Box>
                
                {/* Title */}
                <Box sx={{ textAlign: 'center', my: 3 }}>
                  <Typography variant="h6" sx={{ textTransform: 'uppercase', textDecoration: 'underline' }}>
                    RELIEVING LETTER
                  </Typography>
                </Box>
                
                {/* Reference Number and Date */}
                <Box>
                  <Typography variant="body1"><strong>Date:</strong> {format(new Date(), 'dd MMMM yyyy')}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>{formData.address}</strong>
                  </Typography>
                </Box>
                
                {/* Letter Body */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">
                    To: <strong>{formData.employeeName}</strong>
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    This is to certify that <strong>{formData.employeeName}</strong> was employed with <strong>K-Pro Solutions Pvt. Ltd.</strong> as <strong>{formData.designation}</strong> in the <strong>{formData.department}</strong> department (Employee ID: {formData.employeeId}).
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {formData.employeeName.split(' ')[0]} joined our organization on <strong>{formData.joinDate ? format(new Date(formData.joinDate), 'dd MMMM yyyy') : 'N/A'}</strong> and worked with us until <strong>{formData.lastWorkingDay ? format(new Date(formData.lastWorkingDay), 'dd MMMM yyyy') : 'N/A'}</strong>.
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    During {formData.employeeName.split(' ')[0]}'s tenure with us, {formData.employeeName.indexOf(' ') > -1 ? 'he/she' : 'they'} was found to be sincere, hardworking, and demonstrated a high level of professionalism in {formData.employeeName.indexOf(' ') > -1 ? 'his/her' : 'their'} work.
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    All company dues and clearances have been settled, and {formData.employeeName.indexOf(' ') > -1 ? 'he/she' : 'they'} has been officially relieved of {formData.employeeName.indexOf(' ') > -1 ? 'his/her' : 'their'} duties effective <strong>{formData.relievingDate ? format(new Date(formData.relievingDate), 'dd MMMM yyyy') : 'N/A'}</strong>.
                  </Typography>
                  
                  {formData.remarks && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {formData.remarks}
                    </Typography>
                  )}
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    We wish {formData.employeeName.split(' ')[0]} all the best for {formData.employeeName.indexOf(' ') > -1 ? 'his/her' : 'their'} future endeavors.
                  </Typography>
                </Box>
                
                {/* Signature */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body1">For <strong>K-Pro Solutions Pvt. Ltd.</strong>,</Typography>
                  <Box sx={{ mt: 2, mb: 2, height: '50px', width: '150px', bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2">Signature</Typography>
                  </Box>
                  <Typography variant="body1"><strong>HR Manager</strong></Typography>
                  <Typography variant="body1">Human Resources Department</Typography>
                </Box>
              </Box>
            </FormSection>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard-hr/realeaving-emp-list')}
                sx={{ px: 4 }}
              >
                Cancel
              </Button>
              <SubmitButton
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Generating...' : 'Generate Relieving Letter'}
              </SubmitButton>
            </Box>
          </form>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default ReleavingLetterNew;