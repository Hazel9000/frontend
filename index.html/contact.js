const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory database (replace with a real database in production)
const contactMessages = [];

// Send contact message
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }
  
  // Create new contact message
  const newMessage = {
    id: uuidv4(),
    name,
    email,
    subject,
    message,
    createdAt: new Date()
  };
  
  contactMessages.push(newMessage);
  
  // In a real app, you would send an email notification here
  
  res.status(201).json({
    success: true,
    message: 'Message sent successfully'
  });
});

module.exports = router;