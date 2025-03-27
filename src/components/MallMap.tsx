import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Store, Facility, Floor, Path } from '../types';

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
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
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
  },
  '& ol, & li': {
    color: theme.palette.text.primary,
  }
}));

// Position representing the current user location
const USER_POSITION = { x: 0, y: 0, z: 8 };

interface MallMapProps {
  currentFloor: number;
  stores: Store[];
  facilities: Facility[];
  onStoreSelect: (store: Store) => void;
  onFacilitySelect: (facility: Facility) => void;
  isTouchDevice?: boolean;
}

const MallMap: React.FC<MallMapProps> = ({
  currentFloor,
  stores,
  facilities,
  onStoreSelect,
  onFacilitySelect,
  isTouchDevice = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<Store | Facility | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const storeObjectsRef = useRef<THREE.Mesh[]>([]);
  const facilityObjectsRef = useRef<THREE.Mesh[]>([]);
  const pathRef = useRef<THREE.Line | null>(null);
  const userMarkerRef = useRef<THREE.Mesh | null>(null);

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.maxPolarAngle = Math.PI / 2;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 0.8);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    pointLight2.position.set(-10, 10, -10);
    scene.add(pointLight2);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create grid
    const gridHelper = new THREE.GridHelper(30, 30);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Create walls
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe0e0e0,
      transparent: true,
      opacity: 0.7
    });

    // Back wall
    const backWallGeometry = new THREE.BoxGeometry(30, 10, 1);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 5, -15);
    scene.add(backWall);

    // Front wall
    const frontWallGeometry = new THREE.BoxGeometry(30, 10, 1);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(0, 5, 15);
    scene.add(frontWall);

    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(1, 10, 30);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-15, 5, 0);
    scene.add(leftWall);

    // Right wall
    const rightWallGeometry = new THREE.BoxGeometry(1, 10, 30);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(15, 5, 0);
    scene.add(rightWall);

    // Create user marker (current position)
    const userGeometry = new THREE.ConeGeometry(0.5, 2, 32);
    const userMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const userMarker = new THREE.Mesh(userGeometry, userMaterial);
    userMarker.position.set(USER_POSITION.x, USER_POSITION.y + 1, USER_POSITION.z);
    userMarker.rotation.x = Math.PI;
    scene.add(userMarker);
    userMarkerRef.current = userMarker;

    // Add floor text
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#3f51b5';
      context.strokeStyle = '#ffffff';
      context.lineWidth = 6;
      context.font = 'Bold 100px Arial';
      context.textAlign = 'center';
      context.strokeText(`FLOOR ${currentFloor}`, 256, 130);
      context.fillText(`FLOOR ${currentFloor}`, 256, 130);
      
      const texture = new THREE.CanvasTexture(canvas);
      const floorTextMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      const floorTextGeometry = new THREE.PlaneGeometry(10, 5);
      const floorText = new THREE.Mesh(floorTextGeometry, floorTextMaterial);
      floorText.position.set(0, 0.5, 0);
      floorText.rotation.x = -Math.PI / 2;
      scene.add(floorText);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentFloor]);

  // Update store and facility markers when they change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove previous store objects
    storeObjectsRef.current.forEach(obj => sceneRef.current!.remove(obj));
    storeObjectsRef.current = [];

    // Create new store markers
    const storeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const storeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

    stores.forEach(store => {
      const storeMesh = new THREE.Mesh(storeGeometry, storeMaterial);
      storeMesh.position.set(store.position.x, store.position.y + 0.75, store.position.z);
      storeMesh.userData = { type: 'store', id: store.id };
      
      // Create store label
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#000000';
        context.strokeStyle = '#ffffff';
        context.lineWidth = 4;
        context.font = 'Bold 24px Arial';
        context.textAlign = 'center';
        context.strokeText(store.name, 128, 64);
        context.fillText(store.name, 128, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const labelGeometry = new THREE.PlaneGeometry(3, 1.5);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, 2.5, 0);
        storeMesh.add(label);
      }
      
      sceneRef.current!.add(storeMesh);
      storeObjectsRef.current.push(storeMesh);
    });
  }, [stores]);

  // Update facility markers
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove previous facility objects
    facilityObjectsRef.current.forEach(obj => sceneRef.current!.remove(obj));
    facilityObjectsRef.current = [];

    // Create new facility markers
    const facilityGeometry = new THREE.CylinderGeometry(0.75, 0.75, 1.5, 32);

    facilities.forEach(facility => {
      let facilityMaterial;
      
      // Use different colors for different facility types
      switch(facility.type) {
        case 'elevator':
          facilityMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
          break;
        case 'toilet':
          facilityMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
          break;
        case 'parking':
          facilityMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
          break;
        case 'entrance':
          facilityMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
          break;
        default:
          facilityMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
      }
      
      const facilityMesh = new THREE.Mesh(facilityGeometry, facilityMaterial);
      facilityMesh.position.set(facility.position.x, facility.position.y + 0.75, facility.position.z);
      facilityMesh.userData = { type: 'facility', id: facility.id };
      
      // Create facility label
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#000000';
        context.strokeStyle = '#ffffff';
        context.lineWidth = 4;
        context.font = 'Bold 20px Arial';
        context.textAlign = 'center';
        context.strokeText(facility.name, 128, 64);
        context.fillText(facility.name, 128, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const labelGeometry = new THREE.PlaneGeometry(3, 1.5);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, 2.5, 0);
        facilityMesh.add(label);
      }
      
      sceneRef.current!.add(facilityMesh);
      facilityObjectsRef.current.push(facilityMesh);
    });
  }, [facilities]);

  // Function to find path from user position to destination
  const findPath = (destination: { x: number, y: number, z: number }): Path => {
    // In a real app, this would use A* pathfinding or similar algorithm
    // For simplicity, we'll just create a direct path with a midpoint
    const midPoint = {
      x: (USER_POSITION.x + destination.x) / 2,
      y: 0,
      z: (USER_POSITION.z + destination.z) / 2
    };
    
    return {
      points: [
        { x: USER_POSITION.x, y: 0, z: USER_POSITION.z },
        { x: midPoint.x, y: 0, z: midPoint.z },
        { x: destination.x, y: 0, z: destination.z }
      ],
      instructions: [
        `Start at your current position`,
        `Move ${Math.round(Math.sqrt(
          Math.pow(midPoint.x - USER_POSITION.x, 2) + 
          Math.pow(midPoint.z - USER_POSITION.z, 2)
        ))} meters ${midPoint.x > USER_POSITION.x ? 'east' : 'west'}`,
        `Turn ${midPoint.z > destination.z ? 'north' : 'south'} and move ${Math.round(Math.sqrt(
          Math.pow(destination.x - midPoint.x, 2) + 
          Math.pow(destination.z - midPoint.z, 2)
        ))} meters to reach your destination`
      ]
    };
  };

  // Show path when an item is selected
  useEffect(() => {
    if (!sceneRef.current || !selectedItem) return;

    // Remove existing path
    if (pathRef.current) {
      sceneRef.current.remove(pathRef.current);
      pathRef.current = null;
    }

    // Calculate path
    const path = findPath(selectedItem.position);
    
    // Create path line
    const points = path.points.map(p => new THREE.Vector3(p.x, p.y + 0.1, p.z));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 4 });
    const line = new THREE.Line(geometry, material);
    
    sceneRef.current.add(line);
    pathRef.current = line;

    return () => {
      if (pathRef.current && sceneRef.current) {
        sceneRef.current.remove(pathRef.current);
        pathRef.current = null;
      }
    };
  }, [selectedItem]);

  // Handle click events
  useEffect(() => {
    if (!mountRef.current || !sceneRef.current || !cameraRef.current) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, cameraRef.current!);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(sceneRef.current!.children, true);

      if (intersects.length > 0) {
        let selectedObject = intersects[0].object;
        
        // If we clicked on a label, find the parent (store or facility)
        while (selectedObject.parent && !selectedObject.userData?.type) {
          selectedObject = selectedObject.parent;
        }
        
        const userData = selectedObject.userData;

        if (userData && userData.type) {
          if (userData.type === 'store') {
            const store = stores.find(s => s.id === userData.id);
            if (store) {
              setSelectedItem(store);
              onStoreSelect(store);
            }
          } else if (userData.type === 'facility') {
            const facility = facilities.find(f => f.id === userData.id);
            if (facility) {
              setSelectedItem(facility);
              onFacilitySelect(facility);
            }
          }
        }
      }
    };

    mountRef.current.addEventListener('click', handleClick);

    return () => {
      mountRef.current?.removeEventListener('click', handleClick);
    };
  }, [stores, facilities, onStoreSelect, onFacilitySelect]);

  return (
    <MapContainer>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {selectedItem && (
        <DetailsBox>
          <Typography variant="h6">{selectedItem.name}</Typography>
          <Typography variant="body2">{selectedItem.description}</Typography>
          {selectedItem && pathRef.current && (
            <Box mt={2}>
              <Typography variant="subtitle2">Directions:</Typography>
              <ol style={{ paddingLeft: '20px', margin: 0 }}>
                {findPath(selectedItem.position).instructions.map((instruction, idx) => (
                  <li key={idx}><Typography variant="body2">{instruction}</Typography></li>
                ))}
              </ol>
            </Box>
          )}
        </DetailsBox>
      )}
    </MapContainer>
  );
};

export default MallMap; 