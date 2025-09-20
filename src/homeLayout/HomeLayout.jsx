import React from "react";
import { Outlet } from "react-router-dom";
import { AppBar, Toolbar, Box } from "@mui/material";
import HomeNavbar from "../components/HomeNavbar";
import HR360Footer from "../pages/LandingPage/HR360Footer";

const HomeLayout = () => {
  return (
    <Box>
      <AppBar position="sticky" sx={{ backgroundColor: "white", color: "black" }} elevation={1}>
        <Toolbar>
          <HomeNavbar />
        </Toolbar>
      </AppBar>

      <Box component="main" zIndex={5}>
        <Outlet />
      </Box>
      <HR360Footer/>
    </Box>
  );
};

export default HomeLayout;


