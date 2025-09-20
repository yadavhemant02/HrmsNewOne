import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import axios from "axios";
import { base_hr } from "../../../http/services";

const GenerateTaskProject = ({ email, projectData, projectId, onClose }) => {
  const [formData, setFormData] = useState({
    projectName: projectData?.projectName || "",
    projectId: projectId || "",
    email: email?.email || "",
    assignee: "",
    startDate: "",
    endDate: "",
    taskTittel: "",
    task: "",
    todayDate: new Date().toISOString().split('T')[0],
    modifyAt: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (projectData && email && projectId) {
      setFormData(prev => ({
        ...prev,
        projectName: projectData.projectName || "",
        projectId: projectId,
        email: email.email || "",
      }));
    }
  }, [projectData, email, projectId]);

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.taskTittel || !formData.task || !formData.assignee || !formData.startDate || !formData.endDate) {
      setAlertMessage("Please fill in all required fields!");
      setAlertSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${base_hr}/hr-handler/project-task/add/project-task-data`,
        formData
      );

      if (response.status === 201 || response.status === 200) {
        setAlertMessage("Task generated successfully!");
        setAlertSeverity("success");
        setOpenSnackbar(true);

        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage(error.response?.data?.message || "Failed to generate task!");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
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
          Generate Task
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="projectName"
              label="Project Name"
              variant="outlined"
              value={formData.projectName}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="projectId"
              label="Project ID"
              variant="outlined"
              value={formData.projectId}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="email"
              label="Team Member Email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="assignee"
              label="Assignee"
              variant="outlined"
              value={formData.assignee}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.assignee}
              helperText={!formData.assignee ? "Assignee is required" : ""}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.startDate}
              helperText={!formData.startDate ? "Start date is required" : ""}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.endDate}
              helperText={!formData.endDate ? "End date is required" : ""}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="taskTittel"
              label="Task Title"
              variant="outlined"
              value={formData.taskTittel}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.taskTittel}
              helperText={!formData.taskTittel ? "Task title is required" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="task"
              label="Task Description"
              multiline
              rows={4}
              value={formData.task}
              onChange={handleChange}
              fullWidth
              required
              error={!formData.task}
              helperText={!formData.task ? "Task description is required" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading || !formData.taskTittel || !formData.task || !formData.assignee || !formData.startDate || !formData.endDate}
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
                "Generate Task"
              )}
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

export default GenerateTaskProject;