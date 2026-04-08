# 📊 Project Overview & Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT SIDE                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Frontend (Port 3000)                   │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Navigation Component                         │  │  │
│  │  │  - Park Vehicle Page                          │  │  │
│  │  │  - Exit Vehicle Page                          │  │  │
│  │  │  - Dashboard Page                             │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                 HTTP/REST Calls (Axios)                    │
│                          │                                   │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER SIDE                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Express.js Backend (Port 5000)                 │  │
│  │                                                       │  │
│  │  Routes:                                            │  │
│  │  ├─ POST /api/park                                 │  │
│  │  ├─ POST /api/exit                                 │  │
│  │  └─ GET /api/slots                                 │  │
│  │                                                       │  │
│  │  Controllers:                                       │  │
│  │  └─ parkingController.js                           │  │
│  │      ├─ parkVehicleController()                    │  │
│  │      ├─ exitVehicleController()                    │  │
│  │      └─ getAvailableSlotsController()              │  │
│  │                                                       │  │
│  │  Models:                                            │  │
│  │  └─ parkingModel.js (Database Queries)             │  │
│  │      ├─ parkVehicle()                              │  │
│  │      ├─ getAvailableSlot()                         │  │
│  │      ├─ getParkingByTicketId()                     │  │
│  │      ├─ exitVehicle()                              │  │
│  │      └─ getAvailableSlotsCount()                   │  │
│  │                                                       │  │
│  │  Utils:                                             │  │
│  │  └─ helper.js                                      │  │
│  │      ├─ calculateFee()                             │  │
│  │      ├─ validateVehicleNumber()                    │  │
│  │      └─ validateVehicleType()                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                   Database Queries                          │
│                          │                                   │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
     ┌─────────────────────────────────────────────┐
     │      MySQL Database (Port 3306)             │
     │  ┌───────────────────────────────────────┐  │
     │  │  Database: parking_lot_db             │  │
     │  │  ┌─────────────────────────────────┐  │  │
     │  │  │ Table: parking_records          │  │  │
     │  │  │ - id                            │  │  │
     │  │  │ - vehicle_number                │  │  │
     │  │  │ - vehicle_type                  │  │  │
     │  │  │ - ticket_id (UUID)              │  │  │
     │  │  │ - slot_number                   │  │  │
     │  │  │ - entry_time                    │  │  │
     │  │  │ - exit_time (nullable)          │  │  │
     │  │  │ - status (parked/exited)        │  │  │
     │  │  │ - fee                           │  │  │
     │  │  └─────────────────────────────────┘  │  │
     │  └───────────────────────────────────────┘  │
     └─────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Park Vehicle Flow:
```
┌────────────┐
│User Input  │
│Vehicle #   │
│Type        │
└──────┬─────┘
       │
       ▼
┌──────────────────┐
│Validate Inputs   │
└──────┬───────────┘
       │ Valid?
       ├─No──→ Return Error
       │
       ├─Yes─┐
       │     ▼
       │  ┌──────────────────────┐
       │  │Check Available Slots │
       │  │for Vehicle Type      │
       │  └──────┬───────────────┘
       │         │
       │         ├─None─→ Return "Full"
       │         │
       │         ├─Yes──┐
       │         │      ▼
       │         │   ┌──────────────────┐
       │         │   │Assign Slot      │
       │         │   │Record to DB:    │
       │         │   │- Ticket ID (UUID)│
       │         │   │- Entry Time      │
       │         │   │- Status: parked  │
       │         │   └──────┬───────────┘
       │         │          │
       │         │          ▼
       │         │   ┌──────────────────┐
       │         │   │Return Success    │
       │         │   │+ Ticket ID       │
       │         │   │+ Slot Number     │
       │         │   └──────────────────┘
       │         │
       └─────────┘
```

### Exit Vehicle Flow:
```
┌──────────────────┐
│User Input        │
│Ticket ID OR      │
│Vehicle Number    │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────┐
│Search Database           │
│Find Active Parking       │
└──────┬───────────────────┘
       │
       ├─Not Found─→ Return Error
       │
       ├─Found─┐
       │       ▼
       │   ┌──────────────────────┐
       │   │Calculate Duration    │
       │   │(Exit Time - Entry)   │
       │   └──────┬───────────────┘
       │          │
       │          ▼
       │   ┌──────────────────────┐
       │   │Calculate Fee         │
       │   │≤3h: ₹30              │
       │   │3-6h: ₹85             │
       │   │>6h: ₹120             │
       │   └──────┬───────────────┘
       │          │
       │          ▼
       │   ┌──────────────────────┐
       │   │Update DB:            │
       │   │- Exit Time           │
       │   │- Status: exited      │
       │   │- Fee Amount          │
       │   │- Free Slot           │
       │   └──────┬───────────────┘
       │          │
       │          ▼
       │   ┌──────────────────────┐
       │   │Return Receipt        │
       │   │+ Duration            │
       │   │+ Fee                 │
       │   └──────────────────────┘
       │
       └─────────
```

