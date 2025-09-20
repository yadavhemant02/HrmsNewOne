import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  IconButton,
  TextField,
  Grid,
  Divider,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { base_emp, base_identity } from "../../../http/services";
import { useSelector } from "react-redux";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function Profile() {
  const emailuser = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const credentials = { emailuser, name };
  const userDetails = useSelector((state) => state.auth.user);

  const [baseImage, setBaseImage] = useState("");
  const [designation, setDesignation] = useState("");
  const [records, setRecords] = useState([]);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91-7800338779");
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    department: "",
    position: "",
    hiredAt: "",
    dob: "",
    contactDetails: "",
    address: "",
    empCode: "",
  });

  // Refs for animations
  const profileCardRef = useRef(null);
  const avatarRef = useRef(null);
  const detailsRef = useRef(null);
  const attendanceHeaderRef = useRef(null);
  const attendanceCardsRef = useRef([]);

  const navigate = useNavigate();

  // Animation setup
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      profileCardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    );

    tl.fromTo(
      avatarRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    );

    tl.fromTo(
      detailsRef.current?.children || [],
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
      },
      "-=0.2"
    );

    attendanceCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              toggleActions: "play none none reverse",
            },
            delay: index * 0.1,
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [records]);

  // API calls and handlers
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await handleUploadImage(file);
    }
  };

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("empCode", localStorage.getItem("empCode"));
    formData.append("empNumber", localStorage.getItem("empNumber"));
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${base_emp}/emp-handler/image/edit-emp-image`,
        formData
      );
      if (response.status === 201) {
        gsap.to(avatarRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            fetchImageApi();
            gsap.to(avatarRef.current, {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              ease: "back.out(1.7)",
            });
          },
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const fetchImageApi = async () => {
    try {
      const response = await axios.get(
        `${base_emp}/emp-handler/image/get-emp-image?empCode=${localStorage.getItem("empCode")}`
      );
      if (response.status === 201) {
        setBaseImage(`data:image/png;base64,${response.data.result}`);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const empDetails = async () => {
    try {
      const response = await axios.post(
        `${base_identity}/identity-handler/details/get-emp-details?empCode=${localStorage.getItem("empCode")}`
      );
      
      // Set profile data from API response
      setProfileData({
        firstName: response.data.firstName || "",
        middleName: response.data.middleName || "",
        lastName: response.data.lastName || "",
        department: response.data.department || "",
        position: response.data.disignation || "",
        hiredAt: response.data.hiredAt || "",
        dob: response.data.dob || "",
        contactDetails: response.data.contactDetails || phoneNumber,
        address: response.data.address || "",
        empCode: localStorage.getItem("empCode") || "",
      });
      
      setDesignation(response.data.disignation);
      setEmail(localStorage.getItem("email"));
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const fetchEmployeeAllAttendence = async () => {
    try {
      const response = await axios.post(
        `${base_emp}/emp-handler/attendence/emp-all-attendence?empCode=${localStorage.getItem("empCode")}`
      );
      setRecords(response.data.result);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const logout = () => {
    gsap.to(profileCardRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("reloaded");
        navigate("/login");
      },
    });
  };

  useEffect(() => {
    empDetails();
    fetchImageApi();
    fetchEmployeeAllAttendence();
  }, []);

  return (
    <div>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // padding: { xs: 2, sm: 4 },
        }}
      >
        {/* Main Profile Card */}
        <Box sx={{ maxWidth: 1200, width: "100%", mb: 4 }} ref={profileCardRef}>
          <Paper 
            sx={{ 
              p: 4, 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              background: '#ffffff',
            }}
          >
            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, mb: 4 }}>
              {/* Profile Photo Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', mb: 2 }} ref={avatarRef}>
                  <Avatar
                    src={baseImage || "https://via.placeholder.com/120"}
                    alt="Profile"
                    sx={{
                      width: 120,
                      height: 120,
                      border: '3px solid #e0e0e0',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <label htmlFor="file-upload">
                    <IconButton
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: -5,
                        right: -5,
                        bgcolor: '#2196f3',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: '#1976d2',
                          transform: 'scale(1.1)',
                        },
                        width: 36,
                        height: 36,
                        border: '3px solid #fff',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </Box>
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#666',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  Emp Photo
                </Typography>
              </Box>

              {/* Employee Name and Code Section */}
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#333',
                    mb: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}
                >
                  {userDetails?.name || profileData.firstName + ' ' + profileData.lastName}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#666',
                    fontWeight: 400,
                    mb: 3,
                    fontSize: '1.1rem'
                  }}
                >
                  Emp Code: {localStorage.getItem('empCode')}
                </Typography>

                {/* Change Password Button */}
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  sx={{
                    color: '#333',
                    borderColor: '#ddd',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      borderColor: '#2196f3',
                      color: '#2196f3',
                      bgcolor: 'rgba(33, 150, 243, 0.04)',
                    },
                  }}
                >
                  Change Password
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Profile Form Section */}
            <Box ref={detailsRef}>
              <Grid container spacing={3}>
                {/* Row 1: Names */}
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={profileData.firstName}
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#2196f3' },
                        '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                      },
                    }}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                    Middle Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={profileData.middleName}
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#2196f3' },
                        '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                      },
                    }}
                    onChange={(e) => setProfileData({...profileData, middleName: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={profileData.lastName}
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#2196f3' },
                        '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                      },
                    }}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  />
                </Grid>

                {/* Row 2: Job Details */}
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                    Department
                  </Typography>
                  <TextField
                    fullWidth
                    value={profileData.department}
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#2196f3' },
                        '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                      },
                    }}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                    Position
                  </Typography>
                  <TextField
                    fullWidth
                    value={profileData.position}
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#2196f3' },
                        '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                      },
                    }}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                    Hired At
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={profileData.hiredAt}
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#2196f3' },
                        '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                      },
                    }}
                    onChange={(e) => setProfileData({...profileData, hiredAt: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                    D.O.B
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={profileData.dob}
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#2196f3' },
                        '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                      },
                    }}
                    onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                  />
                </Grid>

                {/* Row 3: Contact Details and Address */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                    Contact Details
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={profileData.contactDetails}
                    variant="outlined"
                    placeholder="Enter contact information..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#2196f3' },
                        '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                      },
                    }}
                    onChange={(e) => setProfileData({...profileData, contactDetails: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                    Address
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={profileData.address}
                    variant="outlined"
                    placeholder="Enter address..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#2196f3' },
                        '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                      },
                    }}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#666',
                    borderColor: '#ddd',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 4,
                    py: 1.2,
                    '&:hover': {
                      borderColor: '#666',
                      bgcolor: 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#2196f3',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 4,
                    py: 1.2,
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      bgcolor: '#1976d2',
                      boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
        </Box>
    </div>
  );
}

export default Profile;