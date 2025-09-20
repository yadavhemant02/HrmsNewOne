import React, { useState, useEffect, useRef } from "react";
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
  OutlinedInput,
  FormHelperText,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Select,
  MenuItem,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import {
  format,
  addMonths,
  subMonths,
  getMonth,
  getYear,
  getDaysInMonth,
} from "date-fns";
import {
  Print as PrintIcon,
  Save as SaveIcon,
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
// import { useAlert } from '../../../context/AlertContext';
import html2pdf from "html2pdf.js";
import { useAlert } from "../../../../context/AlertContext";
import axios from "axios";
import { base_emp, base_hr, base_identity } from "../../../../http/services";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Application theme with enhanced colors and proper spacing
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#f50057",
      light: "#ff4081",
      dark: "#c51162",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
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
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "10px 20px",
        },
        contained: {
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
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
    line-height: 1.4;
    background-color: white;
    color: black;
  }
  .page-container {
    width: ${A4_WIDTH_MM - PAGE_MARGIN_MM * 2}mm;
    padding: 0;
    box-sizing: border-box;
    position: relative;
  }
  .payslip-header {
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #1976d2;
    padding-bottom: 10px;
  }
  .company-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 50px;
    background-color: #eee;
    margin: 0 auto 10px;
  }
  .company-name {
    font-size: 18pt;
    font-weight: bold;
    margin: 5px 0;
  }
  .company-address {
    font-size: 10pt;
    margin: 3px 0;
  }
  .payslip-title {
    font-size: 14pt;
    font-weight: bold;
    margin: 15px 0;
    text-transform: uppercase;
  }
  .payslip-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .info-section {
    width: 48%;
  }
  .info-row {
    display: flex;
    margin-bottom: 8px;
  }
  .info-label {
    font-weight: bold;
    width: 150px;
  }
  .info-value {
    flex-grow: 1;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  .summary-row td {
    font-weight: bold;
    background-color: #eaf5ff;
  }
  .footer {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
  }
  .signature-section {
    width: 48%;
  }
  .signature-line {
    margin-top: 50px;
    border-top: 1px solid #000;
    width: 150px;
  }
  .digital-signature {
    font-style: italic;
    font-size: 9pt;
    margin-top: 10px;
  }
  .payment-info {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
  }
`;

// Form steps
const steps = ["Employee Information", "Salary Details", "Preview & Print"];

// Months array for dropdown
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SalarySlip = () => {
  const { showAlert } = useAlert();
  const [logo, setLogo] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const organizationCode = localStorage.getItem("organizationCode");
  const location = useLocation();


  console.log(location,"lllllllllllllllllllllllll")
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.auth.user);
  const organizationName = userDetails?.organizationName;

  // State for tracking active step
  const [activeStep, setActiveStep] = useState(0);

  // Get current month and year for defaults
  const currentDate = new Date();
  const prevMonth = subMonths(currentDate, 1);

  const [totalLeaves, setTotalLeaves] = useState(0); // total count, so use 0 instead of []

  const getAllleaveData = async () => {
    try {
      const response = await axios.get(
        `${base_emp}/emp-handler/leave/get-all-leave?empCode=${location.state.employeeData.employeeId}`
      );

      if (response.status === 200 || response.status === 201) {
        const leaveData = response.data.result;

        // Sum all countDays values (assuming it's a number)
        const total = leaveData.reduce(
          (sum, leave) => sum + (leave.countDays || 0),
          0
        );

        setTotalLeaves(total);

        console.log("Total Leaves:", total);
      }
    } catch (error) {
      console.log("Error fetching leave data:", error);
    }
  };

  const [formData, setFormData] = useState({
    // Employee details
    employeeId: "",
    employeeName: location.state.employeeData.name,
    designation: "",
    department: "",
    bankName: "",
    bankAccount: "",
    panNumber: "",
    uanNumber: "",
    joinDate: new Date(),

    // Payslip period
    payMonth: getMonth(prevMonth),
    payYear: getYear(prevMonth),

    // Earnings
    basicSalary: 0,
    houseRentAllowance: 0,
    conveyanceAllowance: 0,
    specialAllowance: 0,
    overtimeAmount: 0,
    bonusAmount: 0,

    // Deductions
    professionalTax: 0,
    incomeTax: 0,
    providentFund: 0,
    loanRecovery: 0,
    otherDeductions: 0,

    // Leave Information
    paidLeavesAllowed: 24,
    paidLeavesTaken: 0,
    unpaidLeavesTaken: 0,

    // For calculation
    workingDays: 0,
    paidDays: 0,
    grossEarnings: 0,
    totalDeductions: 0,
    netPayable: 0,
    totalCTC: location.state.employeeData.ctc,
    hasCTC: true, // Add new field for CTC checkbox
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      paidLeavesTaken: totalLeaves,
      unpaidLeavesTaken: 24 - totalLeaves,
    }));
  }, [totalLeaves]);

  useEffect(() => {
    getAllleaveData();
  }, []);

  // State for form fields

  // State for loading operations
  const [loading, setLoading] = useState({
    saving: false,
    printing: false,
  });

  // Add state for employee list
  const [employees, setEmployees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(location.state.employeeData.officialEmail);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);

  const previewRef = useRef();

  // Add state for custom earnings components
  const [customEarningsComponents, setCustomEarningsComponents] = useState([]);
  const [earningsDialogOpen, setEarningsDialogOpen] = useState(false);
  const [editingEarningsComponentIndex, setEditingEarningsComponentIndex] =
    useState(null);
  const [newEarningsComponent, setNewEarningsComponent] = useState({
    name: "",
    percentage: 0,
    value: 0,
  });

  // Add state for custom deductions components
  const [customDeductionsComponents, setCustomDeductionsComponents] = useState(
    []
  );
  const [deductionsDialogOpen, setDeductionsDialogOpen] = useState(false);
  const [editingDeductionsComponentIndex, setEditingDeductionsComponentIndex] =
    useState(null);
  const [newDeductionsComponent, setNewDeductionsComponent] = useState({
    name: "",
    percentage: 0,
    value: 0,
  });

  // Add state for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [componentToDeleteIndex, setComponentToDeleteIndex] = useState(null);
  const [componentToDeleteName, setComponentToDeleteName] = useState("");
  const [componentToDeleteType, setComponentToDeleteType] = useState(""); // "earnings" or "deductions"

  // Create refs for custom components sections
  const customEarningsComponentsRef = useRef(null);
  const customDeductionsComponentsRef = useRef(null);

  // Add state for tracking total earnings percentage
  const [totalEarningsPercentage, setTotalEarningsPercentage] = useState(100);
  const [remainingEarningsPercentage, setRemainingEarningsPercentage] =
    useState(0);

  // Fixed component percentages - now editable
  const [componentPercentages, setComponentPercentages] = useState({
    basicSalary: 54.12,
    hra: 18.75,
    conveyanceAllowance: 6.33,
    specialAllowance: 20.8,
  });

  // Open state for component settings dialog
  const [componentSettingsDialogOpen, setComponentSettingsDialogOpen] =
    useState(false);
  const [editedComponentPercentages, setEditedComponentPercentages] = useState(
    {}
  );

  // Calculate fixed components total percentage
  const fixedComponentsTotal = Object.values(componentPercentages).reduce(
    (sum, value) => sum + value,
    0
  );

  // Update remaining percentage calculation
  useEffect(() => {
    // Calculate custom earnings components total percentage
    const customEarningsTotal = (customEarningsComponents || []).reduce(
      (sum, comp) => sum + (comp.percentage || 0),
      0
    );

    // Calculate remaining available percentage
    const remaining = 100 - fixedComponentsTotal - customEarningsTotal;
    setRemainingEarningsPercentage(parseFloat(remaining.toFixed(2)));
  }, [customEarningsComponents, fixedComponentsTotal]);

  // Handle pre-filled data when regenerating
  useEffect(() => {
    if (location.state?.employeeData) {
      const { employeeData } = location.state;

      // Update form data with employee details
      setFormData((prev) => ({
        ...prev,
        employeeId: employeeData.empCode || "",
        employeeName: employeeData.name || "",
        designation: employeeData.position || "",
        department: employeeData.department || "IT",
        bankName: employeeData.bankName || "",
        bankAccount: employeeData.accountNumber || "",
        panNumber: employeeData.panNumber || "",
        uanNumber: employeeData.uanNumber || "",
        joinDate: employeeData.joinDate
          ? new Date(employeeData.joinDate)
          : new Date(),
        totalCTC: employeeData.ctc || 0,
        // Keep other fields as they are
      }));

      // Start from step 1 (Employee Information) when regenerating
      if (location.state.isRegenerate) {
        setActiveStep(0);
      }
    }
  }, [location.state]);

  // Fetch company logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLoadingLogo(true);
        const response = await axios.get(
          `${base_identity}/identity-handler/logo/get-comapny-logo?organizationCode=${organizationCode}`
        );

        if (response.data && response.data.logo) {
          setLogo(response.data.logo);
        } else {
          showAlert("No logo found for the organization", "warning");
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
        if (error.response) {
          // Server responded with error status
          // showAlert(
          //   `Error loading company logo: ${
          //     error.response.data.message || "Server error"
          //   }`,
          //   "error"
          // );
        } else if (error.request) {
          // Request was made but no response received
          showAlert(
            "Error loading company logo: No response from server",
            "error"
          );
        } else {
          // Something else happened
          showAlert("Error loading company logo: " + error.message, "error");
        }
      } finally {
        setLoadingLogo(false);
      }
    };

    fetchLogo();
  }, [showAlert, organizationCode]);

  // Calculate working days, paid days, and amounts when month/year or leaves change
  useEffect(() => {
    const calculateDaysAndAmounts = () => {
      if (!formData.hasCTC) {
        setFormData(prev => ({
          ...prev,
          basicSalary: 0,
          houseRentAllowance: 0,
          conveyanceAllowance: 0,
          specialAllowance: 0,
          grossEarnings: 0,
          totalDeductions: 0,
          netPayable: 0
        }));
        return;
      }

      const totalDays = getDaysInMonth(
        new Date(formData.payYear, formData.payMonth)
      );
      const workingDays = totalDays - formData.paidLeavesTaken - formData.unpaidLeavesTaken;
      const paidDays = totalDays - formData.unpaidLeavesTaken;

      // Calculate monthly salary components based on CTC
      const monthlyCTC = formData.totalCTC / 12;
      const basicSalary = (monthlyCTC * componentPercentages.basicSalary) / 100;
      const houseRentAllowance = (monthlyCTC * componentPercentages.hra) / 100;
      const conveyanceAllowance = (monthlyCTC * componentPercentages.conveyanceAllowance) / 100;
      const specialAllowance = (monthlyCTC * componentPercentages.specialAllowance) / 100;

      // Calculate prorated amounts based on working days
      const proratedBasicSalary = (basicSalary * workingDays) / totalDays;
      const proratedHRA = (houseRentAllowance * workingDays) / totalDays;
      const proratedConveyance = (conveyanceAllowance * workingDays) / totalDays;
      const proratedSpecialAllowance = (specialAllowance * workingDays) / totalDays;

      // Calculate total earnings
      const grossEarnings =
        proratedBasicSalary +
        proratedHRA +
        proratedConveyance +
        proratedSpecialAllowance +
        Number(formData.overtimeAmount) +
        Number(formData.bonusAmount);

      // Calculate total deductions
      const totalDeductions =
        Number(formData.professionalTax) +
        Number(formData.incomeTax) +
        Number(formData.providentFund) +
        Number(formData.loanRecovery) +
        Number(formData.otherDeductions);

      // Calculate net payable
      const netPayable = grossEarnings - totalDeductions;

      setFormData(prev => ({
        ...prev,
        workingDays,
        paidDays,
        basicSalary: proratedBasicSalary,
        houseRentAllowance: proratedHRA,
        conveyanceAllowance: proratedConveyance,
        specialAllowance: proratedSpecialAllowance,
        grossEarnings,
        totalDeductions,
        netPayable
      }));
    };

    calculateDaysAndAmounts();
  }, [
    formData.payMonth,
    formData.payYear,
    formData.totalCTC,
    formData.unpaidLeavesTaken,
    formData.overtimeAmount,
    formData.bonusAmount,
    formData.incomeTax,
    formData.loanRecovery,
    formData.otherDeductions,
    formData.hasCTC,
    customEarningsComponents,
    customDeductionsComponents,
    componentPercentages,
  ]);

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    
    if (name === 'hasCTC') {
      setFormData(prev => ({
        ...prev,
        hasCTC: checked,
        totalCTC: checked ? prev.totalCTC : 0,
        basicSalary: checked ? prev.basicSalary : 0,
        houseRentAllowance: checked ? prev.houseRentAllowance : 0,
        conveyanceAllowance: checked ? prev.conveyanceAllowance : 0,
        specialAllowance: checked ? prev.specialAllowance : 0,
        grossEarnings: checked ? prev.grossEarnings : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  // Format currency with null check
  const formatCurrency = (value) => {
    const numValue = Number(value) || 0;
    return numValue.toLocaleString("en-IN");
  };

  // Get month and year string
  const getPayPeriod = () => {
    return `${months[formData.payMonth]} ${formData.payYear}`;
  };

  // Navigation functions
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Download & Save PDF (match offer letter)
  const handleDownloadAndSavePDF = async () => {
    try {
      setLoading((prev) => ({ ...prev, printing: true }));
      const element = previewRef.current;
      if (!element) {
        showAlert("Payslip preview not found!", "error");
        setLoading((prev) => ({ ...prev, printing: false }));
        return;
      }
      // Remove maxHeight/overflow for clean PDF
      const prevMaxHeight = element.style.maxHeight;
      const prevOverflow = element.style.overflowY;
      element.style.maxHeight = "none";
      element.style.overflowY = "visible";

      const empCodeValue =
        formData.employeeId ||
        (formData.employeeName
          ? formData.employeeName.replace(/\s+/g, "_")
          : "employee");
      const filename = `SalarySlip_${empCodeValue}_${
        months[formData.payMonth]
      }_${formData.payYear}.pdf`;
      
      const opt = {
        margin: [17, 10, 17, 10],
        filename,
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      // Generate the PDF and get the Blob
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf("blob");
      // Trigger download
      html2pdf().from(element).set(opt).save();
      // Restore styles
      setTimeout(() => {
        element.style.maxHeight = prevMaxHeight;
        element.style.overflowY = prevOverflow;
      }, 1000);
      // Upload to backend
      try {
        const formDataForUpload = new FormData();
        formDataForUpload.append("file", pdfBlob, filename);

        // Get name and email from location.state
        const name = location.state?.employeeData?.employeeName || "";
        const organizationCode =
          location.state?.employeeData?.organizationCode || "";
        const email =
          location.state?.employeeEmail ||
          location.state?.employeeData?.email ||
          "";

        console.log("Email being sent:", email); // Debug log

        console.log(organizationCode);

        // Construct URL with all required parameters
        const uploadUrl = `${base_hr}/hr-handler/api/payslip/save-payslip-pdf-data?empCode=${empCodeValue}&name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}&organizationCode=${
          userDetails.organizationCode
        }`;

        const response = await axios.post(uploadUrl, formDataForUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 200) {
          showAlert("Payslip saved to server successfully!", "success");
        } else {
          showAlert("Failed to save payslip to server", "error");
        }
      } catch (error) {
        console.error("Upload error:", error);
        showAlert("Error saving payslip to server: " + error.message, "error");
      }
      showAlert("Payslip PDF generated successfully!", "success");
    } catch (error) {
      console.error("PDF generation error:", error);
      showAlert("Error generating PDF: " + error.message, "error");
    } finally {
      setLoading((prev) => ({ ...prev, printing: false }));
    }
  };

  // Print payslip with proper A4 formatting
  const printPayslip = () => {
    try {
      setLoading((prev) => ({ ...prev, printing: true }));

      // Get the payslip content
      const element = document.getElementById("payslip-preview");
      const printWindow = window.open("", "_blank");

      // Create print-optimized content with proper styling
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Salary Slip - ${
              formData.employeeName
            } - ${getPayPeriod()}</title>
            <style>
              ${documentStyles}
              .header-container {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
                border-bottom: 2px solid #1976d2;
                padding-bottom: 10px;
              }
              .company-info {
                flex: 1;
              }
              .company-logo {
                width: 100px;
                height: 50px;
                background-color: #eee;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 20px;
              }
              .company-logo img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
              }
              .payslip-title {
                text-align: center;
                text-transform: uppercase;
                margin: 10px 0 20px;
                font-size: 14pt;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="page-container">
              <!-- Header Section -->
              <div class="header-container">
                <div class="company-info">
                  <div class="company-name">${organizationName}</div>
                  <div class="company-address">The Hive at VR Bengaluru, ITPL Main Road, Mahadevpura, Bengaluru - 560048</div>
                  <div class="company-address">Email: hr@kprosolutions.com | Phone: +91 124 4567890</div>
                </div>
                <div class="company-logo">
                  ${
                    logo
                      ? `<img src="data:image/png;base64,${logo}" alt="Company Logo">`
                      : "LOGO"
                  }
                </div>
              </div>
              
              <div class="payslip-title">
                Salary Slip - ${getPayPeriod()}
              </div>
              
              <!-- Employee Information -->
              <div class="payslip-info">
                <div class="info-section">
                  <div class="info-row">
                    <div class="info-label">Employee ID:</div>
                    <div class="info-value">${formData.employeeId}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Employee Name:</div>
                    <div class="info-value">${formData.employeeName}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Designation:</div>
                    <div class="info-value">${formData.designation}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Department:</div>
                    <div class="info-value">${formData.department}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Date of Joining:</div>
                    <div class="info-value">${format(
                      new Date(formData.joinDate),
                      "dd-MM-yyyy"
                    )}</div>
                  </div>
                </div>
                
                <div class="info-section">
                  <div class="info-row">
                    <div class="info-label">Bank Account:</div>
                    <div class="info-value">${formData.bankAccount}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Bank Name:</div>
                    <div class="info-value">${formData.bankName}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">PAN Number:</div>
                    <div class="info-value">${formData.panNumber}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">UAN Number:</div>
                    <div class="info-value">${formData.uanNumber}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Working Days:</div>
                    <div class="info-value">${formData.workingDays}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Paid Days:</div>
                    <div class="info-value">${formData.paidDays}</div>
                  </div>
                </div>
              </div>
              
              <!-- Earnings and Deductions Tables -->
              <div style="display: flex; justify-content: space-between;">
                <div style="width: 48%;">
                  <h3 style="margin-bottom: 10px;">Earnings</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th style="text-align: center;">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Basic Salary</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.basicSalary
                        )}</td>
                      </tr>
                      <tr>
                        <td>House Rent Allowance</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.houseRentAllowance
                        )}</td>
                      </tr>
                      <tr>
                        <td>Conveyance Allowance</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.conveyanceAllowance
                        )}</td>
                      </tr>
                      <tr>
                        <td>Special Allowance</td>
                        <td style="text-align: center;>₹${formatCurrency(
                          formData.specialAllowance
                        )}</td>
                      </tr>
                      <tr>
                        <td>Overtime</td>
                        <td style="text-align: center;>₹${formatCurrency(
                          formData.overtimeAmount
                        )}</td>
                      </tr>
                      <tr>
                        <td>Bonus/Incentive</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.bonusAmount
                        )}</td>
                      </tr>
                      <tr class="summary-row">
                        <td>Total Earnings</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.grossEarnings
                        )}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div style="width: 48%;">
                  <h3 style="margin-bottom: 10px;">Deductions</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th style="text-align: center;">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Provident Fund (PF)</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.providentFund
                        )}</td>
                      </tr>
                      <tr>
                        <td>Professional Tax</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.professionalTax
                        )}</td>
                      </tr>
                      <tr>
                        <td>Income Tax (TDS)</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.incomeTax
                        )}</td>
                      </tr>
                      <tr>
                        <td>Loan Recovery</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.loanRecovery
                        )}</td>
                      </tr>
                      <tr>
                        <td>Other Deductions</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.otherDeductions
                        )}</td>
                      </tr>
                      <tr class="summary-row">
                        <td>Total Deductions</td>
                        <td style="text-align: center;">₹${formatCurrency(
                          formData.totalDeductions
                        )}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- Leave Information -->
              <div style="margin-top: 20px;">
                <h3 style="margin-bottom: 10px;">Leave Information</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th style="text-align: center;">Allowed</th>
                      <th style="text-align: center;">Taken</th>
                      <th style="text-align: center;">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Paid Leave</td>
                      <td style="text-align: center; width: 20%">${
                        formData.paidLeavesAllowed
                      }</td>
                      <td style="text-align: center; width: 20%">${
                        formData.paidLeavesTaken
                      }</td>
                      <td style="text-align: center; width: 20%">${
                        formData.paidLeavesAllowed - formData.paidLeavesTaken
                      }</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Net Payable -->
              <div class="payment-info">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h3 style="margin: 0;">Net Salary Payable:</h3>
                    <p style="margin: 5px 0 0 0; font-size: 15px">Amount in words: ${convertToWords(
                      formData.netPayable
                    )} only</p>
                  </div>
                  <div>
                    <h2 style="margin: 0; color: #1976d2;">₹${formatCurrency(
                      formData.netPayable
                    )}</h2>
                  </div>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <div class="signature-section">
                <div class="digital-signature">Digitally processed by ${organizationName} HR System</div>
                  <p>This is a computer-generated payslip and does not require a signature.</p>
                </div>
                <div class="signature-section" style="text-align: right;">
                  <div class="signature-line" style="margin-left: auto;"></div>
                  <p>System Generated</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      // Add slight delay to ensure styles are applied
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setLoading((prev) => ({ ...prev, printing: false }));
        showAlert("Payslip printed successfully!", "success");
      }, 800);
    } catch (error) {
      console.error("Print error:", error);
      showAlert("Error printing document: " + error.message, "error");
      setLoading((prev) => ({ ...prev, printing: false }));
    }
  };

  // Convert number to words - for displaying amount in words
  const convertToWords = (amount) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const numToWords = (num) => {
      if (num < 20) return ones[num];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? " " + ones[num % 10] : "")
        );
      if (num < 1000)
        return (
          ones[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 !== 0 ? " and " + numToWords(num % 100) : "")
        );
      if (num < 100000)
        return (
          numToWords(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 !== 0 ? " " + numToWords(num % 1000) : "")
        );
      if (num < 10000000)
        return (
          numToWords(Math.floor(num / 100000)) +
          " Lakh" +
          (num % 100000 !== 0 ? " " + numToWords(num % 100000) : "")
        );
      return (
        numToWords(Math.floor(num / 10000000)) +
        " Crore" +
        (num % 10000000 !== 0 ? " " + numToWords(num % 10000000) : "")
      );
    };

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let result = numToWords(rupees) + " Rupees";
    if (paise > 0) {
      result += " and " + numToWords(paise) + " Paise";
    }

    return result;
  };

  // Save form data
  const saveFormData = () => {
    try {
      setLoading((prev) => ({ ...prev, saving: true }));
      localStorage.setItem("payslipData", JSON.stringify(formData));

      setTimeout(() => {
        showAlert("Payslip data saved successfully!", "success");
        setLoading((prev) => ({ ...prev, saving: false }));
      }, 500);
    } catch (error) {
      console.error("Save error:", error);
      showAlert("Error saving form data: " + error.message, "error");
      setLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  // Load saved form data
  useEffect(() => {
    const savedData = localStorage.getItem("payslipData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // Convert date strings back to Date objects
        if (parsedData.joinDate) {
          parsedData.joinDate = new Date(parsedData.joinDate);
        }

        setFormData(parsedData);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Form validation
  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
      return (
        formData.employeeId &&
        formData.employeeName &&
        formData.designation &&
        formData.department
      );
      case 1:
        if (!formData.hasCTC) {
          return true; // Skip CTC validation if hasCTC is false
        }
        return formData.totalCTC > 0;
      case 2:
    return true;
      default:
        return false;
    }
  };

  // Fetch employees list
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        console.log("Fetching employees for organization:", organizationCode);
        const response = await axios.get(
          `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${organizationCode}`
        );
        console.log("Employees response:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setEmployees(response.data);
          setFilteredEmployees(response.data);
        } else {
          console.error("Invalid response format:", response.data);
          showAlert("Invalid response format from server", "error");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        showAlert(
          "Error fetching employees list: " +
            (error.response?.data?.message || error.message),
          "error"
        );
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, [organizationCode, showAlert]);

  // Handle email selection
  const handleEmailSelect = async (event) => {
    const email = event.target.value;
    setSelectedEmail(email);
    setEmailDisabled(true);

    try {
      const response = await axios.get(
        `${base_identity}/identity-handler/details/get-emp-details/by-emp-email?empEmail=${email}`
      );

      if (response.data) {
        const employeeData = response.data.data || response.data;
        
        // Check if we have the required data
        if (!employeeData) {
          throw new Error("No employee data found in response");
        }

        // Parse the join date properly
        let joinDate = new Date();
        if (employeeData.joinDate) {
          joinDate = new Date(employeeData.joinDate);
        } else if (employeeData.dateOfJoin) {
          joinDate = new Date(employeeData.dateOfJoin);
        }

        setFormData((prev) => ({
          ...prev,
          employeeId: employeeData.empCode || employeeData.employeeId || "",
          employeeName: employeeData.name || employeeData.employeeName || "",
          designation: employeeData.designation || employeeData.disignation || "",
          department: employeeData.department || employeeData.function || "",
          bankName: employeeData.bankName || "",
          bankAccount: employeeData.bankAccount || employeeData.accountNumber || "",
          panNumber: employeeData.panNumber || "",
          uanNumber: employeeData.uanNumber || "",
          joinDate: joinDate,
          totalCTC: employeeData.totalCTC || employeeData.ctc || 0,
        }));

        showAlert(
          "Employee details fetched successfully. Please verify all the information before proceeding.",
          "warning"
        );
      } else {
        throw new Error("Empty response received");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        showAlert("Employee not found. Please check the email address.", "error");
      } else if (error.response?.status === 502) {
        showAlert(
          "Employee details not found. Please ensure all employee details are filled in the system first.",
          "warning"
        );
      } else {
        showAlert(
          "Error fetching employee details: " +
            (error.response?.data?.message || error.message),
          "error"
        );
      }

      // Reset form data and selection
      setSelectedEmail("");
      setFormData((prev) => ({
        ...prev,
        employeeId: "",
        employeeName: "",
        designation: "",
        department: "",
        totalCTC: 0,
        joinDate: new Date(), // Reset join date to current date
      }));
      setEmailDisabled(false);
    }
  };

  // Handle pre-filled data when navigated from list
  useEffect(() => {
    if (location.state?.employeeEmail) {
      setSelectedEmail(location.state.employeeEmail);
      setEmailDisabled(true);
      // Fetch details by email
      (async () => {
        try {
          const response = await axios.get(
            `${base_identity}/identity-handler/details/get-emp-details/by-emp-email?empEmail=${location.state.employeeEmail}`
          );
          if (response.data) {
            const employeeData = response.data;
            setFormData((prev) => ({
              ...prev,
              employeeId: employeeData.empCode || "",
              employeeName: employeeData.name || "",
              designation: employeeData.disignation || "",
              department: employeeData.function || "",
              bankName: employeeData.bankName || "",
              bankAccount: employeeData.accountNumber || "",
              panNumber: employeeData.panNumber || "",
              uanNumber: employeeData.uanNumber || "",
              joinDate: employeeData.dateOfJoin
                ? new Date(employeeData.dateOfJoin)
                : new Date(),
              totalCTC: employeeData.ctc || 0,
            }));
          }
        } catch (error) {
          console.error("Error fetching employee details:", error);
        }
      })();
    }
  }, [location.state]);

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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
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
                value={formData.joinDate}
                onChange={(date) => handleDateChange("joinDate", date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Bank Account Number"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="PAN Number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="UAN Number"
                name="uanNumber"
                value={formData.uanNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Pay Period
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="pay-month-label">Month</InputLabel>
                <Select
                  labelId="pay-month-label"
                  id="pay-month"
                  name="payMonth"
                  value={formData.payMonth}
                  onChange={handleChange}
                  label="Month"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {months.map((month, index) => (
                    <MenuItem key={month} value={index}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Year"
                name="payYear"
                type="number"
                value={formData.payYear}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Salary Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasCTC}
                    onChange={handleChange}
                    name="hasCTC"
                    color="primary"
                  />
                }
                label="Employee will receive CTC"
              />
            </Grid>

            {formData.hasCTC && (
              <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="totalCTC">Total CTC (Annual)</InputLabel>
                <OutlinedInput
                  id="totalCTC"
                  name="totalCTC"
                  type="number"
                  value={formData.totalCTC}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  label="Total CTC (Annual)"
                  required
                />
                <FormHelperText>
                  Monthly: ₹{formatCurrency(formData.totalCTC / 12)}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  bgcolor: "#f9f9f9",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Auto-calculated Components
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setEditedComponentPercentages({
                          ...componentPercentages,
                        });
                        setComponentSettingsDialogOpen(true);
                      }}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">
                      Basic Salary ({componentPercentages.basicSalary}%):
                    </Typography>
                    <Typography variant="body2">
                      ₹{formatCurrency(formData.basicSalary)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2">
                      HRA ({componentPercentages.hra}%):
                    </Typography>
                    <Typography variant="body2">
                      ₹{formatCurrency(formData.houseRentAllowance)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Conveyance ({componentPercentages.conveyanceAllowance}%):
                    </Typography>
                    <Typography variant="body2">
                      ₹{formatCurrency(formData.conveyanceAllowance)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Special Allowance ({componentPercentages.specialAllowance}
                      %):
                    </Typography>
                    <Typography variant="body2">
                      ₹{formatCurrency(formData.specialAllowance)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Total fixed components:
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        fixedComponentsTotal > 100
                          ? "error.main"
                          : "text.primary"
                      }
                      fontWeight="bold"
                    >
                      {fixedComponentsTotal.toFixed(2)}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Available for custom components:
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        remainingEarningsPercentage < 0
                          ? "error.main"
                          : "success.main"
                      }
                      fontWeight="bold"
                    >
                      {remainingEarningsPercentage.toFixed(2)}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
              </>
            )}

            {/* Custom Earnings Components */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      Custom Earnings Components (
                      {(customEarningsComponents || []).length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add additional earnings components
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingEarningsComponentIndex(null);
                      setNewEarningsComponent({
                        name: "",
                        percentage: 0,
                        value: 0,
                      });
                      setEarningsDialogOpen(true);
                    }}
                  >
                    Add Earnings Component
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Display Custom Earnings Components */}
            {(customEarningsComponents || []).map((component, index) => (
              <Grid item xs={12} md={6} key={`earnings-${index}`}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {component.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Percentage: {component.percentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Amount: ₹{formatCurrency(component.value)}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingEarningsComponentIndex(index);
                          setNewEarningsComponent({
                            name: component.name,
                            percentage: component.percentage,
                            value: component.value,
                          });
                          setEarningsDialogOpen(true);
                        }}
                        size="small"
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleEarningsComponentDelete(index)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}

            {/* Custom Deductions Components */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      Custom Deductions Components (
                      {(customDeductionsComponents || []).length})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add additional deductions components
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingDeductionsComponentIndex(null);
                      setNewDeductionsComponent({
                        name: "",
                        percentage: 0,
                        value: 0,
                      });
                      setDeductionsDialogOpen(true);
                    }}
                  >
                    Add Deductions Component
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Display Custom Deductions Components */}
            {(customDeductionsComponents || []).map((component, index) => (
              <Grid item xs={12} md={6} key={`deductions-${index}`}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {component.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Percentage: {component.percentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Amount: ₹{formatCurrency(component.value)}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingDeductionsComponentIndex(index);
                          setNewDeductionsComponent({
                            name: component.name,
                            percentage: component.percentage,
                            value: component.value,
                          });
                          setDeductionsDialogOpen(true);
                        }}
                        size="small"
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeductionsComponentDelete(index)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="overtime-amount">
                  Overtime Amount
                </InputLabel>
                <OutlinedInput
                  id="overtime-amount"
                  name="overtimeAmount"
                  type="number"
                  value={formData.overtimeAmount}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  label="Overtime Amount"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="bonus-amount">Bonus/Incentive</InputLabel>
                <OutlinedInput
                  id="bonus-amount"
                  name="bonusAmount"
                  type="number"
                  value={formData.bonusAmount}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  label="Bonus/Incentive"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Deductions
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  bgcolor: "#f9f9f9",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Auto-calculated Deductions
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">
                      Provident Fund (12% of Basic):
                    </Typography>
                    <Typography variant="body2">
                      ₹{formatCurrency(formData.providentFund)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2">Professional Tax:</Typography>
                    <Typography variant="body2">
                      ₹{formatCurrency(formData.professionalTax)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="income-tax">Income Tax (TDS)</InputLabel>
                <OutlinedInput
                  id="income-tax"
                  name="incomeTax"
                  type="number"
                  value={formData.incomeTax}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  label="Income Tax (TDS)"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="loan-recovery">Loan Recovery</InputLabel>
                <OutlinedInput
                  id="loan-recovery"
                  name="loanRecovery"
                  type="number"
                  value={formData.loanRecovery}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  label="Loan Recovery"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="other-deductions">
                  Other Deductions
                </InputLabel>
                <OutlinedInput
                  id="other-deductions"
                  name="otherDeductions"
                  type="number"
                  value={formData.otherDeductions}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  label="Other Deductions"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Leave Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Paid Leaves Allowed (Annual)"
                name="paidLeavesAllowed"
                type="number"
                value={formData.paidLeavesAllowed}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Paid Leaves Taken"
                name="paidLeavesTaken"
                type="number"
                value={formData.paidLeavesTaken}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Unpaid Leaves Taken"
                name="unpaidLeavesTaken"
                type="number"
                value={formData.unpaidLeavesTaken}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: theme.palette.primary.light,
                  color: "white",
                }}
              >
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Payment Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">
                      Working Days: {formData.workingDays}
                    </Typography>
                    <Typography variant="body2">
                      Paid Days: {formData.paidDays}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">
                      Gross Earnings: ₹{formatCurrency(formData.grossEarnings)}
                    </Typography>
                    <Typography variant="body2">
                      Total Deductions: ₹
                      {formatCurrency(formData.totalDeductions)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6">
                      Net Payable: ₹{formatCurrency(formData.netPayable)}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Payslip Preview
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box
                id="payslip-preview"
                ref={previewRef}
                sx={{
                  border: "1px solid #ddd",
                  p: 3,
                  bgcolor: "#fff",
                  maxHeight: "650px",
                  overflowY: "auto",
                  boxSizing: "border-box",
                  width: "100%",
                  boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
                }}
              >
                {/* Header Section */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                    borderBottom: "2px solid #1976d2",
                    pb: 1,
                  }}
                >
                  {/* Company Address Section - Left Side */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#2193EF",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      {userDetails.organizationName}
                    </Typography>
                    <Typography variant="body2">
                      The Hive at VR Bengaluru, ITPL Main Road, Mahadevpura,
                      Bengaluru - 560048
                    </Typography>
                    <Typography variant="body2">
                      Email: hr@kprosolutions.com | Phone: +91 124 4567890
                    </Typography>
                  </Box>

                  {/* Logo Section - Right Side */}
                  <Box
                    sx={{
                      width: "100px",
                      height: "50px",
                      bgcolor: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "20px",
                    }}
                  >
                    {loadingLogo ? (
                      <CircularProgress size={24} />
                    ) : logo ? (
                      <img
                        src={`data:image/png;base64,${logo}`}
                        alt="Company Logo"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Typography variant="body2">LOGO</Typography>
                    )}
                  </Box>
                </Box>

                {/* Payslip Title - Centered */}
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    mt: 1,
                    mb: 2,
                  }}
                >
                  Salary Slip - {getPayPeriod()}
                </Typography>

                {/* Employee Information */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ width: "48%" }}>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        Employee ID:
                      </Typography>
                      <Typography variant="body1">
                        {formData.employeeId}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        Employee Name:
                      </Typography>
                      <Typography variant="body1">
                        {formData.employeeName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        Designation:
                      </Typography>
                      <Typography variant="body1">
                        {formData.designation}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        Department:
                      </Typography>
                      <Typography variant="body1">
                        {formData.department}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        Date of Joining:
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(formData.joinDate), "dd-MM-yyyy")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: "48%" }}>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        Bank Account:
                      </Typography>
                      <Typography variant="body1">
                        {formData.bankAccount}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        Bank Name:
                      </Typography>
                      <Typography variant="body1">
                        {formData.bankName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        PAN Number:
                      </Typography>
                      <Typography variant="body1">
                        {formData.panNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        UAN Number:
                      </Typography>
                      <Typography variant="body1">
                        {formData.uanNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ width: "150px", fontWeight: "bold" }}
                      >
                        Working Days:
                      </Typography>
                      <Typography variant="body1">
                        {formData.workingDays}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Earnings and Deductions Tables */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ width: "48%" }}>
                    <Typography variant="h6" gutterBottom>
                      Earnings
                    </Typography>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            Component
                          </th>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            Amount (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Basic Salary
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.basicSalary)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            House Rent Allowance
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.houseRentAllowance)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Conveyance Allowance
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.conveyanceAllowance)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Special Allowance
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.specialAllowance)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Overtime
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.overtimeAmount)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Bonus/Incentive
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.bonusAmount)}
                          </td>
                        </tr>
                        {/* Custom Earnings Components */}
                        {(customEarningsComponents || []).map(
                          (component, index) => (
                            <tr key={`earnings-${index}`}>
                              <td
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                }}
                              >
                                {component.name}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                  textAlign: "center",
                                }}
                              >
                                ₹{formatCurrency(component.value)}
                              </td>
                            </tr>
                          )
                        )}
                        <tr
                          style={{
                            backgroundColor: "#eaf5ff",
                            fontWeight: "bold",
                          }}
                        >
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Total Earnings
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.grossEarnings)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>

                  <Box sx={{ width: "48%" }}>
                    <Typography variant="h6" gutterBottom>
                      Deductions
                    </Typography>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            Component
                          </th>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            Amount (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Provident Fund (PF)
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.providentFund)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Professional Tax
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.professionalTax)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Income Tax (TDS)
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.incomeTax)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Loan Recovery
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.loanRecovery)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Other Deductions
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.otherDeductions)}
                          </td>
                        </tr>
                        {/* Custom Deductions Components */}
                        {(customDeductionsComponents || []).map(
                          (component, index) => (
                            <tr key={`deductions-${index}`}>
                              <td
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                }}
                              >
                                {component.name}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                  textAlign: "center",
                                }}
                              >
                                ₹{formatCurrency(component.value)}
                              </td>
                            </tr>
                          )
                        )}
                        <tr
                          style={{
                            backgroundColor: "#eaf5ff",
                            fontWeight: "bold",
                          }}
                        >
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            Total Deductions
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.totalDeductions)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                </Box>

                {/* Leave Information */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Leave Information
                  </Typography>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          Leave Type
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                            width: "20%",
                          }}
                        >
                          Allowed
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                            width: "20%",
                          }}
                        >
                          Taken
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                            width: "20%",
                          }}
                        >
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          Leave
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {formData.paidLeavesAllowed}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {formData.paidLeavesTaken}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {formData.paidLeavesAllowed -
                            formData.paidLeavesTaken}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Box>

                {/* Net Payable */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    border: "1px solid #ddd",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ m: 0 }}>
                        Net Salary Payable:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Amount in words: {convertToWords(formData.netPayable)}{" "}
                        only
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ m: 0, color: "#1976d2" }}>
                      ₹{formatCurrency(formData.netPayable)}
                    </Typography>
                  </Box>
                </Box>

                {/* Footer */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      pr: 2, // padding right to account for the right box
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", mt: 1 }}
                    >
                      Digitally processed by {organizationName} HR System
                    </Typography>
                    <Typography variant="body2">
                      This is a computer-generated payslip and does not require
                      a signature.
                    </Typography>
                  </Box>

                  <Box sx={{ width: "20%", textAlign: "right" }}>
                    <Box
                      sx={{
                        mb: 1,
                        height: "50px",
                        width: "150px",
                        borderBottom: "1px solid #000",
                        ml: "auto",
                      }}
                    />
                    <Typography variant="body2">System Generated</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  // Navigation buttons based on active step
  const renderNavigationButtons = () => {
    return (
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
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
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            endIcon={<NextIcon />}
            disabled={!validateCurrentStep()}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadAndSavePDF}
            startIcon={<SaveIcon />}
            sx={{
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
              },
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            disabled={loading.printing}
          >
            {loading.printing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Generating...
              </>
            ) : (
              "Download & Save"
            )}
          </Button>
        )}
      </Box>
    );
  };

  // Add custom earnings component
  const addCustomEarningsComponent = () => {
    try {
      if (!(newEarningsComponent?.name || "").trim()) {
        showAlert("Component name cannot be empty", "error");
        return false;
      }

      // Check for duplicate names
      const isDuplicate = (customEarningsComponents || []).some(
        (comp, idx) =>
          (comp?.name || "").toLowerCase() ===
            (newEarningsComponent?.name || "").toLowerCase() &&
          idx !== editingEarningsComponentIndex
      );

      if (isDuplicate) {
        showAlert("Component with this name already exists", "error");
        return false;
      }

      // Check if adding this percentage would exceed the limit
      const currentTotal = (customEarningsComponents || []).reduce(
        (sum, comp, idx) =>
          idx !== editingEarningsComponentIndex
            ? sum + (comp.percentage || 0)
            : sum,
        0
      );

      if (
        currentTotal + Number(newEarningsComponent.percentage) >
        100 - fixedComponentsTotal
      ) {
        showAlert(
          `Cannot exceed 100% total allocation. Available: ${remainingEarningsPercentage}%`,
          "error"
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in addCustomEarningsComponent:", error);
      showAlert("Error adding earnings component", "error");
      return false;
    }
  };

  // Add custom deductions component
  const addCustomDeductionsComponent = () => {
    try {
      if (!(newDeductionsComponent?.name || "").trim()) {
        showAlert("Component name cannot be empty", "error");
        return false;
      }

      // Check for duplicate names
      const isDuplicate = (customDeductionsComponents || []).some(
        (comp, idx) =>
          (comp?.name || "").toLowerCase() ===
            (newDeductionsComponent?.name || "").toLowerCase() &&
          idx !== editingDeductionsComponentIndex
      );

      if (isDuplicate) {
        showAlert("Component with this name already exists", "error");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in addCustomDeductionsComponent:", error);
      showAlert("Error adding deductions component", "error");
      return false;
    }
  };

  // Handle earnings component deletion
  const handleEarningsComponentDelete = (index) => {
    try {
      const componentToDelete = (customEarningsComponents || [])[index];
      if (!componentToDelete) {
        showAlert("Earnings component not found.", "error");
        return;
      }

      setComponentToDeleteName(componentToDelete.name || "Earnings Component");
      setComponentToDeleteIndex(index);
      setComponentToDeleteType("earnings");
      setDeleteDialogOpen(true);
    } catch (error) {
      console.error("Error preparing earnings component deletion:", error);
      showAlert("Error preparing earnings component deletion", "error");
    }
  };

  // Handle deductions component deletion
  const handleDeductionsComponentDelete = (index) => {
    try {
      const componentToDelete = (customDeductionsComponents || [])[index];
      if (!componentToDelete) {
        showAlert("Deductions component not found.", "error");
        return;
      }

      setComponentToDeleteName(
        componentToDelete.name || "Deductions Component"
      );
      setComponentToDeleteIndex(index);
      setComponentToDeleteType("deductions");
      setDeleteDialogOpen(true);
    } catch (error) {
      console.error("Error preparing deductions component deletion:", error);
      showAlert("Error preparing deductions component deletion", "error");
    }
  };

  // Confirm component deletion
  const confirmDelete = () => {
    if (componentToDeleteType === "earnings") {
      try {
        const updatedComponents = (customEarningsComponents || []).filter(
          (_, i) => i !== componentToDeleteIndex
        );
        setCustomEarningsComponents(updatedComponents);
        showAlert(
          `Earnings component "${componentToDeleteName}" deleted successfully`,
          "success"
        );
      } catch (error) {
        console.error("Error deleting earnings component:", error);
        showAlert("Error deleting earnings component", "error");
      }
    } else if (componentToDeleteType === "deductions") {
      try {
        const updatedComponents = (customDeductionsComponents || []).filter(
          (_, i) => i !== componentToDeleteIndex
        );
        setCustomDeductionsComponents(updatedComponents);
        showAlert(
          `Deductions component "${componentToDeleteName}" deleted successfully`,
          "success"
        );
      } catch (error) {
        console.error("Error deleting deductions component:", error);
        showAlert("Error deleting deductions component", "error");
      }
    }
    setDeleteDialogOpen(false);
    setComponentToDeleteIndex(null);
    setComponentToDeleteName("");
    setComponentToDeleteType("");
  };

  // Handle keyboard events for dialogs
  const handleKeyDown = (event, closeAction) => {
    if (event.key === "Escape") {
      closeAction();
    }
  };

  // Add dialogs for custom components
  const renderCustomComponentDialogs = () => (
    <>
      {/* Earnings Component Dialog */}
      <Dialog
        open={earningsDialogOpen}
        onClose={() => setEarningsDialogOpen(false)}
        aria-labelledby="earnings-dialog-title"
        onKeyDown={(e) => handleKeyDown(e, () => setEarningsDialogOpen(false))}
      >
        <DialogTitle id="earnings-dialog-title">
          {editingEarningsComponentIndex !== null
            ? "Edit Earnings Component"
            : "Add Earnings Component"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Component Name"
            fullWidth
            value={newEarningsComponent.name}
            onChange={(e) =>
              setNewEarningsComponent({
                ...newEarningsComponent,
                name: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Percentage"
            type="number"
            fullWidth
            value={newEarningsComponent.percentage}
            onChange={(e) => {
              const percentage = Number(e.target.value);
              const monthlyCTC = parseFloat(
                (Number(formData.totalCTC) / 12).toFixed(2)
              );
              const value = parseFloat(
                ((monthlyCTC * percentage) / 100).toFixed(2)
              );
              setNewEarningsComponent({
                ...newEarningsComponent,
                percentage: percentage,
                value: value,
              });
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText={`Available percentage: ${remainingEarningsPercentage}%`}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Amount: ₹{formatCurrency(newEarningsComponent.value)}
          </Typography>
          <Typography
            variant="body2"
            color={remainingEarningsPercentage < 0 ? "error" : "text.secondary"}
            sx={{ mt: 1 }}
          >
            Fixed components already use {fixedComponentsTotal}% of CTC
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEarningsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (addCustomEarningsComponent()) {
                try {
                  if (editingEarningsComponentIndex !== null) {
                    // Update existing component
                    const updatedComponents = [
                      ...(customEarningsComponents || []),
                    ];
                    updatedComponents[editingEarningsComponentIndex] = {
                      ...updatedComponents[editingEarningsComponentIndex],
                      name: newEarningsComponent.name,
                      percentage: newEarningsComponent.percentage,
                      value: newEarningsComponent.value,
                    };
                    setCustomEarningsComponents(updatedComponents);
                    showAlert(
                      `Earnings component "${newEarningsComponent.name}" updated successfully`,
                      "success"
                    );
                  } else {
                    // Add new component
                    setCustomEarningsComponents([
                      ...(customEarningsComponents || []),
                      {
                        name: newEarningsComponent.name,
                        percentage: newEarningsComponent.percentage,
                        value: newEarningsComponent.value,
                      },
                    ]);
                    showAlert(
                      `Earnings component "${newEarningsComponent.name}" added successfully`,
                      "success"
                    );
                  }
                  setEarningsDialogOpen(false);
                } catch (error) {
                  console.error("Error saving earnings component:", error);
                  showAlert("Error saving earnings component", "error");
                }
              }
            }}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deductions Component Dialog */}
      <Dialog
        open={deductionsDialogOpen}
        onClose={() => setDeductionsDialogOpen(false)}
        aria-labelledby="deductions-dialog-title"
        onKeyDown={(e) =>
          handleKeyDown(e, () => setDeductionsDialogOpen(false))
        }
      >
        <DialogTitle id="deductions-dialog-title">
          {editingDeductionsComponentIndex !== null
            ? "Edit Deductions Component"
            : "Add Deductions Component"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Component Name"
            fullWidth
            value={newDeductionsComponent.name}
            onChange={(e) =>
              setNewDeductionsComponent({
                ...newDeductionsComponent,
                name: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={newDeductionsComponent.value}
            onChange={(e) => {
              const value = Number(e.target.value);
              setNewDeductionsComponent({
                ...newDeductionsComponent,
                value: value,
              });
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeductionsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (addCustomDeductionsComponent()) {
                try {
                  if (editingDeductionsComponentIndex !== null) {
                    // Update existing component
                    const updatedComponents = [
                      ...(customDeductionsComponents || []),
                    ];
                    updatedComponents[editingDeductionsComponentIndex] = {
                      ...updatedComponents[editingDeductionsComponentIndex],
                      name: newDeductionsComponent.name,
                      value: newDeductionsComponent.value,
                    };
                    setCustomDeductionsComponents(updatedComponents);
                    showAlert(
                      `Deductions component "${newDeductionsComponent.name}" updated successfully`,
                      "success"
                    );
                  } else {
                    // Add new component
                    setCustomDeductionsComponents([
                      ...(customDeductionsComponents || []),
                      {
                        name: newDeductionsComponent.name,
                        value: newDeductionsComponent.value,
                      },
                    ]);
                    showAlert(
                      `Deductions component "${newDeductionsComponent.name}" added successfully`,
                      "success"
                    );
                  }
                  setDeductionsDialogOpen(false);
                } catch (error) {
                  console.error("Error saving deductions component:", error);
                  showAlert("Error saving deductions component", "error");
                }
              }
            }}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        onKeyDown={(e) => handleKeyDown(e, () => setDeleteDialogOpen(false))}
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the {componentToDeleteType}{" "}
            component "{componentToDeleteName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Component Settings Dialog */}
      <Dialog
        open={componentSettingsDialogOpen}
        onClose={() => setComponentSettingsDialogOpen(false)}
        aria-labelledby="component-settings-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="component-settings-dialog-title">
          Edit Fixed Component Percentages
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Adjust the percentages to make room for custom earning components.
            The total should ideally be less than 100%.
          </Typography>

          <TextField
            margin="dense"
            label="Basic Salary Percentage"
            type="number"
            fullWidth
            value={editedComponentPercentages.basicSalary}
            onChange={(e) =>
              handleComponentPercentageChange("basicSalary", e.target.value)
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            sx={{ mb: 2, mt: 1 }}
          />

          <TextField
            margin="dense"
            label="HRA Percentage"
            type="number"
            fullWidth
            value={editedComponentPercentages.hra}
            onChange={(e) =>
              handleComponentPercentageChange("hra", e.target.value)
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Conveyance Allowance Percentage"
            type="number"
            fullWidth
            value={editedComponentPercentages.conveyanceAllowance}
            onChange={(e) =>
              handleComponentPercentageChange(
                "conveyanceAllowance",
                e.target.value
              )
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Special Allowance Percentage"
            type="number"
            fullWidth
            value={editedComponentPercentages.specialAllowance}
            onChange={(e) =>
              handleComponentPercentageChange(
                "specialAllowance",
                e.target.value
              )
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="body2" gutterBottom fontWeight="bold">
              Total fixed components:
              {Object.values(editedComponentPercentages)
                .reduce((sum, value) => sum + Number(value || 0), 0)
                .toFixed(2)}
              %
            </Typography>
            <Typography
              variant="body2"
              color={
                Object.values(editedComponentPercentages).reduce(
                  (sum, value) => sum + Number(value || 0),
                  0
                ) > 100
                  ? "error.main"
                  : "inherit"
              }
            >
              {Object.values(editedComponentPercentages).reduce(
                (sum, value) => sum + Number(value || 0),
                0
              ) > 100
                ? "Warning: Total exceeds 100%"
                : Object.values(editedComponentPercentages).reduce(
                    (sum, value) => sum + Number(value || 0),
                    0
                  ) < 100
                ? `Available for custom components: ${(
                    100 -
                    Object.values(editedComponentPercentages).reduce(
                      (sum, value) => sum + Number(value || 0),
                      0
                    )
                  ).toFixed(2)}%`
                : "No room for custom components"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComponentSettingsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={saveComponentPercentages}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Handle edit of fixed component percentages
  const handleComponentPercentageChange = (component, value) => {
    setEditedComponentPercentages({
      ...editedComponentPercentages,
      [component]: Number(value),
    });
  };

  // Save edited component percentages
  const saveComponentPercentages = () => {
    setComponentPercentages({
      ...componentPercentages,
      ...editedComponentPercentages,
    });
    setComponentSettingsDialogOpen(false);

    // Show success message
    showAlert("Component percentages updated successfully", "success");
  };

  // Add state for filtered employees
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard-hr/salary-slip-emp-list")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                height: "40px",
                mr: 2,
              }}
            >
              Back to List
            </Button>
            <Typography variant="h4" sx={{ mb: 0, fontWeight: 600 }}>
              Salary Slip Generator
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

            {activeStep === 0 && (
              <Box sx={{ mb: 4 }}>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel id="email-select-label">
                    Select Employee Email
                  </InputLabel>
                  <Select
                    labelId="email-select-label"
                    id="email-select"
                    value={selectedEmail}
                    onChange={handleEmailSelect}
                    label="Select Employee Email"
                    disabled={emailDisabled}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                      onMouseDown: (e) => e.preventDefault(),
                      disableAutoFocusItem: true,
                    }}
                    renderValue={(selected) => {
                      const selectedEmployee = employees.find(emp => emp.email === selected);
                      return (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon fontSize="small" />
                          <Typography>
                            {selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.email})` : selected || "Select an employee"}
                          </Typography>
                          {selectedEmail && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEmail("");
                                setFormData((prev) => ({
                                  ...prev,
                                  employeeId: "",
                                  employeeName: "",
                                  designation: "",
                                  department: "",
                                  totalCTC: 0,
                                }));
                                setEmailDisabled(false);
                              }}
                              sx={{ ml: "auto" }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      );
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                        position: "sticky",
                        top: 0,
                        bgcolor: "background.paper",
                        zIndex: 1,
                      }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Search by name, email, ID or designation..."
                        variant="outlined"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          const searchTerm = e.target.value.toLowerCase().trim();
                          if (searchTerm === "") {
                            setFilteredEmployees(employees);
                          } else {
                            const filtered = employees.filter((employee) => {
                              const searchFields = [
                                employee.email,
                                employee.name,
                                employee.designation,
                                employee.empCode,
                              ].filter(Boolean);

                              return searchFields.some((field) =>
                                field.toLowerCase().includes(searchTerm)
                              );
                            });
                            setFilteredEmployees(filtered);
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                          onClick: (e) => e.stopPropagation(),
                          onMouseDown: (e) => e.stopPropagation(),
                        }}
                      />
                    </Box>

                    {loadingEmployees ? (
                      <MenuItem disabled>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
                          <CircularProgress size={20} />
                          <Typography>Loading employees...</Typography>
                        </Box>
                      </MenuItem>
                    ) : filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <MenuItem
                          key={employee.id || employee.email}
                          value={employee.email}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                            py: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                              sx={{ width: 32, height: 32 }}
                              src={employee.avatar || ""}
                              alt={employee.name || employee.email}
                            >
                              {employee.name
                                ? employee.name.charAt(0)
                                : employee.email.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1">
                                {employee.name || "No name provided"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {employee.email}
                              </Typography>
                              {employee.designation && (
                                <Typography
                                  variant="caption"
                                  display="block"
                                  color="text.secondary"
                                >
                                  {employee.designation}
                                </Typography>
                              )}
                              {employee.empCode && (
                                <Typography
                                  variant="caption"
                                  display="block"
                                  color="text.secondary"
                                >
                                  ID: {employee.empCode}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <Typography color="text.secondary" sx={{ py: 1 }}>
                          No employees found
                        </Typography>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>
            )}

            {getStepContent(activeStep)}

            {renderNavigationButtons()}
          </Paper>
        </Container>
      </LocalizationProvider>
      {renderCustomComponentDialogs()}
    </ThemeProvider>
  );
};

export default SalarySlip;
