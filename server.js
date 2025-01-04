const express = require("express");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Define User and Message schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
});

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

// API Routes
app.post("/users", async (req, res) => {
  const { username, email } = req.body;
  const user = new User({ username, email });
  await user.save();
  res.status(201).send(user);
});

app.get("/users/:id/messages", async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.params.id }, { receiver: req.params.id }],
  }).sort({ timestamp: 1 });
  res.status(200).json(messages);
});

app.post("/messages", async (req, res) => {
  const { sender, receiver, text } = req.body;
  const message = new Message({ sender, receiver, text });
  await message.save();
  io.emit("new_message", message); // Emit message to all connected clients
  res.status(201).send(message);
});

// WebSocket Handling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
