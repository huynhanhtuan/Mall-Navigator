import { Store, Facility } from '../types';

export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Gogi House',
    floor: 1,
    position: { x: 5, y: 0, z: 3 },
    category: 'Restaurant',
    description: 'Korean BBQ restaurant with premium meat selection',
    openingHours: '10:00 - 22:00',
  },
  {
    id: '2',
    name: 'Dooki',
    floor: 1,
    position: { x: -3, y: 0, z: 2 },
    category: 'Fashion',
    description: 'Trendy clothing store for young adults',
    openingHours: '09:00 - 22:00',
  },
  {
    id: '3',
    name: 'KFC',
    floor: 2,
    position: { x: 2, y: 0, z: 4 },
    category: 'Fast Food',
    description: 'Popular fast food chain serving fried chicken',
    openingHours: '08:00 - 23:00',
  },
  {
    id: '4',
    name: 'Mothercare',
    floor: 3,
    position: { x: -4, y: 0, z: 1 },
    category: 'Baby Care',
    description: 'Specialized store for baby and maternity products',
    openingHours: '09:30 - 21:30',
  },
];

export const mockFacilities: Facility[] = [
  {
    id: 'f1',
    name: 'Elevator A',
    floor: 1,
    position: { x: 0, y: 0, z: 0 },
    type: 'elevator',
    description: 'Main elevator connecting all floors',
  },
  {
    id: 'f2',
    name: 'Women\'s Toilet',
    floor: 1,
    position: { x: 3, y: 0, z: -2 },
    type: 'toilet',
    description: 'Clean and spacious women\'s restroom',
  },
  {
    id: 'f3',
    name: 'Men\'s Toilet',
    floor: 1,
    position: { x: -3, y: 0, z: -2 },
    type: 'toilet',
    description: 'Clean and spacious men\'s restroom',
  },
  {
    id: 'f4',
    name: 'Main Entrance',
    floor: 1,
    position: { x: 0, y: 0, z: 5 },
    type: 'entrance',
    description: 'Main entrance to the mall',
  },
  {
    id: 'f5',
    name: 'Parking Level 1',
    floor: 0,
    position: { x: 0, y: -1, z: 0 },
    type: 'parking',
    description: 'Underground parking level 1',
  },
]; 