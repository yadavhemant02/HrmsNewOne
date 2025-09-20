
import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TablePagination,
  useTheme,
  alpha,
  styled,
  InputAdornment,
  TextField,
  Tooltip,
  Paper,
  Rating,
  Avatar,
  Chip,
  Stack,
  Collapse,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  Star,
  ThumbUp,
  TrendingUp,
  Sort,
  Search,
  ExpandMore,
  ExpandLess,
  Person,
  Work,
  CalendarToday,
  Grade,
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Swal from "sweetalert2";
import { base_emp, base_identity } from "../../http/services";
import PrespectiveForm from './PerspectiveForm';

const base_perspective = `${base_emp}/emp-handler/prespective`;

// Styled Components (Same as UserPerspective)
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
    paddingLeft: theme.spacing(1.5),
    width: '50%',
    backgroundColor: 'white',
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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 280px)",
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: "#4372C8",
    color: "white",
    fontWeight: 600,
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 10,
    paddingTop: 16,
    paddingBottom: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transition: "background-color 0.2s ease",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem",
  padding: theme.spacing(1.5, 2),
  borderColor: alpha(theme.palette.divider, 0.5),
}));

const RequestButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.875rem",
  padding: theme.spacing(1, 2.5),
  background: "linear-gradient(45deg, #6ba9ffff 30%, #538fffff 90%)",
  color: "white",
  minWidth: 120,
  "&:hover": {
    background: "linear-gradient(45deg, #538fffff 30%, #6ba9ffff 90%)",
    transform: "translateY(-2px)",
  },
}));

const EmployeeAvatar = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(1.5),
  color: "white",
  fontWeight: "bold",
  fontSize: "1rem",
}));

