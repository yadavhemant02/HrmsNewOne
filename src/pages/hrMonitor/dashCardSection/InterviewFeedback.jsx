import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TextField,
  Box,
  Chip,
  styled,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  Search,
  Calendar,
  CheckCircle,
  Clock,
  User,
  ChevronUp,
  ChevronDown,
  X,
  Eye,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Users,
  BookOpen,
  Globe,
  MessageSquare,
  Award,
} from 'lucide-react';
import axios from 'axios';
import { base_hr } from '../../../http/services';
import { Code, Mic } from '@mui/icons-material';
import BackButton from '../../../constent/BackButton';

// Styled Components
const SearchContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '24px',
});

const SearchWrapper = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  background: 'white',
  padding: '4px 16px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
});

const StyledSearchTextField = styled(TextField)({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 0',
  },
});

const ResultCount = styled(Box)(({ theme }) => ({
  background: 'rgba(76, 175, 80, 0.1)',
  color: '#2e7d32',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#1a237e',
  color: 'white',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#0d47a1',
  },
}));

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.04)',
  },
  transition: 'background-color 0.2s',
});

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === 'completed' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
  color: status === 'completed' ? '#2e7d32' : '#f57c00',
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

const ViewButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '8px',
  padding: '6px 16px',
  backgroundColor: '#1a237e',
  color: 'white',
  '&:hover': {
    backgroundColor: '#0d47a1',
  },
});

const DetailCard = styled(Box)({
  backgroundColor: '#f5f5f5',
  borderRadius: '12px',
  padding: '16px',
  height: '100%',
});

const InterviewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', feedback: null });
  const [actionComment, setActionComment] = useState('');
  const [filterSelected, setFilterSelected] = useState('not_selected'); // 'not_selected' | 'rejected'
  const [rejectedFeedbacks, setRejectedFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/feedback/get/all/panding-feedback/pending?organizationCode=${localStorage.getItem("organizationCode")}`
      );
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to fetch feedback data');
      setLoading(false);
    }
  };

  const fetchRejectedFeedbacks = async () => {
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/feedback/get/all/panding-feedback/rejected?organizationCode=${localStorage.getItem("organizationCode")}`
      );
      setRejectedFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching rejected feedbacks:', error);
      // keep silent; non-blocking
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchRejectedFeedbacks();
  }, []);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFeedback(null);
  };

  const handleOpenActionDialog = (type, feedback) => {
    setActionDialog({ open: true, type, feedback });
    setActionComment('');
  };

  const handleCloseActionDialog = () => {
    setActionDialog({ open: false, type: '', feedback: null });
  };

  // Update handleselectCandidate to handle accept/reject with reason and status
  const handleselectCandidate = async (feedbackId, comment, status) => {
  try {
    setLoading(true);
    handleCloseActionDialog();
    handleCloseDialog();

    const response = await axios.get(
      `${base_hr}/hr-handler/feedback/select-candidate/by-feedback-id?feedbackId=${feedbackId}&reason=${encodeURIComponent(comment)}&status=${encodeURIComponent(status)}`
    );

    // Axios resolves on any 2xx; this guard is optional but keeps intent explicit
    if (response.status >= 200 && response.status < 300) {
      await Promise.all([
        fetchFeedbacks(),
        fetchRejectedFeedbacks(),
      ]);
      setSelectionStatus({
        open: true,
        message: status === "selected" ? "Candidate selected successfully!" : "Candidate rejected successfully!",
        severity: "success",
      });
    }
  } catch (error) {
    setSelectionStatus({
      open: true,
      message: error?.response?.data?.message || `Failed to ${status === "selected" ? "select" : "reject"} candidate. Please try again.`,
      severity: "error",
    });
    console.error("Error selecting/rejecting candidate:", error);
  } finally {
    setLoading(false);
  }
};


  // choose data source based on filter: rejected uses separate endpoint
  const dataSource = filterSelected === 'rejected' ? rejectedFeedbacks : feedbacks;

  const filteredAndSortedData = dataSource
    .filter((feedback) => {
      // Search filter across values
      return Object.values(feedback).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'asc'
          ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
          : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] > b[sortConfig.key]
          ? 1
          : -1
        : a[sortConfig.key] < b[sortConfig.key]
          ? 1
          : -1;
    });

  const paginatedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <BackButton />
        <Typography variant="h4" sx={{ mb: 3, color: '#1a237e', fontWeight: 600 }}>
          Interview Feedback Management
        </Typography>
        <SearchContainer>
          <SearchWrapper>
            <Search size={20} color="#666" />
            <StyledSearchTextField
              fullWidth
              placeholder="Search feedback by name, manager or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true,
              }}
            />
          </SearchWrapper>
          <ResultCount>
            <CheckCircle size={16} />
            Showing {paginatedData.length} of {filteredAndSortedData.length} feedbacks
          </ResultCount>
        </SearchContainer>
        {/* Dropdown Filter below Search */}
        <Box sx={{ mt: 2, mb: 2, maxWidth: 240 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="filter-selected-label">Filter by Selection</InputLabel>
            <Select
              labelId="filter-selected-label"
              id="filter-selected"
              value={filterSelected}
              label="Filter by Selection"
              onChange={(e) => setFilterSelected(e.target.value)}
            >
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="not_selected">Pending Action</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: '50px' }}>S.No</StyledTableCell>
                <StyledTableCell onClick={() => handleSort('candidateName')}>
                  Candidate Name
                  {sortConfig.key === 'candidateName' && (
                    <Box component="span" sx={{ ml: 1 }}>
                      {sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Box>
                  )}
                </StyledTableCell>
                <StyledTableCell>Feedback ID</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Experience</StyledTableCell>
                <StyledTableCell onClick={() => handleSort('interviewDate')}>
                  Interview Date
                  {sortConfig.key === 'interviewDate' && (
                    <Box component="span" sx={{ ml: 1 }}>
                      {sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Box>
                  )}
                </StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Interview Panel</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((feedback, index) => (
                <StyledTableRow key={feedback.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {feedback.candidateName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{feedback.feedbackId}</TableCell>
                  <TableCell>{feedback.candidateLocation}</TableCell>
                  <TableCell>{feedback.noOfYearExperince} years</TableCell>
                  <TableCell>{formatDate(feedback.interviewDate)}</TableCell>
                  <TableCell>
                    <StatusChip
                      icon={feedback.doneFeedback.length > 0 ? <Clock size={16} /> : <CheckCircle size={16} />}
                      label={feedback.doneFeedback.length > 0 ? 'Pending' : 'Completed'}
                      status={feedback.doneFeedback.length > 0 ? 'pending' : 'completed'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {[feedback.interviewer1, feedback.interviewer2, feedback.interviewer3]
                        .filter(Boolean)
                        .map((interviewer, index) => (
                          <Chip
                            key={index}
                            size="small"
                            icon={<User size={14} />}
                            label={interviewer}
                            sx={{
                              backgroundColor: feedback.doneFeedback.includes(interviewer)
                                ? 'rgba(255, 152, 0, 0.1)'
                                : 'rgba(76, 175, 80, 0.1)',
                              color: feedback.doneFeedback.includes(interviewer)
                                ? '#f57c00'
                                : '#2e7d32',
                            }}
                          />
                        ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <ViewButton
                      startIcon={<Eye size={16} />}
                      onClick={() => handleOpenDialog(feedback)}
                      disabled={feedback.isSelected === 'yes'}
                      sx={{
                        opacity: feedback.isSelected === 'yes' ? 0.5 : 1,
                        pointerEvents: feedback.isSelected === 'yes' ? 'none' : 'auto',
                        bgcolor: feedback.isSelected === 'yes' ? '#e0e0e0' : '#1a237e',
                        color: feedback.isSelected === 'yes' ? '#757575' : 'white',
                      }}
                    >
                      View Details
                    </ViewButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAndSortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-select': {
                borderRadius: '8px',
              },
            }}
          />
        </TableContainer>
      </Box>

      {/* Feedback Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px',
          },
        }}
      >
        {selectedFeedback && (
          <>
            <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                Feedback Details
              </Typography>
              <IconButton onClick={handleCloseDialog} size="small">
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Candidate Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                    Candidate Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <DetailCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <User size={20} />
                          <Typography variant="subtitle1" fontWeight={600}>
                            {selectedFeedback.candidateName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Mail size={16} />
                            <Typography variant="body2">
                              {selectedFeedback.candidateEmail || 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapPin size={16} />
                            <Typography variant="body2">
                              {selectedFeedback.candidateLocation || 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Briefcase size={16} />
                            <Typography variant="body2">
                              {selectedFeedback.noOfYearExperince || '0'} years experience
                            </Typography>
                          </Box>
                        </Box>
                      </DetailCard>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <DetailCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Calendar size={20} />
                          <Typography variant="subtitle1" fontWeight={600}>
                            Interview Details
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Typography variant="body2">
                            Date: {formatDate(selectedFeedback.interviewDate)}
                          </Typography>
                          <Typography variant="body2">
                            Organization: {selectedFeedback.organizationName}
                          </Typography>
                          <StatusChip
                            icon={selectedFeedback.doneFeedback.length > 0 ? <Clock size={16} /> : <CheckCircle size={16} />}
                            label={selectedFeedback.doneFeedback.length > 0 ? 'Pending' : 'Completed'}
                            status={selectedFeedback.doneFeedback.length > 0 ? 'pending' : 'completed'}
                          />
                        </Box>
                      </DetailCard>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Feedback Scores */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                    Evaluation Scores
                  </Typography>
                  <DetailCard>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <ScoreCard
                          title="Technical Skills"
                          scoreArr={Array.isArray(selectedFeedback.skill) ? selectedFeedback.skill : [selectedFeedback.skill]}
                          maxScore={5}
                          icon={<Code size={18} />}
                          commentsArr={Array.isArray(selectedFeedback.skillComment) ? selectedFeedback.skillComment : [selectedFeedback.skillComment]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <ScoreCard
                          title="Domain Knowledge"
                          scoreArr={Array.isArray(selectedFeedback.domin) ? selectedFeedback.domin : [selectedFeedback.domin]}
                          maxScore={5}
                          icon={<BookOpen size={18} />}
                          commentsArr={Array.isArray(selectedFeedback.dominComment) ? selectedFeedback.dominComment : [selectedFeedback.dominComment]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <ScoreCard
                          title="General Knowledge"
                          scoreArr={Array.isArray(selectedFeedback.generalKnowlege) ? selectedFeedback.generalKnowlege : [selectedFeedback.generalKnowlege]}
                          maxScore={5}
                          icon={<Globe size={18} />}
                          commentsArr={Array.isArray(selectedFeedback.generalKnowlegeComment) ? selectedFeedback.generalKnowlegeComment : [selectedFeedback.generalKnowlegeComment]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <ScoreCard
                          title="Communication"
                          scoreArr={Array.isArray(selectedFeedback.comunication) ? selectedFeedback.comunication : [selectedFeedback.comunication]}
                          maxScore={5}
                          icon={<MessageSquare size={18} />}
                          commentsArr={Array.isArray(selectedFeedback.comunicationComment) ? selectedFeedback.comunicationComment : [selectedFeedback.comunicationComment]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <ScoreCard
                          title="Presentation"
                          scoreArr={Array.isArray(selectedFeedback.presentable) ? selectedFeedback.presentable : [selectedFeedback.presentable]}
                          maxScore={5}
                          icon={<Mic size={18} />}
                          commentsArr={Array.isArray(selectedFeedback.presentableComment) ? selectedFeedback.presentableComment : [selectedFeedback.presentableComment]}
                        />
                      </Grid>
                    </Grid>
                  </DetailCard>
                </Grid>

                {/* Interview Panel */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, mt: 5, color: '#1a237e' }}>
                    Interview Panel
                  </Typography>
                  <DetailCard>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {console.log(selectedFeedback)}
                      {[selectedFeedback.interviewer1, selectedFeedback.interviewer2, selectedFeedback.interviewer3]
                        .filter(Boolean)
                        .map((interviewer, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 2,
                              bgcolor: 'white',
                              borderRadius: '8px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Users size={16} />
                              <Typography>{interviewer}</Typography>
                            </Box>
                            <Chip
                              size="small"
                              icon={selectedFeedback.doneFeedback.includes(interviewer) ? <CheckCircle size={14} /> : <Clock size={14} />}
                              label={selectedFeedback.doneFeedback.includes(interviewer) ? 'Pending' : 'Feedback Submitted'}
                              sx={{
                                backgroundColor: selectedFeedback.doneFeedback.includes(interviewer)
                                  ? 'rgba(255, 152, 0, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                                color: selectedFeedback.doneFeedback.includes(interviewer)
                                  ? '#f57c00' : '#2e7d32',
                              }}
                            />
                          </Box>
                        ))}
                    </Box>
                  </DetailCard>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                variant="outlined"
                onClick={handleCloseDialog}
                sx={{
                  borderColor: '#1a237e',
                  color: '#1a237e',
                  '&:hover': {
                    borderColor: '#0d47a1',
                    backgroundColor: 'rgba(26, 35, 126, 0.04)',
                  },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => handleOpenActionDialog('accept', selectedFeedback)}
                sx={{
                  bgcolor: '#1a237e',
                  '&:hover': { bgcolor: '#0d47a1' },
                }}
              >
                Select Candidate
              </Button>
              <Button
                variant="contained"
                onClick={() => handleOpenActionDialog('reject', selectedFeedback)}
                sx={{
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#900900' },
                }}
              >
                Reject Candidate
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Action Dialog for Accept/Reject Candidate */}
      <Dialog
        open={actionDialog.open}
        onClose={handleCloseActionDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {actionDialog.type === 'accept' ? 'Accept Candidate' : 'Reject Candidate'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Please provide a reason for accepting or rejecting this candidate"
            fullWidth
            multiline
            minRows={2}
            value={actionComment}
            onChange={(e) => setActionComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActionDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (actionDialog.type === 'accept') {
                await handleselectCandidate(actionDialog.feedback.feedbackId, actionComment, "selected");
              } else {
                await handleselectCandidate(actionDialog.feedback.feedbackId, actionComment, "rejected");
              }
              handleCloseActionDialog();
              handleCloseDialog(); // <-- Close main dialog as well
            }}
            disabled={!actionComment.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="info" onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const ScoreCard = ({ title, scoreArr, maxScore, icon, commentsArr }) => {
  const avgScore = scoreArr && scoreArr.length > 0
    ? (scoreArr.reduce((a, b) => a + b, 0) / scoreArr.length).toFixed(1)
    : 0;
  const percentage = (avgScore / maxScore) * 100;
  let color = '#F44336';

  if (percentage >= 75) {
    color = '#4CAF50';
  } else if (percentage >= 50) {
    color = '#FFC107';
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 2,
      bgcolor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      height: '100%',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon}
        <Typography variant="subtitle2">{title}</Typography>
      </Box>
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '8px',
        bgcolor: '#e0e0e0',
        borderRadius: '4px',
        mb: 1,
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${percentage}%`,
          height: '100%',
          bgcolor: color,
          borderRadius: '4px',
        }} />
      </Box>
      <Typography variant="body2" fontWeight={600}>
        {avgScore} / {maxScore}
      </Typography>
      {commentsArr && commentsArr.length > 0 && (
        <Box sx={{ mt: 1, textAlign: 'left', width: '100%' }}>
          {commentsArr.map((comment, idx) => (
            <Typography key={idx} variant="caption" color="text.secondary" display="block">
              {comment}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default InterviewFeedback;
