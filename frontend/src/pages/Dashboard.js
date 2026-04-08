// Dashboard page showing available slots
import React, { useState, useEffect } from 'react';
import { getAvailableSlots } from '../services/api';
import Alert from '../components/Alert';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [slots, setSlots] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSlots();
    // Refresh slots every 5 seconds
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await getAvailableSlots();
      if (response.data.success) {
        setSlots(response.data.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch available slots');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <h2>📊 Parking Lot Dashboard</h2>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {loading && !slots ? (
          <div className={styles.loadingSpinner}>
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : slots ? (
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
                    <span className={styles.label}>Available:</span>
                    <span className={styles.available}>{data.available}</span>
                  </div>
                  <div className={styles.slotStat}>
                    <span className={styles.label}>Occupied:</span>
                    <span className={styles.occupied}>{data.occupied}</span>
                  </div>
                  <div className={styles.slotStat}>
                    <span className={styles.label}>Total:</span>
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
                  {Math.round((data.occupied / data.total) * 100)}% Full
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <button className={styles.refreshBtn} onClick={fetchSlots}>
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
