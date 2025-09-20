// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Rating,
//   Button,
//   Grid,
//   Divider,
//   Alert,
//   CircularProgress,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { base_emp } from '../../http/services';
// import CloseIcon from '@mui/icons-material/Close';

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   margin: theme.spacing(2, 'auto'),
//   maxWidth: 800,
//   borderRadius: theme.spacing(2),
//   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
// }));

// const SectionTitle = styled(Typography)(({ theme }) => ({
//   fontWeight: 600,
//   marginBottom: theme.spacing(2),
//   color: theme.palette.primary.main,
// }));

// const PrespectiveForm = ({ 
//   onSubmit, 
//   onClose, 
//   open = true,
//   data,
//   selectedEmployee = null,
//   perspectiveId = null
// }) => {

//   console.log('Form received data:', data);

//   const [formData, setFormData] = useState({
//     // Use data from the API response directly - don't override with localStorage or selectedEmployee
//     takerEmpCode: data?.takerEmpCode || '',
//     takerName: data?.takerName || '',
//     takerEmail: data?.takerEmail || '',
//     giverEmpCode: data?.giverEmpCode || '',
//     giverName: data?.giverName || '',
//     giverEmail: data?.giverEmail || '',
    
//     // Performance ratings (default to 0 if not provided)
//     collaboration: data?.collaboration || 0,
//     initiative: data?.initiative || 0,
//     communication: data?.communication || 0,
//     leadership: data?.leadership || 0,
//     stress: data?.stress || 0,
//     learning: data?.learning || 0,
//     developmentPlan: data?.developmentPlan || 0,
//     aspiration: data?.aspiration || 0,
    
//     // Comments (handle null values)
//     collaborationCom: data?.collaborationCom || '',
//     initiativeCom: data?.initiativeCom || '',
//     communicationCom: data?.communicationCom || '',
//     leadershipCom: data?.leadershipCom || '',
//     stressCom: data?.stressCom || '',
//     learningCom: data?.learningCom || '',
//     developmentPlanCom: data?.developmentPlanCom || '',
//     aspirationCom: data?.aspirationCom || '',
    
//     // Other fields
//     organizationCode: data?.organizationCode || localStorage.getItem('organizationCode') || '',
//     prespectiveId: data?.prespectiveId || data?.perspectiveId || '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const [isEditMode, setIsEditMode] = useState(false);

//   // Function to fetch and filter perspective data by ID
//   const fetchPerspectiveData = async (empCode, perspectiveId) => {
//     setLoadingData(true);
//     setError('');
//     try {
//       console.log('Fetching data for empCode:', empCode, 'perspectiveId:', perspectiveId);
      
//       const response = await axios.get(
//         `${base_emp}/emp-handler/prespective/get-all-prespective-of-taker?empCode=${empCode}`
//       );
      
//       if (response.status === 200 && response.data) {
//         let perspectives = [];
//         if (response.data.result && Array.isArray(response.data.result)) {
//           perspectives = response.data.result;
//         } else if (Array.isArray(response.data)) {
//           perspectives = response.data;
//         } else if (response.data.result) {
//           perspectives = [response.data.result];
//         } else {
//           perspectives = [response.data];
//         }
        
//         console.log('All perspectives:', perspectives);
        
//         const targetPerspective = perspectives.find(
//           perspective => 
//             perspective.prespectiveId === perspectiveId || 
//             perspective.perspectiveId === perspectiveId || 
//             perspective.id === perspectiveId
//         );

//         console.log('Found target perspective:', targetPerspective);

//         if (targetPerspective) {
//           // Use the fetched data directly - don't override giver/taker info
//           setFormData({
//             takerEmpCode: targetPerspective.takerEmpCode || '',
//             takerName: targetPerspective.takerName || '',
//             takerEmail: targetPerspective.takerEmail || '',
//             giverEmpCode: targetPerspective.giverEmpCode || '',
//             giverName: targetPerspective.giverName || '',
//             giverEmail: targetPerspective.giverEmail || '',
            
