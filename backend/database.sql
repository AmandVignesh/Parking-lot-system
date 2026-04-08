-- Create Database
CREATE DATABASE IF NOT EXISTS parking_lot_db;
USE parking_lot_db;

-- Create parking_records table
CREATE TABLE IF NOT EXISTS parking_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_number VARCHAR(50) NOT NULL,
  vehicle_type ENUM('Bike', 'Car', 'Truck') NOT NULL,
  ticket_id VARCHAR(36) UNIQUE NOT NULL,
  slot_number INT NOT NULL,
  entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  exit_time TIMESTAMP NULL,
  status ENUM('parked', 'exited') DEFAULT 'parked',
  fee INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for better query performance
  INDEX idx_ticket_id (ticket_id),
  INDEX idx_vehicle_number (vehicle_number),
  INDEX idx_vehicle_type (vehicle_type),
  INDEX idx_status (status),
  INDEX idx_entry_time (entry_time)
);

-- Insert some sample data (optional)
-- INSERT INTO parking_records (vehicle_number, vehicle_type, ticket_id, slot_number, status)
-- VALUES 
-- ('KA01AB1234', 'Car', UUID(), 1, 'parked'),
-- ('KA01CD5678', 'Bike', UUID(), 1, 'parked');
