
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Breadcrumbs,
  Link,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Container,
  Stack,
  Paper,
  Chip,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Key as KeyIcon,
  ShieldOutlined as ShieldIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircleOutline,
  NavigateBefore,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ApiKeyDialog from './ApiKeyDialog';
import axios from 'axios';
import { base_candidate, base_hr } from '../../../http/services';


// Styled components
const StyledCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 6px 25px rgba(0,0,0,0.07)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 35px rgba(0,0,0,0.1)'
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: '16px',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: '24px',
  backgroundColor: status === 'ACTIVE' ? '#e6f7ed' : '#ffebee',
  color: status === 'ACTIVE' ? '#0c875e' : '#c62828',
  '& .MuiChip-label': {
    padding: '0 12px'
  }
}));

const CopyButton = styled(IconButton)(({ theme }) => ({
  color: '#3a0ca3',
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(58, 12, 163, 0.08)',
    transform: 'scale(1.1)'
  }
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  color: 'white',
  fontWeight: 600,
  padding: theme.spacing(1.5, 2),
  backgroundColor: '#3a0ca3'
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3a0ca3 30%, #4361ee 90%)',
  borderRadius: 8,
  border: 0,
  color: 'white',
  padding: '10px 24px',
  boxShadow: '0 3px 15px rgba(67, 97, 238, 0.3)',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #4361ee 30%, #3a0ca3 90%)',
    boxShadow: '0 4px 20px rgba(67, 97, 238, 0.5)',
    transform: 'translateY(-2px)'
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  padding: '8px 16px',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateX(-4px)'
  }
}));

const ShowApiKey = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [apiKeyData, setApiKeyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [openApiDialog, setOpenApiDialog] = useState(false);
  const [openDisableDialog, setOpenDisableDialog] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [copySuccess, setCopySuccess] = useState({
    url: false,
    apiKey: false
  });

  const organizationCode = localStorage.getItem("organizationCode");

  // Util: Create the combined text for clipboard
  const getCombinedCopyString = () => {
    if (!apiKeyData) return '';
    // const baseUrl = `http://localhost:3000/candidate-form/${organizationCode}/${jobId}`;
    const baseUrl = `https://www.hrhaat.com/candidate-form/${organizationCode}/${jobId}`;

    console.log(baseUrl);
    const apiKey = apiKeyData.apiKey;
    console.log(apiKey);
    return `${baseUrl}/${apiKey}`;
  };

  // Copy handler: Copy both URL and API Key
  const handleCopyBoth = () => {
    const combined = getCombinedCopyString();
    navigator.clipboard.writeText(combined);
    setCopySuccess({ url: true, apiKey: true });
    setTimeout(() => setCopySuccess({ url: false, apiKey: false }), 2000);
    showNotification('Base URL and API Key copied', 'success');
  };

  const fetchApiKeys = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/api-key/get-api-key?organizationCode=${organizationCode}&jobId=${jobId}`
      );
      setApiKeyData(response.data.result);
      setError(null);
      if (showRefreshing) {
        showNotification('Data refreshed successfully', 'success');
      }
    } catch (err) {
      setError('Failed to fetch API key data');
      showNotification('Failed to fetch API keys', 'error');
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
    // eslint-disable-next-line
  }, [jobId, organizationCode]);

  const handleDisableKey = async (status) => {

    try {
      await axios.put(`${base_hr}/hr-handler/api-key/disable-api-key?organizationCode=${organizationCode}&jobId=${jobId}&status=${status}`);
      showNotification('API key disabled successfully', 'success');
      setOpenDisableDialog(false);
      fetchApiKeys();
    } catch (err) {
      showNotification('Failed to disable API key', 'error');
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleRefresh = () => {
    fetchApiKeys(true);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={40} sx={{ color: '#3a0ca3' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="">
      
      <Box sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <NavButton
              startIcon={<NavigateBefore />}
              onClick={() => window.history.back()}
              variant="text"
              sx={{ color: '#3a0ca3', mb: 1 }}
            >
              Back to Dashboard
            </NavButton>
            
            <Breadcrumbs 
              separator="›" 
              sx={{ 
                '& .MuiBreadcrumbs-separator': { 
                  color: '#3a0ca3',
                  fontSize: '1.2rem',
                  mx: 1
                }
              }}
            >
              <Link 
                color="inherit" 
                onClick={() => navigate('/dashboard')} 
                sx={{ 
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': { color: '#3a0ca3' }
                }}
              >
                ITC Services
              </Link>
              <Typography color="#3a0ca3" fontWeight={600}>
                API Keys Management
              </Typography>
            </Breadcrumbs>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                borderRadius: 2,
                borderColor: '#3a0ca3',
                color: '#3a0ca3',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#3a0ca3',
                  bgcolor: 'rgba(58, 12, 163, 0.05)'
                }
              }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <GradientButton
              startIcon={<KeyIcon />}
              onClick={() => setOpenApiDialog(true)}
            >
              Generate New Key
            </GradientButton>
          </Stack>
        </Stack>

        <StyledCard sx={{ mb: 4 }}>
          <Box sx={{ 
            p: 1.5, 
            bgcolor: '#f5f3ff', 
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1.5 }}>
              <TimelineIcon sx={{ color: '#3a0ca3' }} />
              <Typography variant="h6" fontWeight={600} color="#3a0ca3">
                Base URL Configuration
              </Typography>
            </Stack>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Paper
              elevation={0}
              sx={{ 
                bgcolor: '#f8f9fa',
                p: 2.5,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 14,
                  background: 'linear-gradient(to bottom, #3a0ca3, #4361ee)'
                }} 
              />
              
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pl: 1 }}>
                <Typography 
                  sx={{ 
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    color: '#3a0ca3',
                    fontWeight: 500
                  }}
                >
                  {`https://www.hrhaat.com/candidate-form/${organizationCode}/${jobId}/${apiKeyData?.apiKey || ''}`}
                </Typography>
                <Box sx={{ position: 'relative' }}>
                  <Tooltip title={copySuccess.url ? 'Copied!' : 'Copy URL and API Key'} placement="top">
                    <IconButton 
                      onClick={handleCopyBoth}
                      sx={{
                        color: copySuccess.url ? '#0c875e' : '#3a0ca3',
                        '&:hover': { bgcolor: 'rgba(58, 12, 163, 0.1)' }
                      }}
                    >
                      {copySuccess.url ? <CheckCircleOutline /> : <CopyIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </StyledCard>

        <StyledCard>
          <Box sx={{ 
            p: 1.5, 
            bgcolor: '#f5f3ff', 
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1.5 }}>
              <KeyIcon sx={{ color: '#3a0ca3' }} />
              <Typography variant="h6" fontWeight={600} color="#3a0ca3">
                API Keys
              </Typography>
            </Stack>
          </Box>
          
          <Box sx={{ p: 3 , overflowX: 'auto'}}>
            <Alert 
              icon={<ShieldIcon fontSize="inherit" />}
              severity="warning"
              sx={{
                mb: 3,
                borderRadius: 2,
                borderLeft: '4px solid #f57c00',
                '& .MuiAlert-icon': {
                  color: '#f57c00'
                }
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                Security Warning
              </Typography>
              <Typography variant="body2">
                Treat your API key like a password. Never share it publicly or commit it to source control.
              </Typography>
            </Alert>

            <TableContainer sx={{ 
              overflowX: 'auto',
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              // overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)'
            }}>
              <Table >
                <TableHead>
                  <TableRow>
                    {['Key ID', 'API Key', 'Created At', 'Modified At', 'Status', 'Actions'].map((header) => (
                      <TableHeaderCell key={header}>
                        {header}
                      </TableHeaderCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log( "wefewfwefewfew")}
                  {apiKeyData ? (
                    <TableRow 
                      sx={{ 
                        '&:hover': { bgcolor: '#f5f3ff' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{apiKeyData?.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ 
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            maxWidth: '240px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {apiKeyData?.apiKey}
                          </Typography>
                          <Box sx={{ position: 'relative' }}>
                            <Tooltip title={copySuccess.apiKey ? 'Copied!' : 'Copy API Key and URL'}>
                              <CopyButton
                                size="small"
                                onClick={handleCopyBoth}
                              >
                                {copySuccess.apiKey ? <CheckCircleOutline fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
                              </CopyButton>
                            </Tooltip>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{formatDate(apiKeyData?.createdAt)}</TableCell>
                      <TableCell>{formatDate(apiKeyData?.modifyAt)}</TableCell>
                      <TableCell>
                        <StatusChip 
                          label={apiKeyData?.status || 'ACTIVE'}
                          status={apiKeyData?.status || 'ACTIVE'}
                        />
                      </TableCell>
                      <TableCell>
                        {apiKeyData?.status !== 'DISABLED' ? (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              setSelectedKeyId(apiKeyData?.id);
                              setOpenDisableDialog(true);
                            }}
                            startIcon={<ErrorIcon />}
                            sx={{
                              borderRadius: 8,
                              textTransform: 'none',
                              borderColor: '#ff3d47',
                              color: '#ff3d47',
                              '&:hover': {
                                borderColor: '#ff3d47',
                                backgroundColor: 'rgba(255, 61, 71, 0.08)'
                              }
                            }}
                          >
                            Disable
                          </Button>
                        )
                      :(
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              setSelectedKeyId(apiKeyData?.id);
                              setOpenDisableDialog(true);
                            }}
                            startIcon={<ErrorIcon />}
                            sx={{
                              borderRadius: 8,
                              textTransform: 'none',
                              borderColor: '#217131ff',
                              color: '#217131ff',
                              '&:hover': {
                                borderColor: '#3dff98ff',
                                backgroundColor: 'rgba(255, 61, 71, 0.08)'
                              }
                            }}
                          >
                            Enable
                          </Button>
                      )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box sx={{ 
                          py: 4,
                          textAlign: 'center'
                        }}>
                          <Typography color="text.secondary">
                            No API keys found. Generate a new key to get started.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </StyledCard>

        <ApiKeyDialog
          open={openApiDialog}
          onClose={() => setOpenApiDialog(false)}
          jobId={jobId}
          onSuccess={() => {
            fetchApiKeys();
            showNotification('API key generated successfully', 'success');
          }}
        />

        <Dialog
          open={openDisableDialog}
          onClose={() => setOpenDisableDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderBottom: '1px solid #f0f0f7'
          }}>
            <WarningIcon color="error" />
            <Typography variant="h6" fontWeight={600}>Confirm Key Disable</Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {apiKeyData?.status === 'ACTIVE' ? (
              
            <DialogContentText sx={{ color: '#495057' }}>
              Are you sure you want to disable this API key? This action cannot be undone, and you'll need to generate a new key if needed.
            </DialogContentText>
            ):(
              
            <DialogContentText sx={{ color: '#495057' }}>
              Are you sure you want to Enable this API key? This action cannot be undone.
            </DialogContentText>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1.5, gap: 1 }}>
            <Button
              onClick={() => setOpenDisableDialog(false)}
              variant="outlined"
              sx={{
                borderRadius: 8,
                textTransform: 'none',
                borderColor: '#3a0ca3',
                color: '#3a0ca3',
                px: 3
              }}
            >
              Cancel
            </Button>

            {apiKeyData?.status === 'ACTIVE' ? (
              <Button

              onClick={()=>{handleDisableKey(apiKeyData?.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' )}}
              variant="contained"
              color="error"
              sx={{
                borderRadius: 8,
                textTransform: 'none',
                px: 3,
                bgcolor: '#ff3d47',
                '&:hover': {
                  bgcolor: '#e5343c'
                }
              }}
            >
              Disable Key
            </Button>
            ) : (
              <Button

              onClick={()=>{handleDisableKey(apiKeyData?.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' )}}
              variant="contained"
              color="error"
              sx={{
                borderRadius: 8,
                textTransform: 'none',
                px: 3,
                bgcolor: '#217131ff',
                '&:hover': {
                  bgcolor: '#013702ff'
                }
              }}
            >
              Enable Key
            </Button>
            )
          }
          </DialogActions>
        </Dialog>

        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ShowApiKey;
