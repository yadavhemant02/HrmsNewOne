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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { base_identity } from '../../../http/services';

// Add default content constants
const DEFAULT_OFFER_POINTS = [
  "You are required to join the services of the Organization at the earliest, but in any case, not later than 18th March, 2024 or any other date approved by the Organization in writing, failing which this offer shall automatically stand cancelled. Your employment with the Organization shall commence on the date of your joining the Organization and shall be subject to the terms and conditions stated in this letter along with the enclosures.",
  "This offer is made to you on the basis of the information and documents that you have furnished to the Organization as on date of offer.",
  "The Organization reserves the right to conduct background checks, directly or indirectly at any time, to verify such information and documents that you would provide in support of your age, academic qualifications, previous work experience and relieving letter from your last employer, and other particulars. If any discrepancies are found in such information or documents or if the results of such background checks are found to be unsatisfactory, as determined by the Organization, in its sole discretion, the Organization may withdraw/cancel this offer.",
  "Upon joining, your compensation will be as described in Annexure A.",
  "Your employment will be governed by the terms and conditions detailed in Annexure B hereto.",
  "You shall keep the contents of this offer and the Annexure here to confidential.",
  "On joining, you will be required to sign an agreement based on the Independence, Non – solicitation and Prevention of Insider Trading policies of the Organization.",
  "This offer shall automatically stand withdrawn if we do not receive your acceptance within five (5) working days from the date hereof."
];

const DEFAULT_OFFER_HEADER = (organizationName) => `Thank you for exploring career opportunities with ${organizationName} (here in after referred to as the "Organization").`;

const DEFAULT_OFFER_FOOTER = (organizationName) => `Please acknowledge your acceptance of our offer, as well as having read and understood the terms of service given in the Annexure, by signing and returning the duplicate copy of this letter.

We look forward to your joining the ${organizationName} family and to your valued contribution in taking the Organization to greater heights. We are sure that our working environment will be conducive and will help you to grow professionally as well as personally.

With warm regards,`;

const INTERN_OFFER_HEADER = (organizationName) => `Thank you for your interest in building a career with ${organizationName} (hereinafter referred to as the "Organization"). We are pleased to extend to you an offer for an internship with us.`;

const INTERN_OFFER_POINTS = [
  "Your internship is expected to commence on [Start Date] and will conclude on [End Date], unless extended or curtailed in writing by the Organization.",
  "You will be paid a monthly stipend of INR [Amount], as described in Annexure A.",
  "You shall maintain confidentiality and abide by the rules and regulations of the Organization during your internship.",
  "You may be assigned to any project, team, or mentor as deemed fit by the Organization.",
  "This internship does not constitute an offer of employment. However, based on your performance, there may be an opportunity for a full-time offer at the end of the internship.",
  "You must submit a copy of your college ID, address proof, and a letter of approval (if required) from your institution before commencement.",
  "Any violation of organizational policies may result in early termination of the internship."
];

const INTERN_OFFER_FOOTER = (organizationName) => `Please acknowledge your acceptance of this internship by signing and returning a copy of this letter within five (5) working days.\n\nWe look forward to having you onboard and believe this internship will be an enriching experience.\n\nWarm regards,`;

const CONSULTANT_OFFER_HEADER = (organizationName) => `We are pleased to offer you the position of Consultant with ${organizationName} (hereinafter referred to as the "Organization") for a project-based engagement.`;

const CONSULTANT_OFFER_POINTS = [
  "The consultancy shall commence on [Start Date] and will continue until [End Date], unless extended or terminated earlier by either party with [Notice Period] written notice.",
  "You shall be paid a professional fee of INR [Amount] per [hour/day/month/project], subject to applicable tax deductions.",
  "This is a consultancy engagement and not an employment relationship. Therefore, statutory benefits like PF, gratuity, etc., will not be applicable.",
  "You agree to maintain confidentiality and avoid conflict of interest during and post this engagement.",
  "The Organization may request supporting documents (PAN, GST certificate if applicable, work samples) for administrative purposes.",
  "Deliverables and milestones will be communicated in advance and reviewed periodically.",
  "Either party may terminate this arrangement by providing notice as mentioned above."
];

const CONSULTANT_OFFER_FOOTER = (organizationName) => `Kindly confirm your acceptance of the terms by signing and returning a copy of this letter within five (5) working days.\n\nWe look forward to a fruitful association.\n\nSincerely,`;

const PARTTIME_OFFER_HEADER = (organizationName) => `We are pleased to offer you a part-time position at ${organizationName}.`;

const PARTTIME_OFFER_POINTS = [
  "Your part-time engagement will begin on [Start Date]. Your working hours will be [e.g., 4 hours per day, 3 days a week], or as otherwise communicated.",
  "You will be entitled to a compensation of INR [Amount] per [hour/day/month], as outlined in Annexure A.",
  "This is a part-time role and will not include standard benefits applicable to full-time employees (e.g., PF, gratuity, insurance).",
  "You will be expected to maintain discipline, confidentiality, and performance standards during your tenure.",
  "Your engagement may be terminated by either party with [X days] notice or equivalent compensation.",
  "On joining, you will be required to submit relevant documents for verification."
];

const PARTTIME_OFFER_FOOTER = (organizationName) => `Please confirm your acceptance of the terms by signing and returning a copy of this letter within five (5) working days.\n\nWe welcome you to the ${organizationName} family and look forward to your valuable contribution.\n\nWarm regards,`;

const DEFAULT_SIGNATURE_NAME = "Smita Kashyap";
const DEFAULT_COMPANY_ADDRESS = "The Hive at VR Bengaluru, ITPL Main Road\nMahadevpura, Bengaluru - 560048";

const getOfferContentDefaults = (empType, organizationName) => {
  switch (empType) {
    case "Intern":
      return {
        header: INTERN_OFFER_HEADER(organizationName),
        offerSummury: INTERN_OFFER_POINTS,
        footer: INTERN_OFFER_FOOTER(organizationName),
        signatureName: "Bharat Shetty", // Default for Intern
        companyAddress: DEFAULT_COMPANY_ADDRESS,
      };
    case "Consultant":
      return {
        header: CONSULTANT_OFFER_HEADER(organizationName),
        offerSummury: CONSULTANT_OFFER_POINTS,
        footer: CONSULTANT_OFFER_FOOTER(organizationName),
        signatureName: DEFAULT_SIGNATURE_NAME, // Default for Consultant
        companyAddress: DEFAULT_COMPANY_ADDRESS,
      };
    case "Part Time":
      return {
        header: PARTTIME_OFFER_HEADER(organizationName),
        offerSummury: PARTTIME_OFFER_POINTS,
        footer: PARTTIME_OFFER_FOOTER(organizationName),
        signatureName: DEFAULT_SIGNATURE_NAME, // Default for Part Time
        companyAddress: DEFAULT_COMPANY_ADDRESS,
      };
    case "Full Time":
    case "Others": // Fallback for "Others" to Full Time defaults
    default:
      return {
        header: DEFAULT_OFFER_HEADER(organizationName),
        offerSummury: DEFAULT_OFFER_POINTS,
        footer: DEFAULT_OFFER_FOOTER(organizationName),
        signatureName: DEFAULT_SIGNATURE_NAME,
        companyAddress: DEFAULT_COMPANY_ADDRESS,
      };
  }
};

