import React from 'react';
import { Grid, Typography, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: 8,
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },
}));

const PersonalInformationForm = ({ 
  employeeDetails, 
  handleDetailsChange, 
  handleDateChange, 
  errors 
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Personal Information
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="name"
          >
            Full Name
          </InputLabel>
          <StyledOutlinedInput
            id="name"
            name="name"
            value={employeeDetails.name}
            onChange={handleDetailsChange}
            label="Full Name"
            error={!!errors.name}
            size="small"
          />
          {errors.name && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.name}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="empCode"
          >
            Employee Code
          </InputLabel>
          <StyledOutlinedInput
            id="empCode"
            name="empCode"
            value={employeeDetails.empCode}
            onChange={handleDetailsChange}
            label="Employee Code"
            disabled={true}
            error={!!errors.empCode}
            size="small"
          />
          {errors.empCode && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.empCode}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date of Birth"
            value={employeeDetails.dateOfBirth}
            onChange={handleDateChange("dateOfBirth")}
            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 21))}
            slotProps={{
              textField: {
                size: "small",
                error: !!errors.dateOfBirth,
                helperText: errors.dateOfBirth || "Employee must be at least 21 years old",
                required: true,
                sx: {
                  "& .MuiInputBase-root": {
                    height: "40px",
                  },
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="aadharNumber"
          >
            Aadhar Number
          </InputLabel>
          <StyledOutlinedInput
            id="aadharNumber"
            name="aadharNumber"
            value={employeeDetails.aadharNumber}
            onChange={handleDetailsChange}
            label="Aadhar Number"
            error={!!errors.aadharNumber}
            size="small"
            placeholder="123456789012"
          />
          {errors.aadharNumber ? (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.aadharNumber}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
              12 digits
            </Typography>
          )}
        </StyledFormControl>
      </Grid>
    </>
  );
};

export default PersonalInformationForm; 