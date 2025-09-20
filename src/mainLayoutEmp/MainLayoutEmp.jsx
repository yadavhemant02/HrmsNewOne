import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import SideHeader from '../components/attendenceComponent/SideHeader';
import AppHeaderEmp from '../components/attendenceComponent/AppHeaderEmp';


const drawerWidth = 260;

const MainLayoutEmp = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppHeaderEmp
        open={open} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      
      <SideHeader 
        open={open} 
        handleDrawerToggle={handleDrawerToggle} 
      />

      <Box
        component="main"
        sx={{
          backgroundColor: "#F8F9FA",
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${open ? drawerWidth : 73}px)` },
          marginLeft: { xs: 0, md: open ? `${drawerWidth}px` : '73px' },
          marginTop: '64px',
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayoutEmp;