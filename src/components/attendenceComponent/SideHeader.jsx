import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Collapse,
  Box,
  styled,
  Toolbar,
  Tooltip,
  Typography,
  Divider,
  alpha
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MonitorIcon from '@mui/icons-material/Monitor';
import GridViewIcon from '@mui/icons-material/GridView';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PaymentIcon from '@mui/icons-material/Payment';
import DownloadIcon from '@mui/icons-material/Download';
import EventNoteIcon from '@mui/icons-material/EventNote';
import WorkIcon from '@mui/icons-material/Work';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';

const drawerWidth = 270;

// Enhanced styled components for better UI
const MainListItem = styled(ListItemButton)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateX(4px)',
  },
  ...(active && {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
    boxShadow: `0 4px 8px -2px ${alpha(theme.palette.primary.main, 0.4)}`,
    '& .MuiListItemIcon-root': {
      color: theme.palette.common.white,
    },
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
      fontWeight: 600,
    },
    '&:hover': {
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
    },
  }),
}));

const SubListItem = styled(ListItemButton)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1, 0.5, 3),
  borderRadius: theme.shape.borderRadius,
  minHeight: 40,
  transition: 'all 0.15s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateX(3px)',
  },
  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiTypography-root': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  }),
}));

const CategoryLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: theme.spacing(1.5, 2, 0.5, 3),
  marginTop: theme.spacing(1),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 36,
  minHeight: 36,
  borderRadius: '8px',
  marginRight: theme.spacing(1.5),
  transition: 'all 0.2s',
}));

// Updated navigation structure while keeping original routes
const navItems = [
  {
    category: 'Main',
    items: [
      {
        text: 'Overview',
        icon: <DashboardIcon />,
        path: '/dashboard-emp'
      },
      {
        text: 'Core Employee',
        icon: <PersonIcon />,
        subItems: [
          { text: 'Attendance', path: '/dashboard-emp/attendence-emp', icon: <EventIcon /> },
          { text: 'Upload Documents', path: '/dashboard-emp/emp-doc-upload', icon: <CloudUploadIcon /> },
        ]
      },
      {
        text: 'Leave Management',
        icon: <TimelineIcon />,
        subItems: [
          { text: 'Apply Leave', path: '/dashboard-emp/emp-leave', icon: <EventNoteIcon /> },
        ]
      },
      {
        text: 'Documents',
        icon: <DownloadIcon />,
        subItems: [
          { text: 'Offer Letter', path: '/dashboard-emp/view-off-letter', icon: <WorkIcon /> },
          { text: 'Salary Slip', path: '/dashboard-emp/view-sal-slip-list', icon: <ReceiptIcon /> },
          { text: 'Increment Letter', path: '/dashboard-emp/all-increment-letter-list', icon: <TrendingUpIcon /> },
          { text: 'Relieaving Letter', path: '/dashboard-emp/all-releasing-emp-list', icon: <ExitToAppIcon /> },
          { text: 'Addressproof Letter', path: '/dashboard-emp/all-addressproof-emp-list', icon: <LocationOnIcon /> },
          { text: 'Experience Letter', path: '/dashboard-emp/all-experience-emp-list', icon: <BadgeIcon /> },
        ]
      },
       {
        text: 'Interview',
        icon: <DownloadIcon />,
        subItems: [
          { text: 'Show Interviews', path: '/dashboard-emp/interview-emp', icon: <WorkIcon /> },
          { text: 'feedback', path: '/dashboard-emp/feedback-emp', icon: <WorkIcon /> },
          //feedback-emp
        ]
      },
       {
        text: 'Perspective Menu',
        icon: <DownloadIcon />,
        subItems: [
          { text: 'My Perspective', path: '/dashboard-emp/my-perspective', icon: <WorkIcon /> },
        ]
      }
    ]
  }
];

const SideHeader = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openSubmenu, setOpenSubmenu] = useState('');
  
  const currentPath = location.pathname;
  
  // Find active items based on current path
  const findActiveItems = () => {
    for (const category of navItems) {
      for (const item of category.items) {
        if (item.path === currentPath) {
          return { activeMainItem: item.text, activeSubItem: '' };
        }
        
        if (item.subItems) {
          const activeSubItem = item.subItems.find(subItem => subItem.path === currentPath);
          if (activeSubItem) {
            return { activeMainItem: item.text, activeSubItem: activeSubItem.text };
          }
        }
      }
    }
    return { activeMainItem: '', activeSubItem: '' };
  };
  
  const { activeMainItem, activeSubItem } = findActiveItems();
  
  // Set the active submenu open by default
  useEffect(() => {
    if (activeMainItem) {
      setOpenSubmenu(activeMainItem);
    }
  }, [activeMainItem]);

  const handleMainClick = (text) => {
    setOpenSubmenu(openSubmenu === text ? '' : text);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      bgcolor: 'background.paper',
      borderRight: '1px solid',
      borderColor: 'divider',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Toolbar>
        {open && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            py: 1
          }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px'
              }}
            >
              EMPLOYEE360
            </Typography>
          </Box>
        )}
      </Toolbar>
      
      <Divider />
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', pt: 1 }}>
        {navItems.map((category) => (
          <React.Fragment key={category.category}>
            {open && (
              <CategoryLabel>{category.category}</CategoryLabel>
            )}
            
            {category.items.map((item) => (
              <React.Fragment key={item.text}>
                <ListItem disablePadding>
                  <Tooltip title={!open ? item.text : ""} placement="right" arrow>
                    {item.subItems ? (
                      <MainListItem
                        onClick={() => handleMainClick(item.text)}
                        active={activeMainItem === item.text ? 1 : 0}
                        sx={{
                          justifyContent: open ? 'initial' : 'center',
                          px: open ? 2 : 2.5,
                          py: 1,
                        }}
                      >
                        <IconWrapper 
                          sx={{ 
                            bgcolor: activeMainItem === item.text ? 'transparent' : alpha(theme.palette.primary.main, 0.08),
                          }}
                        >
                          {item.icon}
                        </IconWrapper>
                        
                        {open && (
                          <>
                            <ListItemText 
                              primary={item.text}
                              primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: activeMainItem === item.text ? 600 : 500,
                              }}
                            />
                            {openSubmenu === item.text ? 
                              <KeyboardArrowUpIcon /> : 
                              <KeyboardArrowDownIcon />
                            }
                          </>
                        )}
                      </MainListItem>
                    ) : (
                      <MainListItem
                        component={Link}
                        to={item.path}
                        active={activeMainItem === item.text ? 1 : 0}
                        sx={{
                          justifyContent: open ? 'initial' : 'center',
                          px: open ? 2 : 2.5,
                          py: 1,
                        }}
                      >
                        <IconWrapper 
                          sx={{ 
                            bgcolor: activeMainItem === item.text ? 'transparent' : alpha(theme.palette.primary.main, 0.08),
                          }}
                        >
                          {item.icon}
                        </IconWrapper>
                        
                        {open && (
                          <ListItemText 
                            primary={item.text}
                            primaryTypographyProps={{
                              variant: 'body2',
                              fontWeight: activeMainItem === item.text ? 600 : 500,
                            }}
                          />
                        )}
                      </MainListItem>
                    )}
                  </Tooltip>
                </ListItem>

                {item.subItems && (
                  <Collapse 
                    in={openSubmenu === item.text} 
                    timeout="auto" 
                    unmountOnExit
                    sx={{
                      pl: open ? 0 : 0,
                      '& .MuiList-root': {
                        pb: 0.5
                      }
                    }}
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.text} disablePadding>
                          <Tooltip title={!open ? subItem.text : ""} placement="right" arrow>
                            <SubListItem
                              component={Link}
                              to={subItem.path}
                              active={activeSubItem === subItem.text ? 1 : 0}
                              sx={{
                                justifyContent: open ? 'initial' : 'center',
                                px: open ? 2 : 2.5,
                                ml: open ? 3 : 0.5,
                              }}
                            >
                              <ListItemIcon sx={{ 
                                minWidth: 0,
                                mr: open ? 1.5 : 0,
                                justifyContent: 'center',
                                color: activeSubItem === subItem.text ? 'inherit' : theme.palette.text.secondary,
                              }}>
                                {subItem.icon}
                              </ListItemIcon>
                              {open && (
                                <ListItemText
                                  primary={subItem.text}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    fontSize: '0.875rem',
                                  }}
                                />
                              )}
                            </SubListItem>
                          </Tooltip>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
            
            {open && category.items.length > 0 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        anchor="left"
        open={isMobile && open}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : theme.spacing(9),
            transition: theme.transitions.create(['width', 'box-shadow'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            boxShadow: open ? '4px 0 8px rgba(0,0,0,0.05)' : 'none',
          },
        }}
        open={open}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default SideHeader;