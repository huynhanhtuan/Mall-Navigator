export interface Store {
  id: string;
  name: string;
  floor: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  category: string;
  description: string;
  openingHours: string;
  rating?: number;
  phone?: string;
}

export interface Facility {
  id: string;
  name: string;
  floor: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  type: 'elevator' | 'toilet' | 'parking' | 'entrance';
  description: string;
}

export interface Floor {
  id: string;
  name: string;
  level: number;
  stores: string[];
  facilities: string[];
  mapImage: string;
}

export interface Path {
  points: {
    x: number;
    y: number;
    z: number;
  }[];
  instructions: string[];
} 