const OfferLetterEditNew = ({ open, onClose, organizationCode, organizationName, onSave, empType }) => {
  const [loading, setLoading] = useState(false);
  const [showPdfDialog, setShowPdfDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formData, setFormData] = useState({
    header: '',
    offerSummury: [],
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
      fetchOfferContent();
    }
  }, [open, organizationCode, organizationName, empType]);

  const fetchOfferContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_identity}/identity-handler/content/get-offer-content?orgnaizationCode=${organizationCode}&empType=${empType}`
      );
      
      if (response.data && Object.keys(response.data).length > 0) {
        // Get points from API response
        const apiPoints = response.data.offerSummury 
          ? Object.values(response.data.offerSummury).filter(point => point)
          : [];
          
        // Check if we're using custom content
        const hasCustomContent = apiPoints.length > 0 || 
          response.data.header || 
          response.data.footer ||
          response.data.signatureName ||
          response.data.companyAddress;
        
        setIsUsingDefault(!hasCustomContent);
        
        // Use API points if they exist, otherwise use type-specific default points
        const defaults = getOfferContentDefaults(empType, organizationName);
        const points = apiPoints.length > 0 ? apiPoints : defaults.offerSummury;
        
        setFormData({
          header: response.data.header || defaults.header,
          offerSummury: points,
          footer: response.data.footer || defaults.footer,
          signatureName: response.data.signatureName || defaults.signatureName,
          companyAddress: response.data.companyAddress || defaults.companyAddress
        });
      } else {
        // If no API response, use type-specific default content
        setIsUsingDefault(true);
        const defaults = getOfferContentDefaults(empType, organizationName);
        setFormData({
          header: defaults.header,
          offerSummury: defaults.offerSummury,
          footer: defaults.footer,
          signatureName: defaults.signatureName,
          companyAddress: defaults.companyAddress
        });
      }
    } catch (error) {
      console.error('Error fetching offer content:', error);
      showSnackbar('Info | This is the default content. Once you upload, it will extract your OfferLetter content.', 'info');
      // On error, use type-specific default content
      setIsUsingDefault(true);
      const defaults = getOfferContentDefaults(empType, organizationName);
      setFormData({
        header: defaults.header,
        offerSummury: defaults.offerSummury,
        footer: defaults.footer,
        signatureName: defaults.signatureName,
        companyAddress: defaults.companyAddress
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
        offerSummury: [...prev.offerSummury, newPoint.trim()]
      }));
      setNewPoint('');
    }
  };

  const handleDeletePoint = (index) => {
    setIsUsingDefault(false);
    setFormData(prev => ({
      ...prev,
      offerSummury: prev.offerSummury.filter((_, i) => i !== index)
    }));
  };

  const handleResetToDefault = () => {
    setIsUsingDefault(true);
    const defaults = getOfferContentDefaults(empType, organizationName);
    setFormData({
      header: defaults.header,
      offerSummury: defaults.offerSummury,
      footer: defaults.footer,
      signatureName: defaults.signatureName,
      companyAddress: defaults.companyAddress
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // If using default content, clear the saved content
      // if (isUsingDefault) {
      //   const response = await axios.post(
      //     `${base_identity}/identity-handler/content/save-offer-content`,
      //     {
      //       organizationCode,
      //       header: '',
      //       offerSummury: {},
      //       footer: '',
      //       signatureName: '',
      //       companyAddress: '',
      //       empType: empType // Add empType here
      //     }
      //   );

      //   if (response.status === 200) {
      //     showSnackbar('Reset to default content successfully', 'success');
      //     onSave(formData);
      //     onClose();
      //   }
      //   return;
      // }
      
      // Convert points array to object format for API
      const offerSummury = formData.offerSummury.reduce((acc, point, index) => {
        acc[`additionalProp${index + 1}`] = point;
        return acc;
      }, {});

      const response = await axios.post(
        `${base_identity}/identity-handler/content/save-offer-content`,
        {
          organizationCode,
          header: formData.header,
          offerSummury,
          footer: formData.footer,
          signatureName: formData.signatureName,
          companyAddress: formData.companyAddress,
          empType: empType // Add empType here
        }
      );

      if (response.status === 200) {
        showSnackbar('Offer letter content saved successfully', 'success');
        onSave(formData);
        onClose();
      }
    } catch (error) {
      console.error('Error saving offer content:', error);
      showSnackbar('Error saving offer content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      showSnackbar('Please select a valid PDF file', 'error');
    }
  };

  const handlePdfUpload = async () => {
    if (!selectedFile) {
      showSnackbar('Please select a PDF file first', 'error');
      return;
    }

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(
        `${base_identity}/identity-handler/content/gett-salesforce-data`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        // Update form data with extracted content
        const extractedData = response.data;
        
        // Get default content for the current employee type
        const defaults = getOfferContentDefaults(empType, organizationName);
        
        // Update header - use extracted header or default based on employee type
        if (extractedData.header) {
          // For different employee types, we need to modify the header accordingly
          let headerContent = extractedData.header;
          if (empType === "Intern") {
            headerContent = headerContent.replace(
              "offer of employment",
              "offer for an internship"
            );
          } else if (empType === "Consultant") {
            headerContent = headerContent.replace(
              "offer of employment",
              "offer for a consultancy position"
            );
          } else if (empType === "Part Time") {
            headerContent = headerContent.replace(
              "offer of employment",
              "offer for a part-time position"
            );
          }
          handleChange('header', headerContent);
        } else {
          handleChange('header', defaults.header);
        }

        // Update offer summary points
        if (extractedData.numberedPoints && extractedData.numberedPoints.length > 0) {
          // For different employee types, we need to modify the points accordingly
          let points = extractedData.numberedPoints;
          
          if (empType === "Intern") {
            // Modify points for intern
            points = points.map(point => {
              return point
                .replace(/employment/g, "internship")
                .replace(/employee/g, "intern")
                .replace(/joining/g, "commencement");
            });
          } else if (empType === "Consultant") {
            // Modify points for consultant
            points = points.map(point => {
              return point
                .replace(/employment/g, "consultancy")
                .replace(/employee/g, "consultant")
                .replace(/joining/g, "engagement");
            });
          } else if (empType === "Part Time") {
            // Modify points for part-time
            points = points.map(point => {
              return point
                .replace(/employment/g, "part-time engagement")
                .replace(/employee/g, "part-time associate")
                .replace(/joining/g, "commencement");
            });
          }
          
          handleChange('offerSummury', points);
        } else {
          handleChange('offerSummury', defaults.offerSummury);
        }

        // Update footer
        if (extractedData.footer) {
          let footerContent = extractedData.footer;
          
          // Modify footer based on employee type
          if (empType === "Intern") {
            footerContent = footerContent
              .replace(/joining/g, "commencement")
              .replace(/employment/g, "internship");
          } else if (empType === "Consultant") {
            footerContent = footerContent
              .replace(/joining/g, "engagement")
              .replace(/employment/g, "consultancy");
          } else if (empType === "Part Time") {
            footerContent = footerContent
              .replace(/joining/g, "commencement")
              .replace(/employment/g, "part-time engagement");
          }
          
          handleChange('footer', footerContent);
        } else {
          handleChange('footer', defaults.footer);
        }

        // Extract signature name from footer if available
        if (extractedData.footer) {
          const signatureMatch = extractedData.footer.match(/For [^,]+,\s*Signature\s*([^\n]+)/);
          if (signatureMatch && signatureMatch[1]) {
            handleChange('signatureName', signatureMatch[1].trim());
          } else {
            handleChange('signatureName', defaults.signatureName);
          }
        } else {
          handleChange('signatureName', defaults.signatureName);
        }

        // Keep the existing company address unchanged
        // Removed the company address update logic

        showSnackbar('PDF content extracted and adapted for ' + empType + ' offer letter', 'success');
        setShowPdfDialog(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      showSnackbar('Error extracting PDF content', 'error');
    } finally {
      setUploadLoading(false);
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
            <Typography variant="h6">Edit Offer Letter Content</Typography>
            <Box>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={() => setShowPdfDialog(true)}
                sx={{ mr: 2 }}
              >
                Upload Pdf For Extraction
              </Button>
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
                  helperText="Enter the header content for the offer letter"
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
                  helperText="Enter the company address that will appear in the letterhead (use Enter for line breaks)"
                  sx={{ '& .MuiInputBase-input': { whiteSpace: 'pre-line' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Offer Summary Points
                    </Typography>
                    {isUsingDefault && (
                      <Typography variant="body2" color="text.secondary">
                        Using default points
                      </Typography>
                    )}
                  </Box>
                  
                  <List>
                    {formData.offerSummury.map((point, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          bgcolor: 'white', 
                          mb: 1, 
                          borderRadius: 1,
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <TextField
                          fullWidth
                          multiline
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...formData.offerSummury];
                            newPoints[index] = e.target.value;
                            handleChange('offerSummury', newPoints);
                          }}
                          variant="outlined"
                          size="small"
                          sx={{ '& .MuiInputBase-input': { whiteSpace: 'pre-line' } }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleDeletePoint(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
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
                  helperText="Enter the footer content for the offer letter"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Signature Name"
                  value={formData.signatureName}
                  onChange={(e) => handleChange('signatureName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  helperText="Enter the name that will appear as signature"
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

      {/* PDF Upload Dialog */}
      <Dialog
        open={showPdfDialog}
        onClose={() => setShowPdfDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Upload PDF for Extraction</Typography>
            <IconButton onClick={() => setShowPdfDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept="application/pdf"
              style={{ display: 'none' }}
              id="pdf-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="pdf-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Select PDF File
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPdfDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePdfUpload}
            variant="contained"
            color="primary"
            disabled={!selectedFile || uploadLoading}
          >
            {uploadLoading ? <CircularProgress size={24} /> : 'Extract Content'}
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

export default OfferLetterEditNew;