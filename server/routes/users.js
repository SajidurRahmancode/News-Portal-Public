// server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Update user
router.put('/:id', 
  authMiddleware,
  [
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Username must be between 3 and 30 characters').isLength({ min: 3, max: 30 }),
    check('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email } = req.body;
      
      // Find user
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Authorization check
      if (user._id.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this profile' });
      }

      // Check for duplicate email
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Update user
      user.username = username;
      user.email = email;
      await user.save();

      // Return updated user without password
      const userObj = user.toObject();
      delete userObj.password;

      res.json(userObj);
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

module.exports = router;