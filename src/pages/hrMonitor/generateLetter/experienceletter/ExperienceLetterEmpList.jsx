import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  TablePagination,
  useTheme,
  alpha,
  styled,
  InputAdornment,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import { base_hr, base_identity } from '../../../../http/services';
import ViewExperienceLetterDialog from './ViewExperienceLetterDialog';

// ================================
//        CONSTANTS & CONFIG
// ================================

const PAGINATION_CONFIG = {
  rowsPerPageOptions: [5, 10, 25, 50],
  defaultRowsPerPage: 10,
};

const EMPLOYEE_STATUS = {
  EXIST: 'EXIST',
};

const TABLE_COLUMNS = [
  { id: 'empCode', label: 'Employee Code', minWidth: 120 },
  { id: 'name', label: 'Full Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'position', label: 'Position', minWidth: 150 },
  { id: 'actions', label: 'Actions', minWidth: 180, align: 'center' },
];

const SEARCH_FIELDS = ['name', 'officialEmail', 'personalEmail', 'empCode', 'position'];

// ================================
//        STYLED COMPONENTS
// ================================

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 'calc(100vh - 280px)',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  '&::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    borderRadius: 4,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({

  '& .MuiTableCell-head': {
    color: 'white',
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
    transition: 'background-color 0.2s ease-in-out',
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

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    height: 42,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color']),
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px 10px 8px',
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  borderRadius: 12,
  padding: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(2),
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
  minHeight: 300,
}));

const GenerateNewButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  textTransform: 'none',
  fontWeight: 600,
  color: 'white',
  padding: '10px 20px',
  minWidth: 220,
  '&:hover': {
    background: 'linear-gradient(45deg, #00B0FF 30%, #1976D2 90%)',
    boxShadow: '0 6px 14px rgba(33, 150, 243, 0.3)',
    transform: 'translateY(-1px)',
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  margin: '0 4px',
  transition: 'all 0.2s ease-in-out',
  borderRadius: 8,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    transform: 'scale(1.05)',
  },
  '&:disabled': {
    backgroundColor: alpha(theme.palette.action.disabled, 0.05),
    color: theme.palette.action.disabled,
  },
}));

// ================================
//        SERVICE LAYER
// ================================

class ExperienceLetterService {
  static getOrganizationCode() {
    return localStorage.getItem('organizationCode');
  }

  static async getAllGeneratedExperienceCodes() {
    const orgCode = this.getOrganizationCode();
    if (!orgCode) throw new Error('Organization code not found');

    const response = await axios.get(
      `${base_hr}/hr-handler/api/experience-letter/get-all-empCode-generated-experience-leter?organizationCode=${orgCode}`
    );
    return response.data;
  }

  static async getAllEmployeeDetails() {
    const orgCode = this.getOrganizationCode();
    if (!orgCode) throw new Error('Organization code not found');

    const response = await axios.get(
      `${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${orgCode}`
    );
    return response.data;
  }

  static async downloadExperienceLetter(empCode) {
    const response = await axios.get(
      `${base_hr}/hr-handler/api/experience-letter/download-experience-leter-pdf?empCode=${empCode}`,
      {
        responseType: 'blob',
        headers: { accept: '*/*' }
      }
    );
    return response;
  }
}

// ================================
//        CUSTOM HOOKS
// ================================

const useExperienceLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLetters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [generatedCodes, employeeData] = await Promise.all([
        ExperienceLetterService.getAllGeneratedExperienceCodes(),
        ExperienceLetterService.getAllEmployeeDetails()
      ]);

      const existingEmployees = (Array.isArray(employeeData) ? employeeData : [])
        .filter(emp => emp.current === EMPLOYEE_STATUS.EXIST);
      
      const generatedLetters = existingEmployees.filter(emp => 
        generatedCodes.includes(emp.empCode)
      );

      setLetters(generatedLetters);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to fetch experience letters. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching experience letters:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLetters = useCallback(() => {
    fetchLetters();
  }, [fetchLetters]);

  return { letters, loading, error, refreshLetters };
};

const useTablePagination = (initialRowsPerPage = PAGINATION_CONFIG.defaultRowsPerPage) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const resetPagination = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    resetPagination,
  };
};

const useSearch = (onSearchChange) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    onSearchChange?.('');
  }, [onSearchChange]);

  return {
    searchTerm,
    handleSearchChange,
    clearSearch,
  };
};

const useNotification = () => {
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const showNotification = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const hideNotification = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return { snackbar, showNotification, hideNotification };
};

