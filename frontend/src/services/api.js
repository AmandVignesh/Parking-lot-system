// API service for parking lot system
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Park a vehicle
 * @param {string} vehicleNumber - Vehicle number
 * @param {string} vehicleType - Type of vehicle (Bike, Car, Truck)
 * @returns {Promise} API response
 */
export const parkVehicle = (vehicleNumber, vehicleType) => {
  return apiClient.post('/park', {
    vehicleNumber,
    vehicleType
  });
};

/**
 * Exit a vehicle
 * @param {string} ticketId - Ticket ID (optional)
 * @param {string} vehicleNumber - Vehicle number (optional)
 * @returns {Promise} API response
 */
export const exitVehicle = (ticketId = null, vehicleNumber = null) => {
  return apiClient.post('/exit', {
    ticketId,
    vehicleNumber
  });
};

/**
 * Get available slots
 * @returns {Promise} API response with available slots
 */
export const getAvailableSlots = () => {
  return apiClient.get('/slots');
};

/**
 * Get all parked vehicles
 * @returns {Promise} API response with list of parked vehicles
 */
export const getParkedVehicles = () => {
  return apiClient.get('/parked-vehicles');
};

export default apiClient;
