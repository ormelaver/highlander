import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import ballIcon from '../assets/ball.png';
import goalIcon from '../assets/goal.png';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const initialCenter = {
  lat: -34.397, // Default center
  lng: 150.644,
};

type Position = {
  lat: number;
  lng: number;
};

const MapComponent: React.FC = () => {
  const [currentPosition, setCurrentPosition] =
    useState<Position>(initialCenter);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [goalPosition, setGoalPosition] = useState<Position>(initialCenter);
  const googleMapsApiKey = 'AIzaSyCdtGPc2gg0Wh8UWRWDGDy8ChwLNyB5DnI';
  const [positionAquaired, setPositionAquaired] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos: Position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentPosition(newPos);
        setGoalPosition({ lat: newPos.lat + 0.1, lng: newPos.lng + 0.1 });
        setPositionAquaired(true);
      },
      (error) => console.error('Error getting initial position', error),
      { enableHighAccuracy: true }
    );

    const newWs = new WebSocket('ws://localhost:8080');
    newWs.onopen = () => {
      console.log('WebSocket connection established');
      if (currentPosition) {
        newWs.send(
          JSON.stringify({ type: 'updatePosition', position: currentPosition })
        );
      }
    };
    newWs.onmessage = (event) => {
      // pop an alert when isWithinGoalRadius returns true
    };
    setWs(newWs);

    return () => {
      if (newWs) newWs.close();
    };
  }, []);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={14}
      >
        {positionAquaired && (
          <>
            <Marker position={currentPosition} icon={ballIcon} />
            <Marker position={goalPosition} icon={goalIcon} />
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
