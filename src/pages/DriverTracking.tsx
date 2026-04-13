import React, { useState, useEffect, useRef } from 'react';
import { updateLocation } from '../services/socketService';

export default function DriverTracking() {
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const watchId = useRef<number | null>(null);

  const startTracking = () => {
    if (!orderId) return;
    setIsTracking(true);

    if (navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          updateLocation(orderId, newLocation);
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const stopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }
    setIsTracking(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">تتبع السائق</h1>
      {!isTracking ? (
        <div className="flex gap-2">
          <input 
            type="text" 
            value={orderId} 
            onChange={(e) => setOrderId(e.target.value)} 
            placeholder="أدخل رقم الطلب"
            className="border p-2 rounded"
          />
          <button onClick={startTracking} className="bg-blue-500 text-white p-2 rounded">بدء التتبع</button>
        </div>
      ) : (
        <div>
          <p>جاري التتبع للطلب: {orderId}</p>
          {location && <p>الموقع: {location.lat}, {location.lng}</p>}
          <button onClick={stopTracking} className="bg-red-500 text-white p-2 rounded mt-4">إيقاف التتبع</button>
        </div>
      )}
    </div>
  );
}
