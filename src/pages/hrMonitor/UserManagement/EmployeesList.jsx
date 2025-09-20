

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
  Chip,
  TablePagination,
  useTheme,
  alpha,
  styled,
  Divider,
  InputAdornment,
  TextField,
  IconButton,
  Tooltip,
  Switch,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { base_identity } from "../../../http/services";
import Swal from "sweetalert2";
import CircleIcon from "@mui/icons-material/Circle";
import LockIcon from "@mui/icons-material/Lock";
import AddEmployeeDrawer from "./AddEmployeeDrawer";
import AddDetailsDialog from "./adddetailscomponents/AddDetailsDialog";
import BulkUploadDialog from "./BulkUploadDialog";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";

// ... all your styled components here (unchanged)
// (copy all the styled components code above)


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
    backgroundColor: " #4372C8",
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
    textAlign: "center",
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
  textAlign: "center",
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 500,
  borderRadius: 8,
  fontSize: "0.75rem",
  letterSpacing: "0.3px",
  padding: "0 8px",
  ...(color === "primary" && {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
  }),
  ...(color === "success" && {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
  }),
  ...(color === "error" && {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    border: `1px solid ${alpha(theme.palette.error.main, 0.25)}`,
  }),
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  background: "linear-gradient(135deg, #1976D2 0%, #00B0FF 100%)",
  boxShadow: "0 6px 16px rgba(33, 150, 243, 0.25)",
  transition: "transform 0.15s ease, box-shadow 0.25s ease, background 0.25s ease",
  textTransform: "none",
  fontWeight: 700,
  letterSpacing: 0.2,
  color: "white",
  padding: theme.spacing(1.1, 2.2),
  "&:hover": {
    transform: "translateY(-1px)",
    background: "linear-gradient(135deg, #1482e0 0%, #11b5ff 100%)",
    boxShadow: "0 10px 20px rgba(33, 150, 243, 0.30)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 6px 12px rgba(33, 150, 243, 0.25)",
  },
  "&:focus-visible": {
    outline: `2px solid ${alpha(theme.palette.primary.main, 0.25)}`,
    outlineOffset: 2,
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    backgroundColor: alpha(theme.palette.common.white, 0.95),
    height: 46,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    transition: theme.transitions.create([
      "background-color",
      "box-shadow",
      "border-color",
    ]),
    "&:hover": {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
      borderColor: alpha(theme.palette.primary.main, 0.25),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
      borderColor: alpha(theme.palette.primary.main, 0.35),
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px",
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

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.5, 0),
}));

const ActionButton = styled(Button)(({ theme, color = "primary" }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.75rem",
  padding: theme.spacing(0.5, 1.5),
  minWidth: "auto",
  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  transition: "all 0.2s ease",
  backgroundColor: alpha(theme.palette[color].main, 0.1),
  color: theme.palette[color].main,
  border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette[color].main, 0.2),
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
  },
  "&.Mui-disabled": {
    backgroundColor: alpha(theme.palette.action.disabledBackground, 0.5),
    color: alpha(theme.palette[color].main, 0.5),
    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
    opacity: 0.9,
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(0.5, 1),
    "& .MuiButton-startIcon": {
      margin: 0,
    },
    "& .buttonText": {
      display: "none",
    },
  },
}));

const DeleteActionButton = styled(ActionButton)(({ theme, disabled }) => ({
  position: "relative",
  ...(disabled && {
    backgroundColor: alpha(theme.palette.error.main, 0.12),
    color: alpha(theme.palette.error.main, 0.7),
    border: `1px dashed ${alpha(theme.palette.error.main, 0.3)}`,
    cursor: "not-allowed",
    fontWeight: 600,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: alpha(theme.palette.error.main, 0.15),
      transform: "none",
      boxShadow: "none",
    },
  }),
}));

const LockBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: alpha(theme.palette.warning.main, 0.9),
    color: theme.palette.warning.contrastText,
    width: 22,
    height: 22,
    borderRadius: "50%",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  borderRadius: 12,
  fontSize: "0.75rem",
  letterSpacing: "0.3px",
  padding: "0 8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  ...(status === "ON" && {
    backgroundColor: alpha(theme.palette.success.main, 0.15),
    color: theme.palette.success.dark,
    border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
  }),
  ...(status === "OFF" && {
    backgroundColor: alpha(theme.palette.error.main, 0.15),
    color: theme.palette.error.dark,
    border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
  }),
}));

const StatusContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.5, 0),
}));

const StatusSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": {
      color: theme.palette.success.main,
      "& + .MuiSwitch-track": {
        backgroundColor: alpha(theme.palette.success.main, 0.5),
        opacity: 0.8,
      },
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: alpha(theme.palette.error.main, 0.5),
    opacity: 0.8,
  },
}));

