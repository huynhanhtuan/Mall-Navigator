# Interactive Mall Map Application

A modern, interactive 3D mall map application built with React, Three.js, and Material-UI. This application provides an immersive experience for users to explore and navigate through a shopping mall, with features for finding stores, facilities, and getting directions.

## Features

- **Interactive 3D Visualization**: Explore the mall in 3D with smooth camera controls and transitions
- **Multi-floor Navigation**: Easily switch between different floors of the mall
- **Store and Facility Search**: Search for stores and facilities across all floors
- **Detailed Information**: View detailed information about selected stores and facilities
- **Interactive Markers**: Click on markers to view information and get directions
- **Responsive Design**: Works well on both desktop and mobile devices

## Technologies Used

- React
- TypeScript
- Three.js
- React Three Fiber
- Material-UI
- Framer Motion

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mall-map
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
mall-map/
├── src/
│   ├── components/
│   │   ├── MallMap.tsx       # 3D map visualization
│   │   ├── Navbar.tsx        # Navigation bar with floor selection
│   │   ├── SearchPanel.tsx   # Search interface for stores and facilities
│   │   └── StoreDetails.tsx  # Detailed information panel
│   ├── data/
│   │   └── mockData.ts       # Sample data for stores and facilities
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── App.tsx               # Main application component
├── public/
│   └── floor.glb             # 3D model for the mall floor
└── package.json
```

## Features in Detail

### 1. Interactive 3D Map
- Smooth camera controls for exploring the mall
- Interactive markers for stores and facilities
- Smooth transitions between floors
- Real-time updates of visible elements

### 2. Search and Navigation
- Search across all stores and facilities
- Filter results by floor
- Quick navigation to selected locations
- Detailed information display

### 3. Store and Facility Information
- Detailed store information including:
  - Opening hours
  - Category
  - Description
  - Location
- Facility information including:
  - Type (elevator, toilet, parking, etc.)
  - Location
  - Description

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 