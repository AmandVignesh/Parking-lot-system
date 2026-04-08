// Routes for parking system
const express = require('express');
const router = express.Router();

const {
  parkVehicleController,
  exitVehicleController,
  getAvailableSlotsController
} = require('../controllers/parkingController');

/**
 * POST /park
 * Park a vehicle
 * Body: { vehicleNumber, vehicleType }
 */
router.post('/park', parkVehicleController);

/**
 * POST /exit
 * Exit a vehicle
 * Body: { ticketId } or { vehicleNumber }
 */
router.post('/exit', exitVehicleController);

/**
 * GET /slots
 * Get available slots for all vehicle types
 */
router.get('/slots', getAvailableSlotsController);

module.exports = router;
