import { Box, Button, Card, CardContent, MenuItem, TextField, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base_emp, base_Ip } from '../../http/services';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

function Checkin({ onCheckInSuccess }) {
  const credentials = useSelector((state) => state.credential?.credential || {});
  const [remoteWork, setRemoteWork] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const todayDate = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  const currencies = [
    { value: 'WFO', label: 'WFO' },
    { value: 'WFH', label: 'WFH' },
    { value: 'WFF', label: 'WFF' }
  ];

  const checkIn = async () => {
    if (!navigator.geolocation) {
      setAlertMessage('Geolocation is not supported by this browser.');
      setAlertSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const checkInData = {
          name: localStorage.getItem("name"),
          empNumber: localStorage.getItem("empNumber"),
          empCode: localStorage.getItem("empCode"),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          remoteWork: remoteWork || 'WFO',
          organizationCode:localStorage.getItem('organizationCode'),
        };

        try {
          const response = await axios.post(
            `${base_emp}/emp-handler/attendence/check-in`,
            checkInData
          );

          if (response.status === 201) {
            onCheckInSuccess?.();
            sessionStorage.removeItem('timerCheck');

            Swal.fire({
              position: "bottom-end",
              icon: "success",
              title: "Check-in successful!",
              showConfirmButton: false,
              timer: 1500,
            });

            // Delay navigation slightly to allow the success message to be seen
            setTimeout(() => {
              navigate('/dashboard-emp/attendence-emp');
            }, 1500);
          }
        } catch (error) {
          onCheckInSuccess?.();
          const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
          Swal.fire({
            position: "bottom-end",
            icon: "error",
            title: `Failed: ${errorMessage}`,
            showConfirmButton: true,
          });

          // Navigate after error acknowledgment
          setTimeout(() => {
            navigate('/dashboard-emp/attendence-emp');
          }, 1000);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setAlertMessage(`Geolocation error: ${error.message}`);
        setAlertSeverity('error');
        setOpenSnackbar(true);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  
  return (
    <Box sx={{
      border: '1px solid rgba(46, 209, 137, 0.5)',
      borderRadius: '10px',
      marginTop: { xs: '20%', md: '10%' },
      padding: { xs: '20px', md: '30px' },
      maxWidth: '600px',
      margin: 'auto',
    }}>
      {/* Rest of your existing JSX remains the same */}
      <Typography
        variant="h4"
        component="p"
        sx={{
          fontFamily: 'cursive',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: { xs: '1.5rem', md: '2rem' },
        }}
      >
        Check IN
      </Typography>

      <Box sx={{ marginBottom: '20px' }}>
        <TextField
          select
          label="Remote Work"
          value={remoteWork}
          helperText="Please select your work type"
          fullWidth
          onChange={(e) => {
            setRemoteWork(e.target.value);
            localStorage.setItem('remoteWork', e.target.value);
          }}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* DateTime and Employee Fields */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        marginBottom: '20px',
        gap: { xs: 2, md: 0 },
      }}>
        <TextField
          disabled
          label="Today Date"
          defaultValue={todayDate}
          fullWidth />
      </Box>

      {/* Check-in Button */}
      <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={checkIn} 
          disabled={loading}
          sx={{ width: '100%' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Go to CheckIN'}
        </Button>
      </Box>

      {/* Location Card */}
      <Card sx={{
        backgroundColor: 'rgba(46, 209, 137, 0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        padding: 2,
        width: '100%',
        marginTop: '20px',
        textAlign: 'center',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: '#2ed189',
        },
      }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ color: 'white', marginBottom: '10px' }}>
            Feed Current Location
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', marginBottom: '20px' }}>
            This is a card with a semi-transparent background and a blur effect.
          </Typography>
          <Button variant="outlined" size="medium">
            <a 
              href="https://66ba0413f205a485f84fe405--effortless-jelly-38df1d.netlify.app/" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Go To Feed Location
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
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

export default Checkin;