const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false }, // To track if the message has been delivered
  read: { type: Boolean, default: false }, // To track if the message has been read by the receiver
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
