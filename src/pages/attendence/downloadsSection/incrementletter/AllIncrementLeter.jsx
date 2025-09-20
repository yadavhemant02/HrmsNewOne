import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
  PictureAsPdf as PictureAsPdfIcon
} from '@mui/icons-material';
import axios from 'axios';
import { base_hr } from '../../../../http/services';
import ViewIncreamentLetter from '../../../hrMonitor/generateLetter/increamentletter/ViewIncreamentLetter';

// Constants
const API_ENDPOINTS = {
  INCREMENT_LETTERS: (empCode) => 
    `${base_hr}/hr-handler/increment/get-all-increment-letter-of-emp?empCode=${empCode}`,
  DOWNLOAD_PDF: (incrementId) => 
    `${base_hr}/hr-handler/increment/get-increment-pdf-data-for-download?incrementId=${incrementId}`
};

const STORAGE_KEY = 'empCode';

// Custom hook for localStorage operations
const useLocalStorage = (key) => {
  return useMemo(() => {
    try {
      const item = localStorage.getItem(key);
      return item || null;
    } catch (error) {
      console.error(`Error reading localStorage key ${key}:`, error);
      return null;
    }
  }, [key]);
};

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    borderRadius: '4px',
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    color: "white",
    fontWeight: 600,
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    backgroundColor: "#4372C8",
    zIndex: 10,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transition: 'background-color 0.2s ease',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: theme.spacing(1.5, 2),
  borderColor: alpha(theme.palette.divider, 0.5),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  padding: '6px 16px',
  minWidth: 'auto',
  '& .MuiButton-startIcon': {
    marginRight: 6,
  },
}));

const ViewButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
  },
}));

const DownloadButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  color: theme.palette.success.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.success.main, 0.2),
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: 12,
  minHeight: 200,
}));

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const formatDateForFilename = (dateString) => {
  if (!dateString) return 'unknown_date';
  
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date for filename:', error);
    return 'unknown_date';
  }
};

const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Main component
const AllIncrementLetter = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Get empCode from localStorage
  const empCode = useLocalStorage(STORAGE_KEY);
  
  // State management
  const [incrementLetters, setIncrementLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Fetch increment letters
  const fetchIncrementLetters = useCallback(async (code) => {
    if (!code) {
      setError('Employee code not found. Please select an employee first.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(API_ENDPOINTS.INCREMENT_LETTERS(code));
      
      if (response.data?.result) {
        setIncrementLetters(response.data.result);
      } else {
        setIncrementLetters([]);
      }
    } catch (err) {
      console.error('Error fetching increment letters:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch increment letters. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize component
  useEffect(() => {
    if (empCode) {
      fetchIncrementLetters(empCode);
    } else {
      setError('Employee code not found. Please select an employee first.');
      setLoading(false);
    }
  }, [empCode, fetchIncrementLetters]);

  // Handle download
  const handleDownload = useCallback(async (incrementId, date) => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.DOWNLOAD_PDF(incrementId),
        { responseType: 'blob' }
      );
      
      const filename = `Increment_Letter_${formatDateForFilename(date)}.pdf`;
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      downloadFile(blob, filename);
    } catch (err) {
      console.error('Error downloading increment letter:', err);
      const errorMessage = err.response?.data?.message || 'Failed to download increment letter. Please try again.';
      alert(errorMessage);
    }
  }, []);

  // Handle view letter
  const handleViewLetter = useCallback((letter) => {
    setSelectedLetter(letter);
    setViewDialogOpen(true);
  }, []);

  // Handle close view dialog
  const handleCloseViewDialog = useCallback(() => {
    setViewDialogOpen(false);
    setSelectedLetter(null);
  }, []);

  // Handle back navigation
  const handleBackNavigation = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Memoized empty state
  const emptyState = useMemo(() => (
    <TableRow>
      <TableCell colSpan={3}>
        <EmptyStateContainer>
          <PictureAsPdfIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Increment Letters Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are no increment letters available for this employee.
          </Typography>
        </EmptyStateContainer>
      </TableCell>
    </TableRow>
  ), []);

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BackButton
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackNavigation}
        >
          Back to Employee List
        </BackButton>
      </Box>

      {/* Page title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Increment Letter History
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Employee Code: {empCode || 'N/A'}
        </Typography>
      </Box>

      {/* Error state */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            mb: 3
          }}
        >
          {error}
        </Alert>
      )}

      {/* Table */}
      {!error && (
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <StyledTableContainer>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <StyledTableCell>Generated Date</StyledTableCell>
                  <StyledTableCell>Employee Code</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {incrementLetters.length === 0 ? (
                  emptyState
                ) : (
                  incrementLetters.map((letter) => (
                    <StyledTableRow key={letter.incrementId}>
                      <StyledTableCell sx={{ fontWeight: 500 }}>
                        {formatDate(letter.generateDate)}
                      </StyledTableCell>
                      <StyledTableCell>
                        {empCode}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                          <ViewButton
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewLetter(letter)}
                          >
                            View
                          </ViewButton>
                          <DownloadButton
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownload(letter.incrementId, letter.generateDate)}
                          >
                            Download
                          </DownloadButton>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>
      )}

      {/* View Dialog */}
      {viewDialogOpen && selectedLetter && (
        <ViewIncreamentLetter
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          incrementId={selectedLetter.incrementId}
        />
      )}
    </Box>
  );
};

export default AllIncrementLetter;