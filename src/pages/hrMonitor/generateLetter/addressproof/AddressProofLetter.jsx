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
import { format } from "date-fns";
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
  Edit as EditIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAlert } from "../../../../context/AlertContext";
import axios from "axios";
import { base_hr, base_identity } from "../../../../http/services";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import AddressProofEditDialog from "./AddressProofEditDialog";
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
const steps = ["Employee Information", "Address Details", "Preview & Print"];

// Letter types
const letterTypes = [
  "To Whomsoever It May Concern",
  "For Bank Verification",
  "For Visa Application",
  "For Rental Agreement",
  "For Government Verification",
];

const AddressProofLetter = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const [logo, setLogo] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [organizationCode] = useState(localStorage.getItem("organizationCode"));
  const previewRef = useRef();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  // const [organizationName] = useState('K-Pro Solutions Pvt. Ltd.');
  const userDetails = useSelector((state) => state.auth.user);
  const organizationName = userDetails.organizationName;

  // const midpoint = Math.ceil(organizationName.length / 2);
  // const firstHalf = organizationName.slice(0, midpoint);
  // const secondHalf = organizationName.slice(midpoint);

  // Add state for employee list and email selection
  const [employees, setEmployees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  // State for tracking active step
  const [activeStep, setActiveStep] = useState(0);

  // Get current date
  const currentDate = new Date();

  // State for form fields
  const [formData, setFormData] = useState({
    // Letter details
    letterDate: currentDate,
    referenceNumber: "",
    letterType: "To Whomsoever It May Concern",

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

    // Address details
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",

    // Additional details
    additionalNote: "",

    // Signatory
    signatoryName: "Smita Kashyap",
    signatoryDesignation: "Director, Human Resources",
  });

  // State for loading operations
  const [loading, setLoading] = useState({
    saving: false,
    printing: false,
    downloading: false,
  });

  // Add state for address proof content
  const [addressProofContent, setAddressProofContent] = useState({
    header: "",
    incrementPoints: [],
    footer: "",
    signatureName: "",
    companyAddress: "",
  });

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
              // Basic Information
              employeeId: employeeData.empCode || "",
              employeeName: employeeData.name || "",
              designation: employeeData.disignation || "",
              department: employeeData.function || "",

              // Contact Information
              officialEmail: employeeData.officialEmail || "",
              personalEmail: employeeData.personalEmail || "",
              primaryPhone: employeeData.primaryPhone || "",
              alternatePhone: employeeData.alternatePhone || "",

              // Address Information
              addressLine1: employeeData.address || "",
              city: employeeData.city || "",
              state: employeeData.state || "",
              postalCode: employeeData.pinCode || "",

              // Bank Details
              bankName: employeeData.bankName || "",
              bankAccount: employeeData.accountNumber || "",
              branchName: employeeData.branchName || "",
              ifseCode: employeeData.ifseCode || "",

              // Government IDs
              panNumber: employeeData.panNumber || "",
              aadharNumber: employeeData.aadharNumber || "",
              uanNumber: employeeData.uanNumber || "",

              // Employment Details
              joinDate: employeeData.dateOfJoin
                ? new Date(employeeData.dateOfJoin)
                : new Date(),
              offerDate: employeeData.offerDate
                ? new Date(employeeData.offerDate)
                : new Date(),
              dateOfBirth: employeeData.dateOfBirth
                ? new Date(employeeData.dateOfBirth)
                : new Date(),
              currentCTC: employeeData.ctc || 0,

              // Additional Information
              status: employeeData.status || "",
              current: employeeData.current || "",
              organizationCode: employeeData.organizationCode || "",
              extraData: employeeData.extraData || {},
            }));
          }
        } catch (error) {
          console.error("Error fetching employee details:", error);
          showAlert(
            "Error fetching employee details: " +
              (error.response?.data?.message || error.message),
            "error"
          );
        }
      })();
    }
  }, [location.state, showAlert]);

  // Fetch employees list
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const response = await axios.get(
          `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${organizationCode}`
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
            // Basic Information
            employeeId: employeeData.empCode || "",
            employeeName: employeeData.name || "",
            designation: employeeData.disignation || "",
            department: employeeData.function || "",

            // Address Information
            addressLine1: employeeData.address || "",
            addressLine2: employeeData.addressLine2 || "",
            city: employeeData.city || "",
            state: employeeData.state || "",
            postalCode: employeeData.pinCode || "",
            country: "India",

            // Employment Details
            joiningDate: employeeData.dateOfJoin
              ? new Date(employeeData.dateOfJoin)
              : new Date(),

            // Additional Information
            currentCTC: employeeData.ctc || 0,
          }));
          setEmailDisabled(true);
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
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            joiningDate: new Date(),
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
          `${base_identity}/identity-handler/logo/get-comapny-logo?organizationCode=${organizationCode}`
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

  // Generate reference number if empty
  useEffect(() => {
    if (!formData.referenceNumber && formData.employeeId) {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      setFormData((prev) => ({
        ...prev,
        referenceNumber: `ADR/${year}/${month}/${formData.employeeId}`,
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
      formData.country,
    ].filter((part) => part.trim() !== "");

    return addressParts.join(", ");
  };

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
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

  // Replace printAddressProofLetter with handleDownloadAndSavePDF
  const handleDownloadAndSavePDF = async () => {
    try {
      setLoading((prev) => ({ ...prev, printing: true }));
      const element = previewRef.current;
      if (!element) {
        showAlert("Preview not found!", "error");
        setLoading((prev) => ({ ...prev, printing: false }));
        return;
      }
      // Remove maxHeight/overflow for clean PDF
      const prevMaxHeight = element.style.maxHeight;
      const prevOverflow = element.style.overflowY;
      element.style.maxHeight = "none";
      element.style.overflowY = "visible";

      // Generate PDF as Blob
      const opt = {
        margin: [15, 10, 15, 10],
        filename: `AddressProofLetter_${
          formData.employeeId || formData.employeeName || "employee"
        }.pdf`,
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
      // Generate PDF and get Blob
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf("blob");

      // Download locally
      html2pdf().from(element).set(opt).save();

      // Prepare FormData for API
      const formDataToSend = new FormData();
      formDataToSend.append("file", pdfBlob, opt.filename);

      // Build API URL with query params
      const apiUrl =
        `${base_hr}/hr-handler/api/address-letter/save-address-pdf-data` +
        `?empCode=${encodeURIComponent(formData.employeeId)}` +
        `&name=${encodeURIComponent(formData.employeeName)}` +
        `&email=${encodeURIComponent(selectedEmail)}` +
        `&organizationCode=${encodeURIComponent(organizationCode)}`;

      // POST to API
      await axios.post(apiUrl, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showAlert("PDF generated and saved to server successfully!", "success");
      setTimeout(() => {
        element.style.maxHeight = prevMaxHeight;
        element.style.overflowY = prevOverflow;
      }, 1000);
    } catch (error) {
      console.error("PDF generation or upload error:", error);
      showAlert("Error generating or saving PDF: " + error.message, "error");
    } finally {
      setLoading((prev) => ({ ...prev, printing: false }));
    }
  };

  // Save form data
  const saveFormData = () => {
    try {
      setLoading((prev) => ({ ...prev, saving: true }));
      localStorage.setItem("addressProofLetterData", JSON.stringify(formData));

      setTimeout(() => {
        showAlert("Address proof letter data saved successfully!", "success");
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
    const savedData = localStorage.getItem("addressProofLetterData");
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
        formData.department &&
        formData.letterType
      );
    } else if (activeStep === 1) {
      // Validate address details
      return (
        formData.addressLine1 &&
        formData.city &&
        formData.state &&
        formData.postalCode
      );
    }
    return true;
  };

  // Add handler for content save
  const handleAddressProofContentSave = (savedContent) => {
    setAddressProofContent(savedContent);
    showAlert("Address proof letter content updated successfully!", "success");
  };

  // Add useEffect to fetch initial content
  useEffect(() => {
    const fetchInitialContent = async () => {
      try {
        const response = await axios.post(
          `${base_hr}/hr-handler/increment/find-increment-leter-content?organizationCode=${localStorage.getItem(
            "organizationCode"
          )}&content=addressproof`
        );

        if (response.data?.result) {
          const apiPoints = response.data.result.offerSummury
            ? Object.values(response.data.result.offerSummury).filter(
                (point) => point
              )
            : [];

          setAddressProofContent({
            header:
              response.data.result.header ||
              DEFAULT_ADDRESS_PROOF_HEADER(organizationName),
            incrementPoints:
              apiPoints.length > 0 ? apiPoints : DEFAULT_ADDRESS_PROOF_POINTS,
            footer:
              response.data.result.footer ||
              DEFAULT_ADDRESS_PROOF_FOOTER(organizationName),
            signatureName: response.data.result.signatureName || "",
            companyAddress:
              response.data.result.companyAddress ||
              "The Hive at VR Bengaluru, ITPL Main Road\nMahadevpura, Bengaluru - 560048",
          });
        }
      } catch (error) {
        console.error("Error fetching initial address proof content:", error);
        // Fall back to defaults
        setAddressProofContent({
          header: DEFAULT_ADDRESS_PROOF_HEADER(organizationName),
          incrementPoints: DEFAULT_ADDRESS_PROOF_POINTS,
          footer: DEFAULT_ADDRESS_PROOF_FOOTER(organizationName),
          signatureName: "",
          companyAddress:
            "The Hive at VR Bengaluru, ITPL Main Road\nMahadevpura, Bengaluru - 560048",
        });
      }
    };

    if (organizationCode) {
      fetchInitialContent();
    }
  }, [organizationCode]);

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
                <InputLabel id="email-select-label">Select Employee Email</InputLabel>
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
                onChange={(date) => handleDateChange("letterDate", date)}
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
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2
                }}
              >
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
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    ml: 2,
                  }}
                >
                  Edit Letter Content
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box
                id="address-proof-preview"
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
                ref={previewRef}
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
                      {addressProofContent.companyAddress ||
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
                      mt: 0,
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
                    ADDRESS PROOF LETTER
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
                </Box>

                {formData.letterType && (
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      mt: 2,
                      fontWeight: "bold",
                      textAlign: "center",
                      textDecoration: "underline"
                    }}
                  >
                    {formData.letterType}
                  </Typography>

                )}

                {/* Letter Body */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">
                    Dear {formData.employeeName},
                  </Typography>

                  {addressProofContent.header ? (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {addressProofContent.header}
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      This is to certify that you are a bonafide employee of our
                      organization and have been working with us.
                    </Typography>
                  )}

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    We confirm that your residential address as per our records
                    is:
                  </Typography>

                  <Box sx={{ ml: 4, my: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {formData.addressLine1}
                    </Typography>
                    {formData.addressLine2 && (
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {formData.addressLine2}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {formData.city}, {formData.state} - {formData.postalCode}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {formData.country}
                    </Typography>
                  </Box>

                  {(
                    addressProofContent.incrementPoints ||
                    DEFAULT_ADDRESS_PROOF_POINTS
                  ).map((point, index) => (
                    <Typography key={index} variant="body1" sx={{ mt: 2 }}>
                      {point}
                    </Typography>
                  ))}

                  {addressProofContent.footer && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {addressProofContent.footer}
                    </Typography>
                  )}

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
                      <strong>
                        {addressProofContent.signatureName ||
                          formData.signatoryName}
                      </strong>
                    </Typography>
                    <Typography variant="body1">
                      {formData.signatoryDesignation}
                    </Typography>
                    <Typography variant="body1">{organizationName}</Typography>
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
    if (activeStep === steps.length - 1) {
      return (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
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
              color: "white",
              borderRadius: 2,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              textTransform: "none",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
                backgroundColor: "#388e3c",
              },
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            disabled={loading.printing}
          >
            {loading.printing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                Downloading...
              </>
            ) : (
              "Download & Save"
            )}
          </Button>
        </Box>
      );
    }

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
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            endIcon={<NextIcon />}
            disabled={!validateCurrentStep()}
            sx={{
              borderRadius: 2,
              textTransform: "none",
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
              display: "flex",
              alignItems: "center",
              mb: 3,
              mt: 3,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ListIcon />}
              onClick={() => navigate("/dashboard-hr/address-proof-emp-list")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              Back to List
            </Button>

            <Typography
              variant="h4"
              component="h1"
              sx={{
                ml: 2,
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

        <AddressProofEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          organizationCode={organizationCode}
          organizationName={organizationName}
          onSave={handleAddressProofContentSave}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default AddressProofLetter;
