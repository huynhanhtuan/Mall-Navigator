import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Paper sx={{ 
      p: 4, 
      textAlign: 'center',
      maxWidth: 500,
      mx: 'auto',
      mt: 4
    }}>
      <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      
      <Typography variant="h4" component="h1" gutterBottom>
        Page Not Found
      </Typography>
      
      <Typography variant="body1" paragraph>
        The page you are looking for does not exist or has been moved.
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
        >
          Return to Mall Map
        </Button>
      </Box>
    </Paper>
  );
};

export default NotFound; 