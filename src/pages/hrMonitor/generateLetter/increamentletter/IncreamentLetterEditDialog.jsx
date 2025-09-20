import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { base_emp, base_hr, base_identity } from '../../../../http/services'

const DEFAULT_INCREMENT_POINTS = [
  "We are pleased to inform you that based on your performance and contribution to the organization, the management has approved a salary revision for you.",
  `The revised salary structure will be effective from [effective date].`,
  "All other terms and conditions of your employment remain unchanged.",
  "[special note]",
  "We congratulate you on your salary revision and look forward to your continued excellent performance.",
  "Please sign and return a copy of this letter as acknowledgment of your acceptance of the revised terms."
];

const DEFAULT_INCREMENT_HEADER = (organizationName) => `We are pleased to inform you that based on your performance and contribution to ${organizationName}, the management has decided to revise your compensation package.`;

const DEFAULT_INCREMENT_FOOTER = (organizationName) => `We appreciate your continued dedication and contribution to ${organizationName}. We look forward to your continued success and growth with the organization.

Please sign and return a copy of this letter as acknowledgment of your acceptance of the revised terms.`;

const DEFAULT_COMPANY_ADDRESS = "The Hive at VR Bengaluru, ITPL Main Road\nMahadevpura, Bengaluru - 560048";

