const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { users } = require('./auth');

// In-memory database (replace with a real database in production)
const bookings = [];

// Create new booking
router.post('/', (req, res) => {
  const { userId, departure, destination, aircraft, passengers, cargo, date } = req.body;
  
  // Validate required fields
  if (!userId || !departure || !destination || !aircraft || !passengers || !date) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }
  
  // Check if user exists
  const user = users.find(user => user.id === userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
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

// Get all bookings for a user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Find all bookings for user
  const userBookings = bookings.filter(booking => booking.userId === userId);
  
  res.json(userBookings);
});

// Get booking by ID
router.get('/:id', (req, res) => {
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

// Update booking status
router.put('/:id', (req, res) => {
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

module.exports = router;
module.exports.bookings = bookings;