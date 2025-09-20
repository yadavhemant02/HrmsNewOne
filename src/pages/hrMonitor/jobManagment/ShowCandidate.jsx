import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Chip, 
  Stack, 
  styled, 
  Typography,
  Box as MuiBox,
  CircularProgress,
  Button,
  Grid,
  Avatar,
  Container,
  Drawer,
  TextField,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  InputAdornment,
  Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Building2,
  Eye,
  Calendar,
  X as CloseIcon
} from 'lucide-react';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { base_candidate, base_hr, base_identity } from '../../../http/services';

// Styled Components (same as before)
const WelcomeCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    transform: 'translate(50%, -50%)',
  },
}));

const InfoChip = styled(Chip)({
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: 'white',
  '& .MuiChip-icon': {
    color: 'white',
  },
});

const CandidateChip = styled(Chip)({
  backgroundColor: 'rgba(26, 35, 126, 0.1)',
  '& .MuiChip-icon': {
    color: '#1a237e',
  },
});

const CandidateCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
}));

const ViewButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1a237e',
  color: 'white',
  '&:hover': {
    backgroundColor: '#0d47a1',
  },
  borderRadius: '8px',
  textTransform: 'none',
  padding: '8px 16px',
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#1a237e',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1a237e',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1a237e',
  },
});

// Helper Functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Enhanced InterviewerSelect Component
const InterviewerSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  employeeEmails, 
  required = false 
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredEmails, setFilteredEmails] = useState(employeeEmails);

  const handleSearch = (event) => {
    const text = event.target.value.toLowerCase();
    setSearchText(text);
    const filtered = employeeEmails.filter(email => 
      email.value.toLowerCase().includes(text)
    );
    setFilteredEmails(filtered);
  };

  return (
    <StyledTextField
      select
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            style: {
              maxHeight: 224
            }
          }
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    >
      <MenuItem style={{ padding: '8px' }}>
        <TextField
          size="small"
          placeholder="Search interviewer..."
          fullWidth
          value={searchText}
          onChange={handleSearch}
          onClick={(e) => e.stopPropagation()}
        />
      </MenuItem>
      {filteredEmails.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.value}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

// Interview Scheduler Component
const InterviewScheduler = ({ open, onClose, candidateData }) => {

  console.log(candidateData,"lllllllllll");
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const [formData, setFormData] = useState({
    candidateId: '',
    jobId: '',
    candidateName: '',
    candidateEmail: '',
    noOfYearExperince: '',
    designation: candidateData?.designation,
    candidateLocation: '',
    meetingLink: '',
    interviewer1: '',
    interviewer2: '',
    interviewer3: '',
    date: '',
    time: '',
    address:'',
    organizationName:localStorage.getItem('organizationName'),
	 organizationCode: localStorage.getItem('organizationCode')
  });
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const fetchEmployeeEmails = async () => {
    try {
      const response = await axios.get(`${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem('organizationCode')}`);
      const emails = response.data.map((employee) => ({
        value: employee.email,
      }));
      setEmployeeEmails(emails);
    } catch (error) {
      console.error("Error fetching employee emails:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeEmails();
    if (candidateData) {
      setFormData(prev => ({
        ...prev,
        candidateId: candidateData.candidateId || '',
        jobId: candidateData.jobId || '',
        candidateName: candidateData.name || '',
        noOfYearExperince: candidateData.overAllExperience || '',
        candidateEmail:candidateData.email,
        designation:candidateData.designation,
        address:candidateData.address

      }));
    }
  }, [candidateData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add your API call here
      console.log("kkkkkkkkkkkkkkkkkkkkkkk")
      const response = await axios.post(`${base_hr}/hr-handler/interview/schedule-interview`, formData);
      console.log(response);
      setShowAlert(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error scheduling interview:', error);
    } finally {
      setLoading(false);
      window.location.reload()
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '600px' },
            p: 4,
            bgcolor: '#f9fafb'
          }
        }}
      >
        <MuiBox
          sx={{
            border: "1px solid rgba(26, 35, 126, 0.5)",
            borderRadius: "10px",
            padding: { xs: "20px", md: "20px" },
            marginTop: "50px",
            bgcolor: "white",
            height: "100%",
            overflowY: "auto"
          }}
        >
          <Typography
            variant="h4"
            component="p"
            sx={{
              fontFamily: "inherit",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "#1a237e",
              fontWeight: "bold"
            }}
          >
            Schedule New Interview
            <IconButton 
              onClick={onClose}
              sx={{ 
                position: 'absolute',
                right: '40px',
                top: '40px',
                '&:hover': { bgcolor: 'rgba(26, 35, 126, 0.1)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Candidate ID"
                  required
                  name="candidateId"
                  value={formData.candidateId}
                  onChange={handleChange}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Job ID"
                  required
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleChange}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Candidate Name"
                  required
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleChange}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                 disabled
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  name="candidateEmail"
                  value={formData.candidateEmail}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Years of Experience"
                  required
                  name="noOfYearExperince"
                  value={formData.noOfYearExperince}
                  onChange={handleChange}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Designation"
                  required
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </Grid>

              {/* Location & Meeting Details */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 600,
                    mt: 2,
                    mb: 2
                  }}
                >
                  Location & Meeting Details
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Location"
                  required
                  name="candidateLocation"
                  value={formData.candidateLocation}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Meeting Link"
                  required
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                />
              </Grid>

              {/* Interview Panel */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 600,
                    mt: 2,
                    mb: 2
                  }}
                >
                  Interview Panel
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <InterviewerSelect
                  label="Interviewer 1"
                  name="interviewer1"
                  value={formData.interviewer1}
                  onChange={handleChange}
                  employeeEmails={employeeEmails}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <InterviewerSelect
                  label="Interviewer 2"
                  name="interviewer2"
                  value={formData.interviewer2}
                  onChange={handleChange}
                  employeeEmails={employeeEmails}
                />
              </Grid>

              <Grid item xs={12}>
                <InterviewerSelect
                  label="Interviewer 3"
                  name="interviewer3"
                  value={formData.interviewer3}
                  onChange={handleChange}
                  employeeEmails={employeeEmails}
                />
              </Grid>

              {/* Schedule */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1a237e',
                    fontWeight: 600,
                    mt: 2,
                    mb: 2
                  }}
                >
                  Schedule
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Date"
                  type="date"
                  required
                  name="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Time"
                  type="time"
                  required
                  name="time"
                  InputLabelProps={{ shrink: true }}
                  value={formData.time}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 3,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: '#1a237e',
                    '&:hover': { bgcolor: '#0d47a1' },
                    fontSize: '1.1rem',
                    textTransform: 'none'
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Schedule Interview'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </MuiBox>
      </Drawer>

      <Snackbar 
        open={showAlert} 
        autoHideDuration={6000} 
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Interview scheduled successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

// Job Details Section Component
const JobDetailsSection = ({ jobData }) => (
  <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <MuiBox>
      <Typography variant="h4" fontWeight="600" sx={{ mb: 2 }}>
        {jobData.jobTittel}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
        Job ID: {jobData.jobId}
      </Typography>
    </MuiBox>

    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
      <InfoChip
        icon={<MapPin size={16} />}
        label={jobData.jobLocation}
      />
      <InfoChip
        icon={<Building2 size={16} />}
        label={jobData.workEnvironment}
      />
      <InfoChip
        icon={<Clock size={16} />}
        label={jobData.experince}
      />
      <InfoChip
        icon={<Users size={16} />}
        label={jobData.team}
      />
      <InfoChip
        icon={<Briefcase size={16} />}
        label={jobData.jobType}
      />
    </Stack>

    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <InfoChip
        label={`Status: ${jobData.status}`}
        sx={{
          backgroundColor: jobData.status === 'active' 
            ? 'rgba(76, 175, 80, 0.2)' 
            : 'rgba(244, 67, 54, 0.2)',
          color: jobData.status === 'active'
            ? '#2e7d32'
            : '#d32f2f'
        }}
      />
      <InfoChip
        icon={<Calendar size={16} />}
        label={`Created: ${formatDate(jobData.createdAt)}`}
      />
    </Stack>
  </MuiBox>
);
const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'white',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
    },
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      '& fieldset': {
        borderColor: '#1a237e',
      },
    },
    '&.Mui-focused': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      '& fieldset': {
        borderColor: '#1a237e',
      },
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1a237e',
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
  },
}));