const MyPerspective = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openReviewRequests, setOpenReviewRequests] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // New state for tab switching
  const [activeTab, setActiveTab] = useState('forMe');

  // Add filter state
  const [filterType, setFilterType] = useState(null); // 'positive', 'improvement', or null

  // States for "Reviews for me"
  const [reviewsForMe, setReviewsForMe] = useState([]);
  const [loadingForMe, setLoadingForMe] = useState(false);
  const [errorForMe, setErrorForMe] = useState(null);
  const [sortAscForMe, setSortAscForMe] = useState(true);
  const [sortFieldForMe, setSortFieldForMe] = useState('date');
  const [pageForMe, setPageForMe] = useState(0);
  const [rowsPerPageForMe, setRowsPerPageForMe] = useState(5);

  // States for "Reviews by me"
  const [reviewsByMe, setReviewsByMe] = useState([]);
  const [loadingByMe, setLoadingByMe] = useState(false);
  const [errorByMe, setErrorByMe] = useState(null);
  const [sortAscByMe, setSortAscByMe] = useState(true);
  const [sortFieldByMe, setSortFieldByMe] = useState('date');
  const [pageByMe, setPageByMe] = useState(0);
  const [rowsPerPageByMe, setRowsPerPageByMe] = useState(5);

  // States for "Review Requests"
  const [reviewRequests, setReviewRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [errorRequests, setErrorRequests] = useState(null);

  // Enhanced state for perspective form
  const [openPerspectiveForm, setOpenPerspectiveForm] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  // New state for expand/collapse performance details (like UserPerspective)
  const [expandedReviews, setExpandedReviews] = useState({});

  const toggleReview = (id) => {
    setExpandedReviews(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter function
  const getFilteredReviews = (reviews) => {
    if (!filterType) return reviews;
    
    if (filterType === 'positive') {
      return reviews.filter(review => review.feedback.overallRating > 3);
    } else if (filterType === 'improvement') {
      return reviews.filter(review => review.feedback.overallRating <= 3);
    }
    
    return reviews;
  };

  // Reset filter when changing tabs
  useEffect(() => {
    setFilterType(null);
    if (activeTab === 'forMe') {
      setPageForMe(0);
    } else {
      setPageByMe(0);
    }
  }, [activeTab]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem("organizationCode")}`
      );
      const data = Array.isArray(response.data) ? response.data : [];
      const currentUserEmpCode = localStorage.getItem('empCode');
      const filteredData = data.filter(emp => emp.empCode !== currentUserEmpCode);
      setEmployees(filteredData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch employees. Please try again later.");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const mapReviewData = (item, isForMe) => ({
    id: item.perspectiveId || item.prespectiveId || item._id || Math.random().toString(),
    employeeName: isForMe ? item.giverName || "N/A" : item.takerName || "N/A",
    designation: isForMe ? item.giverEmpCode || "N/A" : item.takerEmpCode || "N/A",
    reviewPeriod: "N/A",
    date: item.createdAt ? item.createdAt.split('T')[0] : "N/A",
    perspectiveId: item.perspectiveId || item.prespectiveId || item.id || "",
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
      overAllPossitive: item.overAllPossitive,
      overAllNegative: item.overAllNegative,
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
  });

  const fetchReviewsForMe = async () => {
    try {
      setLoadingForMe(true);
      const empCode = localStorage.getItem("empCode");
      const res = await axios.get(`${base_perspective}/get-all-prespective-of-taker?empCode=${empCode}`);
      console.log("Reviews for me response:", res.data);
      const mapped = (res.data.result || []).map(item => mapReviewData(item, true));
      setReviewsForMe(mapped);
      setErrorForMe(null);
    } catch (err) {
      setErrorForMe("Failed to fetch reviews. Please try again later.");
    } finally {
      setLoadingForMe(false);
    }
  };

  const fetchReviewsByMe = async () => {
    try {
      setLoadingByMe(true);
      const empCode = localStorage.getItem("empCode");
      const res = await axios.get(`${base_perspective}/get-all-prespective-of-giver?empCode=${empCode}`);
      console.log("Reviews by me response:", res.data);
      const mapped = (res.data.result || []).map(item => mapReviewData(item, false));
      setReviewsByMe(mapped);
      setErrorByMe(null);
    } catch (err) {
      setErrorByMe("Failed to fetch reviews. Please try again later.");
    } finally {
      setLoadingByMe(false);
    }
  };

  const fetchReviewRequests = async () => {
    try {
      setLoadingRequests(true);
      const empCode = localStorage.getItem("empCode");
      const res = await axios.get(`${base_perspective}/get-all-prespective-of-taker?empCode=${empCode}`);
      console.log("Review requests response:", res.data);
      const requests = (res.data.result || []).filter(r => r.status === "request");
      console.log("Filtered requests:", requests);
      setReviewRequests(requests);
      setErrorRequests(null);
    } catch (err) {
      setErrorRequests("Failed to fetch review requests.");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'forMe') {
      fetchReviewsForMe();
    } else {
      fetchReviewsByMe();
    }
  }, [activeTab]);

  const handleOpen = () => {
    setOpen(true);
    fetchEmployees();
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm("");
    setPage(0);
  };

  const handleOpenReviewRequests = () => {
    setOpenReviewRequests(true);
    fetchReviewRequests();
  };

  const handleCloseReviewRequests = () => {
    setOpenReviewRequests(false);
    setSearchTerm("");
    setPage(0);
  };

  const handleRequest = async (employee) => {
    try {
      const payload = {
        takerEmpCode: employee.empCode,
        takerName: employee.name,
        takerEmail: employee.email,
        giverEmpCode: localStorage.getItem("empCode"),
        giverName: localStorage.getItem("name"),
        giverEmail: localStorage.getItem("email"),
        status: "request",
      };
      await axios.post(`${base_perspective}/request-prespective-data`, payload);

      Swal.fire({
        title: 'Success!',
        text: `Review request sent to ${employee.name}!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      handleClose();
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send request. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleOpenPerspectiveForm = (req) => {
    console.log("Opening perspective form with request:", req);
    setCurrentRequest(req);
    setOpenPerspectiveForm(true);
  };

  const handleClosePerspectiveForm = () => {
    setOpenPerspectiveForm(false);
    setCurrentRequest(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEmployeeInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return theme.palette.primary.main;
    const colors = [
      '#1976d2', '#388e3c', '#f57c00', '#7b1fa2',
      '#c62828', '#00796b', '#5e35b1', '#e64a19'
    ];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.empCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Sorting and pagination handlers for "forMe"
  const handleSortForMe = (field = sortFieldForMe) => {
    const newSortAsc = field === sortFieldForMe ? !sortAscForMe : true;
    setSortAscForMe(newSortAsc);
    setSortFieldForMe(field);

    setReviewsForMe(prev =>
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

  const handleChangePageForMe = (event, newPage) => setPageForMe(newPage);

  const handleChangeRowsPerPageForMe = (event) => {
    setRowsPerPageForMe(parseInt(event.target.value, 10));
    setPageForMe(0);
  };

  // Sorting and pagination handlers for "byMe"
  const handleSortByMe = (field = sortFieldByMe) => {
    const newSortAsc = field === sortFieldByMe ? !sortAscByMe : true;
    setSortAscByMe(newSortAsc);
    setSortFieldByMe(field);

    setReviewsByMe(prev =>
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

  const handleChangePageByMe = (event, newPage) => setPageByMe(newPage);

  const handleChangeRowsPerPageByMe = (event) => {
    setRowsPerPageByMe(parseInt(event.target.value, 10));
    setPageByMe(0);
  };

  // Function to render review card exactly like UserPerspective
  const renderReviewCard = (review, isForMe = true) => {
    const currentReviews = isForMe ? reviewsForMe : reviewsByMe;

    return (
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
                        { label: 'Communication', value: review.feedback.communication },
                        { label: 'Leadership', value: review.feedback.leadership },
                        { label: 'Stress Management', value: review.feedback.stressManagement },
                        { label: 'Learning', value: review.feedback.learning }
                      ]
                        .filter(item => item.value.rating > 3).map((item, i) => (
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
                        { label: 'Collaboration', value: review.feedback.collaboration },
                        { label: 'Initiative', value: review.feedback.initiative },
                        { label: 'Communication', value: review.feedback.communication },
                        { label: 'Leadership', value: review.feedback.leadership },
                        { label: 'Stress Management', value: review.feedback.stressManagement },
                        { label: 'Learning', value: review.feedback.learning }
                      ]
                        .filter(item => item.value.rating < 4).map((item, i) => (
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

          {/* Overall Positive and Negative sections */}
          {(review.feedback.overAllPossitive || review.feedback.overAllNegative) && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {review.feedback.overAllPossitive && (
                <Grid item xs={12} md={6}>
                  <SectionHeader>Overall Positive</SectionHeader>
                  <CommentText>{review.feedback.overAllPossitive}</CommentText>
                </Grid>
              )}
              {review.feedback.overAllNegative && (
                <Grid item xs={12} md={6}>
                  <SectionHeader>Areas of Improvement</SectionHeader>
                  <CommentText>{review.feedback.overAllNegative}</CommentText>
                </Grid>
              )}
            </Grid>
          )}

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
    );
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

        <Stack direction="row" spacing={2}>
          <Button
            variant={activeTab === 'forMe' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('forMe')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Reviews for me
          </Button>
          <Button
            variant={activeTab === 'byMe' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('byMe')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Reviews by me
          </Button>
          <Button
            variant="outlined"
            onClick={handleOpenReviewRequests}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Review Requests
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleOpen}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Request Review
          </Button>
        </Stack>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          fullWidth
          variant="outlined"
          placeholder="Search reviews by name, designation or comments..."
          value={searchTerm}
          onChange={handleSearchChange}
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

      {/* Stats Card - Updated with clickable filtering */}
      <Paper sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        backgroundColor: "#F8F9FA",
        boxShadow: 'none'
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box 
              textAlign="center"
              sx={{ 
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                backgroundColor: 'transparent',
                border: filterType === null ? '1px solid #0000FF' : 'transparent' ,
                '&:hover': { backgroundColor: 'action.hover' },
                transition: 'background-color 0.2s',
              }}
              onClick={() => setFilterType(null)}
            >
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {activeTab === 'forMe' ? reviewsForMe.length : reviewsByMe.length}
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
                {(() => {
                  const currentReviews = activeTab === 'forMe' ? reviewsForMe : reviewsByMe;
                  return currentReviews.length > 0
                    ? (currentReviews.reduce((sum, r) => sum + r.feedback.overallRating, 0) / currentReviews.length).toFixed(1)
                    : 0;
                })()}<Typography component="span" variant="h5">/5</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <Grade fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Average Rating
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box 
              textAlign="center"
              sx={{ 
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                backgroundColor:'transparent',
                border: filterType === 'positive' ? '1px solid #008000' : 'transparent' ,
                '&:hover': { backgroundColor: 'action.hover' },
                transition: 'background-color 0.2s'
              }}
              onClick={() => setFilterType(filterType === 'positive' ? null : 'positive')}
            >
              <Typography variant="h3" fontWeight={700} color="info.main">
                {(() => {
                  const currentReviews = activeTab === 'forMe' ? reviewsForMe : reviewsByMe;
                  return currentReviews.filter(r => r.feedback.overallRating > 3).length;
                })()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <ThumbUp fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Positive Reviews
              </Typography>
              
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box 
              textAlign="center"
              sx={{ 
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                backgroundColor:  'transparent',
                border: filterType === 'improvement' ? '1px solid #FF0000' : 'transparent' ,
                '&:hover': { backgroundColor: 'action.hover' },
                transition: 'background-color 0.2s'
              }}
              onClick={() => setFilterType(filterType === 'improvement' ? null : 'improvement')}
            >
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {(() => {
                  const currentReviews = activeTab === 'forMe' ? reviewsForMe : reviewsByMe;
                  return currentReviews.filter(r => r.feedback.overallRating <= 3).length;
                })()}
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
          onClick={() => activeTab === 'forMe' ? handleSortForMe('date') : handleSortByMe('date')}
          endIcon={
            (activeTab === 'forMe' ? sortFieldForMe : sortFieldByMe) === 'date' &&
            ((activeTab === 'forMe' ? sortAscForMe : sortAscByMe) ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)
          }
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
          onClick={() => activeTab === 'forMe' ? handleSortForMe('employeeName') : handleSortByMe('employeeName')}
          endIcon={
            (activeTab === 'forMe' ? sortFieldForMe : sortFieldByMe) === 'employeeName' &&
            ((activeTab === 'forMe' ? sortAscForMe : sortAscByMe) ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)
          }
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
          onClick={() => activeTab === 'forMe' ? handleSortForMe('overallRating') : handleSortByMe('overallRating')}
          endIcon={
            (activeTab === 'forMe' ? sortFieldForMe : sortFieldByMe) === 'overallRating' &&
            ((activeTab === 'forMe' ? sortAscForMe : sortAscByMe) ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)
          }
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

      {/* Review Cards - Updated with filtering */}
      {(() => {
        const currentReviews = activeTab === 'forMe' ? reviewsForMe : reviewsByMe;
        const filteredReviews = getFilteredReviews(currentReviews);
        const paginatedReviews = filteredReviews.slice(
          (activeTab === 'forMe' ? pageForMe : pageByMe) * (activeTab === 'forMe' ? rowsPerPageForMe : rowsPerPageByMe),
          (activeTab === 'forMe' ? pageForMe : pageByMe) * (activeTab === 'forMe' ? rowsPerPageForMe : rowsPerPageByMe) + 
          (activeTab === 'forMe' ? rowsPerPageForMe : rowsPerPageByMe)
        );
        
        const currentLoading = activeTab === 'forMe' ? loadingForMe : loadingByMe;
        const currentError = activeTab === 'forMe' ? errorForMe : errorByMe;

        if (currentLoading) {
          return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          );
        }

        if (currentError) {
          return <Alert severity="error" sx={{ m: 3 }}>{currentError}</Alert>;
        }

        // Show filter indicator
        const getFilterMessage = () => {
          if (filterType === 'positive') return 'Showing positive reviews (rating > 3 stars)';
          if (filterType === 'improvement') return 'Showing reviews that need improvement (rating ≤ 3 stars)';
          return null;
        };

        const filterMessage = getFilterMessage();

        return (
          <>
            {/* {filterMessage && (
              <Alert 
                severity="info" 
                sx={{ mb: 3 }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={() => setFilterType(null)}
                  >
                    Clear Filter
                  </Button>
                }
              >
                {filterMessage}
              </Alert>
            )} */}
            
            {paginatedReviews.length > 0 ? (
              paginatedReviews.map((review) => renderReviewCard(review, activeTab === 'forMe'))
            ) : (
              <Paper sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(to bottom, #f9f9f9, #f0f0f0)'
              }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  {filterType ? 'No reviews match the current filter' : 'No performance reviews available'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {filterType ? 'Try removing the filter or selecting a different category' : 'Create your first review to get started'}
                </Typography>
                {filterType && (
                  <Button
                    variant="outlined"
                    sx={{ mr: 2, borderRadius: 2 }}
                    onClick={() => setFilterType(null)}
                  >
                    Clear Filter
                  </Button>
                )}
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                  onClick={handleOpen}
                  startIcon={<SendIcon />}
                >
                  Request New Review
                </Button>
              </Paper>
            )}
          </>
        );
      })()}

      {/* Pagination - Updated for filtering */}
      {(() => {
        const currentReviews = activeTab === 'forMe' ? reviewsForMe : reviewsByMe;
        const filteredReviews = getFilteredReviews(currentReviews);
        const currentPage = activeTab === 'forMe' ? pageForMe : pageByMe;
        const currentRowsPerPage = activeTab === 'forMe' ? rowsPerPageForMe : rowsPerPageByMe;
        const handleChangePage = activeTab === 'forMe' ? handleChangePageForMe : handleChangePageByMe;
        const handleChangeRowsPerPage = activeTab === 'forMe' ? handleChangeRowsPerPageForMe : handleChangeRowsPerPageByMe;

        return filteredReviews.length > 0 && (
          <TablePagination
            component="div"
            count={filteredReviews.length}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={currentRowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
            sx={{
              mt: 3,
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 0
              }
            }}
          />
        );
      })()}

      {/* Dialog for Request Review */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
            Request Review from Employee
          </Typography>
          <IconButton sx={{ ml: "auto" }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ px: 3, pb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 3 }}>
            {error}
          </Alert>
        ) : (
          <Paper elevation={0} sx={{ m: 3, borderRadius: 3, overflow: "hidden" }}>
            <StyledTableContainer>
              <Table stickyHeader>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Employee</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Role</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => (
                      <StyledTableRow key={employee.empCode}>
                        <StyledTableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <EmployeeAvatar
                              sx={{ backgroundColor: getAvatarColor(employee.name) }}
                            >
                              {getEmployeeInitials(employee.name)}
                            </EmployeeAvatar>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {employee.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Emp Code: {employee.empCode}
                              </Typography>
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography variant="body2">{employee.email}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employee.mobileNumber}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              backgroundColor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            {employee.role || 'N/A'}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Tooltip title="Send review request">
                            <RequestButton
                              onClick={() => handleRequest(employee)}
                              startIcon={<SendIcon />}
                            >
                              Request
                            </RequestButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">
                            No employees found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm ? "Try adjusting your search" : "No employees available"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredEmployees.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Dialog>

      {/* Dialog for Review Requests */}
      <Dialog
        open={openReviewRequests}
        onClose={handleCloseReviewRequests}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
            Review Requests
          </Typography>
          <IconButton sx={{ ml: "auto" }} onClick={handleCloseReviewRequests}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {loadingRequests ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : errorRequests ? (
          <Alert severity="error" sx={{ m: 3 }}>
            {errorRequests}
          </Alert>
        ) : (
          <Paper elevation={0} sx={{ m: 3, borderRadius: 3, overflow: "hidden" }}>
            <StyledTableContainer>
              <Table stickyHeader>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>From</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {reviewRequests.length > 0 ? (
                    reviewRequests.map((req) => (
                      <StyledTableRow key={req.perspectiveId || req.prespectiveId || req.id}>
                        <StyledTableCell>{req.giverName}</StyledTableCell>
                        <StyledTableCell>{req.giverEmail}</StyledTableCell>
                        <StyledTableCell>{req.createdAt?.slice(0, 10)}</StyledTableCell>
                        <StyledTableCell align="center">
                          <Tooltip title="Fill Perspective">
                            <RequestButton
                              onClick={() => handleOpenPerspectiveForm(req)}
                              startIcon={<SendIcon />}
                            >
                              Review
                            </RequestButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">
                            No review requests found
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Paper>
        )}
      </Dialog>

      {/* Enhanced Perspective Form Dialog */}
      {openPerspectiveForm && (
        <PrespectiveForm
          open={openPerspectiveForm}
          onClose={handleClosePerspectiveForm}
          data={currentRequest}
          perspectiveId={currentRequest?.perspectiveId || currentRequest?.prespectiveId || currentRequest?.id}
          selectedEmployee={{
            empCode: currentRequest?.takerEmpCode,
            name: currentRequest?.takerName,
            email: currentRequest?.takerEmail
          }}
          onSubmit={async (formData, isEditMode) => {
            try {
              const payload = {
                ...formData,
                organizationCode: localStorage.getItem("organizationCode"),
                prespectiveId: currentRequest?.perspectiveId || currentRequest?.prespectiveId || currentRequest?.id || "",
              };

              console.log("Submitting payload:", payload);

              await axios.post(`${base_perspective}/add-prespective-of-emp`, payload);

              Swal.fire({
                title: 'Success!',
                text: 'Perspective submitted successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              });

              handleClosePerspectiveForm();
              fetchReviewRequests();

              if (activeTab === 'forMe') {
                fetchReviewsForMe();
              } else {
                fetchReviewsByMe();
              }
            } catch (error) {
              console.error('Error submitting perspective:', error);
              Swal.fire({
                title: 'Error!',
                text: 'Failed to submit perspective. Please try again.',
                icon: 'error',
              });
            }
          }}
        />
      )}
    </Box>
  );
};

export default MyPerspective;
