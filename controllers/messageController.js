const Message = require('../models/messageModel');
const User = require('../models/userModel');
const { emitMessage } = require('../services/socketService');  // Importing emitMessage service

// Send a message
const sendMessage = async (req, res) => {
  const { from_user_id, message, to_user_id } = req.body;

  // Validate users
  const sender = await User.findById(from_user_id);
  const receiver = await User.findById(to_user_id);

  if (!sender || !receiver) {
    return res.status(404).json({ message: 'Sender or Receiver not found' });
  }

  // Create new message and save it
  const newMessage = new Message({
    from_user_id,
    to_user_id,
    message,
  });

  await newMessage.save();

  // Emit the message to the receiver if they are online
  emitMessage(to_user_id, newMessage);

  res.status(201).json(newMessage);  // Return the new message
};

// Get messages for a user
const getMessagesForUser = async (req, res) => {
  const { id } = req.params;  // Get user ID from params

  // Fetch messages for the user, sorted by timestamp
  const messages = await Message.find({
    $or: [{ from_user_id: id }, { to_user_id: id }],
  }).sort({ timestamp: 1 });

  if (!messages) {
    return res.status(404).json({ message: 'No messages found' });
  }

  res.status(200).json(messages);  // Return the list of messages
};

module.exports = { sendMessage, getMessagesForUser };