const CandidateSearch = ({ onSearch, totalCandidates }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <Box 
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '16px 0',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        transform: 'translateZ(0)', // Forces GPU acceleration
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          gap: 2,
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0 16px',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
          Applied Candidates ({totalCandidates})
        </Typography>
        
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px', marginLeft: 'auto' }}>
          <SearchTextField
            fullWidth
            placeholder="Search by name, ID or experience..."
            value={searchTerm}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search 
                    sx={{ 
                      color: searchTerm ? '#1a237e' : 'action.active',
                      transition: 'color 0.2s'
                    }} 
                  />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClear}
                    edge="end"
                    size="small"
                    aria-label="clear search"
                    sx={{ 
                      color: 'action.active',
                      '&:hover': {
                        color: '#1a237e',
                        backgroundColor: 'rgba(26, 35, 126, 0.04)'
                      }
                    }}
                  >
                    <CloseIcon size={18} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>
    </Box>
  );
};


// const CandidateSection = ({ candidates, onViewProfile, jobData }) => {
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [openScheduler, setOpenScheduler] = useState(false);
//   const [filteredCandidates, setFilteredCandidates] = useState(candidates);

//   const handleScheduleInterview = (candidate) => {
//     setSelectedCandidate(candidate);
//     setOpenScheduler(true);
//   };

//   const isButtonDisabled = (candidateId) => {
//     return jobData?.candidateIds?.includes(candidateId);
//   };

//   const handleSearch = (searchTerm) => {
//     if (!searchTerm.trim()) {
//       setFilteredCandidates(candidates);
//       return;
//     }
    
//     const searchTermLower = searchTerm.toLowerCase().trim();
//     const filtered = candidates.filter(candidate => 
//       candidate.candidateName?.toLowerCase().includes(searchTermLower) ||
//       candidate.candidateId?.toLowerCase().includes(searchTermLower) ||
//       candidate.candidateExp?.toString().includes(searchTermLower) ||
//       candidate.status?.toLowerCase().includes(searchTermLower)
//     );
//     setFilteredCandidates(filtered);
//   };

//   useEffect(() => {
//     setFilteredCandidates(candidates);
//   }, [candidates]);

//   return (
//     <MuiBox sx={{ mt: 4 }}>
//       {/* <Typography variant="h5" sx={{ mb: 3 }}>
//         Applied Candidates ({candidates.length})
//       </Typography> */}

//        <CandidateSearch 
//         onSearch={handleSearch}
//         totalCandidates={candidates.length}
//       />

//       <Grid container spacing={2}>
//         {filteredCandidates.map((candidate) => (
//           <Grid item xs={12} key={candidate.id}>
//             <CandidateCard>
//               <CardContent>
//                 <MuiBox sx={{ 
//                   display: 'flex', 
//                   justifyContent: 'space-between', 
//                   alignItems: 'center',
//                   flexWrap: 'wrap',
//                   gap: 2,
//                   color: 'black'
//                 }}>
//                   <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <Avatar
//                       sx={{
//                         bgcolor: '#1a237e',
//                         width: 48,
//                         height: 48,
//                       }}
//                     >
//                       {candidate.candidateName[0].toUpperCase()}
//                     </Avatar>
                    
//                     <MuiBox>
//                       <Typography variant="h6" sx={{ mb: 1 }}>
//                         {candidate.candidateName}
//                       </Typography>
                      
//                       <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                         <CandidateChip
//                           size="small"
//                           label={`ID: ${candidate.candidateId}`}
//                         />
//                         <CandidateChip
//                           size="small"
//                           icon={<Clock size={14} />}
//                           label={`${candidate.candidateExp} Years Exp`}
//                         />
//                         <CandidateChip
//                           size="small"
//                           icon={<Calendar size={14} />}
//                           label={`Applied: ${formatDate(candidate.applyDate)}`}
//                         />
//                         <CandidateChip
//                           size="small"
//                           label={candidate.status}
//                           sx={{
//                             backgroundColor: candidate.status === 'created' 
//                               ? 'rgba(76, 175, 80, 0.2)' 
//                               : 'rgba(244, 67, 54, 0.2)',
//                             color: candidate.status === 'created' 
//                               ? '#2e7d32' 
//                               : '#d32f2f'
//                           }}
//                         />
//                       </Stack>
//                     </MuiBox>
//                   </MuiBox>

