// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Configure CORS for Netlify
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database (replace with a real database in production)
const users = [];
const bookings = [];
const contactMessages = [];

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Granava Aircraft Charter API',
    version: '1.0.0'
  });
});

// User Authentication Routes
app.post('/api/register', (req, res) => {
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

app.post('/api/login', (req, res) => {
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

// Booking Routes
app.post('/api/bookings', (req, res) => {
  const { userId, departure, destination, aircraft, passengers, cargo, date } = req.body;
  
  // Validate required fields
  if (!userId || !departure || !destination || !aircraft || !passengers || !date) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }
  
  // Create new booking
  const newBooking = {
    id: uuidv4(),
    userId,
    departure,
    destination,
    aircraft,
    passengers,
    cargo: cargo || 0,
    date,
    status: 'pending', // pending, confirmed, cancelled
    createdAt: new Date()
  };
  
  bookings.push(newBooking);
  
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking: newBooking
  });
});

app.get('/api/bookings/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Find all bookings for user
  const userBookings = bookings.filter(booking => booking.userId === userId);
  
  res.json(userBookings);
});

app.get('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  
  // Find booking
  const booking = bookings.find(booking => booking.id === id);
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  res.json(booking);
});

app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Find booking
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }
  
  // Update booking status
  bookings[bookingIndex].status = status;
  
  res.json({
    success: true,
    message: 'Booking updated successfully',
    booking: bookings[bookingIndex]
  });
});

// Contact Form Route
app.post('/api/contact', (req, res) => {
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
  
  res.status(201).json({
    success: true,
    message: 'Message sent successfully'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN || '*'}`);
});