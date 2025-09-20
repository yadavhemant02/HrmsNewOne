import React, { useState, useEffect } from 'react';
import {
  Menu,
  Box,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Fade,
  Dialog,
  DialogContent,
  Grid,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Material UI Icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import { base_hr } from '../../../http/services';

const NotificationHr = ({ 
  anchorEl, 
  open, 
  onClose, 
  notifications,
  onViewAll,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
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
    if (open) {
      fetchNotifications();
    }
  }, [open, userDetails.organizationCode]);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const iconProps = { fontSize: "small" };
    switch (type) {
      case 'leave':
        return <EventIcon {...iconProps} />;
      case 'payroll':
        return <PaymentIcon {...iconProps} />;
      case 'employee':
        return <PersonAddIcon {...iconProps} />;
      case 'task':
        return <AssignmentIcon {...iconProps} />;
      case 'announcement':
        return <AnnouncementIcon {...iconProps} />;
      case 'email':
        return <EmailIcon {...iconProps} />;
      default:
        return <NotificationsActiveIcon {...iconProps} />;
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'leave':
        return '#2E7D32'; // Dark Green
      case 'payroll':
        return '#1565C0'; // Dark Blue
      case 'employee':
        return '#6A1B9A'; // Deep Purple
      case 'task':
        return '#C62828'; // Dark Red
      case 'announcement':
        return '#EF6C00'; // Deep Orange
      case 'email':
        return '#455A64'; // Blue Grey
      default:
        return '#424242'; // Dark Grey
    }
  };

  // Format timestamp to human readable format
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Format date for details view
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/notification/view-notification?empCode=${notification.details.userCode}&NotificationCode=${notification.details.notificationCode}`,
        {
          headers: {
            accept: '*/*',
          },
        }
      );
      if (response.data.status === 201) {
        // Refresh notifications after marking as viewed
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as viewed:', error);
    }
  };

  // Handle close details dialog
  const handleCloseDetails = () => {
    setSelectedNotification(null);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 8,
          sx: {
            width: 380,
            maxHeight: 500,
            mt: 1.5,
            borderRadius: 2,
            overflow: 'hidden',
            background: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: '#1A237E',
            px: 3,
            py: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NotificationsActiveIcon sx={{ color: 'white', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  sx={{
                    ml: 1,
                    height: 20,
                    backgroundColor: '#FF4081',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Notifications List Section */}
        <Box
          sx={{
            maxHeight: 400,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '2px',
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <NotificationsIcon sx={{ fontSize: 48, color: '#BDBDBD', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No notifications
              </Typography>
              <Typography variant="body2" color="text.disabled">
                You're all caught up!
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                 <ListItem
  sx={{
    px: 3,
    py: 2,
    // Use conditional background color logic properly
    backgroundColor: notification.views?.includes(userDetails?.empCode) 
      ? 'rgba(244, 67, 54, 0.04)' // Light red for viewed
      : notification.read 
        ? 'transparent' 
        : 'rgba(25, 118, 210, 0.07)', // Light blue for unread
    
    // Border styling
    borderLeft: notification.read 
      ? 'none' 
      : `4px solid ${getNotificationColor(notification.type)}`,
    
    position: 'relative',
    cursor: 'pointer',
    
    // Smooth transitions
    transition: 'all 0.2s ease-in-out',
    
    // Hover effects
    '&:hover': {
     //  backgroundColor: notification.views?.includes(userDetails?.empCode)
     //    ? 'rgba(244, 67, 54, 0.08)' // Darker red on hover
     //    : 'rgba(25, 118, 210, 0.08)', // Light blue on hover
      transform: 'translateX(2px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    
    // Active state
    '&:active': {
      transform: 'translateX(1px)',
    },
  }}
  onClick={() => handleNotificationClick(notification)}
>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${getNotificationColor(notification.type)}15`,
                          border: `2px solid ${getNotificationColor(notification.type)}`,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{ ml: 1 }}
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: notification.read ? 'normal' : 'bold',
                              color: notification.read ? 'text.secondary' : 'text.primary',
                              lineHeight: 1.3,
                              pr: 1,
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            {!notification.read && (
                              <FiberManualRecordIcon
                                sx={{
                                  fontSize: 8,
                                  color: getNotificationColor(notification.type),
                                  mr: 1,
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.4,
                              mb: 1,
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.disabled',
                                fontWeight: 500,
                              }}
                            >
                              {formatTimeAgo(notification.timestamp)}
                            </Typography>
                            <Chip
                              label={notification.type.toUpperCase()}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                backgroundColor: `${getNotificationColor(notification.type)}15`,
                                color: getNotificationColor(notification.type),
                                border: `1px solid ${getNotificationColor(notification.type)}30`,
                              }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && (
                    <Divider sx={{ mx: 3, backgroundColor: 'rgba(0, 0, 0, 0.06)' }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Menu>

      {/* Notification Details Dialog */}
      <Dialog
        open={Boolean(selectedNotification)}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        {selectedNotification && (
          <DialogContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: `${getNotificationColor(selectedNotification.type)}15`,
                    border: `2px solid ${getNotificationColor(selectedNotification.type)}`,
                    width: 56,
                    height: 56,
                  }}
                >
                  {getNotificationIcon(selectedNotification.type)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {selectedNotification.title}
                  </Typography>
                  <Chip
                    label={selectedNotification.type.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: `${getNotificationColor(selectedNotification.type)}15`,
                      color: getNotificationColor(selectedNotification.type),
                      border: `1px solid ${getNotificationColor(selectedNotification.type)}30`,
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
              </Box>
              <IconButton
                onClick={handleCloseDetails}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Timestamp */}
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {formatDate(selectedNotification.timestamp)}
            </Typography>

            {/* Message */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {selectedNotification.message}
              </Typography>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default NotificationHr;