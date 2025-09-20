import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Chip,
  TablePagination,
  useTheme,
  alpha,
  styled,
  Divider,
  InputAdornment,
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CircleIcon from '@mui/icons-material/Circle';

import { base_identity } from '../../http/services';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 'calc(100vh - 230px)',
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
    backgroundColor: "#4372C8",
    color: "white",
    fontWeight: 600,
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    textAlign: 'center',
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
  textAlign: 'center',
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 500,
  borderRadius: 8,
  fontSize: '0.75rem',
  letterSpacing: '0.3px',
  padding: '0 8px',
  ...(color === 'primary' && {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
  }),
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
    padding: '10px 14px',
    paddingLeft: '8px',
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

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  borderRadius: 12,
  fontSize: '0.75rem',
  letterSpacing: '0.3px',
  padding: '0 8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  ...(status === 'ON' && {
    backgroundColor: alpha(theme.palette.success.main, 0.15),
    color: theme.palette.success.dark,
    border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
  }),
  ...(status === 'OFF' && {
    backgroundColor: alpha(theme.palette.error.main, 0.15),
    color: theme.palette.error.dark,
    border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
  }),
}));

const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 0),
}));

const Monitor = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_identity}/identity-handler/auth/get-all-member/of-orgnazation?organizationCode=${localStorage.getItem('organizationCode')}`); 
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobileNumber?.includes(searchTerm) ||
    user.empCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort: COMPANY role on top
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aIsCompany = (a.role || '').toUpperCase() === 'COMPANY' ? 1 : 0;
    const bIsCompany = (b.role || '').toUpperCase() === 'COMPANY' ? 1 : 0;
    return bIsCompany - aIsCompany;
  });

  // Apply pagination
  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginTop: 2
        }}
        action={
          <Button color="inherit" size="small" onClick={fetchUsers}>
            Try Again
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <HeaderContainer>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
            All Employees
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            View all employee information
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchTextField
            placeholder="Search employees..."
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
        </Box>
      </HeaderContainer>

      <Divider sx={{ mb: 3, opacity: 0.6 }} />

      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden', 
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}` 
        }}
      >
        <StyledTableContainer>
          <Table stickyHeader aria-label="employees table">
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Emp Code</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Mobile Number</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <StyledTableRow key={user.id}>
                    <StyledTableCell>
                      {page * rowsPerPage + index + 1}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {user.empCode}
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontWeight: 500 }}>{user.name}</StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>{user.mobileNumber}</StyledTableCell>
                    <StyledTableCell>
                      <StyledChip 
                        label={user.role} 
                        color="primary" 
                        size="small"
                        variant="outlined"
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <StatusContainer>
                        <StatusChip
                          label={user.status === 'ON' ? 'Active' : 'Inactive'}
                          status={user.status}
                          icon={user.status === 'ON' ? 
                            <CircleIcon fontSize="small" sx={{ color: 'success.main', fontSize: '0.75rem' }} /> : 
                            <CircleIcon fontSize="small" sx={{ color: 'error.main', fontSize: '0.75rem' }} />
                          }
                        />
                      </StatusContainer>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyStateContainer>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No employees found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm 
                          ? "Try adjusting your search terms or clear the search" 
                          : "No employees available"}
                      </Typography>
                      {searchTerm && (
                        <Button 
                          sx={{ mt: 2 }}
                          size="small" 
                          onClick={() => setSearchTerm('')}
                        >
                          Clear Search
                        </Button>
                      )}
                    </EmptyStateContainer>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              color: theme.palette.text.secondary,
            },
            '.MuiTablePagination-select': {
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default Monitor;
