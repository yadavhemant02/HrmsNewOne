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
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { format, addMonths, getYear } from "date-fns";
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  TrendingUp as IncrementIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAlert } from "../../../../context/AlertContext";
import axios from "axios";
import { base_identity, base_hr } from "../../../../http/services";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useSelector } from "react-redux";
import IncreamentLetterEditDialog from "./IncreamentLetterEditDialog";

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
    line-height: 1.5;
    background-color: white;
    color: black;
  }
  .page-container {
    width: ${A4_WIDTH_MM - PAGE_MARGIN_MM * 2}mm;
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
  .increment-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  .increment-table th, .increment-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  .increment-table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  .footer {
    margin-top: 40px;
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
  .signature-line {
    height: 50px;
    width: 150px;
    border-bottom: 1px solid #000;
    margin: 10px 0;
  }
`;

// Form steps
const steps = ["Employee Information", "Increment Details", "Preview & Print"];

// Increment types
const incrementTypes = [
  "Annual Increment",
  "Performance-based Increment",
  "Promotion-based Increment",
  "Market Adjustment",
  "Special Increment",
];

const IncrementLetter = () => {
  const { showAlert } = useAlert();
  const [logo, setLogo] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [organizationCode] = useState(localStorage.getItem("organizationCode"));
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = useSelector((state) => state.auth.user);
  const previewRef = useRef(null);

  const [incrementContent, setIncrementContent] = useState({
    header: "",
    incrementPoints: [],
    footer: "",
    signatureName: "",
    companyAddress: "",
  });

  // Add this handler
  const handleIncrementContentSave = (savedContent) => {
    setIncrementContent(savedContent);
    showAlert("Increment letter content updated successfully!", "success");
  };

  useEffect(() => {
    const fetchInitialContent = async () => {
      try {
        const response = await axios.post(
          `${base_hr}/hr-handler/increment/find-increment-leter-content?organizationCode=${localStorage.getItem(
            "organizationCode"
          )}&content=increment`
        );

        if (response.data?.result) {
          const apiPoints = response.data.result.offerSummury
            ? Object.values(response.data.result.offerSummury).filter(
                (point) => point
              )
            : [];

          setIncrementContent({
            header:
              response.data.result.header ||
              DEFAULT_INCREMENT_HEADER(organizationName),
            incrementPoints:
              apiPoints.length > 0 ? apiPoints : DEFAULT_INCREMENT_POINTS,
            footer:
              response.data.result.footer ||
              DEFAULT_INCREMENT_FOOTER(organizationName),
            signatureName: response.data.result.signatureName || "",
            companyAddress: response.data.result.companyAddress || "",
          });
        }
      } catch (error) {
        console.error("Error fetching initial increment content:", error);
        // Fall back to defaults
        setIncrementContent({
          header: DEFAULT_INCREMENT_HEADER(organizationName),
          incrementPoints: DEFAULT_INCREMENT_POINTS,
          footer: DEFAULT_INCREMENT_FOOTER(organizationName),
          signatureName: "",
          companyAddress: "",
        });
      }
    };

    if (organizationCode) {
      fetchInitialContent();
    }
  }, [organizationCode]);

  // Add state for employee list and email selection
  const [employees, setEmployees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);

  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  // State for tracking active step
  const [activeStep, setActiveStep] = useState(0);

  // Get current date
  const currentDate = new Date();

  // Calculate default effective date (first day of next month)
  const defaultEffectiveDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  // State for form fields
  const [formData, setFormData] = useState({
    // Letter details
    letterDate: currentDate,
    referenceNumber: "",

    // Employee details
    employeeId: "",
    employeeName: "",
    designation: "",
    department: "",
    joiningDate: new Date(),

    // Increment details
    incrementType: "Annual Increment",
    effectiveDate: defaultEffectiveDate,
    currentCTC: 0,
    incrementPercentage: 0,
    incrementCTC: 0,

    // Calculated values
    currentBasic: 0,
    currentHRA: 0,
    currentConveyance: 0,
    currentSpecialAllowance: 0,
    currentGross: 0,
    incrementAmount: 0,
    newBasic: 0,
    newHRA: 0,
    newConveyance: 0,
    newSpecialAllowance: 0,
    newGross: 0,
    newCTC: 0,

    // Special note
    specialNote: "",

    // Signatory
    signatoryName: "",
    signatoryDesignation: "Director, Human Resources",
  });

  // State for loading operations
  const [loading, setLoading] = useState({
    saving: false,
    printing: false,
    downloading: false,
  });

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch employees list
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const response = await axios.get(
          `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${userDetails.organizationCode}`
        );
        if (response.data) {
          setEmployees(response.data);
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
    if (email) {
      try {
        const response = await axios.get(
          `${base_identity}/identity-handler/details/get-emp-details/by-emp-email?empEmail=${email}`
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
            currentCTC: employeeData.ctc || 0,
          }));
          setEmailDisabled(true);
          showAlert(
            "Employee details fetched successfully. Please verify all the information before proceeding.",
            "warning"
          );
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        if (error.response?.status === 502) {
          showAlert(
            "Employee details not found. Please ensure all employee details are filled in the system first.",
            "warning"
          );
          // Reset the form data
          setFormData((prev) => ({
            ...prev,
            employeeId: "",
            employeeName: "",
            designation: "",
            department: "",
            bankName: "",
            bankAccount: "",
            panNumber: "",
            uanNumber: "",
            joinDate: new Date(),
            currentCTC: 0,
          }));
          setEmailDisabled(false);
          setSelectedEmail("");
        } else {
          showAlert(
            "Error fetching employee details: " +
              (error.response?.data?.message || error.message),
            "error"
          );
        }
      }
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
              currentCTC: employeeData.ctc || 0,
            }));
          }
        } catch (error) {
          console.error("Error fetching employee details:", error);
        }
      })();
    }
  }, [location.state]);

  // Calculate incremented values based on CTC and percentage
  useEffect(() => {
    const calculateIncrementedValues = () => {
      const currentCTC = parseFloat(
        (Number(formData.currentCTC) || 0).toFixed(2)
      );
      const incrementPercentage = parseFloat(
        (Number(formData.incrementPercentage) || 0).toFixed(2)
      );
      const incrementCTC = parseFloat(
        (Number(formData.incrementCTC) || 0).toFixed(2)
      );

      // Component percentages from offer letter
      const componentPercentages = {
        basicSalary: 54.12,
        hra: 18.75,
        conveyanceAllowance: 6.33,
        specialAllowance: 20.8,
      };

      // Calculate current components
      const currentBasic = parseFloat(
        ((currentCTC * componentPercentages.basicSalary) / 100).toFixed(2)
      );
      const currentHRA = parseFloat(
        ((currentCTC * componentPercentages.hra) / 100).toFixed(2)
      );
      const currentConveyance = parseFloat(
        ((currentCTC * componentPercentages.conveyanceAllowance) / 100).toFixed(
          2
        )
      );
      const currentSpecialAllowance = parseFloat(
        ((currentCTC * componentPercentages.specialAllowance) / 100).toFixed(2)
      );

      // Calculate current gross (sum of all components)
      const currentGross = parseFloat(
        (
          currentBasic +
          currentHRA +
          currentConveyance +
          currentSpecialAllowance
        ).toFixed(2)
      );

      // Calculate new CTC based on either percentage or increment CTC
      let newCTC;
      let calculatedIncrementPercentage = incrementPercentage;
      let calculatedIncrementCTC = incrementCTC;

      if (incrementCTC > 0) {
        newCTC = currentCTC + incrementCTC;
        calculatedIncrementPercentage = (
          (incrementCTC / currentCTC) *
          100
        ).toFixed(2);
      } else if (incrementPercentage > 0) {
        newCTC = currentCTC + (currentCTC * incrementPercentage) / 100;
        calculatedIncrementCTC = (
          (currentCTC * incrementPercentage) /
          100
        ).toFixed(2);
      } else {
        newCTC = currentCTC;
      }

      // Calculate increment amount (based on basic)
      const incrementAmount = parseFloat(
        (currentBasic * (calculatedIncrementPercentage / 100)).toFixed(2)
      );

      // Calculate new components maintaining the same ratios
      const newBasic = parseFloat((currentBasic + incrementAmount).toFixed(2));
      const newHRA = parseFloat(
        (
          newBasic *
          (componentPercentages.hra / componentPercentages.basicSalary)
        ).toFixed(2)
      );
      const newConveyance = parseFloat(
        (
          newBasic *
          (componentPercentages.conveyanceAllowance /
            componentPercentages.basicSalary)
        ).toFixed(2)
      );
      const newSpecialAllowance = parseFloat(
        (
          newBasic *
          (componentPercentages.specialAllowance /
            componentPercentages.basicSalary)
        ).toFixed(2)
      );

      // Calculate new gross
      const newGross = parseFloat(
        (newBasic + newHRA + newConveyance + newSpecialAllowance).toFixed(2)
      );

      setFormData((prev) => ({
        ...prev,
        currentBasic,
        currentHRA,
        currentConveyance,
        currentSpecialAllowance,
        currentGross,
        incrementAmount,
        newBasic,
        newHRA,
        newConveyance,
        newSpecialAllowance,
        newGross,
        newCTC,
      }));
    };

    calculateIncrementedValues();
  }, [
    formData.currentCTC,
    formData.incrementPercentage,
    formData.incrementCTC,
  ]);

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Handle special cases for increment calculations
    if (name === "incrementPercentage") {
      const percentage = parseFloat(value) || 0;
      const currentCTC = parseFloat(formData.currentCTC) || 0;
      const incrementCTC = ((currentCTC * percentage) / 100).toFixed(2);

      setFormData((prev) => ({
        ...prev,
        incrementPercentage: value,
        incrementCTC: incrementCTC,
      }));
    } else if (name === "incrementCTC") {
      const incrementCTC = parseFloat(value) || 0;
      const currentCTC = parseFloat(formData.currentCTC) || 0;
      const percentage = ((incrementCTC / currentCTC) * 100).toFixed(2);

      setFormData((prev) => ({
        ...prev,
        incrementCTC: value,
        incrementPercentage: percentage,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  // Add new useEffect for bidirectional calculations
  useEffect(() => {
    const currentCTC = parseFloat(formData.currentCTC) || 0;
    const incrementPercentage = parseFloat(formData.incrementPercentage) || 0;
    const incrementCTC = parseFloat(formData.incrementCTC) || 0;

    // If current CTC changes, recalculate both increment values
    if (currentCTC > 0) {
      if (incrementPercentage > 0) {
        const newIncrementCTC = (
          (currentCTC * incrementPercentage) /
          100
        ).toFixed(2);
        setFormData((prev) => ({
          ...prev,
          incrementCTC: newIncrementCTC,
        }));
      } else if (incrementCTC > 0) {
        const newPercentage = ((incrementCTC / currentCTC) * 100).toFixed(2);
        setFormData((prev) => ({
          ...prev,
          incrementPercentage: newPercentage,
        }));
      }
    }
  }, [formData.currentCTC]);

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

  // Generate reference number if empty
  useEffect(() => {
    if (!formData.referenceNumber && formData.employeeId) {
      const year = getYear(currentDate);
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      setFormData((prev) => ({
        ...prev,
        referenceNumber: `INC/${year}/${formData.employeeId}/${randomPart}`,
      }));
    }
  }, [formData.employeeId]);

  // Fetch company logo
  useEffect(() => {
    const fetchLogo = async () => {
      if (!organizationCode) {
        showAlert("Organization code is required", "error");
        return;
      }

      try {
        setLoadingLogo(true);
        const response = await axios.get(
          `${base_identity}/identity-handler/logo/get-comapny-logo?organizationCode=${userDetails.organizationCode}`
        );

        if (response.data && response.data.logo) {
          setLogo(response.data.logo);
        } else {
          showAlert("No logo found for the organization", "warning");
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
        if (error.response) {
          // showAlert(
          //   `Error loading company logo: ${
          //     error.response.data.message || "Server error"
          //   }`,
          //   "error"
          // );
        } else if (error.request) {
          showAlert(
            "Error loading company logo: No response from server",
            "error"
          );
        } else {
          showAlert("Error loading company logo: " + error.message, "error");
        }
      } finally {
        setLoadingLogo(false);
      }
    };

    fetchLogo();
  }, [showAlert, organizationCode]);

  // Navigation functions
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Generate PDF with proper A4 formatting
  const generatePDF = async () => {
    try {
      setLoading((prev) => ({ ...prev, downloading: true }));
      const element = previewRef.current;
      if (!element) {
        showAlert("Increament Letter preview not found!", "error");
        setLoading((prev) => ({ ...prev, downloading: false }));
        return;
      }

      // Remove maxHeight/overflow for clean PDF
      const prevMaxHeight = element.style.maxHeight;
      const prevOverflow = element.style.overflowY;
      element.style.maxHeight = "none";
      element.style.overflowY = "visible";

      // Get employee details from location state
      const employeeData = location.state?.employeeData || {};
      const empCodeValue = employeeData.empCode || formData.employeeId || "";
      const name = employeeData.name || formData.employeeName || "";
      // Get email from location state's employeeEmail
      const email = location.state?.employeeEmail || employeeData.email || "";

      const filename = `IncrementLetter_${empCodeValue}_${format(
        new Date(),
        "MMMM_yyyy"
      )}.pdf`;

      const opt = {
        margin: [17, 10, 17, 10],
        filename,
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: "#ffffff",
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
        const formDataToSend = new FormData();
        formDataToSend.append("file", pdfBlob, filename);

        // Construct URL with all required parameters (including organizationCode)
        const uploadUrl = `${base_hr}/hr-handler/increment/save-increment-pdf-data?empCode=${empCodeValue}&name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}&organizationCode=${
          userDetails.organizationCode
        }`;

        const response = await axios.post(uploadUrl, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
          showAlert(
            "Increment letter saved to server successfully!",
            "success"
          );
        } else {
          showAlert("Failed to save increment letter to server", "error");
        }
      } catch (error) {
        console.error("Upload error:", error);
        showAlert(
          "Error saving increment letter to server: " + error.message,
          "error"
        );
      }

      showAlert("Increment letter PDF generated successfully!", "success");
    } catch (error) {
      console.error("PDF generation error:", error);
      showAlert("Error generating PDF: " + error.message, "error");
    } finally {
      setLoading((prev) => ({ ...prev, downloading: false }));
    }
  };

  // Load saved form data
  useEffect(() => {
    const savedData = localStorage.getItem("incrementLetterData");
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
        if (parsedData.effectiveDate) {
          parsedData.effectiveDate = new Date(parsedData.effectiveDate);
        }

        setFormData(parsedData);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Form validation
  const validateCurrentStep = () => {
    if (activeStep === 0) {
      // Validate employee information
      return (
        formData.employeeId &&
        formData.employeeName &&
        formData.designation &&
        formData.department
      );
    } else if (activeStep === 1) {
      // Validate increment details
      return (
        formData.incrementType &&
        formData.effectiveDate &&
        Number(formData.currentCTC) > 0 &&
        Number(formData.incrementPercentage) > 0
      );
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

            <Grid item xs={12}>
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
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                    // Prevent closing when clicking inside the menu
                    onMouseDown: (e) => e.preventDefault(),
                    // Keep menu open when clicking on search input
                    disableAutoFocusItem: true,
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon fontSize="small" />
                      <Typography>
                        {selected || "Select an employee"}
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
                              currentCTC: 0,
                            }));
                          }}
                          sx={{ ml: "auto" }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  )}
                >
                  {/* Search input at the top of the dropdown */}
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
                            ].filter(Boolean); // Remove null/undefined values

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

                  {/* Employee list with avatars */}
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <MenuItem
                        key={employee.id}
                        value={employee.email}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                          py: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
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
                onChange={(date) => handleDateChange("joiningDate", date)}
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

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Letter Date"
                value={formData.letterDate}
                onChange={(date) => handleDateChange("letterDate", date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
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
                Increment Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="increment-type-label">
                  Increment Type
                </InputLabel>
                <Select
                  labelId="increment-type-label"
                  id="increment-type"
                  name="incrementType"
                  value={formData.incrementType}
                  onChange={handleChange}
                  label="Increment Type"
                >
                  {incrementTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Effective Date"
                value={formData.effectiveDate}
                onChange={(date) => handleDateChange("effectiveDate", date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Salary Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="current-ctc">
                  Current CTC (Annual)
                </InputLabel>
                <OutlinedInput
                  id="current-ctc"
                  name="currentCTC"
                  type="number"
                  value={formData.currentCTC}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  label="Current CTC (Annual)"
                  required
                />
                <FormHelperText>
                  Monthly: ₹{formatCurrency(formData.currentCTC / 12)}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="increment-percentage">
                  Revised Salary Percentage (%)
                </InputLabel>
                <OutlinedInput
                  id="increment-percentage"
                  name="incrementPercentage"
                  type="number"
                  value={formData.incrementPercentage}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">%</InputAdornment>
                  }
                  label="Revised Salary Percentage (%)"
                  required
                  inputProps={{
                    step: 0.1,
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="increment-ctc">
                  Revised Salary CTC (Annual)
                </InputLabel>
                <OutlinedInput
                  id="increment-ctc"
                  name="incrementCTC"
                  type="number"
                  value={formData.incrementCTC}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  label="Revised Salary CTC (Annual)"
                />
                <FormHelperText>
                  Monthly: ₹{formatCurrency(formData.incrementCTC / 12)}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined" sx={{ bgcolor: "#f9f9f9", p: 2, mt: 2 }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Current Salary Breakdown
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">Basic Salary:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.currentBasic)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">HRA:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.currentHRA)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">
                          Conveyance Allowance:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.currentConveyance)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">
                          Special Allowance:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.currentSpecialAllowance)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body1">
                          Total Gross Salary:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.currentGross)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined" sx={{ bgcolor: "#f9f9f9", p: 2, mt: 2 }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Revised Salary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">
                          New Basic Salary:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.newBasic)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">New HRA:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.newHRA)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">
                          New Conveyance Allowance:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.newConveyance)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1">
                          New Special Allowance:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.newSpecialAllowance)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body1">
                          New Total Gross Salary:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.newGross)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body1">
                          New CTC (Annual):
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.newCTC)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body1">Monthly:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{formatCurrency(formData.newCTC / 12)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Special Note (Optional)"
                name="specialNote"
                value={formData.specialNote}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                helperText="Any special message or conditions related to this increment"
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Increment Letter Preview
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ ml: 2 }}
                >
                  Edit Increment Letter
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box
                ref={previewRef}
                id="increment-letter-preview"
                sx={{
                  border: "1px solid #ddd",
                  p: 3,
                  bgcolor: "#fff",
                  maxHeight: "650px",
                  overflowY: "auto",
                  boxSizing: "border-box",
                  width: "100%",
                  boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
                  "@media print": {
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                    maxHeight: "none",
                    overflow: "visible",
                  },
                }}
              >
                {/* Header Section */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                    "@media print": {
                      pageBreakAfter: "always",
                    },
                  }}
                >
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
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "10pt",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {incrementContent.companyAddress ||
                        "The Hive at VR Bengaluru, ITPL Main Road\nMahadevpura, Bengaluru - 560048"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10pt",
                        whiteSpace: "pre-line",
                      }}
                      variant="body2"
                    >
                      Email: hr@kprosolutions.com | Phone: +91 124 4567890
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "80px",
                      height: "40px",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "flex-end",
                      ml: 2,
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

                {/* Reference Number and Date */}
                <Box>
                  <Typography variant="body1">
                    <strong>Reference:</strong> {formData.referenceNumber}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Date:</strong>{" "}
                    {format(new Date(formData.letterDate), "dd-MM-yyyy")}
                  </Typography>
                </Box>

                {/* Employee Address */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">
                    <strong>{formData.employeeName}</strong>
                  </Typography>
                  <Typography variant="body1">
                    {formData.designation}
                  </Typography>
                  <Typography variant="body1">
                    {formData.department} Department
                  </Typography>
                  <Typography variant="body1">
                    Employee ID: {formData.employeeId}
                  </Typography>
                </Box>

                {/* Subject */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    Subject: {formData.incrementType}
                  </Typography>
                </Box>

                {/* Salary Summary Section */}
                <Box
                  sx={{
                    mt: 3,
                    mb: 3,
                    p: 2,
                    border: "1px solid #ddd",
                    bgcolor: "#f9f9f9",
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Salary Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{ p: 2, border: "1px solid #ddd", bgcolor: "#fff" }}
                      >
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          fontWeight="bold"
                        >
                          Current Salary
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body1">Annual CTC:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            ₹{formatCurrency(formData.currentCTC)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body1">Monthly:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            ₹{formatCurrency(formData.currentCTC / 12)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{ p: 2, border: "1px solid #ddd", bgcolor: "#fff" }}
                      >
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          fontWeight="bold"
                        >
                          Revised Salary
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body1">Annual CTC:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            ₹{formatCurrency(formData.newCTC)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body1">Monthly:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            ₹{formatCurrency(formData.newCTC / 12)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Letter Body */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">
                    Dear {formData.employeeName},
                  </Typography>

                  {incrementContent.header ? (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {incrementContent.header}
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      We are pleased to inform you that the management has
                      approved a salary revision for you. This increment is in
                      recognition of your satisfactory performance and valuable
                      contribution to the organization.
                    </Typography>
                  )}

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    The details of your salary revision are as follows:
                  </Typography>

                  {/* Increment Table */}
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      marginTop: "16px",
                    }}
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
                          Current (₹)
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          Revised (₹)
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          Increment (%)
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
                          ₹{formatCurrency(formData.currentBasic)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          ₹{formatCurrency(formData.newBasic)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {formData.incrementPercentage}%
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          HRA
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          ₹{formatCurrency(formData.currentHRA)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          ₹{formatCurrency(formData.newHRA)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {formData.incrementPercentage}%
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
                          ₹{formatCurrency(formData.currentConveyance)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          ₹{formatCurrency(formData.newConveyance)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {formData.incrementPercentage}%
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
                          ₹{formatCurrency(formData.currentSpecialAllowance)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          ₹{formatCurrency(formData.newSpecialAllowance)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {formData.incrementPercentage}%
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {(
                    incrementContent.incrementPoints || DEFAULT_INCREMENT_POINTS
                  ).map((point, index) => (
                    <Typography key={index} variant="body1" sx={{ mt: 2 }}>
                      {point}
                    </Typography>
                  ))}

                  {/* <Typography variant="body1" sx={{ mt: 2 }}>
                    The revised salary structure will be effective from{" "}
                    <strong>
                      {format(new Date(formData.effectiveDate), "dd MMMM yyyy")}
                    </strong>
                    .
                  </Typography>

                  {formData.specialNote && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {formData.specialNote}
                    </Typography>
                  )}

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    All other terms and conditions of your employment remain
                    unchanged.
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    We congratulate you on your salary revision and look forward
                    to your continued excellent performance and contribution to
                    the growth of the organization.
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Please sign and return a copy of this letter as a token of
                    your acceptance.
                  </Typography> */}

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Yours sincerely,
                  </Typography>
                </Box>

                {/* Signatures */}
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        mt: 2,
                        mb: 2,
                        height: "50px",
                        width: "150px",
                        bgcolor: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2">Signature</Typography>
                    </Box>
                    <Typography variant="body1">
                      <strong>{formData.signatoryName}</strong>
                    </Typography>
                    <Typography variant="body1">
                      {formData.signatoryDesignation}
                    </Typography>
                    <Typography variant="body1">
                      {userDetails.organizationName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      I accept the revised terms:
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        mb: 2,
                        height: "50px",
                        width: "150px",
                        borderBottom: "1px solid #000",
                      }}
                    ></Box>
                    <Typography variant="body1">
                      <strong>{formData.employeeName}</strong>
                    </Typography>
                    <Typography variant="body1">
                      Date: ______________________
                    </Typography>
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
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
              color="primary"
              onClick={generatePDF}
              startIcon={
                loading.downloading ? (
                  <CircularProgress size={20} />
                ) : (
                  <DownloadIcon />
                )
              }
              disabled={loading.downloading}
            >
              {loading.downloading ? "Generating..." : "Generate & Download"}
            </Button>
          )}
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              mt: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  height: "40px",
                }}
              >
                Back to List
              </Button>
              <Typography variant="h4" sx={{ mb: 0 }}>
                Increment Letter Generator
              </Typography>
            </Box>
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <IncreamentLetterEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          organizationCode={organizationCode}
          organizationName={userDetails.organizationName}
          onSave={handleIncrementContentSave}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default IncrementLetter;
