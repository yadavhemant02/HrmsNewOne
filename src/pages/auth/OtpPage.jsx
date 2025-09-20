import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Link,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useAlert } from "../../context/AlertContext";
import Swal from 'sweetalert2';

// Import Redux hooks
import { useVerifyOtpMutation, useResendOtpMutation } from "../../redux/services/authApi";
import { selectTempAuthData } from "../../redux/slices/authSlice";

const OtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResettingOtp, setIsResettingOtp] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showAlert: showContextAlert } = useAlert();
  
  // Get auth data from Redux store
  const tempAuthData = useSelector(selectTempAuthData);
  const email = tempAuthData?.email || localStorage.getItem("email");
  const password = tempAuthData?.password || localStorage.getItem("password");

  // RTK Query mutation hooks
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const inputRefs = useRef([]);
  
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);

  // Notification utility with fallback mechanism
  const showSweetAlert = (message, type) => {
    try {
      Swal.fire({
        title: type === "error" ? "Error" : 
               type === "warning" ? "Warning" :
               type === "info" ? "Information" : "Success",
        text: message,
        icon: type,
        confirmButtonColor: "#667eea",
        timer: type === "success" ? 3000 : undefined,
        timerProgressBar: type === "success",
      });
      return true;
    } catch (error) {
      console.error("SweetAlert error:", error);
      return false;
    }
  };

  const showNotification = (message, type) => {
    const sweetAlertShown = showSweetAlert(message, type);
    if (!sweetAlertShown) {
      showContextAlert(message, type);
    }
  };

  // OTP Input handlers
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 4);
      const newOtp = [...otp];

      digits.forEach((digit, index) => {
        if (index < 4) {
          newOtp[index] = digit;
        }
      });

      setOtp(newOtp);

      const nextEmptyIndex = newOtp.findIndex((val) => val === "");
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex].focus();
      } else if (digits.length < 4) {
        inputRefs.current[digits.length].focus();
      } else {
        inputRefs.current[3].focus();
      }
    }
  };

  // Reset OTP API call function
  const callResetOtpApi = async () => {
    if (!email) {
      showNotification("Email not found. Please go back to login.", "error");
      return false;
    }

    setIsResettingOtp(true);
    
    try {
      const response = await fetch(
        `http://13.233.38.153:7000/identity-handler/auth/reset-otp?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Clear the current OTP input
      setOtp(["", "", "", ""]);
      setError(false);
      
      return true;
    } catch (error) {
      console.error("Error calling reset OTP API:", error);
      
      const errorMessage = error.message.includes('fetch') 
        ? "Network error. Please check your connection and try again."
        : error.message || "Failed to reset verification code. Please try again.";
      
      showNotification(errorMessage, "error");
      return false;
    } finally {
      setIsResettingOtp(false);
    }
  };

  // Modified resend handler to use reset OTP API
  const handleResendOtp = async () => {
    setResendDisabled(true);
    setTimeLeft(30);
    
    try {
      try {
        Swal.fire({
          title: 'Generating New Code',
          text: 'Generating a new verification code...',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
          timer: 1500,
          timerProgressBar: true,
        });
      } catch (error) {
        console.log("SweetAlert loading not available");
      }
      
      // Call the reset OTP API instead of resend
      const resetSuccess = await callResetOtpApi();
      
      try {
        Swal.close();
      } catch (error) {
        console.log("Error closing SweetAlert");
      }
      
      if (resetSuccess) {
        showNotification(`New verification code sent to ${email}`, "success");
      } else {
        // If reset failed, don't start the timer
        setResendDisabled(false);
        setTimeLeft(0);
        return;
      }
    } catch (error) {
      console.error("Error in resend process:", error);
      
      try {
        Swal.close();
      } catch (swalError) {
        console.log("Error closing SweetAlert");
      }
      
      showNotification("Failed to generate new verification code. Please try again.", "error");
      setResendDisabled(false);
      setTimeLeft(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (otp.join("").length === 4) {
      setError(false);

      try {
        try {
          Swal.fire({
            title: 'Verifying',
            text: 'Verifying your code...',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        } catch (error) {
          console.log("SweetAlert loading not available");
        }

        const otpLoginData = {
          email: email,
          password: password,
          otp: otp.join(""),
          ip: "string123",
        };

        const response = await verifyOtp(otpLoginData).unwrap();

        try {
          Swal.close();
        } catch (error) {
          console.log("Error closing SweetAlert");
        }

        showNotification("Verification successful! Redirecting to dashboard...", "success");

        console.log(localStorage.getItem("userType"))
        setTimeout(() => {
          if (
            response.role === "COMPANY" ||
            response.role === "HR"
          ) {
            if(localStorage.getItem("userType")==="HR" || localStorage.getItem("userType")==="COMPANY"){
              navigate("/dashboard-hr");
            }
            else{
              navigate("/dashboard-emp");
            }
          } else {
            navigate("/dashboard-emp");
          }
        }, 1500);
      } catch (error) {
        console.error("Error during OTP submission:", error);
        setError(true);

        try {
          Swal.close();
        } catch (swalError) {
          console.log("Error closing SweetAlert");
        }

        const errorMessage = error.data?.message || 
                           "Invalid verification code. Please try again.";
        showNotification(errorMessage, "error");
      }
    } else {
      setError(true);
      showNotification("Please enter a valid 4-digit verification code.", "error");
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login-page");
  };

  return (
    <Box
      sx={{
        bgcolor: "#f5f8fa",
        minHeight: "100vh",
        py: 3,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        {/* Header with consistent branding */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Typography
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
            onClick={() => navigate("/")}
          >
            <span className="hr">HR</span><span className="haat">HaaT</span>
          </Typography>
        </Box>

        {/* OTP Card */}
        <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box 
            sx={{ 
              height: 6, 
              background: 'linear-gradient(135deg, #003396 0%, #86CEFA 100%)', 
              width: "100%" 
            }} 
          />
          <CardContent sx={{ p: 4 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Button
                startIcon={<KeyboardBackspaceIcon />}
                color="primary"
                sx={{ 
                  textTransform: "none", 
                  fontWeight: 500,
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.08)',
                  }
                }}
                onClick={handleNavigateToLogin}
              >
                Back to Login
              </Button>
            </Box>

            <Typography
              variant="h5"
              sx={{
                mb: 1,
                fontWeight: "bold",
                textAlign: "center",
                background: 'linear-gradient(135deg, #003396 0%, #86CEFA 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Verification Code
            </Typography>

            <Typography
              variant="body2"
              sx={{ mb: 4, color: "text.secondary", textAlign: "center" }}
            >
              Enter the 4-digit verification code sent to
              <Box
                component="span"
                sx={{ fontWeight: "bold", color: "text.primary", ml: 0.5 }}
              >
                {email || "your email"}
              </Box>
            </Typography>

            <Box
              onPaste={handlePaste}
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 4,
              }}
            >
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  variant="outlined"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      padding: "8px 0",
                      fontWeight: "600",
                    },
                  }}
                  error={error && !digit}
                  sx={{
                    width: "60px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor:
                          error && !digit
                            ? "error.main"
                            : "rgba(0, 0, 0, 0.23)",
                        borderWidth: "1.5px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              ))}
            </Box>

            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mb: 3, textAlign: "center" }}
              >
                Please enter a valid verification code.
              </Typography>
            )}

            {/* Verify Button with consistent styling */}
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 28,
                textTransform: "none",
                fontWeight: "bold",
                background: 'linear-gradient(135deg, #003396 0%, #86CEFA 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #003396 0%, #86CEFA 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(102, 126, 234, 0.6)',
                }
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify"
              )}
            </Button>

            <Box
              mt={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography variant="body2" color="text.secondary" mr={1}>
                Didn't receive the code?
              </Typography>
              <Button
                onClick={handleResendOtp}
                disabled={resendDisabled || isResending || isResettingOtp}
                size="small"
                startIcon={
                  timeLeft > 0 ? null : <RefreshIcon fontSize="small" />
                }
                sx={{ 
                  textTransform: "none", 
                  fontWeight: 500,
                  color: '#667eea',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.08)',
                  }
                }}
              >
                {timeLeft > 0 
                  ? `Resend in ${timeLeft}s` 
                  : isResettingOtp 
                    ? "Generating..." 
                    : "Resend Code"
                }
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Having trouble?{" "}
            <Link 
              href="#" 
              sx={{ 
                color: "#667eea", 
                textDecoration: "none",
                '&:hover': {
                  textDecoration: "underline",
                }
              }}
            >
              Contact Support
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default OtpPage;