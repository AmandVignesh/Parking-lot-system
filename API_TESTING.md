# 🧪 API Testing Guide

## Using cURL (Command Line)

### 1. Get Available Slots
```bash
curl http://localhost:5000/api/slots
```

### 2. Park a Vehicle
```bash
curl -X POST http://localhost:5000/api/park \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "KA01AB1234",
    "vehicleType": "Car"
  }'
```

**Response Example:**
```json
{
  "success": true,
  "message": "Vehicle parked successfully",
  "data": {
    "ticketId": "550e8400-e29b-41d4-a716-446655440000",
    "slotNumber": 1,
    "vehicleNumber": "KA01AB1234",
    "vehicleType": "Car",
    "entryTime": "2024-04-08T10:30:00.000Z"
  }
}
```

### 3. Exit Vehicle by Ticket ID
```bash
curl -X POST http://localhost:5000/api/exit \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### 4. Exit Vehicle by Vehicle Number
```bash
curl -X POST http://localhost:5000/api/exit \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "KA01AB2345"
  }'
```

---

## Using Postman

### Import in Postman:

#### 1. **Create New Request**
- Click "+" → "New Request"

#### 2. **Get Available Slots**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/slots`
- **Click:** Send

#### 3. **Park Vehicle**
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/park`
- **Headers:**
  ```
  Key: Content-Type
  Value: application/json
  ```
- **Body:** Select "raw" → "JSON"
  ```json
  {
    "vehicleNumber": "KA01AB1234",
    "vehicleType": "Car"
  }
  ```
- **Click:** Send

#### 4. **Exit Vehicle**
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/exit`
- **Headers:** `Content-Type: application/json`
- **Body:** (use the ticketId from park response)
  ```json
  {
    "ticketId": "PASTE_TICKET_ID_HERE"
  }
  ```
- **Click:** Send

---

## Test Scenarios

### Scenario 1: Park Multiple Vehicles

```bash
# Park Bike 1
curl -X POST http://localhost:5000/api/park \
  -H "Content-Type: application/json" \
  -d '{"vehicleNumber":"KA01AB1001","vehicleType":"Bike"}'

# Park Car 1
curl -X POST http://localhost:5000/api/park \
  -H "Content-Type: application/json" \
  -d '{"vehicleNumber":"KA01AB2001","vehicleType":"Car"}'

# Park Truck 1
curl -X POST http://localhost:5000/api/park \
  -H "Content-Type: application/json" \
  -d '{"vehicleNumber":"KA01AB3001","vehicleType":"Truck"}'

# Check slots
curl http://localhost:5000/api/slots
```

### Scenario 2: Fill All Slots

```bash
# Park 5 Bikes
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/park \
    -H "Content-Type: application/json" \
    -d "{\"vehicleNumber\":\"BIKE${i}\",\"vehicleType\":\"Bike\"}"
done

# Try to park another Bike (should fail)
curl -X POST http://localhost:5000/api/park \
  -H "Content-Type: application/json" \
  -d '{"vehicleNumber":"BIKE99","vehicleType":"Bike"}'

# Response should be: "Parking Full - No available slots for Bike"
```

### Scenario 3: Exit and Check Fees

```bash
# Park a vehicle
RESPONSE=$(curl -s -X POST http://localhost:5000/api/park \
  -H "Content-Type: application/json" \
  -d '{"vehicleNumber":"TEST123","vehicleType":"Car"}')

# Extract ticketId from response (example)
TICKET_ID="550e8400-e29b-41d4-a716-446655440000"

# Wait a few hours (or just exit immediately for fee calculation)
# Let's exit now
curl -X POST http://localhost:5000/api/exit \
  -H "Content-Type: application/json" \
  -d "{\"ticketId\":\"${TICKET_ID}\"}"
```

---

## Expected Fee Structure

| Duration | Fee |
|----------|-----|
| ≤ 3 hours | ₹30 |
| > 3 and ≤ 6 hours | ₹85 |
| > 6 hours | ₹120 |

---

## Error Responses

### Invalid Vehicle Number
```json
{
  "success": false,
  "message": "Invalid vehicle number"
}
```

### Invalid Vehicle Type
```json
{
  "success": false,
  "message": "Invalid vehicle type. Choose from: Bike, Car, Truck"
}
```

### Parking Full
```json
{
  "success": false,
  "message": "Parking Full - No available slots for Car"
}
```

### No Active Parking Record
```json
{
  "success": false,
  "message": "No active parking record found"
}
```

---

## Testing Checklist

- [ ] Get slots (all types available)
- [ ] Park a Bike
- [ ] Park a Car
- [ ] Park a Truck
- [ ] Get slots (quantities updated)
- [ ] Exit by Ticket ID
- [ ] Exit by Vehicle Number
- [ ] Get slots (quantities updated again)
- [ ] Park more than max slots (should fail)
- [ ] Try to exit already exited vehicle (should fail)

---

## Useful Tools

### Online Tools:
- **Postman:** https://www.postman.com/
- **Thunder Client:** VS Code extension
- **REST Client:** VS Code extension

### Command Line Tools:
- `curl` - Built-in (Windows 10+, Mac, Linux)
- `httpie` - `pip install httpie`

### Browser Tools:
- **DevTools** → Network tab (check XHR requests)
- **Console** → Test fetch API

---

**All tests passed? Your Parking Lot System is working perfectly! ✅**
