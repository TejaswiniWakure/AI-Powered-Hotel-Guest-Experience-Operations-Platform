let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;
  
  io.on('connection', (socket) => {
    // Client joins hotel room for tenant-scoped events
    socket.on('join_hotel', (hotelId) => {
      if (hotelId) {
        socket.join(`hotel_${hotelId}`);
      }
    });

    // Client joins user specific room
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });
};

const emitHotelEvent = (hotelId, event, data) => {
  if (ioInstance && hotelId) {
    ioInstance.to(`hotel_${hotelId}`).emit(event, data);
    // Also broadcast globally so active dashboards update smoothly
    ioInstance.emit(event, data);
  }
};

const emitUserEvent = (userId, event, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId}`).emit(event, data);
  }
};

module.exports = { initSocket, emitHotelEvent, emitUserEvent };
