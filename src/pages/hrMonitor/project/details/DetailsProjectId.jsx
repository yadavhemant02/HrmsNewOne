import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Container,
  Avatar,
  Button,
  Dialog,
  IconButton,
  DialogContent,
  DialogActions,
  DialogTitle,
  Drawer,
  Stack,
  LinearProgress,
  Grid,
} from "@mui/material";
import {
  CalendarMonth as CalendarMonthIcon,
  WorkHistory as WorkHistoryIcon,
  Timer as TimerIcon,
  Edit as EditIcon,
  LocalPhoneOutlined as LocalPhoneOutlinedIcon,
  EmailOutlined as EmailOutlinedIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import UpdateProjectDrawer from "../UpdateProjectDrawer";
import GenerateTaskProject from "../GenerateTaskProject";
import { base_emp, base_hr, base_identity, base_Ip } from "../../../../http/services";

// Styled Components

const GradientBanner = styled(Box)({
  background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
  padding: "24px",
  color: "white",
  borderTopLeftRadius: "20px",
  borderTopRightRadius: "20px",
  marginLeft: "25px",
  marginRight: "25px",
});

const CardGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px",
  padding: "24px",
  background: "#f5f7fa",
});

const InfoCard = styled(Card)({
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  background: "white",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
});

const ProgressBar = styled(LinearProgress)({
  height: "8px",
  borderRadius: "4px",
  backgroundColor: "#e3f2fd",
  "& .MuiLinearProgress-bar": {
    backgroundImage: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
  },
});

const StatusChip = styled(Box)(({ status }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 16px",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: 500,
  backgroundColor: status === "PENDING" ? "#ffebee" : "#e8f5e9",
  color: status === "PENDING" ? "#c62828" : "#2e7d32",
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

const DetailsProjectId = () => {
  const { projectId } = useParams();

  console.log(projectId,"NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN")

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
    projectId:projectId
  });

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
            projectId:projectId || "",
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

    // Add cleanup function
    return () => {
      // Cleanup if needed
    };
  }, [projectId]);

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
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/project/get/project-data/by-project-id?projectId=${projectId}`
      );
      const projectData = response.data.result[0];
      setProjectDetailId(projectData);

      if (response.status === 201) {
        // Fetch Project Manager details
        try {
          const projectManagerRes = await axios.get(
            `${base_identity}/identity-handler/details/get-emp-details/by-emp-email?empEmail=${projectData.projectManager}`
          );
          const empCode = projectManagerRes.data.empCode;
          setProjectManager({
            name: projectManagerRes.data.name,
            email: projectManagerRes.data.officialEmail,
            mobileNumber: projectManagerRes.data.primaryPhone,
            designation: projectManagerRes.data.disignation,
          });
          const projectManagerImage = await axios.get(
            `${base_emp}/emp-handler/image/get-emp-image?empCode=${empCode}`
          );
          console.log(
            projectManagerImage.data.result,
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
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
          console.log(
            teamLeadImage.data.result,
            "sssssssssssssssssssssssssssssss"
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
            console.log(membersData,"dddddddddddddddddddddddddddddddddd")
          }
        } catch (error) {
          console.error("Error fetching team member details:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

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

  

  return (
    <Box>
      <GradientBanner>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="500" gutterBottom>
              {projectDetailId.projectName}
            </Typography>
            <Typography>Project ID: {projectDetailId.projectId}</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDrawer1(true)}
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            Update Project
          </Button>
        </Box>
      </GradientBanner>

      <CardGrid>
        <InfoCard>
          <Typography variant="h6" gutterBottom>
            Project Progress
          </Typography>
          <Box sx={{ mt: 4, mb: 2 }}>
            <ProgressBar variant="determinate" value={75} />
          </Box>
          <Typography align="right" color="primary" variant="h6">
            75% Complete
          </Typography>
        </InfoCard>

        <InfoCard>
          <Typography variant="h6" gutterBottom>
            Budget
          </Typography>
          <Typography variant="h4" color="primary" sx={{ mt: 4 }}>
            ${Number(projectDetailId.budged || 0).toLocaleString()}
          </Typography>
        </InfoCard>

        <InfoCard>
          <Typography variant="h6" gutterBottom>
            Status
          </Typography>
          <StatusChip status={projectDetailId.status} sx={{ mt: 4 }}>
            {projectDetailId.status || "PENDING"}
          </StatusChip>
        </InfoCard>
      </CardGrid>

      {/* Team Section */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Project Team
        </Typography>

        {/* Leadership Cards */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 3,
              mb: 4,
              width: "100%",
            }}
          >
            {/* Project Manager */}
            <TeamCard sx={{ width: "100%" }}>
              <TeamHeader>
                <Typography variant="h6">Project Manager</Typography>
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
                      <Typography variant="h6">
                        {projectManager.name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                        <Typography variant="body2">
                          {teamLead.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </TeamContent>
            </TeamCard>
          </Box>

          <Box
            sx={{
              width: "100%",
              borderRadius: "12px",
              background: "linear-gradient(to right bottom, #ffffff, #fafafa)",
              //  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
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
                  display: "flex",
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
                    {projectDetailId.discription || "No description available"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Team Members Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 3,
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
                    <Typography variant="body2">
                      {member.mobileNumber}
                    </Typography>
                  </Box>
                </Box>
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
              </TeamContent>
            </TeamCard>
          ))}
        </Box>
      </Box>

      {/* Dialogs and Drawers */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Member Details</Typography>
            <IconButton onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMember && (
            <Box sx={{ p: 2 }}>
              {/* Add detailed member information here */}
            </Box>
          )}
        </DialogContent>
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
          <GenerateTaskProject
            member={selectedMember}
            onClose={handleDrawerClose}
          />
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={openDrawer1}
        onClose={() => setOpenDrawer1(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "500px" },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <UpdateProjectDrawer
            projectId={projectId}
            onClose={() => setOpenDrawer1(false)}
            onUpdate={fetchProjectDetails}
          />
        </Box>
      </Drawer>

      {/* Member Details Dialog Content */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Member Details</Typography>
            <IconButton onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.name}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Designation
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.designation}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Project Role
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.projectDesignation}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.email}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.mobileNumber}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6">Generate Task</Typography>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <GenerateTaskProject
            email={selectedMember}
            projectData={formData}
            projectId={projectId}
            onClose={handleDrawerClose}
          />
        </Box>
      </Drawer>

      {/* Project Update Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer1}
        onClose={() => setOpenDrawer1(false)}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6">Update Project</Typography>
            <IconButton onClick={() => setOpenDrawer1(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            <UpdateProjectDrawer
              projectData={formData}
              onClose={() => setOpenDrawer1(false)}
              onUpdate={() => {
                setOpenDrawer1(false);
                fetchProjectDetails();
              }}
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DetailsProjectId;
