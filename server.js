const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const { userJoined, userDisconnected, emitMessage } = require('./services/socketService'); // Importing socket services

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);

// WebSocket events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining
  socket.on('user_joined', async (userId) => {
    console.log(`User ${userId} joined`);
    // Call userJoined to store the user in the online users list
    userJoined(socket, userId, deliverUndeliveredMessages);
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    userDisconnected(socket);  // Clean up the user from the online users list
  });
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
