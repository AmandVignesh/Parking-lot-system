# 🅿️ Parking Lot Management System

A complete full-stack parking lot management system built with Node.js, Express, React, and MySQL. This system allows users to park vehicles, exit vehicles, and view real-time parking slot availability.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Running the Project](#running-the-project)
- [Usage Guide](#usage-guide)

---

## ✨ Features

### Core Features:
1. **Park Vehicle** - Park vehicles with automatic slot assignment
   - Support for Bike (5 slots), Car (5 slots), Truck (2 slots)
   - Unique ticket ID generation
   - Entry time recording

2. **Exit Vehicle** - Process vehicle exits with fare calculation
   - Exit by Ticket ID or Vehicle Number
   - Automatic fare calculation based on duration
   - Slot release

3. **Dashboard** - Real-time parking status
   - View available slots for each vehicle type
   - Occupancy percentage
   - Live updates (refreshes every 5 seconds)

### Pricing Model:
- Up to 3 hours: ₹30
- 3 to 6 hours: ₹85
- More than 6 hours: ₹120

---

## 🛠️ Tech Stack

### Backend:
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL** - Database (using mysql2)
- **UUID** - Unique ticket generation
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend:
- **React** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **CSS Modules** - Component styling
- **Functional Components & Hooks** - React patterns

### Database:
- **MySQL** - Relational database
- 1 main table: `parking_records`

---

## 📁 Project Structure

```
parking-lot-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database configuration
│   │   ├── controllers/
│   │   │   └── parkingController.js # Business logic
│   │   ├── models/
│   │   │   └── parkingModel.js     # Database queries
│   │   ├── routes/
│   │   │   └── parkingRoutes.js    # API routes
│   │   └── utils/
│   │       └── helper.js            # Utility functions
│   ├── server.js                   # Main server file
│   ├── package.json                # Dependencies
│   ├── .env                        # Environment variables
│   └── database.sql                # Database schema
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js       # Navigation bar
│   │   │   ├── Navigation.module.css
│   │   │   └── Alert.js            # Alert component
│   │   ├── pages/
│   │   │   ├── Dashboard.js        # Dashboard page
│   │   │   ├── Dashboard.module.css
│   │   │   ├── ParkVehicle.js      # Park vehicle form
│   │   │   ├── ParkVehicle.module.css
│   │   │   ├── ExitVehicle.js      # Exit vehicle form
│   │   │   └── ExitVehicle.module.css
│   │   ├── services/
│   │   │   └── api.js              # API service
│   │   ├── styles/
│   │   │   └── global.css          # Global styles
│   │   ├── App.js                  # App component
│   │   └── index.js                # Entry point
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── package.json                # Dependencies
│   └── .env                        # Environment variables
```

---

## 🗄️ Database Design

### Table: `parking_records`

```sql
CREATE TABLE parking_records (
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
  
  INDEX idx_ticket_id (ticket_id),
  INDEX idx_vehicle_number (vehicle_number),
  INDEX idx_vehicle_type (vehicle_type),
  INDEX idx_status (status),
  INDEX idx_entry_time (entry_time)
);
```

---

## 🚀 Setup Instructions

### Prerequisites:
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn package manager

### Step 1: Clone or Download the Project

```bash
# Navigate to the project directory
cd parking-lot-system
```

### Step 2: Database Setup

1. **Open MySQL Command Line or MySQL Workbench**

2. **Create the database:**
   ```sql
   -- Copy the entire content of backend/database.sql and run it
   ```

3. **Or run via command line:**
   ```bash
   mysql -u root -p < backend/database.sql
   ```

4. **Verify the database:**
   ```sql
   USE parking_lot_db;
   SHOW TABLES;
   ```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MySQL credentials
# Example:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=parking_lot_db
# PORT=5000

# Start the backend server
npm start

# OR for development with auto-reload:
npm run dev
```

### Step 4: Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start

# The app will open at http://localhost:3000
```

---

## 📚 API Documentation

### Base URL: `http://localhost:5000/api`

### Endpoints:

#### 1. **POST /park** - Park a Vehicle
**Description:** Park a vehicle and get a parking ticket

**Request:**
```json
{
  "vehicleNumber": "KA01AB1234",
  "vehicleType": "Car"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Vehicle parked successfully",
  "data": {
    "ticketId": "550e8400-e29b-41d4-a716-446655440000",
    "slotNumber": 3,
    "vehicleNumber": "KA01AB1234",
    "vehicleType": "Car",
    "entryTime": "2024-04-08T10:30:00.000Z"
  }
}
```

**Response (Error - Full):**
```json
{
  "success": false,
  "message": "Parking Full - No available slots for Car"
}
```

---

#### 2. **POST /exit** - Exit a Vehicle
**Description:** Process vehicle exit and calculate fare

**Request (by Ticket ID):**
```json
{
  "ticketId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Request (by Vehicle Number):**
```json
{
  "vehicleNumber": "KA01AB1234"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Vehicle exited successfully",
  "data": {
    "ticketId": "550e8400-e29b-41d4-a716-446655440000",
    "vehicleNumber": "KA01AB1234",
    "vehicleType": "Car",
    "slotNumber": 3,
    "entryTime": "2024-04-08T10:30:00.000Z",
    "exitTime": "2024-04-08T12:45:00.000Z",
    "durationHours": 2,
    "fee": 30,
    "currency": "₹"
  }
}
```

---

#### 3. **GET /slots** - Get Available Slots
**Description:** Retrieve available parking slots for all vehicle types

**Response (Success):**
```json
{
  "success": true,
  "message": "Available slots retrieved",
  "data": {
    "Bike": {
      "available": 5,
      "total": 5,
      "occupied": 0
    },
    "Car": {
      "available": 4,
      "total": 5,
      "occupied": 1
    },
    "Truck": {
      "available": 2,
      "total": 2,
      "occupied": 0
    }
  }
}
```

---

## 🎯 Running the Project

### Complete Start (First Time):

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

### Quick Start (After Initial Setup):

**Terminal 1:**
```bash
cd backend && npm start
```

**Terminal 2:**
```bash
cd frontend && npm start
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API:** http://localhost:5000/api

---

## 💡 Usage Guide

### 1. **Park a Vehicle**
   - Go to "Park Vehicle" page
   - Enter vehicle number (e.g., KA01AB1234)
   - Select vehicle type (Bike, Car, or Truck)
   - Click "Park Vehicle"
   - **Save the Ticket ID** - You'll need it to exit

### 2. **Exit a Vehicle**
   - Go to "Exit Vehicle" page
   - Choose search method (Ticket ID or Vehicle Number)
   - Enter the corresponding value
   - Click "Get Exit Receipt"
   - View the receipt with parking duration and fare

### 3. **Check Availability**
   - Go to "Dashboard"
   - View real-time slot availability
   - Dashboard updates every 5 seconds
   - Use "Refresh" button for manual update

---

## 🔧 Troubleshooting

### Issue: Database Connection Error
**Solution:**
1. Check MySQL is running
2. Verify credentials in `.env` file
3. Ensure database exists: `USE parking_lot_db;`

### Issue: Port Already in Use
**Solution:**
- For backend (5000): Change PORT in `.env`
- For frontend (3000): Set PORT=3001 in terminal or .env

### Issue: CORS Error
**Solution:**
- Ensure backend is running on correct port
- Check API_URL in frontend `api.js` file

### Issue: React Module Not Found
**Solution:**
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Testing the API

### Using cURL or Postman:

**Test Park Vehicle:**
```bash
curl -X POST http://localhost:5000/api/park \
  -H "Content-Type: application/json" \
  -d '{"vehicleNumber":"KA01AB1234","vehicleType":"Car"}'
```

**Test Get Slots:**
```bash
curl http://localhost:5000/api/slots
```

**Test Exit Vehicle:**
```bash
curl -X POST http://localhost:5000/api/exit \
  -H "Content-Type: application/json" \
  -d '{"vehicleNumber":"KA01AB1234"}'
```

---

## 📝 Key Features Explained

### Slot Management:
- Bikes: 5 slots
- Cars: 5 slots  
- Trucks: 2 slots
- Slots are assigned sequentially (1 to max)
- Previous exits free up slots for reuse

### Ticket Generation:
- UUID v4 format (unique identifier)
- Never repeats
- Used for exit processing

### Fare Calculation:
- Rounded up to nearest hour
- Fixed pricing tiers
- Automatic calculation on exit

### Real-time Updates:
- Dashboard refreshes every 5 seconds
- Manual refresh button available
- Accurate occupancy tracking

---

## 📄 Code Quality

- **Clean Code:** Well-structured, readable
- **MVC Pattern:** Separation of concerns
- **Error Handling:** Comprehensive try-catch blocks
- **Input Validation:** All inputs validated
- **Comments:** Important sections documented
- **Modular:** Easy to extend and maintain

---

## 🚀 Future Enhancements

- User authentication and authorization
- Payment integration
- Email/SMS notifications
- Advanced reporting and analytics
- Mobile app (React Native)
- QR code ticket generation
- Admin dashboard
- Multilingual support

---

## 📧 Support

For issues or questions, please check the troubleshooting section or ensure:
1. All dependencies are installed
2. MySQL server is running
3. Environment variables are correctly set
4. Ports 5000 and 3000 are available

---

## 📄 License

This project is open source and available for educational purposes.

---

**Happy Parking! 🚗**
