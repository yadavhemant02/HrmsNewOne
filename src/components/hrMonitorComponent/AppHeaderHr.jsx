import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCompanyLogo } from "../../hooks/useCompanyLogo";
import NotificationHr from "../../components/hrMonitorComponent/notification/NotificationHr"; // Import the separate component
import UploadLogoDialog from "../../pages/auth/UploadLogoDialog";
import axios from "axios";
// import { base_hr } from "../../../http/services";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  Badge,
  CircularProgress,
  Chip,
  Fade,
} from "@mui/material";

// Material UI Icons
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonIcon from "@mui/icons-material/Person";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector, useDispatch } from "react-redux";
import { base_hr } from "../../http/services";

const AppHeaderHr = ({ open, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploadLogoDialogOpen, setIsUploadLogoDialogOpen] = useState(false);

  // Use custom hook for company logo
  const { logoUrl, logoLoading, logoError, refetchLogo } = useCompanyLogo();

  // Menu state management
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [roleMenuAnchorEl, setRoleMenuAnchorEl] = useState(null);
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] =
    useState(null);

  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);
  const isRoleMenuOpen = Boolean(roleMenuAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationMenuAnchorEl);

  const userDetails = useSelector((state) => state.auth.user);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_hr}/hr-handler/notification/show-notification-hr-side?showTarget=all&organizationCode=${userDetails.organizationCode}`,
        {
          headers: {
            accept: '*/*',
          },
        }
      );

      if (response.data.status === 201) {
        // Transform the API response to match our notification format
        const transformedNotifications = response.data.result.map(notification => ({
          id: notification.id,
          title: notification.titile, // Note: API has a typo in 'titile'
          message: notification.message,
          type: 'announcement', // Default type since API doesn't provide it
          timestamp: notification.createdAt,
          read: notification.views && notification.views.length > 0,
          details: {
            notificationCode: notification.notificationCode,
            userCode: notification.userCode,
            showTarget: notification.showTarget,
            createdAt: notification.createdAt,
            modifyAt: notification.modifyAt,
          }
        }));
        setNotifications(transformedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userDetails.organizationCode]);

  // User roles and active role
  const userRoles = ["HR", "Employee"];
  const activeRole = userDetails.activeRole || "HR";

  // Utility functions for role management
  const getRoleIcon = (role) => {
    switch (role) {
      case "HR":
        return <SupervisorAccountIcon fontSize="small" />;
      case "Employee":
        return <PersonIcon fontSize="small" />;
      default:
        return <PersonIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "HR":
        return "#2196F3"; // Blue
      case "Employee":
        return "#4CAF50"; // Green
      default:
        return "#9E9E9E"; // Grey
    }
  };

  const getDisplayName = (role) => {
    if (role === "HR") {
      return userDetails.hrName || userDetails.name;
    } else if (role === "Employee") {
      return userDetails.empName || userDetails.name;
    }
    return userDetails.name;
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleRoleMenuOpen = (event) => {
    event.stopPropagation();
    setRoleMenuAnchorEl(event.currentTarget);
  };

  const handleRoleMenuClose = () => {
    setRoleMenuAnchorEl(null);
  };

  // Notification menu handlers
  const handleNotificationMenuOpen = (event) => {
    setNotificationMenuAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchorEl(null);
  };

  // Notification action handlers
  const handleViewAllNotifications = () => {
    // Navigate to full notifications page
    navigate("/notifications");
    console.log("Navigating to all notifications page");
  };

  // Role switching handler
  const handleSwitchRole = (newRole) => {
    // In a real app, you would dispatch an action to update the active role
    // dispatch(switchRole(newRole));
    console.log(`Switching to role: ${newRole}`);

    if (newRole === "HR") {
      navigate("/dashboard-hr");
    }
    if (newRole === "Employee" || userDetails.role === "COMPANY") {
      navigate("/dashboard-emp", { state: { roleData: "Employee" } });
    }
    handleRoleMenuClose();
  };

  // Logout handlers
  const handleLogoutClick = () => {
    handleProfileMenuClose();
    setIsLogoutDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  // Get unread notification count
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Company logo rendering
  const renderCompanyLogo = () => {
    if (logoLoading) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <CircularProgress size={24} color="inherit" />
        </Box>
      );
    }

    if (logoError || !logoUrl) {
      return null;
    }

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: 40,
          mr: 2,
          borderRight: "1px solid rgba(255, 255, 255, 0.15)",
          pr: 2,
        }}
      >
        <img
          src={logoUrl}
          alt={userDetails.organizationName}
          style={{
            maxHeight: "100%",
            maxWidth: "120px",
            objectFit: "contain",
          }}
        />
      </Box>
    );
  };

  const shouldShowHR360 = logoError || !logoUrl;

  // Add this function near other handler functions
  const handleLogoClick = () => {
    navigate("/");
  };

  // Add this new handler
  const handleUploadLogoClick = () => {
    handleProfileMenuClose();
    setIsUploadLogoDialogOpen(true);
  };

  // Add this new handler
  const handleLogoUploaded = () => {
    // Refresh the logo
    refetchLogo();
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1e1e2d",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          {/* Left side - Menu toggle */}
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          {/* Left side - Company Logo or HR HaaT text */}
          <Box onClick={handleLogoClick} sx={{ display: "flex", alignItems: "center", cursor: "pointer  "}}>
            {renderCompanyLogo()}

            {shouldShowHR360 && (
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8
                  }
                }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  HR
                </Typography>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ ml: 0.5, color: "#2196f3", fontWeight: "bold" }}
                >
                  HaaT
                </Typography>
              </Box>
            )}
          </Box>

          {/* Center - Organization Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#2196f3",
                fontWeight: 600,
                letterSpacing: "0.02em",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {userDetails.organizationName}
            </Typography>
          </Box>

          {/* Right side - Notifications and Profile */}
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            {/* Notifications Button */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                sx={{ mr: 1 }}
                onClick={handleNotificationMenuOpen}
              >
                <Badge badgeContent={unreadNotificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Button */}
            <Button
              onClick={handleProfileMenuOpen}
              sx={{
                color: "white",
                textTransform: "none",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                },
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: getRoleColor(activeRole),
                  mr: 1,
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                {getInitials(getDisplayName(activeRole))}
              </Avatar>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", lineHeight: 1.2 }}
                >
                  {getDisplayName(activeRole)}
                </Typography>
                <Chip
                  icon={getRoleIcon(activeRole)}
                  label={
                    userDetails.role === "COMPANY" ? "COMPANY" : activeRole
                  }
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    backgroundColor: `${getRoleColor(activeRole)}22`,
                    color: getRoleColor(activeRole),
                    border: `1px solid ${getRoleColor(activeRole)}44`,
                    "& .MuiChip-icon": {
                      fontSize: "0.65rem",
                      color: getRoleColor(activeRole),
                    },
                  }}
                />
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification Dropdown Component */}
      <NotificationHr
        anchorEl={notificationMenuAnchorEl}
        open={isNotificationMenuOpen}
        onClose={handleNotificationMenuClose}
        notifications={notifications}
        onViewAll={handleViewAllNotifications}
      />

      {/* Add UploadLogoDialog */}
      <UploadLogoDialog
        open={isUploadLogoDialogOpen}
        handleClose={() => setIsUploadLogoDialogOpen(false)}
        organizationName={userDetails.organizationName}
        isRegistration={false}
        onLogoUploaded={handleLogoUploaded}
      />

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchorEl}
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 5,
          sx: {
            width: 280,
            mt: 1.5,
            overflow: "visible",
            borderRadius: 2,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: getRoleColor(activeRole),
                mr: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {getInitials(getDisplayName(activeRole))}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", lineHeight: 1.2 }}
              >
                {getDisplayName(activeRole)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                {userDetails.email}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                {userDetails.organizationName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                <span>Company Code:</span>
                {userDetails.organizationCode}
              </Typography>
            </Box>
          </Box>

          {/* Current Role with Switch Option */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              p: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: `${getRoleColor(activeRole)}22`,
                  mr: 1.5,
                }}
              >
                {getRoleIcon(activeRole)}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Current Role
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {activeRole}
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SwitchAccountIcon fontSize="small" />}
              onClick={handleRoleMenuOpen}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                borderColor: "divider",
                color: "text.primary",
              }}
            >
              Switch
            </Button>

            {/* Role Switch Menu */}
            <Menu
              anchorEl={roleMenuAnchorEl}
              open={isRoleMenuOpen}
              onClose={handleRoleMenuClose}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: 200,
                  mt: 1,
                  borderRadius: 2,
                  maxHeight: 300,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Typography
                variant="subtitle2"
                sx={{ px: 2, py: 1, color: "text.secondary" }}
              >
                Select Role
              </Typography>
              <Divider />
              {userRoles.map((role) => (
                <MenuItem
                  key={role}
                  onClick={() => handleSwitchRole(role)}
                  selected={role === activeRole}
                  sx={{
                    px: 2,
                    py: 1.5,
                    "&.Mui-selected": {
                      bgcolor: `${getRoleColor(role)}10`, // 10 is hex for 6% opacity
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: `${getRoleColor(role)}22`,
                      }}
                    >
                      {getRoleIcon(role)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={role}
                    sx={{
                      m: 0,
                      "& .MuiTypography-root": {
                        fontWeight: role === activeRole ? "bold" : "regular",
                      },
                    }}
                  />
                  {role === activeRole && (
                    <CheckCircleIcon
                      fontSize="small"
                      sx={{ color: getRoleColor(role), ml: 1 }}
                    />
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        {/* Add new Upload Logo menu item */}
        <MenuItem onClick={handleUploadLogoClick} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <CloudUploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload Company Logo</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Account Settings</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help & Support</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogoutClick}
          sx={{
            color: "error.main",
            py: 1.5,
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ pb: 1 }}>
          {"Confirm Logout"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out? You will be redirected to the
            login page.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsLogoutDialogOpen(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            variant="contained"
            startIcon={<LogoutIcon />}
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppHeaderHr;
