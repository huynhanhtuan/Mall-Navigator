import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton 
            component={Link} 
            to="/" 
            color="inherit" 
            edge="start"
            sx={{ mr: 1 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Mall Navigator
          </Typography>
        </Box>
        
        <IconButton 
          color="inherit" 
          onClick={() => alert('Mall Navigator is a 2D mall mapping application that helps visitors locate stores and facilities.')}
        >
          <InfoIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 