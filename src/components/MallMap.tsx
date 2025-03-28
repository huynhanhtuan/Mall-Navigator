import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tooltip, Zoom, Button, TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Store, Facility, Floor } from '../types';
import { useNavigate } from 'react-router-dom';

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[1]
}));

const DetailsBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 20,
  left: 20,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.text.primary,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  maxWidth: '300px',
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
  },
  '& ol, & li': {
    color: theme.palette.text.primary,
  }
}));

const FloorMap = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const MapBorder = styled(Box)(({ theme }) => ({
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  maxWidth: '90%',
  maxHeight: '90%',
  width: '1000px',
  height: '700px',
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  overflow: 'hidden',
}));

const FloorImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '600px',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden'
}));

const FloorImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain'
});

const MarkersContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none'
});

const MarkerItem = styled(Paper)<{ $category?: string; $isUserLocation?: boolean }>`
  position: absolute;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 10;
  background-color: ${(props) => {
    if (props.$isUserLocation) return '#e91e63';
    
    switch (props.$category) {
      case 'food':
        return '#ffcdd2';
      case 'fashion':
        return '#ffecb3';
      case 'tech':
        return '#b2dfdb';
      case 'goods':
        return '#a8d3ff';
      case 'services':
        return '#c5cae9';
      case 'supermarket':
        return '#e1bee7';
      default:
        return '#9e9e9e';
    }
  }};
`;

const FacilityMarker = styled(Paper)<{ $type?: string }>`
  position: absolute;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 10;
  background-color: ${(props) => {
    switch (props.$type) {
      case 'elevator':
        return '#4caf50';
      case 'toilet':
        return '#03a9f4';
      case 'parking':
        return '#9c27b0';
      case 'entrance':
        return '#ff9800';
      default:
        return '#607d8b';
    }
  }};
  color: white;
`;

const StoreTooltip = (props: {
  title: React.ReactNode;
  placement?: TooltipProps['placement'];
  arrow?: boolean;
  TransitionComponent?: React.ComponentType<any>;
  children: React.ReactElement;
  [key: string]: any;
}) => {
  const { children, ...tooltipProps } = props;
  
  return (
    <Tooltip {...tooltipProps}>
      {children}
    </Tooltip>
  );
};

const FloorNavigation = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  zIndex: 10,
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  minWidth: '50px',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  padding: 0,
  boxShadow: theme.shadows[2],
}));

const FloorLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(2),
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.text.primary,
  zIndex: 5,
}));

const YouAreHereMarker = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: 40,
  height: 40,
  backgroundColor: '#F44336',
  transform: 'translate(-50%, -50%)',
  zIndex: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.shadows[3],
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)'
    },
    '70%': {
      boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)'
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)'
    }
  }
}));

// Mapping between store categories and marker sizes/colors
const storeTypeConfig = {
  food: {
    color: 'error.main',
    size: 24,
  },
  fashion: {
    color: 'primary.main',
    size: 24,
  },
  electronics: {
    color: 'secondary.main',
    size: 24,
  },
  services: {
    color: 'success.main',
    size: 24,
  },
  default: {
    color: 'info.main', 
    size: 24,
  }
};

// Mapping between facility types and marker sizes/colors
const facilityTypeConfig = {
  elevator: {
    color: 'success.main', 
    size: 30,
    symbol: '⬆︎' 
  },
  toilet: {
    color: 'info.main',
    size: 30,
    symbol: 'WC'
  },
  parking: {
    color: 'secondary.main',
    size: 30,
    symbol: 'P'
  },
  entrance: {
    color: 'warning.main',
    size: 30,
    symbol: '⤭'
  },
  default: {
    color: 'grey.500',
    size: 30,
    symbol: '•'
  }
};

// Function to convert 3D position to percentage-based 2D position
const getPositionPercentage = (x: number, y: number, z: number) => {
  // Get percentage based on x and z (ignoring y as it's height)
  // Assuming a mall with x and z both in range -5 to 5
  const xPercentage = ((x + 5) / 10) * 100; // Convert from -5,5 to 0%,100%
  const yPercentage = ((z + 5) / 10) * 100; // Convert from -5,5 to 0%,100% (z is depth)
  
  return { x: xPercentage, y: yPercentage };
};

// Map each floor to its image
const floorImages = {
  1: '/images/floor-1.svg',
  2: '/images/floor-2.svg',
  3: '/images/floor-3.svg',
  default: '/images/default-floor.svg'
};

interface MallMapProps {
  currentFloor: Floor;
  stores: Store[];
  facilities: Facility[];
  userLocation: { x: number; y: number; z: number } | null;
  setUserLocation: (location: { x: number; y: number; z: number }) => void;
}

