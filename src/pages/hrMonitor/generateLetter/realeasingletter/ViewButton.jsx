import React from 'react';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ViewButton = ({ onClick, disabled = false }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      startIcon={<VisibilityIcon />}
      onClick={onClick}
      disabled={disabled}
      sx={{
        textTransform: 'none',
        borderRadius: 1,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      }}
    >
      View
    </Button>
  );
};

export default ViewButton; 