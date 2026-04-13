import { ref, set, onValue, off } from 'firebase/database';
import { rtdb } from '../firebase';

export const updateLocation = (orderId: string, location: { lat: number; lng: number }) => {
  if (!rtdb) return;
  const locationRef = ref(rtdb, `locations/${orderId}`);
  set(locationRef, {
    ...location,
    timestamp: Date.now()
  });
};

export const onLocationUpdated = (orderId: string, callback: (location: { lat: number; lng: number }) => void) => {
  if (!rtdb) return () => {};
  const locationRef = ref(rtdb, `locations/${orderId}`);
  
  const unsubscribe = onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({ lat: data.lat, lng: data.lng });
    }
  });

  return () => {
    off(locationRef, 'value', unsubscribe);
  };
};

// Placeholder for backward compatibility if needed, but we should prefer the named exports
const socket = {
  emit: (event: string, data: any) => {
    console.warn(`Socket.io emit called for ${event}, but app is using Firebase RTDB.`);
  },
  on: (event: string, callback: any) => {
    console.warn(`Socket.io on called for ${event}, but app is using Firebase RTDB.`);
  },
  off: (event: string, callback: any) => {}
};

export default socket;
