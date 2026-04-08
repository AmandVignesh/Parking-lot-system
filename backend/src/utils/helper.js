// Utility functions for parking calculations

/**
 * Calculate parking fee based on duration
 * Up to 3 hours → ₹30
 * 3 to 6 hours → ₹85
 * More than 6 hours → ₹120
 */
const calculateFee = (entryTime, exitTime) => {
  const entryDate = new Date(entryTime);
  const exitDate = new Date(exitTime);
  
  // Calculate duration in hours
  const durationMs = exitDate - entryDate;
  const durationHours = durationMs / (1000 * 60 * 60);
  
  let fee = 0;
  
  if (durationHours <= 3) {
    fee = 30;
  } else if (durationHours <= 6) {
    fee = 85;
  } else {
    fee = 120;
  }
  
  return {
    duration: Math.ceil(durationHours),
    fee: fee
  };
};

/**
 * Get slot capacity for each vehicle type
 */
const getSlotCapacity = () => {
  return {
    Bike: 5,
    Car: 5,
    Truck: 2
  };
};

/**
 * Validate vehicle number format
 */
const validateVehicleNumber = (vehicleNumber) => {
  // Simple validation - vehicle number should not be empty
  return vehicleNumber && vehicleNumber.trim().length > 0;
};

/**
 * Validate vehicle type
 */
const validateVehicleType = (vehicleType) => {
  const validTypes = ['Bike', 'Car', 'Truck'];
  return validTypes.includes(vehicleType);
};

module.exports = {
  calculateFee,
  getSlotCapacity,
  validateVehicleNumber,
  validateVehicleType
};
