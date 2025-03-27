import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tooltip from '@mui/material/Tooltip';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface NavbarProps {
  currentFloor: number;
  totalFloors: number;
  onFloorChange: (floor: number) => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'static',
  boxShadow: theme.shadows[2],
  zIndex: theme.zIndex.drawer + 1,
}));

const FloorButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  width: 56,
  height: 56,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const FloorIndicator = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 90,
  height: 56,
  margin: theme.spacing(0, 1.5),
  fontWeight: 'bold',
  fontSize: '1.25rem',
}));

const Navbar: React.FC<NavbarProps> = ({ currentFloor, totalFloors, onFloorChange }) => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const isSmallScreen = useMediaQuery('(max-width:480px)');

  const handleFloorUp = () => {
    if (currentFloor < totalFloors) {
      onFloorChange(currentFloor + 1);
    }
  };

  const handleFloorDown = () => {
    if (currentFloor > 1) {
      onFloorChange(currentFloor - 1);
    }
  };

  return (
    <StyledAppBar>
      <Toolbar sx={{ justifyContent: 'space-between', padding: (theme) => theme.spacing(1, 2) }}>
        <Typography 
          variant={isMobile ? 'h6' : 'h5'} 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {isSmallScreen ? 'Mall Map' : '3D Mall Navigator'}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexGrow: 1,
          justifyContent: 'center',
        }}>
          <Tooltip title="Go down one floor" arrow placement="bottom">
            <span>
              <FloorButton
                color="primary"
                aria-label="floor down"
                onClick={handleFloorDown}
                disabled={currentFloor <= 1}
                size="large"
              >
                <ArrowDownwardIcon fontSize="large" />
              </FloorButton>
            </span>
          </Tooltip>

          <FloorIndicator>
            F{currentFloor}
          </FloorIndicator>

          <Tooltip title="Go up one floor" arrow placement="bottom">
            <span>
              <FloorButton
                color="primary"
                aria-label="floor up"
                onClick={handleFloorUp}
                disabled={currentFloor >= totalFloors}
                size="large"
              >
                <ArrowUpwardIcon fontSize="large" />
              </FloorButton>
            </span>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex' }}>
          {!isSmallScreen && (
            <Tooltip title="Help" arrow>
              <IconButton
                color="inherit"
                aria-label="help"
                size="large"
                sx={{ marginLeft: 1 }}
              >
                <HelpIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="About" arrow>
            <IconButton
              color="inherit"
              aria-label="about"
              size="large"
              sx={{ marginLeft: 1 }}
            >
              <InfoIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 