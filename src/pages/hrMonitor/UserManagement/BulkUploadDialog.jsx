import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  GetApp as GetAppIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { base_identity } from '../../../http/services';

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    minWidth: 600,
    maxWidth: 800,
    maxHeight: '90vh',
    overflow: 'hidden',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  color: 'white',
  padding: theme.spacing(3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)',
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: 400,
}));

const UploadZone = styled(Box)(({ theme, isDragActive, hasError }) => ({
  border: `2px dashed ${
    hasError
      ? theme.palette.error.main
      : isDragActive
      ? theme.palette.primary.main
      : alpha(theme.palette.primary.main, 0.3)
  }`,
  borderRadius: 12,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDragActive
    ? alpha(theme.palette.primary.main, 0.05)
    : hasError
    ? alpha(theme.palette.error.main, 0.05)
    : alpha(theme.palette.grey[100], 0.5),
  '&:hover': {
    borderColor: hasError ? theme.palette.error.main : theme.palette.primary.main,
    backgroundColor: alpha(
      hasError ? theme.palette.error.main : theme.palette.primary.main,
      0.08
    ),
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
  borderRadius: 8,
  color: 'white',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #21CBF3 30%, #1976D2 90%)',
    boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    background: alpha(theme.palette.action.disabledBackground, 0.5),
    color: alpha(theme.palette.text.disabled, 0.7),
    boxShadow: 'none',
    transform: 'none',
  },
}));

const SubtleButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  padding: theme.spacing(1.2, 2.4),
  fontWeight: 600,
  borderColor: alpha(theme.palette.primary.main, 0.3),
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
  '&:hover': {
    borderColor: alpha(theme.palette.primary.main, 0.5),
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  ...(status === 'success' && {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
  }),
  ...(status === 'error' && {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
  }),
  ...(status === 'warning' && {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.main,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
  }),
}));

// Sample data structure
const SAMPLE_DATA = [
  {
    'Name': 'John Doe',
    'Email ID': 'john.doe@example.com',
    'Phone': '9876543210',
    'Password': '123456',
    'Emp code': 'EMP001',
    'Role': 'HR',
    'Organization Name': 'Sample Organization',
    'Organization Code': 'ORG001',
    'Employee type': 'Full Time',
    'Designation': 'Manager',
    'Manager': 'manager@example.com'
  },
  {
    'Name': 'Jane Smith',
    'Email ID': 'jane.smith@example.com',
    'Phone': '9876543211',
    'Password': '123457',
    'Emp code': 'EMP002',
    'Role': 'EMP',
    'Organization Name': 'Sample Organization',
    'Organization Code': 'ORG001',
    'Employee type': 'Full Time',
    'Designation': 'Developer',
    'Manager': 'manager@example.com'
  }
];

// Required headers for validation
const REQUIRED_HEADERS = [
  'Name',
  'Email ID',
  'Phone',
  'Password',
  'Emp code',
  'Role',
  'Organization Name',
  'Organization Code',
  'Employee type',
  'Designation',
  'Manager'
];

