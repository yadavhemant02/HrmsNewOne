import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  styled,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Drawer
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  Badge,
  ArrowForward,
  LockOpen,
  Add,
  Close,
  Save
} from "@mui/icons-material";
import axios from "axios";
import { base_identity } from "../../../http/services";
import { useAlert } from "../../../context/AlertContext";

// import swal
import Swal from "sweetalert2";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddDetailsDialog from "./adddetailscomponents/AddDetailsDialog";

// Styled components
const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  background: "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
  color: 'white',
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    borderRadius: "4px",
  },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: theme.spacing(4),
  fontWeight: 800,
  letterSpacing: "1px",
  textTransform: "uppercase",
  fontSize: "1.8rem",
  textAlign: "center",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    transition: "all 0.3s ease",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    height: 50,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.98)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: theme.palette.primary.main,
    fontSize: 20,
  },
  "& .MuiFormLabel-root": {
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  "& .MuiInputBase-input": {
    paddingLeft: "8px",
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    transition: "all 0.3s ease",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    height: 50,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.98)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  "& .MuiFormLabel-root": {
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    paddingLeft: "8px",
  },
  "& .MuiInputAdornment-root": {
    marginRight: theme.spacing(1),
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: theme.palette.primary.main,
    fontSize: 20,
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  height: 50,
  borderRadius: 12,
  background: "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
  boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
  transition: "all 0.3s ease",
  textTransform: "none",
  fontSize: "1.1rem",
  color: "white",
  fontWeight: 600,
  letterSpacing: "0.5px",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  "&:hover": {
    background: "linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)",
    boxShadow: "0 6px 14px rgba(33, 150, 243, 0.4)",
  },
}));

const HeaderContainer = styled(Box)({
  textAlign: "center",
  marginBottom: 30,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -15,
    left: "50%",
    transform: "translateX(-50%)",
    height: 3,
    width: 80,
    background: "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
    borderRadius: 2,
  },
});

const AddButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  height: "100%",
  minWidth: 40,
  borderRadius: 8,
  background: "linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)",
  color: "white",
  boxShadow: "0 2px 8px rgba(33, 150, 243, 0.2)",
  "&:hover": {
    background: "linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)",
  },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    transition: "all 0.3s ease",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    minHeight: 50,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.98)",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: theme.palette.primary.main,
    fontSize: 20,
  },
}));

