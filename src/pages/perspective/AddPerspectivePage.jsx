import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  TablePagination,
  useTheme,
  alpha,
  styled,
  Divider,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PersonIcon from "@mui/icons-material/Person";
import Swal from "sweetalert2";
import { base_identity } from "../../http/services";
import PrespectiveForm from "./PerspectiveForm";

// Styled components for enhanced visuals
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 230px)",
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
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
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transition: "background-color 0.2s ease",
    cursor: "pointer",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem",
  padding: theme.spacing(1.5, 2),
  borderColor: alpha(theme.palette.divider, 0.5),
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    height: 42,
    transition: theme.transitions.create([
      "background-color",
      "box-shadow",
      "border-color",
    ]),
    "&:hover": {
      backgroundColor: theme.palette.common.white,
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 14px",
    paddingLeft: "8px",
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(2),
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: 12,
  minHeight: 300,
}));

const ReviewButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.875rem",
  padding: theme.spacing(1, 2.5),
  background: "linear-gradient(45deg, #6ba9ffff 30%, #538fffff 90%)",
  color: "white",
  boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
  transition: "all 0.3s ease",
  minWidth: 140,
  "&:hover": {
    background: "linear-gradient(45deg, #538fffff 30%, #6ba9ffff 90%)",
    boxShadow: "0 6px 16px rgba(255, 107, 107, 0.4)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
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
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
}));

const EmployeeInfoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 0),
}));

const EmployeeDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

const EmployeeName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: "0.95rem",
  lineHeight: 1.2,
}));

const EmployeeSubInfo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.8rem",
  lineHeight: 1.2,
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  textAlign: "center",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const AddPerspectivePage = () => {
  const theme = useTheme();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Review form states
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedEmployeeForReview, setSelectedEmployeeForReview] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem(
          "organizationCode"
        )}`
      );
      const data = Array.isArray(response.data) ? response.data : [];
      // Filter out the current user (giver) from the list
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

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.empCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply pagination
  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle add review - opens the perspective form
  const handleAddReview = (employee) => {
    setSelectedEmployeeForReview(employee);
    setIsReviewFormOpen(true);
  };

  // Handle review form close
  const handleReviewFormClose = () => {
    setIsReviewFormOpen(false);
    setSelectedEmployeeForReview(null);
  };

  // Handle review form submission success
  const handleReviewSubmit = (formData) => {
    console.log('Review submitted:', formData);
    
    // Show success message
    Swal.fire({
      title: 'Success!',
      text: `Perspective assessment submitted successfully for ${formData.takerName}!`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });

    // The form will auto-close after successful submission
    // You can add additional logic here if needed
  };

  // Get employee initials for avatar
  const getEmployeeInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Get avatar color based on employee name
  const getAvatarColor = (name) => {
    if (!name) return theme.palette.primary.main;
    const colors = [
      '#1976d2', '#388e3c', '#f57c00', '#7b1fa2', 
      '#c62828', '#00796b', '#5e35b1', '#e64a19'
    ];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          marginTop: 2,
        }}
        action={
          <Button color="inherit" size="small" onClick={fetchEmployees}>
            Try Again
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <HeaderContainer>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary.main"
          >
            Add Perspective Reviews
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Select employees to add performance reviews and feedback
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <SearchTextField
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </HeaderContainer>

      {/* Stats Section */}
      {/* <Box sx={{ mb: 3 }}>
        <StatsCard>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
            {filteredEmployees.length}
          </Typography>
          <Typography variant="body1">
            {searchTerm ? "Matching Employees" : "Total Employees Available for Review"}
          </Typography>
        </StatsCard>
      </Box> */}

      <Divider sx={{ mb: 3, opacity: 0.6 }} />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        }}
      >
        <StyledTableContainer>
          <Table stickyHeader aria-label="employees perspective table">
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
                  <StyledTableRow 
                    key={employee.id || employee.empCode}
                    onClick={() => handleAddReview(employee)}
                  >
                    <StyledTableCell>
                      <EmployeeInfoContainer>
                        <EmployeeAvatar
                          sx={{ backgroundColor: getAvatarColor(employee.name) }}
                        >
                          {getEmployeeInitials(employee.name)}
                        </EmployeeAvatar>
                        <EmployeeDetails>
                          <EmployeeName>
                            {employee.name}
                          </EmployeeName>
                          <EmployeeSubInfo>
                            Emp Code: {employee.empCode}
                          </EmployeeSubInfo>
                        </EmployeeDetails>
                      </EmployeeInfoContainer>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2" color="text.primary">
                        {employee.email}
                      </Typography>
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
                          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        }}
                      >
                        {employee.role || 'N/A'}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Tooltip title="Add Performance Review" arrow placement="top">
                        <ReviewButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddReview(employee);
                          }}
                          startIcon={<RateReviewIcon />}
                        >
                          Add Review
                        </ReviewButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <EmptyStateContainer>
                      <PersonIcon
                        sx={{
                          fontSize: 64,
                          color: "text.secondary",
                          mb: 2,
                          opacity: 0.5,
                        }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No employees found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm
                          ? "Try adjusting your search terms or clear the search"
                          : "No employees available for review"}
                      </Typography>
                      {searchTerm && (
                        <Button
                          sx={{ mt: 2 }}
                          size="small"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </Button>
                      )}
                    </EmptyStateContainer>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: "0.875rem",
                color: theme.palette.text.secondary,
              },
            ".MuiTablePagination-select": {
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
            },
          }}
        />
      </Paper>

      {/* Perspective Form Dialog */}
      <PrespectiveForm
        open={isReviewFormOpen}
        onClose={handleReviewFormClose}
        onSubmit={handleReviewSubmit}
        selectedEmployee={selectedEmployeeForReview}
      />
    </Box>
  );
};

export default AddPerspectivePage;