//             collaboration: targetPerspective.collaboration || 0,
//             initiative: targetPerspective.initiative || 0,
//             communication: targetPerspective.communication || 0,
//             leadership: targetPerspective.leadership || 0,
//             stress: targetPerspective.stress || 0,
//             learning: targetPerspective.learning || 0,
//             developmentPlan: targetPerspective.developmentPlan || 0,
//             aspiration: targetPerspective.aspiration || 0,
            
//             collaborationCom: targetPerspective.collaborationCom || '',
//             initiativeCom: targetPerspective.initiativeCom || '',
//             communicationCom: targetPerspective.communicationCom || '',
//             leadershipCom: targetPerspective.leadershipCom || '',
//             stressCom: targetPerspective.stressCom || '',
//             learningCom: targetPerspective.learningCom || '',
//             developmentPlanCom: targetPerspective.developmentPlanCom || '',
//             aspirationCom: targetPerspective.aspirationCom || '',
            
//             organizationCode: targetPerspective.organizationCode || localStorage.getItem('organizationCode') || '',
//             prespectiveId: targetPerspective.prespectiveId || targetPerspective.perspectiveId || perspectiveId,
//           });
//           setIsEditMode(true);
//         } else {
//           setError(`Perspective not found with ID: ${perspectiveId}`);
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching perspective data:', err);
//       setError('Failed to load perspective data. Please try again.');
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   // Initialize form when data changes or dialog opens
//   useEffect(() => {
//     if (open && data) {
//       console.log('Initializing form with data:', data);
      
//       // Determine if this is edit mode based on having existing ratings or comments
//       const hasExistingData = data.collaboration > 0 || 
//                              data.initiative > 0 || 
//                              data.communication > 0 || 
//                              data.leadership > 0 || 
//                              data.stress > 0 || 
//                              data.learning > 0 || 
//                              data.developmentPlan > 0 || 
//                              data.aspiration > 0 ||
//                              data.collaborationCom ||
//                              data.initiativeCom ||
//                              data.communicationCom ||
//                              data.leadershipCom ||
//                              data.stressCom ||
//                              data.learningCom ||
//                              data.developmentPlanCom ||
//                              data.aspirationCom;
      
//       setIsEditMode(hasExistingData);
      
//       // Set form data directly from the provided data - no overriding
//       setFormData({
//         takerEmpCode: data.takerEmpCode || '',
//         takerName: data.takerName || '',
//         takerEmail: data.takerEmail || '',
//         giverEmpCode: data.giverEmpCode || '',
//         giverName: data.giverName || '',
//         giverEmail: data.giverEmail || '',
        
//         collaboration: data.collaboration || 0,
//         initiative: data.initiative || 0,
//         communication: data.communication || 0,
//         leadership: data.leadership || 0,
//         stress: data.stress || 0,
//         learning: data.learning || 0,
//         developmentPlan: data.developmentPlan || 0,
//         aspiration: data.aspiration || 0,
        
//         collaborationCom: data.collaborationCom || '',
//         initiativeCom: data.initiativeCom || '',
//         communicationCom: data.communicationCom || '',
//         leadershipCom: data.leadershipCom || '',
//         stressCom: data.stressCom || '',
//         learningCom: data.learningCom || '',
//         developmentPlanCom: data.developmentPlanCom || '',
//         aspirationCom: data.aspirationCom || '',
        
//         organizationCode: data.organizationCode || localStorage.getItem('organizationCode') || '',
//         prespectiveId: data.prespectiveId || data.perspectiveId || '',
//       });
//     }
//   }, [open, data]);

