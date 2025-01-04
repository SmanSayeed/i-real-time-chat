const User = require('../models/userModel');

// User Registration
const registerUser = async (req, res) => {
  const { username, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, '-__v'); // Exclude internal fields like `__v`
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  // Get user profile by ID
const getUserProfile = async (req, res) => {
    try {
      const { id } = req.params; // Get the user ID from the URL parameters
      const user = await User.findById(id); // Find user by ID in the database
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user); // Return user profile
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  // Login with email (no actual login logic needed)
const loginWithEmail = async (req, res) => {
    const { email } = req.body;
  
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // If the user doesn't exist, we just send a 404
      return res.status(404).json({ message: 'User not found' });
    }
  
    // If the user exists, return the user ID (simulating login)
    res.status(200).json({ userId: user._id });
  };
  

module.exports = { 
    registerUser,
      getAllUsers,
      getUserProfile,
      loginWithEmail
     };
