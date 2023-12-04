import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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
  const [goalPosition, setGoalPosition] = useState<Position | null>(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false); // State to track if Google Maps script has loaded
  const googleMapsApiKey = 'AIzaSyCdtGPc2gg0Wh8UWRWDGDy8ChwLNyB5DnI'; // Replace with your API key

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
        setGoalPosition({ lat: newPos.lat + 0.01, lng: newPos.lng + 0.01 });
      },
      (error) => console.error('Error getting initial position', error),
      { enableHighAccuracy: true }
    );
  }, []);

  const ballIcon = isMapsLoaded
    ? {
        url: '/ball.png', // Replace with your ball icon URL
        scaledSize: new window.google.maps.Size(100, 100),
      }
    : undefined;

  const goalIcon = isMapsLoaded
    ? {
        url: '/goal.png', // Replace with your goal icon URL
        scaledSize: new window.google.maps.Size(200, 100),
      }
    : undefined;

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      onLoad={() => setIsMapsLoaded(true)} // Set state to true when script has loaded
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={15}
      >
        <Marker position={currentPosition} icon={ballIcon} />
        {goalPosition && <Marker position={goalPosition} icon={goalIcon} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