//   // Reset states when dialog opens/closes
//   useEffect(() => {
//     if (open) {
//       setSuccess(false);
//       setError('');
//     } else {
//       // Reset form when closing
//       setFormData({
//         takerEmpCode: '',
//         takerName: '',
//         takerEmail: '',
//         giverEmpCode: '',
//         giverName: '',
//         giverEmail: '',
//         collaboration: 0,
//         initiative: 0,
//         communication: 0,
//         leadership: 0,
//         stress: 0,
//         learning: 0,
//         developmentPlan: 0,
//         aspiration: 0,
//         collaborationCom: '',
//         initiativeCom: '',
//         communicationCom: '',
//         leadershipCom: '',
//         stressCom: '',
//         learningCom: '',
//         developmentPlanCom: '',
//         aspirationCom: '',
//         organizationCode: localStorage.getItem('organizationCode') || '',
//         prespectiveId: '',
//       });
//       setIsEditMode(false);
//       setLoadingData(false);
//     }
//   }, [open]);

//   const handleInputChange = (field) => (event) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: event.target.value
//     }));
//   };

//   const handleRatingChange = (field) => (event, newValue) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: newValue || 0
//     }));
//   };

//   const validateForm = () => {
//     const requiredFields = ['takerEmpCode', 'takerName', 'takerEmail', 'giverEmpCode', 'giverName', 'giverEmail', 'organizationCode'];
//     const requiredRatings = ['collaboration', 'initiative', 'communication', 'leadership', 'stress', 'learning', 'developmentPlan', 'aspiration'];
    
//     for (let field of requiredFields) {
//       if (!formData[field]?.toString().trim()) {
//         return `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
//       }
//     }
    
//     for (let field of requiredRatings) {
//       if (formData[field] === 0) {
//         return `Please provide a rating for ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
//       }
//     }
    
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.takerEmail)) {
//       return 'Please enter a valid taker email';
//     }
//     if (!emailRegex.test(formData.giverEmail)) {
//       return 'Please enter a valid giver email';
//     }
    
//     return null;
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
    
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);
//     setError('');
    
//     try {
//       console.log('Submitting form data:', formData);
      
//       const response = await axios.post(
//         `${base_emp}/emp-handler/prespective/add-prespective-of-emp`, 
//         formData, 
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setSuccess(true);
        
//         if (onSubmit) {
//           onSubmit(formData, isEditMode);
//         }
        
//         setTimeout(() => {
//           setSuccess(false);
//           if (onClose) onClose();
//         }, 1500);
//       }
//     } catch (err) {
//       console.error('Submit error:', err);
//       if (err.response) {
//         setError(`Error: ${err.response.data?.message || 'Server error occurred'}`);
//       } else if (err.request) {
//         setError('Network error: Unable to connect to server');
//       } else {
//         setError('An unexpected error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Grouped rating + comment fields
//   const performanceAreas = [
//     { key: 'collaboration', label: 'Collaboration & Teamwork', commentKey: 'collaborationCom' },
//     { key: 'initiative', label: 'Initiative & Innovation', commentKey: 'initiativeCom' },
//     { key: 'communication', label: 'Communication Skills', commentKey: 'communicationCom' },
//     { key: 'leadership', label: 'Leadership Qualities', commentKey: 'leadershipCom' },
//     { key: 'stress', label: 'Stress & Time Management', commentKey: 'stressCom' },
//     { key: 'learning', label: 'Learning & Growth', commentKey: 'learningCom' },
//     { key: 'developmentPlan', label: 'Development Plan', commentKey: 'developmentPlanCom' },
//     { key: 'aspiration', label: 'Career Aspiration', commentKey: 'aspirationCom' }
//   ];

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         <Typography variant="h6" component="div">
//           {isEditMode ? 'Edit Employee Perspective Assessment' : 'Employee Perspective Assessment'}
//           {formData.takerName && (
//             <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
//               For: {formData.takerName} ({formData.takerEmpCode})
//             </Typography>
//           )}
//           {formData.giverName && (
//             <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
//               By: {formData.giverName} ({formData.giverEmpCode})
//             </Typography>
//           )}
//           {formData.prespectiveId && (
//             <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
//               Perspective ID: {formData.prespectiveId}
//             </Typography>
//           )}
//         </Typography>
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{ position: 'absolute', right: 8, top: 8 }}
//           disabled={loadingData}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent dividers sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
//         {loadingData && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
//             <CircularProgress size={48} />
//             <Typography variant="body1" sx={{ ml: 2 }}>
//               Loading perspective data...
//             </Typography>
//           </Box>
//         )}
        
