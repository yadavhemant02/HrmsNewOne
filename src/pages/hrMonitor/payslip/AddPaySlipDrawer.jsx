import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Fab,
  Chip
} from "@mui/material";
import CalculateIcon from '@mui/icons-material/Calculate';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { base_hr } from "../../../http/services";

const AddPaySlipDrawer = ({ isOpen, onClose, employeeData }) => {
  // Dialog state
  const [calculatorDialogOpen, setCalculatorDialogOpen] = useState(false);
  const [calculationData, setCalculationData] = useState({
    basicSalary: 0
  });

  // Dialog for adding new key-value pairs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newItemType, setNewItemType] = useState("");
  const [newItemKey, setNewItemKey] = useState("");
  const [newItemValue, setNewItemValue] = useState(0);

  const [formData, setFormData] = useState({
    empCode: "",
    employeeName: "",
    designation: "",
    joiningDate: "",
    payPeriod: "",
    startDate: "",
    endDate: "",
    payDate: "",
    basicSalary: 0,
    allowances: {},
    totalAllowances: 0,
    benefits: {},
    totalBenefits: 0,
    grossEarnings: 0,
    pf: 0,
    tds: 0,
    otherDeductions: {},
    totalDeductions: 0,
    reimbursement: {},
    totalReimbursements: 0,
    netPay: 0
  });

  // Helper function to display values (hide zero values)
  const displayValue = (value, isNumber = true) => {
    if (isNumber) {
      return value === 0 ? "" : value;
    }
    return value;
  };

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (employeeData) {
      setFormData(prev => ({
        ...prev,
        empCode: employeeData.empCode || "",
        employeeName: employeeData.name || "",
        designation: employeeData.disignation || "",
        joiningDate: employeeData.dateOfJoin || "",
      }));
      
      // Also update calculation data with employee name
      setCalculationData(prev => ({
        ...prev,
        employeeName: employeeData.name || ""
      }));
    }
  }, [employeeData]);

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Convert string to number for numeric fields
    if ([
      'basicSalary', 'totalAllowances', 'totalBenefits', 'grossEarnings',
      'pf', 'tds', 'totalDeductions', 'totalReimbursements', 'netPay'
    ].includes(name)) {
      updatedValue = value === "" ? 0 : Number(value);
    }

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: updatedValue
      };

      // Recalculate totals and update dependent fields
      updateDerivedValues(newData);

      return newData;
    });
  };

  // Function to add a new item to a dynamic object (allowances, benefits, etc.)
  const handleAddItem = () => {
    if (newItemKey.trim() === "" || newItemType === "") {
      setAlertMessage("Please provide both a name and a type for the new item");
      setAlertSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setFormData(prev => {
      const newData = { ...prev };
      
      // Add the new item to the appropriate object
      newData[newItemType] = {
        ...newData[newItemType],
        [newItemKey]: Number(newItemValue)
      };
      
      // Recalculate totals
      updateDerivedValues(newData);
      
      return newData;
    });

    // Reset the dialog fields
    setNewItemKey("");
    setNewItemValue(0);
    setAddDialogOpen(false);
  };

  // Function to delete an item from a dynamic object
  const handleDeleteItem = (type, key) => {
    setFormData(prev => {
      const newData = { ...prev };
      const updatedTypeObject = { ...newData[type] };
      
      // Delete the specified key
      delete updatedTypeObject[key];
      
      // Update the object in the form data
      newData[type] = updatedTypeObject;
      
      // Recalculate totals
      updateDerivedValues(newData);
      
      return newData;
    });
  };

  // Function to update all derived values (totals, gross, net pay)
  const updateDerivedValues = (data) => {
    // Calculate total allowances
    data.totalAllowances = Object.values(data.allowances).reduce((sum, val) => sum + Number(val), 0);
    
    // Calculate total benefits
    data.totalBenefits = Object.values(data.benefits).reduce((sum, val) => sum + Number(val), 0);
    
    // Calculate gross earnings
    data.grossEarnings = data.basicSalary + data.totalAllowances + data.totalBenefits;
    
    // Calculate total other deductions
    const otherDeductionsTotal = Object.values(data.otherDeductions).reduce((sum, val) => sum + Number(val), 0);
    
    // Calculate total deductions
    data.totalDeductions = data.pf + data.tds + otherDeductionsTotal;
    
    // Calculate total reimbursements
    data.totalReimbursements = Object.values(data.reimbursement).reduce((sum, val) => sum + Number(val), 0);
    
    // Calculate net pay
    data.netPay = data.grossEarnings - data.totalDeductions + data.totalReimbursements;
    
    return data;
  };

  // Handle changes in the calculator dialog
  const handleCalculationChange = (e) => {
    const { name, value } = e.target;
    setCalculationData(prev => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value)
    }));
  };

  // Calculate tax deductions based on salary
  const calculateTaxDeductions = (basicSalary, allowancesTotal, benefitsTotal) => {
    const grossSalary = basicSalary + allowancesTotal + benefitsTotal;
    
    // Calculate PF (12% of basic salary, capped at a certain amount)
    const pfRate = 0.12;
    const pfCap = 15000; // Maximum monthly basic salary for PF calculation
    const pfableAmount = Math.min(basicSalary, pfCap);
    const pf = Math.round(pfableAmount * pfRate);
    
    // Calculate TDS (simplified progressive tax calculation)
    let tds = 0;
    const annualGrossSalary = grossSalary * 12;
    
    if (annualGrossSalary <= 250000) {
      tds = 0;
    } else if (annualGrossSalary <= 500000) {
      tds = Math.round(((annualGrossSalary - 250000) * 0.05) / 12);
    } else if (annualGrossSalary <= 750000) {
      tds = Math.round(((250000 * 0.05) + ((annualGrossSalary - 500000) * 0.10)) / 12);
    } else if (annualGrossSalary <= 1000000) {
      tds = Math.round(((250000 * 0.05) + (250000 * 0.10) + ((annualGrossSalary - 750000) * 0.15)) / 12);
    } else if (annualGrossSalary <= 1250000) {
      tds = Math.round(((250000 * 0.05) + (250000 * 0.10) + (250000 * 0.15) + ((annualGrossSalary - 1000000) * 0.20)) / 12);
    } else {
      tds = Math.round(((250000 * 0.05) + (250000 * 0.10) + (250000 * 0.15) + (250000 * 0.20) + ((annualGrossSalary - 1250000) * 0.30)) / 12);
    }
    
    // Professional tax (simplified)
    const professionalTax = grossSalary > 15000 ? 200 : 150;
    
    // Sample other standard deduction
    const healthInsurance = Math.round(grossSalary * 0.005); // 0.5% for health insurance
    
    return { 
      pf, 
      tds, 
      otherDeductions: {
        "Professional Tax": professionalTax,
        "Health Insurance": healthInsurance
      }
    };
  };

  // Apply calculations to the form
  const applyCalculations = () => {
    const { basicSalary } = calculationData;
    
    // Sample allowances and benefits
    const defaultAllowances = {
      "HRA": Math.round(basicSalary * 0.4),
      "Conveyance": 1600,
      "Medical": 1250
    };
    
    const defaultBenefits = {
      "Special Allowance": Math.round(basicSalary * 0.1),
      "Performance Bonus": Math.round(basicSalary * 0.05)
    };
    
    // Calculate totals
    const totalAllowances = Object.values(defaultAllowances).reduce((sum, val) => sum + val, 0);
    const totalBenefits = Object.values(defaultBenefits).reduce((sum, val) => sum + val, 0);
    
    // Calculate deductions
    const { pf, tds, otherDeductions } = calculateTaxDeductions(basicSalary, totalAllowances, totalBenefits);
    const totalOtherDeductions = Object.values(otherDeductions).reduce((sum, val) => sum + val, 0);
    
    // Update form data
    setFormData(prev => {
      const newData = {
        ...prev,
        basicSalary,
        allowances: defaultAllowances,
        totalAllowances,
        benefits: defaultBenefits,
        totalBenefits,
        grossEarnings: basicSalary + totalAllowances + totalBenefits,
        pf,
        tds,
        otherDeductions,
        totalDeductions: pf + tds + totalOtherDeductions,
        reimbursement: {},
        totalReimbursements: 0
      };
      
      // Calculate net pay
      newData.netPay = newData.grossEarnings - newData.totalDeductions + newData.totalReimbursements;
      
      return newData;
    });
    
    setCalculatorDialogOpen(false);
    setAlertMessage("Salary structure calculated and applied successfully!");
    setAlertSeverity("success");
    setOpenSnackbar(true);
  };

  const preparePayloadForApi = () => {
    // Convert the form data to match the expected API format
    return {
      empCode: formData.empCode,
      employeeName: formData.employeeName,
      designation: formData.designation,
      joiningDate: formData.joiningDate,
      payPeriod: formData.payPeriod,
      startDate: formData.startDate,
      endDate: formData.endDate,
      payDate: formData.payDate,
      basicSalary: formData.basicSalary,
      allowances: formData.allowances,
      totalAllowances: formData.totalAllowances,
      benefits: formData.benefits,
      totalBenefits: formData.totalBenefits,
      grossEarnings: formData.grossEarnings,
      pf: formData.pf,
      tds: formData.tds,
      otherDeductions: formData.otherDeductions,
      totalDeductions: formData.totalDeductions,
      reimbursement: formData.reimbursement,
      totalReimbursements: formData.totalReimbursements,
      netPay: formData.netPay
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = preparePayloadForApi();
      const response = await axios.post(
        `http://localhost:7002/hr-handler/api/payslip/generate`,
        payload,
        {
          responseType: 'blob' // Important for receiving binary data like PDF
        }
      );
      
      // Create a URL for the PDF blob
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfObjectUrl);
      
      setAlertMessage("Payslip added successfully! PDF generated.");
      setAlertSeverity("success");
      setOpenSnackbar(true);
      
      // Don't close the drawer right away so user can download PDF
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Failed to add payslip!");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    setPdfLoading(true);
    try {
      const payload = preparePayloadForApi();
      const response = await axios.post(
        `http://localhost:7002/hr-handler/api/payslip/generate`,
        payload,
        {
          responseType: 'blob' // Important for receiving binary data like PDF
        }
      );
      
      // Create a URL for the PDF blob
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfObjectUrl);
      
      setAlertMessage("Payslip PDF generated successfully!");
      setAlertSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setAlertMessage("Failed to generate PDF!");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = pdfUrl;
      
      // Format current date for filename
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);
      
      // Set filename with employee name and current date
      const fileName = `${formData.employeeName.replace(/\s+/g, '_')}_Payslip_${dateStr}.pdf`;
      a.download = fileName;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const clearForm = () => {
    // Clear PDF URL if exists
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    
    setFormData({
      empCode: "",
      employeeName: "",
      designation: "",
      joiningDate: "",
      payPeriod: "",
      startDate: "",
      endDate: "",
      payDate: "",
      basicSalary: 0,
      allowances: {},
      totalAllowances: 0,
      benefits: {},
      totalBenefits: 0,
      grossEarnings: 0,
      pf: 0,
      tds: 0,
      otherDeductions: {},
      totalDeductions: 0,
      reimbursement: {},
      totalReimbursements: 0,
      netPay: 0
    });
    
    onClose();
  };

  // Render a dynamic key-value section
  const renderDynamicSection = (title, description, type, data, total, color) => {
    return (
      <Grid item xs={12}>
        <Paper elevation={0} sx={{ 
          p: 2, 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px',
          backgroundColor: color ? `${color}10` : 'transparent' // Light background based on color
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2 
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: color || '#444' }}>
              {title}
            </Typography>
            <Tooltip title={`Add new ${type}`}>
              <Fab 
                size="small" 
                color="primary" 
                onClick={() => {
                  setNewItemType(type);
                  setAddDialogOpen(true);
                }}
                sx={{ 
                  backgroundColor: color || '#1976d2',
                  '&:hover': { backgroundColor: color ? `${color}DD` : '#1565c0' }
                }}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
          
          {Object.keys(data).length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', my: 2 }}>
              No items added yet. Click the + button to add.
            </Typography>
          ) : (
            <List dense sx={{ 
              maxHeight: '200px', 
              overflowY: 'auto', 
              border: '1px solid #e0e0e0', 
              borderRadius: '4px',
              mb: 2
            }}>
              {Object.entries(data).map(([key, value]) => (
                <ListItem 
                  key={key}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleDeleteItem(type, key)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">{key}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ₹{Number(value).toLocaleString()}
                        </Typography>
                      </Box>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            p: 1,
            borderTop: '1px solid #e0e0e0',
            backgroundColor: color ? `${color}15` : '#f5f5f5',
            borderRadius: '4px'
          }}>
            <Typography variant="subtitle2" fontWeight="bold">Total</Typography>
            <Typography variant="subtitle2" fontWeight="bold">
              {total > 0 ? `₹${Number(total).toLocaleString()}` : ''}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    );
  };

  return (
    <>
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Box sx={{
          width: 650,
          height: "100%",
          padding: 2,
          mt: "64px",
          bgcolor: "background.paper",
          overflowY: "auto",
        }}>
          <Box sx={{
            border: "1px solid rgba(46, 209, 137, 0.5)",
            borderRadius: "10px",
            padding: { xs: "20px", md: "30px" },
            margin: "auto",
          }}>
            <Typography variant="h4" component="p" sx={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}>
              Add New Payslip
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<CalculateIcon />}
                onClick={() => setCalculatorDialogOpen(true)}
                sx={{
                  backgroundColor: "#2ed189",
                  "&:hover": { backgroundColor: "#25b374" },
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(46, 209, 137, 0.3)",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  textTransform: "none",
                  fontSize: "1rem",
                  flex: 1
                }}
              >
                Calculate Salary
              </Button>

              {formData.netPay > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleGeneratePdf}
                  disabled={pdfLoading}
                  sx={{
                    borderColor: "#2ed189",
                    color: "#2ed189",
                    "&:hover": { 
                      borderColor: "#25b374",
                      backgroundColor: "rgba(46, 209, 137, 0.1)"
                    },
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    textTransform: "none",
                    fontSize: "1rem",
                    flex: 1
                  }}
                >
                  {pdfLoading ? <CircularProgress size={24} color="inherit" /> : "Preview PDF"}
                </Button>
              )}
            </Box>

            {pdfUrl && (
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  border: '1px dashed #2ed189', 
                  borderRadius: '8px',
                  backgroundColor: 'rgba(46, 209, 137, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PictureAsPdfIcon sx={{ color: '#e53935', mr: 1 }} />
                  <Typography variant="body1">
                    Payslip PDF Ready for {formData.employeeName}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={downloadPdf}
                  size="small"
                  sx={{
                    backgroundColor: "#e53935",
                    "&:hover": { backgroundColor: "#c62828" },
                  }}
                >
                  Download
                </Button>
              </Box>
            )}

            <Grid container spacing={2}>
              {/* Employee Details */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#444' }}>
                  Employee Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="empCode"
                  label="Employee Code"
                  value={formData.empCode}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="employeeName"
                  label="Employee Name"
                  value={formData.employeeName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="designation"
                  label="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="joiningDate"
                  label="Joining Date"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Pay Period Details */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#444' }}>
                  Pay Period
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="payPeriod"
                  label="Pay Period"
                  value={formData.payPeriod}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="endDate"
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="payDate"
                  label="Pay Date"
                  type="date"
                  value={formData.payDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Basic Salary */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#444' }}>
                  Salary Structure
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="basicSalary"
                  label="Basic Salary"
                  type="number"
                  value={displayValue(formData.basicSalary)}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontWeight: "medium"
                    },
                  }}
                />
              </Grid>

              {/* Dynamic Sections */}
              {renderDynamicSection(
                "Allowances", 
                "Add fixed allowances like HRA, transport allowance, etc.", 
                "allowances", 
                formData.allowances, 
                formData.totalAllowances,
                "#2196f3" // Blue
              )}
              
              {renderDynamicSection(
                "Benefits", 
                "Add other benefits like bonuses, performance incentives, etc.", 
                "benefits", 
                formData.benefits, 
                formData.totalBenefits,
                "#4caf50" // Green
              )}

              {/* Gross Earnings */}
              <Grid item xs={12}>
                <TextField
                  name="grossEarnings"
                  label="Gross Earnings"
                  type="number"
                  value={displayValue(formData.grossEarnings)}
                  InputProps={{ 
                    readOnly: true,
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  fullWidth
                  sx={{ 
                    backgroundColor: formData.grossEarnings > 0 ? "#f0f9f4" : "transparent",
                    "& .MuiOutlinedInput-root": {
                      fontWeight: "bold"
                    },
                  }}
                />
              </Grid>

              {/* Statutory Deductions */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#444' }}>
                  Statutory Deductions
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="pf"
                  label="Provident Fund (PF)"
                  type="number"
                  value={displayValue(formData.pf)}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="tds"
                  label="Tax Deducted at Source (TDS)"
                  type="number"
                  value={displayValue(formData.tds)}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Other Deductions */}
              {renderDynamicSection(
                "Other Deductions", 
                "Add other deductions like professional tax, loans, advances, etc.", 
                "otherDeductions", 
                formData.otherDeductions, 
                Object.values(formData.otherDeductions).reduce((sum, val) => sum + Number(val), 0),
                "#f44336" // Red
              )}

              {/* Total Deductions */}
              <Grid item xs={12}>
                <TextField
                  name="totalDeductions"
                  label="Total Deductions"
                  type="number"
                  value={displayValue(formData.totalDeductions)}
                  InputProps={{ 
                    readOnly: true,
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  fullWidth
                  sx={{ 
                    backgroundColor: formData.totalDeductions > 0 ? "#ffebee" : "transparent",
                    "& .MuiOutlinedInput-root": {
                      color: formData.totalDeductions > 0 ? "#d32f2f" : "inherit",
                      fontWeight: "bold"
                    },
                  }}
                />
              </Grid>

              {/* Reimbursements */}
              {renderDynamicSection(
                "Reimbursements", 
                "Add reimbursements like travel, medical, education, etc.", 
                "reimbursement", 
                formData.reimbursement, 
                formData.totalReimbursements,
                "#ff9800" // Orange
              )}

              {/* Net Pay */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#444' }}>
                  Net Pay
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="netPay"
                  label="Net Pay"
                  type="number"
                  value={displayValue(formData.netPay)}
                  InputProps={{ 
                    readOnly: true,
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  fullWidth
                  sx={{ 
                    backgroundColor: formData.netPay > 0 ? "#f0f9f4" : "transparent",
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#2ed189",
                      fontWeight: "bold"
                    },
                    "& .MuiInputBase-input": {
                      fontWeight: "bold",
                      fontSize: "1.1rem"
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={clearForm}
                    sx={{
                      width: "100%",
                      borderColor: "#9e9e9e",
                      color: "#9e9e9e",
                      "&:hover": { 
                        borderColor: "#757575",
                        backgroundColor: "rgba(0, 0, 0, 0.04)"
                      },
                      padding: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      width: "100%",
                      backgroundColor: "#2ed189",
                      "&:hover": { backgroundColor: "#25b374" },
                      padding: "12px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 10px rgba(46, 209, 137, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Payslip"}
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert
                onClose={() => setOpenSnackbar(false)}
                severity={alertSeverity}
                sx={{ width: "100%" }}
              >
                {alertMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Drawer>

      {/* Salary Calculator Dialog */}
      <Dialog 
        open={calculatorDialogOpen} 
        onClose={() => setCalculatorDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Salary Calculator
          <IconButton
            aria-label="close"
            onClick={() => setCalculatorDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            Employee: {formData.employeeName}
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="basicSalary"
                label="Basic Salary"
                type="number"
                value={displayValue(calculationData.basicSalary)}
                onChange={handleCalculationChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                autoFocus
              />
            </Grid>
          </Grid>

          {calculationData.basicSalary > 0 && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: "#f0f9f4", borderRadius: "8px" }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Auto-Calculate Preview:
              </Typography>
              
              <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 1 }}>
                <b>Standard Allowances:</b>
              </Typography>
              <Typography variant="body2">
                • HRA: ₹{Math.round(calculationData.basicSalary * 0.4).toLocaleString()} (40% of Basic)
              </Typography>
              <Typography variant="body2">
                • Conveyance: ₹1,600
              </Typography>
              <Typography variant="body2">
                • Medical: ₹1,250
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 1 }}>
                <b>Standard Benefits:</b>
              </Typography>
              <Typography variant="body2">
                • Special Allowance: ₹{Math.round(calculationData.basicSalary * 0.1).toLocaleString()} (10% of Basic)
              </Typography>
              <Typography variant="body2">
                • Performance Bonus: ₹{Math.round(calculationData.basicSalary * 0.05).toLocaleString()} (5% of Basic)
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 1 }}>
                <b>Estimated Deductions:</b>
              </Typography>
              <Typography variant="body2">
                • PF: ₹{Math.round(Math.min(calculationData.basicSalary, 15000) * 0.12).toLocaleString()} (12% of Basic, capped at ₹15,000)
              </Typography>
              {calculationData.basicSalary > 0 && (
                <Typography variant="body2">
                  • TDS: ~₹{Math.round(calculationData.basicSalary * 0.05).toLocaleString()} (estimated)
                </Typography>
              )}
              <Typography variant="body2">
                • Professional Tax: ₹{calculationData.basicSalary > 15000 ? "200" : "150"}
              </Typography>
              <Typography variant="body2">
                • Health Insurance: ₹{Math.round(calculationData.basicSalary * 0.005).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                Click "Calculate & Apply" to use these values as a starting point for the payslip
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCalculatorDialogOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={applyCalculations}
            variant="contained"
            startIcon={<CalculateIcon />}
            sx={{
              backgroundColor: "#2ed189",
              "&:hover": { backgroundColor: "#25b374" },
            }}
          >
            Calculate & Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Item Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Add New Item
          <IconButton
            aria-label="close"
            onClick={() => setAddDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={newItemType === "allowances" ? "Allowance" :
                     newItemType === "benefits" ? "Benefit" :
                     newItemType === "otherDeductions" ? "Deduction" : "Reimbursement"}
              color={newItemType === "allowances" ? "primary" :
                     newItemType === "benefits" ? "success" :
                     newItemType === "otherDeductions" ? "error" : "warning"}
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                value={newItemKey}
                onChange={(e) => setNewItemKey(e.target.value)}
                fullWidth
                required
                placeholder={newItemType === "allowances" ? "e.g., Transport Allowance" :
                             newItemType === "benefits" ? "e.g., Performance Bonus" :
                             newItemType === "otherDeductions" ? "e.g., Advance" : "e.g., Medical Reimbursement"}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                type="number"
                value={displayValue(newItemValue)}
                onChange={(e) => setNewItemValue(e.target.value === "" ? 0 : Number(e.target.value))}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setAddDialogOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddItem}
            variant="contained"
            startIcon={<AddIcon />}
            color={newItemType === "allowances" ? "primary" :
                  newItemType === "benefits" ? "success" :
                  newItemType === "otherDeductions" ? "error" : "warning"}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPaySlipDrawer;