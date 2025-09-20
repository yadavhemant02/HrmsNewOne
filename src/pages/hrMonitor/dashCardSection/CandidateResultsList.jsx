import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Avatar,
  Stack,
  IconButton,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import {
  Email,
  LocationOn,
  Work,
  CalendarToday,
  Visibility,
  ModeEdit
} from '@mui/icons-material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import axios from 'axios';
import { base_hr } from '../../../http/services';
import BackButton from '../../../constent/BackButton';

// Styled Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#1a237e',
  color: 'white',
  '&:hover': {
    backgroundColor: '#0d47a1',
  },
}));

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.04)',
  },
  transition: 'background-color 0.2s',
});

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: 
    status === 'selected' ? 'rgba(76, 175, 80, 0.1)' :
    status === 'rejected' ? 'rgba(244, 67, 54, 0.1)' :
    'rgba(255, 152, 0, 0.1)',
  color: 
    status === 'selected' ? '#2e7d32' :
    status === 'rejected' ? '#d32f2f' :
    '#ed6c02',
  fontWeight: 'bold',
}));

const CandidateResultsTable = () => {
  // Sample data structure based on your API response
  // const results = [
  //   {
  //     id: 1,
  //     candidateId: "CGLOVE",
  //     candidateName: "your Love",
  //     candidateEmail: "yadavhemant9715@gmail.com",
  //     candidateLocation: "Lucknow",
  //     position: null,
  //     result: null,
  //     package: null,
  //     dateOfJoining: null,
  //     flag: "PANDING",
  //     createdAt: "2025-02-11T17:02:17.321258",
  //     modifyAt: "2025-02-11T17:02:17.134469"
  //   }
  //   // Add more results as needed
  // ];

  const [results, setResults] = useState([]);
  const [formDialogOpen, setFileDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [formFields, setFormFields] = useState({
    possition: '',
    result: '',
    packege: '',
    dateOfJoining: ''
  });

  

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${base_hr}/hr-handler/result/show-all/panding-result`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);


  const onClose = () => {
    setFileDialogOpen(false);
  };

  const handleOpenDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setFormFields({
      possition: candidate.possition || '',
      result: candidate.result || '',
      packege: candidate.packege || '',
      dateOfJoining: candidate.dateOfJoining || ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCandidate(null);
  };

  const handleFieldChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!selectedCandidate) return;
    try {
      // Adjust the endpoint and payload as per your backend API
      await axios.post(
        `${base_hr}/hr-handler/result/update/${selectedCandidate.id}`,
        {
          ...selectedCandidate,
          ...formFields
        }
      );
      // Update local state after successful API call
      setResults(results.map(r =>
        r.id === selectedCandidate.id
          ? { ...r, ...formFields }
          : r
      ));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating candidate:', error);
      // Optionally show error to user
    }
  };

  const getStatusColor = (flag) => {
    switch (flag?.toLowerCase()) {
      case 'panding':
        return 'warning';
      case 'selected':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <BackButton/>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#1a237e', fontWeight: 600 }}>
        Candidate Results
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Candidate</StyledTableCell>
              <StyledTableCell>Contact Info</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Position</StyledTableCell>
              <StyledTableCell>Created Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <StyledTableRow key={result.id}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40
                      }}
                    >
                      {result.candidateName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {result.candidateName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {result.candidateId}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">{result.candidateEmail}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{result.candidateLocation}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Work fontSize="small" color="action" />
                    <Typography variant="body2">{result.position || 'Not specified'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2">{formatDate(result.createdAt)}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip
                    label={result.flag || 'N/A'}
                    status={result.flag?.toLowerCase()}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <ModeEditIcon
                    color="primary"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(26, 35, 126, 0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(26, 35, 126, 0.08)',
                      }
                    }}
                    onClick={() => handleOpenDialog(result)}
                  >
                    <Visibility fontSize="small" />
                  </ModeEditIcon>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for editing fields */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Candidate Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Position"
              name="possition"
              value={formFields.possition}
              onChange={handleFieldChange}
              fullWidth
            />
            <TextField
              label="Result"
              name="result"
              value={formFields.result}
              onChange={handleFieldChange}
              fullWidth
            />
            <TextField
              label="Package"
              name="packege"
              value={formFields.packege}
              onChange={handleFieldChange}
              fullWidth
            />
            <TextField
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={formFields.dateOfJoining}
              onChange={handleFieldChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
          {/* Show other fields as read-only */}
          {selectedCandidate && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Other Details:</Typography>
              <Typography>ID: {selectedCandidate.candidateId}</Typography>
              <Typography>Name: {selectedCandidate.candidateName}</Typography>
              <Typography>Email: {selectedCandidate.candidateEmail}</Typography>
              <Typography>Location: {selectedCandidate.candidateLocation}</Typography>
              {/* Add more as needed */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CandidateResultsTable;