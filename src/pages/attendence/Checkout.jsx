import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  MenuItem, 
  TextField, 
  CircularProgress, 
  Typography, 
  Snackbar, 
  Alert 
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base_emp, base_Ip } from '../../http/services';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

function Checkout({ onCheckoutSuccess }) {
  const credentials = useSelector((state) => state.credential?.credential || {});
  const todayDate = new Date().toISOString().split('T')[0];
  const [remoteWork, setRemoteWork] = useState(localStorage.getItem('remoteWork') || 'WFO');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const navigate = useNavigate();

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleError = (error) => {
    if (error.response && error.response.status === 400) {
      // Also update data in case of existing checkout
      onCheckoutSuccess?.();
      showAlert(`Already checked out: ${error.response.data.message}`, 'info');
      setTimeout(() => {
        navigate('/dashboard-emp/attendence-emp');
        window.location.reload();
      }, 2000);
    } else {
      showAlert('Server error. Please try again later.', 'error');
    }
  };

  const checkout = async () => {
    if (description.trim() === '') {
      showAlert("Please provide a description before checking out.", 'warning');
      return;
    }

    if (!projectId.trim()) {
      showAlert("Please provide a project ID.", 'warning');
      return;
    }

    if (navigator.geolocation) {
      setLoading(true);
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const checkOutData = {
            name: localStorage.getItem("name"),
            empNumber: localStorage.getItem("empNumber"),
            empCode: localStorage.getItem("empCode"),
            projectId: projectId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            remoteWork,
            description: description
          };

          try {
            const response = await axios.post(
              `${base_emp}/emp-handler/attendence/check-out`,
              checkOutData
            );
            
            if (response.status === 201) {
             
              onCheckoutSuccess?.();
              
              showAlert('Check-Out successful. Updating attendance data...', 'success');
              sessionStorage.removeItem('timerCheck');
              localStorage.removeItem('startTime'); // Clear timer
              
              // Short delay before redirect to allow data to update
              setTimeout(() => {
                navigate('/dashboard-emp/attendence-emp');
               // window.location.reload();
               Swal.fire({
                position: "bottom-end",
                icon: "success",
                title: "Check-out successful!",
                showConfirmButton: false,
                timer: 1500
              });
              }, 1000);
            }
          } catch (error) {
            handleError(error);
               Swal.fire({
                            position: "bottom-end",
                            icon: "error",
                            title: "Failed :"+error.response.data.message,
                            text: error.message, // Optional: Include error message
                            showConfirmButton: true, // Allows user to acknowledge the error
                          });
          } finally {
            setLoading(false);
            navigator.geolocation.clearWatch(watchId);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          showAlert('Unable to retrieve location. Please ensure location services are enabled.', 'error');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      showAlert('Geolocation is not supported by this browser.', 'warning');
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid rgba(255, 0, 0, 0.5)',
        borderRadius: '10px',
        marginTop: { xs: '20%', sm: '15%', md: '10%' },
        padding: { xs: '20px', sm: '30px' },
        maxWidth: { xs: '90%', sm: '80%', md: '600px' },
        margin: 'auto',
        position: 'relative',
        minHeight: '400px',
      }}
    >
      <Typography 
        variant="h4" 
        component="p" 
        sx={{ 
          fontFamily: 'cursive', 
          textAlign: 'center', 
          marginBottom: '20px' 
        }}
      >
        Check OUT
      </Typography>

      <Box sx={{ marginBottom: '20px' }}>
        <TextField
          disabled
          label="Remote Work"
          value={localStorage.getItem('remoteWork')}
          helperText="Your selected work type"
          fullWidth
        />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        marginBottom: '20px' 
      }}>
        <TextField
          disabled
          label="Today Date"
          value={todayDate}
          fullWidth
         />
      </Box>

      <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
        <TextField
          required
          label="Description"
          variant="filled"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={description.trim() === ''}
          helperText={description.trim() === '' ? "Description is required" : ""}
        />
      </Box>

      <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
        <TextField
          required
          label="Project ID"
          variant="filled"
          fullWidth
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          error={projectId.trim() === ''}
          helperText={projectId.trim() === '' ? "Project ID is required" : ""}
        />
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={checkout}
          disabled={loading || !description.trim() || !projectId.trim()}
          sx={{ 
            width: '100%',
            bgcolor: '#f44336',
            '&:hover': {
              bgcolor: '#d32f2f',
            },
            '&.Mui-disabled': {
              bgcolor: '#ffcdd2',
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Go to Check Out'}
        </Button>

        <Card
          sx={{
            backgroundColor: 'rgba(255, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            padding: 2,
            width: '100%',
            marginTop: '20px',
            textAlign: 'center',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
            },
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div" sx={{ color: 'white', marginBottom: '10px' }}>
              Feed Current Location
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', marginBottom: '20px' }}>
              This is a card with a red, semi-transparent background and a blur effect.
            </Typography>
            <Button 
              variant="outlined" 
              size="medium"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <a 
                href="https://66ba0413f205a485f84fe405--effortless-jelly-38df1d.netlify.app/" 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Go To Feed Location
              </a>
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={alertSeverity} 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Checkout;