const IncreamentLetterEditDialog = ({ open, onClose, organizationCode, organizationName,onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    header: '',
    incrementPoints: [],
    footer: '',
    signatureName: '',
    companyAddress: DEFAULT_COMPANY_ADDRESS
  });
  const [newPoint, setNewPoint] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isUsingDefault, setIsUsingDefault] = useState(true);

  useEffect(() => {
    if (open && organizationCode) {
      fetchIncrementContent();
    }
  }, [open, organizationCode, organizationName]);

  const fetchIncrementContent = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${base_hr}/hr-handler/increment/find-increment-leter-content?organizationCode=${organizationCode}&content=increment`
      );
      
      if (response.data?.result) {
        // Get points from API response
        const apiPoints = response?.data?.result?.offerSummury 
          ? Object.values(response?.data?.result?.offerSummury).filter(point => point)
          : [];
          
        // Check if we're using custom content
        const hasCustomContent = apiPoints.length > 0 || 
          response.data.result.header || 
          response.data.result.footer ||
          response.data.result.signatureName ||
          response.data.result.companyAddress;
        
        setIsUsingDefault(!hasCustomContent);
        
        // Use API points if they exist, otherwise use default points
        const points = apiPoints.length > 0 ? apiPoints : DEFAULT_INCREMENT_POINTS;
        
        setFormData({
          header: response.data.result.header || DEFAULT_INCREMENT_HEADER(organizationName || 'the organization'),
          incrementPoints: points,
          footer: response.data.result.footer || DEFAULT_INCREMENT_FOOTER(organizationName || 'the organization'),
          signatureName: response.data.result.signatureName || '',
          companyAddress: response.data.result.companyAddress || DEFAULT_COMPANY_ADDRESS
        });
      } else {
        // If no API response, use default content
        setIsUsingDefault(true);
        setFormData({
          header: DEFAULT_INCREMENT_HEADER(organizationName || 'the organization'),
          incrementPoints: DEFAULT_INCREMENT_POINTS,
          footer: DEFAULT_INCREMENT_FOOTER(organizationName || 'the organization'),
          signatureName: '',
          companyAddress: DEFAULT_COMPANY_ADDRESS
        });
      }
    } catch (error) {
      console.error('Error fetching increment content:', error);
      showSnackbar('Info | This is the default content. Once you upload, it will extract your increment content.', 'info');
      // On error, use default content
      setIsUsingDefault(true);
      setFormData({
        header: DEFAULT_INCREMENT_HEADER(organizationName || 'the organization'),
        incrementPoints: DEFAULT_INCREMENT_POINTS,
        footer: DEFAULT_INCREMENT_FOOTER(organizationName || 'the organization'),
        signatureName: '',
        companyAddress: DEFAULT_COMPANY_ADDRESS
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setIsUsingDefault(false);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddPoint = () => {
    if (newPoint.trim()) {
      setIsUsingDefault(false);
      setFormData(prev => ({
        ...prev,
        incrementPoints: [...prev.incrementPoints, newPoint.trim()]
      }));
      setNewPoint('');
    }
  };

  const handleDeletePoint = (index) => {
    setIsUsingDefault(false);
    setFormData(prev => ({
      ...prev,
      incrementPoints: prev.incrementPoints.filter((_, i) => i !== index)
    }));
  };

  const handleResetToDefault = () => {
    setIsUsingDefault(true);
    setFormData({
      header: DEFAULT_INCREMENT_HEADER(organizationName || 'the organization'),
      incrementPoints: DEFAULT_INCREMENT_POINTS,
      footer: DEFAULT_INCREMENT_FOOTER(organizationName || 'the organization'),
      signatureName: '',
      companyAddress: DEFAULT_COMPANY_ADDRESS
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Call onSave immediately with current form data
      onSave(formData);
      
      // If using default content, clear the saved content
      if (isUsingDefault) {
        const response = await axios.post(
          `${base_hr}/hr-handler/increment/upload-increment-leter-content`,
          {
            organizationCode,
            header: '',
            offerSummury: {},
            footer: '',
            signatureName: '',
            companyAddress: '',
            content:"increment"
          }
        );

        if (response.status === 200) {
          showSnackbar('Reset to default content successfully', 'success');
          onSave(formData);
          onClose();
        }
        return;
      }
      
      // Convert points array to object format for API
      const incrementPoints = formData.incrementPoints.reduce((acc, point, index) => {
        acc[`additionalProp${index + 1}`] = point;
        return acc;
      }, {});

      const response = await axios.post(
        `${base_hr}/hr-handler/increment/upload-increment-leter-content`,
        {
          organizationCode,
          header: formData.header,
          offerSummury: incrementPoints,
          footer: formData.footer,
          signatureName: formData.signatureName,
          companyAddress: formData.companyAddress,
          content:"increment"
        }
      );

      if (response.status === 200) {
        showSnackbar('Increment letter content saved successfully', 'success');
      }
    } catch (error) {
      console.error('Error saving increment content:', error);
      showSnackbar('Error saving increment content', 'error');
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '80vh',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit Increment Letter Content</Typography>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleResetToDefault}
                sx={{ mr: 2 }}
              >
                Reset to Default
              </Button>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Header Content"
                  multiline
                  rows={4}
                  value={formData.header}
                  onChange={(e) => handleChange('header', e.target.value)}
                  fullWidth
                  variant="outlined"
                  helperText="Enter the header content for the increment letter"
                />
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Increment Points
                    </Typography>
                    {isUsingDefault && (
                      <Typography variant="body2" color="text.secondary">
                        Using default points
                      </Typography>
                    )}
                  </Box>
                  
                  <List>
                    {formData.incrementPoints.map((point, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          bgcolor: 'white', 
                          mb: 1, 
                          borderRadius: 1,
                          border: '1px solid #e0e0e0',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'stretch'
                        }}
                      >
                        <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
                          <TextField
                            fullWidth
                            value={point}
                            onChange={(e) => {
                              const newPoints = [...formData.incrementPoints];
                              newPoints[index] = e.target.value;
                              handleChange('incrementPoints', newPoints);
                            }}
                            variant="outlined"
                            size="small"
                            multiline
                            rows={2}
                          />
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleDeletePoint(index)}
                            sx={{ alignSelf: 'flex-start' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <TextField
                      label="Add New Point"
                      value={newPoint}
                      onChange={(e) => setNewPoint(e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddPoint();
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddPoint}
                      disabled={!newPoint.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Footer Content"
                  multiline
                  rows={4}
                  value={formData.footer}
                  onChange={(e) => handleChange('footer', e.target.value)}
                  fullWidth
                  variant="outlined"
                  helperText="Enter the footer content for the increment letter"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Signatory Name"
                  value={formData.signatureName}
                  onChange={(e) => handleChange('signatureName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  helperText="Enter the name of the person who will sign the letter"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Company Address"
                  multiline
                  rows={3}
                  value={formData.companyAddress}
                  onChange={(e) => handleChange('companyAddress', e.target.value)}
                  fullWidth
                  variant="outlined"
                  helperText="Enter the company address that will appear in the letterhead"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default IncreamentLetterEditDialog;