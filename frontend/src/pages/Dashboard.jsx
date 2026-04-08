// Dashboard page showing available slots and parked vehicles
import React, { useState, useEffect } from 'react';
import { getAvailableSlots, getParkedVehicles } from '../services/api';
import Alert from '../components/Alert.jsx';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [slots, setSlots] = useState(null);
  const [parkedVehicles, setParkedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [slotsResponse, vehiclesResponse] = await Promise.all([
        getAvailableSlots(),
        getParkedVehicles()
      ]);
      
      if (slotsResponse.data.success) {
        setSlots(slotsResponse.data.data);
      }
      if (vehiclesResponse.data.success) {
        setParkedVehicles(vehiclesResponse.data.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleString();
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>REAL-TIME OVERVIEW</span>
          <h2>Parking Dashboard</h2>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {loading && !slots ? (
          <div className={styles.loadingSpinner}>
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : slots ? (
          <>
            <div className={styles.slotsGrid}>
              {Object.entries(slots).map(([type, data]) => (
                <div key={type} className={styles.slotCard}>
                  <div className={styles.slotIcon}>
                    {type === 'Bike' && '🏍️'}
                    {type === 'Car' && '🚗'}
                    {type === 'Truck' && '🚚'}
                  </div>
                  <h3>{type}</h3>
                  <div className={styles.slotInfo}>
                    <div className={styles.slotStat}>
                      <span className={styles.label}>Available</span>
                      <span className={styles.available}>{data.available}</span>
                    </div>
                    <div className={styles.slotStat}>
                      <span className={styles.label}>Occupied</span>
                      <span className={styles.occupied}>O</span>
                    </div>
                    <div className={styles.slotStat}>
                      <span className={styles.label}>Total</span>
                      <span className={styles.total}>{data.total}</span>
                    </div>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${(data.occupied / data.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className={styles.percentage}>
                    {Math.round((data.occupied / data.total) * 100)}% Occupied
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.refreshBtnContainer}>
              <button className={styles.refreshBtn} onClick={fetchData}>
                🔄 Refresh Data
              </button>
            </div>

            {/* Currently Parked Vehicles Section */}
            <div className={styles.parkedSection}>
              <div className={styles.parkedHeader}>
                <h3>Currently Parked</h3>
                <span className={styles.vehicleCount}>{parkedVehicles.length}</span>
              </div>

              {parkedVehicles.length === 0 ? (
                <div className={styles.emptyParked}>
                  <p>No vehicles currently parked</p>
                </div>
              ) : (
                <div className={styles.vehicleTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.colVehicleNo}>VEHICLE NO.</div>
                    <div className={styles.colType}>TYPE</div>
                    <div className={styles.colSlot}>SLOT</div>
                    <div className={styles.colEntryTime}>ENTRY TIME</div>
                    <div className={styles.colTicketId}>TICKET ID</div>
                  </div>
                  <div className={styles.tableBody}>
                    {parkedVehicles.map((vehicle) => (
                      <div key={vehicle.id} className={styles.tableRow}>
                        <div className={styles.colVehicleNo}>{vehicle.vehicleNumber}</div>
                        <div className={styles.colType}>{vehicle.vehicleType}</div>
                        <div className={styles.colSlot}>{vehicle.slotNumber}</div>
                        <div className={styles.colEntryTime}>{formatTime(vehicle.entryTime)}</div>
                        <div className={styles.colTicketId}>{vehicle.ticketId.substring(0, 13)}...</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
