import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Grid,
  Container,
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const NotificationHrDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const notification = location.state?.notification;

  // If no notification data is available, show error state
  if (!notification) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Notification Details
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Notification not found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The requested notification could not be found.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const iconProps = { fontSize: "medium" };
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Notification Details
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Notification Type and Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: `${getNotificationColor(notification.type)}15`,
              border: `2px solid ${getNotificationColor(notification.type)}`,
              width: 56,
              height: 56,
            }}
          >
            {getNotificationIcon(notification.type)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {notification.title}
            </Typography>
            <Chip
              label={notification.type.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: `${getNotificationColor(notification.type)}15`,
                color: getNotificationColor(notification.type),
                border: `1px solid ${getNotificationColor(notification.type)}30`,
                fontWeight: 'bold',
              }}
            />
          </Box>
        </Box>

        {/* Timestamp */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {formatDate(notification.timestamp)}
        </Typography>

        {/* Message */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {notification.message}
          </Typography>
        </Box>

        {/* Details Section */}
        {notification.details && (
          <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Additional Details
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(notification.details).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Typography>
                  {key === 'status' ? (
                    <Chip
                      label={value}
                      size="small"
                      sx={{
                        backgroundColor: '#E8F5E9',
                        color: '#2E7D32',
                        fontWeight: 'bold',
                      }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {value}
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default NotificationHrDetails;