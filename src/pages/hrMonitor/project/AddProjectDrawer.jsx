import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
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

const AddProjectDrawer = ({ isOpen, onClose }) => {
  // Initial form state
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

  // State for managing team member inputs
  const [teamMemberFields, setTeamMemberFields] = useState([
    { key: "", value: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "inProgress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle team member field changes
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

  // Add new team member field
  const addTeamMemberField = () => {
    setTeamMemberFields([...teamMemberFields, { key: "", value: "" }]);
  };

  // Remove team member field
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
      await axios.post(
        `${base_hr}/hr-handler/project/add/project-data`,
        formData
      );
      console.log("Form Data:", formData);
      setAlertMessage("Project details logged successfully!");
      setAlertSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        setFormData({
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
        setTeamMemberFields([{ key: "", value: "" }]);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Failed to process form data!");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same until the team members section

  const [employeeEmails, setEmployeeEmails] = useState([]);
  const getEmail = async () => {
    try {
      const response = await axios.get(
        `${base_identity}/identity-handler/auth/all-emp`
      );
      const emails = response.data.map((employee) => ({
        value: employee.email,
      }));
      setEmployeeEmails(emails);
      console.log(employeeEmails);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmail();
  }, []);
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      {/* Previous Box and Typography components remain the same */}
      <Box
        sx={{
          width: 500,
          height: "100%",
          padding: 2,
          mt: "64px",
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
              fontFamily: "cursive",
              textAlign: "center",
              marginBottom: "20px",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Add Project
          </Typography>

          <Grid container spacing={2}>
            {/* Previous form fields remain the same */}
            <Grid item xs={12}>
              <TextField
                name="projectName"
                label="Project Name"
                variant="outlined"
                value={formData.projectName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                value={formData.startDate}
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
                value={formData.endDate}
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
                value={formData.budged}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                name="projectManager"
                label="Project Manager"
                value={formData.projectManager}
                onChange={handleChange}
                fullWidth
                helperText="Please select project manager"
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
                value={formData.teamLead}
                onChange={handleChange}
                fullWidth
                helperText="Please select team lead"
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
                value={formData.discription}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                name="status"
                label="Status"
                value={formData.status}
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
                    value={field.key}
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
                    value={field.value}
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
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Add Project"
                )}
              </Button>
            </Grid>
          </Grid>

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
      </Box>
    </Drawer>
  );
};

export default AddProjectDrawer;