const useViewDialog = () => {
  const [dialogState, setDialogState] = useState({
    open: false,
    selectedLetter: null,
  });

  const openDialog = useCallback((letter) => {
    setDialogState({ open: true, selectedLetter: letter });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState({ open: false, selectedLetter: null });
  }, []);

  return {
    dialogState,
    openDialog,
    closeDialog,
  };
};

// ================================
//        UTILITY FUNCTIONS
// ================================

const filterLettersBySearch = (letters, searchTerm) => {
  if (!searchTerm.trim()) return letters;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return letters.filter(letter =>
    SEARCH_FIELDS.some(field => 
      letter[field]?.toLowerCase().includes(lowerSearchTerm)
    )
  );
};

const paginateData = (data, page, rowsPerPage) => {
  const startIndex = page * rowsPerPage;
  return data.slice(startIndex, startIndex + rowsPerPage);
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

const extractFilename = (empCode) => {
  return `experience_letter_${empCode}.pdf`;
};

// ================================
//        SUB COMPONENTS
// ================================

const TableHeader = React.memo(() => (
  <StyledTableHead>
    <TableRow>
      {TABLE_COLUMNS.map((column) => (
        <StyledTableCell 
          key={column.id} 
          align={column.align || 'left'}
          style={{ minWidth: column.minWidth }}
        >
          {column.label}
        </StyledTableCell>
      ))}
    </TableRow>
  </StyledTableHead>
));

const EmptyState = React.memo(({ searchTerm, onClearSearch }) => (
  <TableRow>
    <TableCell colSpan={TABLE_COLUMNS.length}>
      <EmptyStateContainer>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Experience Letters Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {searchTerm 
            ? "No matching experience letters found. Try adjusting your search criteria." 
            : "There are currently no generated experience letters in the system."}
        </Typography>
        {searchTerm && (
          <Button 
            sx={{ mt: 2 }}
            size="small" 
            onClick={onClearSearch}
          >
            Clear Search
          </Button>
        )}
      </EmptyStateContainer>
    </TableCell>
  </TableRow>
));

const LetterRow = React.memo(({ 
  letter, 
  onView, 
  onDownload, 
  onRegenerate, 
  downloadLoading 
}) => (
  <StyledTableRow>
    <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
      {letter.empCode || 'N/A'}
    </StyledTableCell>
    <StyledTableCell sx={{ fontWeight: 500 }}>
      {letter.name || 'N/A'}
    </StyledTableCell>
    <StyledTableCell>
      {letter.officialEmail || letter.personalEmail || 'N/A'}
    </StyledTableCell>
    <StyledTableCell>
      {letter.position || 'N/A'}
    </StyledTableCell>
    <StyledTableCell align="center">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip title="View Experience Letter">
          <ActionButton 
            size="small" 
            color="primary"
            onClick={() => onView(letter)}
            aria-label="View experience letter"
          >
            <VisibilityIcon fontSize="small" />
          </ActionButton>
        </Tooltip>
        <Tooltip title="Download Experience Letter">
          <ActionButton 
            size="small" 
            color="success"
            onClick={() => onDownload(letter)}
            disabled={downloadLoading}
            aria-label="Download experience letter"
          >
            <DownloadIcon fontSize="small" />
          </ActionButton>
        </Tooltip>
        <Tooltip title="Regenerate Experience Letter">
          <ActionButton 
            size="small" 
            color="secondary"
            onClick={() => onRegenerate(letter)}
            aria-label="Regenerate experience letter"
          >
            <RefreshIcon fontSize="small" />
          </ActionButton>
        </Tooltip>
      </Box>
    </StyledTableCell>
  </StyledTableRow>
));

const LoadingSpinner = React.memo(() => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="400px"
  >
    <CircularProgress sx={{ color: 'primary.main' }} />
  </Box>
));

const ErrorAlert = React.memo(({ error, onRetry }) => (
  <Alert 
    severity="error" 
    sx={{ 
      borderRadius: 2, 
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginTop: 2
    }}
    action={
      <Button 
        color="inherit" 
        size="small" 
        onClick={onRetry}
      >
        Try Again
      </Button>
    }
  >
    {error}
  </Alert>
));

// ================================
//        MAIN COMPONENT
// ================================

const ExperienceLetterEmpList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const { letters, loading, error, refreshLetters } = useExperienceLetters();
  const { 
    page, 
    rowsPerPage, 
    handlePageChange, 
    handleRowsPerPageChange, 
    resetPagination 
  } = useTablePagination();
  
  const { searchTerm, handleSearchChange, clearSearch } = useSearch(resetPagination);
  const { snackbar, showNotification, hideNotification } = useNotification();
  const { dialogState, openDialog, closeDialog } = useViewDialog();
  
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    refreshLetters();
  }, [refreshLetters]);

  const filteredLetters = useMemo(() => 
    filterLettersBySearch(letters, searchTerm), 
    [letters, searchTerm]
  );

  const paginatedLetters = useMemo(() => 
    paginateData(filteredLetters, page, rowsPerPage), 
    [filteredLetters, page, rowsPerPage]
  );

  const handleViewLetter = useCallback((letter) => {
    openDialog(letter);
  }, [openDialog]);

  const handleDownloadLetter = useCallback(async (letter) => {
    try {
      setDownloadLoading(true);
      
      const response = await ExperienceLetterService.downloadExperienceLetter(letter.empCode);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      const filename = extractFilename(letter.empCode);
      downloadFile(blob, filename);
      
      showNotification('Experience letter downloaded successfully');
      
    } catch (error) {
      console.error('Error downloading experience letter:', error);
      showNotification('Failed to download experience letter', 'error');
    } finally {
      setDownloadLoading(false);
    }
  }, [showNotification]);

  const handleRegenerateLetter = useCallback((letter) => {
    const employeeData = {
      employeeId: letter.empCode,
      employeeName: letter.name,
      designation: letter.position,
      department: letter.function,
      officialEmail: letter.officialEmail,
      personalEmail: letter.personalEmail,
      primaryPhone: letter.primaryPhone,
      alternatePhone: letter.alternatePhone,
      joinDate: letter.dateOfJoin,
      offerDate: letter.offerDate,
      dateOfBirth: letter.dateOfBirth,
      currentCTC: letter.ctc,
      status: letter.status,
      current: letter.current,
      organizationCode: letter.organizationCode,
      extraData: letter.extraData || {}
    };

    navigate('/dashboard-hr/experience-letter', { 
      state: { 
        employeeData,
        employeeEmail: letter.officialEmail || letter.personalEmail,
        isRegenerate: true
      } 
    });
  }, [navigate]);

  const handleGenerateNew = useCallback(async () => {
    try {
      const employeeResponse = await axios.get(
        `${base_identity}/identity-handler/details/get-all-emp-details?organizationCode=${localStorage.getItem('organizationCode')}`
      );
      
      if (employeeResponse.data && Array.isArray(employeeResponse.data)) {
        const existingEmployees = employeeResponse.data.filter(emp => emp.current === 'EXIST');
        
        if (existingEmployees.length > 0) {
          const employeeData = existingEmployees[0];
          
          navigate('/dashboard-hr/experience-letter', { 
            state: { 
              employeeData,
              employeeEmail: employeeData.officialEmail || employeeData.personalEmail,
              isNewGeneration: true
            } 
          });
        } else {
          showNotification('No active employees found', 'warning');
        }
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      showNotification('Error fetching employee details: ' + (error.response?.data?.message || error.message), 'error');
    }
  }, [navigate, showNotification]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={refreshLetters} />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <HeaderContainer>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
            Generated Experience Letters
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            View and manage all generated experience letters
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchTextField
            placeholder="Search experience letters..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={refreshLetters}
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                }
              }}
              aria-label="Refresh data"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </HeaderContainer>

      <ControlsContainer>
        <Typography variant="h6" color="text.secondary">
          Total Letters: {filteredLetters.length}
          {searchTerm && ` (filtered from ${letters.length})`}
        </Typography>

        <GenerateNewButton
          onClick={handleGenerateNew}
          startIcon={<TrendingUpIcon />}
        >
          Generate New Experience Letter
        </GenerateNewButton>
      </ControlsContainer>

      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden', 
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          mb: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <StyledTableContainer>
          <Table stickyHeader aria-label="experience letters table">
            <TableHeader />
            <TableBody>
              {paginatedLetters.length > 0 ? (
                paginatedLetters.map((letter) => (
                  <LetterRow
                    key={letter.id || letter.empCode}
                    letter={letter}
                    onView={handleViewLetter}
                    onDownload={handleDownloadLetter}
                    onRegenerate={handleRegenerateLetter}
                    downloadLoading={downloadLoading}
                  />
                ))
              ) : (
                <EmptyState 
                  searchTerm={searchTerm} 
                  onClearSearch={clearSearch} 
                />
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        
        <TablePagination
          rowsPerPageOptions={PAGINATION_CONFIG.rowsPerPageOptions}
          component="div"
          count={filteredLetters.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Letters per page:"
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              color: 'text.secondary',
            },
            '.MuiTablePagination-select': {
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            }
          }}
        />
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ViewExperienceLetterDialog
        open={dialogState.open}
        onClose={closeDialog}
        empCode={dialogState.selectedLetter?.empCode}
      />
    </Container>
  );
};

export default ExperienceLetterEmpList;