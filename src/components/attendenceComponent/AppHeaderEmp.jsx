import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationEmp from "../../components/attendenceComponent/notificationemp/NotificationEmp";
import axios from "axios";
import { base_hr } from "../../http/services";
import { useCompanyLogo } from "../../hooks/useCompanyLogo";
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
  Chip,
  Fade,
  CircularProgress,
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

import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";

const AppHeaderEmp = ({ open, handleDrawerToggle }) => {
  const roleData = useLocation().state;
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use custom hook for company logo
  const { logoUrl, logoLoading, logoError } = useCompanyLogo();

  // Menu state management
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [roleMenuAnchorEl, setRoleMenuAnchorEl] = useState(null);
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] = useState(null);
  
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

  // Only show HR and Employee roles
  const userRoles = ["HR", "Employee"];
  const [activeRole, setActiveRole] = useState(userDetails.activeRole || "HR");
  const [displayName, setDisplayName] = useState(() => {
    // Set initial display name based on active role
    if (userDetails.activeRole === "Employee") {
      return userDetails.empName || userDetails.name;
    }
    return userDetails.hrName || userDetails.name;
  });

  // Get role icon based on role name
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

  // Get role color based on role name
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

  // Get role text color based on role name
  const getRoleTextColor = (role) => {
    switch (role) {
      case "HR":
        return "#2196F3"; // Blue
      case "Employee":
        return "#4CAF50"; // Green
      default:
        return "#9E9E9E"; // Grey
    }
  };

  // Get display name based on role
  const getDisplayName = (role) => {
    if (role === "HR") {
      return userDetails.hrName || userDetails.name;
    } else if (role === "Employee") {
      return userDetails.empName || userDetails.name;
    }
    return userDetails.name;
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
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleViewAllNotifications = () => {
    // Navigate to employee notifications page
    navigate("/employee/notifications");
    console.log("Navigating to employee notifications page");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSwitchRole = (newRole) => {
    console.log(`Switching to role: ${newRole}`);

    if (newRole === "HR" && (userDetails.role === "HR" || userDetails.role ==="COMPANY") ) {
      navigate("/dashboard-hr");
    }
    
    if (newRole === "Employee") {
      navigate("/dashboard-emp");
    }
  };

  const handleRoleSelect = (newRole) => {
    // Update the active role and display name immediately when selecting from menu
    setActiveRole(newRole);
    if (newRole === "HR") {
      setDisplayName(userDetails.hrName || userDetails.name);
    } else if (newRole === "Employee") {
      setDisplayName(userDetails.empName || userDetails.name);
    }
    handleRoleMenuClose();
  };

  useEffect(() => {
    // If roleData exists and has roleData property, use it
    if (roleData?.roleData) {
      handleRoleSelect(roleData.roleData);
    } else {
      // Default to Employee role if no role data is provided
      handleRoleSelect("Employee");
    }
  }, []);

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    setIsLogoutDialogOpen(true);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate("/dashboard-emp/profile"); // Navigate to profile page
  };

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  // Get first letter of name for Avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Get unread notification count
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

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
          <Box onClick={handleLogoClick} sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            {renderCompanyLogo()}

            {shouldShowHR360 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Notifications */}
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
                {getInitials(displayName)}
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
                  {displayName}
                </Typography>
                <Chip
                  icon={getRoleIcon(activeRole)}
                  label={activeRole}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    backgroundColor: `${getRoleColor(activeRole)}22`,
                    color: getRoleTextColor(activeRole),
                    border: `1px solid ${getRoleColor(activeRole)}44`,
                    "& .MuiChip-icon": {
                      fontSize: "0.65rem",
                      color: getRoleTextColor(activeRole),
                    },
                  }}
                />
              </Box>
            </Button>

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
                    {getInitials(displayName)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", lineHeight: 1.2 }}
                    >
                      {displayName}
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
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          color: getRoleTextColor(activeRole),
                        }}
                      >
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
                        onClick={() => {
                          handleRoleSelect(role);
                          handleSwitchRole(role);
                        }}
                        selected={role === activeRole}
                        sx={{
                          px: 2,
                          py: 1.5,
                          "&.Mui-selected": {
                            bgcolor: `${getRoleColor(role)}10`,
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
                              fontWeight:
                                role === activeRole ? "bold" : "regular",
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
              <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Profile</ListItemText>
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
          </Box>
        </Toolbar>
      </AppBar>

      {/* Employee Notification Dropdown Component */}
      <NotificationEmp
        anchorEl={notificationMenuAnchorEl}
        open={isNotificationMenuOpen}
        onClose={handleNotificationMenuClose}
        notifications={notifications}
        onViewAll={handleViewAllNotifications}
      />

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

export default AppHeaderEmp;