//                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                     <ViewButton
//                       variant="contained"
//                       startIcon={<Eye size={16} />}
//                       onClick={() => onViewProfile(candidate.candidateId)}
//                       // disabled={isButtonDisabled(candidate.candidateId)}
//                     >
//                       View Profile
//                     </ViewButton>
                    
//                     <ViewButton
//                       variant="contained"
//                       startIcon={<Calendar size={16} />}
//                       onClick={() => handleScheduleInterview(candidate)}
//                       disabled={isButtonDisabled(candidate.candidateId)}
//                     >
//                      {isButtonDisabled(candidate.candidateId) ? 'Interview Scheduled' : 'Schedule Interview'}
//                     </ViewButton>
//                   </Stack>
//                 </MuiBox>
//               </CardContent>
//             </CandidateCard>
//           </Grid>
//         ))}
//       </Grid>

//       <InterviewScheduler 
//         open={openScheduler}
//         onClose={() => {
//           setOpenScheduler(false);
//           setSelectedCandidate(null);
//         }}
//         candidateData={selectedCandidate}
//       />
//     </MuiBox>
//   );
// };

// Main Component

const CandidateSection = ({ candidates = [], onViewProfile, jobData }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openScheduler, setOpenScheduler] = useState(false);
  const [filteredCandidates, setFilteredCandidates] = useState(candidates);

  const handleScheduleInterview = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenScheduler(true);
  };

  const isButtonDisabled = (candidateId) => {
    return jobData?.candidateIds?.includes(candidateId);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredCandidates(candidates);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = candidates.filter(candidate => 
      (candidate.candidateName?.toLowerCase() || '').includes(searchTermLower) ||
      (candidate.candidateId?.toLowerCase() || '').includes(searchTermLower) ||
      (candidate.candidateExp?.toString() || '').includes(searchTermLower) ||
      (candidate.status?.toLowerCase() || '').includes(searchTermLower)
    );
    setFilteredCandidates(filtered);
  };

  useEffect(() => {
    setFilteredCandidates(candidates);
  }, [candidates]);

  if (!candidates || candidates.length === 0) {
    return (
      <MuiBox sx={{ mt: 4, textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No candidates have applied for this job yet.
        </Typography>
      </MuiBox>
    );
  }

  return (
    <MuiBox sx={{ mt: 4 }}>
      <CandidateSearch 
        onSearch={handleSearch}
        totalCandidates={candidates.length}
      />

      <Grid container spacing={2}>
        {filteredCandidates.map((candidate) => {
          // Safely get the first letter of the name for the avatar
          const firstLetter = candidate.name 
            ? candidate.name.charAt(0).toUpperCase() 
            : '?';
            
          return (
            <Grid item xs={12} key={candidate.candidateId || candidate.id}>
              <CandidateCard>
                <CardContent>
                  <MuiBox sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                    color: 'black'
                  }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#1a237e',
                          width: 48,
                          height: 48,
                        }}
                      >
                        {firstLetter}
                      </Avatar>
                      
                      <MuiBox>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {candidate.name || 'Unknown Candidate'}
                        </Typography>
                        
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          {candidate.candidateId && (
                            <CandidateChip
                              size="small"
                              label={`ID: ${candidate.candidateId}`}
                            />
                          )}
                          {candidate.candidateExp && (
                            <CandidateChip
                              size="small"
                              icon={<Clock size={14} />}
                              label={`${candidate.candidateExp} Years Exp`}
                            />
                          )}
                          {candidate.applyDate && (
                            <CandidateChip
                              size="small"
                              icon={<Calendar size={14} />}
                              label={`Applied: ${formatDate(candidate.applyDate)}`}
                            />
                          )}
                          {candidate.status && (
                            <CandidateChip
                              size="small"
                              label={candidate.status}
                              sx={{
                                backgroundColor: candidate.status === 'created' 
                                  ? 'rgba(76, 175, 80, 0.2)' 
                                  : 'rgba(244, 67, 54, 0.2)',
                                color: candidate.status === 'created' 
                                  ? '#2e7d32' 
                                  : '#d32f2f'
                              }}
                            />
                          )}
                        </Stack>
                      </MuiBox>
                    </MuiBox>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <ViewButton
                        variant="contained"
                        startIcon={<Eye size={16} />}
                        onClick={() => onViewProfile(candidate.candidateId)}
                      >
                        View Profile
                      </ViewButton>
                      
                      <ViewButton
                        variant="contained"
                        startIcon={<Calendar size={16} />}
                        onClick={() => handleScheduleInterview(candidate)}
                        disabled={isButtonDisabled(candidate.candidateId)}
                      >
                        {isButtonDisabled(candidate.candidateId) 
                          ? 'Interview Scheduled' 
                          : 'Schedule Interview'}
                      </ViewButton>
                    </Stack>
                  </MuiBox>
                </CardContent>
              </CandidateCard>
            </Grid>
          );
        })}
      </Grid>

      <InterviewScheduler 
        open={openScheduler}
        onClose={() => {
          setOpenScheduler(false);
          setSelectedCandidate(null);
        }}
        candidateData={selectedCandidate}
      />
    </MuiBox>
  );
};

