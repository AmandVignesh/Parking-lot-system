# 🚀 Quick Start Guide

## Fast Setup (≈ 5 minutes)

### Prerequisites Checklist:
- ✅ Node.js installed
- ✅ MySQL running
- ✅ Git (optional)

---

## Step 1: Database Setup (2 minutes)

### Option A: MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Paste the content of backend/database.sql
# Or run:
mysql -u root -p < backend/database.sql
```

### Option B: MySQL Workbench
1. Open MySQL Workbench
2. Click "File" → "Open SQL Script"
3. Select `backend/database.sql`
4. Click "Execute"

---

## Step 2: Backend Setup (1.5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Update .env file with your MySQL credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=parking_lot_db

# Start server
npm start

# ✅ You should see: "✅ Server running on http://localhost:5000"
```

---

## Step 3: Frontend Setup (1.5 minutes)

```bash
# Open a NEW terminal window

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React app
npm start

# ✅ Browser will open at http://localhost:3000
```

---

## Done! ✅

You're all set! The application is now running:

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API:** http://localhost:5000/api

---

## Quick Test

1. Go to "Park Vehicle" page
2. Enter: Vehicle Number = `KA01AB1234`, Type = `Car`
3. Click "Park Vehicle" → Get Ticket ID
4. Go to "Exit Vehicle" page
5. Use the Ticket ID → Get Receipt with Fare
6. Go to "Dashboard" → See updated slot availability

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | MySQL not running |
| `Port 5000 in use` | Change PORT in backend/.env |
| `Port 3000 in use` | Set PORT=3001 before `npm start` |
| `Module not found` | Run `npm install` in that folder |
| `CORS error` | Ensure backend is running |

---

## File Locations Important:

```
parking-lot-system/
├── backend/
│   └── .env ← Update with MySQL credentials
├── frontend/
│   └── .env ← Usually no changes needed
└── README.md ← Full documentation
```

---

## Environment Variables

### Backend (.env):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password    ← CHANGE THIS
DB_NAME=parking_lot_db
PORT=5000
```

### Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

**That's it! Happy Parking! 🅿️**
