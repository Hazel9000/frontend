const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory database (replace with a real database in production)
const users = [];

// Register new user
router.post('/register', (req, res) => {
  const { name, email, phone, company, password } = req.body;
  
  // Validate required fields
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }
  
  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    name,
    email,
    phone,
    company,
    password, // In a real app, you would hash this password
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  // Don't send password back to client
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: userWithoutPassword
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  // Find user
  const user = users.find(user => user.email === email);
  
  // Check if user exists and password matches
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  // Don't send password back to client
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    message: 'Login successful',
    user: userWithoutPassword
  });
});

// Export users array for other routes to use
module.exports = router;
module.exports.users = users;