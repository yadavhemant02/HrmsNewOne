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
  Select,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import {
  format,
  differenceInMonths,
  differenceInYears,
  differenceInDays,
  addDays,
} from "date-fns";
import {
  Print as PrintIcon,
  Save as SaveIcon,
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAlert } from "../../../../context/AlertContext";
import axios from "axios";
import { base_hr, base_identity } from "../../../../http/services";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useSelector } from "react-redux";
import ReleavingLetterEdit from "./ReleavingLetterEdit";

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
const steps = ["Employee Information", "Releasing Details", "Preview & Print"];

// Employee exit reasons
const exitReasons = [
  "Resignation",
  "Retirement",
  "Contract Completion",
  "Mutual Agreement",
  "Better Opportunity",
  "Personal Reasons",
  "Relocation",
  "Health Reasons",
];

const ReleasingLetter = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const [logo, setLogo] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [organizationCode] = useState(localStorage.getItem("organizationCode"));
  const [loading, setLoading] = useState({
    saving: false,
    downloading: false,
    printing: false,
  });

  const userDetails = useSelector((state) => state.auth.user);
  const midpoint = Math.ceil(userDetails.organizationName.length / 2);
  const firstHalf = userDetails.organizationName.slice(0, midpoint);
  const secondHalf = userDetails.organizationName.slice(midpoint);

  // Email select logic (copied from IncrementLetter)
  const [employees, setEmployees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);

  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

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
              joiningDate: employeeData.dateOfJoin
                ? new Date(employeeData.dateOfJoin)
                : new Date(),
              address: employeeData.address || "",
              // Add more fields as needed
            }));
          }
        } catch (error) {
          console.error("Error fetching employee details:", error);
        }
      })();
    }
  }, [location.state]);

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
        // if (error.response) {
        //   showAlert(`Error loading company logo: ${error.response.data.message || 'Server error'}`, 'error');
        // } else if (error.request) {
        //   showAlert('Error loading company logo: No response from server', 'error');
        // } else {
        //   showAlert('Error loading company logo: ' + error.message, 'error');
        // }
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
    referenceNumber: "",

    // Employee details
    employeeId: "",
    employeeName: "",
    designation: "",
    department: "",
    joiningDate: new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate()
    ),
    address: "",

    // Releasing details
    lastWorkingDate: currentDate,
    releaseDate: addDays(currentDate, 1),
    exitReason: "Resignation",
    noticePeriod: 30, // in days
    noticePeriodServed: true,
    duesCleared: true,

    // Experience details
    experienceDuration: "", // Calculated field

    // Additional details
    additionalRemarks: "",
    rehireEligible: true,

    // Signatory
    signatoryName: "Smita Kashyap",
    signatoryDesignation: "Director, Human Resources",
  });

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Calculate experience duration automatically
  useEffect(() => {
    if (formData.joiningDate && formData.lastWorkingDate) {
      try {
        const joining = new Date(formData.joiningDate);
        const lastWorking = new Date(formData.lastWorkingDate);

        if (joining <= lastWorking) {
          const years = differenceInYears(lastWorking, joining);
          const months = differenceInMonths(lastWorking, joining) % 12;
          const days = differenceInDays(lastWorking, joining) % 30;

          let experience = "";

          if (years > 0) {
            experience += `${years} year${years !== 1 ? "s" : ""}`;
          }

          if (months > 0) {
            experience += `${experience ? ", " : ""}${months} month${
              months !== 1 ? "s" : ""
            }`;
          }

          if (days > 0 || (!years && !months)) {
            experience += `${experience ? " and " : ""}${days} day${
              days !== 1 ? "s" : ""
            }`;
          }

          setFormData((prev) => ({
            ...prev,
            experienceDuration: experience,
          }));
        }
      } catch (error) {
        console.error("Error calculating experience duration:", error);
      }
    }
  }, [formData.joiningDate, formData.lastWorkingDate]);

  // Generate reference number if empty
  useEffect(() => {
    if (!formData.referenceNumber && formData.employeeId) {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      setFormData((prev) => ({
        ...prev,
        referenceNumber: `REL/${year}/${month}/${formData.employeeId}`,
      }));
    }
  }, [formData.employeeId]);

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox/boolean changes
  const handleBooleanChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  // Navigation functions
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Download & Save PDF
  const handleDownloadAndSavePDF = async () => {
    try {
      setLoading((prev) => ({ ...prev, downloading: true }));

      const element = document.getElementById("releasing-letter-preview");
      if (!element) {
        showAlert("Relieving letter preview not found!", "error");
        setLoading((prev) => ({ ...prev, downloading: false }));
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
      const filename = `Relieving_Letter_${empCodeValue}_${format(
        new Date(),
        "yyyy-MM-dd"
      )}.pdf`;

      const opt = {
        margin: [15, 10, 15, 10],
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

      // Save to backend (new API, same as ReleavingLetterNew)
      try {
        const formDataForUpload = new FormData();
        formDataForUpload.append("file", pdfBlob, filename);
        // Compose API URL with query params
        const apiUrl = `${base_hr}/hr-handler/api/relieving-letter/save-relieving-pdf-data?empCode=${encodeURIComponent(
          formData.employeeId
        )}&name=${encodeURIComponent(
          formData.employeeName
        )}&email=${encodeURIComponent(
          selectedEmail
        )}&organizationCode=${encodeURIComponent(
          userDetails.organizationCode
        )}`;
        const response = await axios.post(apiUrl, formDataForUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data) {
          showAlert(
            "Relieving letter generated and saved successfully!",
            "success"
          );
          setTimeout(() => {
            navigate("/dashboard-hr/releasing-letter-emp-list");
          }, 2000);
        }
      } catch (error) {
        console.error("Upload error:", error);
        showAlert(
          "Error saving relieving letter to server: " + error.message,
          "error"
        );
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      showAlert("Error generating PDF: " + error.message, "error");
    } finally {
      setLoading((prev) => ({ ...prev, downloading: false }));
    }
  };

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
      // Validate releasing details
      return formData.lastWorkingDate && formData.exitReason;
    }
    return true;
  };

  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Add state for letter content
  const [letterContent, setLetterContent] = useState({
    header: "",
    incrementPoints: [],
    footer: "",
    signatureName: "",
    companyAddress: "",
  });

  // Add handler for saving content
  const handleLetterContentSave = (savedContent) => {
    setLetterContent(savedContent);
    showAlert("Relieving letter content updated successfully!", "success");
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
            {/* Email Select Field - same as IncrementLetter */}
            {/* <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="email-select-label">Select Employee Email</InputLabel>
                <Select
                  labelId="email-select-label"
                  id="email-select"
                  value={selectedEmail}
                  onChange={handleEmailSelect}
                  label="Select Employee Email"
                  disabled={emailDisabled}
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.email}>
                      {employee.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}

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

            <Grid item xs={12} md={12}>
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
                Releasing Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="exit-reason-label">Reason for Exit</InputLabel>
                <Select
                  labelId="exit-reason-label"
                  id="exit-reason"
                  name="exitReason"
                  value={formData.exitReason}
                  onChange={handleChange}
                  label="Reason for Exit"
                >
                  {exitReasons.map((reason) => (
                    <MenuItem key={reason} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Last Working Date"
                value={formData.lastWorkingDate}
                onChange={(date) => handleDateChange("lastWorkingDate", date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Official Release Date"
                value={formData.releaseDate}
                onChange={(date) => handleDateChange("releaseDate", date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    helperText="Usually the day after last working day"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Notice Period (Days)"
                name="noticePeriod"
                type="number"
                value={formData.noticePeriod}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="notice-period-served-label">
                  Notice Period Served
                </InputLabel>
                <Select
                  labelId="notice-period-served-label"
                  id="notice-period-served"
                  value={formData.noticePeriodServed}
                  name="noticePeriodServed"
                  onChange={handleChange}
                  label="Notice Period Served"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="dues-cleared-label">
                  All Dues Cleared
                </InputLabel>
                <Select
                  labelId="dues-cleared-label"
                  id="dues-cleared"
                  value={formData.duesCleared}
                  name="duesCleared"
                  onChange={handleChange}
                  label="All Dues Cleared"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Experience Information
              </Typography>
              <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                <Typography variant="body1">
                  Based on your inputs, this employee has worked for:{" "}
                  <strong>{formData.experienceDuration}</strong>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="rehire-eligible-label">
                  Eligible for Rehire
                </InputLabel>
                <Select
                  labelId="rehire-eligible-label"
                  id="rehire-eligible"
                  value={formData.rehireEligible}
                  name="rehireEligible"
                  onChange={handleChange}
                  label="Eligible for Rehire"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Additional Remarks (Optional)"
                name="additionalRemarks"
                value={formData.additionalRemarks}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                helperText="Any additional information to include in the letter"
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
                  Relieving Letter Preview
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ ml: 2 }}
                >
                  Edit Relieving Letter
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Box
                id="releasing-letter-preview"
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
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      fontSize: "10pt",
                      whiteSpace: "pre-line",
                    }}
                  >
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
                      sx={{ fontSize: "10pt", whiteSpace: "pre-line" }}
                    >
                      {letterContent.companyAddress ||
                        "The Hive at VR Bengaluru, ITPL Main Road\nMahadevpura, Bengaluru - 560048"}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "10pt" }}>
                      Email: hr@kprosolutions.com | Phone: +91 124 4567890
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "80px",
                      height: "40px",
                      bgcolor: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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

                {/* Title */}
                <Box sx={{ textAlign: "center", my: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "uppercase",
                      textDecoration: "underline",
                    }}
                  >
                    RELIEVING LETTER
                  </Typography>
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
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>{formData.address}</strong>
                  </Typography>
                </Box>

                {/* Letter Body */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">
                    To: <strong>{formData.employeeName}</strong>
                  </Typography>

                  {letterContent.header ? (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {letterContent.header}
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      This is to certify that{" "}
                      <strong>{formData.employeeName}</strong> was employed with{" "}
                      <strong>{userDetails.organizationName}</strong> as{" "}
                      <strong>{formData.designation}</strong> in the{" "}
                      <strong>{formData.department}</strong> department
                      (Employee ID: {formData.employeeId}).
                    </Typography>
                  )}

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {formData.employeeName.split(" ")[0]} joined our
                    organization on{" "}
                    <strong>
                      {format(new Date(formData.joiningDate), "dd-MM-yyyy")}
                    </strong>{" "}
                    and worked with us until{" "}
                    <strong>
                      {format(new Date(formData.lastWorkingDate), "dd-MM-yyyy")}
                    </strong>
                    , for a period of{" "}
                    <strong>{formData.experienceDuration}</strong>.
                  </Typography>

                  {(letterContent.incrementPoints || []).map((point, index) => (
                    <Typography key={index} variant="body1" sx={{ mt: 2 }}>
                      {point}
                    </Typography>
                  ))}

                  {letterContent.footer ? (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {letterContent.footer}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        During {formData.employeeName.split(" ")[0]}'s tenure
                        with us,{" "}
                        {formData.employeeName.indexOf(" ") > -1
                          ? "he/she"
                          : "they"}{" "}
                        was found to be sincere, hardworking, and demonstrated a
                        high level of professionalism in{" "}
                        {formData.employeeName.indexOf(" ") > -1
                          ? "his/her"
                          : "their"}{" "}
                        work.
                      </Typography>

                      <Typography variant="body1" sx={{ mt: 2 }}>
                        All company dues and clearances have been settled, and{" "}
                        {formData.employeeName.indexOf(" ") > -1
                          ? "he/she"
                          : "they"}{" "}
                        has been officially relieved of{" "}
                        {formData.employeeName.indexOf(" ") > -1
                          ? "his/her"
                          : "their"}{" "}
                        duties effective{" "}
                        <strong>
                          {format(new Date(formData.releaseDate), "dd-MM-yyyy")}
                        </strong>
                        .
                      </Typography>

                      {formData.additionalRemarks && (
                        <Typography variant="body1" sx={{ mt: 2 }}>
                          {formData.additionalRemarks}
                        </Typography>
                      )}

                      <Typography variant="body1" sx={{ mt: 2 }}>
                        We wish {formData.employeeName.split(" ")[0]} all the
                        best for{" "}
                        {formData.employeeName.indexOf(" ") > -1
                          ? "his/her"
                          : "their"}{" "}
                        future endeavors.
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Signature */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body1">
                    For <strong>{userDetails.organizationName}</strong>,
                  </Typography>
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
                    <strong>
                      {letterContent.signatureName || formData.signatoryName}
                    </strong>
                  </Typography>
                  <Typography variant="body1">
                    {formData.signatoryDesignation}
                  </Typography>
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
            disabled={loading.downloading}
          >
            {loading.downloading ? (
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

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() =>
                navigate("/dashboard-hr/releasing-letter-emp-list")
              }
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
              Relieving Letter Generator
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
        <ReleavingLetterEdit
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          organizationCode={organizationCode}
          organizationName={userDetails.organizationName}
          onSave={handleLetterContentSave}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default ReleasingLetter;