const AddEmployeeDrawer = ({ open, onClose, onSuccess, mode = 'add', employeeData = null }) => {
  const { showAlert } = useAlert();
  
  // State for organization data from localStorage
  const [organizationData, setOrganizationData] = useState({
    organizationName: "",
    organizationCode: ""
  });

  // State for managers list
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  
  // State for AddDetailsDialog
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  // Load organization data from localStorage on component mount
  useEffect(() => {
    const orgName = localStorage.getItem("organizationName") || "";
    const orgCode = localStorage.getItem("organizationCode") || "";
    
    setOrganizationData({
      organizationName: orgName,
      organizationCode: orgCode
    });

    // Fetch managers when organization code is available
    if (orgCode) {
      fetchManagers(orgCode);
    }
  }, []);

  // Function to fetch managers
  const fetchManagers = async (orgCode) => {
    setLoadingManagers(true);
    try {
      const response = await axios.get(
        `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${orgCode}`
      );
      if (response.data) {
        setManagers(response.data);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
      showAlert("Failed to load managers", "error");
    } finally {
      setLoadingManagers(false);
    }
  };

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    designation: "",
    role: "",
    empCode: "",
    id: "",
    manager: "",
    dateOfJoin: null,
    empType: ""
  });

  // State for errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    designation: "",
    role: "",
    dateOfJoin: "",
    empType: ""
  });

  // State for show password toggle
  const [showPassword, setShowPassword] = useState(false);

  // State for loading button
  const [loading, setLoading] = useState(false);

  // State for custom designation
  const [openDialog, setOpenDialog] = useState(false);
  const [newDesignation, setNewDesignation] = useState("");
  const [newDesignationError, setNewDesignationError] = useState("");

  // Functions for AddDetailsDialog
  const openDetailsDialog = (employee) => {
    setCurrentEmployee(employee);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setCurrentEmployee(null);
    
    // After closing details dialog, trigger the success callback to refresh the list
    if (onSuccess) onSuccess();
    
    // Close the main drawer
    onClose();
  };

  // Load employee data if in edit mode and employee data is provided
  useEffect(() => {
    if (mode === 'edit' && employeeData) {
      setFormData({
        name: employeeData.name || '',
        email: employeeData.email || '',
        mobileNumber: employeeData.mobileNumber || '',
        password: '', // Don't populate password for security reasons
        designation: employeeData.designation || '',
        role: employeeData.role || '',
        empCode: employeeData.empCode || '',
        id: employeeData.id || '',
        manager: (employeeData.managerEmail || employeeData.manager) || '',
        dateOfJoin: employeeData.dateOfJoin ? new Date(employeeData.dateOfJoin) : null,
        empType: employeeData.empType || ''
      });
    } else {
      resetForm();
    }
  }, [mode, employeeData, open]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobileNumber: "",
      password: "",
      designation: "",
      role: "",
      empCode: "",
      id: "",
      manager: "",
      dateOfJoin: null,
      empType: ""
    });
    setErrors({
      name: "",
      email: "",
      mobileNumber: "",
      password: "",
      designation: "",
      role: "",
      dateOfJoin: "",
      empType: ""
    });
    setShowPassword(false);
  };

  // Designation options grouped by role category
  const [designationOptions, setDesignationOptions] = useState([
   // HR Role Designations
   "HR Manager",
   "HR Assistant",
   "HR Director",
   "HR Specialist",
   "HR Coordinator",
   "HR Consultant",
   "HR Administrator",
   // Employee Role Designations (including what were previously Manager roles)
   "Project Manager",
   "Product Manager",
   "Operations Manager",
   "Department Manager",
   "Technical Manager",
   "Team Lead",
   "Engineering Manager",
   "Software Developer",
   "Senior Developer",
   "UI/UX Designer",
   "QA Engineer",
   "DevOps Engineer",
   "Data Analyst",
   "System Administrator",
   "Frontend Developer",
   "Backend Developer"
 ]);

 // Handle form input changes
 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData({ ...formData, [name]: value });
 };

 // Handle designation change from Autocomplete
 const handleDesignationChange = (event, newValue) => {
   setFormData({ ...formData, designation: newValue || "" });
 };

 // Handle dialog open for adding custom designation
 const handleOpenDialog = () => {
   setOpenDialog(true);
   setNewDesignation("");
   setNewDesignationError("");
 };

 // Handle dialog close
 const handleCloseDialog = () => {
   setOpenDialog(false);
 };

 const showSweetAlert = (message, type) => {
   Swal.fire({
     title: type === "error" ? "Error" : "Success",
     text: message,
     icon: type,
     confirmButtonColor: "#2563eb",
     timer: type === "success" ? 3000 : undefined,
     timerProgressBar: type === "success",
     customClass: {
       container: 'swal-container-class',
       popup: 'swal-popup-class'
     },
     target: document.body,
     didOpen: () => {
       // Add CSS to ensure high z-index
       const style = document.createElement('style');
       style.innerHTML = `
         .swal-container-class {
           z-index: 9999 !important;
         }
         .swal-popup-class {
           z-index: 9999 !important;
         }
       `;
       document.head.appendChild(style);
     },
   });
 };

 const showNotification = (message, type) => {
   try {
     // Try SweetAlert first
     showSweetAlert(message, type);
   } catch (error) {
     // Fall back to context alert if SweetAlert fails
     showAlert(message, type);
   }
 };

 // Handle add new designation
 const handleAddDesignation = () => {
   if (!newDesignation.trim()) {
     setNewDesignationError("Designation cannot be empty");
     return;
   }

   if (designationOptions.includes(newDesignation.trim())) {
     setNewDesignationError("This designation already exists");
     return;
   }

   // Add new designation to options
   setDesignationOptions([...designationOptions, newDesignation.trim()]);
   // Set it as the current selection
   setFormData({ ...formData, designation: newDesignation.trim() });
   // Close dialog
   setOpenDialog(false);
 };

 // Form validation
 const validateForm = () => {
   const newErrors = {};
   if (!formData.name.trim()) newErrors.name = "Full Name is required";
   if (!formData.email.trim()) {
     newErrors.email = "Email is required";
   } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
     newErrors.email = "Email address is invalid";
   }
   if (!formData.mobileNumber.trim()) {
     newErrors.mobileNumber = "Mobile Number is required";
   } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
     newErrors.mobileNumber = "Mobile Number should be 10 digits";
   }
   
   // Only validate password in 'add' mode or if a new password is provided in 'edit' mode
   if (mode === 'add' || formData.password.trim()) {
     if (mode === 'add' && !formData.password.trim()) {
       newErrors.password = "Password is required";
     } else if (formData.password.trim() && formData.password.length < 6) {
       newErrors.password = "Password must be at least 6 characters";
     }
   }
   
   if (!formData.designation) {
     newErrors.designation = "Designation is required";
   }
   if (!formData.role) {
     newErrors.role = "Role is required";
   }
   if (!formData.empType) {
     newErrors.empType = "Employee Type is required";
   }
   
   // Validate organization data
   if (!organizationData.organizationName) {
     showAlert("Organization name is missing. Please log in again.", "error");
     return false;
   }
   if (!organizationData.organizationCode) {
     showAlert("Organization code is missing. Please log in again.", "error");
     return false;
   }
   
   setErrors(newErrors);
   return Object.keys(newErrors).length === 0;
 };

 // Handle form submission
 const handleSubmit = async (e) => {
   e.preventDefault();

   if (!validateForm()) return;

   setLoading(true);

   try {
     let response;
     
     if (mode === 'add') {
       // Format the data for creating a new employee
       const apiData = {
         name: formData.name,
         email: formData.email,
         mobileNumber: formData.mobileNumber,
         password: formData.password,
         role: formData.role,
         designation: formData.designation,
         organizationName: organizationData.organizationName,
         organizationCode: organizationData.organizationCode,
         empCode: formData.empCode,
         manager: formData.manager,
         empType: formData.empType
       };

       response = await axios.post(
         `${base_identity}/identity-handler/create/create-existing-user`,
         apiData,
         {
           headers: {
             "Content-Type": "application/json",
           },
         }
       );

       // Save employee data to localStorage
       localStorage.setItem("empCode", formData.empCode);
       localStorage.setItem("manager", formData.manager);

       // If employee creation was successful, show success message
       showAlert("Employee registered successfully!", "success");
       
       // Open the details dialog with the new employee data
       if (response && response.data) {
         // Extract employee data from the response or create an object with what we know
         const newEmployeeData = response.data || {
           ...apiData,
           empCode: response.data?.empCode || `EMP${Date.now().toString().slice(-6)}`, // Fallback if API doesn't return empCode
           id: response.data?.id || Date.now().toString()
         };
         
         // Open details dialog with the new employee
         openDetailsDialog(newEmployeeData);
       }
     } else {
       // Format the data for updating an existing employee
       const updateData = {
         name: formData.name,
         email: formData.email,
         mobileNumber: formData.mobileNumber,
         role: formData.role,
         designation: formData.designation,
         organizationName: organizationData.organizationName,
         organizationCode: organizationData.organizationCode,
         manager: formData.manager,
         empCode: formData.empCode,
         empType: formData.empType
       };

       // Add password only if provided
       if (formData.password.trim()) {
         updateData.password = formData.password;
       }

       response = await axios.post(
         `${base_identity}/identity-handler/auth/update-credential-data`,
         updateData,
         {
           headers: {
             "Content-Type": "application/json",
           },
         }
       );
       
       // Save updated employee data to localStorage
       localStorage.setItem("empCode", formData.empCode);
       localStorage.setItem("manager", formData.manager);       
       showAlert("Employee updated successfully!", "success");
       
       // Reset form
       resetForm();
       
       // Call success callback to refresh the list
       if (onSuccess) onSuccess();
       
       // Close the drawer
       onClose();
     }
   } catch (error) {
     // Get the error message from the API response or use a default message
     const errorMessage = error?.response?.data?.message || error?.response?.data || error?.message || "An error occurred while processing your request";
     
     // Show the error message using the notification system
     showNotification(errorMessage, "error");
     
     console.error("Error details:", error);
   } finally {
     setLoading(false);
   }
 };

 // Filter designations based on role selection
 const getFilteredDesignations = () => {
   if (!formData.role) return designationOptions;
   
   // Role-specific designation filtering (simplified to just HR and EMPLOYEE)
   switch (formData.role) {
     case "HR":
       return designationOptions.filter(d => 
         d.toLowerCase().includes("hr") || 
         ["director", "coordinator", "specialist", "consultant", "administrator"].some(term => 
           d.toLowerCase().includes(term)
         )
       );
     case "EMP":
       return designationOptions.filter(d => 
         !d.toLowerCase().includes("hr")
       );
     default:
       return designationOptions;
   }
 };

 return (
   <>
     <Drawer
       anchor="right"
       open={open}
       onClose={onClose}
       sx={{ 
         '& .MuiDrawer-paper': { 
           width: { xs: '100%', sm: '100%', md: '550px' },
           backgroundColor: '#f9fafc',
         }
       }}
     >
       <DrawerHeader>
         <Typography variant="h6" fontWeight="600">
           {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
         </Typography>
         <IconButton onClick={onClose} edge="end" sx={{ color: 'white' }}>
           <Close />
         </IconButton>
       </DrawerHeader>
       
       <DrawerContent>
         <Box component="form" onSubmit={handleSubmit} noValidate>
           <HeaderContainer>
             <GradientTypography variant="h5">
               {mode === 'add' ? 'Employee Registration' : 'Update Employee'}
             </GradientTypography>
             <Typography
               variant="subtitle1"
               sx={{
                 color: "text.secondary",
                 fontSize: "0.95rem",
                 fontWeight: 500,
                 opacity: 0.85,
                 marginTop: -1,
               }}
             >
               {mode === 'add' 
                 ? 'Create a new employee account in the system' 
                 : 'Update employee information in the system'}
             </Typography>
           </HeaderContainer>

           <LocalizationProvider dateAdapter={AdapterDateFns}>
             <Grid container spacing={2}>
             <Grid item xs={12}>
                 <StyledTextField
                   fullWidth
                   label="Employee Code"
                   name="empCode"
                   value={formData.empCode}
                   onChange={handleChange}
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start">
                         <Badge />
                       </InputAdornment>
                     ),
                   }}
                   placeholder="Enter employee code"
                 />
               </Grid>
               <Grid item xs={12}>
                 <StyledTextField
                   fullWidth
                   label="Full Name"
                   name="name"
                   value={formData.name}
                   onChange={handleChange}
                   error={!!errors.name}
                   helperText={errors.name}
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start">
                         <Person />
                       </InputAdornment>
                     ),
                   }}
                 />
               </Grid>

               <Grid item xs={12}>
                 <StyledTextField
                   fullWidth
                   label="Email Address"
                   name="email"
                   type="email"
                   value={formData.email}
                   onChange={handleChange}
                   error={!!errors.email}
                   helperText={errors.email}
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start">
                         <Email />
                       </InputAdornment>
                     ),
                   }}
                 />
               </Grid>

               <Grid item xs={12}>
                 <StyledTextField
                   fullWidth
                   label="Mobile Number"
                   name="mobileNumber"
                   value={formData.mobileNumber}
                   onChange={handleChange}
                   error={!!errors.mobileNumber}
                   helperText={errors.mobileNumber}
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start">
                         <Phone />
                       </InputAdornment>
                     ),
                   }}
                 />
               </Grid>

               <Grid item xs={12}>
                 <StyledTextField
                   fullWidth
                   label={mode === 'edit' ? "New Password (leave blank to keep current)" : "Password"}
                   name="password"
                   type={showPassword ? "text" : "password"}
                   value={formData.password}
                   onChange={handleChange}
                   error={!!errors.password}
                   helperText={errors.password}
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start">
                         {showPassword ? <LockOpen /> : <Lock />}
                       </InputAdornment>
                     ),
                     endAdornment: (
                       <InputAdornment position="end">
                         <IconButton
                           onClick={() => setShowPassword(!showPassword)}
                           edge="end"
                           size="small"
                           sx={{ color: "primary.main" }}
                         >
                           {showPassword ? <VisibilityOff /> : <Visibility />}
                         </IconButton>
                       </InputAdornment>
                     ),
                   }}
                 />
               </Grid>

               <Grid item xs={12}>
                 <StyledFormControl fullWidth error={!!errors.role}>
                   <InputLabel id="role-select-label">Select Role</InputLabel>
                   <Select
                     labelId="role-select-label"
                     id="role-select"
                     name="role"
                     value={formData.role}
                     onChange={handleChange}
                     label="Select Role"
                     displayEmpty
                     startAdornment={
                       <InputAdornment position="start">
                         <Badge />
                       </InputAdornment>
                     }
                   >
                     <MenuItem value="" disabled>
                       <em>Select Role</em>
                     </MenuItem>
                     <MenuItem value="EMP">Employee</MenuItem>
                     <MenuItem value="HR">HR</MenuItem>
                   </Select>
                   {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                 </StyledFormControl>
               </Grid>

               <Grid item xs={12}>
                 <StyledFormControl fullWidth error={!!errors.empType}>
                   <InputLabel id="emp-type-select-label">Employee Type</InputLabel>
                   <Select
                     labelId="emp-type-select-label"
                     id="emp-type-select"
                     name="empType"
                     value={formData.empType}
                     onChange={handleChange}
                     label="Employee Type"
                     displayEmpty
                     startAdornment={
                       <InputAdornment position="start">
                         <Badge />
                       </InputAdornment>
                     }
                   >
                     <MenuItem value="" disabled>
                       <em>Select Employee Type</em>
                     </MenuItem>
                     <MenuItem value="Full Time">Full Time</MenuItem>
                     <MenuItem value="Intern">Intern</MenuItem>
                     <MenuItem value="Part Time">Part Time</MenuItem>
                     <MenuItem value="Consultant">Consultant</MenuItem>
                     <MenuItem value="Others">Others</MenuItem>
                   </Select>
                   {errors.empType && <FormHelperText>{errors.empType}</FormHelperText>}
                 </StyledFormControl>
               </Grid>

               <Grid item xs={12}>
                 <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                   <StyledAutocomplete
                     fullWidth
                     size="small"
                     id="designation-select"
                     options={getFilteredDesignations()}
                     value={formData.designation}
                     onChange={handleDesignationChange}
                     renderInput={(params) => (
                       <TextField
                         {...params}
                         label="Select Designation"
                         error={!!errors.designation}
                         helperText={errors.designation}
                         InputProps={{
                           ...params.InputProps,
                           startAdornment: (
                             <>
                               <InputAdornment position="start">
                                 <Badge />
                               </InputAdornment>
                               {params.InputProps.startAdornment}
                             </>
                           )
                         }}
                       />
                     )}
                     freeSolo
                     clearOnBlur={false}
                   />
                   <AddButton
                     variant="contained"
                     onClick={handleOpenDialog}
                     title="Add Custom Designation"
                   >
                     <Add />
                   </AddButton>
                 </Box>
               </Grid>

               <Grid item xs={12}>
                 <StyledAutocomplete
                   fullWidth
                   size="small"
                   id="manager-select"
                   options={managers}
                   value={managers.find(m => m.email === formData.manager) || null}
                   onChange={(event, newValue) => {
                     setFormData({ ...formData, manager: newValue ? newValue.email : '' });
                   }}
                   getOptionLabel={(option) => option.email || ''}
                   renderInput={(params) => (
                     <TextField
                       {...params}
                       label="Select Manager"
                       placeholder="Search by email"
                       InputProps={{
                         ...params.InputProps,
                         startAdornment: (
                           <>
                             <InputAdornment position="start">
                               <Badge />
                             </InputAdornment>
                             {params.InputProps.startAdornment}
                           </>
                         )
                       }}
                     />
                   )}
                   loading={loadingManagers}
                   loadingText="Loading managers..."
                   noOptionsText="No managers found"
                   disabled={loadingManagers}
                 />
               </Grid>

               {/* Display organization information */}
               <Grid item xs={12}>
                 <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                   {mode === 'add' 
                     ? `Employee will be registered under: ${organizationData.organizationName || "Loading..."}` 
                     : `Employee belongs to: ${organizationData.organizationName || "Loading..."}`}
                 </Typography>
               </Grid>
             </Grid>
           </LocalizationProvider>

           <GradientButton
             type="submit"
             fullWidth
             disabled={loading}
             endIcon={
               loading ? (
                 <CircularProgress size={20} color="inherit" />
               ) : mode === 'add' ? (
                 <ArrowForward />
               ) : (
                 <Save />
               )
             }
           >
             {loading 
               ? (mode === 'add' ? "Creating Account..." : "Updating Account...")
               : (mode === 'add' ? "Create Employee Account" : "Update Employee Account")}
           </GradientButton>
         </Box>
       </DrawerContent>
     </Drawer>
     
     {/* Dialog for adding custom designation */}
     <Dialog 
       open={openDialog} 
       onClose={handleCloseDialog}
       fullWidth
       maxWidth="xs"
     >
       <DialogTitle>
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
           <Badge sx={{ mr: 1, color: 'primary.main' }} />
           <Typography variant="h6">Add Custom Designation</Typography>
         </Box>
       </DialogTitle>
       <DialogContent>
         <StyledTextField
           fullWidth
           label="Designation Name"
           value={newDesignation}
           onChange={(e) => setNewDesignation(e.target.value)}
           error={!!newDesignationError}
           helperText={newDesignationError}
           sx={{ mt: 1 }}
           InputProps={{
             startAdornment: (
               <InputAdornment position="start">
                 <Badge />
               </InputAdornment>
             ),
           }}
         />
       </DialogContent>
       <DialogActions sx={{ px: 3, pb: 2 }}>
         <Button onClick={handleCloseDialog} color="primary">
           Cancel
         </Button>
         <Button
           onClick={handleAddDesignation}
           variant="contained"
           color="primary"
           startIcon={<Add />}
         >
           Add Designation
         </Button>
       </DialogActions>
     </Dialog>

     {/* AddDetailsDialog - This will open automatically after successful employee creation */}
     <AddDetailsDialog
       open={isDetailsDialogOpen}
       onClose={closeDetailsDialog}
       employee={currentEmployee}
     />
   </>
 );
};

export default AddEmployeeDrawer;