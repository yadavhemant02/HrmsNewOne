import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  CameraAlt as CameraAltIcon,
  LocationOn as LocationOnIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import { hrApi } from '../../../utils/axiosConfig';
import { base_hr } from '../../../http/services';

const MyAttendence = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [attendanceType, setAttendanceType] = useState('');
  
  // Camera states
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get organization code from localStorage
      const organizationCode = localStorage.getItem('organizationCode');
      
      if (!organizationCode) {
        setError('Organization code not found in localStorage');
        return;
      }
      
      // Using the API endpoint with the organization code from localStorage
      const response = await hrApi.get(`/hr-handler/office/get-office-info?organizationCode=${organizationCode}`);
      
      if (response.data && response.data.result) {
        // Assuming the API returns an array of organizations
        // If it returns a single organization, we'll wrap it in an array
        const orgData = Array.isArray(response.data.result) 
          ? response.data.result 
          : [response.data.result];
        
        setOrganizations(orgData);
        
        // Don't auto-select - let user choose manually
        // setSelectedOrganization(organizationCode);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to load organizations. Please try again.');
      
      // Fallback: create organization based on localStorage data
      const organizationCode = localStorage.getItem('organizationCode');
      if (organizationCode) {
        setOrganizations([{
          organizationCode: organizationCode,
          name: localStorage.getItem('organizationName') || 'Default Organization',
          address: 'Sample Address'
        }]);
        // Don't auto-select in fallback either
        // setSelectedOrganization(organizationCode);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationChange = (event) => {
    setSelectedOrganization(event.target.value);
  };

  // Camera functions
  const requestCameraPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' });
      setCameraPermission(permission.state);
      
      if (permission.state === 'denied') {
        setError('Camera permission denied. Please enable camera access in your browser settings.');
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Permission API not supported, proceeding with camera access');
      return true;
    }
  };

  const startCamera = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permission and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Failed to access camera. Please check your camera and try again.');
      }
      setCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraOpen(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = async () => {
    if (capturedImage) {
      setIsMarkingAttendance(true);
      setAttendanceType('image');
      setError('');
      
      try {
        // Here you would send the captured image to your API
        console.log('Captured image data:', capturedImage.substring(0, 100) + '...');
        console.log(`Marking attendance with image for organization: ${selectedOrganization}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reset states
        setIsMarkingAttendance(false);
        setAttendanceType('');
        setCameraOpen(false);
        setCapturedImage(null);
        stopCamera();
        
      } catch (err) {
        console.error('Error marking attendance:', err);
        setError('Failed to mark attendance with image. Please try again.');
        setIsMarkingAttendance(false);
        setAttendanceType('');
      }
    }
  };

  const handleMarkAttendance = async (type) => {
    if (!selectedOrganization) {
      setError('Please select an organization first');
      return;
    }

    if (type === 'image') {
      setCameraOpen(true);
      setError('');
      // Start camera immediately when dialog opens
      setTimeout(() => {
        startCamera();
      }, 100);
    } else {
      setIsMarkingAttendance(true);
      setAttendanceType(type);
      setError('');

      try {
        // Here you would implement the actual attendance marking logic for location
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`Marking attendance with ${type} for organization: ${selectedOrganization}`);
        
        setIsMarkingAttendance(false);
        setAttendanceType('');
        
      } catch (err) {
        console.error('Error marking attendance:', err);
        setError(`Failed to mark attendance with ${type}. Please try again.`);
        setIsMarkingAttendance(false);
        setAttendanceType('');
      }
    }
  };

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box 
      sx={{ 
        minHeight: '10vh',
        // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: 'left', mb: 6 }}>
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          sx={{
            background: 'linear-gradient(45deg, black 30%, black 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.5rem', md: '2.5rem' },
            
          }}
        >
          <p style={{color:'black'}}>Mark Your Attendance</p>
        </Typography>

      </Box>

      {/* Main Content Card */}
      <Card 
        elevation={8}
        sx={{ 
          width: '100%',
          maxWidth: 600,
          borderRadius: 4,
          background: '#F8F9FA',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent >
          {/* Organization Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                //   boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)'
                }}
              >
                <BusinessIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" color="primary">
                  selecte you organization
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  Select your organization
                </Typography> */}
              </Box>
            </Box>

            <FormControl 
              fullWidth 
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                //   backgroundColor: '#f8f9fa',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3f51b5',
                    borderWidth: 2,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3f51b5',
                    borderWidth: 2,
                  },
                },
              }}
            >
              <InputLabel id="organization-label">Choose Organization</InputLabel>
              <Select
                labelId="organization-label"
                value={selectedOrganization}
                onChange={handleOrganizationChange}
                label="Choose Organization"
                disabled={loading}
              >
                {organizations.map((org, index) => (
                  <MenuItem key={index} value={org.organizationCode || org.id || org.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {org.name || org.organizationName || 'Organization'}
                        </Typography>
                        {org.address && (
                          <Typography variant="caption" color="text.secondary">
                            {org.address}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={24} color="primary" />
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  Loading organizations...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Attendance Section - Only show when organization is selected */}
          {selectedOrganization && (
            <>
              {/* Divider */}
              <Box sx={{ 
                height: 1, 
                background: 'linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%)',
                my: 4 
              }} />

              {/* Attendance Section */}
              <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  ml: 8,
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                }}
              >
                <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Mark Attendance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose your preferred method
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {/* Mark with Image Button */}
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CameraAltIcon />}
                  onClick={() => handleMarkAttendance('image')}
                  disabled={!selectedOrganization || isMarkingAttendance}
                  sx={{
                    py: 2.5,
                    borderRadius: 5,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                    boxShadow: '0 8px 20px rgba(63, 81, 181, 0.3)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #303f9f 30%, #1976d2 90%)',
                      boxShadow: '0 12px 25px rgba(63, 81, 181, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                    //   background: '#e0e0e0',
                      color: '#9e9e9e',
                      boxShadow: 'none',
                      transform: 'none',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isMarkingAttendance && attendanceType === 'image' ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Marking...
                    </>
                  ) : (
                    'Mark with Image'
                  )}
                </Button>
              </Grid>

              {/* Mark with Location Button */}
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<LocationOnIcon />}
                  onClick={() => handleMarkAttendance('location')}
                  disabled={!selectedOrganization || isMarkingAttendance}
                  sx={{
                    py: 2.5,
                    borderRadius: 5,
                    background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #388e3c 30%, #689f38 90%)',
                      boxShadow: '0 12px 25px rgba(76, 175, 80, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                    //   background: '#e0e0e0',
                      color: '#9e9e9e',
                      boxShadow: 'none',
                      transform: 'none',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isMarkingAttendance && attendanceType === 'location' ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Marking...
                    </>
                  ) : (
                    'Mark with Location'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Status Messages */}
      <Box sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error"
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
              border: '1px solid rgba(244, 67, 54, 0.1)'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {/* {!isMarkingAttendance && attendanceType === '' && selectedOrganization && !error && (
          <Alert
            severity="success"
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
              border: '1px solid rgba(76, 175, 80, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              <Typography variant="body1" fontWeight="medium">
                Ready to mark your attendance
              </Typography>
            </Box>
          </Alert>
        )} */}
      </Box>

      {/* Camera Dialog */}
      <Dialog
        open={cameraOpen}
        onClose={stopCamera}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
          color: 'white',
          mb: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhotoCameraIcon sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Capture Attendance Photo
            </Typography>
          </Box>
          <IconButton onClick={stopCamera} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {!capturedImage ? (
            <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#000'
                }}
              />
              
              {/* Camera controls overlay */}
              <Box sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2,
                alignItems: 'center'
              }}>
                <Button
                  variant="contained"
                  startIcon={<PhotoCameraIcon />}
                  onClick={capturePhoto}
                  disabled={!stream}
                  sx={{
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    minWidth: 'auto',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#333',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 1)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      color: '#666',
                    }
                  }}
                >
                  <PhotoCameraIcon />
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Photo Captured Successfully!
              </Typography>
              <Box sx={{ 
                maxWidth: '100%', 
                maxHeight: '300px', 
                borderRadius: 2, 
                overflow: 'hidden',
                mb: 3,
                border: '2px solid #e0e0e0'
              }}>
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </Box>
            </Box>
          )}
          
          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          {capturedImage ? (
            <>
              <Button
                onClick={retakePhoto}
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                sx={{ borderRadius: 2 }}
              >
                Retake
              </Button>
              <Button
                onClick={confirmPhoto}
                variant="contained"
                disabled={isMarkingAttendance}
                startIcon={isMarkingAttendance ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388e3c 30%, #689f38 90%)',
                  }
                }}
              >
                {isMarkingAttendance ? 'Marking...' : 'Confirm & Mark Attendance'}
              </Button>
            </>
          ) : (
            <Button
              onClick={stopCamera}
              variant="outlined"
              startIcon={<StopIcon />}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyAttendence;