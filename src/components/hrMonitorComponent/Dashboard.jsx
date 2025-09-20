import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { BiLogOut } from "react-icons/bi"; 
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserName } from '../../redux/authSlice';
import { statusValue } from "../../redux/statusSlice";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const userName = useSelector(selectUserName);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/Hr-Monitor');
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handle = () => {
    dispatch(statusValue());
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: 1201, background: '#262626', color: '#fff' }} // High z-index
        elevation={4}
      >
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <IconButton
              color="inherit"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 5 }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>

            <Typography variant={isSmallScreen ? 'h6' : 'h5'} sx={{ mx: 2 }}>
              CKD
            </Typography>
            <Typography variant={isSmallScreen ? 'body1' : 'h6'} sx={{ color: "#2196f3" }}>
              Vcs
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Button variant="outlined" sx={{
              color: "#fff", borderColor: "#fff",
              '&:hover': { backgroundColor: '#1976d2', borderColor: '#1976d2' }
            }}>
              Welcome, {localStorage.getItem('name')}!
            </Button>
            <IconButton color="inherit" onClick={handleLogout}>
              <BiLogOut style={{ fontSize: '1.5rem', color: '#fff' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Dashboard;
