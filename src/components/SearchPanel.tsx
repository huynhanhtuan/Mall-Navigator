import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WcIcon from '@mui/icons-material/Wc';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ElevatorIcon from '@mui/icons-material/Elevator';
import InfoIcon from '@mui/icons-material/Info';

// Types
import { Store, Facility } from '../types';

interface SearchPanelProps {
  stores: Store[];
  facilities: Facility[];
  onStoreSelect: (store: Store) => void;
  onFacilitySelect: (facility: Facility) => void;
}

const SearchContainer = styled(Box)(({ theme }) => ({
  width: 320,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    margin: 0,
    borderRadius: 0,
  },
}));

const SearchHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    height: 56,
    '& fieldset': {
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
    fontSize: '1.1rem',
  },
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  height: 36,
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  '&.MuiChip-outlined': {
    borderWidth: 2,
  },
}));

const ResultsContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(1, 0),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 48,
  height: 48,
}));

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'restaurant':
      return <RestaurantIcon />;
    case 'cafe':
      return <LocalCafeIcon />;
    default:
      return <StorefrontIcon />;
  }
};

const getFacilityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'restroom':
      return <WcIcon />;
    case 'parking':
      return <LocalParkingIcon />;
    case 'elevator':
      return <ElevatorIcon />;
    default:
      return <InfoIcon />;
  }
};

const SearchPanel: React.FC<SearchPanelProps> = ({
  stores,
  facilities,
  onStoreSelect,
  onFacilitySelect,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState(0); // 0 = all, 1 = stores, 2 = facilities
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const allFloors = Array.from(new Set([...stores.map(s => s.floor), ...facilities.map(f => f.floor)])).sort();
  const allCategories = Array.from(new Set(stores.map(s => s.category))).sort();

  const toggleFloor = (floor: number) => {
    if (selectedFloors.includes(floor)) {
      setSelectedFloors(selectedFloors.filter(f => f !== floor));
    } else {
      setSelectedFloors([...selectedFloors, floor]);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = search === '' || 
      store.name.toLowerCase().includes(search.toLowerCase()) || 
      store.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesFloor = selectedFloors.length === 0 || selectedFloors.includes(store.floor);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(store.category);
    
    return matchesSearch && matchesFloor && matchesCategory;
  });

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = search === '' || 
      facility.name.toLowerCase().includes(search.toLowerCase()) || 
      facility.type.toLowerCase().includes(search.toLowerCase());
    
    const matchesFloor = selectedFloors.length === 0 || selectedFloors.includes(facility.floor);
    
    return matchesSearch && matchesFloor;
  });

  const activeFiltersCount = selectedFloors.length + selectedCategories.length;

  return (
    <SearchContainer>
      <SearchHeader>
        <Typography variant="h6" component="h2" gutterBottom>
          Find Stores & Facilities
        </Typography>
        <SearchField
          fullWidth
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleClearSearch} 
                  edge="end" 
                  aria-label="clear search"
                  size="large"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <IconButton 
            onClick={toggleFilters} 
            aria-label="filters"
            color={activeFiltersCount > 0 ? "primary" : "default"}
            size="large"
          >
            <Badge badgeContent={activeFiltersCount > 0 ? activeFiltersCount : 0} color="primary">
              <FilterListIcon />
            </Badge>
          </IconButton>
        </Box>
      </SearchHeader>

      {showFilters && (
        <FilterContainer>
          <Typography variant="subtitle1" fontWeight="bold">
            Filter by Floor
          </Typography>
          <ChipContainer>
            {allFloors.map((floor) => (
              <StyledChip
                key={`floor-${floor}`}
                label={`Floor ${floor}`}
                clickable
                color={selectedFloors.includes(floor) ? "primary" : "default"}
                variant={selectedFloors.includes(floor) ? "filled" : "outlined"}
                onClick={() => toggleFloor(floor)}
              />
            ))}
          </ChipContainer>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
            Filter by Category
          </Typography>
          <ChipContainer>
            {allCategories.map((category) => (
              <StyledChip
                key={`category-${category}`}
                label={category}
                clickable
                color={selectedCategories.includes(category) ? "primary" : "default"}
                variant={selectedCategories.includes(category) ? "filled" : "outlined"}
                onClick={() => toggleCategory(category)}
                icon={getCategoryIcon(category)}
              />
            ))}
          </ChipContainer>
        </FilterContainer>
      )}

      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="search tabs"
      >
        <Tab label="All" />
        <Tab label="Stores" />
        <Tab label="Facilities" />
      </Tabs>

      <ResultsContainer>
        <List disablePadding>
          {(selectedTab === 0 || selectedTab === 1) && filteredStores.map((store) => (
            <StyledListItem 
              key={`store-${store.id}`}
              onClick={() => onStoreSelect(store)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemAvatar>
                <StyledAvatar>
                  {getCategoryIcon(store.category)}
                </StyledAvatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    {store.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span" display="block">
                      {store.category}
                    </Typography>
                    <Chip
                      size="small"
                      label={`Floor ${store.floor}`}
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </>
                }
              />
            </StyledListItem>
          ))}

          {selectedTab === 0 && filteredStores.length > 0 && filteredFacilities.length > 0 && (
            <Divider variant="middle" sx={{ my: 1 }} />
          )}

          {(selectedTab === 0 || selectedTab === 2) && filteredFacilities.map((facility) => (
            <StyledListItem
              key={`facility-${facility.id}`}
              onClick={() => onFacilitySelect(facility)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemAvatar>
                <StyledAvatar>
                  {getFacilityIcon(facility.type)}
                </StyledAvatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    {facility.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span" display="block">
                      {facility.type}
                    </Typography>
                    <Chip
                      size="small"
                      label={`Floor ${facility.floor}`}
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </>
                }
              />
            </StyledListItem>
          ))}

          {((selectedTab === 0 && filteredStores.length === 0 && filteredFacilities.length === 0) ||
            (selectedTab === 1 && filteredStores.length === 0) ||
            (selectedTab === 2 && filteredFacilities.length === 0)) && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No results found.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search or filters.
              </Typography>
            </Box>
          )}
        </List>
      </ResultsContainer>
    </SearchContainer>
  );
};

export default SearchPanel; 