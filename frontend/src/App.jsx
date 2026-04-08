// Main App component
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ParkVehicle from './pages/ParkVehicle.jsx';
import ExitVehicle from './pages/ExitVehicle.jsx';
import ParkedVehicles from './pages/ParkedVehicles.jsx';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/park" element={<ParkVehicle />} />
        <Route path="/exit" element={<ExitVehicle />} />
        <Route path="/parked" element={<ParkedVehicles />} />
      </Routes>
    </Router>
  );
}

export default App;
