import React from 'react';
import { Grid, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
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

const EmploymentInformationForm = ({ 
  employeeDetails, 
  handleDetailsChange, 
  handleDateChange, 
  errors,
  isFieldRequired 
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
          Employment Information
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
            htmlFor="organizationCode"
          >
            Organization Code
          </InputLabel>
          <StyledOutlinedInput
            id="organizationCode"
            name="organizationCode"
            value={employeeDetails.organizationCode}
            onChange={handleDetailsChange}
            label="Organization Code"
            disabled={true}
            error={!!errors.organizationCode}
            size="small"
          />
          {errors.organizationCode && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.organizationCode}
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
            htmlFor="empType"
          >
            Employee Type
          </InputLabel>
          <StyledOutlinedInput
            id="empType"
            name="empType"
            value={employeeDetails.empType}
            onChange={handleDetailsChange}
            label="Employee Type"
            error={!!errors.empType}
            size="small"
          />
          {errors.empType && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.empType}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth required size="small">
          <InputLabel htmlFor="position">Position</InputLabel>
          <StyledOutlinedInput
            id="position"
            name="position"
            value={employeeDetails.position}
            onChange={handleDetailsChange}
            label="Position"
            error={!!errors.position}
            size="small"
          />
          {errors.position && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.position}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required={isFieldRequired("ctc")}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="ctc"
          >
            CTC (Cost to Company)
          </InputLabel>
          <StyledOutlinedInput
            id="ctc"
            name="ctc"
            value={employeeDetails.ctc}
            onChange={handleDetailsChange}
            label="CTC (Cost to Company)"
            type="number"
            error={!!errors.ctc}
            startAdornment={<InputAdornment position="start">₹</InputAdornment>}
            size="small"
          />
          {errors.ctc && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.ctc}
            </Typography>
          )}
          {employeeDetails.empType !== 'Full Time' && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
              Optional for {employeeDetails.empType?.toLowerCase()}
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
            htmlFor="disignation"
          >
            Designation
          </InputLabel>
          <StyledOutlinedInput
            id="disignation"
            name="disignation"
            value={employeeDetails.disignation}
            onChange={handleDetailsChange}
            label="Designation"
            error={!!errors.disignation}
            size="small"
          />
          {errors.disignation && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.disignation}
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
            htmlFor="function"
          >
            Function
          </InputLabel>
          <StyledOutlinedInput
            id="function"
            name="function"
            value={employeeDetails.function}
            onChange={handleDetailsChange}
            label="Function"
            error={!!errors.function}
            size="small"
          />
          {errors.function && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.function}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Offer Date"
            value={employeeDetails.offerDate}
            onChange={handleDateChange("offerDate")}
            slotProps={{
              textField: {
                size: "small",
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date of Joining"
            value={employeeDetails.dateOfJoin}
            onChange={handleDateChange("dateOfJoin")}
            slotProps={{
              textField: {
                size: "small",
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
    </>
  );
};

export default EmploymentInformationForm; 