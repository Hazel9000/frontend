const express = require('express');
const router = express.Router();
const openAIPClient = require('../openAIPClient');
const cache = require('../middleware/cache'); // Optional caching middleware

// Get airports within bounding box
router.get('/airports', cache(3600), async (req, res) => {
  try {
    const { bbox } = req.query;
    if (!bbox) return res.status(400).json({ error: 'Bounding box (bbox) parameter is required' });
    
    const airports = await openAIPClient.getAirports(bbox);
    res.json(airports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get airspaces within bounding box
router.get('/airspaces', cache(3600), async (req, res) => {
  try {
    const { bbox } = req.query;
    if (!bbox) return res.status(400).json({ error: 'Bounding box (bbox) parameter is required' });
    
    const airspaces = await openAIPClient.getAirspaces(bbox);
    res.json(airspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get navaids within bounding box
router.get('/navaids', cache(3600), async (req, res) => {
  try {
    const { bbox } = req.query;
    if (!bbox) return res.status(400).json({ error: 'Bounding box (bbox) parameter is required' });
    
    const navaids = await openAIPClient.getNavaids(bbox);
    res.json(navaids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;