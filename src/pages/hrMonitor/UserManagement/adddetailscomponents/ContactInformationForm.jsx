import React from 'react';
import { Grid, Typography, FormControl, InputLabel, OutlinedInput } from '@mui/material';
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

const ContactInformationForm = ({ employeeDetails, handleDetailsChange, errors }) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
          Contact Information
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
            htmlFor="primaryPhone"
          >
            Primary Phone
          </InputLabel>
          <StyledOutlinedInput
            id="primaryPhone"
            name="primaryPhone"
            value={employeeDetails.primaryPhone}
            onChange={handleDetailsChange}
            label="Primary Phone"
            error={!!errors.primaryPhone}
            size="small"
            placeholder="9876543210"
          />
          {errors.primaryPhone ? (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.primaryPhone}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
              10 digits
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel htmlFor="alternatePhone">Alternate Phone</InputLabel>
          <StyledOutlinedInput
            id="alternatePhone"
            name="alternatePhone"
            value={employeeDetails.alternatePhone}
            onChange={handleDetailsChange}
            label="Alternate Phone"
            size="small"
          />
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
            htmlFor="officialEmail"
          >
            Official Email
          </InputLabel>
          <StyledOutlinedInput
            id="officialEmail"
            name="officialEmail"
            value={employeeDetails.officialEmail}
            onChange={handleDetailsChange}
            label="Official Email"
            error={!!errors.officialEmail}
            size="small"
          />
          {errors.officialEmail && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.officialEmail}
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
            htmlFor="personalEmail"
          >
            Personal Email
          </InputLabel>
          <StyledOutlinedInput
            id="personalEmail"
            name="personalEmail"
            value={employeeDetails.personalEmail}
            onChange={handleDetailsChange}
            label="Personal Email"
            error={!!errors.personalEmail}
            size="small"
          />
          {errors.personalEmail && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.personalEmail}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      {/* Address Information */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
          Address Information
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="address"
          >
            Address
          </InputLabel>
          <StyledOutlinedInput
            id="address"
            name="address"
            value={employeeDetails.address}
            onChange={handleDetailsChange}
            label="Address"
            error={!!errors.address}
            size="small"
            multiline
            rows={3}
          />
          {errors.address && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.address}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="city"
          >
            City
          </InputLabel>
          <StyledOutlinedInput
            id="city"
            name="city"
            value={employeeDetails.city}
            onChange={handleDetailsChange}
            label="City"
            error={!!errors.city}
            size="small"
          />
          {errors.city && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.city}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="state"
          >
            State
          </InputLabel>
          <StyledOutlinedInput
            id="state"
            name="state"
            value={employeeDetails.state}
            onChange={handleDetailsChange}
            label="State"
            error={!!errors.state}
            size="small"
          />
          {errors.state && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.state}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="pinCode"
          >
            PIN Code
          </InputLabel>
          <StyledOutlinedInput
            id="pinCode"
            name="pinCode"
            value={employeeDetails.pinCode}
            onChange={handleDetailsChange}
            label="PIN Code"
            error={!!errors.pinCode}
            size="small"
            placeholder="123456"
          />
          {errors.pinCode ? (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.pinCode}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
              6 digits
            </Typography>
          )}
        </StyledFormControl>
      </Grid>
    </>
  );
};

export default ContactInformationForm; 