//         {!loadingData && (
//           <>
//             {success && (
//               <Alert severity="success" sx={{ mb: 3 }}>
//                 Perspective assessment {isEditMode ? 'updated' : 'submitted'} successfully for {formData.takerName}!
//               </Alert>
//             )}
//             {error && (
//               <Alert severity="error" sx={{ mb: 3 }}>
//                 {error}
//               </Alert>
//             )}
            
//             <form onSubmit={handleFormSubmit}>
//               {/* Employee Being Assessed Section */}
//               <SectionTitle variant="h6">Employee Being Assessed</SectionTitle>
//               <Grid container spacing={3} sx={{ mb: 4 }}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Employee Code *"
//                     value={formData.takerEmpCode}
//                     onChange={handleInputChange('takerEmpCode')}
//                     variant="outlined"
//                     InputProps={{
//                       readOnly: true, // Read-only since it comes from API data
//                     }}
//                     sx={{ 
//                       '& .MuiOutlinedInput-root': { 
//                         backgroundColor: 'grey.50' 
//                       } 
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Employee Name *"
//                     value={formData.takerName}
//                     onChange={handleInputChange('takerName')}
//                     variant="outlined"
//                     InputProps={{
//                       readOnly: true, // Read-only since it comes from API data
//                     }}
//                     sx={{ 
//                       '& .MuiOutlinedInput-root': { 
//                         backgroundColor: 'grey.50' 
//                       } 
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Employee Email *"
//                     type="email"
//                     value={formData.takerEmail}
//                     onChange={handleInputChange('takerEmail')}
//                     variant="outlined"
//                     InputProps={{
//                       readOnly: true, // Read-only since it comes from API data
//                     }}
//                     sx={{ 
//                       '& .MuiOutlinedInput-root': { 
//                         backgroundColor: 'grey.50' 
//                       } 
//                     }}
//                   />
//                 </Grid>
//               </Grid>

//               {/* Reviewer Information Section */}
//               <SectionTitle variant="h6">Reviewer Information</SectionTitle>
//               <Grid container spacing={3} sx={{ mb: 4 }}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Reviewer Employee Code *"
//                     value={formData.giverEmpCode}
//                     onChange={handleInputChange('giverEmpCode')}
//                     variant="outlined"
//                     InputProps={{
//                       readOnly: true, // Read-only since it comes from API data
//                     }}
//                     sx={{ 
//                       '& .MuiOutlinedInput-root': { 
//                         backgroundColor: 'grey.50' 
//                       } 
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Reviewer Name *"
//                     value={formData.giverName}
//                     onChange={handleInputChange('giverName')}
//                     variant="outlined"
//                     InputProps={{
//                       readOnly: true, // Read-only since it comes from API data
//                     }}
//                     sx={{ 
//                       '& .MuiOutlinedInput-root': { 
//                         backgroundColor: 'grey.50' 
//                       } 
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Reviewer Email *"
//                     type="email"
//                     value={formData.giverEmail}
//                     onChange={handleInputChange('giverEmail')}
//                     variant="outlined"
//                     InputProps={{
//                       readOnly: true, // Read-only since it comes from API data
//                     }}
//                     sx={{ 
//                       '& .MuiOutlinedInput-root': { 
//                         backgroundColor: 'grey.50' 
//                       } 
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Organization Code *"
//                     value={formData.organizationCode}
//                     onChange={handleInputChange('organizationCode')}
//                     variant="outlined"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Perspective ID"
//                     value={formData.prespectiveId}
//                     onChange={handleInputChange('prespectiveId')}
//                     variant="outlined"
//                     InputProps={{
//                       readOnly: true, // Read-only since it comes from API data
//                     }}
//                     sx={{ 
//                       '& .MuiOutlinedInput-root': { 
//                         backgroundColor: 'grey.50' 
//                       } 
//                     }}
//                     helperText="Auto-generated perspective ID"
//                   />
//                 </Grid>
//               </Grid>

