import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { onLocationUpdated } from '../services/socketService';

// Fix for default leaflet marker icon
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface OrderTrackingMapProps {
  orderId: string;
  initialLocation?: { lat: number; lng: number };
}

const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({ orderId, initialLocation }) => {
  const [location, setLocation] = useState(initialLocation || { lat: 30.7917, lng: 30.9996 }); // Default to Tanta

  useEffect(() => {
    const unsubscribe = onLocationUpdated((newLocation) => {
      setLocation(newLocation);
    });
    return unsubscribe;
  }, [orderId]);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
      <MapContainer center={[location.lat, location.lng]} zoom={15} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>موقع السائق</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default OrderTrackingMap;
