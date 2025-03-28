import React from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import { Floor } from '../types';

interface FloorSelectorProps {
  floors: Floor[];
  currentFloor: number;
  onChange: (floor: number) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ 
  floors, 
  currentFloor, 
  onChange 
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentFloor} 
          onChange={handleChange} 
          aria-label="floor selector"
          centered
        >
          {floors.map((floor) => (
            <Tab 
              key={floor.level} 
              label={`Floor ${floor.level}`} 
              value={floor.level}
              id={`floor-tab-${floor.level}`}
              aria-controls={`floor-tabpanel-${floor.level}`}
            />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
};

export default FloorSelector; 