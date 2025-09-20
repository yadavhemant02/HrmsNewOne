import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { base_emp } from "../../http/services";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShapesLoader from "../../constent/ShapesLoader";
import { ArrowBack } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(() => ({
  backgroundColor: "#f0f4f8",
  fontWeight: "bold",
  textAlign: "center",
  padding: "16px",
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
  "&:hover": {
    backgroundColor: "#e3f2fd",
  },
  "& .MuiTableCell-root": {
    textAlign: "center",
    padding: "16px",
  },
}));

const StatCard = ({ label, count, color }) => (
  <Card
    sx={{
      backgroundColor: color,
      color: "#fff",
      borderRadius: "12px",
      height: "100%",
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="h4" fontWeight="bold">
        {count}
      </Typography>
    </CardContent>
  </Card>
);

const Details = () => {
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [name, setName] = useState("");
  const [lateCount, setLateCount] = useState(0);
  const [ontimeCount, setOntimeCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const { empCode } = useParams();

  const navigate = useNavigate();
  const handleBack =()=>{
    navigate(-1)
  }

  const fetchdetail = async (month) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${base_emp}/emp-handler/attendence/emp-all-attendence?empCode=${empCode}`
      );
      const attendanceDetails = response.data.result;

      const monthFilteredDetails = attendanceDetails.filter((item) => {
        const itemDate = new Date(item.todayDate);
        return itemDate.getMonth() + 1 === month;
      });

      setDetails(monthFilteredDetails);
      setFilteredDetails(monthFilteredDetails);
      setName(monthFilteredDetails[0]?.name || "");

      const late = monthFilteredDetails.filter(
        (item) => item.attendenceStatus === "LATE"
      ).length;
      const ontime = monthFilteredDetails.filter(
        (item) => item.attendenceStatus === "ONTIME"
      ).length;
      const absent = monthFilteredDetails.filter(
        (item) => item.attendenceStatus === "ABSENT"
      ).length;

      setLateCount(late);
      setOntimeCount(ontime);
      setAbsentCount(absent);
    } catch (error) {
      console.log("error fetching details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdetail(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    const filtered = details.filter(
      (item) =>
        item.todayDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.attendenceStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDetails(filtered);
  }, [searchTerm, details]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <ShapesLoader size="large" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 2, borderRadius: 2 }}
      >
        Back to List
      </Button>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="#333">
          {name}'s Attendance Overview
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "action.active", mr: 1 }} />
              ),
            }}
            sx={{ width: "250px" }}
          />
          <FormControl sx={{ width: "200px" }}>
            <InputLabel id="month-select-label">Filter by Month</InputLabel>
            <Select
              size="small"
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Filter by Month"
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#e1e9f1",
          p: 3,
          borderRadius: "8px",
          width: "100%",
          mb: 3,
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={4}>
            <StatCard label="ONTIME" count={ontimeCount} color="#4caf50" />
          </Grid>
          <Grid item xs={4}>
            <StatCard label="LATE" count={lateCount} color="#ff9800" />
          </Grid>
          <Grid item xs={4}>
            <StatCard label="ABSENT" count={absentCount} color="#f44336" />
          </Grid>
        </Grid>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
        <Table aria-label="attendance table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Check-In</StyledTableCell>
              <StyledTableCell>Break</StyledTableCell>
              <StyledTableCell>Check-Out</StyledTableCell>
              <StyledTableCell>Hours</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Details</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDetails?.map((item) => (
              <StyledTableRow key={item.id}>
                <TableCell>{item.todayDate}</TableCell>
                <TableCell>{item.checkIn}</TableCell>
                <TableCell>{"NaN"}</TableCell>
                <TableCell>
                  {item.checkOut == null ? "pending.." : item.checkOut}
                </TableCell>
                <TableCell>
                  {item.workingHours == null
                    ? "pending.."
                    : (item.workingHours / 60).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Chip
                      label={item.attendenceStatus}
                      variant="outlined"
                      color={
                        item.attendenceStatus === "ONTIME"
                          ? "success"
                          : item.attendenceStatus === "LATE"
                          ? "warning"
                          : "error"
                      }
                      sx={{ fontWeight: "bold", borderRadius: "8px" }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(item)}
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Attendance Details
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ py: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedRecord.todayDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedRecord.attendenceStatus}
                    variant="outlined"
                    color={
                      selectedRecord.attendenceStatus === "ONTIME"
                        ? "success"
                        : selectedRecord.attendenceStatus === "LATE"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Check-In Time
                  </Typography>
                  <Typography variant="body1">
                    {selectedRecord.checkIn}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Check-Out Time
                  </Typography>
                  <Typography variant="body1">
                    {selectedRecord.checkOut == null
                      ? "pending.."
                      : selectedRecord.checkOut}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Working Hours
                  </Typography>
                  <Typography variant="body1">
                    {selectedRecord.workingHours == null
                      ? "pending.."
                      : `${(selectedRecord.workingHours / 60).toFixed(
                          2
                        )} hours`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    discription
                  </Typography>
                  <Typography variant="body1">
                    {selectedRecord.discription == null
                      ? "Panding ..."
                      : selectedRecord.discription}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Details;
