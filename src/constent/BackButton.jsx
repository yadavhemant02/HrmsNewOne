import React from 'react';
import { Button } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { Link} from 'react-router-dom';

const BackButton = () => {

  return (
    <Link to="/dashboard-hr">
      
    <Button
      variant="outlined"
              startIcon={<ArrowBack />}
              sx={{ mb: 2, borderRadius: 2 }}
    >
      Back to list
    </Button>
    </Link>
  );
};

export default BackButton;