const EmployeesList = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [failedEmails, setFailedEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Role switch state
  const [roleSwitchAnchorEl, setRoleSwitchAnchorEl] = useState(null);
  const [roleSwitchUser, setRoleSwitchUser] = useState(null);
  const [roleSwitchLoading, setRoleSwitchLoading] = useState(false);

  const handleBulkUploadOpen = () => {
    setIsBulkUploadOpen(true);
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleBulkUploadClose = () => {
    setIsBulkUploadOpen(false);
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }
    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(null);
      setFailedEmails([]);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        `${base_identity}/identity-handler/auth/add-All-bulk-existing-emp`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.notInserted && response.data.notInserted.length > 0) {
        setFailedEmails(response.data.notInserted);
        setUploadError(
          `${response.data.notInserted.length} employees could not be inserted.`,
        );
      } else {
        setUploadSuccess("All employees uploaded successfully!");
      }

      fetchUsers();
    } catch (error) {
      setUploadError(
        error.response?.data?.message ||
          "Failed to upload employees. Please check the file format.",
      );
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem(
          "organizationCode",
        )}`,
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = (mode = "add", employee = null) => {
    setDrawerMode(mode);
    setSelectedEmployee(employee);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEmployee(null);
  };

  const handleEmployeeSuccess = () => {
    fetchUsers();
    closeDrawer();
  };

  const openDetailsDialog = (employee) => {
    setCurrentEmployee(employee);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setCurrentEmployee(null);
  };

  const handleDeleteEmployee = async (employee) => {
    if (employee.status === "ON") {
      Swal.fire({
        title: "Cannot Delete Active Employee",
        text: "Please deactivate the employee first before deleting.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${employee.name}'s account?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Deleting...",
            text: "Please wait while we delete the employee",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          const response = await axios.post(
            `${base_identity}/identity-handler/auth/delete-by-empCode?empCode=${employee.empCode}`,
          );
          if (response.status === 200) {
            const updatedUsers = users.filter(
              (user) => user.empCode !== employee.empCode,
            );
            setUsers(updatedUsers);
            Swal.fire(
              "Deleted!",
              `${employee.name}'s account has been deleted.`,
              "success",
            );
          } else {
            throw new Error("Failed to delete employee");
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            "Failed to delete the employee. Please try again.",
            "error",
          );
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobileNumber?.includes(searchTerm) ||
      user.empCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate; // Newest first
  });
  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      setStatusUpdating(userId);
      const newStatus = currentStatus === "ON" ? "OFF" : "ON";
      await axios.post(
        `${base_identity}/identity-handler/create/freeze?empCode=${userId}`,
      );
      setUsers(
        users.map((user) =>
          user.empNumber === userId ? { ...user, status: newStatus } : user,
        ),
      );
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Employee status has been ${
          newStatus === "ON" ? "activated" : "deactivated"
        }`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again.",
      });
    } finally {
      setStatusUpdating(null);
    }
  };

  // ------------------------------------
  // Handle Switch Role Logic (Dropdown)
  // ------------------------------------
  const handleOpenRoleSwitchMenu = (event, user) => {
    setRoleSwitchAnchorEl(event.currentTarget);
    setRoleSwitchUser(user);
  };

  const handleCloseRoleSwitchMenu = () => {
    setRoleSwitchAnchorEl(null);
    setRoleSwitchUser(null);
    setRoleSwitchLoading(false);
  };

  const handleRoleSwitch = async (newRole) => {
    if (!roleSwitchUser) return;
    setRoleSwitchLoading(true);
    try {
      const companyCode = localStorage.getItem("organizationCode");
      const empCode = roleSwitchUser.empCode;
      await axios.post(
        `${base_identity}/identity-handler/auth/update-role?CompanyCode=${companyCode}&empCode=${empCode}&role=${newRole}`,
      );
      Swal.fire({
        icon: "success",
        title: "Role Updated",
        text: `${roleSwitchUser.name}'s role is now ${newRole}`,
        timer: 1800,
        showConfirmButton: false,
      });
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update role. Please try again.",
      });
    }
    handleCloseRoleSwitchMenu();
  };

  // Main render
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
          <Button color="inherit" size="small" onClick={fetchUsers}>
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
      {/* HEADER */}
      <HeaderContainer>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
            All Employees
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage and view all employee accounts
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
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    size="small"
                    onClick={() => setSearchTerm("")}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          <GradientButton startIcon={<CloudUploadIcon />} onClick={handleBulkUploadOpen}>
            Add Bulk Data
          </GradientButton>
          <GradientButton startIcon={<AddIcon />} onClick={() => openDrawer("add")}>
            Add Employee
          </GradientButton>
        </Box>
      </HeaderContainer>

      <Divider sx={{ mb: 3, opacity: 0.6 }} />

      {/* TABLE */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        }}
      >
        <StyledTableContainer>
          <Table stickyHeader aria-label="employees table">
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Emp Code</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Mobile Number</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Employee Type</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <StyledTableRow key={user.id}>
                    <StyledTableCell>
                      {page * rowsPerPage + index + 1}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {user.empCode}
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 500 }}>{user.name}</StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>{user.mobileNumber}</StyledTableCell>
                    <StyledTableCell>
                      <StyledChip
                        label={user.role}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <StyledChip
                        label={user.empType || "N/A"}
                        color="info"
                        size="small"
                        variant="outlined"
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <StatusContainer>
                        {statusUpdating === user.id ? (
                          <CircularProgress size={20} thickness={5} sx={{ color: "primary.main" }} />
                        ) : (
                          <StatusSwitch
                            checked={user.status === "ON"}
                            onChange={() => handleStatusChange(user.empNumber, user.status)}
                            size="small"
                          />
                        )}
                      </StatusContainer>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <ActionsContainer>
                        {/* Details Button with status-aware styling */}
                        {(() => {
                          const isPending = (user.empDetails || "").toLowerCase() === "pending";
                          const detailsColor = isPending ? "warning" : "success";
                          const detailsTitle = isPending ? "Details pending" : "Details uploaded";
                          const detailsIcon = isPending ? (
                            <WarningAmberIcon fontSize="small" />
                          ) : (
                            <CheckCircleOutlineIcon fontSize="small" />
                          );
                          return (
                            <Tooltip title={detailsTitle} arrow placement="top">
                              <ActionButton
                                size="small"
                                color={detailsColor}
                                onClick={() => openDetailsDialog(user)}
                                startIcon={detailsIcon}
                              >
                                <span className="buttonText">Details</span>
                              </ActionButton>
                            </Tooltip>
                          );
                        })()}
                        {/* Edit Button */}
                        <Tooltip title="Edit Employee Information" arrow placement="top">
                          <ActionButton
                            size="small"
                            color="warning"
                            onClick={() => openDrawer("edit", user)}
                            startIcon={<EditIcon fontSize="small" />}
                          >
                            <span className="buttonText">Edit</span>
                          </ActionButton>
                        </Tooltip>
                        {/* Role Switch Dropdown */}
                        {localStorage.getItem("role") === "COMPANY" && (
                          <>
                            <Tooltip title="Switch Employee Role" arrow placement="top">
                              <ActionButton
                                size="small"
                                color="success"
                                startIcon={<EditIcon fontSize="small" />}
                                onClick={(e) => handleOpenRoleSwitchMenu(e, user)}
                                disabled={roleSwitchLoading}
                              >
                                <span className="buttonText">Role Switch</span>
                              </ActionButton>
                            </Tooltip>
                          </>
                        )}
                        {/* Delete */}
                        <Tooltip
                          title={
                            user.status === "ON"
                              ? "Cannot delete active employee. Deactivate first."
                              : "Delete Employee"
                          }
                          arrow
                          placement="top"
                        >
                          <span>
                            {user.status === "ON" ? (
                              <LockBadge
                                badgeContent={<LockIcon style={{ fontSize: 12 }} />}
                                overlap="circular"
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                              >
                                <DeleteActionButton
                                  size="small"
                                  color="error"
                                  disabled={true}
                                  startIcon={<DeleteIcon fontSize="small" />}
                                  disableTouchRipple
                                  disableElevation
                                >
                                  <span className="buttonText">Delete</span>
                                </DeleteActionButton>
                              </LockBadge>
                            ) : (
                              <DeleteActionButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteEmployee(user)}
                                startIcon={<DeleteIcon fontSize="small" />}
                              >
                                <span className="buttonText">Delete</span>
                              </DeleteActionButton>
                            )}
                          </span>
                        </Tooltip>
                      </ActionsContainer>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <EmptyStateContainer>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No employees found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm
                          ? "Try adjusting your search terms or clear the search"
                          : "Add employees to get started"}
                      </Typography>
                      {searchTerm && (
                        <Button sx={{ mt: 2 }} size="small" onClick={() => setSearchTerm("")}>
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
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

      {/* Employee Drawer */}
      <AddEmployeeDrawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        onSuccess={handleEmployeeSuccess}
        mode={drawerMode}
        employeeData={selectedEmployee}
      />

      {/* Employee Details Dialog */}
      <AddDetailsDialog
        open={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        employee={currentEmployee}
      />

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onClose={handleBulkUploadClose}
        onSuccess={() => {
          fetchUsers();
          handleBulkUploadClose();
        }}
      />

      {/* Role Switch Menu */}
      <Menu
        anchorEl={roleSwitchAnchorEl}
        open={Boolean(roleSwitchAnchorEl)}
        onClose={handleCloseRoleSwitchMenu}
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: 2,
            minWidth: 220,
            overflow: 'hidden',
            border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: theme => `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
          <Typography variant="subtitle2" color="text.secondary">Switch Role</Typography>
          {roleSwitchUser && (
            <Typography variant="body2" fontWeight={600}>{roleSwitchUser.name}</Typography>
          )}
        </Box>
        <MenuItem
          onClick={() => handleRoleSwitch("EMP")}
          disabled={roleSwitchLoading}
          sx={{
            py: 1.2,
            '&:hover': { backgroundColor: theme => alpha(theme.palette.primary.main, 0.06) }
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>EMP</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleRoleSwitch("HR")}
          disabled={roleSwitchLoading}
          sx={{
            py: 1.2,
            '&:hover': { backgroundColor: theme => alpha(theme.palette.secondary.main, 0.06) }
          }}
        >
          <ListItemIcon>
            <SupervisorAccountIcon fontSize="small" color="secondary" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>HR</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EmployeesList;
