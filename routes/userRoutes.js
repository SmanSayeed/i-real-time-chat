const express = require('express');
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Route for registering a user
router.post('/', userController.registerUser);
// Route for fetching all users
router.get('/', userController.getAllUsers);

// Route for logging in with email (just return user ID)
router.post('/login', userController.loginWithEmail);

// Route for fetching a single user profile by ID
router.get('/:id', userController.getUserProfile);


// GET route to fetch messages for a specific user
router.get('/:id/messages', messageController.getMessagesForUser);

module.exports = router;
