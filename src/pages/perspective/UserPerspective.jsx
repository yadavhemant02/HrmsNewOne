import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Avatar,
  Modal,
  TablePagination,
  Rating,
  Stack,
  Chip,
  Grid,
  Divider,
  styled,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Collapse
} from '@mui/material';
import {
  ArrowDownward,
  ArrowUpward,
  Star,
  ThumbUp,
  TrendingUp,
  Add,
  Sort,
  FilterList,
  Search,
  ExpandMore,
  ExpandLess,
  Person,
  Work,
  CalendarToday,
  Grade
} from '@mui/icons-material';
import PerspectiveForm from './PerspectiveForm';
import axios from 'axios';
import { base_emp } from '../../http/services';
import { useNavigate } from 'react-router-dom';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
    borderLeft: `4px solid ${theme.palette.primary.main}`
  }
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(1),
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const RatingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(0.5)
}));

const CommentText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  lineHeight: 1.6,
  marginTop: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  borderLeft: `3px solid ${theme.palette.primary.light}`
}));

const HighlightCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    // borderRadius: 50,
    paddingLeft: theme.spacing(1.5),
    // boxShadow: theme.shadows[1],
    width:'50%',
    backgroundColor:'white',
    transition: 'all 0.3s',
    '&:hover': {
      boxShadow: theme.shadows[3]
    },
    '&.Mui-focused': {
      boxShadow: theme.shadows[4],
      borderColor: theme.palette.primary.main
    }
  }
}));

