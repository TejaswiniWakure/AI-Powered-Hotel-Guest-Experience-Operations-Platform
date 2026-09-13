import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      const hotelId = localStorage.getItem('stayflow_hotelId');
      const userId = localStorage.getItem('stayflow_userId');
      if (hotelId) socket.emit('join_hotel', hotelId);
      if (userId) socket.emit('join_user', userId);
    });
  }
  return socket;
};

export const subscribeToHotel = (hotelId) => {
  const s = getSocket();
  if (s && hotelId) {
    s.emit('join_hotel', hotelId);
  }
};
