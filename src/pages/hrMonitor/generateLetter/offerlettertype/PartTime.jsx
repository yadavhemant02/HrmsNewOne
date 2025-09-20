import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatDate } from '../utils/dateUtils';
import { useCompanyLogo } from '../../../../hooks/useCompanyLogo';

const PartTime = ({ formData, organizationName, offerContent }) => {
  const { logoUrl, logoLoading, logoError } = useCompanyLogo();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "#2193EF",
              fontWeight: 600,
              letterSpacing: "0.02em",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {organizationName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "10pt",
              whiteSpace: "pre-line",
            }}
          >
            {offerContent.companyAddress || 'The Hive at VR Bengaluru, ITPL Main Road\nMahadevpura, Bengaluru - 560048'}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "80px",
            height: "40px",
            bgcolor: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company Logo"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <Typography variant="body2">LOGO</Typography>
          )}
        </Box>
      </Box>

      <Typography variant="body1" sx={{ mt: 2 }}>
        <strong>
          {formData.currentDate && formatDate(formData.currentDate)}
        </strong>
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        <strong>
          Dear {formData.candidateName || "[Candidate Name]"},
        </strong>
      </Typography>

      <Typography
        variant="body1"
        sx={{ mt: 1, mb: 2, whiteSpace: "pre-line" }}
      >
        {formData.address || "[Address]"}
      </Typography>

      <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
        We Deliver Competitive Business Advantage
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {offerContent.header || `We are pleased to offer you a part-time position at ${organizationName}.`}
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        This offer is based on your profile and performance in our selection process and is subject to the following terms:
      </Typography>

      <Typography variant="body1" component="ol" sx={{ mt: 2, pl: 2 }}>
        {offerContent.offerSummury && offerContent.offerSummury.length > 0 ? (
          offerContent.offerSummury.map((point, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {point}
            </li>
          ))
        ) : (
          <>
            <li style={{ marginBottom: '10px' }}>
              Your part-time engagement is expected to commence on {formData.joiningDate ? formatDate(formData.joiningDate) : '[Start Date]'} and will continue until further notice.
            </li>
            <li style={{ marginBottom: '10px' }}>
              You will be paid an hourly rate of INR {formData.grossSalary ? formData.grossSalary.toLocaleString() : '[Amount]'}, 
              as described in Annexure A.
            </li>
            <li style={{ marginBottom: '10px' }}>
              You shall maintain confidentiality and abide by the rules and regulations of the Organization during your engagement.
            </li>
            <li style={{ marginBottom: '10px' }}>
              You may be assigned to any project or team as deemed fit by the Organization.
            </li>
            <li style={{ marginBottom: '10px' }}>
              This is a part-time engagement and does not constitute a full-time employment relationship.
            </li>
            <li style={{ marginBottom: '10px' }}>
              You must submit all required documentation before commencement of the engagement.
            </li>
            <li style={{ marginBottom: '10px' }}>
              Any violation of organizational policies may result in early termination of the engagement.
            </li>
          </>
        )}
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {offerContent.footer || "Please confirm your acceptance of the terms by signing and returning a copy of this letter within five (5) working days."}
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        We welcome you to the {organizationName} family and look forward to your valuable contribution.
      </Typography>

      <Typography variant="body1" sx={{ mt: 4 }}>
        Warm regards,
      </Typography>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            For {organizationName}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
            {offerContent.signatureName || '[Authorized Signatory Name]'}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {formData.designation || '[Designation]'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PartTime;