const UserPerspective = () => {
  const [open, setOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState('date');
  const [perspectives, setPerspectives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReviews, setExpandedReviews] = useState({});
  const navigate = useNavigate();

  const orgCode = localStorage.getItem('organizationCode');

  const toggleReview = (id) => {
    setExpandedReviews(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Fetch API data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${base_emp}/emp-handler/prespective/get-prespective-all-data?organizationCode=${orgCode}`);
        if (res.data && Array.isArray(res.data.result)) {
          const mapped = res.data.result.map(item => ({
            id: item._id,
            employeeName: item.takerName || "N/A",
            designation: item.takerEmpCode || "N/A",
            reviewPeriod: "N/A",
            date: item.createdAt ? item.createdAt.split('T')[0] : "N/A",
            feedback: {
              collaboration: {
                rating: item.collaboration || 0,
                comment: item.collaborationCom || "No comments provided"
              },
              initiative: {
                rating: item.initiative || 0,
                comment: item.initiativeCom || "No comments provided"
              },
              communication: {
                rating: item.communication || 0,
                comment: item.communicationCom || "No comments provided"
              },
              leadership: {
                rating: item.leadership || 0,
                comment: item.leadershipCom || "No comments provided"
              },
              stressManagement: {
                rating: item.stress || 0,
                comment: item.stressCom || "No comments provided"
              },
              learning: {
                rating: item.learning || 0,
                comment: item.learningCom || "No comments provided"
              },
              careerAspiration: {
                comment: item.aspirationCom || "No career aspirations mentioned"
              },
              managerResponse: {
                comment: item.developmentPlanCom || "No development plan provided"
              },
              overallRating: Math.round(
                (
                  (item.collaboration || 0) +
                  (item.initiative || 0) +
                  (item.communication || 0) +
                  (item.leadership || 0) +
                  (item.stress || 0) +
                  (item.learning || 0)
                ) / 6
              ) || 0
            }
          }));
          setPerspectives(mapped);
        }
      } catch (err) {
        console.error('Error fetching perspectives:', err);
        setPerspectives([]);
      }
    };

    fetchData();
  }, []);

  const filteredPerspectives = perspectives.filter(perspective =>
    perspective.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perspective.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perspective.feedback.managerResponse.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perspective.feedback.careerAspiration.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredPerspectives.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleNavigate = () => navigate('/dashboard-hr/user-perspective/add');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddReview = (newEntry) => {
    setPerspectives(prev => [...prev, { ...newEntry, date: new Date().toISOString().split('T')[0] }]);
    setOpen(false);
  };

  const handleSort = (field = sortField) => {
    const newSortAsc = field === sortField ? !sortAsc : true;
    setSortAsc(newSortAsc);
    setSortField(field);
    
    setPerspectives(prev =>
      [...prev].sort((a, b) => {
        if (field === 'date') {
          return newSortAsc
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        } else if (field === 'employeeName') {
          return newSortAsc
            ? a.employeeName.localeCompare(b.employeeName)
            : b.employeeName.localeCompare(a.employeeName);
        } else if (field === 'overallRating') {
          return newSortAsc
            ? a.feedback.overallRating - b.feedback.overallRating
            : b.feedback.overallRating - a.feedback.overallRating;
        }
        return 0;
      })
    );
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          Employee Performance Reviews
        </Typography>
        
        {/* <Stack direction="row" spacing={2}>
          <Tooltip title="Filter reviews">
            <IconButton color="primary" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <FilterList />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleNavigate}
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            New Review
          </Button>
        </Stack> */}
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          fullWidth
          variant="outlined"
          placeholder="Search reviews by name, designation or comments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Stats Card */}
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 3,
          backgroundColor: "#F8F9FA",
        // background: 'linear-gradient(135deg, #f6f9fc 0%, #e3e9f2 100%)',
        boxShadow: 'none'
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {perspectives.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Total Reviews
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={700} color="success.main">
                {perspectives.length > 0 
                  ? (perspectives.reduce((sum, r) => sum + r.feedback.overallRating, 0) / perspectives.length).toFixed(1)
                  : 0
                }<Typography component="span" variant="h5">/5</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <Grade fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Average Rating
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={700} color="info.main">
                {perspectives.filter(r => r.feedback.overallRating >= 4).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <ThumbUp fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Positive Reviews
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {perspectives.filter(r => r.feedback.overallRating <= 2).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <TrendingUp fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Needs Improvement
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Sorting Controls */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        flexWrap: 'wrap'
      }}>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<Sort />}
          onClick={() => handleSort('date')}
          endIcon={sortField === 'date' && (sortAsc ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
          sx={{
            borderRadius: 2,
            px: 2,
            textTransform: 'none',
            borderColor: 'divider',
            '&:hover': { borderColor: 'primary.main' }
          }}
        >
          Sort by Date
        </Button>
        
        <Button
          variant="outlined"
          size="medium"
          startIcon={<Sort />}
          onClick={() => handleSort('employeeName')}
          endIcon={sortField === 'employeeName' && (sortAsc ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
          sx={{
            borderRadius: 2,
            px: 2,
            textTransform: 'none',
            borderColor: 'divider',
            '&:hover': { borderColor: 'primary.main' }
          }}
        >
          Sort by Name
        </Button>
        
        <Button
          variant="outlined"
          size="medium"
          startIcon={<Sort />}
          onClick={() => handleSort('overallRating')}
          endIcon={sortField === 'overallRating' && (sortAsc ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
          sx={{
            borderRadius: 2,
            px: 2,
            textTransform: 'none',
            borderColor: 'divider',
            '&:hover': { borderColor: 'primary.main' }
          }}
        >
          Sort by Rating
        </Button>
      </Box>

      {/* Review Cards */}
      {paginatedData.length > 0 ? (
        <>
          {paginatedData.map((review) => (
            <StyledCard key={review.id}>
              <CardHeader
                avatar={
                  <Avatar sx={{ 
                    bgcolor: 'primary.main',
                    width: 48,
                    height: 48,
                    fontSize: '1.2rem'
                  }}>
                    {review.employeeName.charAt(0)}
                  </Avatar>
                }
                title={
                  <Typography variant="h6" fontWeight={600}>
                    {review.employeeName}
                  </Typography>
                }
                subheader={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Work fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: '1rem' }} />
                      {review.designation}
                    </Typography>
                    <Chip
                      label={review.reviewPeriod}
                      size="small"
                      sx={{ 
                        bgcolor: 'action.selected',
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Box>
                }
                action={
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2" color="text.secondary">
                      <CalendarToday fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: '1rem' }} />
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                    <RatingContainer>
                      <Star color="warning" />
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        {review.feedback.overallRating}
                        <Typography component="span" variant="body2" color="text.secondary">/5</Typography>
                      </Typography>
                    </RatingContainer>
                  </Box>
                }
                sx={{
                  pb: 0,
                  '& .MuiCardHeader-action': { alignSelf: 'center' }
                }}
              />
              
              <CardContent>
                {/* Performance Metrics Accordion */}
                <Box sx={{ mb: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => toggleReview(review.id)}
                    endIcon={expandedReviews[review.id] ? <ExpandLess /> : <ExpandMore />}
                    sx={{
                      justifyContent: 'space-between',
                      py: 1.5,
                      textTransform: 'none',
                      borderColor: 'divider',
                      backgroundColor: expandedReviews[review.id] ? 'action.hover' : 'background.paper',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {expandedReviews[review.id] ? (
                        <ThumbUp color="primary" />
                      ) : (
                        <TrendingUp color="primary" />
                      )}
                      <Typography fontWeight={600}>
                        {expandedReviews[review.id] ? 'Hide Performance Details' : 'Show Performance Details'}
                      </Typography>
                    </Box>
                  </Button>

                  <Collapse in={expandedReviews[review.id]}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {/* Strengths Section */}
                      <Grid item xs={12} md={6}>
                        <SectionHeader>
                          <ThumbUp fontSize="small" />
                          Strengths
                        </SectionHeader>
                        <HighlightCard>
                          <Grid container spacing={2}>
                            {[
                              { label: 'Collaboration', value: review.feedback.collaboration },
                              { label: 'Initiative', value: review.feedback.initiative },
                              { label: 'Leadership', value: review.feedback.leadership }
                            ].map((item, i) => (
                              <Grid item xs={12} sm={6} key={i}>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                                    {item.label}
                                  </Typography>
                                  <Rating 
                                    value={item.value.rating} 
                                    size="small" 
                                    readOnly 
                                    precision={0.5}
                                    sx={{ mt: 0.5 }}
                                  />
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      {item.value.comment}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </HighlightCard>
                      </Grid>

                      {/* Growth Areas Section */}
                      <Grid item xs={12} md={6}>
                        <SectionHeader>
                          <TrendingUp fontSize="small" />
                          Growth Areas
                        </SectionHeader>
                        <HighlightCard>
                          <Grid container spacing={2}>
                            {[
                              { label: 'Communication', value: review.feedback.communication },
                              { label: 'Stress Management', value: review.feedback.stressManagement },
                              { label: 'Learning', value: review.feedback.learning }
                            ].map((item, i) => (
                              <Grid item xs={12} sm={6} key={i}>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                                    {item.label}
                                  </Typography>
                                  <Rating 
                                    value={item.value.rating} 
                                    size="small" 
                                    readOnly 
                                    precision={0.5}
                                    sx={{ mt: 0.5 }}
                                  />
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      {item.value.comment}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </HighlightCard>
                      </Grid>
                    </Grid>
                  </Collapse>
                </Box>

                {/* Career Aspirations and Development Plan */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <SectionHeader>Career Aspirations</SectionHeader>
                    <CommentText>{review.feedback.careerAspiration.comment}</CommentText>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <SectionHeader>Development Plan</SectionHeader>
                    <CommentText>{review.feedback.managerResponse.comment}</CommentText>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          ))}
        </>
      ) : (
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(to bottom, #f9f9f9, #f0f0f0)'
        }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {searchTerm ? 'No matching reviews found' : 'No performance reviews available'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm ? 'Try adjusting your search criteria' : 'Create your first review to get started'}
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              mt: 2,
              px: 4,
              borderRadius: 2,
              fontWeight: 600
            }} 
            onClick={handleNavigate}
            startIcon={<Add />}
          >
            Create New Review
          </Button>
        </Paper>
      )}

      {/* Pagination */}
      {filteredPerspectives.length > 0 && (
        <TablePagination
          component="div"
          count={filteredPerspectives.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
          sx={{ 
            mt: 3,
            '& .MuiTablePagination-toolbar': {
              paddingLeft: 0
            }
          }}
        />
      )}

      {/* Modal for PerspectiveForm */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '85%', md: '700px' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          outline: 'none',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <PerspectiveForm onSubmit={handleAddReview} onClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
};

export default UserPerspective;