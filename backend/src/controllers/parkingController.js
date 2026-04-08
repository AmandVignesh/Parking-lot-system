// Controller for parking operations
const {
  parkVehicle,
  getAvailableSlot,
  getParkingByTicketId,
  getParkingByVehicleNumber,
  exitVehicle,
  getAvailableSlotsCount,
  getAllParkedVehicles
} = require('../models/parkingModel');

const {
  calculateFee,
  validateVehicleNumber,
  validateVehicleType
} = require('../utils/helper');

/**
 * Park a vehicle - POST /park
 */
const parkVehicleController = async (req, res) => {
  try {
    const { vehicleNumber, vehicleType } = req.body;
    
    // Convert vehicle number to uppercase
    const normalizedVehicleNumber = vehicleNumber.toUpperCase();
    
    // Validate inputs
    if (!validateVehicleNumber(normalizedVehicleNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle number'
      });
    }
    
    if (!validateVehicleType(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle type. Choose from: Bike, Car, Truck'
      });
    }
    
    // Check available slot
    const availableSlot = await getAvailableSlot(vehicleType);
    
    if (availableSlot === null) {
      return res.status(400).json({
        success: false,
        message: 'Parking Full - No available slots for ' + vehicleType
      });
    }
    
    // Park the vehicle
    const parkingRecord = await parkVehicle(normalizedVehicleNumber, vehicleType, availableSlot);
    
    res.status(200).json({
      success: true,
      message: 'Vehicle parked successfully',
      data: {
        ticketId: parkingRecord.ticketId,
        slotNumber: parkingRecord.slotNumber,
        vehicleNumber: normalizedVehicleNumber,
        vehicleType: vehicleType,
        entryTime: parkingRecord.entryTime
      }
    });
    
  } catch (error) {
    console.error('Error parking vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error parking vehicle',
      error: error.message
    });
  }
};

/**
 * Exit a vehicle - POST /exit
 * Can exit by ticket ID or vehicle number
 */
const exitVehicleController = async (req, res) => {
  try {
    const { ticketId, vehicleNumber } = req.body;
    
    // Convert vehicle number to uppercase if provided
    const normalizedVehicleNumber = vehicleNumber ? vehicleNumber.toUpperCase() : null;
    
    // Get parking record
    let parkingRecord;
    
    if (ticketId) {
      parkingRecord = await getParkingByTicketId(ticketId);
    } else if (normalizedVehicleNumber) {
      parkingRecord = await getParkingByVehicleNumber(normalizedVehicleNumber);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Provide either ticketId or vehicleNumber'
      });
    }
    
    // Check if record exists
    if (!parkingRecord) {
      return res.status(404).json({
        success: false,
        message: 'No active parking record found'
      });
    }
    
    // Check if already exited
    if (parkingRecord.status === 'exited') {
      return res.status(400).json({
        success: false,
        message: 'Vehicle has already exited'
      });
    }
    
    // Calculate fee
    const exitTime = new Date();
    const feeDetails = calculateFee(parkingRecord.entry_time, exitTime);
    
    // Update parking record
    const updated = await exitVehicle(parkingRecord.id, exitTime, feeDetails.fee);
    
    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Error updating parking record'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Vehicle exited successfully',
      data: {
        ticketId: parkingRecord.ticket_id,
        vehicleNumber: parkingRecord.vehicle_number,
        vehicleType: parkingRecord.vehicle_type,
        slotNumber: parkingRecord.slot_number,
        entryTime: parkingRecord.entry_time,
        exitTime: exitTime,
        durationHours: feeDetails.duration,
        fee: feeDetails.fee,
        currency: '₹'
      }
    });
    
  } catch (error) {
    console.error('Error exiting vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing vehicle exit',
      error: error.message
    });
  }
};

/**
 * Get available slots - GET /slots
 */
const getAvailableSlotsController = async (req, res) => {
  try {
    const slotsData = await getAvailableSlotsCount();
    
    res.status(200).json({
      success: true,
      message: 'Available slots retrieved',
      data: slotsData
    });
    
  } catch (error) {
    console.error('Error retrieving slots:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving available slots',
      error: error.message
    });
  }
};

/**
 * Get all parked vehicles - GET /parked-vehicles
 */
const getAllParkedVehiclesController = async (req, res) => {
  try {
    const parkedVehicles = await getAllParkedVehicles();
    
    // Format the response
    const formattedVehicles = parkedVehicles.map(vehicle => ({
      id: vehicle.id,
      ticketId: vehicle.ticket_id,
      vehicleNumber: vehicle.vehicle_number,
      vehicleType: vehicle.vehicle_type,
      slotNumber: vehicle.slot_number,
      entryTime: vehicle.entry_time
    }));
    
    res.status(200).json({
      success: true,
      message: 'Parked vehicles retrieved',
      data: formattedVehicles
    });
    
  } catch (error) {
    console.error('Error retrieving parked vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving parked vehicles',
      error: error.message
    });
  }
};

module.exports = {
  parkVehicleController,
  exitVehicleController,
  getAvailableSlotsController,
  getAllParkedVehiclesController
};
