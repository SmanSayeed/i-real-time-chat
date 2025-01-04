let usersOnline = {};  // Store connected users by user ID and socket ID

// Handle new user joining (i.e., user logging in)
const userJoined = (socket, userId, deliverUndeliveredMessages) => {
  usersOnline[userId] = socket.id;
  console.log(`User ${userId} joined`);
  deliverUndeliveredMessages(userId);
};

// Handle user disconnecting
const userDisconnected = (socket) => {
  for (const [userId, socketId] of Object.entries(usersOnline)) {
    if (socketId === socket.id) {
      delete usersOnline[userId];
      console.log(`User ${userId} disconnected`);
    }
  }
};

// Emit new message to a specific user
const emitMessage = (userId, message) => {
  if (usersOnline[userId]) {
    io.to(usersOnline[userId]).emit('new_message', message);  // Emit to the user's socket
  } else {
    // Store undelivered message in the database (assumes `message.save()` is available)
    message.delivered = false;
    message.save();  // Save message as undelivered if the user is offline
  }
};

module.exports = { userJoined, userDisconnected, emitMessage };
