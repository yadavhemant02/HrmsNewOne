import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  IconButton,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  useTheme
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import { useAlert } from '../../context/AlertContext';
import Swal from 'sweetalert2';

// Import Redux hooks
import { useUploadLogoMutation } from '../../redux/services/authApi';
import { selectRegistrationData } from '../../redux/slices/authSlice';

// Styled component for the file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadArea = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  minHeight: 150,
}));

const UploadLogoDialog = ({ open, handleClose, organizationName, isRegistration = false, onLogoUploaded }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showAlert: showContextAlert } = useAlert();
  const theme = useTheme();
  
  // Get organization code from Redux store
  const registrationData = useSelector(selectRegistrationData);
  const organizationCode = localStorage.getItem('organizationCode') || 
                          registrationData?.organizationCode;
  
  // RTK Query mutation hook
  const [uploadLogo, { isLoading: uploading }] = useUploadLogoMutation();

  // Function to show SweetAlert notifications
  const showSweetAlert = (message, type) => {
    try {
      Swal.fire({
        title: type === "error" ? "Error" : 
               type === "warning" ? "Warning" : "Success",
        text: message,
        icon: type,
        confirmButtonColor: "#2563eb",
        timer: type === "success" ? 3000 : undefined,
        timerProgressBar: type === "success",
      });
      return true; // SweetAlert was shown successfully
    } catch (error) {
      console.error("SweetAlert error:", error);
      return false; // SweetAlert failed
    }
  };

  // Use both alert systems to ensure compatibility
  const showNotification = (message, type) => {
    const sweetAlertShown = showSweetAlert(message, type);
    if (!sweetAlertShown) {
      // Fall back to context alert if SweetAlert fails
      showContextAlert(message, type);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Check file size (max 2MB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        showNotification("File size exceeds 2MB limit. Please choose a smaller file.", "warning");
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setError(''); // Clear any previous errors
    }
  };

  // Handle drop zone
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      // Check file size (max 2MB)
      if (droppedFile.size > 2 * 1024 * 1024) {
        showNotification("File size exceeds 2MB limit. Please choose a smaller file.", "warning");
        return;
      }
      
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(droppedFile);
      setError(''); // Clear any previous errors
    }
  };

  const preventDefault = (event) => {
    event.preventDefault();
  };

  // Modified upload handler
  const handleUpload = async () => {
    if (!file) {
      showNotification("Please select a file first or skip this step", "warning");
      return;
    }

    setError('');
    
    try {
      // Show loading state with SweetAlert
      try {
        Swal.fire({
          title: 'Uploading',
          text: 'Uploading your company logo...',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      } catch (error) {
        console.log("SweetAlert loading not available");
      }
      
      // Create FormData object for the file upload
      const formData = new FormData();
      formData.append("organizationCode", organizationCode);
      formData.append("logo", file);

      // Use RTK Query mutation
      const response = await uploadLogo(formData).unwrap();

      console.log("Logo upload response:", response);
      
      // Close any open SweetAlert
      try {
        Swal.close();
      } catch (error) {
        console.log("Error closing SweetAlert");
      }
      
      setUploadComplete(true);
      showNotification("Logo uploaded successfully!", "success");
      
      // Call the callback to refresh the logo if provided
      if (onLogoUploaded) {
        onLogoUploaded();
      }
      
      // Always navigate to login after successful upload during registration
      if (isRegistration) {
        setTimeout(() => {
          handleClose();
          navigate('/login-page');
        }, 1500);
      } else {
        // If from dashboard, just close the dialog after a short delay
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      
      // Close any open SweetAlert
      try {
        Swal.close();
      } catch (swalError) {
        console.log("Error closing SweetAlert");
      }
      
      const errorMessage = error.data?.message || 
                          "Failed to upload logo. Please try again.";
      
      setError(errorMessage);
      showNotification(errorMessage, "error");
    }
  };

  // Modified skip handler
  const handleSkip = () => {
    handleClose();
    if (isRegistration) {
      showNotification("Registration successful! You can upload your logo later.", "success");
      navigate('/login-page');
    } else {
      showNotification("You can upload your logo later from your profile settings.", "info");
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={uploading ? undefined : handleClose} // Prevent closing during upload
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2, padding: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Add Your Company Logo
        </Typography>
        {!uploading && (
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Enhance your brand identity by adding your company logo. You can also do this later from your account settings.
          </Typography>
        </Box>

        {!file && (
          <UploadArea
            onDrop={handleDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
          >
            <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body1" fontWeight="medium" color="primary" sx={{ mb: 1 }}>
              Drag & Drop your logo here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or
            </Typography>
            <Button
              component="label"
              variant="contained"
              size="medium"
              startIcon={<CloudUploadIcon />}
              sx={{ borderRadius: 28 }}
            >
              Browse Files
              <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
              Recommended: PNG or JPG, max 2MB
            </Typography>
          </UploadArea>
        )}

        {file && (
          <Box sx={{ textAlign: 'center' }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                mb: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center'
              }}
            >
              <Box sx={{ mb: 2, position: 'relative' }}>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Company Logo Preview"
                  sx={{
                    maxHeight: 150,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: 1
                  }}
                />
                {uploadComplete && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: '50%',
                    }}
                  >
                    <CheckCircleIcon color="success" />
                  </Box>
                )}
              </Box>
              
              <Typography variant="body2" fontWeight="medium">
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(file.size / 1024).toFixed(1)} KB
              </Typography>
              
              {!uploadComplete && !uploading && (
                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => setFile(null)}
                >
                  Choose Different File
                </Button>
              )}
            </Paper>

            {uploadComplete && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Logo uploaded successfully!
              </Alert>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Welcome to HR360, {organizationName || 'your company'} will be set up shortly!
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={handleSkip} 
          disabled={uploading || uploadComplete}
          sx={{ borderRadius: 28, textTransform: 'none' }}
        >
          Skip for now
        </Button>
        <Button 
          variant="contained" 
          onClick={handleUpload}
          disabled={uploading || uploadComplete || !file}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ borderRadius: 28, textTransform: 'none' }}
        >
          {uploading ? 'Uploading...' : uploadComplete ? 'Uploaded!' : 'Complete Setup'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadLogoDialog;