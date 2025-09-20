import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  styled,
  Chip,
  Stack,
  Avatar,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Table,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Drawer,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  LocalPhoneOutlined as LocalPhoneOutlinedIcon,
  EmailOutlined as EmailOutlinedIcon,
  AttachMoney as MoneyIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Flag as FlagIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import {
  base_emp,
  base_hr,
  base_identity,
  base_Ip,
} from "../../../http/services";
import axios from "axios";
import { useSelector } from "react-redux";
import GenerateTaskProject from "../../hrMonitor/project/GenerateTaskProject";

// Styled components
const StyledCard = styled(Card)(({ theme, bgcolor }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: bgcolor,
  "& .MuiCardContent-root": {
    padding: theme.spacing(3),
  },
}));

const IconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    color: bgcolor,
  },
}));

const WelcomeCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
  color: "white",
  borderRadius: "16px",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
  position: "relative",
  overflow: "hidden",
  width: "100%",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "300px",
    height: "300px",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    transform: "translate(50%, -50%)",
  },
}));

const StyledButton = styled(Button)(({ bgcolor, hoverColor }) => ({
  backgroundColor: bgcolor,
  color: "white",
  padding: "8px 20px",
  borderRadius: "12px",
  textTransform: "none",
  boxShadow: "0 4px 15px 0 rgba(0,0,0,0.1)",
  "&:hover": {
    backgroundColor: hoverColor,
    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.15)",
  },
}));

const TeamCard = styled(Card)({
  padding: 0,
  borderRadius: "12px",
  overflow: "hidden",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
});

const TeamHeader = styled(Box)({
  background: "#EFEFFF",
  padding: "10px 20px",
  color: "black",
  borderBottom: "2px solid #ddd",
});

const TeamContent = styled(Box)({
  padding: "20px",
});

