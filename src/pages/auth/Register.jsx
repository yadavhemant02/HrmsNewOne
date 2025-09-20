import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Checkbox,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Import Material UI icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Import SweetAlert2
import Swal from "sweetalert2";

import Registration from "../../assets/images/Register.jpg";
import { useAlert } from "../../context/AlertContext";
import UploadLogoDialog from "./UploadLogoDialog";

// Import Redux hooks
import { useRegisterCompanyMutation } from "../../redux/services/authApi";
import {
  setTempAuthData,
  setRegistrationData,
} from "../../redux/slices/authSlice";
import axios from "axios";
import { base_hr, base_identity, base_Ip } from "../../http/services";

// Constants
const VALIDATION_RULES = {
  firstName: {
    required: true,
    minLength: 1,
    message: "First Name is required"
  },
  lastName: {
    required: true,
    minLength: 1,
    message: "Last Name is required"
  },
  organizationName: {
    required: true,
    minLength: 4,
    message: "Organization Name is required and must be at least 4 characters"
  },
  email: {
    required: true,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  },
  phoneNumber: {
    required: true,
    regex: /^[0-9]{10}$/,
    message: "Please enter a valid 10-digit phone number"
  },
  password: {
    required: true,
    minLength: 6,
    message: "Password must be at least 6 characters long"
  }
};

const API_ENDPOINTS = {
  getAllOrganization: `${base_identity}/identity-handler/auth/get-all-organization`
};