const BulkUploadDialog = ({ open, onClose, onSuccess }) => {
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const [showUploadDetails, setShowUploadDetails] = useState(false);

  const steps = ['Download Sample', 'Upload File', 'Validate Data', 'Submit'];

  // Reset state when dialog opens/closes
  const handleClose = useCallback(() => {
    setActiveStep(0);
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    setValidationResults(null);
    setUploadResults(null);
    setShowValidationDetails(false);
    setShowUploadDetails(false);
    onClose();
  }, [onClose]);

  // Download sample Excel file
  const downloadSampleFile = useCallback(() => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(SAMPLE_DATA);
      const workbook = XLSX.utils.book_new();
      
      // Set column widths for better readability
      const colWidths = REQUIRED_HEADERS.map(header => ({
        wch: Math.max(header.length, 15)
      }));
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Data');
      
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
      
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      saveAs(blob, 'employee_bulk_upload_sample.xlsx');
      setActiveStep(1);
    } catch (error) {
      console.error('Error generating sample file:', error);
    }
  }, []);

  // Handle drag and drop events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  }, []);

  // Validate Excel file structure and data
  const validateExcelFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            reject(new Error('Excel file is empty'));
            return;
          }
          
          const headers = jsonData[0];
          const dataRows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));

          // Normalize headers for comparison
          const normalize = str => (str || '').toString().trim().toLowerCase();
          const normalizedHeaders = headers.map(normalize);
          const normalizedRequired = REQUIRED_HEADERS.map(normalize);

          // Validate headers (case/whitespace insensitive)
          const missingHeaders = REQUIRED_HEADERS.filter(
            header => !normalizedHeaders.includes(normalize(header))
          );
          const extraHeaders = headers.filter(
            header => !normalizedRequired.includes(normalize(header))
          );
          
          // Validate data
          const validationErrors = [];
          const processedData = [];
          
          dataRows.forEach((row, index) => {
            const rowData = {};
            const rowErrors = [];
            
            headers.forEach((header, headerIndex) => {
              const value = row[headerIndex];
              rowData[header] = value;
              
              // Basic validation rules
              if (REQUIRED_HEADERS.includes(header)) {
                if (!value || value.toString().trim() === '') {
                  rowErrors.push(`${header} is required`);
                } else if (header === 'Email ID' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  rowErrors.push(`${header} format is invalid`);
                } else if (header === 'Phone' && !/^\d{10}$/.test(value.toString())) {
                  rowErrors.push(`${header} must be 10 digits`);
                }
              }
            });
            
            if (rowErrors.length > 0) {
              validationErrors.push({
                row: index + 2, // +2 because we start from row 1 and skip header
                errors: rowErrors,
                data: rowData
              });
            }
            
            processedData.push(rowData);
          });
          
          const results = {
            isValid: missingHeaders.length === 0 && validationErrors.length === 0,
            totalRows: dataRows.length,
            validRows: dataRows.length - validationErrors.length,
            invalidRows: validationErrors.length,
            missingHeaders,
            extraHeaders,
            validationErrors,
            processedData: processedData.filter((_, index) => 
              !validationErrors.some(error => error.row === index + 2)
            )
          };
          
          resolve(results);
        } catch (error) {
          reject(new Error('Error reading Excel file: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsArrayBuffer(file);
    });
  }, []);

  // Handle file selection
  const handleFileSelection = useCallback(async (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
      setValidationResults({
        isValid: false,
        error: 'Please select a valid Excel file (.xlsx or .xls)'
      });
      return;
    }
    
    setSelectedFile(file);
    setActiveStep(2);
    
    try {
      const results = await validateExcelFile(file);
      setValidationResults(results);
      
      if (results.isValid) {
        setActiveStep(3);
      }
    } catch (error) {
      setValidationResults({
        isValid: false,
        error: error.message
      });
    }
  }, [validateExcelFile]);

  // Handle file input change
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  }, [handleFileSelection]);

  // Upload validated data
  const handleUpload = useCallback(async () => {
    if (!selectedFile || !validationResults?.isValid) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await axios.post(
        `${base_identity}/identity-handler/auth/add-All-bulk-existing-emp`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const results = {
        success: true,
        totalProcessed: validationResults.validRows,
        successfulInserts: validationResults.validRows - (response.data.notInserted?.length || 0),
        failedInserts: response.data.notInserted?.length || 0,
        failedEmails: response.data.notInserted || [],
        message: response.data.notInserted && response.data.notInserted.length > 0
          ? `${response.data.notInserted.length} employees could not be inserted.`
          : 'All employees uploaded successfully!'
      };
      
      setUploadResults(results);
      
      // Call onSuccess callback to refresh the main list
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResults({
        success: false,
        error: error.response?.data?.message || 'Failed to upload employees. Please try again.',
        totalProcessed: validationResults.validRows,
        successfulInserts: 0,
        failedInserts: validationResults.validRows
      });
    } finally {
      setUploading(false);
    }
  }, [selectedFile, validationResults, onSuccess]);

  // Render validation details
  const renderValidationDetails = () => {
    if (!validationResults) return null;
    
    return (
      <Paper elevation={1} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="primary">
            Validation Results
          </Typography>
          <IconButton
            onClick={() => setShowValidationDetails(!showValidationDetails)}
            size="small"
          >
            {showValidationDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <StatusChip
            icon={<InfoIcon />}
            label={`Total Rows: ${validationResults.totalRows}`}
            size="small"
          />
          <StatusChip
            icon={<CheckCircleIcon />}
            label={`Valid: ${validationResults.validRows}`}
            status="success"
            size="small"
          />
          {validationResults.invalidRows > 0 && (
            <StatusChip
              icon={<ErrorIcon />}
              label={`Invalid: ${validationResults.invalidRows}`}
              status="error"
              size="small"
            />
          )}
        </Box>
        
        <Collapse in={showValidationDetails}>
          {validationResults.missingHeaders?.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Missing Required Headers:</Typography>
              <Typography variant="body2">
                {validationResults.missingHeaders.join(', ')}
              </Typography>
            </Alert>
          )}
          
          {validationResults.extraHeaders?.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Extra Headers (will be ignored):</Typography>
              <Typography variant="body2">
                {validationResults.extraHeaders.join(', ')}
              </Typography>
            </Alert>
          )}
          
          {validationResults.validationErrors?.length > 0 && (
            <Alert severity="error">
              <Typography variant="subtitle2">Data Validation Errors:</Typography>
              <List dense>
                {validationResults.validationErrors.slice(0, 5).map((error, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={`Row ${error.row}: ${error.errors.join(', ')}`}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
                {validationResults.validationErrors.length > 5 && (
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={`... and ${validationResults.validationErrors.length - 5} more errors`}
                      primaryTypographyProps={{ variant: 'body2', fontStyle: 'italic' }}
                    />
                  </ListItem>
                )}
              </List>
            </Alert>
          )}
        </Collapse>
      </Paper>
    );
  };

  // Render upload results
  const renderUploadResults = () => {
    if (!uploadResults) return null;
    
    return (
      <Paper elevation={1} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="primary">
            Upload Results
          </Typography>
          <IconButton
            onClick={() => setShowUploadDetails(!showUploadDetails)}
            size="small"
          >
            {showUploadDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        
        <Alert severity={uploadResults.success ? 'success' : 'error'} sx={{ mb: 2 }}>
          {uploadResults.message || uploadResults.error}
        </Alert>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <StatusChip
            icon={<InfoIcon />}
            label={`Processed: ${uploadResults.totalProcessed}`}
            size="small"
          />
          <StatusChip
            icon={<CheckCircleIcon />}
            label={`Success: ${uploadResults.successfulInserts}`}
            status="success"
            size="small"
          />
          {uploadResults.failedInserts > 0 && (
            <StatusChip
              icon={<ErrorIcon />}
              label={`Failed: ${uploadResults.failedInserts}`}
              status="error"
              size="small"
            />
          )}
        </Box>
        
        <Collapse in={showUploadDetails}>
          {uploadResults.failedEmails?.length > 0 && (
            <Alert severity="warning">
              <Typography variant="subtitle2">Failed to insert these emails:</Typography>
              <List dense>
                {uploadResults.failedEmails.map((email, index) => (
                  <ListItem key={index} sx={{ py: 0.25 }}>
                    <ListItemText
                      primary={email}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}
        </Collapse>
      </Paper>
    );
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={uploading}
    >
      <StyledDialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Bulk Upload Employees
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Upload multiple employee records using Excel file
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'white' }}
            disabled={uploading}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      <StyledDialogContent>
        <Box sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          background: theme => alpha(theme.palette.primary.main, 0.03)
        }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{
            '.MuiStepLabel-label': { fontWeight: 600 },
            '.MuiStepIcon-root': {
              '&.Mui-active': { color: 'primary.main' },
              '&.Mui-completed': { color: 'success.main' }
            }
          }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <GetAppIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Download Sample File
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Download the sample Excel file to understand the required format and headers.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
              <GradientButton
                startIcon={<GetAppIcon />}
                onClick={downloadSampleFile}
                size="large"
              >
                Download Sample Excel
              </GradientButton>
              <SubtleButton
                variant="outlined"
                onClick={() => setActiveStep(1)}
                size="large"
              >
                Skip for now
              </SubtleButton>
            </Box>
          </Box>
        )}

        {activeStep >= 1 && (
          <Box>
            <UploadZone
              isDragActive={dragActive}
              hasError={validationResults && !validationResults.isValid}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {selectedFile ? selectedFile.name : 'Drop your Excel file here'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or click to browse and select file
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.7 }}>
                Supported formats: .xlsx, .xls
              </Typography>
            </UploadZone>

            {validationResults && (
              <>
                {validationResults.error ? (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {validationResults.error}
                  </Alert>
                ) : (
                  renderValidationDetails()
                )}
              </>
            )}

            {uploading && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Uploading... {uploadProgress}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress}
                  sx={{ borderRadius: 1, height: 8 }}
                />
              </Box>
            )}

            {uploadResults && renderUploadResults()}
          </Box>
        )}
      </StyledDialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          color="secondary"
          disabled={uploading}
          sx={{ textTransform: 'none' }}
        >
          {uploadResults?.success ? 'Close' : 'Cancel'}
        </Button>
        
        {activeStep === 3 && validationResults?.isValid && !uploadResults && (
          <GradientButton
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload Employees'}
          </GradientButton>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default BulkUploadDialog;