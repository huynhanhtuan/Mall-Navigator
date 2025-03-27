import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  SwipeableDrawer,
  Slide,
  useMediaQuery,
  Avatar,
  Chip,
  Card,
  CardContent,
  Rating,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import StoreIcon from '@mui/icons-material/Store';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import ElevatorIcon from '@mui/icons-material/Elevator';
import WcIcon from '@mui/icons-material/Wc';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import InfoIcon from '@mui/icons-material/Info';
import DirectionsIcon from '@mui/icons-material/Directions';
import ForwardIcon from '@mui/icons-material/Forward';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Store, Facility } from '../types';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DetailsContainer = styled(Card)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  width: 350,
  maxWidth: '100%',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const MobileDetailsContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'auto',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 48,
  height: 48,
}));

const DirectionsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#f0f7ff',
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const DirectionsTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
}));

const StyledStepContent = styled(StepContent)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  height: 36,
  borderRadius: theme.shape.borderRadius,
  fontWeight: 'bold',
  margin: theme.spacing(0, 0.5, 0.5, 0),
}));

// User's current position
const USER_POSITION = { x: 0, y: 0, z: 8 };

interface StoreDetailsProps {
  selectedItem: Store | Facility | null;
  onClose: () => void;
}

interface Direction {
  instruction: string;
  icon: React.ReactNode;
  details: string;
  distance: number;
}

// Add styling for the map popup
const MapTooltip = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  maxWidth: 300,
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
  },
  '& ol, & li': {
    color: theme.palette.text.primary,
  }
}));

