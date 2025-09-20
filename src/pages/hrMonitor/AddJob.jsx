import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  MenuItem,
  Select,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { base_hr, base_Ip, base_url } from "../../http/services";
import axios from "axios";
import { styled } from "@mui/system";
import swal from "sweetalert";

const colors = {
  primary: "#3f51b5",
  secondary: "#4caf50",
  background: "#f4f6f8",
  cardBackground: "#fff",
  textPrimary: "#3f51b5",
  textSecondary: "#000",
};

const cardStyles = {
  boxShadow: 3,
  borderRadius: "8px",
  mb: 2,
};

const AddJobPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [show, setShow] = useState([]);
  const [job, setJob] = useState({
    jobTittel: "",
    jobLocation: "",
    jobType: "",
    jobDiscription: "",
    jobRequirment: "",
    rolesResponsibilities: "",
  });

  const handleclick = () =>
    swal({
      text: "Your Job Added SuccessFully",
      icon: "success",
    });

  const [showJobs, setShowJobs] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${base_hr}/hr-handler/job/add-job`,
        job
      );
      console.log("job=", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(job);
  };

  const fetchdata = async () => {
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/job/getall/job-post`
      ); // Ensure API URL is correct
      setShow(response.data); // Set the fetched job data
      console.log("data ->", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchdata(); // Fetch the data on component mount
  }, []);

  return (
    <>
      <Link
        to="/dashboard-hr/add-jobs"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          // color: colors.secondary,
          color: "black",
          marginLeft: 100,
        }}
      >
        <IoMdArrowBack size={20} />
        <Typography
          variant="body1"
          sx={{ marginLeft: "8px", fontWeight: "bold" }}
        >
          Back to Dashboard
        </Typography>
      </Link>
      <Box
        sx={{
          backgroundColor: colors.background,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: isSmallScreen ? "10px" : "20px",
          boxSizing: "border-box",
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            mt: 10,
            width: isSmallScreen ? "100%" : "300px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Card sx={{ ...cardStyles, backgroundColor: colors.primary }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Job
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  marginTop: "20px",
                  backgroundColor: colors.cardBackground,
                  color: "black",
                  "&:hover": { backgroundColor: colors.secondary },
                }}
                onClick={() => setShowJobs(false)}
              >
                Add Job
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ ...cardStyles, backgroundColor: colors.primary }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                color={colors.cardBackground}
              >
                Show Jobs
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  marginTop: "20px",
                  backgroundColor: colors.cardBackground,
                  color: "black",
                  "&:hover": { backgroundColor: colors.secondary },
                }}
                onClick={() => setShowJobs(true)}
              >
                Show Jobs
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isSmallScreen ? "100%" : "800px",
            width: "100%",
            paddingLeft: isSmallScreen ? "0" : "20px",
            paddingTop: "20px",
          }}
        >
          {showJobs ? (
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: colors.cardBackground,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                width: 1100,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Job Listings
              </Typography>

              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableCell backgroundColor="#3f51b5">Job Title</TableCell>
                    <TableCell backgroundColor="#3f51b5">Job Type</TableCell>
                    <TableCell backgroundColor="#3f51b5">
                      Job Location
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {show.map((job, index) => (
                      <TableRow key={index}>
                        <TableCell align="right">{job.jobTittel}</TableCell>
                        <TableCell align="right">{job.jobType}</TableCell>
                        <TableCell align="right">{job.jobLocation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Paper
              elevation={1}
              sx={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: colors.cardBackground,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h4" align="center" gutterBottom>
                Add Job
              </Typography>

              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Grid container spacing={3} sx={{ borderRadius: 5 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Job Title"
                      value={job.jobTittel}
                      onChange={(e) =>
                        setJob({ ...job, jobTittel: e.target.value })
                      }
                      variant="outlined"
                      type="text"
                      required
                      sx={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        width: 600,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Job Type"
                      value={job.jobType}
                      onChange={(e) =>
                        setJob({ ...job, jobType: e.target.value })
                      }
                      variant="outlined"
                      type="text"
                      required
                      sx={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        width: 290,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Select
                      // multiple
                      displayEmpty
                      value={job.jobLocation}
                      onChange={(e) =>
                        setJob({ ...job, jobLocation: e.target.value })
                      }
                      // input={<OutlinedInput />}
                    >
                      <MenuItem disabled value="">
                        <em>Placeholder</em>
                      </MenuItem>
                      <MenuItem value="Moradabad">Moradabad</MenuItem>
                      <MenuItem value="Delhi">Delhi</MenuItem>
                      <MenuItem value="Mumbai">Mumbai</MenuItem>
                      <MenuItem value="Bangalore">Bangalore</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: colors.textPrimary,
                        marginBottom: "8px",
                      }}
                    >
                      Job Description
                    </Typography>
                    <TextField
                      value={job.jobDiscription}
                      onChange={(e) =>
                        setJob({ ...job, jobDiscription: e.target.value })
                      }
                      variant="outlined"
                      type="text"
                      multiline
                      rows={4}
                      required
                      sx={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        width: 600,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: colors.textPrimary,
                        marginBottom: "8px",
                      }}
                    >
                      Job Requirement
                    </Typography>
                    <TextField
                      fullWidth
                      value={job.jobRequirment}
                      onChange={(e) =>
                        setJob({ ...job, jobRequirment: e.target.value })
                      }
                      variant="outlined"
                      type="text"
                      multiline
                      rows={4}
                      required
                      sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: colors.textPrimary,
                        marginBottom: "8px",
                      }}
                    >
                      Roles & Responsibilities
                    </Typography>
                    <TextField
                      fullWidth
                      value={job.rolesResponsibilities}
                      onChange={(e) =>
                        setJob({
                          ...job,
                          rolesResponsibilities: e.target.value,
                        })
                      }
                      variant="outlined"
                      type="text"
                      multiline
                      rows={4}
                      required
                      sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      onClick={handleclick}
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: colors.primary,
                        padding: "12px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#3949ab",
                        },
                      }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          )}
        </Box>
      </Box>
      {/* <ToastContainer /> */}
    </>
  );
};

export default AddJobPage;
