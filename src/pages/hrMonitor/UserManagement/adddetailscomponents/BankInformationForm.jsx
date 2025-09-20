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

const BankInformationForm = ({ 
  employeeDetails, 
  handleDetailsChange, 
  errors,
  isFieldRequired 
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
          Bank Information {employeeDetails.empType !== 'Full Time' && 
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              (Optional for {employeeDetails.empType?.toLowerCase()})
            </Typography>
          }
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required={isFieldRequired("bankName")}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="bankName"
          >
            Bank Name
          </InputLabel>
          <StyledOutlinedInput
            id="bankName"
            name="bankName"
            value={employeeDetails.bankName}
            onChange={handleDetailsChange}
            label="Bank Name"
            error={!!errors.bankName}
            size="small"
          />
          {errors.bankName && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.bankName}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required={isFieldRequired("accountNumber")}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="accountNumber"
          >
            Account Number
          </InputLabel>
          <StyledOutlinedInput
            id="accountNumber"
            name="accountNumber"
            value={employeeDetails.accountNumber}
            onChange={handleDetailsChange}
            label="Account Number"
            error={!!errors.accountNumber}
            size="small"
            placeholder="123456789012"
          />
          {errors.accountNumber ? (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.accountNumber}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
              9-18 digits
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required={isFieldRequired("uanNumber")}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="uanNumber"
          >
            UAN Number
          </InputLabel>
          <StyledOutlinedInput
            id="uanNumber"
            name="uanNumber"
            value={employeeDetails.uanNumber}
            onChange={handleDetailsChange}
            label="UAN Number"
            error={!!errors.uanNumber}
            size="small"
            placeholder="123456789012"
          />
          {errors.uanNumber ? (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.uanNumber}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
              12 digits
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required={isFieldRequired("panNumber")}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="panNumber"
          >
            PAN Number
          </InputLabel>
          <StyledOutlinedInput
            id="panNumber"
            name="panNumber"
            value={employeeDetails.panNumber ? employeeDetails.panNumber.toUpperCase() : ''}
            onChange={handleDetailsChange}
            label="PAN Number"
            error={!!errors.panNumber}
            size="small"
            placeholder="ABCDE1234F"
          />
          {errors.panNumber ? (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.panNumber}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
              ABCDE1234F (5 letters, 4 numbers, 1 letter)
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required={isFieldRequired("ifseCode")}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="ifseCode"
          >
            IFSC Code
          </InputLabel>
          <StyledOutlinedInput
            id="ifseCode"
            name="ifseCode"
            value={employeeDetails.ifseCode}
            onChange={handleDetailsChange}
            label="IFSC Code"
            error={!!errors.ifseCode}
            size="small"
            placeholder="BANK0123456"
          />
          {errors.ifseCode ? (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.ifseCode}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
              BANK0123456 (4 letters, 0, 6 alphanumeric)
            </Typography>
          )}
        </StyledFormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledFormControl variant="outlined" fullWidth size="small">
          <InputLabel
            required={isFieldRequired("branchName")}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
            htmlFor="branchName"
          >
            Branch Name
          </InputLabel>
          <StyledOutlinedInput
            id="branchName"
            name="branchName"
            value={employeeDetails.branchName}
            onChange={handleDetailsChange}
            label="Branch Name"
            error={!!errors.branchName}
            size="small"
          />
          {errors.branchName && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.branchName}
            </Typography>
          )}
        </StyledFormControl>
      </Grid>
    </>
  );
};

export default BankInformationForm; 