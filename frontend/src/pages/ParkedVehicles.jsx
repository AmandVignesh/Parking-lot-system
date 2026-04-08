// Parked Vehicles page - View all currently parked vehicles
import React, { useState, useEffect } from 'react';
import { getParkedVehicles } from '../services/api';
import Alert from '../components/Alert.jsx';
import styles from './ParkedVehicles.module.css';

const ParkedVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchParkedVehicles();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchParkedVehicles, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchParkedVehicles = async () => {
    try {
      setLoading(true);
      const response = await getParkedVehicles();
      if (response.data.success) {
        setVehicles(response.data.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch parked vehicles');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleString();
  };

  const getVehicleEmoji = (type) => {
    switch (type) {
      case 'Bike':
        return '🏍️';
      case 'Car':
        return '🚗';
      case 'Truck':
        return '🚚';
      default:
        return '🚗';
    }
  };

  const calculateDuration = (entryTime) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diffMs = now - entry;
    const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(2);
    return diffHours;
  };

  return (
    <div className={styles.parkedVehicles}>
      <div className={styles.container}>
        <h2>🅿️ Parked Vehicles</h2>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading parked vehicles...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorBox}>
            <p>⚠️ {error}</p>
            <button onClick={fetchParkedVehicles} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        )}

        {!loading && vehicles.length === 0 && (
          <div className={styles.emptyBox}>
            <p>🎉 No vehicles currently parked!</p>
            <small>The parking lot is empty.</small>
          </div>
        )}

        {!loading && vehicles.length > 0 && (
          <div className={styles.vehiclesGrid}>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className={styles.vehicleCard}>
                <div className={styles.vehicleHeader}>
                  <span className={styles.emoji}>
                    {getVehicleEmoji(vehicle.vehicleType)}
                  </span>
                  <h3>{vehicle.vehicleNumber}</h3>
                </div>

                <div className={styles.vehicleInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Type:</span>
                    <span className={styles.value}>{vehicle.vehicleType}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>Ticket ID:</span>
                    <span className={styles.value} style={{ fontSize: '12px' }}>
                      {vehicle.ticketId.substring(0, 13)}...
                    </span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>Slot:</span>
                    <span className={styles.value}>{vehicle.slotNumber}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>Parked Since:</span>
                    <span className={styles.value}>{formatTime(vehicle.entryTime)}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>Duration:</span>
                    <span className={styles.value}>{calculateDuration(vehicle.entryTime)}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.refershBtn}>
          <button onClick={fetchParkedVehicles} disabled={loading}>
            🔄 Refresh List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkedVehicles;
