import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Container,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  Divider,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifiedIcon from "@mui/icons-material/Verified";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import { Search as SearchIcon } from "lucide-react";
import { base_emp } from "../../../../http/services";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import DescriptionIcon from '@mui/icons-material/Description';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.1rem",
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(63, 81, 181, 0.08)",
            transition: "background-color 0.2s ease",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
        head: {
          fontWeight: 600,
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: "4px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 6px 18px 0 rgba(0,0,0,0.06)",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "8px 0",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(63, 81, 181, 0.05)",
          "&.Mui-expanded": {
            minHeight: 48,
          },
        },
        content: {
          "&.Mui-expanded": {
            margin: "12px 0",
          },
        },
      },
    },
  },
});

const DocumentVerification = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

const navigate = useNavigate();
  const handleBack=()=>{
    navigate(-1);
  }

  const handleOpenDocument = async (fileName) => {
    try {
      if (!fileName) {
        setError("Document not found");
        return;
      }

      // Construct the full file path
      const fullFileName = `${selectedDocument.email}/${fileName}`;

      const response = await axios.get(
        `${base_emp}/emp-handler/documents/stream-document-by-fileName?fileName=${encodeURIComponent(
          fileName
        )}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = URL.createObjectURL(blob);

      setPreviewUrl(url);
      setPreviewFile({
        name: fileName,
        type: blob.type,
      });
      setPreviewOpen(true);
    } catch (error) {
      console.error("Error fetching file:", error);
      setError("Failed to load document. Please try again.");
    }
  };

  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, verified: 0, uploaded: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmVerifyOpen, setConfirmVerifyOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Education degrees order
  const educationOrder = {
    "10th School": 1,
    "12th School": 2,
    "Bachelor's Degree": 3,
    "Master's Degree": 4,
    PhD: 5,
  };

  // Search handling
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter documents based on email or emp code
    if (value.trim() === "") {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(
        (doc) =>
          doc.email.toLowerCase().includes(value.toLowerCase()) ||
          doc.empCode.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredDocuments(documents);
  };

  useEffect(() => {
    // Fetch data from the API
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${base_emp}/emp-handler/documents/get/all-emp-doctumnets-data?organizationCode=${localStorage.getItem(
            "organizationCode"
          )}`
        );

        if (response.data && response.data.result) {
          const formattedData = response.data.result.map((item) => ({
            id: item.id,
            email: item.email,
            empCode: item.userCode,
            status: item.status === "uploaded" ? "Uploaded" : "Verified",
            lastUpdate: new Date(
              item.modifyAt || Date.now()
            ).toLocaleDateString(),
            fullData: item,
          }));

          setDocuments(formattedData);
          setFilteredDocuments(formattedData);

          // Calculate stats
          const verified = formattedData.filter(
            (doc) => doc.status === "Verified"
          ).length;
          const uploaded = formattedData.filter(
            (doc) => doc.status === "Uploaded"
          ).length;

          setStats({
            total: formattedData.length,
            verified,
            uploaded,
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch document data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleView = (document) => {
    setSelectedDocument(document);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDocument(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleVerifyClick = () => {
    setConfirmVerifyOpen(true);
  };

  const handleCloseConfirmVerify = () => {
    setConfirmVerifyOpen(false);
  };

  const handleVerifyDocument = async () => {
    if (!selectedDocument) return;

    console.log(selectedDocument, "ppppppppppp");

    try {
      setVerifying(true);
      // Call your verification API here
      const response = await axios.get(
        `${base_emp}/emp-handler/documents/verify/emp-doctumnet?userCode=${selectedDocument.empCode}`
      );
      console.log(response);
      // Update the local
      const updatedDocuments = documents.map((doc) => {
        if (doc.id === selectedDocument.id) {
          return { ...doc, status: "Verified" };
        }
        return doc;
      });

      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);
      setSelectedDocument({ ...selectedDocument, status: "Verified" });

      // Update stats
      setStats((prev) => ({
        ...prev,
        verified: prev.verified + 1,
        uploaded: prev.uploaded - 1,
      }));

      setVerifying(false);
      setConfirmVerifyOpen(false);
    } catch (err) {
      console.error("Error verifying document:", err);
      setError("Failed to verify document. Please try again.");
      setVerifying(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
        return {
          color: "success",
          backgroundColor: "#e6f4ea",
          icon: <VerifiedIcon fontSize="small" sx={{ mr: 0.5 }} />,
        };
      case "Uploaded":
        return {
          color: "warning",
          backgroundColor: "#fff8e1",
          icon: <CloudUploadIcon fontSize="small" sx={{ mr: 0.5 }} />,
        };
      default:
        return {
          color: "default",
          backgroundColor: "#f5f5f5",
          icon: null,
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Sort education keys in proper order
  const getSortedEducationKeys = (education) => {
    if (!education) return [];

    return Object.keys(education).sort((a, b) => {
      const orderA = educationOrder[a] || 999;
      const orderB = educationOrder[b] || 999;
      return orderA - orderB;
    });
  };

  // Helper function to render document details based on tab selection
  const renderDocumentDetails = () => {
    if (!selectedDocument) return null;

    const { fullData } = selectedDocument;

    switch (tabValue) {
      case 0: // Education
        return (
          <Box>
            {fullData.education &&
              getSortedEducationKeys(fullData.education).map((key) => {
                const isSchool = key === "10th School" || key === "12th School";
                return (
                  <Accordion key={key} sx={{ mb: 2 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-${key}-content`}
                      id={`panel-${key}-header`}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <SchoolIcon color="primary" sx={{ mr: 1.5 }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {key}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {/* Institution Name */}
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Institution
                          </Typography>
                          <Typography variant="body1">
                            {isSchool
                              ? fullData.education[key][2]
                              : fullData.education[key][1] || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Year (Passing Year for School, Start/End Date for Others) */}
                        {isSchool ? (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Passing Year
                            </Typography>
                            <Typography variant="body1">
                              {fullData.education[key][3] || "N/A"}
                            </Typography>
                          </Grid>
                        ) : (
                          <>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Start Date
                              </Typography>
                              <Typography variant="body1">
                                {fullData.education[key][2] || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                End Date
                              </Typography>
                              <Typography variant="body1">
                                {fullData.education[key][3] || "N/A"}
                              </Typography>
                            </Grid>
                          </>
                        )}

                        {/* Percentage/Grade */}
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Percentage/Grade
                          </Typography>
                          <Typography variant="body1">
                            {fullData.education[key][4] || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Board/University */}
                        {!isSchool && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Board/University
                            </Typography>
                            <Typography variant="body1">
                              {fullData.education[key][5] || "N/A"}
                            </Typography>
                          </Grid>
                        )}

                        {/* Document Button */}
                        <Grid item xs={12}>
                          {/* <Button
                  startIcon={<FileDownloadIcon />}
                  variant="outlined"
                  size="small"
                  color="primary"
                  href={isSchool ? fullData.education[key][5] : fullData.education[key][6]} // Correct document index
                  target="_blank"
                >
                  View Document
                </Button> */}

                          {/* <Button
  startIcon={<FileDownloadIcon />}
  variant="outlined"
  size="small"
  color="primary"
  onClick={() => handleOpenDocument(isSchool ? fullData.education[key][5] : ( key=="PHD"? fullData.education[key][7] : fullData.education[key][6]))}
>
  View Document{key}
</Button> */}
                          <Button
                            startIcon={<FileDownloadIcon />}
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => {
                              const isSchool =
                                key === "10th School" || key === "12th School";
                              const docUrl = isSchool
                                ? fullData.education[key]?.[5] || null
                                : key === "PhD"
                                ? fullData.education[key]?.[7] || null
                                : fullData.education[key]?.[6] || null;

                              if (docUrl) {
                                handleOpenDocument(docUrl);
                              } else {
                                console.warn(
                                  "Document URL is missing for:",
                                  key
                                );
                              }
                            }}
                          >
                            View Document {key}
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}

            {(!fullData.education ||
              Object.keys(fullData.education).length === 0) && (
              <Alert severity="info">No education information available</Alert>
            )}
          </Box>
        );
      case 1: // Experience
        return (
          <Box>
            {fullData.experience &&
              Object.keys(fullData.experience).map((key) => (
                <Accordion key={key} sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${key}-content`}
                    id={`panel-${key}-header`}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <WorkIcon color="primary" sx={{ mr: 1.5 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {key}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Position
                        </Typography>
                        <Typography variant="body1">
                          {fullData.experience[key][1] || "N/A"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Role
                        </Typography>
                        <Typography variant="body1">
                          {fullData.experience[key][4] || "N/A"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(fullData.experience[key][2])} -{" "}
                          {formatDate(fullData.experience[key][3])}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            {(!fullData.experience ||
              Object.keys(fullData.experience).length === 0) && (
              <Alert severity="info">No experience information available</Alert>
            )}
          </Box>
        );
      case 2: // Certification
        return (
          <Box>
            {fullData.certification &&
              Object.keys(fullData.certification).map((key) => (
                <Accordion key={key} sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${key}-content`}
                    id={`panel-${key}-header`}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BadgeIcon color="primary" sx={{ mr: 1.5 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {key}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {fullData.certification[key][1] || "N/A"}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(fullData.certification[key][2]) || "N/A"}
                        </Typography>
                      </Grid>

                      {fullData.certification[key][4] && (
                        <Grid item xs={12}>
                          <Button
                            startIcon={<FileDownloadIcon />}
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleOpenDocument(fullData.certification[key][4])
                            }
                          >
                            Certificate
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            {(!fullData.certification ||
              Object.keys(fullData.certification).length === 0) && (
              <Alert severity="info">
                No certification information available
              </Alert>
            )}
          </Box>
        );
      case 3: // Personal Info
        if (!fullData.basicInfo || !fullData.basicInfo.basicInfo) {
          return (
            <Alert severity="info">No personal information available</Alert>
          );
        }

        const basicInfo = fullData.basicInfo.basicInfo;

        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <PersonIcon sx={{ mr: 1 }} /> Personal Details
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Full Name"
                          secondary={`${basicInfo[0] || ""} ${
                            basicInfo[1] || ""
                          } ${basicInfo[2] || ""}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Phone"
                          secondary={basicInfo[3] || "N/A"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Email"
                          secondary={basicInfo[5] || "N/A"}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Date of Birth"
                          secondary={formatDate(basicInfo[4]) || "N/A"}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <DescriptionIcon sx={{ mr: 1 }} /> Address
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                      {basicInfo[6] || "Address not provided"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 4: // Identity Info
        return (
          <Box>
            {fullData.identityInfo &&
              Object.keys(fullData.identityInfo).map((key) => (
                <Accordion key={key} sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${key}-content`}
                    id={`panel-${key}-header`}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BadgeIcon color="primary" sx={{ mr: 1.5 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {key.replace(/([A-Z])/g, " $1").trim()}{" "}
                        {/* Format camelCase to spaces */}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Document Number
                        </Typography>
                        <Typography variant="body1">
                          {fullData.identityInfo[key][0] || "N/A"}
                        </Typography>
                      </Grid>

                      {fullData.identityInfo[key][1] && (
                        <Grid item xs={12}>
                          <Button
                            startIcon={<FileDownloadIcon />}
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleOpenDocument(fullData.identityInfo[key][1])
                            }
                          >
                            View Document
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            {(!fullData.identityInfo ||
              Object.keys(fullData.identityInfo).length === 0) && (
              <Alert severity="info">No identity documents available</Alert>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 6 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              Back to List
            </Button>
            <Typography variant="h4" component="h1" gutterBottom>
              Document Verification
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Track and manage document verification status
            </Typography>

            {/* Statistics Cards */}
            <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
              <Card sx={{ minWidth: 200, flex: 1 }}>
                <CardContent>
                  <Typography variant="h5" color="text.secondary">
                    Total Documents
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 2, fontWeight: 600 }}>
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ minWidth: 200, flex: 1 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <VerifiedIcon sx={{ mr: 1 }} /> Verified
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ mt: 2, fontWeight: 600, color: "success.main" }}
                  >
                    {stats.verified}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ minWidth: 200, flex: 1 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CloudUploadIcon sx={{ mr: 1 }} /> Uploaded
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ mt: 2, fontWeight: 600, color: "warning.main" }}
                  >
                    {stats.uploaded}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              mb: 4,
              position: "sticky",
              top: 16,
              zIndex: 1000,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by Email or Employee Code"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  borderRadius: 4,
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              }}
              sx={{
                maxWidth: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          ) : (
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
                <Typography variant="h6">Document List</Typography>
              </Box>
              <Divider />
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{ backgroundColor: "rgba(63, 81, 181, 0.05)" }}
                    >
                      <TableCell>S.No</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Emp Code</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Update</TableCell>
                      <TableCell align="center">View</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDocuments.map((document, index) => {
                      const statusStyle = getStatusColor(document.status);
                      // Generate initials for avatar
                      const initials = document.email
                        .split("@")[0]
                        .split(".")
                        .map((n) => n[0].toUpperCase())
                        .join("");

                      return (
                        <TableRow key={document.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  mr: 1.5,
                                  bgcolor:
                                    document.status === "Verified"
                                      ? "success.main"
                                      : "warning.main",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {initials}
                              </Avatar>
                              {document.email}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontFamily: "monospace", fontWeight: 500 }}
                            >
                              {document.empCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={statusStyle.icon}
                              label={document.status}
                              size="small"
                              sx={{
                                backgroundColor: statusStyle.backgroundColor,
                                fontWeight: 500,
                                pl: 0.5,
                              }}
                            />
                          </TableCell>
                          <TableCell>{document.lastUpdate}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="View document details">
                              <IconButton
                                color="primary"
                                onClick={() => handleView(document)}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(63, 81, 181, 0.08)",
                                  "&:hover": {
                                    bgcolor: "rgba(63, 81, 181, 0.15)",
                                  },
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Container>
      </Box>

      {/* Document Details Dialog */}
      {selectedDocument && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Avatar
                sx={{
                  bgcolor:
                    selectedDocument.status === "Verified"
                      ? "success.main"
                      : "warning.main",
                  mr: 2,
                }}
              >
                {selectedDocument.email.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{selectedDocument.email}</Typography>
                <Typography variant="body2">
                  {selectedDocument.empCode}
                </Typography>
              </Box>
              <Chip
                icon={getStatusColor(selectedDocument.status).icon}
                label={selectedDocument.status}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(selectedDocument.status)
                    .backgroundColor,
                  fontWeight: 500,
                  pl: 0.5,
                }}
              />
            </Box>
          </DialogTitle>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            {/* <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              <Tab 
                icon={<SchoolIcon />} 
                label="Education" 
                iconPosition="start" 
              />
              <Tab 
                icon={<WorkIcon />} 
                label="Experience" 
                iconPosition="start" 
              />
              <Tab 
                icon={<BadgeIcon />} 
                label="Certification" 
                iconPosition="start" 
              />
              <Tab 
                icon={<PersonIcon />} 
                label="Personal Info" 
                iconPosition="start" 
              />
            </Tabs> */}

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              <Tab icon={<SchoolIcon />} label="Education" value={0} />
              <Tab icon={<WorkIcon />} label="Experience" value={1} />
              <Tab icon={<BadgeIcon />} label="Certification" value={2} />
              <Tab icon={<PersonIcon />} label="Personal Info" value={3} />
              <Tab icon={<DescriptionIcon />} label="Identity Info" value={4} />
            </Tabs>
          </Box>

          <DialogContent dividers>{renderDocumentDetails()}</DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
            {selectedDocument.status === "Uploaded" && (
              <Button
                variant="contained"
                color="success"
                startIcon={<VerifiedIcon />}
                onClick={handleVerifyClick}
              >
                Mark as Verified
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* Verification Confirmation Dialog */}
      <Dialog
        open={confirmVerifyOpen}
        onClose={handleCloseConfirmVerify}
        aria-labelledby="verify-dialog-title"
        aria-describedby="verify-dialog-description"
      >
        <DialogTitle
          id="verify-dialog-title"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
          Verify Document
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="verify-dialog-description">
            Are you sure you want to mark this document as verified? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmVerify} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleVerifyDocument}
            color="success"
            variant="contained"
            disabled={verifying}
            startIcon={
              verifying ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CheckCircleIcon />
              )
            }
          >
            {verifying ? "Verifying..." : "Confirm Verification"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Document Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Document Preview
          <IconButton onClick={() => setPreviewOpen(false)} size="small">
            {/* <CloseIcon /> */}
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {previewFile?.type?.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          ) : previewFile?.type === "application/pdf" ? (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Preview not available
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default DocumentVerification;
