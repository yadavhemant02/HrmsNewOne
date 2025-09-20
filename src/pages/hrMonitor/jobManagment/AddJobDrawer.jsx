import React, { useState, useEffect } from "react";
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
import { base_hr, base_Ip } from "../../../http/services";

const AddJobDrawer = ({ isOpen, onClose, editMode = false, jobData = null }) => {

  

  const [formData, setFormData] = useState({
    jobId: "",
    jobTittel: "",
    jobLocation: "",
    jobType: "",
    workEnvironment: "",
    jobContents: {},
    experince: "",
    team: "",
    organizationName:localStorage.getItem("organizationName"),
    organizationCode:localStorage.getItem("organizationCode")
  });

  // State for managing jobContents entries
  const [contentEntries, setContentEntries] = useState([
    { key: "", values: [""] }
  ]);

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  // Helper function to convert jobContents object to contentEntries array
  const convertJobContentsToEntries = (jobContents) => {
    if (!jobContents || Object.keys(jobContents).length === 0) {
      return [{ key: "", values: [""] }];
    }
    
    return Object.entries(jobContents).map(([key, values]) => ({
      key,
      values: Array.isArray(values) ? values : [values]
    }));
  };

  // Effect to populate form when in edit mode
  useEffect(() => {
    if (editMode && jobData) {
      setFormData({
        jobId: jobData.jobId || "",
        jobTittel: jobData.jobTittel || "",
        jobLocation: jobData.jobLocation || "",
        jobType: jobData.jobType || "",
        workEnvironment: jobData.workEnvironment || "",
        jobContents: jobData.jobContents || {},
        experince: jobData.experince || "",
        team: jobData.team || "",
        organizationName: jobData.organizationName || localStorage.getItem("organizationName"),
        organizationCode: jobData.organizationCode || localStorage.getItem("organizationCode")
      });

      // Convert jobContents to contentEntries format
      const entries = convertJobContentsToEntries(jobData.jobContents);
      setContentEntries(entries);
    } else {
      // Reset form for create mode
      setFormData({
        jobId: "",
        jobTittel: "",
        jobLocation: "",
        jobType: "",
        workEnvironment: "",
        jobContents: {},
        experince: "",
        team: "",
        organizationName: localStorage.getItem("organizationName"),
        organizationCode: localStorage.getItem("organizationCode")
      });
      setContentEntries([{ key: "", values: [""] }]);
    }
  }, [editMode, jobData, isOpen]);

  const jobTypeOptions = [
    "FullTime",
    "Proxy",
    "PartTime"
  ];

  const workEnvironmentOptions = [
    "Remote",
    "OnSite",
    "hybrid"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle changes to content entry keys
  const handleContentKeyChange = (index, value) => {
    const newEntries = [...contentEntries];
    newEntries[index].key = value;
    setContentEntries(newEntries);
    updateJobContents(newEntries);
  };

  // Handle changes to content entry values
  const handleContentValueChange = (entryIndex, valueIndex, value) => {
    const newEntries = [...contentEntries];
    newEntries[entryIndex].values[valueIndex] = value;
    setContentEntries(newEntries);
    updateJobContents(newEntries);
  };

  // Add new value field to an entry
  const addValueField = (entryIndex) => {
    const newEntries = [...contentEntries];
    newEntries[entryIndex].values.push("");
    setContentEntries(newEntries);
  };

  // Remove value field from an entry
  const removeValueField = (entryIndex, valueIndex) => {
    if (contentEntries[entryIndex].values.length > 1) {
      const newEntries = [...contentEntries];
      newEntries[entryIndex].values = newEntries[entryIndex].values.filter(
        (_, index) => index !== valueIndex
      );
      setContentEntries(newEntries);
      updateJobContents(newEntries);
    }
  };

  // Add new content entry
  const addContentEntry = () => {
    setContentEntries([...contentEntries, { key: "", values: [""] }]);
  };

  // Remove content entry
  const removeContentEntry = (index) => {
    if (contentEntries.length > 1) {
      const newEntries = contentEntries.filter((_, i) => i !== index);
      setContentEntries(newEntries);
      updateJobContents(newEntries);
    }
  };

  // Update jobContents in formData
  const updateJobContents = (entries) => {
    const newJobContents = {};
    entries.forEach(entry => {
      if (entry.key.trim() !== "") {
        newJobContents[entry.key] = entry.values.filter(value => value.trim() !== "");
      }
    });
    setFormData(prev => ({
      ...prev,
      jobContents: newJobContents
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editMode) {
        // Edit existing job
        const editPayload = {
          jobTittel: formData.jobTittel,
          jobLocation: formData.jobLocation,
          jobType: formData.jobType,
          workEnvironment: formData.workEnvironment,
          jobContents: formData.jobContents,
          experince: formData.experince,
          team: formData.team,
          organizationName: formData.organizationName,
          organizationCode: formData.organizationCode,
          jobId: formData.jobId
        };
        
        await axios.post(
          `${base_hr}/hr-handler/job/edit-job-details`,
          editPayload
        );
        setAlertMessage("Job updated successfully!");
      } else {
        // Create new job
        await axios.post(
          `${base_hr}/hr-handler/job/add-job`,
          formData
        );
        setAlertMessage("Job posted successfully!");
      }
      
      setAlertSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        setFormData({
          jobId: "",
          jobTittel: "",
          jobLocation: "",
          jobType: "",
          workEnvironment: "",
          jobContents: {},
          experince: "",
          team: "",
          organizationName: localStorage.getItem("organizationName"),
          organizationCode: localStorage.getItem("organizationCode")
        });
        setContentEntries([{ key: "", values: [""] }]);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(editMode ? "Failed to update job!" : "Failed to post job!");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{
        width: 500,
        height: "100%",
        padding: 2,
        mt: "64px",
        bgcolor: "background.paper",
        overflowY: "auto",
      }}>
        <Box sx={{
          border: "1px solid rgba(46, 209, 137, 0.5)",
          borderRadius: "10px",
          padding: { xs: "20px", md: "30px" },
          margin: "auto",
        }}>
          <Typography variant="h4" component="p" sx={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}>
            {editMode ? "Edit Job" : "Add New Job"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="jobTittel"
                label="Job Title"
                value={formData.jobTittel}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="jobLocation"
                label="Job Location"
                value={formData.jobLocation}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                name="jobType"
                label="Job Type"
                value={formData.jobType}
                onChange={handleChange}
                fullWidth
                required
              >
                {jobTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                name="workEnvironment"
                label="Work Environment"
                value={formData.workEnvironment}
                onChange={handleChange}
                fullWidth
                required
              >
                {workEnvironmentOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Job Contents Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1
                }}>
                  <Typography variant="subtitle1">
                    Job Contents
                  </Typography>
                  <IconButton onClick={addContentEntry} color="primary">
                    <AddCircleIcon />
                  </IconButton>
                </Box>
                
                {contentEntries.map((entry, entryIndex) => (
                  <Box key={entryIndex} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <TextField
                        label="Content Section"
                        value={entry.key}
                        onChange={(e) => handleContentKeyChange(entryIndex, e.target.value)}
                        size="small"
                        fullWidth
                        placeholder="e.g., Requirements, Responsibilities"
                      />
                      <IconButton
                        onClick={() => removeContentEntry(entryIndex)}
                        disabled={contentEntries.length === 1}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    
                    {entry.values.map((value, valueIndex) => (
                      <Box key={valueIndex} sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField
                          value={value}
                          onChange={(e) => handleContentValueChange(entryIndex, valueIndex, e.target.value)}
                          size="small"
                          fullWidth
                          placeholder="Enter detail"
                        />
                        <IconButton
                          onClick={() => removeValueField(entryIndex, valueIndex)}
                          disabled={entry.values.length === 1}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    
                    <Button
                      startIcon={<AddCircleIcon />}
                      onClick={() => addValueField(entryIndex)}
                      size="small"
                    >
                      Add Detail
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="experince"
                label="Required Experience"
                value={formData.experince}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="team"
                label="Team"
                value={formData.team}
                onChange={handleChange}
                fullWidth
                required
              />
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
                  "&:hover": { backgroundColor: "#25b374" },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : (editMode ? "Update Job" : "Post Job")}
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

export default AddJobDrawer;