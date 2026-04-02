import { io, Socket } from 'socket.io-client';

const socket: Socket = io('/', {
  transports: ['websocket'],
});

export const joinOrderRoom = (orderId: string) => {
  socket.emit('join-order', orderId);
};

export const updateLocation = (orderId: string, location: { lat: number; lng: number }) => {
  socket.emit('update-location', { orderId, location });
};

export const onLocationUpdated = (callback: (location: { lat: number; lng: number }) => void) => {
  socket.on('location-updated', callback);
  return () => {
    socket.off('location-updated', callback);
  };
};

export default socket;
