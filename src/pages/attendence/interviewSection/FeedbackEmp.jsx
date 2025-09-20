import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box as MuiBox,
  Grid,
  TextareaAutosize,
  CircularProgress,
  styled,
  Avatar,
  Stack,
  Chip,
  Rating,
  Button,
  Snackbar,
  Alert,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField 
} from '@mui/material';
import {
  Clock,
  Calendar,
  User,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';
import { base_hr } from '../../../http/services';
// import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
// Styled Components
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px !important',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  transition: 'all 0.3s ease',
  marginBottom: '16px',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '0 0 16px 0',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  borderRadius: '12px',
  '&.Mui-expanded': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  '& .MuiAccordionSummary-content': {
    margin: '12px 0',
  },
}));

const StatusChip = styled(Chip)({
  backgroundColor: 'rgba(26, 35, 126, 0.1)',
  '& .MuiChip-icon': {
    color: '#1a237e',
  },
});

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

const LoadingCard = styled(Card)({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  borderRadius: '16px',
  minHeight: '200px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Accordion Feedback Card Component
const AccordionFeedbackCard = ({ feedback, onFeedbackSubmitted }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [ratings, setRatings] = useState({
    skill:  0,
    generalKnowlege:  0,
    domin: 0,
    presentable: 0,
    comunication:  0
  });

  const [comments, setComments] = useState({
  skill: '',
  generalKnowlege: '',
  domin: '',
  presentable: '',
  comunication: ''
});
const handleCommentChange = (field, value) => {
  setComments(prev => ({
    ...prev,
    [field]: value
  }));
};

  const handleRatingChange = (field, value) => {
    setRatings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitFeedback = async () => {
    setLoading(true);
    try {
      const feedbackData = {
        feedbackId: feedback.feedbackId,
        skill: ratings.skill || 0,
        generalKnowlege: ratings.generalKnowlege || 0,
        domin: ratings.domin || 0,
        presentable: ratings.presentable || 0,
        comunication: ratings.comunication || 0,
        interviewer: localStorage.getItem('email'),
        organizationName:localStorage.getItem("organizationName"),
	      organizationCode:localStorage.getItem("organizationCode"),
        skillComment: comments.skill || '',
        generalKnowlegeComment: comments.generalKnowlege || '',
        dominComment: comments.domin || '',
        presentableComment: comments.presentable || '',
        comunicationComment: comments.comunication || '',
        
      };

      await axios.post(
        `${base_hr}/hr-handler/feedback/add/candidate-feedback-data`,
        feedbackData
      );

      setAlertMessage('Feedback submitted successfully!');
      setAlertSeverity('success');
      setShowAlert(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setAlertMessage('Failed to submit feedback. Please try again.');
      setAlertSeverity('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledAccordion 
        expanded={expanded} 
        onChange={() => setExpanded(!expanded)}
      >
        <StyledAccordionSummary
          expandIcon={expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#1a237e' }}>
                  {feedback.candidateName?.[0]?.toUpperCase() || 'C'}
                </Avatar>
                <MuiBox>
                  <Typography variant="h6" sx={{ color: '#1a237e' }}>
                    {feedback.candidateName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {feedback.feedbackId}
                  </Typography>
                </MuiBox>
              </MuiBox>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap">
                <StatusChip
                  icon={<Clock size={16} />}
                  label={`Experience: ${feedback.noOfYearExperince} years`}
                />
                <StatusChip
                  icon={<Calendar size={16} />}
                  label={formatDate(feedback.interviewDate)}
                />
              </Stack>
            </Grid>
          </Grid>
        </StyledAccordionSummary>

        <AccordionDetails sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Candidate Info */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Candidate Information
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Email: {feedback.candidateEmail}
                  </Typography>
                  <Typography variant="body2">
                    Location: {feedback.candidateLocation}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            {/* Interview Panel */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Interview Panel
                </Typography>
                <Stack spacing={1}>
                  {feedback.interviewer1 && (
                    <StatusChip
                      icon={<User size={16} />}
                      label={`Interviewer 1: ${feedback.interviewer1}`}
                    />
                  )}
                  {feedback.interviewer2 && (
                    <StatusChip
                      icon={<User size={16} />}
                      label={`Interviewer 2: ${feedback.interviewer2}`}
                    />
                  )}
                  {feedback.interviewer3 && (
                    <StatusChip
                      icon={<User size={16} />}
                      label={`Interviewer 3: ${feedback.interviewer3}`}
                    />
                  )}
                </Stack>
              </Stack>
            </Grid>

            {/* Ratings */}
            {/* <Grid item xs={12}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Evaluation
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Typography variant="body2">Technical Skills</Typography>
                    <Rating 
                      value={ratings.skill}
                      onChange={(event, newValue) => handleRatingChange('skill', newValue)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Typography variant="body2">General Knowledge</Typography>
                    <Rating 
                      value={ratings.generalKnowlege}
                      onChange={(event, newValue) => handleRatingChange('generalKnowlege', newValue)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Typography variant="body2">Domain Knowledge</Typography>
                    <Rating 
                      value={ratings.domain}
                      onChange={(event, newValue) => handleRatingChange('domain', newValue)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Typography variant="body2">Presentation Skills</Typography>
                    <Rating 
                      value={ratings.presentable}
                      onChange={(event, newValue) => handleRatingChange('presentable', newValue)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Typography variant="body2">Communication</Typography>
                    <Rating 
                      value={ratings.comunication}
                      onChange={(event, newValue) => handleRatingChange('comunication', newValue)}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Grid> */}

              <Grid item xs={12}>
  <Stack spacing={2}>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      Evaluation
    </Typography>
    <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, width: '30%' }}>Skills</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '30%' }}>Rating</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '40%' }}>Comments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Technical Skills</TableCell>
            <TableCell>
              <Rating 
                value={ratings.skill}
                onChange={(event, newValue) => handleRatingChange('skill', newValue)}
              />
            </TableCell>
            <TableCell>
              <TextareaAutosize
                aria-label="Resizable Textarea"
                minRows={2}
                placeholder="Write your comment..."
                style={{
                  width: 400,
                  resize: 'vertical',
                  padding: '8px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
                value={comments.skill || ''}
                onChange={(e) => handleCommentChange('skill', e.target.value)}
                sx={{ width: '100%' }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>General Knowledge</TableCell>
            <TableCell>
              <Rating 
                value={ratings.generalKnowlege}
                onChange={(event, newValue) => handleRatingChange('generalKnowlege', newValue)}
              />
            </TableCell>
            <TableCell>
              <TextareaAutosize
                aria-label="Resizable Textarea"
                minRows={2}
                placeholder="Write your comment..."
                style={{
                  width: 400,
                  resize: 'vertical',
                  padding: '8px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
                value={comments.generalKnowlege || ''}
                onChange={(e) => handleCommentChange('generalKnowlege', e.target.value)}
                sx={{ width: '100%' }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Domain Knowledge</TableCell>
            <TableCell>
              <Rating 
                value={ratings.domin}
                onChange={(event, newValue) => handleRatingChange('domin', newValue)}
              />
            </TableCell>
            <TableCell>
              <TextareaAutosize
                aria-label="Resizable Textarea"
                minRows={2}
                placeholder="Write your comment..."
                style={{
                  width: 400,
                  resize: 'vertical',
                  padding: '8px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
                value={comments.domin || ''}
                onChange={(e) => handleCommentChange('domin', e.target.value)}
                sx={{ width: '100%' }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Presentation Skills</TableCell>
            <TableCell>
              <Rating 
                value={ratings.presentable}
                onChange={(event, newValue) => handleRatingChange('presentable', newValue)}
              />
            </TableCell>
            <TableCell>
              <TextareaAutosize
                aria-label="Resizable Textarea"
                minRows={2}
                placeholder="Write your comment..."
                style={{
                  width: 400,
                  resize: 'vertical',
                  padding: '8px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
                value={comments.presentable || ''}
                onChange={(e) => handleCommentChange('presentable', e.target.value)}
                sx={{ width: '100%' }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Communication</TableCell>
            <TableCell>
              <Rating 
                value={ratings.comunication}
                onChange={(event, newValue) => handleRatingChange('comunication', newValue)}
              />
            </TableCell>
            <TableCell>
              <TextareaAutosize
                aria-label="Resizable Textarea"
                minRows={2}
                placeholder="Write your comment..."
                style={{
                  width: 400,
                  resize: 'vertical',
                  padding: '8px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
                value={comments.comunication || ''}
                onChange={(e) => handleCommentChange('comunication', e.target.value)}
                sx={{ width: '100%' }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Stack>
</Grid>


            {/* Submit Button */}
            <Grid item xs={12}>
              <MuiBox sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                mt: 2
              }}>
                <ViewButton
                  onClick={handleSubmitFeedback}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={16} />}
                >
                  Submit Feedback
                </ViewButton>
              </MuiBox>
            </Grid>
          </Grid>
        </AccordionDetails>
      </StyledAccordion>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// Main Component
const FeedbackEmp = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/feedback/get/to-employee/panding-feedback?email=${localStorage.getItem('email')}`
      );
      setFeedbacks(Array.isArray(response.data) ? response.data : [response.data]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to fetch feedback data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <LoadingCard>
          <CircularProgress sx={{ color: 'white' }} />
        </LoadingCard>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Card>
          <CardContent>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

return (
  <Container maxWidth="xl">
    <Typography variant="h4" sx={{ mb: 4, color: '#1a237e', fontWeight: 600 }}>
      Employee Feedback
    </Typography>

    <Grid container spacing={3}>
      {feedbacks && feedbacks.length > 0 ? (
        feedbacks.map((feedback) => (
          <Grid item xs={12} key={feedback.id}>
            <AccordionFeedbackCard 
              feedback={feedback} 
              onFeedbackSubmitted={fetchFeedbacks}
            />
          </Grid>
        ))
      ) : (
        // STYLISH 'NO FEEDBACK' CARD
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: { xs: 3, md: 5 }, // Padding
              textAlign: 'center', 
              borderColor: 'divider' 
            }}
          >
            <Box>
              <CheckCircleOutline sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" component="p" gutterBottom>
                All Caught Up!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                There is no pending feedback to review at the moment.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  </Container>
);
};

export default FeedbackEmp;