const MallMap: React.FC<MallMapProps> = ({ 
  currentFloor, 
  stores, 
  facilities, 
  userLocation,
  setUserLocation
}) => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleStoreClick = (id: string) => {
    navigate(`/store/${id}`);
  };

  const handleSetLocation = (x: number, y: number, z: number) => {
    setUserLocation({ x, y, z });
  };

  const handleUpOneFloor = () => {
    if (userLocation) {
      const newZ = userLocation.z ? userLocation.z + 1 : 1;
      handleSetLocation(userLocation.x, userLocation.y, newZ);
    }
  };

  const handleDownOneFloor = () => {
    if (userLocation) {
      const newZ = userLocation.z ? userLocation.z - 1 : 0;
      handleSetLocation(userLocation.x, userLocation.y, newZ);
    }
  };

  // Get the floor image based on floor number
  const floorImage = floorImages[currentFloor.level as keyof typeof floorImages] || floorImages.default;

  return (
    <MapContainer>
      <FloorMap>
        <MapBorder>
          <FloorLabel variant="h5">Floor {currentFloor.level}</FloorLabel>
          
          <FloorImageContainer>
            <FloorImage src={floorImage} alt={`Floor ${currentFloor.level} layout`} />
            
            <MarkersContainer>
              {/* Store markers */}
              {stores.map((store) => {
                const position = getPositionPercentage(
                  store.position.x,
                  store.position.y,
                  store.position.z
                );
                
                return (
                  <MarkerItem
                    key={store.id}
                    $category={store.category}
                    onClick={() => handleStoreClick(store.id)}
                    onMouseEnter={() => setHoveredItem(store.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    elevation={3}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Typography variant="subtitle2" align="center">
                      {store.id.slice(-2)}
                    </Typography>
                    
                    {hoveredItem === store.id && (
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          padding: '4px 8px',
                          zIndex: 20,
                          minWidth: '100px'
                        }}
                      >
                        <Typography variant="caption">{store.name}</Typography>
                      </Paper>
                    )}
                  </MarkerItem>
                );
              })}
              
              {/* Facility markers */}
              {facilities.map((facility) => {
                const position = getPositionPercentage(
                  facility.position.x,
                  facility.position.y,
                  facility.position.z
                );
                
                // Icon for the facility type
                let icon = '?';
                switch (facility.type) {
                  case 'elevator':
                    icon = '⬆';
                    break;
                  case 'toilet':
                    icon = 'WC';
                    break;
                  case 'parking':
                    icon = 'P';
                    break;
                  case 'entrance':
                    icon = '⤭';
                    break;
                  default:
                    icon = '?';
                }
                
                return (
                  <FacilityMarker
                    key={facility.id}
                    $type={facility.type}
                    onMouseEnter={() => setHoveredItem(facility.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    elevation={3}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Typography variant="subtitle2" align="center" sx={{ color: 'white' }}>
                      {icon}
                    </Typography>
                    
                    {hoveredItem === facility.id && (
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          padding: '4px 8px',
                          zIndex: 20 
                        }}
                      >
                        <Typography variant="caption">{facility.name}</Typography>
                      </Paper>
                    )}
                  </FacilityMarker>
                );
              })}
              
              {/* User location marker "You are here" */}
              {userLocation && (
                <MarkerItem
                  $isUserLocation={true}
                  elevation={3}
                  style={{
                    left: `${getPositionPercentage(userLocation.x, userLocation.y, userLocation.z).x}%`,
                    top: `${getPositionPercentage(userLocation.x, userLocation.y, userLocation.z).y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '40px',
                    height: '40px',
                    zIndex: 15
                  }}
                >
                  <Typography variant="subtitle2" align="center" sx={{ color: 'white' }}>
                    YOU
                  </Typography>
                </MarkerItem>
              )}
            </MarkersContainer>
          </FloorImageContainer>
          
          {/* Floor navigation */}
          <FloorNavigation>
            <NavigationButton 
              variant="contained" 
              color="primary" 
              onClick={handleUpOneFloor}
              disabled={!userLocation || currentFloor.level >= 3}
            >
              ↑
            </NavigationButton>
            <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              {currentFloor.level}
            </Box>
            <NavigationButton 
              variant="contained" 
              color="primary" 
              onClick={handleDownOneFloor}
              disabled={!userLocation || currentFloor.level <= 1}
            >
              ↓
            </NavigationButton>
          </FloorNavigation>
          
          {/* Instructions for clicking */}
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Click on a marker to view details. Double-click anywhere on the map to set your location.
            </Typography>
          </Box>
          
          {/* Click handler for the map to set user location */}
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%',
              zIndex: 5
            }}
            onDoubleClick={(e) => {
              // Get coordinates relative to the container
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 10 - 5; // Convert from 0-100% to -5 to 5
              const z = ((e.clientY - rect.top) / rect.height) * 10 - 5; // Convert from 0-100% to -5 to 5
              handleSetLocation(x, 0, z); // Set y to 0 (floor level)
            }}
          />
        </MapBorder>
      </FloorMap>
    </MapContainer>
  );
};

export default MallMap; 