---

## Key Components Explained

### 1. **Frontend Components**

#### Navigation Component (`Navigation.js`)
- Displays header with logo and navigation links
- Links to Dashboard, Park Vehicle, Exit Vehicle pages
- Responsive design using CSS Modules

#### Dashboard Page (`Dashboard.js`)
- Shows available slots for each vehicle type
- Real-time updates every 5 seconds
- Progress bars showing occupancy percentage
- Manual refresh button

#### Park Vehicle Page (`ParkVehicle.js`)
- Form for entering vehicle details
- Vehicle type selector (Bike/Car/Truck)
- Displays ticket after successful parking
- Shows guidelines

#### Exit Vehicle Page (`ExitVehicle.js`)
- Form to search by Ticket ID or Vehicle Number
- Calculates and displays fare
- Shows pricing information
- Displays detailed receipt

#### Alert Component (`Alert.js`)
- Reusable notification component
- Auto-dismisses after 5 seconds
- Supports success, error, info types

### 2. **Backend Controllers**

#### parkingController.js
**parkVehicleController()**
- Validates vehicle number and type
- Checks slot availability
- Creates parking record
- Returns ticket ID

**exitVehicleController()**
- Finds parking record by ticket or vehicle
- Validates vehicle is still parked
- Calculates duration and fee
- Updates database with exit info

**getAvailableSlotsController()**
- Fetches all vehicle types
- Counts occupied slots
- Calculates available slots
- Returns occupancy data

### 3. **Backend Models**

Functions interact with MySQL database:
- `parkVehicle()` - Inserts new record
- `getAvailableSlot()` - Finds free slot
- `getParkingByTicketId()` - Searches by ID
- `getParkingByVehicleNumber()` - Searches by number
- `exitVehicle()` - Updates exit record
- `getAvailableSlotsCount()` - Gets availability

### 4. **Utility Functions**

#### helper.js
- `calculateFee()` - Computes fare based on duration
- `getSlotCapacity()` - Returns max slots per type
- `validateVehicleNumber()` - Checks vehicle number format
- `validateVehicleType()` - Validates vehicle type

---

## Database Schema Explained

### parking_records Table
```
Column Name    | Type              | Purpose
─────────────────────────────────────────────────
id             | INT AUTO_INC      | Primary Key
vehicle_number | VARCHAR(50)       | Vehicle plate/ID
vehicle_type   | ENUM              | Bike/Car/Truck
ticket_id      | VARCHAR(36)       | Unique UUID
slot_number    | INT               | Parking slot #
entry_time     | TIMESTAMP         | When parked
exit_time      | TIMESTAMP/NULL    | When exited
status         | ENUM              | parked/exited
fee            | INT               | Charged amount
created_at     | TIMESTAMP         | Record created
updated_at     | TIMESTAMP         | Record updated
```

### Indexes for Performance
- `idx_ticket_id` - Quick ticket lookup
- `idx_vehicle_number` - Vehicle search
- `idx_vehicle_type` - Type-based queries
- `idx_status` - Find parked vehicles
- `idx_entry_time` - Time-range queries

---

## Request/Response Cycle Example

### Park Vehicle Request:
```
User Input:
├─ Vehicle Number: KA01AB1234
└─ Vehicle Type: Car

Request to Backend:
POST /api/park
Content-Type: application/json
{
  "vehicleNumber": "KA01AB1234",
  "vehicleType": "Car"
}

Backend Processing:
├─ Validate inputs ✓
├─ Check slot availability ✓
├─ Generate UUID ticket ✓
├─ Insert database record ✓
└─ Return response

Response to Frontend:
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

Display to User:
├─ Show success message
├─ Display ticket ID (prominently)
├─ Show slot assignment
└─ Suggest saving ticket for exit
```

---

## Code Quality Features

✅ **Clean Code Principles:**
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Clear variable names
- Proper indentation and formatting

✅ **Error Handling:**
- Try-catch blocks throughout
- Meaningful error messages
- HTTP status codes
- User-friendly responses

✅ **Security:**
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- CORS enabled for frontend
- Environment variables for secrets

✅ **Performance:**
- Database indexes for fast queries
- Connection pooling for MySQL
- Efficient query structure
- Minimal DOM manipulation

✅ **Documentation:**
- Commented code sections
- API documentation
- README with full guide
- Quick start guide
- API testing guide

---

## Scalability Considerations

If scaling to production:

1. **Database:**
   - Add more indexes as needed
   - Implement caching (Redis)
   - Consider clustering

2. **Backend:**
   - Add load balancing (nginx)
   - Use process managers (PM2)
   - Implement rate limiting
   - Add logging service

3. **Frontend:**
   - Optimize bundle size
   - Implement code splitting
   - Add PWA capabilities
   - Service worker for offline

4. **Infrastructure:**
   - Use cloud databases
   - Deploy on cloud platforms
   - Implement CI/CD pipelines
   - Monitor with analytics

---

**This is a complete, production-ready system! 🚀**
