import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Header from './components/Header';
import StoreDetail from './components/StoreDetail';
import NotFound from './components/NotFound';
import FloorSelector from './components/FloorSelector';
import MallMap from './components/MallMap';
import SearchPanel from './components/SearchPanel';
import StoreDetails from './components/StoreDetails';

// Data
import { mockStores, mockFacilities } from './data/mockData';

// Types
import { Store, Facility, Floor } from './types';

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

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [currentFloorLevel, setCurrentFloorLevel] = useState<number>(1);
  const [userLocation, setUserLocation] = useState<{ x: number; y: number; z: number } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Store | Facility | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Use system preference for dark/light mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Check if device is mobile/touch
  const isMobile = useMediaQuery('(max-width:768px)');
  
  const theme = React.useMemo(
    () => createAppTheme(prefersDarkMode),
    [prefersDarkMode]
  );

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, this would fetch from an API
        // For now, use mock data
        setStores(mockStores);
        setFacilities(mockFacilities);

        // Create floors data
        const floorLevels = [1, 2, 3];
        const floorsData: Floor[] = floorLevels.map(level => {
          const floorStores = mockStores.filter(store => store.floor === level);
          const floorFacilities = mockFacilities.filter(facility => facility.floor === level);
          
          return {
            id: `floor-${level}`,
            name: `Floor ${level}`,
            level,
            stores: floorStores.map(store => store.id),
            facilities: floorFacilities.map(facility => facility.id),
            mapImage: `/images/floor-${level}.svg`
          };
        });
        
        setFloors(floorsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const currentFloor = floors.find(floor => floor.level === currentFloorLevel) || {
    id: 'default',
    name: 'Default Floor',
    level: 1,
    stores: [],
    facilities: [],
    mapImage: '/images/default-floor.svg'
  };
  const storesOnCurrentFloor = stores.filter(store => store.floor === currentFloorLevel);
  const facilitiesOnCurrentFloor = facilities.filter(facility => facility.floor === currentFloorLevel);

  const handleFloorChange = (level: number) => {
    setCurrentFloorLevel(level);
  };

  const handleUserLocationChange = (location: { x: number; y: number; z: number }) => {
    setUserLocation(location);
    
    // Determine floor based on z coordinate
    const floorLevel = Math.floor(location.z) + 1;
    if (floorLevel >= 1 && floorLevel <= 3) {
      setCurrentFloorLevel(floorLevel);
    }
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedItem(store);
    setCurrentFloorLevel(store.floor);
    if (isMobile) setDrawerOpen(false);
  };

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedItem(facility);
    setCurrentFloorLevel(facility.floor);
    if (isMobile) setDrawerOpen(false);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Box>
                    <FloorSelector 
                      floors={floors} 
                      currentFloor={currentFloorLevel} 
                      onChange={handleFloorChange} 
                    />
                    <MallMap 
                      currentFloor={currentFloor}
                      stores={storesOnCurrentFloor}
                      facilities={facilitiesOnCurrentFloor}
                      userLocation={userLocation}
                      setUserLocation={handleUserLocationChange}
                    />
                  </Box>
                } 
              />
              <Route path="/store/:id" element={<StoreDetail stores={stores} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 