// In socketService.js (handle user join)
let onlineUsers = {};

const userJoined = (socket, userId, callback) => {
  onlineUsers[userId] = socket.id;
  console.log(`User ${userId} joined`);
  // Optionally, call a callback for undelivered messages if any
  callback(userId); 
};

const userDisconnected = (socket) => {
  const userId = Object.keys(onlineUsers).find(user => onlineUsers[user] === socket.id);
  if (userId) {
    delete onlineUsers[userId];
    console.log(`User ${userId} disconnected`);
  }
};

const emitMessage = (userId, message) => {
  const socketId = onlineUsers[userId];
  if (socketId) {
    io.to(socketId).emit('new_message', message);
  } else {
    console.log(`User ${userId} is offline, message not delivered`);
  }
};

module.exports = { userJoined, userDisconnected, emitMessage };
