const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

// POST route to send a message
router.post('/', messageController.sendMessage);


module.exports = router;
