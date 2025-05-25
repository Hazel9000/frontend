const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

// Import services and data
const { getAirports, getAirportByIcao } = require('./src/services/openaip');
const { getWeatherByCity } = require('./src/services/weather');
const aircraftForSale = require('./src/data/aircraftForSale');

// Create Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory "database" for users, bookings, and messages
const users = [];
const bookings = [];
const contactMessages = [];

// --- Root Route ---
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Granava Aircraft Charter API',
    version: '1.0.0'
  });
});

// --- User Authentication Routes ---
app.post('/api/register', (req, res) => {
  const { name, email, phone, company, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ success: false, message: 'User with this email already exists' });
  }
  const newUser = {
    id: uuidv4(),
    name,
    email,
    phone,
    company,
    password, // NOTE: For production, hash passwords!
    createdAt: new Date()
  };
  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: userWithoutPassword
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }
  const user = users.find(user => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    message: 'Login successful',
    user: userWithoutPassword
  });
});

// --- Booking Routes ---
app.post('/api/bookings', (req, res) => {
  const { userId, departure, destination, aircraft, passengers, cargo, date } = req.body;
  if (!userId || !departure || !destination || !aircraft || !passengers || !date) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }
  const newBooking = {
    id: uuidv4(),
    userId,
    departure,
    destination,
    aircraft,
    passengers,
    cargo: cargo || 0,
    date,
    status: 'pending',
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
  const userBookings = bookings.filter(booking => booking.userId === userId);
  res.json(userBookings);
});

app.get('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const booking = bookings.find(booking => booking.id === id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  res.json(booking);
});

app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  bookings[bookingIndex].status = status;
  res.json({
    success: true,
    message: 'Booking updated successfully',
    booking: bookings[bookingIndex]
  });
});

// --- Contact Form Route ---
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }
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

// --- OpenAIP API Integration ---
// Get all airports from OpenAIP
app.get('/api/openaip/airports', async (req, res) => {
  try {
    const airports = await getAirports();
    res.json(airports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airports from OpenAIP.' });
  }
});
// Get a single airport from OpenAIP by ICAO code
app.get('/api/openaip/airports/:icao', async (req, res) => {
  try {
    const airport = await getAirportByIcao(req.params.icao);
    res.json(airport);
  } catch (error) {
    res.status(404).json({ error: 'Airport not found in OpenAIP.' });
  }
});

// --- Aircraft for Sale Endpoint ---
// Returns a list of aircraft with images
app.get('/api/aircraft-for-sale', (req, res) => {
  res.json(aircraftForSale);
});

// --- Live Weather Endpoint ---
// Get live weather for a city
app.get('/api/weather/:city', async (req, res) => {
  try {
    const weather = await getWeatherByCity(req.params.city);
    res.json(weather);
  } catch (error) {
    res.status(404).json({ error: 'Weather data not found.' });
  }
});

// --- Start the Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN || '*'}`);
});