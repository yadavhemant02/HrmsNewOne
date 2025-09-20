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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { format, set } from "date-fns";
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon,
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as ResetIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation, Form } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useAlert } from "../../../context/AlertContext";
import { base_candidate, base_hr, base_identity } from "../../../http/services";
import { useCompanyLogo } from "../../../hooks/useCompanyLogo";
import { useSelector } from "react-redux";

import html2pdf from "html2pdf.js";
import OfferletterEditDialog from "./OfferletterEditDialog";
import OfferLetterEditNew from "./OfferLetterEditNew";
import InternType from './offerlettertype/InternType';
import Consultant from './offerlettertype/Consultant';
import PartTime from './offerlettertype/PartTime';

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

// Default component percentages
const DEFAULT_COMPONENT_PERCENTAGES = {
  basicSalary: 54.12,
  hra: 18.75,
  conveyanceAllowance: 6.33,
  specialAllowance: 20.8,
};

// Add the DEFAULT_COMPANY_ADDRESS constant at the top with other constants
const DEFAULT_COMPANY_ADDRESS =
  "The Hive at VR Bengaluru, ITPL Main Road\nMahadevpura, Bengaluru - 560048";

// Enhanced document styling for print/PDF with precise A4 sizing and layout
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
  .page-break {
    page-break-after: always;
    height: 0;
    display: block;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 10px;
    page-break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    font-size: 11pt;
  }
  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  ol, ul {
    padding-left: 30px;
  }
  li {
    margin-bottom: 8px;
  }
  h6 {
    font-size: 16pt;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .annexure-title {
    font-size: 16pt;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  .annexure-b {
    page-break-before: always;
  }
  .logo-placeholder {
    width: 80px;
    height: 40px;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .signature-placeholder {
    height: 50px;
    width: 150px;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 30px 0;
  }
  .signature-line {
    height: 50px;
    width: 150px;
    border-bottom: 1px solid #000;
    margin: 30px 0;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    margin-bottom: 30px;
    page-break-inside: avoid;
  }
  .footer-column {
    width: 45%;
  }
`;

// Form steps
const steps = ["Employee Information", "Compensation Details", "Preview"];

// Add this format function near the top of the file, after the imports
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Add this constant after the imports
const DEFAULT_OFFER_POINTS = [
  "You are required to join the services of the Organization at the earliest, but in any case, not later than 18th March, 2024 or any other date approved by the Organization in writing, failing which this offer shall automatically stand cancelled. Your employment with the Organization shall commence on the date of your joining the Organization and shall be subject to the terms and conditions stated in this letter along with the enclosures.",
  "This offer is made to you on the basis of the information and documents that you have furnished to the Organization as on date of offer.",
  "The Organization reserves the right to conduct background checks, directly or indirectly at any time, to verify such information and documents that you would provide in support of your age, academic qualifications, previous work experience and relieving letter from your last employer, and other particulars. If any discrepancies are found in such information or documents or if the results of such background checks are found to be unsatisfactory, as determined by the Organization, in its sole discretion, the Organization may withdraw/cancel this offer.",
  "Upon joining, your compensation will be as described in Annexure A.",
  "Your employment will be governed by the terms and conditions detailed in Annexure B hereto.",
  "You shall keep the contents of this offer and the Annexure here to confidential.",
  "On joining, you will be required to sign an agreement based on the Independence, Non – solicitation and Prevention of Insider Trading policies of the Organization.",
  "This offer shall automatically stand withdrawn if we do not receive your acceptance within five (5) working days from the date hereof.",
];

const DEFAULT_OFFER_HEADER = (organizationName) =>
  `Thank you for exploring career opportunities with ${organizationName} (here in after referred to as the "Organization").`;

const DEFAULT_OFFER_FOOTER = (
  organizationName
) => `Please acknowledge your acceptance of our offer, as well as having read and understood the terms of service given in the Annexure, by signing and returning the duplicate copy of this letter.

We look forward to your joining the ${organizationName} family and to your valued contribution in taking the Organization to greater heights. We are sure that our working environment will be conducive and will help you to grow professionally as well as personally.

With warm regards,`;

const GenerateNewOfferLetter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location,"pppppppppppppppppppppppppppp");
  const { showAlert } = useAlert();
  const { logoUrl, logoLoading, logoError } = useCompanyLogo();
  const organizationCode = localStorage.getItem("organizationCode");
  const [employeeList, setEmployeeList] = useState([]);
  const userDetails = useSelector((state) => state.auth.user);
  const organizationName = userDetails?.organizationName;
  const candidateData = location.state?.candidateData || {}; 
  const feedbackId = location.state?.candidateData?.feedbackId || "";
  
  //  console.log(candidateData,"lllllllllllllllllllllll")



   const [candidateInfo, setCandidateInfo] = useState({})

   


  // Function to generate unique temp ID
  const generateTempId = () => {
    const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
    const lastTempId = localStorage.getItem('lastTempId') || '99'; // Get last used number or default to 99
    const nextNumber = (parseInt(lastTempId) + 1).toString(); // Increment by 1
    const newTempId = `TEMP${currentYear}${nextNumber}`;
    localStorage.setItem('lastTempId', nextNumber); // Save the new number
    return newTempId;
  };

  // State for tracking active step
  const [activeStep, setActiveStep] = useState(0);


   const [formData, setFormData] = useState({
    currentDate: new Date(),
    candidateName: candidateData.candidateName || "",
    position: candidateData.position || "",
    joiningDate: new Date(),
    function: "",
    designation: candidateInfo.designation || "",
    email: candidateData.candidateEmail || "",
    empCode: generateTempId(), // Initialize with generated temp ID
    address: candidateData.address || "",
    totalCTC: candidateData.packege || 0,
    basicSalary: 0,
    hra: 0,
    conveyanceAllowance: 0,
    specialAllowance: 0,
    medicalAllowance: 0,
    lta: 0,
    booksAndPeriodicals: 0,
    telephoneReimbursement: 0,
    grossSalary: 0,
    hasCTC: true,
    employmentType: "Full Time",
  });

   const [employeeDetails, setEmployeeDetails] = useState({
    offerLetter: null,
    bankName: "",
    uanNumber: "",
    panNumber: "",
    ifseCode: "",
    branchName: "",
    accountNumber: "",
    dateOfJoin: null,
    offerDate: null,
    dateOfBirth: null,
    name: "",
    empCode: "",
    position: "",
    disignation: "" ,
    function: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    primaryPhone: "",
    alternatePhone: "",
    officialEmail: "",
    personalEmail: "",
    aadharNumber: "",
    ctc: "",
    organizationCode: userDetails?.organizationCode || "",
  });


    useEffect(()=>{
      getCandidateData();
  },[])




  // ..Hemant.. ocnce check this method is useable or not if not please remove it......\\
   const getCandidateData = async()=>{
    try {
      const response = await axios.get(`${base_candidate}/candidate-handler/info/get-candidate-data?candidateId=${candidateData.candidateId}`);
      console.log(response,"llllllllllllllllllllooooooooooooo")
      setCandidateInfo(response.data)
       setFormData(prev => ({
    ...prev,
    designation: response.data.designation || "",
    address: response.data.address || "",
  
  }));

  //  setEmployeeDetails(prev => ({
  //   ...prev,
  //   designation: response.data.designation || "",
  //   address: response.data.address || "",
  // }));

  setEmployeeDetails(prev => ({
  ...prev,
  name: response.data.name || "",
  empCode: response.data.candidateId || "",
  position: response.data.highQualification || "", // You can change as needed
  designation: response.data.designation || "",
  function: response.data.techStack?.join(", ") || "", // if techStack is array
  address: response.data.address || "",
  city: "", // no city in response
  state: "", // no state in response
  pinCode: "", // no pinCode in response
  primaryPhone: response.data.number || "",
  alternatePhone: "",
  officialEmail: "", // not available in response
  personalEmail: response.data.email || "",
  aadharNumber: "", // not available
  ctc: "",
  dateOfBirth: response.data.dateOfBirth || "",
  organizationCode: response.data.organizationCode || prev.organizationCode
}));

    } catch (error) {
      console.log(error)
    }
   }


  // State for form fields
 

 





  useEffect(() => {
   
    // Only set formData from candidateData on initial mount or when candidateData changes meaningfully
    if (candidateData && candidateData.candidateName) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        candidateName: candidateData.candidateName || "",
        position: candidateData.position || "",
        joiningDate: candidateData.joiningDate ? new Date(candidateData.joiningDate) : new Date(),
        function: candidateData.function || "",
        designation:  "",
        email: candidateData.candidateEmail || "",
        address: candidateData.address || "",
        totalCTC: candidateData.totalCTC || 0,
        basicSalary: candidateData.basicSalary || 0,
        hra: candidateData.hra || 0,
        conveyanceAllowance: candidateData.conveyanceAllowance || 0,
        specialAllowance: candidateData.specialAllowance || 0,
        medicalAllowance: candidateData.medicalAllowance || 0,
        lta: candidateData.lta || 0,
        booksAndPeriodicals: candidateData.booksAndPeriodicals || 0,
        telephoneReimbursement: candidateData.telephoneReimbursement || 0,
        grossSalary: candidateData.grossSalary || 0,
        employmentType: candidateData.employmentType || "Full Time",
      }));
    }
    // Only run when candidateData.candidateName changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateData.candidateName]);

  // State for component percentages
  const [componentPercentages, setComponentPercentages] = useState({
    ...DEFAULT_COMPONENT_PERCENTAGES,
  });

  // State for custom components - ensure it's initialized as an array
  const [customComponents, setCustomComponents] = useState([]);

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingComponentIndex, setEditingComponentIndex] = useState(null);
  const [newComponent, setNewComponent] = useState({
    name: "",
    percentage: 0,
    value: 0,
  });

  // State for percentage dialog
  const [percentageDialogOpen, setPercentageDialogOpen] = useState(false);
  const [editingPercentageName, setEditingPercentageName] = useState("");
  const [editingPercentageValue, setEditingPercentageValue] = useState(0);

  // State for loading operations
  const [loading, setLoading] = useState({
    downloading: false,
  });

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    autoHideDuration: 3000, // 3 seconds auto-hide
  });

  // State for custom tax saving components
  const [customTaxComponents, setCustomTaxComponents] = useState([]);
  const [taxDialogOpen, setTaxDialogOpen] = useState(false);
  const [editingTaxComponentIndex, setEditingTaxComponentIndex] =
    useState(null);
  const [newTaxComponent, setNewTaxComponent] = useState({
    name: "",
    value: 0,
  });

  // Add state for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [componentToDeleteIndex, setComponentToDeleteIndex] = useState(null);
  const [componentToDeleteName, setComponentToDeleteName] = useState("");

  // Create ref for custom components section
  const customComponentsRef = useRef(null);

  // Create ref for custom tax components section
  const customTaxComponentsRef = useRef(null);

  // Add state for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Add this state near the top with other state declarations
  const [offerContent, setOfferContent] = useState({
    header: "",
    offerSummury: [],
    footer: "",
    signatureName: "",
    companyAddress: DEFAULT_COMPANY_ADDRESS,
  });

  const handleOfferContentSave = (savedContent) => {
    setOfferContent(savedContent);
    showLocalAlert("Offer letter content updated successfully", "success");
  };

  // Fetch offer content on mount if organizationCode is present
  useEffect(() => {
    const fetchOfferContent = async () => {
      try {
        const response = await axios.get(
          `${base_identity}/identity-handler/content/get-offer-content?orgnaizationCode=${organizationCode}&empType=${formData.employmentType}`
        );
        if (response.data) {
          const apiPoints = response.data.offerSummury
            ? Object.values(response.data.offerSummury).filter((point) => point)
            : [];
          const points =
            apiPoints.length > 0 ? apiPoints : DEFAULT_OFFER_POINTS;
          setOfferContent({
            header:
              response.data.header || DEFAULT_OFFER_HEADER(organizationName),
            offerSummury: points,
            footer:
              response.data.footer || DEFAULT_OFFER_FOOTER(organizationName),
            signatureName: response.data.signatureName || "Smita Kashyap",
            companyAddress:
              response.data.companyAddress || DEFAULT_COMPANY_ADDRESS,
          });
        } else {
          setOfferContent({
            header: DEFAULT_OFFER_HEADER(organizationName),
            offerSummury: DEFAULT_OFFER_POINTS,
            footer: DEFAULT_OFFER_FOOTER(organizationName),
            signatureName: "Smita Kashyap",
            companyAddress: DEFAULT_COMPANY_ADDRESS,
          });
        }
      } catch (error) {
        setOfferContent({
          header: DEFAULT_OFFER_HEADER(organizationName),
          offerSummury: DEFAULT_OFFER_POINTS,
          footer: DEFAULT_OFFER_FOOTER(organizationName),
          signatureName: "Smita Kashyap",
          companyAddress: DEFAULT_COMPANY_ADDRESS,
        });
      }
    };
    if (organizationCode) {
      fetchOfferContent();
    }
  }, [organizationCode, organizationName, formData.employmentType]);

  // Calculate all values automatically whenever totalCTC changes
  useEffect(() => {
    calculateSalaryComponents();
  }, [
    formData.totalCTC,
    componentPercentages,
    customComponents.length,
    customTaxComponents.length,
  ]);

  // Monitor componentPercentages object for deep changes
  useEffect(() => {
    calculateSalaryComponents();
  }, [JSON.stringify(componentPercentages)]);

  // Monitor custom components for deep changes
  useEffect(() => {
    calculateSalaryComponents();
  }, [JSON.stringify(customComponents)]);

  // Watch for changes in customComponents array
  useEffect(() => {
    // Force UI update and recalculation when components change
    if (customComponents.length >= 0) {
      calculateSalaryComponents();

      // Force update percentage totals display
      const forceUpdate = { ...formData };
      setFormData(forceUpdate);
    }
  }, [customComponents.length]); // Only run when component count changes

  // Add useEffect for customTaxComponents changes
  // ... existing code ...
  // Monitor custom tax components for deep changes
  useEffect(() => {
    calculateSalaryComponents();
  }, [JSON.stringify(customTaxComponents)]);

  // Watch for changes in customTaxComponents array length
  useEffect(() => {
    // Force UI update and recalculation when tax components change
    if (customTaxComponents && customTaxComponents.length >= 0) {
      calculateSalaryComponents();

      // Force update for tax component displays
      const forceUpdate = { ...formData };
      setFormData(forceUpdate);
    }
  }, [customTaxComponents.length]); // Only run when component count changes
  // ... existing code ...

  // Calculate salary components based on totalCTC and percentages
  const calculateSalaryComponents = () => {
    try {
      const totalCTC = Number(formData.totalCTC) || 0;

      // Calculate main components
      const basicSalary = Math.round(
        (totalCTC * (componentPercentages?.basicSalary || 0)) / 100
      );
      const hra = Math.round(
        (totalCTC * (componentPercentages?.hra || 0)) / 100
      );
      const conveyanceAllowance = Math.round(
        (totalCTC * (componentPercentages?.conveyanceAllowance || 0)) / 100
      );
      const specialAllowance = Math.round(
        (totalCTC * (componentPercentages?.specialAllowance || 0)) / 100
      );

      // Apply updated values for custom components
      const safeCustomComponents = customComponents || [];
      const updatedCustomComponents = safeCustomComponents.map((component) => ({
        ...component,
        percentage: component?.percentage || 0,
        value: Math.round((totalCTC * (component?.percentage || 0)) / 100),
      }));

      // Calculate gross salary (sum of all components)
      const customComponentsTotal = updatedCustomComponents.reduce(
        (sum, component) => sum + (component?.value || 0),
        0
      );
      const grossSalary =
        basicSalary +
        hra +
        conveyanceAllowance +
        specialAllowance +
        customComponentsTotal;

      // Fixed tax saving components from the special allowance
      const medicalAllowance = 15000 * 12; // 15000 per month = 180000 per year
      const lta = Math.round(specialAllowance * 0.2); // 20% of special allowance

      // Calculate remaining amount after fixed components
      const remainingAmount = Math.max(
        0,
        specialAllowance - medicalAllowance - lta
      );

      // Get number of custom tax components plus the two default components
      const customTaxCount = (customTaxComponents || []).length;
      const totalShares = customTaxCount + 2; // +2 for books and telephone

      // Distribute remaining amount
      let booksAndPeriodicals = 0;
      let telephoneReimbursement = 0;

      // If we have any remaining amount to distribute
      if (remainingAmount > 0) {
        if (customTaxCount > 0) {
          // Divide remaining amount equally - ensure we get exact division
          const sharePerComponent = Math.floor(remainingAmount / totalShares);

          // Calculate any remaining amount after division to avoid losing pennies
          const remainderAfterDivision =
            remainingAmount - sharePerComponent * totalShares;

          // Update the default components - add remainder to books to ensure all money is allocated
          booksAndPeriodicals = sharePerComponent + remainderAfterDivision;
          telephoneReimbursement = sharePerComponent;

          // Update tax components state with functional update to preserve existing properties
          setCustomTaxComponents((prevTaxComponents) => {
            // Make sure we have an array
            const safeComponents = Array.isArray(prevTaxComponents)
              ? prevTaxComponents
              : [];

            // Return updated components with preserved properties
            return safeComponents.map((component) => ({
              ...component, // Keep all existing properties including name and highlight
              value: sharePerComponent, // Update only the value property
            }));
          });

          // Log for debugging
          console.log("Tax calculation - Remaining amount:", remainingAmount);
          console.log("Tax calculation - Components count:", totalShares);
          console.log(
            "Tax calculation - Share per component:",
            sharePerComponent
          );
          console.log(
            "Tax calculation - Remainder added to books:",
            remainderAfterDivision
          );
        } else {
          // If no custom components, split evenly between books and telephone
          booksAndPeriodicals = Math.ceil(remainingAmount / 2);
          telephoneReimbursement = Math.floor(remainingAmount / 2);
        }
      } else {
        // If no remaining amount, set all to zero
        booksAndPeriodicals = 0;
        telephoneReimbursement = 0;

        // Also update tax components to zero
        setCustomTaxComponents((prevTaxComponents) => {
          return (prevTaxComponents || []).map((component) => ({
            ...component,
            value: 0,
          }));
        });
      }

      // Update form data with all calculated values
      setFormData((prev) => ({
        ...prev,
        basicSalary,
        hra,
        conveyanceAllowance,
        specialAllowance,
        grossSalary,
        medicalAllowance,
        lta,
        booksAndPeriodicals,
        telephoneReimbursement,
      }));

      // Update custom components with recalculated values
      if (
        JSON.stringify(safeCustomComponents) !==
        JSON.stringify(updatedCustomComponents)
      ) {
        setCustomComponents(updatedCustomComponents);
      }

      // Force UI update for all display elements that use calculations
      setTimeout(() => {
        const currentTotalPercentage = getTotalPercentage();
        if (currentTotalPercentage > 100) {
          showLocalAlert(
            `Total percentage (${currentTotalPercentage.toFixed(
              2
            )}%) exceeds 100%. Please adjust values.`,
            "warning"
          );
        }
      }, 0);
    } catch (error) {
      console.error("Error in calculateSalaryComponents:", error);
      showLocalAlert(
        "Error calculating salary components. Please check your inputs.",
        "error"
      );
    }
  };

  // Fetch all employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${organizationCode}`
        );
        if (response.data) {
          setEmployeeList(response.data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        showAlert("Error fetching employee list", "error");
      }
    };

    if (organizationCode) {
      fetchEmployees();
    }
  }, [organizationCode, showAlert]);

  const printableRaf = useRef();

  const prepareFormData = () => {
    const formData = new FormData();

    // Append all fields to formData
    Object.keys(employeeDetails).forEach((key) => {
      if (
        key === "dateOfJoin" ||
        key === "offerDate" ||
        key === "dateOfBirth"
      ) {
        if (employeeDetails[key]) {
          formData.append(key, formatDateForSubmission(employeeDetails[key]));
        }
      } else if (key === "offerLetter" && employeeDetails[key]) {
        formData.append(key, employeeDetails[key]);
      } else {
        formData.append(key, employeeDetails[key]);
      }
    });

    // Append custom fields
    customFields.forEach((field) => {
      formData.append(`custom_${field.name}`, field.value);
    });

    return formData;
  };
  const handleDownloadAndUploadPDF = async () => {
    try {
      setLoading((prev) => ({ ...prev, downloading: true }));

      const element = printableRaf.current;

      // Remove max-height constraint and overflow before generating PDF
      element.style.maxHeight = "none";
      element.style.overflow = "visible";

      // Use the stored empCode or fallback to a value derived from email
      const empCodeValue =
        formData.empCode ||
        (formData.email ? formData.email.split("@")[0] : "employee");

      const opt = {
        margin: [15, 10, 15, 10],
        filename: `OfferLetter_${empCodeValue}.pdf`,
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

      // Create consistent payload for both APIs
      const payload = {
        file: pdfBlob,
        empCode: empCodeValue,
        name: formData.candidateName,
        organizationCode: organizationCode
      };

      // Send PDF to backend
      const formDataForUpload = new FormData();
      formDataForUpload.append("file", pdfBlob, `OfferLetter_${empCodeValue}.pdf`);
      formDataForUpload.append("empCode", payload.empCode);
      formDataForUpload.append("name", payload.name);
      formDataForUpload.append("organizationCode", payload.organizationCode);
      formDataForUpload.append("email",formData.email)

      const mapFormDataToEmployeeDetails = () => {
        setEmployeeDetails((prevDetails) => ({
          ...prevDetails,
          name: payload.name,
          empCode: payload.empCode,
          position: formData.position,
          disignation: formData.designation,
          function: formData.function,
          address: formData.address,
          officialEmail: formData.email,
          ctc: formData.totalCTC,
          dateOfJoin: formData.joiningDate,
          offerDate: formData.currentDate,
          offerLetter: pdfBlob,
          organizationCode: payload.organizationCode,
        }));
      };
      mapFormDataToEmployeeDetails();

      const employeeDetailsFormData = new FormData();
      employeeDetailsFormData.append("name", payload.name);
      employeeDetailsFormData.append("empCode", payload.empCode);
      employeeDetailsFormData.append("position", employeeDetails.position || formData.position);
      employeeDetailsFormData.append("designation", employeeDetails.disignation || formData.designation);
      employeeDetailsFormData.append("function", formData.function || "");
      employeeDetailsFormData.append("address", employeeDetails.address || formData.address);
      employeeDetailsFormData.append("officialEmail", "officialEmail"+payload.empCode);
      employeeDetailsFormData.append("personalEmail", formData.email || "");
      employeeDetailsFormData.append("ctc", formData.totalCTC || 0);
      employeeDetailsFormData.append("primaryPhone", employeeDetails.primaryPhone || "");
      employeeDetailsFormData.append("alternatePhone", employeeDetails.primaryPhone|| "");

      const formatDateForAPI = (date) => {
        if (!date) return "";
        try {
          return new Date(date).toISOString().split("T")[0];
        } catch (error) {
          console.error("Error formatting date:", error);
          return "";
        }
      };

      employeeDetailsFormData.append("dateOfJoin", formatDateForAPI(formData.joiningDate));
      employeeDetailsFormData.append("offerDate", formatDateForAPI(formData.currentDate));
      employeeDetailsFormData.append("organizationCode", payload.organizationCode);
      employeeDetailsFormData.append("current", "NEW");
      employeeDetailsFormData.append("empType", "Full Time");
      employeeDetailsFormData.append("offerLetter", pdfBlob, "offerLetter.pdf");


      console.log(formData,"llllleeeeeeeeeeeeeeeeeeeeeeeeeee")
      try {
        const response3 = await axios.post(
          `${base_identity}/identity-handler/details/save-emp-details`,
          employeeDetailsFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response3);

          try {
        const response = await axios.post(
          `${base_identity}/identity-handler/details/generate-offer-letter`,
          formDataForUpload
        );

        try {
           axios.get(
      `${base_hr}/hr-handler/feedback/select-candidate/by-feedback-id?feedbackId=${feedbackId}&reason=generated&status=generated`
      // `${base_hr}/hr-handler/result/remove-data-from/result?resultId=${candidateData.resultId}`,
    );
          
        } catch (error) {
          console.log(error);
        }

        if (response.status === 200) {
          showLocalAlert("Offer letter saved successfully!", "success");
        } else {
          console.error("Failed to upload PDF");
          showLocalAlert("Failed to save offer letter", "error");
        }
      } catch (error) {
        console.error("Upload error:", error);
        showLocalAlert("Error saving offer letter: " + error.message, "error");
      }
      } catch (error) {
        console.log(error);
      }

    

      // Reset element styles
      setTimeout(() => {
        element.style.maxHeight = "750px";
        element.style.overflowY = "auto";
      }, 1000);
    } catch (error) {
      console.error("PDF generation error:", error);
      showLocalAlert("Error generating PDF: " + error.message, "error");
    } finally {
      setLoading((prev) => ({ ...prev, downloading: false }));
    }

   
  };


  // Handle form field changes
  // const handleChange = (event) => {
  //   const { name, value, type, checked } = event.target;

  //   // Prevent manual editing of temp ID
  //   if (name === 'empCode') {
  //     return;
  //   }

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value,
  //   }));

  //   if (name === 'candidateName') {
  //     console.log("hello")
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   }



  //   // If CTC is unchecked, set totalCTC to 0
  //   if (name === 'hasCTC' && !checked) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       totalCTC: 0,
  //       basicSalary: 0,
  //       hra: 0,
  //       conveyanceAllowance: 0,
  //       specialAllowance: 0,
  //       medicalAllowance: 0,
  //       lta: 0,
  //       booksAndPeriodicals: 0,
  //       telephoneReimbursement: 0,
  //       grossSalary: 0,
  //     }));
  //   }
  // };
  const handleChange = (event) => {
  const { name, value, type, checked } = event.target;

  // Update form data first
  setFormData((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));

  // Handle special cases after state update
  if (name === 'hasCTC' && !checked) {
    setFormData((prev) => ({
      ...prev,
      totalCTC: 0,
      basicSalary: 0,
      hra: 0,
      conveyanceAllowance: 0,
      specialAllowance: 0,
      medicalAllowance: 0,
      lta: 0,
      booksAndPeriodicals: 0,
      telephoneReimbursement: 0,
      grossSalary: 0,
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

  // Handle percentage change
  const handlePercentageChange = (name, newPercentage) => {
    // Validate that percentages sum to 100%
    const currentTotal = Object.entries(componentPercentages).reduce(
      (sum, [key, value]) => (key === name ? sum : sum + value),
      0
    );

    const customComponentsTotal = customComponents.reduce(
      (sum, comp) => sum + comp.percentage,
      0
    );

    if (currentTotal + Number(newPercentage) + customComponentsTotal > 100) {
      showLocalAlert("Total percentage cannot exceed 100%", "error");
      return;
    }

    setComponentPercentages({
      ...componentPercentages,
      [name]: Number(newPercentage),
    });
  };

  // Open percentage edit dialog
  const openPercentageDialog = (name, value) => {
    setEditingPercentageName(name);
    setEditingPercentageValue(value);
    setPercentageDialogOpen(true);
  };

  // Save updated percentage
  const savePercentage = () => {
    handlePercentageChange(editingPercentageName, editingPercentageValue);
    setPercentageDialogOpen(false);
  };

  // Reset percentages to default
  const resetPercentages = () => {
    setComponentPercentages({ ...DEFAULT_COMPONENT_PERCENTAGES });
  };

  // Open dialog for adding/editing custom component
  const openComponentDialog = (index = null) => {
    if (index !== null) {
      // Editing existing component
      setEditingComponentIndex(index);
      // Make a fresh copy of the component to edit
      setNewComponent({
        ...customComponents[index],
        highlight: false, // Reset highlight flag when editing
      });
    } else {
      // Adding new component
      setEditingComponentIndex(null);
      setNewComponent({
        name: "",
        percentage: 0,
        value: 0,
      });
    }
    // Open dialog immediately
    setDialogOpen(true);
  };

  // Handle custom component field changes
  const handleComponentChange = (event) => {
    const { name, value } = event.target;

    if (name === "percentage") {
      // Calculate value immediately based on percentage
      const percentage = Number(value);
      const calculatedValue = Math.round(
        (Number(formData.totalCTC) * percentage) / 100
      );

      setNewComponent({
        ...newComponent,
        percentage,
        value: calculatedValue,
      });
    } else {
      // For other fields like name
      setNewComponent({
        ...newComponent,
        [name]: value,
      });
    }
  };

  // Save custom component
  const saveComponent = () => {
    try {
      // Check for duplicate names
      const isDuplicate = (customComponents || []).some(
        (comp, index) =>
          comp?.name === newComponent?.name && index !== editingComponentIndex
      );

      if (isDuplicate) {
        showLocalAlert("Component with this name already exists", "error");
        return;
      }

      // Validate that percentages sum to 100%
      const currentComponentsPercentage = Object.values(
        componentPercentages || {}
      ).reduce((sum, value) => sum + (value || 0), 0);

      const currentCustomComponentsPercentage = (customComponents || []).reduce(
        (sum, comp, index) =>
          index === editingComponentIndex ? sum : sum + (comp?.percentage || 0),
        0
      );

      const totalPercentage =
        currentComponentsPercentage +
        currentCustomComponentsPercentage +
        Number(newComponent?.percentage || 0);

      if (totalPercentage > 100) {
        showLocalAlert("Total percentage cannot exceed 100%", "error");
        return;
      }

      const safeNewComponent = {
        name: newComponent?.name || "Component",
        percentage: Number(newComponent?.percentage || 0),
        value: 0,
        highlight: true,
      };

      let updatedComponents;

      if (editingComponentIndex !== null) {
        // Update existing component
        updatedComponents = [...(customComponents || [])];

        // Make sure the component exists at the specified index
        if (
          editingComponentIndex >= 0 &&
          editingComponentIndex < updatedComponents.length
        ) {
          updatedComponents[editingComponentIndex] = {
            ...safeNewComponent,
            value: Math.round(
              (Number(formData.totalCTC) *
                Number(safeNewComponent.percentage)) /
              100
            ),
          };
          showLocalAlert(
            `Component "${safeNewComponent.name}" updated successfully`,
            "success"
          );
        } else {
          showLocalAlert(
            "Invalid component index. Could not update component.",
            "error"
          );
          return;
        }
      } else {
        // Add new component
        const newComponentValue = Math.round(
          (Number(formData.totalCTC) * Number(safeNewComponent.percentage)) /
          100
        );
        updatedComponents = [
          ...(customComponents || []),
          {
            ...safeNewComponent,
            value: newComponentValue,
          },
        ];
        showLocalAlert(
          `Component "${safeNewComponent.name}" added successfully`,
          "success"
        );
      }

      // Update state with new components
      setCustomComponents(updatedComponents);
      setDialogOpen(false);

      // Calculate salary components immediately
      calculateSalaryComponents();

      // Scroll to custom components section immediately
      if (customComponentsRef.current) {
        customComponentsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Remove highlight after animation
      setTimeout(() => {
        const unhighlightedComponents = updatedComponents.map((comp) => ({
          ...comp,
          highlight: false,
        }));
        setCustomComponents(unhighlightedComponents);
      }, 2000);
    } catch (error) {
      console.error("Error saving component:", error);
      showLocalAlert("Error saving component. Please try again.", "error");
    }
  };

  // Handle delete button click
  const handleDeleteClick = (index) => {
    try {
      setComponentToDeleteIndex(index);
      setComponentToDeleteName(
        (customComponents || [])[index]?.name || "Component"
      );
      setDeleteDialogOpen(true);
    } catch (error) {
      console.error("Error setting up delete:", error);
      showLocalAlert("Error preparing delete dialog", "error");
    }
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (componentToDeleteIndex !== null) {
      try {
        const safeComponents = customComponents || [];

        // Check if the index is valid
        if (
          componentToDeleteIndex < 0 ||
          componentToDeleteIndex >= safeComponents.length
        ) {
          showLocalAlert(
            "Invalid component index. Cannot delete component.",
            "error"
          );
          setDeleteDialogOpen(false);
          setComponentToDeleteIndex(null);
          return;
        }

        // Get the component to be deleted
        const componentToDelete = safeComponents[componentToDeleteIndex];

        if (!componentToDelete) {
          showLocalAlert("Component not found. Cannot delete.", "error");
          setDeleteDialogOpen(false);
          setComponentToDeleteIndex(null);
          return;
        }

        // Show success notification about deletion
        showLocalAlert(
          `Component "${componentToDelete.name || "Component"
          }" deleted successfully`,
          "success"
        );

        // Create a copy of customComponents without the deleted item
        const updatedComponents = safeComponents.filter(
          (_, i) => i !== componentToDeleteIndex
        );

        // Update state with the filtered components
        setCustomComponents(updatedComponents);

        // Force recalculation immediately to update all values
        calculateSalaryComponents();

        // Close delete dialog
        setDeleteDialogOpen(false);
        setComponentToDeleteIndex(null);
      } catch (error) {
        console.error("Error deleting component:", error);
        showLocalAlert("Error deleting component", "error");
      }
    } else if (editingTaxComponentIndex !== null) {
      try {
        const safeTaxComponents = customTaxComponents || [];

        // Check if the index is valid
        if (
          editingTaxComponentIndex < 0 ||
          editingTaxComponentIndex >= safeTaxComponents.length
        ) {
          showLocalAlert(
            "Invalid tax component index. Cannot delete component.",
            "error"
          );
          setDeleteDialogOpen(false);
          setEditingTaxComponentIndex(null);
          return;
        }

        // Get the component to be deleted
        const taxComponentToDelete =
          safeTaxComponents[editingTaxComponentIndex];

        if (!taxComponentToDelete) {
          showLocalAlert("Tax component not found. Cannot delete.", "error");
          setDeleteDialogOpen(false);
          setEditingTaxComponentIndex(null);
          return;
        }

        // Show success notification about deletion
        showLocalAlert(
          `Tax component "${taxComponentToDelete.name || "Tax Component"
          }" deleted successfully`,
          "success"
        );

        // Create a copy of customTaxComponents without the deleted item
        const updatedTaxComponents = safeTaxComponents.filter(
          (_, i) => i !== editingTaxComponentIndex
        );

        // Update state with the filtered components
        setCustomTaxComponents(updatedTaxComponents);

        // Force recalculation immediately to update all values
        calculateSalaryComponents();

        // Close delete dialog
        setDeleteDialogOpen(false);
        setEditingTaxComponentIndex(null);
      } catch (error) {
        console.error("Error deleting tax component:", error);
        showLocalAlert("Error deleting tax component", "error");
      }
    }
  };

  // Delete custom component (now just opens confirmation dialog)
  const deleteComponent = (index) => {
    console.log("Delete component clicked for index:", index);
    // Set the index and open the confirmation dialog
    handleDeleteClick(index);
  };

  // Calculate monthly values with null check
  const getMonthlyValue = (annual) => {
    const value = Number(annual) || 0;
    return Math.round(value / 12);
  };

  // Format currency with null check
  const formatCurrency = (value) => {
    const numValue = Number(value) || 0;
    return numValue.toLocaleString("en-IN");
  };

  // Get component name for display
  const getComponentDisplayName = (key) => {
    const nameMap = {
      basicSalary: "Basic Salary",
      hra: "HRA",
      conveyanceAllowance: "Conveyance Allowance",
      specialAllowance: "Special Allowance",
    };
    return nameMap[key] || key;
  };

  // Navigation functions
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Generate PDF with proper A4 formatting and margins (kept for future reference but not used in UI)
  const generatePDF = async () => {
    try {
      setLoading((prev) => ({ ...prev, downloading: true }));
      const element = document.getElementById("offer-letter-preview");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate effective content area width (accounting for margins)
      const contentWidth = A4_WIDTH_MM - PAGE_MARGIN_MM * 2;

      // Use html2canvas with better quality settings
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Calculate height proportional to width
      const aspectRatio = canvas.height / canvas.width;
      const imgHeight = contentWidth * aspectRatio;

      // Calculate number of pages needed
      const contentHeight = A4_HEIGHT_MM - PAGE_MARGIN_MM * 2;
      const pageCount = Math.ceil(imgHeight / contentHeight);

      // Add each page
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const srcHeight = canvas.height / pageCount;
        const srcY = i * srcHeight;

        // Create a new canvas for this page section
        const pageCanvas = document.createElement("canvas");
        const context = pageCanvas.getContext("2d");
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcHeight;

        // Draw the specific portion of the original canvas
        context.drawImage(
          canvas,
          0,
          srcY,
          canvas.width,
          srcHeight,
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
        );

        const pageImgData = pageCanvas.toDataURL("image/jpeg", 1.0);

        // Add image to PDF with proper margins
        pdf.addImage(
          pageImgData,
          "JPEG",
          PAGE_MARGIN_MM,
          PAGE_MARGIN_MM,
          contentWidth,
          contentHeight
        );
      }

      pdf.save(
        `offer_letter_${formData.candidateName.replace(/\s+/g, "_")}.pdf`
      );

      showAlert("PDF generated successfully!", "success");
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
        formData.candidateName && formData.function && formData.designation
      );
    } else if (activeStep === 1) {
      // If hasCTC is true, validate totalCTC > 0, otherwise allow proceeding
      return !formData.hasCTC || Number(formData.totalCTC) > 0;
    }
    return true;
  };

  // Calculate total percentage
  const getTotalPercentage = () => {
    const standardComponentsTotal = Object.values(
      componentPercentages || {}
    ).reduce((sum, value) => sum + value, 0);
    const customComponentsTotal = (customComponents || []).reduce(
      (sum, component) => sum + (component?.percentage || 0),
      0
    );
    return standardComponentsTotal + customComponentsTotal;
  };

  // Form content based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                gap: 2,
                mb: 2,
                width: "100%",
              }}
            >
              <Typography variant="h6" sx={{ minWidth: "200px" }}>
                Employee Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Offer Date"
                value={formData.currentDate}
                onChange={(date) => handleDateChange("currentDate", date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Joining Date"
                value={formData.joiningDate}
                onChange={(date) => handleDateChange("joiningDate", date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>




            <Grid item xs={12} md={6}>
              <TextField
                label="Candidate Name"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                helperText="Enter the full name of the candidate"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                helperText="Enter the employee's email address"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Temp Id"
                name="empCode"
                value={formData.empCode}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                helperText="Temp Id Generated Automatically"
                InputProps={{
                  // readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleRefreshTempId}
                        edge="end"
                        size="small"
                        title="Generate new Temp ID"
                      >
                        <RefreshIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Function"
                name="function"
                value={formData.function}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                helperText="Enter the department/function (e.g., IT, Finance)"
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
                helperText="Enter the specific designation (e.g., Senior Developer)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                helperText="Enter the position offered"
              />
            </Grid>

            {/* Address input field */}
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                multiline
                minRows={3}
                helperText="Enter the employee's address"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Compensation Details
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
                <Grid item xs={12}>
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
                      Monthly: ₹{formatCurrency(getMonthlyValue(formData.totalCTC))}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          fontWeight="bold"
                        >
                          Salary Components ({getTotalPercentage().toFixed(2)}% of
                          Total CTC)
                        </Typography>
                        <Box>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ResetIcon />}
                            onClick={resetPercentages}
                            sx={{ mr: 1 }}
                          >
                            Reset
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => openComponentDialog()}
                          >
                            Add Component
                          </Button>
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Default components with percentages. Total should equal
                        100%.
                      </Typography>

                      <Grid container spacing={2}>
                        {/* Standard components section */}
                        {Object.entries(componentPercentages).map(
                          ([key, percentage]) => (
                            <Grid item xs={12} md={6} key={key}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  border: "1px solid #ddd",
                                  borderRadius: 2,
                                  p: 2,
                                  bgcolor: theme.palette.background.paper,
                                }}
                              >
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle2">
                                    {getComponentDisplayName(key)} ({percentage}%)
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    ₹{formatCurrency(formData[key])} / year
                                  </Typography>
                                </Box>
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    openPercentageDialog(key, percentage)
                                  }
                                  size="small"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Grid>
                          )
                        )}

                        {/* Custom components section with heading */}
                        {(customComponents || []).length > 0 && (
                          <Grid item xs={12} ref={customComponentsRef}>
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
                                    Custom Components (
                                    {(customComponents || []).length})
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    These components have been added by you
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="text.secondary"
                                  >
                                    Total Custom:{" "}
                                    {(customComponents || [])
                                      .reduce(
                                        (sum, comp) =>
                                          sum + (comp?.percentage || 0),
                                        0
                                      )
                                      .toFixed(2)}
                                    % | ₹
                                    {formatCurrency(
                                      (customComponents || []).reduce(
                                        (sum, comp) => sum + (comp?.value || 0),
                                        0
                                      )
                                    )}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                        )}

                        {(customComponents || []).map((component, index) => (
                          <Grid item xs={12} md={6} key={`custom-${index}`}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: component?.highlight
                                  ? "2px solid #4caf50"
                                  : "1px solid #ddd",
                                borderRadius: 2,
                                p: 2,
                                bgcolor: component?.highlight
                                  ? "rgba(76, 175, 80, 0.1)"
                                  : theme.palette.background.paper,
                                boxShadow: component?.highlight
                                  ? "0 4px 10px rgba(76, 175, 80, 0.25)"
                                  : "0 2px 4px rgba(0,0,0,0.1)",
                                transition: "all 0.5s ease",
                                animation: component?.highlight
                                  ? "pulse 1.5s"
                                  : "none",
                                "@keyframes pulse": {
                                  "0%": {
                                    boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.4)",
                                  },
                                  "70%": {
                                    boxShadow: "0 0 0 10px rgba(76, 175, 80, 0)",
                                  },
                                  "100%": {
                                    boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)",
                                  },
                                },
                                "&:hover": {
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {component?.name || "Component"} (
                                  {component?.percentage || 0}%)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Annual: ₹{formatCurrency(component?.value || 0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Monthly: ₹
                                  {formatCurrency(
                                    getMonthlyValue(component?.value || 0)
                                  )}
                                </Typography>
                              </Box>
                              <Box>
                                <IconButton
                                  color="primary"
                                  onClick={() => openComponentDialog(index)}
                                  size="small"
                                  sx={{ mr: 0.5 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteClick(index)}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      color: "white",
                      mb: 2,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                      >
                        Gross Salary
                      </Typography>
                      <Typography variant="h6">
                        Annual: ₹{formatCurrency(formData.grossSalary)}
                      </Typography>
                      <Typography variant="body1">
                        Monthly: ₹
                        {formatCurrency(getMonthlyValue(formData.grossSalary))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 2,
                      mt: 2,
                      bgcolor: "#f3f8ff",
                      border: "1px solid #b3d1ff",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                      >
                        Tax Saving Components (Auto-calculated from Special
                        Allowance)
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Available for tax savings: ₹
                        {formatCurrency(
                          Math.max(
                            0,
                            formData.specialAllowance -
                            formData.medicalAllowance -
                            formData.lta
                          )
                        )}
                        {customTaxComponents &&
                          customTaxComponents.length > 0 &&
                          ` (divided equally among ${customTaxComponents.length + 2
                          } components)`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="medicalAllowance">
                      Medical Allowance (Annual)
                    </InputLabel>
                    <OutlinedInput
                      id="medicalAllowance"
                      name="medicalAllowance"
                      type="number"
                      value={formData.medicalAllowance}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      startAdornment={
                        <InputAdornment position="start">₹</InputAdornment>
                      }
                      label="Medical Allowance (Annual)"
                    />
                    <FormHelperText>
                      Monthly: ₹
                      {formatCurrency(getMonthlyValue(formData.medicalAllowance))}
                      (Fixed at ₹15,000 per month)
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="lta">LTA (Annual)</InputLabel>
                    <OutlinedInput
                      id="lta"
                      name="lta"
                      type="number"
                      value={formData.lta}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      startAdornment={
                        <InputAdornment position="start">₹</InputAdornment>
                      }
                      label="LTA (Annual)"
                    />
                    <FormHelperText>
                      Monthly: ₹{formatCurrency(getMonthlyValue(formData.lta))}
                      (20% of Special Allowance)
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="booksAndPeriodicals">
                      Books and Periodicals (Annual)
                    </InputLabel>
                    <OutlinedInput
                      id="booksAndPeriodicals"
                      name="booksAndPeriodicals"
                      type="number"
                      value={formData.booksAndPeriodicals}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      startAdornment={
                        <InputAdornment position="start">₹</InputAdornment>
                      }
                      label="Books and Periodicals (Annual)"
                    />
                    <FormHelperText>
                      Monthly: ₹
                      {formatCurrency(
                        getMonthlyValue(formData.booksAndPeriodicals)
                      )}
                      (Auto-calculated from remaining amount)
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="telephoneReimbursement">
                      Telephone Reimbursement (Annual)
                    </InputLabel>
                    <OutlinedInput
                      id="telephoneReimbursement"
                      name="telephoneReimbursement"
                      type="number"
                      value={formData.telephoneReimbursement}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      startAdornment={
                        <InputAdornment position="start">₹</InputAdornment>
                      }
                      label="Telephone Reimbursement (Annual)"
                    />
                    <FormHelperText>
                      Monthly: ₹
                      {formatCurrency(
                        getMonthlyValue(formData.telephoneReimbursement)
                      )}
                      (Auto-calculated from remaining amount)
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Display custom tax components */}
                {(customTaxComponents || []).length > 0 && (
                  <Grid item xs={12} ref={customTaxComponentsRef}>
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
                            Custom Tax Components (
                            {(customTaxComponents || []).length})
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            These components are auto-calculated from remaining
                            Special Allowance
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="text.secondary"
                          >
                            Each component: ₹
                            {formatCurrency(
                              customTaxComponents &&
                                customTaxComponents.length > 0 &&
                                formData.booksAndPeriodicals
                                ? formData.booksAndPeriodicals
                                : 0
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {(customTaxComponents || []).map((component, index) => (
                  <Grid item xs={12} md={6} key={`custom-tax-${index}`}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: component?.highlight
                          ? "2px solid #4caf50"
                          : "1px solid #ddd",
                        borderRadius: 2,
                        p: 2,
                        bgcolor: component?.highlight
                          ? "rgba(76, 175, 80, 0.1)"
                          : theme.palette.background.paper,
                        boxShadow: component?.highlight
                          ? "0 4px 10px rgba(76, 175, 80, 0.25)"
                          : "0 2px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.5s ease",
                        animation: component?.highlight ? "pulse 1.5s" : "none",
                        "@keyframes pulse": {
                          "0%": { boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.4)" },
                          "70%": { boxShadow: "0 0 0 10px rgba(76, 175, 80, 0)" },
                          "100%": { boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)" },
                        },
                        "&:hover": {
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {component?.name || "Tax Component"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Annual: ₹{formatCurrency(component?.value || 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monthly: ₹
                          {formatCurrency(getMonthlyValue(component?.value || 0))}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditingTaxComponentIndex(index);
                            setNewTaxComponent({
                              name: component?.name || "Tax Component",
                              value: component?.value || 0,
                            });
                            setTaxDialogOpen(true);
                          }}
                          size="small"
                          sx={{ mr: 0.5 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleTaxComponentDelete(index)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingTaxComponentIndex(null);
                      setNewTaxComponent({ name: "", value: 0 });
                      setTaxDialogOpen(true);
                    }}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    Add Custom Tax Component
                  </Button>
                </Grid>
              </>
            )}
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
                  Offer Letter Preview
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel id="employment-type-label">Employment Type</InputLabel>
                    <Select
                      labelId="employment-type-label"
                      id="employment-type"
                      name="employmentType"
                      value={formData.employmentType || "Full Time"}
                      label="Employment Type"
                      onChange={handleChange}
                      sx={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="Full Time">Full Time</MenuItem>
                      <MenuItem value="Intern">Intern</MenuItem>
                      <MenuItem value="Part Time">Part Time</MenuItem>
                      <MenuItem value="Consultant">Consultant</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => setEditDialogOpen(true)}
                  >
                    Edit Offer Letter
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box
                ref={printableRaf}
                id="offer-letter-preview"
                sx={{
                  border: "1px solid #ddd",
                  p: 4,
                  bgcolor: "#fff",
                  maxHeight: "750px",
                  overflowY: "auto",
                  boxSizing: "border-box",
                  width: "100%",
                  boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
                  fontFamily: "Arial, sans-serif",
                  lineHeight: 1.6,
                  fontSize: "11pt",
                }}
              >
                {formData.employmentType === "Intern" ? (
                  <InternType
                    formData={formData}
                    organizationName={organizationName}
                    offerContent={offerContent}
                  />
                ) : formData.employmentType === "Consultant" ? (
                  <Consultant
                    formData={formData}
                    organizationName={organizationName}
                    offerContent={offerContent}
                  />
                ) : formData.employmentType === "Part Time" ? (
                  <PartTime
                    formData={formData}
                    organizationName={organizationName}
                    offerContent={offerContent}
                  />
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
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
                          {offerContent.companyAddress || DEFAULT_COMPANY_ADDRESS}
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
                          overflow: "hidden",
                          ml: 2,
                        }}
                      >
                        {logoUrl ? (
                          <img
                            src={logoUrl}
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

                    <Typography variant="body1" sx={{ mt: 2, textAlign: "left" }}>
                      <strong>
                        {formData.currentDate && formatDate(formData.currentDate)}
                      </strong>
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      <strong>
                        Dear {formData.candidateName || "[Candidate Name]"},
                      </strong>
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ mt: 1, mb: 2, whiteSpace: "pre-line" }}
                    >
                      {formData.address || "[Address]"}
                    </Typography>
                    <br />

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {offerContent.header ||
                        `Thank you for exploring career opportunities with ${organizationName} (here in after referred to as the "Organization").`}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      You have successfully completed our initial selection process
                      and we are pleased to make you an offer of employment for the
                      position of{" "}
                      <strong>{formData.position || "[Position]"}</strong>.
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      This offer is based on your profile and performance in the
                      selection process subject to the following:
                    </Typography>

                    <Typography variant="body1" component="ol" sx={{ mt: 2 }}>
                      {offerContent.offerSummury.map((point, index) => (
                        <li
                          key={index}
                          style={{ marginTop: index > 0 ? "10px" : 0 }}
                        >
                          {point}
                        </li>
                      ))}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2, pl: 3 }}>
                      However, if at any time post joining it is found that, the
                      Organization is not satisfied with the results of your
                      background check or you have furnished false information or
                      withheld or suppressed any material fact or information, the
                      Organization shall be entitled to forthwith terminate your
                      employment without notice in terms with clause 7 of Annexure
                      B.
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {offerContent.footer ||
                        `Please acknowledge your acceptance of our offer, as well as having read and understood the terms of service given in the Annexure, by signing and returning the duplicate copy of this letter.

We look forward to your joining the ${organizationName} family and to your valued contribution in taking the Organization to greater heights. We are sure that our working environment will be conducive and will help you to grow professionally as well as personally.

With warm regards,`}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 3 }}>
                      For <strong>{organizationName}</strong>,
                    </Typography>

                    <Box
                      sx={{
                        mt: 4,
                        mb: 4,
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

                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>{offerContent.signatureName}</strong>
                    </Typography>

                    <Typography variant="body1">
                      <strong>Director</strong>
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 5, mb: 3 }}>
                      ANNEXURE A
                    </Typography>

                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "30px",
                        marginBottom: "30px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Name</strong>
                          </td>
                          <td
                            width={470}
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <strong>
                              {formData.candidateName || "[Candidate Name]"}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Date of Joining</strong>
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>
                              {formData.joiningDate &&
                                formatDate(formData.joiningDate)}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Function</strong>
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>{formData.function || "[Function]"}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Designation</strong>
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>
                              {formData.designation || "[Designation]"}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <Typography variant="body1" sx={{ mt: 3, mb: 3 }}>
                      <strong>Compensation Details</strong>
                    </Typography>

                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "15px",
                        marginBottom: "30px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              backgroundColor: "#f5f5f5",
                            }}
                          >
                            Component
                          </th>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              backgroundColor: "#f5f5f5",
                              textAlign: "center",
                            }}
                          >
                            Annual (₹)
                          </th>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              backgroundColor: "#f5f5f5",
                              textAlign: "center",
                            }}
                          >
                            Monthly (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
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
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(getMonthlyValue(formData.basicSalary))}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            House Rent Allowance (HRA)
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.hra)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(getMonthlyValue(formData.hra))}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
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
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹
                            {formatCurrency(
                              getMonthlyValue(formData.conveyanceAllowance)
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
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
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹
                            {formatCurrency(
                              getMonthlyValue(formData.specialAllowance)
                            )}
                          </td>
                        </tr>
                        {(customComponents || []).map((component) => (
                          <tr key={component?.name || `comp-${Math.random()}`}>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              {component?.name || "Custom Component"}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              ₹{formatCurrency(component?.value || 0)}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              ₹
                              {formatCurrency(
                                getMonthlyValue(component?.value || 0)
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            Gross Salary
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            ₹{formatCurrency(formData.grossSalary)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            ₹{formatCurrency(getMonthlyValue(formData.grossSalary))}
                          </td>
                        </tr>
                        <tr style={{ backgroundColor: "#e3f2fd" }}>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            Total CTC
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            ₹{formatCurrency(formData.totalCTC)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            ₹{formatCurrency(getMonthlyValue(formData.totalCTC))}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <Typography variant="body1" sx={{ mt: 3, mb: 3 }}>
                      <strong>
                        Reimbursements (Tax saving components in Special Allowance)
                      </strong>
                    </Typography>

                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "30px",
                        marginBottom: "30px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Medical
                          </td>
                          <td
                            width={235}
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.medicalAllowance)}
                          </td>
                          <td
                            width={235}
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹
                            {formatCurrency(
                              getMonthlyValue(formData.medicalAllowance)
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px #ddd", padding: "8px" }}>
                            LTA
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.lta)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(getMonthlyValue(formData.lta))}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Books And Periodicals
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.booksAndPeriodicals)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹
                            {formatCurrency(
                              getMonthlyValue(formData.booksAndPeriodicals)
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Telephone Reimbursement
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹{formatCurrency(formData.telephoneReimbursement)}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            ₹
                            {formatCurrency(
                              getMonthlyValue(formData.telephoneReimbursement)
                            )}
                          </td>
                        </tr>
                        {(customTaxComponents || []).map((component) => (
                          <tr key={component?.name || `tax-${Math.random()}`}>
                            <td
                              style={{ border: "1px solid #ddd", padding: "8px" }}
                            >
                              {component?.name || "Tax Component"}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              ₹{formatCurrency(component?.value || 0)}
                            </td>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              ₹
                              {formatCurrency(
                                getMonthlyValue(component?.value || 0)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <Typography variant="body2" sx={{ mt: 4, fontStyle: "italic" }}>
                      Taxes will be applicable as per Income Tax Act, 1961 and shall
                      be borne by the employee.
                    </Typography>

                    <Box
                      sx={{
                        mt: 5,
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body1">
                          For {organizationName},
                        </Typography>
                        <Box
                          sx={{
                            mt: 4,
                            mb: 4,
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
                          <strong>{offerContent.signatureName}</strong>
                        </Typography>
                        <Typography variant="body1">
                          <strong>Director</strong>
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body1">Accepted,</Typography>
                        <Box
                          sx={{
                            mt: 4,
                            mb: 4,
                            height: "50px",
                            width: "150px",
                            borderBottom: "1px solid #000",
                          }}
                        ></Box>
                        <Typography variant="body1">
                          <strong>
                            {formData.candidateName || "[Candidate Name]"}
                          </strong>
                        </Typography>
                        <Typography variant="body2">
                          (Please sign and date your acceptance)
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
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
            onClick={handleDownloadAndUploadPDF}
            startIcon={<DownloadIcon />}
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

  // Local alert without using context
  const showLocalAlert = (message, severity = "success") => {
    // First close any open snackbar
    setSnackbar({
      ...snackbar,
      open: false,
    });

    // Set a short timeout to ensure the state update is processed
    setTimeout(() => {
      setSnackbar({
        open: true,
        message,
        severity,
        autoHideDuration: 3000,
      });
    }, 50);
  };

  // Add new custom tax component
  const addCustomTaxComponent = () => {
    try {
      if (!(newTaxComponent?.name || "").trim()) {
        showLocalAlert("Component name cannot be empty", "error");
        return false;
      }

      // Check for duplicate names
      const isDuplicate = (customTaxComponents || []).some(
        (comp, idx) =>
          (comp?.name || "").toLowerCase() ===
          (newTaxComponent?.name || "").toLowerCase() &&
          idx !== editingTaxComponentIndex
      );

      if (isDuplicate) {
        showLocalAlert("Component with this name already exists", "error");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in addCustomTaxComponent:", error);
      showLocalAlert("Error adding tax component", "error");
      return false;
    }
  };

  // Add keyboard event handlers for dialogs
  const handleKeyDown = (event, closeAction) => {
    if (event.key === "Escape") {
      closeAction();
    }
  };

  // Improve tax component calculation to be more flexible
  // ... existing code ...

  // Improve the tax component delete handler to better manage state updates
  // ... existing code ...
  const handleTaxComponentDelete = (index) => {
    try {
      // Get the component to be deleted for user notification
      const componentToDelete = (customTaxComponents || [])[index];
      if (!componentToDelete) {
        showLocalAlert("Tax component not found.", "error");
        return;
      }

      // Remember the name for the dialog
      setComponentToDeleteName(componentToDelete.name || "Tax Component");

      // Set the index to be deleted
      setEditingTaxComponentIndex(index);

      // Open confirmation dialog
      setDeleteDialogOpen(true);
    } catch (error) {
      console.error("Error preparing tax component deletion:", error);
      showLocalAlert("Error preparing tax component deletion", "error");
    }
  };

  // Modify tax component delete button to use this handler
  // ... existing code ...
  <IconButton
    color="error"
    onClick={() => handleTaxComponentDelete(index)}
    size="small"
  >
    <DeleteIcon fontSize="small" />
  </IconButton>;
  // ... existing code ...

  // Add handler for refreshing temp ID
  const handleRefreshTempId = () => {
    setFormData(prev => ({
      ...prev,
      empCode: generateTempId()
    }));
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
                startIcon={<BackIcon />}
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
                Offer Letter Generator
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

          {/* Dialog for editing percentages */}
          <Dialog
            open={percentageDialogOpen}
            onClose={() => setPercentageDialogOpen(false)}
            aria-labelledby="percentage-dialog-title"
            aria-describedby="percentage-dialog-description"
            disableRestoreFocus={true}
            onKeyDown={(e) =>
              handleKeyDown(e, () => setPercentageDialogOpen(false))
            }
          >
            <DialogTitle id="percentage-dialog-title">
              Edit Percentage
            </DialogTitle>
            <DialogContent>
              <TextField
                label={`${getComponentDisplayName(
                  editingPercentageName
                )} Percentage`}
                type="number"
                value={editingPercentageValue}
                onChange={(e) =>
                  setEditingPercentageValue(Number(e.target.value))
                }
                fullWidth
                variant="outlined"
                margin="normal"
                autoFocus
                id="percentage-dialog-description"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
              <FormHelperText>
                Annual Value: ₹
                {formatCurrency(
                  Math.round(
                    (Number(formData.totalCTC) *
                      Number(editingPercentageValue)) /
                    100
                  )
                )}
              </FormHelperText>
              <FormHelperText>
                Monthly Value: ₹
                {formatCurrency(
                  Math.round(
                    (Number(formData.totalCTC) *
                      Number(editingPercentageValue)) /
                    100 /
                    12
                  )
                )}
              </FormHelperText>
              <FormHelperText>
                Total percentage including this change:{" "}
                {(
                  getTotalPercentage() -
                  componentPercentages[editingPercentageName] +
                  Number(editingPercentageValue)
                ).toFixed(2)}
                %
              </FormHelperText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPercentageDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={savePercentage}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for adding/editing custom components */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            aria-labelledby="component-dialog-title"
            aria-describedby="component-name-field"
            disableRestoreFocus={true}
            onKeyDown={(e) => handleKeyDown(e, () => setDialogOpen(false))}
          >
            <DialogTitle id="component-dialog-title">
              {editingComponentIndex !== null
                ? "Edit Component"
                : "Add Component"}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Component Name"
                name="name"
                value={newComponent?.name || ""}
                onChange={handleComponentChange}
                fullWidth
                variant="outlined"
                margin="normal"
                required
                autoFocus
                id="component-name-field"
              />
              <TextField
                label="Percentage of CTC"
                name="percentage"
                type="number"
                value={newComponent?.percentage || 0}
                onChange={handleComponentChange}
                fullWidth
                variant="outlined"
                margin="normal"
                required
                id="component-percentage-field"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
              <FormHelperText>
                Annual Value: ₹
                {formatCurrency(
                  Math.round(
                    (Number(formData.totalCTC) *
                      Number(newComponent?.percentage || 0)) /
                    100
                  )
                )}
              </FormHelperText>
              <FormHelperText>
                Monthly Value: ₹
                {formatCurrency(
                  Math.round(
                    (Number(formData.totalCTC) *
                      Number(newComponent?.percentage || 0)) /
                    100 /
                    12
                  )
                )}
              </FormHelperText>
              <FormHelperText>
                Total percentage including this change:{" "}
                {editingComponentIndex !== null
                  ? (
                    getTotalPercentage() -
                    ((customComponents || [])[editingComponentIndex]
                      ?.percentage || 0) +
                    Number(newComponent?.percentage || 0)
                  ).toFixed(2)
                  : (
                    getTotalPercentage() +
                    Number(newComponent?.percentage || 0)
                  ).toFixed(2)}
                %
              </FormHelperText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={saveComponent}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for adding/editing custom tax saving components */}
          <Dialog
            open={taxDialogOpen}
            onClose={() => setTaxDialogOpen(false)}
            aria-labelledby="tax-dialog-title"
            aria-describedby="tax-component-name-field"
            disableRestoreFocus={true}
            onKeyDown={(e) => handleKeyDown(e, () => setTaxDialogOpen(false))}
          >
            <DialogTitle id="tax-dialog-title">
              {editingTaxComponentIndex !== null
                ? "Edit Tax Component"
                : "Add Tax Component"}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Component Name"
                name="name"
                value={newTaxComponent?.name || ""}
                onChange={(e) =>
                  setNewTaxComponent({
                    ...(newTaxComponent || {}),
                    name: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                margin="normal"
                required
                autoFocus
                id="tax-component-name-field"
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 1 }}
              >
                The value will be auto-calculated from the remaining special
                allowance, divided equally among all tax components including
                Books and Telephone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTaxDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (addCustomTaxComponent()) {
                    try {
                      if (editingTaxComponentIndex !== null) {
                        // Update existing component
                        const updatedComponents = [
                          ...(customTaxComponents || []),
                        ];
                        if (
                          editingTaxComponentIndex >= 0 &&
                          editingTaxComponentIndex < updatedComponents.length
                        ) {
                          updatedComponents[editingTaxComponentIndex] = {
                            ...(updatedComponents[editingTaxComponentIndex] ||
                              {}),
                            name: newTaxComponent?.name || "Tax Component",
                            highlight: true, // Add highlight property
                          };
                          setCustomTaxComponents(updatedComponents);
                          console.log(
                            "Updated tax components:",
                            updatedComponents
                          );
                          showLocalAlert(
                            `Tax component "${newTaxComponent?.name || "Tax Component"
                            }" updated successfully`,
                            "success"
                          );
                        } else {
                          showLocalAlert(
                            "Invalid tax component index",
                            "error"
                          );
                        }
                      } else {
                        // Add new component with highlight property
                        const newComponents = [
                          ...(customTaxComponents || []),
                          {
                            name: newTaxComponent?.name || "Tax Component",
                            value: 0,
                            highlight: true, // Add highlight property
                          },
                        ];
                        console.log("New tax components:", newComponents);
                        setCustomTaxComponents(newComponents);
                        showLocalAlert(
                          `Tax component "${newTaxComponent?.name || "Tax Component"
                          }" added successfully`,
                          "success"
                        );
                      }
                      setTaxDialogOpen(false);

                      // Force immediate recalculation with a slight delay to ensure state is updated
                      setTimeout(() => {
                        calculateSalaryComponents();

                        // Scroll to tax components section
                        if (customTaxComponentsRef.current) {
                          customTaxComponentsRef.current.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }, 100);

                      // Remove highlight after animation
                      setTimeout(() => {
                        // We need to get the current state to avoid state loss
                        setCustomTaxComponents((prevComponents) => {
                          // Make sure we have the latest components
                          return prevComponents.map((comp) => ({
                            ...comp,
                            highlight: false,
                          }));
                        });
                      }, 2000);
                    } catch (error) {
                      console.error("Error saving tax component:", error);
                      showLocalAlert("Error saving tax component", "error");
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

          {/* Delete confirmation dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            disableRestoreFocus={true}
            onKeyDown={(e) =>
              handleKeyDown(e, () => setDeleteDialogOpen(false))
            }
          >
            <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography id="delete-dialog-description">
                {componentToDeleteIndex !== null ? (
                  <>
                    Are you sure you want to delete "{componentToDeleteName}"?
                  </>
                ) : editingTaxComponentIndex !== null ? (
                  <>
                    Are you sure you want to delete tax component "
                    {componentToDeleteName}"?
                  </>
                ) : (
                  "Are you sure you want to delete this component?"
                )}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} autoFocus>
                Cancel
              </Button>
              <Button onClick={confirmDelete} variant="contained" color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={snackbar.autoHideDuration}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              variant="filled"
              elevation={6}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Add the OfferLetterEditNew */}
          <OfferLetterEditNew
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            organizationCode={organizationCode}
            organizationName={organizationName}
            onSave={handleOfferContentSave}
            empType={formData.employmentType}
          />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default GenerateNewOfferLetter;
