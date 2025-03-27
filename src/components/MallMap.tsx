import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tooltip, Zoom, Button, TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Store, Facility } from '../types';

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
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

const FloorImageContainer = styled(Box)({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
});

const FloorImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
});

const MarkersContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 2,
  pointerEvents: 'none', // Allow clicking through to the image underneath
});

const MapHotspot = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  backgroundColor: 'rgba(33, 150, 243, 0.3)',
  border: '2px solid rgba(33, 150, 243, 0.7)',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  transform: 'translate(-50%, -50%)',
  zIndex: 5,
  '&:hover': {
    transform: 'translate(-50%, -50%) scale(1.1)',
    boxShadow: theme.shadows[2],
  },
  pointerEvents: 'auto', // Override parent container's pointerEvents
}));

const FacilityHotspot = styled(MapHotspot)(({ theme }) => ({
  backgroundColor: 'rgba(245, 0, 87, 0.3)',
  border: '2px solid rgba(245, 0, 87, 0.7)',
}));

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

// Floor plan images for each floor
const floorImages = {
  1: './images/default-floor.svg',
  2: './images/default-floor.svg',
  3: './images/default-floor.svg',
};

// Default floor image if specific floor not found
const defaultFloorImage = './images/default-floor.svg';

// Convert 3D position to display position on the map
const getMapPosition = (item: Store | Facility): { top: number, left: number } => {
  // Map x and z coordinates to percentage positions
  // Assuming original 3D coordinates are in the range [-15, 15]
  const x = item.position.x;
  const z = item.position.z;
  
  // Normalize from 3D space to floor map canvas space
  // These values should be calibrated based on your specific floor map layout
  const leftPos = ((x + 15) / 30) * 850 + 75; // Map to 75-925px range horizontally
  const topPos = ((z + 15) / 30) * 550 + 75;  // Map to 75-625px range vertically
  
  return {
    top: topPos,
    left: leftPos
  };
};

interface MallMapProps {
  currentFloor: number;
  stores: Store[];
  facilities: Facility[];
  onStoreSelect: (store: Store) => void;
  onFacilitySelect: (facility: Facility) => void;
  onFloorChange: (floor: number) => void;
  isTouchDevice?: boolean;
  userLocation?: { x: number, y: number, floor: number };
  setUserLocation?: (location: { x: number, y: number, floor: number }) => void;
}

