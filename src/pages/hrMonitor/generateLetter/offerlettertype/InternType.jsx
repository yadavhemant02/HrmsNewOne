import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatDate } from '../utils/dateUtils';
import { useCompanyLogo } from '../../../../hooks/useCompanyLogo';

const InternType = ({ formData, organizationName, offerContent }) => {
  const { logoUrl, logoLoading, logoError } = useCompanyLogo();

  console.log("formaData", formData);
    console.log("offerContent", offerContent);
  

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

      {formData.instituteName && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          {formData.instituteName}
        </Typography>
      )}

      <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
        We Deliver Competitive Business Advantage
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {offerContent.header || `Thank you for your interest in building a career with ${organizationName} (hereinafter referred to as the "Organization"). 
        We are pleased to extend to you an offer for an internship with us for the role of ${formData.position || "[Intern Role, e.g., Software Intern]"}.`}
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
              Your internship is expected to commence on {formData.joiningDate ? formatDate(formData.joiningDate) : '[Start Date]'} and will conclude on {formData.endDate ? formatDate(formData.endDate) : '[End Date]'}, 
              unless extended or curtailed in writing by the Organization.
            </li>
            <li style={{ marginBottom: '10px' }}>
              You will be paid a monthly stipend of INR {formData.grossSalary ? formData.grossSalary.toLocaleString() : '[Amount]'}, 
              as described in Annexure A.
            </li>
            <li style={{ marginBottom: '10px' }}>
              You shall maintain confidentiality and abide by the rules and regulations of the Organization during your internship.
            </li>
            <li style={{ marginBottom: '10px' }}>
              You may be assigned to any project, team, or mentor as deemed fit by the Organization.
            </li>
            <li style={{ marginBottom: '10px' }}>
              This internship does not constitute an offer of employment. However, based on your performance, 
              there may be an opportunity for a full-time offer at the end of the internship.
            </li>
            <li style={{ marginBottom: '10px' }}>
              You must submit a copy of your college ID, address proof, and a letter of approval (if required) 
              from your institution before commencement.
            </li>
            <li style={{ marginBottom: '10px' }}>
              Any violation of organizational policies may result in early termination of the internship.
            </li>
          </>
        )}
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {offerContent.footer || "Please acknowledge your acceptance of this internship by signing and returning a copy of this letter within five (5) working days."}
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        We look forward to having you onboard and believe this internship will be an enriching experience.
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
            {offerContent.signatureName || 'Bharat Shetty'}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {formData.designation || 'React Developer'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InternType;