import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
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
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import axios from 'axios';
import { base_hr } from '../../../../http/services';
import ViewIncreamentLetter from './ViewIncreamentLetter';

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
    backgroundColor:" #4372C8",
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

const ActionButton = styled(Button)(({ theme, color }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  padding: '6px 16px',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
  },
  '& .MuiButton-startIcon': {
    marginRight: 6,
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

const AllIncreamentLetterEmpList = () => {
  const theme = useTheme();
  const location = useLocation();

  console.log(location.state.letterData,"kkkkkkkkkkkkkkkkkkkkkkkk")
  const navigate = useNavigate();
  const [empCode, setEmpCode] = useState('');
  const [incrementLetters, setIncrementLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    let code = '';
    if (location.state && location.state.letterData && location.state.letterData.empCode) {
      code = location.state.letterData.empCode;
    } else if (location.state && location.state.empCode) {
      code = location.state.empCode;
    }
    setEmpCode(code);
    if (code) {
      fetchIncrementLetters(code);
    } else {
      setLoading(false);
      setError('No employee code provided.');
    }
  }, [location.state]);

  const fetchIncrementLetters = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${base_hr}/hr-handler/increment/get-all-increment-letter-of-emp?empCode=${code}`);
      if (response.data && response.data.result) {
        setIncrementLetters(response.data.result);
      } else {
        setIncrementLetters([]);
      }
    } catch (err) {
      setError('Failed to fetch increment letters.');
      console.error('Error fetching increment letters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (incrementId, date) => {
    try {
      const response = await axios.get(
        `${base_hr}/hr-handler/increment/get-increment-pdf-data-for-download?incrementId=${incrementId}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Increment_Letter_${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download increment letter.');
    }
  };

  const handleViewLetter = (letter) => {
    setSelectedLetter(letter);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedLetter(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BackButton
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back to Employee List
        </BackButton>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Increment Letter History
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and download increment letters for employee code: {empCode}
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : error ? (
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
      ) : (
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
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Generated Date</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {incrementLetters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
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
                ) : (
                  incrementLetters.map((letter) => (
                    <StyledTableRow key={letter.incrementId}>
                      <StyledTableCell sx={{ fontWeight: 500 }}>
                        {location.state.letterData.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        {location.state.letterData.officialEmail}
                      </StyledTableCell>
                      <StyledTableCell>
                        {formatDate(letter.generateDate)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                          <ActionButton
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewLetter(letter)}
                          >
                            View
                          </ActionButton>
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

export default AllIncreamentLetterEmpList;