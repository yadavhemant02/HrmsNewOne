import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  useTheme,
  alpha,
  styled,
  InputAdornment,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Swal from "sweetalert2";
import axios from "axios";

import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";

import { base_identity } from "../../../../http/services";
import PersonalInformationForm from "./PersonalInformationForm";
import ContactInformationForm from "./ContactInformationForm";
import EmploymentInformationForm from "./EmploymentInformationForm";
import BankInformationForm from "./BankInformationForm";

// Custom styled components for the modal
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: 8,
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
}));

const FileInputLabel = styled("label")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 56,
  width: "100%",
  border: `1px dashed ${theme.palette.primary.main}`,
  borderRadius: 8,
  cursor: "pointer",
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.text.secondary,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  background: "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
  boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)",
    boxShadow: "0 6px 14px rgba(33, 150, 243, 0.3)",
  },
}));

const AddDetailsDialog = ({ open, onClose, employee }) => {
  const theme = useTheme();
  const userDetails = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
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
    disignation: "",
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
    empType: "",
  });
  const [customFields, setCustomFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [showAddField, setShowAddField] = useState(false);
  const [offerLetterFileName, setofferLetterFileName] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [showWeekendConfirmation, setShowWeekendConfirmation] = useState(false);
  const [tempJoinDate, setTempJoinDate] = useState(null);

  // Fetch employee details from API when dialog opens
  useEffect(() => {
    console.log('Dialog opened with employee:', employee);
    if (open && employee?.empCode) {
      console.log('Attempting to fetch details for:', employee?.empCode);
      fetchEmployeeDetails(employee?.empCode);
    }
  }, [open, employee]);

  // Function to fetch employee details from API
  const fetchEmployeeDetails = async (empCode) => {
    try {
      setLoading(true);
      console.log('Fetching details for empCode:', empCode);
      
      const response = await axios.get(
        `${base_identity}/identity-handler/details/get-emp-details?empCode=${empCode}`
      );

      console.log('API Response:', response.data);

      if (response.data) {
        // Parse date strings to Date objects for date pickers
        const detailsWithDates = {
          ...response.data,
          dateOfJoin: response.data.dateOfJoin
            ? new Date(response.data.dateOfJoin)
            : null,
          offerDate: response.data.offerDate
            ? new Date(response.data.offerDate)
            : null,
          dateOfBirth: response.data.dateOfBirth
            ? new Date(response.data.dateOfBirth)
            : null,
          organizationCode:
            response.data.organizationCode ||
            userDetails?.organizationCode ||
            "",
          empType: response.data.empType || employee?.empType || "",
        };

        console.log('Processed details:', detailsWithDates);
        setEmployeeDetails(detailsWithDates);

        // Fetch additional custom fields
        try {
          const additionalResponse = await axios.get(
            `${base_identity}/identity-handler/details/get-emp-details?empCode=${empCode}`
          );
          console.log('Additional fields response:', additionalResponse.data);
          
          if (additionalResponse.data && additionalResponse.data.map) {
            const additionalFields = Object.entries(
              additionalResponse.data.map
            ).map(([name, value]) => ({
              name,
              value,
            }));
            setCustomFields(additionalFields);
          }
        } catch (error) {
          console.error("Error fetching additional data:", error);
        }

        setDetailsFetched(true);
      } else {
        console.warn('No data received from API');
        // Initialize with basic info we already have
        setEmployeeDetails((prevDetails) => ({
          ...prevDetails,
          name: employee?.name || "",
          empCode: employee?.empCode || "",
          officialEmail: employee?.email || "",
          primaryPhone: employee?.mobileNumber || "",
          organizationCode: userDetails?.organizationCode || "",
          empType: employee?.empType || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Initialize with basic info we already have
      setEmployeeDetails({
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
        name: employee?.name || "",
        empCode: employee?.empCode || "",
        officialEmail: employee?.email || "",
        primaryPhone: employee?.mobileNumber || "",
        organizationCode: userDetails?.organizationCode || "",
        empType: employee?.empType || "",
        current: "EXIST",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setDetailsFetched(false);
    }
  }, [open]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEmployeeDetails({
        ...employeeDetails,
        offerLetter: file,
      });
      setofferLetterFileName(file.name);
    }
  };

  // const handleDetailsChange = (event) => {
  //   const { name, value } = event.target;
  //   setEmployeeDetails({
  //     ...employeeDetails,
  //     [name]: name === 'ifseCode' || name === 'panNumber' ? value?.toUpperCase() : value,
  //   });
  // };


const handleDetailsChange = (event) => {
  const { name, value } = event.target;
  
  setEmployeeDetails({
    ...employeeDetails,
    [name]: (name === 'ifseCode' || name === 'panNumber') && value 
      ? value.toUpperCase()
      : value,
  });
};


  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const handleDateChange = (field) => (newValue) => {
    if (field === "dateOfJoin" && newValue && isWeekend(newValue)) {
      setTempJoinDate(newValue);
      setShowWeekendConfirmation(true);
    } else {
      setEmployeeDetails({
        ...employeeDetails,
        [field]: newValue,
      });
    }
  };

  const handleWeekendConfirmation = (confirmed) => {
    if (confirmed) {
      setEmployeeDetails({
        ...employeeDetails,
        dateOfJoin: tempJoinDate,
      });
    }
    setShowWeekendConfirmation(false);
    setTempJoinDate(null);
  };

  const handleAddCustomField = () => {
    if (newFieldName.trim() && newFieldValue.trim()) {
      setCustomFields([
        ...customFields,
        { name: newFieldName, value: newFieldValue },
      ]);
      setNewFieldName("");
      setNewFieldValue("");
      setShowAddField(false);
    }
  };

  const handleDeleteCustomField = (index) => {
    const updatedFields = customFields.filter((_, i) => i !== index);
    setCustomFields(updatedFields);
  };

  const handleCustomFieldChange = (index, value) => {
    const updatedFields = customFields.map((field, i) =>
      i === index ? { ...field, value } : field
    );
    setCustomFields(updatedFields);
  };

  const getRequiredFields = () => {
    const commonFields = [
      "name",
      "empCode",
      "position",
      "disignation",
      "function",
      "address",
      "city",
      "state",
      "pinCode",
      "primaryPhone",
      "officialEmail",
      "personalEmail",
      "aadharNumber",
      "dateOfJoin",
      "offerDate",
      "dateOfBirth",
      "organizationCode",
      "empType",
    ];

    const fullTimeFields = [
      ...commonFields,
      "uanNumber",
      "panNumber",
      "ifseCode",
      "branchName",
      "bankName",
      "accountNumber",
      "ctc",
    ];

    const internPartTimeFields = [
      ...commonFields,
    ];

    const consultantFields = [
      ...commonFields,
      "panNumber",
      "ifseCode",
      "branchName",
      "bankName",
      "accountNumber",
    ];

    switch (employeeDetails.empType) {
      case 'Full Time':
        return fullTimeFields;
      case 'Intern':
      case 'Part Time':
        return internPartTimeFields;
      case 'Consultant':
        return consultantFields;
      case 'Others':
        return commonFields;
      default:
        return commonFields;
    }
  };

  const isFieldRequired = (fieldName) => {
    const commonFields = [
      "name",
      "empCode",
      "position",
      "disignation",
      "function",
      "address",
      "city",
      "state",
      "pinCode",
      "primaryPhone",
      "officialEmail",
      "personalEmail",
      "aadharNumber",
      "dateOfJoin",
      "offerDate",
      "dateOfBirth",
      "organizationCode",
      "empType",
    ];

    const fullTimeFields = [
      ...commonFields,
      "uanNumber",
      "panNumber",
      "ifseCode",
      "branchName",
      "bankName",
      "accountNumber",
      "ctc",
    ];

    const internPartTimeFields = [
      ...commonFields,
    ];

    const consultantFields = [
      ...commonFields,
      "panNumber",
      "ifseCode",
      "branchName",
      "bankName",
      "accountNumber",
    ];

    switch (employeeDetails.empType) {
      case 'Full Time':
        return fullTimeFields.includes(fieldName);
      case 'Intern':
      case 'Part Time':
        return internPartTimeFields.includes(fieldName);
      case 'Consultant':
        return consultantFields.includes(fieldName);
      case 'Others':
        return commonFields.includes(fieldName);
      default:
        return commonFields.includes(fieldName);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Define required fields based on employee type
    const requiredFields = getRequiredFields();

    // Required field validation
    requiredFields.forEach((field) => {
      if (!employeeDetails[field]) {
        const fieldName =
          field.charAt(0)?.toUpperCase() +
          field
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .toLowerCase();
        newErrors[field] = `${fieldName} is required`;
      }
    });

    // Offer Letter validation - only required for full-time employees
    if (employeeDetails?.empType === 'Full Time' && !employeeDetails?.offerLetter && !detailsFetched) {
      newErrors.offerLetter = "Offer Letter is required";
    }

    // PAN Number validation ( ABCDE1234F) - for full-time and consultant
    if ((employeeDetails?.empType === 'Full Time' || employeeDetails?.empType === 'Consultant') && 
        employeeDetails.panNumber &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(employeeDetails.panNumber)) {
      newErrors.panNumber = "Please enter a valid PAN number ( ABCDE1234F)";
    }

    // Aadhaar Number validation ( 12 digits)
    if (employeeDetails?.aadharNumber &&
        !/^\d{12}$/.test(employeeDetails?.aadharNumber)) {
      newErrors.aadharNumber = "Please enter a valid 12-digit Aadhaar number";
    }

    // UAN Number validation ( 12 digits) - only for full-time
    if (employeeDetails?.empType === 'Full Time' &&
        employeeDetails?.uanNumber &&
        !/^\d{12}$/.test(employeeDetails?.uanNumber)) {
      newErrors.uanNumber = "Please enter a valid 12-digit UAN number";
    }

    // IFSC Code validation ( 11 characters, alphanumeric) - for full-time and consultant
    if ((employeeDetails?.empType === 'Full Time' || employeeDetails?.empType === 'Consultant') &&
        employeeDetails?.ifseCode &&
        !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(employeeDetails?.ifseCode)) {
      newErrors.ifseCode = "Please enter a valid IFSC code ( BANK0123456)";
    }

    // Phone Number validation ( 10 digits)
    if (employeeDetails?.primaryPhone &&
        !/^\d{10}$/.test(employeeDetails?.primaryPhone)) {
      newErrors.primaryPhone = "Please enter a valid 10-digit mobile number";
    }

    // Alternate Phone validation (if provided)
    if (employeeDetails?.alternatePhone &&
        !/^\d{10}$/.test(employeeDetails?.alternatePhone)) {
      newErrors.alternatePhone = "Please enter a valid 10-digit mobile number";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (employeeDetails?.officialEmail &&
        !emailRegex.test(employeeDetails?.officialEmail)) {
      newErrors.officialEmail = "Please enter a valid email address";
    }
    if (employeeDetails?.personalEmail &&
        !emailRegex.test(employeeDetails?.personalEmail)) {
      newErrors.personalEmail = "Please enter a valid email address";
    }

    // PIN Code validation ( 6 digits)
    if (employeeDetails?.pinCode && !/^\d{6}$/.test(employeeDetails?.pinCode)) {
      newErrors.pinCode = "Please enter a valid 6-digit PIN code";
    }

    // Account Number validation ( 9-18 digits) - for full-time and consultant
    if ((employeeDetails?.empType === 'Full Time' || employeeDetails?.empType === 'Consultant') &&
        employeeDetails?.accountNumber &&
        !/^\d{9,18}$/.test(employeeDetails?.accountNumber)) {
      newErrors.accountNumber = "Please enter a valid account number (9-18 digits)";
    }

    // CTC validation (should be a positive number) - only required for full-time
    if (employeeDetails?.empType === 'Full Time' &&
        employeeDetails?.ctc &&
        (isNaN(employeeDetails?.ctc) || Number(employeeDetails?.ctc) <= 0)) {
      newErrors.ctc = "Please enter a valid positive number for CTC";
    }

    // If there are format validation errors, show SweetAlert
    const formatErrors = Object.entries(newErrors).filter(
      ([field, error]) =>
        !requiredFields.includes(field) || employeeDetails[field]
    );

    if (formatErrors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: `
          <div style="text-align: left;">
            <p>Please correct the following errors:</p>
            <ul style="list-style-type: none; padding-left: 0;">
              ${formatErrors
                .map(([_, error]) => `<li>• ${error}</li>`)
                .join("")}
            </ul>
          </div>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#1976D2",
        customClass: {
          container: "my-swal-container",
        },
        backdrop: `rgba(0,0,0,0.4)`,
        allowOutsideClick: false,
        showClass: {
          popup: "animate__animated animate__fadeIn faster",
        },
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForSubmission = (date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const prepareFormData = () => {
    const formData = new FormData();

    // Get required fields based on employee type
    const requiredFields = getRequiredFields();

    // Append all fields to formData
    Object.keys(employeeDetails).forEach((key) => {
      if (key === "dateOfJoin" || key === "offerDate" || key === "dateOfBirth") {
        // For date fields, send null if not filled
        if (employeeDetails[key]) {
          formData.append(key, formatDateForSubmission(employeeDetails[key]));
        } else if (requiredFields.includes(key)) {
          formData.append(key, null);
        }
      } else if (key === "offerLetter" && employeeDetails[key]) {
        formData.append(key, employeeDetails[key]);
      } else {
        // For other fields, send null if required but not filled
        if (requiredFields.includes(key) && !employeeDetails[key]) {
          formData.append(key, null);
        } else {
          formData.append(key, employeeDetails[key] || "");
        }
      }
    });

    // Append custom fields
    customFields.forEach((field) => {
      formData.append(`custom_${field.name}`, field.value);
    });

    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!validateForm()) {
      return;
    }

    try {
      setFormSubmitting(true);

      const formData = prepareFormData();
          // formData.append("offerLetter",new File([""], "educationFile.pdf"))

      // Save main employee details
      const response = await axios.post(
        `${base_identity}/identity-handler/details/save-emp-details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save additional custom fields if any exist
      if (customFields.length > 0) {
        const additionalData = {
          empCode: employeeDetails.empCode,
          map: customFields.reduce((acc, field) => {
            acc[field.name] = field.value;
            return acc;
          }, {}),
        };

        await axios.post(
          `${base_identity}/identity-handler/details/add-extra-data`,
          additionalData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Details Submitted",
          text: `${employee.name}'s additional details have been saved successfully.`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            container: "my-swal-container",
          },
          backdrop: `rgba(0,0,0,0.4)`,
          allowOutsideClick: false,
        });
        onClose();
      }
    } catch (error) {
      console.error("Error submitting details:", error);
      
      // Check for duplicate email error
      if (error.response?.data?.includes("emp_details_official_email_key")) {
        Swal.fire({
          icon: "error",
          title: "Email Already Registered",
          text: "This official email address is already registered in the system. Please use a different email address.",
          customClass: {
            container: "my-swal-container",
          },
          backdrop: `rgba(0,0,0,0.4)`,
          allowOutsideClick: false,
        });
        // Set error for the official email field
        setErrors(prev => ({
          ...prev,
          officialEmail: "This email is already registered"
        }));
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Error",
          text: "Failed to submit employee details. Please try again.",
          customClass: {
            container: "my-swal-container",
          },
          backdrop: `rgba(0,0,0,0.4)`,
          allowOutsideClick: false,
        });
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  if (!employee) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <StyledDialogTitle>
          {detailsFetched ? "Update Employee Details" : "Add Employee Details"}
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        <StyledDialogContent>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Typography
                variant="subtitle1"
                fontWeight="500"
                sx={{ mt: 2 }}
                gutterBottom
              >
                {detailsFetched
                  ? `Updating details for ${employee.name}`
                  : `Adding details for ${employee.name}`}
              </Typography>

              {/* Add custom styles for SweetAlert */}
              <style jsx global>{`
                .my-swal-container {
                  z-index: 9999 !important;
                }

                body.swal2-shown > div:not(.my-swal-container) {
                  filter: blur(2px);
                }
              `}</style>

              <Box sx={{ my: 2 }}>
                <Grid container spacing={2}>
                  {/* Use the new components */}
                  <PersonalInformationForm
                    employeeDetails={employeeDetails}
                    handleDetailsChange={handleDetailsChange}
                    handleDateChange={handleDateChange}
                    errors={errors}
                  />

                  <ContactInformationForm
                    employeeDetails={employeeDetails}
                    handleDetailsChange={handleDetailsChange}
                    errors={errors}
                  />

                  <EmploymentInformationForm
                    employeeDetails={employeeDetails}
                    handleDetailsChange={handleDetailsChange}
                    handleDateChange={handleDateChange}
                    errors={errors}
                    isFieldRequired={isFieldRequired}
                  />

                  <BankInformationForm
                    employeeDetails={employeeDetails}
                    handleDetailsChange={handleDetailsChange}
                    errors={errors}
                    isFieldRequired={isFieldRequired}
                  />

                  {/* Offer Letter Upload */}
                  <Grid item xs={12}>
                    <input
                      accept="application/pdf,.doc,.docx"
                      style={{ display: "none" }}
                      id="offerLetter-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <FileInputLabel
                      required={isFieldRequired("offerLetter")}
                      sx={{
                        "& .MuiFormLabel-asterisk": {
                          color: "red",
                        },
                      }}
                      htmlFor="offerLetter-upload"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <UploadFileIcon
                          sx={{ mr: 1, color: theme.palette.primary.main }}
                        />
                        <Typography component="span">
                          {offerLetterFileName ||
                            (employeeDetails.offerLetter
                              ? "Offer Letter (Already Uploaded)"
                              : `Upload Offer Letter (PDF, DOC, DOCX)${employeeDetails.empType !== 'Full Time' ? ' (Optional)' : ''}`)}
                        </Typography>
                      </Box>
                    </FileInputLabel>
                    {offerLetterFileName && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1, mt: 0.5, display: "block" }}
                      >
                        Selected file: {offerLetterFileName}
                      </Typography>
                    )}
                    {errors.offerLetter && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ ml: 1, mt: 0.5, display: "block" }}
                      >
                        {errors.offerLetter}
                      </Typography>
                    )}
                  </Grid>

                  {/* Custom Fields Section */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        mt: 2,
                      }}
                    >
                      <Typography variant="h6">Additional Fields</Typography>
                      <Button
                        variant="outlined"
                        onClick={() => setShowAddField(!showAddField)}
                        startIcon={showAddField ? <CloseIcon /> : <AddIcon />}
                        sx={{
                          borderRadius: 8,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        {showAddField ? "Cancel" : "Add New Field"}
                      </Button>
                    </Box>
                  </Grid>

                  {/* Add New Custom Field Section */}
                  {showAddField && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          mt: 2,
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.05
                          ),
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={5}>
                            <StyledFormControl
                              variant="outlined"
                              fullWidth
                              size="small"
                            >
                              <InputLabel>Field Name</InputLabel>
                              <StyledOutlinedInput
                                value={newFieldName}
                                onChange={(e) =>
                                  setNewFieldName(e.target.value)
                                }
                                label="Field Name"
                                placeholder="Enter field name"
                                size="small"
                              />
                            </StyledFormControl>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <StyledFormControl
                              variant="outlined"
                              fullWidth
                              size="small"
                            >
                              <InputLabel>Field Value</InputLabel>
                              <StyledOutlinedInput
                                value={newFieldValue}
                                onChange={(e) =>
                                  setNewFieldValue(e.target.value)
                                }
                                label="Field Value"
                                placeholder="Enter field value"
                                size="small"
                              />
                            </StyledFormControl>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Button
                              variant="contained"
                              onClick={handleAddCustomField}
                              disabled={
                                !newFieldName.trim() || !newFieldValue.trim()
                              }
                              sx={{
                                borderRadius: 8,
                                textTransform: "none",
                                fontWeight: 500,
                                width: "100%",
                              }}
                              size="small"
                            >
                              Add
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  )}

                  {/* Existing Custom Fields */}
                  {customFields.map((field, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={11}>
                            <StyledFormControl
                              variant="outlined"
                              fullWidth
                              size="small"
                            >
                              <InputLabel>{field.name}</InputLabel>
                              <StyledOutlinedInput
                                value={field.value}
                                onChange={(e) =>
                                  handleCustomFieldChange(index, e.target.value)
                                }
                                label={field.name}
                                size="small"
                              />
                            </StyledFormControl>
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteCustomField(index)}
                              sx={{ flexShrink: 0 }}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <DialogActions sx={{ justifyContent: "center", pt: 2, pb: 1 }}>
                <Button
                  onClick={onClose}
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: 8,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </Button>
                <SubmitButton
                  type="submit"
                  variant="contained"
                  disabled={formSubmitting}
                  sx={{
                    px: 3,
                    ml: 2,
                  }}
                  startIcon={
                    formSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {formSubmitting
                    ? "Submitting..."
                    : detailsFetched
                    ? "Update Details"
                    : "Submit Details"}
                </SubmitButton>
              </DialogActions>
            </Box>
          )}
        </StyledDialogContent>
      </Dialog>

      {/* Weekend Confirmation Dialog */}
      <Dialog
        open={showWeekendConfirmation}
        onClose={() => handleWeekendConfirmation(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #FF9800 30%, #FF5722 90%)",
            color: "white",
            py: 2,
          }}
        >
          Weekend Date Selected
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="body1">
              The date you selected for joining (
              {tempJoinDate && tempJoinDate.toLocaleDateString()}) falls on a
              weekend. Are you sure you want to select this date?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center" }}>
          <Button
            onClick={() => handleWeekendConfirmation(false)}
            variant="outlined"
            sx={{
              borderRadius: 8,
              px: 3,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            No, Select Another Date
          </Button>
          <Button
            onClick={() => handleWeekendConfirmation(true)}
            variant="contained"
            sx={{
              borderRadius: 8,
              px: 3,
              ml: 2,
              background: "linear-gradient(45deg, #FF9800 30%, #FF5722 90%)",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Yes, Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddDetailsDialog;
