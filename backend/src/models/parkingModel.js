// Database models/queries for parking system (SQLite)
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { getSlotCapacity } = require('../utils/helper');

/**
 * Initialize database tables
 */
const initializeDatabase = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS parking_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_number TEXT NOT NULL,
      vehicle_type TEXT NOT NULL CHECK(vehicle_type IN ('Bike', 'Car', 'Truck')),
      ticket_id TEXT UNIQUE NOT NULL,
      slot_number INTEGER NOT NULL,
      entry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      exit_time DATETIME,
      status TEXT DEFAULT 'parked' CHECK(status IN ('parked', 'exited')),
      fee INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_ticket_id ON parking_records(ticket_id);
    CREATE INDEX IF NOT EXISTS idx_vehicle_number ON parking_records(vehicle_number);
    CREATE INDEX IF NOT EXISTS idx_vehicle_type ON parking_records(vehicle_type);
    CREATE INDEX IF NOT EXISTS idx_status ON parking_records(status);
    CREATE INDEX IF NOT EXISTS idx_entry_time ON parking_records(entry_time);
  `;
  
  try {
    await db.run(sql);
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

/**
 * Create a new parking entry
 */
const parkVehicle = async (vehicleNumber, vehicleType, slotNumber) => {
  const ticketId = uuidv4();
  const entryTime = new Date().toISOString();
  
  const sql = `
    INSERT INTO parking_records (vehicle_number, vehicle_type, ticket_id, slot_number, entry_time, status)
    VALUES (?, ?, ?, ?, ?, 'parked')
  `;
  
  const result = await db.run(sql, [vehicleNumber, vehicleType, ticketId, slotNumber, entryTime]);
  
  return {
    id: result.id,
    ticketId,
    slotNumber,
    entryTime
  };
};

/**
 * Get available slot for a vehicle type
 */
const getAvailableSlot = async (vehicleType) => {
  const capacity = getSlotCapacity();
  const maxSlots = capacity[vehicleType];
  
  // Find all occupied slots for this vehicle type
  const sql = `
    SELECT slot_number FROM parking_records 
    WHERE vehicle_type = ? AND status = 'parked'
  `;
  
  const occupiedSlots = await db.all(sql, [vehicleType]);
  const occupiedNumbers = occupiedSlots.map(slot => slot.slot_number);
  
  // Find first available slot
  for (let i = 1; i <= maxSlots; i++) {
    if (!occupiedNumbers.includes(i)) {
      return i;
    }
  }
  
  return null; // All slots full
};

/**
 * Get parking record by ticket ID
 */
const getParkingByTicketId = async (ticketId) => {
  const sql = `
    SELECT * FROM parking_records WHERE ticket_id = ?
  `;
  
  return await db.get(sql, [ticketId]);
};

/**
 * Get parking record by vehicle number (latest parked)
 */
const getParkingByVehicleNumber = async (vehicleNumber) => {
  const sql = `
    SELECT * FROM parking_records 
    WHERE vehicle_number = ? AND status = 'parked'
    ORDER BY entry_time DESC
    LIMIT 1
  `;
  
  return await db.get(sql, [vehicleNumber]);
};

/**
 * Update parking record with exit details
 */
const exitVehicle = async (id, exitTime, fee) => {
  const sql = `
    UPDATE parking_records 
    SET exit_time = ?, status = 'exited', fee = ?
    WHERE id = ?
  `;
  
  const result = await db.run(sql, [exitTime, fee, id]);
  return result.changes > 0;
};

/**
 * Get available slots count for all vehicle types
 */
const getAvailableSlotsCount = async () => {
  const capacity = getSlotCapacity();
  const result = {};
  
  for (const [type, maxSlots] of Object.entries(capacity)) {
    const sql = `
      SELECT COUNT(*) as occupied FROM parking_records 
      WHERE vehicle_type = ? AND status = 'parked'
    `;
    
    const row = await db.get(sql, [type]);
    const occupied = row.occupied;
    result[type] = {
      available: maxSlots - occupied,
      total: maxSlots,
      occupied: occupied
    };
  }
  
  return result;
};

/**
 * Get all currently parked vehicles
 */
const getAllParkedVehicles = async () => {
  const sql = `
    SELECT id, vehicle_number, vehicle_type, ticket_id, slot_number, entry_time
    FROM parking_records 
    WHERE status = 'parked'
    ORDER BY entry_time DESC
  `;
  
  return await db.all(sql, []);
};

module.exports = {
  initializeDatabase,
  parkVehicle,
  getAvailableSlot,
  getParkingByTicketId,
  getParkingByVehicleNumber,
  exitVehicle,
  getAvailableSlotsCount,
  getAllParkedVehicles
};
