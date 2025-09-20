import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Stack, IconButton, Drawer, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("timerCheck");
    navigate("/login");
  };

  const toggleDrawer = (open) => () => {
    setIsMobileMenuOpen(open);
  };

  const menuItems = (
    <Box
      sx={{
        width: 250,
        height: 300,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography
        variant="h6"
        noWrap
        sx={{
          color: "black",
          fontWeight: "bold",
          letterSpacing: 1.5,
          ml: 2,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        CKD
        <Typography
          component="span"
          variant="h6"
          sx={{ color: "#2196F3", fontWeight: "bold" }}
        >
          {" "}
          vcs
        </Typography>
      </Typography>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          padding: 2,
          backgroundColor: "black",
          height: 250,
        }}
      >
        <Button
          component={Link}
          to="/dashboard"
          sx={{
            color: "white",
            justifyContent: "flex-start",
            "&:hover": {
              color: "#2196F3",
            },
            fontWeight: "medium",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Dashboard
        </Button>
        <Button
          component={Link}
          to="/attendence"
          sx={{
            color: "white",
            justifyContent: "flex-start",
            "&:hover": {
              color: "#2196F3",
            },
            fontWeight: "medium",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Attendance
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/profile"
          sx={{
            color: "#2196F3",
            borderColor: "#2196F3",
            "&:hover": {
              borderColor: "#1976D2",
              backgroundColor: "#2196F3",
              color: "white",
            },
            fontWeight: "medium",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          {localStorage.getItem("name")}
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2196F3",
            color: "white",
            "&:hover": {
              backgroundColor: "#1976D2",
            },
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
          onClick={logout}
        >
          Logout
        </Button>
      </Stack>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(10px)",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
        paddingX: { xs: 1, sm: 2 },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          noWrap
          sx={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: 1.5,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          CKD
          <Typography
            component="span"
            variant="h6"
            sx={{ color: "#2196F3", fontWeight: "bold" }}
          >
            vcs
          </Typography>
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
          }}
        >
          <Button
            component={Link}
            to="/dashboard"
            sx={{
              color: "white",
              "&:hover": {
                color: "#2196F3",
              },
              fontWeight: "medium",
              textTransform: "none",
            }}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/attendence"
            sx={{
              color: "white",
              "&:hover": {
                color: "#2196F3",
              },
              fontWeight: "medium",
              textTransform: "none",
            }}
          >
            Attendance
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/profile"
            sx={{
              color: "white",
              borderColor: "#2196F3",
              "&:hover": {
                borderColor: "#1976D2",
                backgroundColor: "#2196F3",
              },
              fontWeight: "medium",
              textTransform: "none",
            }}
          >
            {localStorage.getItem("name")}
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2196F3",
              color: "white",
              "&:hover": {
                backgroundColor: "#1976D2",
              },
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={logout}
          >
            Logout
          </Button>
        </Stack>

        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          sx={{ display: { sm: "none" } }} // Only show on mobile
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={isMobileMenuOpen}
          onClose={toggleDrawer(false)}
        >
          {menuItems}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
