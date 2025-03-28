import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  Divider, 
  IconButton, 
  Rating,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import { Store } from '../types';

interface StoreDetailProps {
  stores: Store[];
}

const StoreDetail: React.FC<StoreDetailProps> = ({ stores }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const store = stores.find(s => s.id === id);
  
  if (!store) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Store not found
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Mall Map
        </Button>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          {store.name}
        </Typography>
      </Box>
      
      <Chip 
        label={store.category} 
        color="primary" 
        size="small" 
        sx={{ mb: 2 }} 
      />
      
      {store.rating && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 1 }}>
          <Rating value={store.rating} readOnly precision={0.5} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {store.rating.toFixed(1)}
          </Typography>
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body1" paragraph>
        {store.description}
      </Typography>
      
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">
            Floor {store.floor}, Location {store.position.x.toFixed(1)}, {store.position.z.toFixed(1)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTimeIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">
            {store.openingHours}
          </Typography>
        </Box>
        
        {store.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {store.phone}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/')}
        >
          Back to Mall Map
        </Button>
      </Box>
    </Paper>
  );
};

export default StoreDetail; 