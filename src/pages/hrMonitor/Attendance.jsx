import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { base_emp, base_Ip, base_url } from "../../http/services";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import ShapesLoader from "../../constent/ShapesLoader";
import { ArrowBack, ErrorOutline } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#f0f4f8",
  fontWeight: "bold",
  textAlign: "center",
  padding: "16px",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
  "&:hover": {
    backgroundColor: "#e3f2fd",
    transition: "background-color 0.3s ease",
  },
  "& .MuiTableCell-root": {
    textAlign: "center",
    padding: "16px",
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "3rem",
  backgroundColor: "#f9fafb",
  borderRadius: "12px",
  textAlign: "center",
}));

const Attendance = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [locationMethod, setLocationMethod] = useState('manual');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi
  const [formData, setFormData] = useState({
    officeName: '',
    country: '',
    state: '',
    city: '',
    longitude: 0,
    latitude: 0,
    pinCode: '',
    organizationName: localStorage.getItem("organizationName") || '',
    organizationCode: localStorage.getItem("organizationCode") || ''
  });
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const fetchOffices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:7002/hr-handler/office/get-office-info?organizationCode=HRHaaTCKD0`
      );

      console.log("responseeeeeeeeeeeeeeeeeeeee", response);
      // Ensure data is always an array - API returns data in result array
      const responseData = response.data;
      if (responseData && responseData.result && Array.isArray(responseData.result)) {
        setData(responseData.result);
      } else if (Array.isArray(responseData)) {
        setData(responseData);
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
        setData(responseData.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching office data:", error);
      setError("Failed to load office data. Please try again later.");
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleAddOffice = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      officeName: '',
      country: '',
      state: '',
      city: '',
      longitude: 0,
      latitude: 0,
      pinCode: '',
      organizationName: localStorage.getItem("organizationName") || '',
      organizationCode: localStorage.getItem("organizationCode") || ''
    });
    setLocationMethod('manual');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationMethodChange = (e) => {
    setLocationMethod(e.target.value);
  };

  const handleMapSelection = () => {
    // Get current location first, then open map dialog
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter({ lat, lng });
          setSelectedLocation({ lat, lng });
          setOpenMapDialog(true);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Still open map dialog with default location
          setOpenMapDialog(true);
          setSnackbarMessage('Using default location. You can search and select your location on the map.');
          setSnackbarOpen(true);
        }
      );
    } else {
      // Open map dialog with default location
      setOpenMapDialog(true);
      setSnackbarMessage('Geolocation not supported. Please search and select your location on the map.');
      setSnackbarOpen(true);
    }
  };

  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) {
      setSnackbarMessage('Please enter an address to search.');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Use Google Geocoding API to search for address
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchAddress)}&key=AIzaSyDyE0V2sIiJm7_aU1KiGMuT9o4sDM586a0`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;
        setMapCenter({ lat: location.lat, lng: location.lng });
        setSelectedLocation({ lat: location.lat, lng: location.lng });
        
        // Auto-fill address components
        handleLocationSelect(location.lat, location.lng);
      } else {
        setSnackbarMessage('Address not found. Please try a different search term.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setSnackbarMessage('Failed to search address. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleLocationSelect = async (lat, lng) => {
    try {
      // Use reverse geocoding to get address components
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocoding/json?latlng=${lat},${lng}&key=AIzaSyDyE0V2sIiJm7_aU1KiGMuT9o4sDM586a0`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        
        let country = '', state = '', city = '', pinCode = '';
        
        addressComponents.forEach(component => {
          if (component.types.includes('country')) {
            country = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
          if (component.types.includes('locality') || component.types.includes('sublocality')) {
            city = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            pinCode = component.long_name;
          }
        });

        setFormData(prev => ({
          ...prev,
          country,
          state,
          city,
          pinCode,
          latitude: lat,
          longitude: lng
        }));

        setSelectedLocation({ lat, lng });
        setSnackbarMessage('Location selected successfully!');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setSnackbarMessage('Failed to get address details. Please enter manually.');
      setSnackbarOpen(true);
    }
  };

  const handleMapDialogClose = () => {
    setOpenMapDialog(false);
    setSearchAddress('');
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      handleLocationSelect(selectedLocation.lat, selectedLocation.lng);
      handleMapDialogClose();
    } else {
      setSnackbarMessage('Please select a location on the map.');
      setSnackbarOpen(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:7002/hr-handler/office/add-office-info`,
        formData
      );
      
      if (response.data) {
        setSnackbarMessage('Office added successfully!');
        setSnackbarOpen(true);
        handleCloseDialog();
        fetchOffices(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding office:', error);
      setSnackbarMessage('Failed to add office. Please try again.');
      setSnackbarOpen(true);
    }
  };
  
  // Ensure data is always an array before filtering
  const safeData = Array.isArray(data) ? data : [];
  const filteredData = safeData.filter((item) => 
    item?.officeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.pinCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        sx={{ 
          mb: 2, 
          borderRadius: 2,
          boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
          '&:hover': {
            boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
          }
        }}
      >
        Back to List
      </Button>
      
      <Box
        sx={{
          backgroundColor: "#e1e9f1",
          p: 2,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BusinessIcon sx={{ mr: 1, color: "#1976d2" }} />
          <Typography variant="h5" fontWeight="bold" color="#333">
            Office Management
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          placeholder="Search by office name, address, pin code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
            width: "300px",
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                borderWidth: '2px',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2, borderRadius: "8px" }}
          action={
            <Button color="inherit" size="small" onClick={fetchOffices}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!error && safeData.length === 0 && (
        <EmptyStateContainer>
          <ErrorOutline sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Office Data Available
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: "500px", mb: 3 }}>
            There are no office records to display. Please add your first office location to get started.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleAddOffice}
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(25, 118, 210, 0.25)",
            }}
          >
            Add Office
          </Button>
        </EmptyStateContainer>
      )}

      {!error && safeData.length > 0 && filteredData.length === 0 && (
        <EmptyStateContainer>
          <SearchIcon sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Results Found
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: "500px", mb: 3 }}>
            No office records match your search query. Please try a different search term.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => setSearchQuery("")}
            sx={{ borderRadius: "8px" }}
          >
            Clear Search
          </Button>
        </EmptyStateContainer>
      )}

      {!error && filteredData.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              Office Locations ({filteredData.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddOffice}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                borderRadius: '8px'
              }}
            >
              Add Office
            </Button>
          </Box>
          
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Table aria-label="office table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Office Details</StyledTableCell>
                  <StyledTableCell>Complete Address</StyledTableCell>
                  <StyledTableCell>Coordinates</StyledTableCell>
                  <StyledTableCell>Location</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item, index) => (
                  <StyledTableRow key={item.officeCode || index}>
                    {/* Office Details Column */}
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BusinessIcon sx={{ color: "#1976d2", fontSize: "24px" }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2" }}>
                            {item.officeName || "N/A"}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic" }}>
                          {item.organizationName || "Organization"}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Complete Address Column */}
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, maxWidth: 250 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOnIcon sx={{ color: "#ff5722", fontSize: "18px" }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.city || "N/A"}, {item.state || "N/A"}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#666", ml: 3 }}>
                          {item.country || "N/A"}
                        </Typography>
                        {item.pinCode && (
                          <Chip 
                            label={`PIN: ${item.pinCode}`} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              ml: 3, 
                              width: 'fit-content',
                              borderColor: '#4caf50',
                              color: '#4caf50',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>

                    {/* Coordinates Column */}
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          <strong>Lat:</strong> {item.latitude ? parseFloat(item.latitude).toFixed(4) : "N/A"}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          <strong>Lng:</strong> {item.longitude ? parseFloat(item.longitude).toFixed(4) : "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Location Actions Column */}
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<MapIcon />}
                        onClick={() => window.open(`https://maps.google.com/?q=${item.latitude},${item.longitude}`, '_blank')}
                        sx={{ 
                          borderRadius: '8px',
                          backgroundColor: '#4caf50',
                          '&:hover': { backgroundColor: '#388e3c' },
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Open Map
                      </Button>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          sx={{ 
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            '&:hover': { backgroundColor: '#bbdefb' },
                            borderRadius: '8px'
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ 
                            backgroundColor: '#ffebee',
                            color: '#d32f2f',
                            '&:hover': { backgroundColor: '#ffcdd2' },
                            borderRadius: '8px'
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Add Office Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ mr: 1 }} />
          Add New Office
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="officeName"
                label="Office Name"
                value={formData.officeName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Location Input Method</FormLabel>
                <RadioGroup
                  value={locationMethod}
                  onChange={handleLocationMethodChange}
                  row
                >
                  <FormControlLabel value="manual" control={<Radio />} label="Manual Entry" />
                  <FormControlLabel value="map" control={<Radio />} label="Use Current Location" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {locationMethod === 'map' && (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<MapIcon />}
                  onClick={handleMapSelection}
                  fullWidth
                  sx={{ py: 2, borderRadius: '8px' }}
                >
                  Get Current Location & Auto-fill Address
                </Button>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="state"
                label="State"
                value={formData.state}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="pinCode"
                label="Pin Code"
                value={formData.pinCode}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            {locationMethod === 'manual' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="latitude"
                    label="Latitude"
                    type="number"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    fullWidth
                    inputProps={{ step: "any" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="longitude"
                    label="Longitude"
                    type="number"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    fullWidth
                    inputProps={{ step: "any" }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.officeName || !formData.country || !formData.state || !formData.city}
          >
            Add Office
          </Button>
        </DialogActions>
      </Dialog>

      {/* Google Maps Dialog */}
      <Dialog open={openMapDialog} onClose={handleMapDialogClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white', display: 'flex', alignItems: 'center' }}>
          <MapIcon sx={{ mr: 1 }} />
          Select Office Location
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '600px' }}>
          {/* Search Bar */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f5f5f5' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  placeholder="Search for an address (e.g., Times Square, New York)"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  onClick={handleAddressSearch}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 1 }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
              Search for an address or click on the map to select a location
            </Typography>
          </Box>

          {/* Map Container */}
          <Box sx={{ height: '100%', position: 'relative' }}>
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDyE0V2sIiJm7_aU1KiGMuT9o4sDM586a0&q=${mapCenter.lat},${mapCenter.lng}&zoom=15`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location Map"
            />
            
            {/* Map Overlay with Instructions */}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                right: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 1,
                p: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                📍 How to select location:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#666' }}>
                1. Search for an address above, or
                <br />
                2. Navigate to your desired location on the map
                <br />
                3. Click "Use This Location" to confirm
              </Typography>
              
              {selectedLocation && (
                <Box sx={{ mt: 2, p: 1, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                    ✓ Location Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Interactive Map Button */}
            <Button
              variant="contained"
              onClick={() => window.open(`https://www.google.com/maps/@${mapCenter.lat},${mapCenter.lng},15z`, '_blank')}
              sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
              }}
            >
              Open Interactive Map
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={handleMapDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Use current map center as selected location
              const lat = mapCenter.lat;
              const lng = mapCenter.lng;
              setSelectedLocation({ lat, lng });
              handleLocationSelect(lat, lng);
              handleMapDialogClose();
            }}
            variant="contained"
            sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
          >
            Use This Location
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Attendance;