const ShowCandidate = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [candidatesData, setCandidatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getJobData = async () => {
    try {
      const response = await axios.get(`${base_hr}/hr-handler/job/getdata-by-jobId?jobId=${jobId}`);
      console.log(response);
      if (response.data && response.data.length > 0) {
        setJobData(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
      setError('Failed to fetch job data');
    }
  };

  // const getCandidate = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://192.168.1.4:7004/candidate-handler/info/get-all-Candidate-of-job?jobId=20250626T105530`
  //     );

  //     console.log(response.data,"ooooooooooooooooooooooooooooooooooo");
    
  //       setCandidatesData(response.data);
  //     // }
  //   } catch (error) {
  //     console.error('Error fetching candidates:', error);
  //     setError('Failed to fetch candidate data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getCandidate = async () => {
  try {
    const response = await axios.get(
      `${base_candidate}/candidate-handler/info/get-all-Candidate-of-job?jobId=${jobId}`
    );

    if (response.data && Array.isArray(response.data)) {
      setCandidatesData(response.data);
    } else {
      setCandidatesData([]);
      console.error('Unexpected response format:', response);
    }
  } catch (error) {
    console.error('Error fetching candidates:', error);
    setError('Failed to fetch candidate data');
    setCandidatesData([]);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    const fetchData = async () => {
      await getJobData();
      await getCandidate();
    };
    fetchData();
  }, [jobId]);

  const handleViewProfile = (candidateId) => {
    navigate(`/dashboard-hr/show-an-candidate/${candidateId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <WelcomeCard sx={{ mb: 4 }}>
          <CardContent sx={{ 
            position: 'relative', 
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200
          }}>
            <CircularProgress sx={{ color: 'white' }} />
          </CardContent>
        </WelcomeCard>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <WelcomeCard sx={{ mb: 4 }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </CardContent>
        </WelcomeCard>
      </Container>
    );
  }

  if (!jobData) {
    return (
      <Container maxWidth="xl">
        <WelcomeCard sx={{ mb: 4 }}>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6">No job data available</Typography>
          </CardContent>
        </WelcomeCard>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Button 
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => window.history.back()}
        sx={{ 
          mb: 3,
          textTransform: 'none',
          boxShadow: 'none'
        }}  
      >
        <Typography fontWeight="bold">
          Go back
        </Typography>
      </Button>
      <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <WelcomeCard>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <JobDetailsSection jobData={jobData} />
          </CardContent>
        </WelcomeCard>

        <CandidateSection 
          candidates={candidatesData}
          onViewProfile={handleViewProfile}
          jobData={jobData}
        />
      </MuiBox>
    </Container>
  );
};

export default ShowCandidate;