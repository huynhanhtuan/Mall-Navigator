import { Store, Facility } from '../types';

export const mockStores: Store[] = [
  {
    id: 'G2-39',
    name: 'MANWAH',
    category: 'Food',
    description: 'Restaurant',
    floor: 1,
    position: { x: 12, y: 0, z: 85 },
    openingHours: '10:00 - 22:00'
  },
  {
    id: 'G2-38',
    name: 'KICHI KICHI',
    category: 'Food',
    description: 'Restaurant',
    floor: 1,
    position: { x: 18, y: 0, z: 85 },
    openingHours: '10:00 - 22:00'
  },
  {
    id: 'G2-37',
    name: 'WAGOKORO',
    category: 'Food',
    description: 'Japanese Restaurant',
    floor: 1,
    position: { x: 24, y: 0, z: 85 },
    openingHours: '10:00 - 22:00'
  },
  {
    id: 'G2-25',
    name: 'HYPERMARKET',
    category: 'Shopping',
    description: 'Supermarket',
    floor: 1,
    position: { x: 85, y: 0, z: 45 },
    openingHours: '09:00 - 22:00'
  },
  {
    id: 'G2-11',
    name: 'GUARDIAN',
    category: 'Health & Beauty',
    description: 'Pharmacy and Beauty Store',
    floor: 1,
    position: { x: 35, y: 0, z: 30 },
    openingHours: '09:00 - 22:00'
  },
  {
    id: 'G2-K3',
    name: 'INNIO',
    category: 'Food',
    description: 'Restaurant',
    floor: 1,
    position: { x: 55, y: 0, z: 45 },
    openingHours: '10:00 - 22:00'
  },
  {
    id: 'G2-K4',
    name: 'HIMALAYA',
    category: 'Food',
    description: 'Restaurant',
    floor: 1,
    position: { x: 65, y: 0, z: 45 },
    openingHours: '10:00 - 22:00'
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
    id: 'F1',
    name: 'Elevator',
    type: 'elevator',
    description: 'Main elevator',
    floor: 1,
    position: { x: 50, y: 0, z: 50 }
  },
  {
    id: 'F2',
    name: 'Restroom',
    type: 'toilet',
    description: 'Public restroom',
    floor: 1,
    position: { x: 30, y: 0, z: 30 }
  },
  {
    id: 'F3',
    name: 'Escalator',
    type: 'elevator',
    description: 'Main escalator',
    floor: 1,
    position: { x: 45, y: 0, z: 40 }
  },
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