const ProjectEmpDetails = () => {
  const credentials = useSelector(
    (state) => state.credential?.credential || {}
  );
  const { projectId } = useParams();

  const [formData, setFormData] = useState({
    projectName: "",
    startDate: "",
    endDate: "",
    budged: 0,
    projectManager: "",
    teamLead: "",
    discription: "",
    status: "",
    teamsMember: {},
  });

  const [task, setTask] = useState([]);
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;

      try {
        const response = await axios.get(
          `${base_hr}/hr-handler/project/get/project-data/by-project-id?projectId=${projectId}`
        );

        if (response.status === 201 && response.data.result.length > 0) {
          const projectData = response.data.result[0];

          // Format dates to YYYY-MM-DD
          const formatDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
          };

          // Set form data
          setFormData({
            projectName: projectData.projectName || "",
            startDate: formatDate(projectData.startDate),
            endDate: formatDate(projectData.endDate),
            budged: projectData.budged || 0,
            projectManager: projectData.projectManager || "",
            teamLead: projectData.teamLead || "",
            discription: projectData.discription || "",
            status: projectData.status || "",
            teamsMember: projectData.teamsMember || {},
          });

          // Convert teamsMember object to array for team member fields
          if (projectData.teamsMember) {
            const teamMemberArray = Object.entries(projectData.teamsMember).map(
              ([key, value]) => ({
                key,
                value,
              })
            );
            setTeamMemberFields(
              teamMemberArray.length > 0
                ? teamMemberArray
                : [{ key: "", value: "" }]
            );
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
    return () => {};
  }, [projectId]);

  const [headerr, setHeaderr] = useState("You are teamMember");
  const setHeader = (data) => {
    const email = credentials.email;

    console.log(data, "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
    if (data.projectManager == email) {
      setHeaderr("You are Project Manager");
    } else if (data.teamLead == email) {
      setHeaderr("You are Team Lead");
    } else {
      setHeaderr("you are team member");
    }
  };

  const [projectDetailId, setProjectDetailId] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawer1, setOpenDrawer1] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [projectManager, setProjectManager] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    designation: "",
  });
  const [teamLead, setTeamLead] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    designation: "",
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [projectManagerImage, setProjectManagerImage] = useState("");
  const [teamLeadImage, setTeamLeadImage] = useState("");
  const fetchProjectDetails = async () => {
    // console.log("startttttttttttttttttttt",projectId,localStorage.getItem('email'))

    try {
      const task = await axios.get(
        `${base_hr}/hr-handler/project-task/get/project-task-data/by-empCode/projectId?projectId=${projectId}&email=${credentials.email}`
      );
      setTask(task.data.result);
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/project/get/project-data/by-project-id?projectId=${projectId}`
      );
      const projectData = response.data.result[0];

      setProjectDetailId(projectData);
      setHeader(projectData);

      if (response.status === 201) {
        // Fetch Project Manager details
        console.log(projectData, "qqqqqqqqqqqqqqqqqqqqqq");
        try {
          const projectManagerRes = await axios.get(
            `${base_identity}/identity-handler/details/get-emp-details/by-emp-email?empEmail=${projectData.projectManager}`
          );
          const empCode = projectManagerRes.data.empCode;
          console.log(projectManager, "hhhhhhhhhhhhaaaaaaaaaaaaaaaaaa");
          setProjectManager({
            name: projectManagerRes.data.name,
            email: projectManagerRes.data.officialEmail,
            mobileNumber: projectManagerRes.data.primaryPhone,
            designation: projectManagerRes.data.disignation,
          });
          const projectManagerImage = await axios.get(
            `${base_emp}/emp-handler/image/get-emp-image?empCode=${empCode}`
          );

          setProjectManagerImage(projectManagerImage.data.result);
        } catch (error) {
          console.error("Error fetching project manager details:", error);
        }

        // Fetch Team Lead details
        try {
          const teamLeadRes = await axios.get(
            `${base_identity}/identity-handler/details/get-emp-details/by-emp-email?empEmail=${projectData.teamLead}`
          );

          const empCodeTeamLead = teamLeadRes.data.empCode;
          setTeamLead({
            name: teamLeadRes.data.name,
            email: teamLeadRes.data.officialEmail,
            mobileNumber: teamLeadRes.data.primaryPhone,
            designation: teamLeadRes.data.disignation,
          });
          const teamLeadImage = await axios.get(
            `${base_emp}/emp-handler/image/get-emp-image?empCode=${empCodeTeamLead}`
          );

          setTeamLeadImage(teamLeadImage.data.result);
        } catch (error) {
          console.error("Error fetching team lead details:", error);
        }

        // Fetch Team Members
        try {
          if (projectData && projectData.teamsMember) {
            const emailKeys = Object.keys(projectData.teamsMember);
            const membersData = await Promise.all(
              emailKeys.map(async (email) => {
                const response = await axios.get(
                  `${base_identity}/identity-handler/details/get-emp-details/by-emp-email?empEmail=${email}`
                );
                return {
                  name: response.data.name || "",
                  email: email,
                  mobileNumber: response.data.primaryPhone || "",
                  designation: response.data.disignation || "",
                  projectDesignation: projectData.teamsMember[email] || "",
                };
              })
            );
            setTeamMembers(membersData);
          }
        } catch (error) {
          console.error("Error fetching team member details:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const tableHeaders = ["Sr. No.", "Name", "Email", "User Name", "Action"];

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  // Dialog and Drawer handlers
  const handleDialogOpen = (member) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedMember(null);
  };

  const handleDrawerOpen = (member) => {
    setSelectedMember(member);
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setSelectedMember(null);
  };

  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  // ... existing functions ...

  const handleTaskDialogOpen = (task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleTaskDialogClose = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <WelcomeCard sx={{ mb: 4 }}>
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                  Welcome Back, Adrian
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={headerr}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }}
                  />
                  {/* <Chip
                    label="14 Leave Requests"
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }}
                  /> */}
                </Box>
              </Box>
            </Box>

            {/* <Stack direction="row" spacing={2}>
              <StyledButton
                startIcon={<AddIcon />}
                bgcolor="#33616E"
                hoverColor="#2a4f5a"
              >
                Add Project
              </StyledButton>
              <StyledButton
                startIcon={<AddIcon />}
                bgcolor="#ff9800"
                hoverColor="#f57c00"
              >
                Add Request
              </StyledButton>
            </Stack> */}
          </Box>
        </CardContent>
      </WelcomeCard>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
          {/* Left side - Metrics Cards */}
          <Box sx={{ flex: 1, width: "40%", marginLeft: "25px" }}>
            <Grid container spacing={3} sx={{ width: "100%" }}></Grid>
            <Grid container spacing={3} sx={{ width: "100%", mt: 1 }}>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(to right bottom, #ffffff, #fafafa)",
                  padding: "24px",
                  height: "auto",
                  minHeight: 420,
                }}
              >
                <Typography
                  variant="h5"
                  mb={4}
                  sx={{
                    color: "#1a237e",
                    fontWeight: 600,
                    borderBottom: "2px solid #e3f2fd",
                    paddingBottom: "12px",
                  }}
                >
                  Project Details
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {/* Dates Row */}
                  <Box
                    sx={{
                      //  display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        gutterBottom
                      >
                        Start Date
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          py: 1,
                          px: 2,
                          bgcolor: "rgba(25, 118, 210, 0.08)",
                          borderRadius: 2,
                        }}
                      >
                        {new Date(projectDetailId.startDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        gutterBottom
                      >
                        End Date
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          py: 1,
                          px: 2,
                          bgcolor: "rgba(25, 118, 210, 0.08)",
                          borderRadius: 2,
                        }}
                      >
                        {new Date(projectDetailId.endDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Team Members */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      gutterBottom
                    >
                      Team Strength
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        bgcolor: "rgba(25, 118, 210, 0.08)",
                        p: 1,
                        borderRadius: 2,
                        width: "fit-content",
                      }}
                    >
                      <Typography variant="h4" color="primary">
                        {teamMembers.length + 2}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Members
                      </Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      gutterBottom
                    >
                      Project Description
                    </Typography>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "rgba(0,0,0,0.02)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        //  minHeight: '150px'
                      }}
                    >
                      <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        {projectDetailId.discription ||
                          "No description available"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Box>

          {/* Right side */}
          <Box
            sx={{
              width: "60%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              overflow: "scroll",
            }}
          >
            <Card sx={{ height: "100%", width: "100%" }}>
              <CardContent>
                {/* <Typography variant="h6" sx={{ mb: 3, color: "#1a237e" }}>
                  Project Tasks Overview
                </Typography> */}
                <TableContainer
                  component={Paper}
                  sx={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    borderRadius: "8px",
                    width: "100%",
                    "& .MuiTable-root": {
                      minWidth: 650,
                      width: "100%",
                    },
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "#1a237e",
                          "& th": {
                            color: "white",
                            fontWeight: 650,
                            fontSize: "0.875rem",
                            // padding: "16px",
                            whiteSpace: "nowrap",
                          },
                        }}
                      >
                        {tableHeaders.map((header, index) => (
                          <TableCell key={index} sx={{ color: "inherit" }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#ffffff",
                            },
                            "&:nth-of-type(even)": {
                              backgroundColor: "#f5f5f5",
                            },
                            "&:hover": {
                              backgroundColor: "#eeeeee",
                            },
                            "& td": {
                              padding: "16px",
                              fontSize: "0.875rem",
                              whiteSpace: "nowrap",
                            },
                          }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.name || "N/A"}</TableCell>
                          <TableCell>{row.email || "N/A"}</TableCell>
                          <TableCell>{row.userName || "N/A"}</TableCell>
                          <TableCell>
                            {/* <Button
                              variant="contained"
                              size="small"
                             // startIcon={<VisibilityIco />}
                              sx={{
                                backgroundColor: "#1a237e",
                                "&:hover": {
                                  backgroundColor: "#000051",
                                },
                                textTransform: "none",
                                borderRadius: "8px",
                                minWidth: "90px",
                                padding: "6px 16px",
                              }}
                            >
                              View
                            </Button> */}
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleTaskDialogOpen(row)}
                              sx={{
                                backgroundColor: "#1a237e",
                                "&:hover": {
                                  backgroundColor: "#000051",
                                },
                                textTransform: "none",
                                borderRadius: "8px",
                                minWidth: "90px",
                                padding: "6px 16px",
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {task.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            No tasks available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
        {" "}
        <TeamCard sx={{ width: "100%" }}>
          <TeamHeader>
            <Typography variant="h6">Project Manager</Typography>
          </TeamHeader>
          <TeamContent>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  border: "2px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                src={`data:image/jpeg;base64,${projectManagerImage}`}
              >
                {projectManager.name?.[0]}
              </Avatar>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">{projectManager.name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalPhoneOutlinedIcon fontSize="small" />
                    <Typography variant="body2">
                      {projectManager.mobileNumber}
                    </Typography>
                  </Box>
                </Box>

                {/* Designation */}
                <Typography color="textSecondary">
                  {projectManager.designation}
                </Typography>

                {/* Email */}
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <EmailOutlinedIcon fontSize="small" />
                    <Typography variant="body2">
                      {projectManager.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </TeamContent>
        </TeamCard>
        {/* Team Lead - Similar structure to Project Manager */}
        <TeamCard sx={{ width: "100%" }}>
          <TeamHeader>
            <Typography variant="h6">Team Lead</Typography>
          </TeamHeader>
          <TeamContent>
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* <Avatar sx={{ width: 60, height: 60 }}>
                  {projectManager.name?.[0]}
                </Avatar> */}

              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  border: "2px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                src={`data:image/jpeg;base64,${teamLeadImage}`}
              >
                {teamLead.name?.[0]}
              </Avatar>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {/* Name and Mobile Number (Space Between) */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">{teamLead.name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalPhoneOutlinedIcon fontSize="small" />
                    <Typography variant="body2">
                      {teamLead.mobileNumber}
                    </Typography>
                  </Box>
                </Box>

                {/* Designation */}
                <Typography color="textSecondary">
                  {teamLead.designation}
                </Typography>

                {/* Email */}
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <EmailOutlinedIcon fontSize="small" />
                    <Typography variant="body2">{teamLead.email}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </TeamContent>
        </TeamCard>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 3,
          mt: 4,
        }}
      >
        {teamMembers.map((member, index) => (
          <TeamCard key={index}>
            <TeamHeader>
              <Typography variant="h6">{member.name}</Typography>
              <Typography variant="body2">
                {member.designation} • {member.projectDesignation}
              </Typography>
            </TeamHeader>
            <TeamContent>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <EmailOutlinedIcon fontSize="small" />
                  <Typography variant="body2">{member.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalPhoneOutlinedIcon fontSize="small" />
                  <Typography variant="body2">{member.mobileNumber}</Typography>
                </Box>
              </Box>

              {(projectManager.email === credentials.email ||
                teamLead.email === credentials.email) && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleDialogOpen(member)}
                    fullWidth
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleDrawerOpen(member)}
                    fullWidth
                  >
                    Generate Task
                  </Button>
                </Box>
              )}
            </TeamContent>
          </TeamCard>
        ))}
      </Box>

      <Dialog
        open={isTaskDialogOpen}
        onClose={handleTaskDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            pb: 2,
          }}
        >
          <Typography variant="h6" component="div">
            Task Details
          </Typography>
          <IconButton onClick={handleTaskDialogClose}>
            {/* <CloseIcon /> */}
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {selectedTask && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Task Name
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedTask.name || "N/A"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Assigned To
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedTask.userName || "N/A"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedTask.email || "N/A"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedTask.startDate
                      ? new Date(selectedTask.startDate).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    End Date
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedTask.endDate
                      ? new Date(selectedTask.endDate).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedTask.status || "N/A"}
                    color={
                      selectedTask.status === "Completed"
                        ? "success"
                        : selectedTask.status === "In Progress"
                        ? "warning"
                        : selectedTask.status === "Pending"
                        ? "error"
                        : "default"
                    }
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6 }}>
                    {selectedTask.description || "No description available"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={handleTaskDialogClose}
            variant="contained"
            sx={{
              backgroundColor: "#1a237e",
              "&:hover": {
                backgroundColor: "#000051",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleDrawerClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "500px" },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* <GenerateTaskProject
            member={selectedMember}
            onClose={handleDrawerClose}
          /> */}
          <GenerateTaskProject
            email={selectedMember}
            projectData={formData}
            projectId={projectId}
            onClose={handleDrawerClose}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default ProjectEmpDetails;


