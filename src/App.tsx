import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Components
import Navbar from './components/Navbar';
import MallMap from './components/MallMap';
import SearchPanel from './components/SearchPanel';
import StoreDetails from './components/StoreDetails';

// Data
import { mockStores, mockFacilities } from './data/mockData';

// Types
import { Store, Facility } from './types';

const createAppTheme = (prefersDarkMode: boolean) => {
  let theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: prefersDarkMode ? '#121212' : '#f5f5f5',
        paper: prefersDarkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: prefersDarkMode ? '#ffffff' : '#212121',
        secondary: prefersDarkMode ? '#b0bec5' : '#757575',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 600,
      },
      button: {
        fontSize: '1rem',
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 5,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 48,
            padding: '12px 24px',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 12,
          },
          sizeSmall: {
            padding: 8,
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: 12,
            paddingBottom: 12,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            height: 36,
          },
        },
      },
      MuiTouchRipple: {
        styleOverrides: {
          root: {
            opacity: 0.8,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 56,
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: 16,
          },
        },
      },
    },
  });
  
  // Increase font sizes for better readability on touch devices
  theme = responsiveFontSizes(theme);
  
  return theme;
};

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  overflow: 'hidden',
}));

const MapContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  position: 'relative',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#e0e0e0',
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: 1200,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function App() {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Store | Facility | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userPosition, setUserPosition] = useState({ x: 10, y: 0, z: 85 });
  
  // Use system preference for dark/light mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Check if device is mobile/touch
  const isMobile = useMediaQuery('(max-width:768px)');
  
  const theme = React.useMemo(
    () => createAppTheme(prefersDarkMode),
    [prefersDarkMode]
  );

  const handleStoreSelect = (store: Store) => {
    setSelectedItem(store);
    setCurrentFloor(store.floor);
    if (isMobile) setDrawerOpen(false);
  };

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedItem(facility);
    setCurrentFloor(facility.floor);
    if (isMobile) setDrawerOpen(false);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const filteredStores = mockStores.filter(store => store.floor === currentFloor);
  const filteredFacilities = mockFacilities.filter(facility => facility.floor === currentFloor);

  // Calculate total floors
  const allFloors = Array.from(new Set([...mockStores.map(s => s.floor), ...mockFacilities.map(f => f.floor)]));
  const totalFloors = Math.max(...allFloors);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainContainer>
        <Navbar
          currentFloor={currentFloor}
          totalFloors={totalFloors}
          onFloorChange={setCurrentFloor}
        />
        <ContentContainer>
          {/* Mobile: Show SearchPanel in drawer */}
          {isMobile ? (
            <>
              <MenuButton
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer}
                size="large"
              >
                {drawerOpen ? <CloseIcon /> : <MenuIcon />}
              </MenuButton>
              
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                sx={{
                  '& .MuiDrawer-paper': {
                    width: '85%',
                    maxWidth: 360,
                    borderTopRightRadius: theme.shape.borderRadius,
                    borderBottomRightRadius: theme.shape.borderRadius,
                  },
                }}
              >
                <SearchPanel
                  stores={mockStores}
                  facilities={mockFacilities}
                  onStoreSelect={handleStoreSelect}
                  onFacilitySelect={handleFacilitySelect}
                />
              </Drawer>
            </>
          ) : (
            /* Desktop: Show SearchPanel inline */
            <SearchPanel
              stores={mockStores}
              facilities={mockFacilities}
              onStoreSelect={handleStoreSelect}
              onFacilitySelect={handleFacilitySelect}
            />
          )}
          
          <MapContainer>
            <MallMap
              currentFloor={currentFloor}
              stores={filteredStores}
              facilities={filteredFacilities}
              onStoreSelect={handleStoreSelect}
              onFacilitySelect={handleFacilitySelect}
              isTouchDevice={true}
              userPosition={userPosition}
            />
            <StoreDetails
              selectedItem={selectedItem}
              onClose={handleCloseDetails}
            />
          </MapContainer>
        </ContentContainer>
      </MainContainer>
    </ThemeProvider>
  );
}

export default App; 