const Register = () => {
  // State Management
  const [showPassword, setShowPassword] = useState(false);
  const [subscriptionTypes, setSubscriptionTypes] = useState({
    hrims: true,
    recruitment: true,
  });
  const [loading, setLoading] = useState(false);
  const [openLogoDialog, setOpenLogoDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    email: "",
    phoneNumber: "",
    password: "",
    manager: null,
    empCode: "",
  });
  const [existingOrganizations, setExistingOrganizations] = useState([]);

  // Hooks
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showAlert: showContextAlert } = useAlert();
  const [registerCompany, { isLoading: isRegistering }] = useRegisterCompanyMutation();

  // Utility Functions
  const showSweetAlert = (message, type) => {
    Swal.fire({
      title: type === "error" ? "Error" : "Success",
      text: message,
      icon: type,
      confirmButtonColor: "#667eea",
      timer: type === "success" ? 3000 : undefined,
      timerProgressBar: type === "success",
    });
  };

  const showNotification = (message, type) => {
    try {
      showSweetAlert(message, type);
    } catch (error) {
      showContextAlert(message, type);
    }
  };

  // API Functions
  const fetchAllOrganizations = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.getAllOrganization);
      setExistingOrganizations(response?.data || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      showNotification("Failed to load existing organizations", "error");
    }
  };

  // Effects
  useEffect(() => {
    fetchAllOrganizations();
  }, []);

  // Event Handlers
  const handleNavigate = () => {
    navigate("/login-page");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubscriptionChange = (type) => {
    setSubscriptionTypes(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation Functions
  const validateField = (fieldName, value) => {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return true;

    if (rules.required && !value.trim()) {
      return { isValid: false, message: rules.message };
    }

    if (rules.minLength && value.length < rules.minLength) {
      return { isValid: false, message: rules.message };
    }

    if (rules.regex && !rules.regex.test(value)) {
      return { isValid: false, message: rules.message };
    }

    return { isValid: true };
  };

  const validateForm = () => {
    for (const [fieldName, value] of Object.entries(formData)) {
      if (fieldName === 'manager' || fieldName === 'empCode') continue;
      
      const validation = validateField(fieldName, value);
      if (!validation.isValid) {
        showNotification(validation.message, "error");
        return false;
      }
    }

    if (!subscriptionTypes.hrims && !subscriptionTypes.recruitment) {
      showNotification("Please select at least one subscription type", "error");
      return false;
    }

    return true;
  };

  const checkOrganizationExists = () => {
    if (Array.isArray(existingOrganizations) && 
        existingOrganizations.includes(formData.organizationName)) {
      showNotification("Organization name is already registered", "error");
      return true;
    }
    return false;
  };

  // Main Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkOrganizationExists() || !validateForm()) {
      return;
    }

    setLoading(true);

    const apiPayload = {
      name: `${formData.firstName} ${formData.lastName}`,
      organizationName: formData.organizationName,
      organizationCode: "",
      email: formData.email,
      mobileNumber: formData.phoneNumber,
      password: formData.password,
      role: "COMPANY",
      designation: "owner",
      manager: null,
      empCode: null,
      empType: "Full Time",
      subscriptionTypes: Object.keys(subscriptionTypes).filter(
        (key) => subscriptionTypes[key]
      ),
    };

    try {
      Swal.fire({
        title: "Processing",
        text: "Creating your account...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await registerCompany(apiPayload).unwrap();

      Swal.close();

      dispatch(setRegistrationData(response));
      dispatch(
        setTempAuthData({
          email: formData.email,
          password: formData.password,
          organizationCode: response.organizationCode,
        })
      );

      showNotification("Your account has been created successfully!", "success");
      setOpenLogoDialog(true);
    } catch (error) {
      Swal.close();
      console.error("Registration error:", error);

      const errorMsg = error?.data || error.message;
      let userFriendlyMessage = "Registration failed. Please try again.";

      if (errorMsg.includes("identity_organization_name_key")) {
        userFriendlyMessage = "Organization name is already registered.";
      } else if (errorMsg.includes("identity_mobile_number_key")) {
        userFriendlyMessage = "Mobile number is already registered.";
      } else if (errorMsg.includes("identity_email_key")) {
        userFriendlyMessage = "Email address is already registered.";
      }

      showNotification(userFriendlyMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseLogoDialog = () => {
    setOpenLogoDialog(false);
    setLoading(false);
    if (!loading) {
      showNotification("Your account is now set up and ready to use.", "success");
      navigate('/login-page');
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f8fa", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography
            onClick={() => navigate("/")}
            variant="h4"
            fontWeight="bold"
            sx={{
              cursor: "pointer",
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              '& .hr': {
                background: 'black',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
              '& .haat': {
                background: '#0066cc',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }}
          >
            <span className="hr">HR</span><span className="haat">HaaT</span>
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 28,
                textTransform: "none",
                px: 2,
              }}
              onClick={handleNavigate}
            >
              Login
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Registration Form */}
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  textAlign="center"
                  color="primary"
                  mb={2}
                >
                  Register Your Company
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    {/* First Name & Last Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Authorized Person *"
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder="Enter your first name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name *"
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder="Enter your last name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    {/* Organization & Email */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Organization Name *"
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder="Enter your organization name"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email Address *"
                        variant="outlined"
                        fullWidth
                        size="small"
                        type="email"
                        placeholder="Enter your organization email address"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    {/* Phone Number */}
                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number *"
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder="Enter phone number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </Grid>

                    {/* Subscription Type */}
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Subscription Type *
                      </Typography>
                      <Box display="flex" flexDirection="row" gap={3}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={subscriptionTypes.hrims}
                              onChange={() => handleSubscriptionChange("hrims")}
                              size="small"
                            />
                          }
                          label={<Typography variant="body2">HRIMS</Typography>}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={subscriptionTypes.recruitment}
                              onChange={() =>
                                handleSubscriptionChange("recruitment")
                              }
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2">Recruitment</Typography>
                          }
                        />
                      </Box>
                    </Grid>

                    {/* Password */}
                    <Grid item xs={12}>
                      <TextField
                        label="Password *"
                        variant="outlined"
                        fullWidth
                        size="small"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePassword}
                                edge="end"
                                size="small"
                              >
                                {showPassword ? (
                                  <VisibilityIcon fontSize="small" />
                                ) : (
                                  <VisibilityOffIcon fontSize="small" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Sign Up Button */}
                    <Grid item xs={12} mt={1}>
                      <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        disabled={loading}
                        sx={{
                          py: 1.5,
                          borderRadius: 28,
                          textTransform: "uppercase",
                          background: 'linear-gradient(135deg, #003396 0%, #86CEFA  100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #003396 0%, #86CEFA  100%)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, #003396 0%, #86CEFA  100%)',
                          }
                        }}
                      >
                        {loading ? "Signing Up..." : "Sign Up"}
                      </Button>
                    </Grid>

                    {/* Terms */}
                    <Grid item xs={12}>
                      <Typography
                        variant="caption"
                        textAlign="center"
                        display="block"
                        color="text.secondary"
                      >
                        By signing up you are agreeing to our{" "}
                        <Link href="#" underline="hover" color="primary">
                          privacy policy
                        </Link>
                        ,{" "}
                        <Link href="#" underline="hover" color="primary">
                          refund policy
                        </Link>{" "}
                        and{" "}
                        <Link href="#" underline="hover" color="primary">
                          terms and conditions
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Illustration and Features */}
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box>
              <Box
                component="img"
                src={Registration}
                alt="HR Management System"
                sx={{ width: "100%", borderRadius: 2 }}
              />

              <Box mt={4}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  textAlign="center"
                  color="primary"
                  mb={3}
                >
                  All-in-One HR Solution
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{ color: "#667eea" }}
                      />
                      <Typography variant="body2">
                        Secure, Scalable, and Easy-to-Use
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{ color: "#667eea" }}
                      />
                      <Typography variant="body2">
                        Automate Payroll and Compliance
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{ color: "#667eea" }}
                      />
                      <Typography variant="body2">
                        Intelligent Reporting and Insights
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{ color: "#667eea" }}
                      />
                      <Typography variant="body2">
                        Seamless Onboarding and Beyond
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="center" mt={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon
                      fontSize="small"
                      sx={{ color: "#667eea" }}
                    />
                    <Typography variant="body2">
                      Unlock Effortless HR Management
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Logo Upload Dialog */}
      <UploadLogoDialog
        open={openLogoDialog}
        handleClose={handleCloseLogoDialog}
        organizationName={formData.organizationName}
        isRegistration={true}
      />
    </Box>
  );
};

export default Register;