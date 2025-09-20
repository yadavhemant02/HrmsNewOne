import React, { useEffect, useRef } from "react";
import { Button, Box, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import gsap from "gsap";

const HomePageMain = () => {
  // Refs for animations
  const containerRef = useRef(null);
  const paperRef = useRef(null);
  const titleRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const circle1Ref = useRef(null);
  const circle2Ref = useRef(null);
  const circle3Ref = useRef(null);
  const backButtonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial states
    gsap.set([circle1Ref.current, circle2Ref.current, circle3Ref.current], {
      scale: 0,
      opacity: 0
    });
    
    gsap.set(paperRef.current, {
      opacity: 0,
      y: 50
    });

    gsap.set(backButtonRef.current, {
      opacity: 0,
      x: -50
    });

    // Animation sequence
    tl.to([circle1Ref.current, circle2Ref.current, circle3Ref.current], {
      scale: 1,
      opacity: 0.6,
      duration: 1,
      stagger: 0.2
    })
    .to(paperRef.current, {
      opacity: 1,
      y: 0,
      duration: 1
    }, "-=0.5")
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, "-=0.3")
    .to(buttonContainerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5
    }, "-=0.3")
    .to(backButtonRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.5
    }, "-=0.5");

    // Floating animation for circles
    gsap.to([circle1Ref.current, circle2Ref.current, circle3Ref.current], {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 2,
        from: "random"
      }
    });

    return () => tl.kill();
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e8f6ff 0%, #ffffff 50%, #f0f8ff 100%)",
        position: "relative",
        overflow: "hidden",
        padding: { xs: 2, md: 0 },
      }}
    >
      {/* Background circles */}
      <Box
        ref={circle1Ref}
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          backgroundColor: "#87CEEB",
          borderRadius: "50%",
          top: "10%",
          left: "5%",
          opacity: 0.6,
        }}
      />
      <Box
        ref={circle2Ref}
        sx={{
          position: "absolute",
          width: 250,
          height: 250,
          backgroundColor: "#4682B4",
          borderRadius: "50%",
          bottom: "15%",
          right: "10%",
          opacity: 0.4,
        }}
      />
      <Box
        ref={circle3Ref}
        sx={{
          position: "absolute",
          width: 150,
          height: 150,
          backgroundColor: "#B0E0E6",
          borderRadius: "50%",
          top: "50%",
          left: "60%",
          opacity: 0.3,
        }}
      />

      {/* Back Button */}
      <Box
        ref={backButtonRef}
        sx={{
          position: "absolute",
          top: { xs: 16, sm: 24, md: 32 },
          left: { xs: 16, sm: 24, md: 32 },
          zIndex: 2,
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4682B4",
              p: 2,
              minWidth: "50px",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "#5a9bd3",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease"
            }}
          >
            <ArrowBackIcon />
          </Button>
        </Link>
      </Box>

      {/* Main Content */}
      <Paper
        ref={paperRef}
        elevation={12}
        sx={{
          padding: { xs: 4, sm: 6, md: 8 },
          borderRadius: 4,
          maxWidth: 700,
          width: "90%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 1,
        }}
      >
        <Typography
          ref={titleRef}
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.75rem", sm: "2.2rem", md: "2.5rem" },
            mb: 5,
            textAlign: "center",
            color: "#1a365d",
          }}
        >
          HR{""}
          <Box
            component="span"
            sx={{
              fontStyle: "italic",
              color: "#4682B4"
            }}
          >
            360
            {/* venture consultancy services */}
          </Box>
          <Box
            component="span"
            sx={{
              display: "block",
              mt: 1,
              fontSize: "0.8em",
              background: "#f8fafc",
              p: 2,
              borderRadius: 2,
            }}
          >
            Management Portal
          </Box>
        </Typography>

        {/* Buttons Section */}
        <Box
          ref={buttonContainerRef}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            width: "100%",
          }}
        >
          <Link to="/HR-Monitor" style={{ textDecoration: "none", width: "100%" }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                backgroundColor: "#4682B4",
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#5a9bd3",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease"
              }}
            >
              HR Login
            </Button>
          </Link>

          <Link to="/login" style={{ textDecoration: "none", width: "100%" }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                backgroundColor: "#87CEEB",
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#4682B4",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease"
              }}
            >
              Employee Login
            </Button>
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default HomePageMain;