//               <Divider sx={{ my: 4 }} />

//               {/* Rating Section */}
//               <SectionTitle variant="h6">Performance Ratings</SectionTitle>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//                 Please rate each aspect on a scale of 1-5 stars and provide your comments
//               </Typography>

//               <Grid container spacing={3}>
//                 {performanceAreas.map(({ key, label, commentKey }) => (
//                   <Grid item xs={12} key={key}>
//                     <Box sx={{ 
//                       p: 2, 
//                       border: '1px solid', 
//                       borderColor: 'divider', 
//                       borderRadius: 2,
//                       backgroundColor: 'background.paper'
//                     }}>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
//                         {label} *
//                       </Typography>
//                       <Grid container spacing={2} alignItems="flex-start">
//                         <Grid item xs={12} md={4}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                             <Rating
//                               value={formData[key]}
//                               onChange={handleRatingChange(key)}
//                               size="large"
//                             />
//                             <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
//                               {formData[key]}/5
//                             </Typography>
//                           </Box>
//                         </Grid>
//                         <Grid item xs={12} md={8}>
//                           <TextField
//                             fullWidth
//                             label={`Comments for ${label}`}
//                             multiline
//                             rows={2}
//                             value={formData[commentKey]}
//                             onChange={handleInputChange(commentKey)}
//                             variant="outlined"
//                             placeholder={`Share your thoughts on ${label.toLowerCase()}...`}
//                           />
//                         </Grid>
//                       </Grid>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>

//               {/* Submit Button */}
//               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
//                 <Button
//                   variant="outlined"
//                   size="large"
//                   onClick={onClose}
//                   disabled={loading}
//                   sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 600 }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   size="large"
//                   disabled={loading}
//                   sx={{ 
//                     px: 6, 
//                     py: 1.5, 
//                     borderRadius: 2, 
//                     fontWeight: 600, 
//                     fontSize: '1.1rem', 
//                     minWidth: 200,
//                     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
//                     '&:hover': {
//                       background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
//                     }
//                   }}
//                 >
//                   {loading ? (
//                     <>
//                       <CircularProgress size={24} sx={{ mr: 2, color: 'white' }} />
//                       {isEditMode ? 'Updating...' : 'Submitting...'}
//                     </>
//                   ) : (
//                     isEditMode ? 'Update Assessment' : 'Submit Assessment'
//                   )}
//                 </Button>
//               </Box>
//             </form>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PrespectiveForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Rating,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { base_emp } from '../../http/services';
import CloseIcon from '@mui/icons-material/Close';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2, 'auto'),
  maxWidth: 800,
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const PrespectiveForm = ({
  onSubmit,
  onClose,
  open = true,
  data,
  selectedEmployee = null,
  perspectiveId = null
}) => {
  // initial form state, including the two new fields
  const [formData, setFormData] = useState({
    takerEmpCode: data?.takerEmpCode || '',
    takerName:    data?.takerName    || '',
    takerEmail:   data?.takerEmail   || '',
    giverEmpCode: data?.giverEmpCode || '',
    giverName:    data?.giverName    || '',
    giverEmail:   data?.giverEmail   || '',
    collaboration:    data?.collaboration    || 0,
    initiative:       data?.initiative       || 0,
    communication:    data?.communication    || 0,
    leadership:       data?.leadership       || 0,
    stress:           data?.stress           || 0,
    learning:         data?.learning         || 0,
    developmentPlan:  data?.developmentPlan  || 0,
    aspiration:       data?.aspiration       || 0,
    collaborationCom:    data?.collaborationCom    || '',
    initiativeCom:       data?.initiativeCom       || '',
    communicationCom:    data?.communicationCom    || '',
    leadershipCom:       data?.leadershipCom       || '',
    stressCom:           data?.stressCom           || '',
    learningCom:         data?.learningCom         || '',
    developmentPlanCom:  data?.developmentPlanCom  || '',
    aspirationCom:       data?.aspirationCom       || '',
    organizationCode: data?.organizationCode || localStorage.getItem('organizationCode') || '',
    prespectiveId:    data?.prespectiveId   || data?.perspectiveId || '',
    overAllPossitive: data?.overAllPossitive || '',  // ← added
    overAllNegative:  data?.overAllNegative  || ''   // ← added
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // fetch all perspectives for the taker, then pick the one with matching ID
  const fetchPerspectiveData = async (empCode, perspectiveId) => {
    setLoadingData(true);
    setError('');
    try {
      const response = await axios.get(
        `${base_emp}/emp-handler/prespective/get-all-prespective-of-taker?empCode=${empCode}`
      );
      if (response.status === 200 && response.data) {
        // normalize array
        let perspectives = [];
        if (Array.isArray(response.data.result)) {
          perspectives = response.data.result;
        } else if (Array.isArray(response.data)) {
          perspectives = response.data;
        } else if (response.data.result) {
          perspectives = [response.data.result];
        } else {
          perspectives = [response.data];
        }

        const target = perspectives.find(p =>
          p.prespectiveId === perspectiveId ||
          p.perspectiveId === perspectiveId ||
          p.id === perspectiveId
        );

        if (target) {
          setFormData({
            takerEmpCode: target.takerEmpCode || '',
            takerName:    target.takerName    || '',
            takerEmail:   target.takerEmail   || '',
            giverEmpCode: target.giverEmpCode || '',
            giverName:    target.giverName    || '',
            giverEmail:   target.giverEmail   || '',
            collaboration:    target.collaboration    || 0,
            initiative:       target.initiative       || 0,
            communication:    target.communication    || 0,
            leadership:       target.leadership       || 0,
            stress:           target.stress           || 0,
            learning:         target.learning         || 0,
            developmentPlan:  target.developmentPlan  || 0,
            aspiration:       target.aspiration       || 0,
            collaborationCom:    target.collaborationCom    || '',
            initiativeCom:       target.initiativeCom       || '',
            communicationCom:    target.communicationCom    || '',
            leadershipCom:       target.leadershipCom       || '',
            stressCom:           target.stressCom           || '',
            learningCom:         target.learningCom         || '',
            developmentPlanCom:  target.developmentPlanCom  || '',
            aspirationCom:       target.aspirationCom       || '',
            organizationCode: target.organizationCode || localStorage.getItem('organizationCode') || '',
            prespectiveId:    target.prespectiveId  || target.perspectiveId || perspectiveId,
            overAllPossitive: target.overAllPossitive || '', // ← added
            overAllNegative:  target.overAllNegative  || ''   // ← added
          });
          setIsEditMode(true);
        } else {
          setError(`Perspective not found with ID: ${perspectiveId}`);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load perspective data. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  // initialize or fetch based on incoming props
  useEffect(() => {
    if (open && data) {
      // detect edit mode if any rating/comment exists
      const hasData =
        data.collaboration > 0 ||
        data.initiative > 0 ||
        data.communication > 0 ||
        data.leadership > 0 ||
        data.stress > 0 ||
        data.learning > 0 ||
        data.developmentPlan > 0 ||
        data.aspiration > 0 ||
        data.collaborationCom ||
        data.initiativeCom ||
        data.communicationCom ||
        data.leadershipCom ||
        data.stressCom ||
        data.learningCom ||
        data.developmentPlanCom ||
        data.aspirationCom;
      setIsEditMode(hasData);

      // if they passed perspectiveId, fetch full object
      if (perspectiveId) {
        fetchPerspectiveData(data.takerEmpCode, perspectiveId);
      } else {
        // otherwise just seed formData from data prop
        setFormData(prev => ({
          ...prev,
          takerEmpCode: data.takerEmpCode || '',
          takerName:    data.takerName    || '',
          takerEmail:   data.takerEmail   || '',
          giverEmpCode: data.giverEmpCode || '',
          giverName:    data.giverName    || '',
          giverEmail:   data.giverEmail   || '',
          collaboration:    data.collaboration    || 0,
          initiative:       data.initiative       || 0,
          communication:    data.communication    || 0,
          leadership:       data.leadership       || 0,
          stress:           data.stress           || 0,
          learning:         data.learning         || 0,
          developmentPlan:  data.developmentPlan  || 0,
          aspiration:       data.aspiration       || 0,
          collaborationCom:    data.collaborationCom    || '',
          initiativeCom:       data.initiativeCom       || '',
          communicationCom:    data.communicationCom    || '',
          leadershipCom:       data.leadershipCom       || '',
          stressCom:           data.stressCom           || '',
          learningCom:         data.learningCom         || '',
          developmentPlanCom:  data.developmentPlanCom  || '',
          aspirationCom:       data.aspirationCom       || '',
          organizationCode: data.organizationCode || localStorage.getItem('organizationCode') || '',
          prespectiveId:    data.prespectiveId  || data.perspectiveId || '',
          overAllPossitive: data.overAllPossitive || '', // ← added
          overAllNegative:  data.overAllNegative  || ''   // ← added
        }));
      }
    }
  }, [open, data, perspectiveId]);

  // reset on close
  useEffect(() => {
    if (!open) {
      setFormData({
        takerEmpCode: '',
        takerName:    '',
        takerEmail:   '',
        giverEmpCode: '',
        giverName:    '',
        giverEmail:   '',
        collaboration:    0,
        initiative:       0,
        communication:    0,
        leadership:       0,
        stress:           0,
        learning:         0,
        developmentPlan:  0,
        aspiration:       0,
        collaborationCom:    '',
        initiativeCom:       '',
        communicationCom:    '',
        leadershipCom:       '',
        stressCom:           '',
        learningCom:         '',
        developmentPlanCom:  '',
        aspirationCom:       '',
        organizationCode: localStorage.getItem('organizationCode') || '',
        prespectiveId:    '',
        overAllPossitive: '',
        overAllNegative:  ''
      });
      setIsEditMode(false);
      setLoadingData(false);
      setError('');
      setSuccess(false);
    }
  }, [open]);

  // generic handlers
  const handleInputChange = field => e =>
    setFormData(p => ({ ...p, [field]: e.target.value }));
  const handleRatingChange = field => (_, value) =>
    setFormData(p => ({ ...p, [field]: value || 0 }));

  // basic validation
  const validateForm = () => {
    const requiredFields = [
      'takerEmpCode','takerName','takerEmail',
      'giverEmpCode','giverName','giverEmail',
      'organizationCode'
    ];
    const requiredRatings = [
      'collaboration','initiative','communication',
      'leadership','stress','learning',
      'developmentPlan','aspiration'
    ];
    for (let f of requiredFields) {
      if (!formData[f]?.toString().trim())
        return `${f.replace(/([A-Z])/g,' $1').toLowerCase()} is required`;
    }
    for (let f of requiredRatings) {
      if (formData[f] === 0)
        return `Please provide a rating for ${f.replace(/([A-Z])/g,' $1').toLowerCase()}`;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(formData.takerEmail))
      return 'Please enter a valid taker email';
    if (!emailRx.test(formData.giverEmail))
      return 'Please enter a valid giver email';
    return null;
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${base_emp}/emp-handler/prespective/add-prespective-of-emp`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        onSubmit?.(formData, isEditMode);
        setTimeout(() => {
          setSuccess(false);
          onClose?.();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(`Error: ${err.response.data?.message || 'Server error'}`);
      } else if (err.request) {
        setError('Network error: Unable to connect');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const performanceAreas = [
    { key: 'collaboration', label: 'Collaboration & Teamwork', commentKey: 'collaborationCom' },
    { key: 'initiative',    label: 'Initiative & Innovation', commentKey: 'initiativeCom'    },
    { key: 'communication', label: 'Communication Skills',      commentKey: 'communicationCom' },
    { key: 'leadership',    label: 'Leadership Qualities',      commentKey: 'leadershipCom'    },
    { key: 'stress',        label: 'Stress & Time Management', commentKey: 'stressCom'        },
    { key: 'learning',      label: 'Learning & Growth',         commentKey: 'learningCom'      },
    { key: 'developmentPlan', label: 'Development Plan',        commentKey: 'developmentPlanCom' },
    { key: 'aspiration',    label: 'Career Aspiration',         commentKey: 'aspirationCom'    }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {isEditMode ? 'Edit Employee Perspective Assessment'
                      : 'Employee Perspective Assessment'}
          {formData.takerName && (
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: .5 }}>
              For: {formData.takerName} ({formData.takerEmpCode})
            </Typography>
          )}
          {formData.giverName && (
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: .5 }}>
              By: {formData.giverName} ({formData.giverEmpCode})
            </Typography>
          )}
          {formData.prespectiveId && (
            <Typography variant="caption" color="primary" sx={{ mt: .5, display: 'block' }}>
              Perspective ID: {formData.prespectiveId}
            </Typography>
          )}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          disabled={loadingData}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {loadingData ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200
          }}>
            <CircularProgress size={48} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading perspective data...
            </Typography>
          </Box>
        ) : (
          <>
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Perspective assessment {isEditMode ? 'updated' : 'submitted'} successfully for {formData.takerName}!
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleFormSubmit}>
              <SectionTitle variant="h6">Employee Being Assessed</SectionTitle>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee Code *"
                    value={formData.takerEmpCode}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'grey.50' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee Name *"
                    value={formData.takerName}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'grey.50' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee Email *"
                    type="email"
                    value={formData.takerEmail}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'grey.50' } }}
                  />
                </Grid>
              </Grid>

              <SectionTitle variant="h6">Reviewer Information</SectionTitle>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Reviewer Employee Code *"
                    value={formData.giverEmpCode}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'grey.50' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Reviewer Name *"
                    value={formData.giverName}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'grey.50' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Reviewer Email *"
                    type="email"
                    value={formData.giverEmail}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'grey.50' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Organization Code *"
                    value={formData.organizationCode}
                    onChange={handleInputChange('organizationCode')}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Perspective ID"
                    value={formData.prespectiveId}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'grey.50' } }}
                    helperText="Auto-generated perspective ID"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <SectionTitle variant="h6">Performance Ratings</SectionTitle>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please rate each aspect on a scale of 1-5 stars and provide your comments
              </Typography>
              <Grid container spacing={3}>
                {performanceAreas.map(({ key, label, commentKey }) => (
                  <Grid item xs={12} key={key}>
                    <Box sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      backgroundColor: 'background.paper'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        {label} *
                      </Typography>
                      <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Rating
                              value={formData[key]}
                              onChange={handleRatingChange(key)}
                              size="large"
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {formData[key]}/5
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth
                            label={`Comments for ${label}`}
                            multiline
                            rows={2}
                            value={formData[commentKey]}
                            onChange={handleInputChange(commentKey)}
                            variant="outlined"
                            placeholder={`Share your thoughts on ${label.toLowerCase()}...`}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 4 }} />

              <SectionTitle variant="h6">Overall Feedback</SectionTitle>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Overall Positive Feedback"
                    multiline
                    rows={3}
                    value={formData.overAllPossitive}                // ← added
                    onChange={handleInputChange('overAllPossitive')} // ← added
                    variant="outlined"
                    placeholder="Highlight strengths and positive aspects..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Overall Negative Feedback"
                    multiline
                    rows={3}
                    value={formData.overAllNegative}                 // ← added
                    onChange={handleInputChange('overAllNegative')}  // ← added
                    variant="outlined"
                    placeholder="Areas for improvement or concerns..."
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onClose}
                  disabled={loading}
                  sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 600 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    minWidth: 200,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)'
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 2, color: 'white' }} />
                      {isEditMode ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Assessment' : 'Submit Assessment'
                  )}
                </Button>
              </Box>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrespectiveForm;