const StoreDetails: React.FC<StoreDetailsProps> = ({ selectedItem, onClose }) => {
  const [openDirectionsDialog, setOpenDirectionsDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setIsOpen(!!selectedItem);
  }, [selectedItem]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  if (!selectedItem) return null;

  const isStore = 'category' in selectedItem;
  
  const getFacilityIcon = (type: Facility['type']) => {
    switch (type) {
      case 'elevator':
        return <ElevatorIcon fontSize="large" />;
      case 'toilet':
        return <WcIcon fontSize="large" />;
      case 'parking':
        return <LocalParkingIcon fontSize="large" />;
      case 'entrance':
        return <MeetingRoomIcon fontSize="large" />;
      default:
        return <InfoIcon fontSize="large" />;
    }
  };
  
  const getStoreIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'restaurant':
        return <RestaurantIcon fontSize="large" />;
      case 'fashion':
        return <ShoppingBagIcon fontSize="large" />;
      default:
        return <StoreIcon fontSize="large" />;
    }
  };

  // Get estimated time to reach the destination
  // Assuming walking speed is 1.4 meters per second (5 km/h)
  const getEstimatedTime = () => {
    // Simplified calculation: Euclidean distance
    const userPos = USER_POSITION;
    const distance = Math.sqrt(
      Math.pow(userPos.x - selectedItem.position.x, 2) + 
      Math.pow(userPos.z - selectedItem.position.z, 2)
    );
    
    // Calculate time in seconds, then convert to minutes
    const timeInSeconds = distance / 1.4;
    const minutes = Math.ceil(timeInSeconds / 60);
    
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  };

  // Generate detailed directions
  const getDetailedDirections = (): Direction[] => {
    const destination = selectedItem.position;
    const directions: Direction[] = [];
    
    // First step - starting point
    directions.push({
      instruction: "Start from your current position",
      icon: <LocationOnIcon color="success" />,
      details: "You are at the main entrance of the mall",
      distance: 0
    });
    
    // Determine if we need to change floors
    if (selectedItem.floor !== 1) { // Assuming current floor is 1
      directions.push({
        instruction: `Take the elevator to floor ${selectedItem.floor}`,
        icon: <ElevatorIcon color="primary" />,
        details: "The nearest elevator is located at the center of the mall",
        distance: 5
      });
    }
    
    // Determine direction (simplified)
    const dx = destination.x - USER_POSITION.x;
    const dz = destination.z - USER_POSITION.z;
    
    // East-West direction
    if (Math.abs(dx) > 2) {
      const direction = dx > 0 ? "right" : "left";
      const icon = dx > 0 ? <TurnRightIcon color="primary" /> : <TurnLeftIcon color="primary" />;
      directions.push({
        instruction: `Turn ${direction} and walk straight`,
        icon: icon,
        details: `Walk ${Math.abs(Math.round(dx))} meters ${dx > 0 ? 'east' : 'west'}`,
        distance: Math.abs(Math.round(dx))
      });
    }
    
    // North-South direction
    if (Math.abs(dz) > 2) {
      const direction = dz < 0 ? "forward" : "right";
      const icon = dz < 0 ? <ForwardIcon color="primary" /> : <TurnRightIcon color="primary" />;
      directions.push({
        instruction: `Go ${direction} toward ${isStore ? selectedItem.name : selectedItem.type}`,
        icon: icon,
        details: `Walk ${Math.abs(Math.round(dz))} meters ${dz < 0 ? 'north' : 'south'}`,
        distance: Math.abs(Math.round(dz))
      });
    }
    
    // Final step - arrival
    directions.push({
      instruction: `Arrive at ${selectedItem.name}`,
      icon: isStore ? getStoreIcon((selectedItem as Store).category) : getFacilityIcon((selectedItem as Facility).type),
      details: `${isStore ? (selectedItem as Store).category : (selectedItem as Facility).type} - ${selectedItem.description}`,
      distance: 0
    });
    
    return directions;
  };

  // Calculate total distance
  const getTotalDistance = () => {
    const directions = getDetailedDirections();
    return directions.reduce((total, dir) => total + dir.distance, 0);
  };

  const handleOpenDirectionsDialog = () => {
    setOpenDirectionsDialog(true);
  };

  const handleCloseDirectionsDialog = () => {
    setOpenDirectionsDialog(false);
  };
  
  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  const detailsContent = (
    <>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
          {isStore ? (
            <StyledChip 
              label={(selectedItem as Store).category} 
              color="primary" 
              variant="outlined" 
              icon={<CategoryIcon />}
            />
          ) : (
            <StyledChip 
              label={(selectedItem as Facility).type} 
              color="primary" 
              variant="outlined" 
              icon={<InfoIcon />}
            />
          )}
          <StyledChip 
            label={`Floor ${selectedItem.floor}`} 
            color="secondary" 
            variant="outlined" 
            icon={<LocationOnIcon />}
          />
          
          {isStore && (selectedItem as Store).rating && (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Rating 
                value={(selectedItem as Store).rating} 
                precision={0.5} 
                readOnly 
                size={isSmallScreen ? "small" : "medium"}
              />
            </Box>
          )}
        </Box>

        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          {selectedItem.description}
        </Typography>

        <List sx={{ py: 0 }}>
          {isStore && (selectedItem as Store).openingHours && (
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Opening Hours"
                secondary={(selectedItem as Store).openingHours}
              />
            </ListItem>
          )}

          {isStore && (selectedItem as Store).phone && (
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Phone"
                secondary={(selectedItem as Store).phone}
              />
            </ListItem>
          )}
        </List>
      </Box>

      <Divider />
      
      <DirectionsContainer>
        <DirectionsTitle>
          <DirectionsIcon color="primary" fontSize="medium" />
          <Typography variant="h6" fontWeight="bold">
            Directions
          </Typography>
        </DirectionsTitle>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body1">
            Distance: <strong>{getTotalDistance()} m</strong>
          </Typography>
          <Typography variant="body1">
            Time: <strong>{getEstimatedTime()}</strong>
          </Typography>
        </Box>
        
        <ol style={{ paddingLeft: '20px', margin: 0 }}>
          <li>
            <Typography variant="body2" gutterBottom>
              Start from current position
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Follow the highlighted path
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              {isStore 
                ? `Arrive at ${selectedItem.name}`
                : `Arrive at ${selectedItem.name}`}
            </Typography>
          </li>
        </ol>
        
        <ActionButton 
          variant="contained" 
          startIcon={<DirectionsIcon />}
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleOpenDirectionsDialog}
          size="large"
        >
          Show Detailed Directions
        </ActionButton>
      </DirectionsContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <IconButton onClick={toggleFavorite} aria-label="add to favorites" size="large">
          {favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton aria-label="share" size="large">
          <ShareIcon />
        </IconButton>
      </Box>
    </>
  );

  return (
    <>
      {isMobile ? (
        <SwipeableDrawer
          anchor="bottom"
          open={isOpen}
          onClose={handleClose}
          onOpen={() => setIsOpen(true)}
          disableSwipeToOpen
          swipeAreaWidth={56}
          PaperProps={{
            sx: {
              borderTopLeftRadius: theme.shape.borderRadius,
              borderTopRightRadius: theme.shape.borderRadius,
              maxHeight: '85vh',
            },
          }}
        >
          <MobileDetailsContainer>
            <Header>
              <HeaderContent>
                <StyledAvatar>
                  {isStore 
                    ? getStoreIcon((selectedItem as Store).category)
                    : getFacilityIcon((selectedItem as Facility).type)
                  }
                </StyledAvatar>
                <Typography variant="h6" fontWeight="bold">
                  {selectedItem.name}
                </Typography>
              </HeaderContent>
              <IconButton 
                onClick={handleClose} 
                size="large"
                sx={{ 
                  bgcolor: theme.palette.background.paper,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Header>
            {detailsContent}
          </MobileDetailsContainer>
        </SwipeableDrawer>
      ) : (
        <DetailsContainer>
          <Header>
            <HeaderContent>
              <StyledAvatar>
                {isStore 
                  ? getStoreIcon((selectedItem as Store).category)
                  : getFacilityIcon((selectedItem as Facility).type)
                }
              </StyledAvatar>
              <Typography variant="h6" fontWeight="bold">
                {selectedItem.name}
              </Typography>
            </HeaderContent>
            <IconButton 
              onClick={onClose} 
              size="large"
              sx={{ 
                bgcolor: theme.palette.background.paper,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Header>
          {detailsContent}
        </DetailsContainer>
      )}

      {/* Detailed Directions Dialog */}
      <Dialog
        open={openDirectionsDialog}
        onClose={handleCloseDirectionsDialog}
        fullWidth
        maxWidth="sm"
        fullScreen={isSmallScreen}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: isSmallScreen ? 0 : theme.shape.borderRadius,
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            p: theme.spacing(2, 3),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsIcon />
              <Typography variant="h6">Route to {selectedItem.name}</Typography>
            </Box>
            <IconButton 
              size="large" 
              onClick={handleCloseDirectionsDialog} 
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Route Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">
                Total Distance: <strong>{getTotalDistance()} meters</strong>
              </Typography>
              <Typography variant="body1">
                Estimated Time: <strong>{getEstimatedTime()}</strong>
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Step-by-Step Directions
          </Typography>
          <Stepper orientation="vertical" sx={{ mb: 2 }}>
            {getDetailedDirections().map((direction, index) => (
              <Step key={index} active={true} completed={true}>
                <StepLabel StepIconComponent={() => 
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {direction.icon}
                  </Avatar>
                }>
                  <Typography variant="body1" fontWeight="bold">
                    {direction.instruction}
                  </Typography>
                </StepLabel>
                <StyledStepContent>
                  <Typography variant="body2">{direction.details}</Typography>
                  {direction.distance > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Distance: {direction.distance} m
                    </Typography>
                  )}
                </StyledStepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
        <DialogActions sx={{ p: theme.spacing(2, 3) }}>
          <Button 
            onClick={handleCloseDirectionsDialog}
            size="large"
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCloseDirectionsDialog}
            size="large"
          >
            Show on Map
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreDetails; 