const MallMap: React.FC<MallMapProps> = ({
  currentFloor,
  stores,
  facilities,
  onStoreSelect,
  onFacilitySelect,
  onFloorChange,
  isTouchDevice = false,
  userLocation = { x: 0, y: 0, floor: 1 },
  setUserLocation,
}) => {
  const [selectedItem, setSelectedItem] = useState<Store | Facility | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isSettingLocation, setIsSettingLocation] = useState(false);

  // Filter items for current floor
  const storesOnFloor = stores.filter(store => store.floor === currentFloor);
  const facilitiesOnFloor = facilities.filter(facility => facility.floor === currentFloor);

  // Reset selected item when changing floors
  useEffect(() => {
    setSelectedItem(null);
    setShowDetails(false);
  }, [currentFloor]);

  const handleItemClick = (item: Store | Facility, type: 'store' | 'facility') => {
    setSelectedItem(item);
    setShowDetails(true);
    if (type === 'store') {
      onStoreSelect(item as Store);
    } else {
      onFacilitySelect(item as Facility);
    }
  };

  // Change floor handler
  const handleFloorChange = (direction: 'up' | 'down') => {
    const maxFloor = 3; // Assuming we have 3 floors
    let newFloor;
    
    if (direction === 'up') {
      newFloor = currentFloor < maxFloor ? currentFloor + 1 : currentFloor;
    } else {
      newFloor = currentFloor > 1 ? currentFloor - 1 : currentFloor;
    }
    
    if (newFloor !== currentFloor) {
      onFloorChange(newFloor);
    }
  };

  // Select the appropriate floor image
  const floorImage = floorImages[currentFloor as keyof typeof floorImages] || defaultFloorImage;

  // Handle image loading error
  const handleImageError = () => {
    console.error(`Failed to load floor image: ${floorImage}`);
    setImageError(true);
  };

  // Handle click on map for setting user location
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSettingLocation || !setUserLocation) return;
    
    // Get click coordinates relative to the image container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to 3D coordinates (roughly approximated)
    const width = rect.width;
    const height = rect.height;
    
    // Map from pixel to 3D space
    const xCoord = ((x / width) * 30) - 15;
    const yCoord = ((y / height) * 30) - 15;
    
    // Update user location
    setUserLocation({
      x: xCoord,
      y: yCoord,
      floor: currentFloor
    });
    
    // Exit location setting mode
    setIsSettingLocation(false);
  };

  return (
    <MapContainer>
      <FloorMap>
        <MapBorder>
          <FloorLabel variant="h5">Floor {currentFloor}</FloorLabel>
          
          {setUserLocation && (
            <Button
              variant="contained"
              color={isSettingLocation ? "secondary" : "primary"}
              size="small"
              onClick={() => setIsSettingLocation(!isSettingLocation)}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '70px',
                zIndex: 10,
              }}
            >
              {isSettingLocation ? 'Cancel' : 'Set My Location'}
            </Button>
          )}
          
          <FloorImageContainer onClick={handleMapClick}>
            {/* Floor plan image */}
            <FloorImage 
              src={floorImage} 
              alt={`Floor ${currentFloor} Plan`} 
              onError={handleImageError} 
            />
            
            {/* Location setting helper text */}
            {isSettingLocation && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: 2,
                  borderRadius: 1,
                  zIndex: 10,
                }}
              >
                Click anywhere on the map to set your location
              </Box>
            )}
            
            {/* Markers container */}
            <MarkersContainer>
              {/* You Are Here marker - only show if user is on current floor */}
              {userLocation && userLocation.floor === currentFloor && (
                <YouAreHereMarker
                  sx={{
                    top: getMapPosition({ 
                      position: { 
                        x: userLocation.x, 
                        y: 0, 
                        z: userLocation.y 
                      } 
                    } as any).top,
                    left: getMapPosition({ 
                      position: { 
                        x: userLocation.x, 
                        y: 0, 
                        z: userLocation.y 
                      } 
                    } as any).left,
                  }}
                >
                  <Box
                    sx={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'white',
                      clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                      transform: 'translateY(-2px)',
                    }}
                  />
                </YouAreHereMarker>
              )}
              
              {/* Store hotspots */}
              {storesOnFloor.map(store => {
                const position = getMapPosition(store);
                const config = storeTypeConfig[store.category as keyof typeof storeTypeConfig] || storeTypeConfig.default;
                
                return (
                  <StoreTooltip
                    key={`store-${store.id}`}
                    title={
                      <Box>
                        <Typography variant="subtitle2">{store.name}</Typography>
                        <Typography variant="body2">Category: {store.category}</Typography>
                        {store.rating && (
                          <Typography variant="body2">Rating: {store.rating}⭐</Typography>
                        )}
                      </Box>
                    }
                    arrow
                    TransitionComponent={Zoom}
                    placement="top"
                  >
                    <MapHotspot
                      onClick={() => handleItemClick(store, 'store')}
                      sx={{
                        top: position.top,
                        left: position.left,
                        width: config.size,
                        height: config.size,
                        backgroundColor: `${config.color}30`,
                        border: `2px solid ${config.color}`,
                      }}
                    />
                  </StoreTooltip>
                );
              })}
              
              {/* Facility hotspots */}
              {facilitiesOnFloor.map(facility => {
                const position = getMapPosition(facility);
                const config = facilityTypeConfig[facility.type as keyof typeof facilityTypeConfig] || facilityTypeConfig.default;
                
                return (
                  <StoreTooltip
                    key={`facility-${facility.id}`}
                    title={
                      <Box>
                        <Typography variant="subtitle2">{facility.name}</Typography>
                        <Typography variant="body2">Type: {facility.type}</Typography>
                      </Box>
                    }
                    arrow
                    TransitionComponent={Zoom}
                    placement="top"
                  >
                    <FacilityHotspot
                      onClick={() => handleItemClick(facility, 'facility')}
                      sx={{
                        top: position.top,
                        left: position.left,
                        width: config.size,
                        height: config.size,
                        backgroundColor: `${config.color}30`,
                        border: `2px solid ${config.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {config.symbol}
                    </FacilityHotspot>
                  </StoreTooltip>
                );
              })}
            </MarkersContainer>
          </FloorImageContainer>
          
          {/* Floor navigation */}
          <FloorNavigation>
            <NavigationButton 
              variant="contained" 
              color="primary" 
              onClick={() => handleFloorChange('up')}
              disabled={currentFloor >= 3}
            >
              ↑
            </NavigationButton>
            <Box sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              {currentFloor}
            </Box>
            <NavigationButton 
              variant="contained" 
              color="primary" 
              onClick={() => handleFloorChange('down')}
              disabled={currentFloor <= 1}
            >
              ↓
            </NavigationButton>
          </FloorNavigation>
          
          {/* Details popup when item is selected */}
          {selectedItem && showDetails && (
            <DetailsBox>
              <Typography variant="h6">{selectedItem.name}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {selectedItem.description}
              </Typography>
              
              {'category' in selectedItem && (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Category: {selectedItem.category}
                </Typography>
              )}
              
              {'type' in selectedItem && (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Type: {selectedItem.type}
                </Typography>
              )}
              
              {'openingHours' in selectedItem && (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Opening Hours: {selectedItem.openingHours}
                </Typography>
              )}
              
              {'rating' in selectedItem && selectedItem.rating && (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Rating: {selectedItem.rating} ⭐
                </Typography>
              )}
              
              {'phone' in selectedItem && selectedItem.phone && (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Phone: {selectedItem.phone}
                </Typography>
              )}
              
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 2 }}
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </DetailsBox>
          )}
        </MapBorder>
      </FloorMap>
    </MapContainer>
  );
};

export default MallMap; 