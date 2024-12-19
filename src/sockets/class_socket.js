export default function init(io) {
  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    socket.on('subscribeToClass', (classId) => {
      console.log(`Client subscribed to class ${classId}`);
      socket.join(`class-${classId}`); // Add client to a room for the class
    });

    socket.on('unsubscribeFromClass', (classId) => {
      console.log(`Client unsubscribed from class ${classId}`);
      socket.leave(`class-${classId}`); // Remove client from the class room
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
