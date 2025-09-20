import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import { base_hr, base_identity, base_Ip } from "../../../http/services";

const UpdateProjectDrawer = ({ projectData = {}, onClose, onUpdate }) => {


  console.log(projectData,"yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
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
    projectId:""
  });

  const [teamMemberFields, setTeamMemberFields] = useState([
    { key: "", value: "" },
  ]);

  // Initialize form data when projectData changes
  useEffect(() => {
    if (projectData) {
      // Format dates
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        projectName: projectData.projectName || '',
        startDate: formatDate(projectData.startDate),
        endDate: formatDate(projectData.endDate),
        budged: projectData.budged || 0,
        projectManager: projectData.projectManager || '',
        teamLead: projectData.teamLead || '',
        discription: projectData.discription || '',
        status: projectData.status || '',
        teamsMember: projectData.teamsMember || {},
         projectId: projectData.projectId || ''
      });

      // Convert teamsMember object to array for team member fields
      if (projectData.teamsMember) {
        const teamMemberArray = Object.entries(projectData.teamsMember).map(([key, value]) => ({
          key,
          value
        }));
        setTeamMemberFields(teamMemberArray.length > 0 ? teamMemberArray : [{ key: '', value: '' }]);
      }
    }
  }, [projectData]);

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [employeeEmails, setEmployeeEmails] = useState([]);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "inProgress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  // Fetch employee emails
  useEffect(() => {
    const getEmail = async () => {
      try {
        const response = await axios.get(
          `${base_identity}/identity-handler/auth/all-emp`
        );
        const emails = response.data.map((employee) => ({
          value: employee.email,
        }));
        setEmployeeEmails(emails);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };
    getEmail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const newFields = [...teamMemberFields];
    newFields[index][field] = value;
    setTeamMemberFields(newFields);

    // Update formData.teamsMember
    const newTeamMembers = {};
    newFields.forEach((member) => {
      if (member.key && member.value) {
        newTeamMembers[member.key] = member.value;
      }
    });
    setFormData((prev) => ({
      ...prev,
      teamsMember: newTeamMembers,
    }));
  };

  const addTeamMemberField = () => {
    setTeamMemberFields([...teamMemberFields, { key: "", value: "" }]);
  };

  const removeTeamMemberField = (index) => {
    if (teamMemberFields.length > 1) {
      const newFields = teamMemberFields.filter((_, i) => i !== index);
      setTeamMemberFields(newFields);

      // Update formData.teamsMember
      const newTeamMembers = {};
      newFields.forEach((member) => {
        if (member.key && member.value) {
          newTeamMembers[member.key] = member.value;
        }
      });
      setFormData((prev) => ({
        ...prev,
        teamsMember: newTeamMembers,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Use PUT for update instead of POST
      await axios.post(
         `${base_hr}/hr-handler/project/add/project-data`,
               formData
      );
      setAlertMessage("Project updated successfully!");
      setAlertSeverity("success");
      setOpenSnackbar(true);

      if (onUpdate) {
        onUpdate();
      }

      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Failed to update project!");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '600px',
        height: "100%",
        padding: 2,
        bgcolor: "background.paper",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          border: "1px solid rgba(46, 209, 137, 0.5)",
          borderRadius: "10px",
          padding: { xs: "20px", md: "30px" },
          margin: "auto",
        }}
      >
        <Typography
          variant="h4"
          component="p"
          sx={{
            fontFamily: "inherit",
            textAlign: "center",
            marginBottom: "20px",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Update Project
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="projectName"
              label="Project Name"
              variant="outlined"
              value={formData.projectName || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={formData.endDate || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="budged"
              label="Budget"
              type="number"
              value={formData.budged || 0}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              name="projectManager"
              label="Project Manager"
              value={formData.projectManager || ''}
              onChange={handleChange}
              fullWidth
            >
              {employeeEmails.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              name="teamLead"
              label="Team Lead"
              value={formData.teamLead || ''}
              onChange={handleChange}
              fullWidth
            >
              {employeeEmails.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="discription"
              label="Description"
              multiline
              rows={4}
              value={formData.discription || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              name="status"
              label="Status"
              value={formData.status || ''}
              onChange={handleChange}
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1">Team Members</Typography>
              <IconButton onClick={addTeamMemberField} color="primary">
                <AddCircleIcon />
              </IconButton>
            </Box>
            {teamMemberFields.map((field, index) => (
              <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  select
                  label="Member"
                  value={field.key || ''}
                  onChange={(e) =>
                    handleTeamMemberChange(index, "key", e.target.value)
                  }
                  size="small"
                  sx={{ flex: 1 }}
                >
                  {employeeEmails.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Member Role"
                  value={field.value || ''}
                  onChange={(e) =>
                    handleTeamMemberChange(index, "value", e.target.value)
                  }
                  size="small"
                  sx={{ flex: 1 }}
                />
                <IconButton
                  onClick={() => removeTeamMemberField(index)}
                  disabled={teamMemberFields.length === 1}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                width: "100%",
                backgroundColor: "#2ed189",
                "&:hover": {
                  backgroundColor: "#25b374",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Update Project"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateProjectDrawer;
