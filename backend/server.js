// Main server file
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const parkingRoutes = require('./src/routes/parkingRoutes');
const { initializeDatabase } = require('./src/models/parkingModel');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Routes
app.use('/api', parkingRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Parking Lot System API',
    version: '1.0.0',
    database: 'SQLite',
    endpoints: {
      park: 'POST /api/park',
      exit: 'POST /api/exit',
      slots: 'GET /api/slots'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 API Endpoint: http://localhost:${PORT}/api`);
});

