import React, { useState } from 'react';
import { parkVehicle } from '../services/api';
import Alert from '../components/Alert.jsx';
import styles from './ParkVehicle.module.css';

const ParkVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Car'
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vehicleNumber.trim()) {
      setAlert({ type: 'error', message: 'Please enter vehicle number' });
      return;
    }

    try {
      setLoading(true);
      const response = await parkVehicle(formData.vehicleNumber, formData.vehicleType);

      if (response.data.success) {
        setTicketData(response.data.data);
        setAlert({ type: 'success', message: response.data.message });
        setFormData({ vehicleNumber: '', vehicleType: 'Car' });
      } else {
        setAlert({ type: 'error', message: response.data.message });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to park vehicle'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.parkVehicle}>
      <div className={styles.pageHeader}>
        <span className={styles.subtitle}>— NEW ENTRY</span>
        <h1 className={styles.title}>Park Your <span className={styles.highlight}>Vehicle</span></h1>
      </div>

      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2>🏎️ Register Entry</h2>
            <p>Fill in the details below to allocate a parking slot</p>
          </div>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          {ticketData ? (
            <div className={styles.ticketCard}>
              <h3>✅ Vehicle Parked Successfully!</h3>
              <div className={styles.ticketInfo}>
                <div className={styles.ticketItem}>
                  <span className={styles.label}>Ticket ID</span>
                  <span className={styles.value}>{ticketData.ticketId}</span>
                </div>
                <div className={styles.ticketItem}>
                  <span className={styles.label}>Vehicle</span>
                  <span className={styles.value}>
                    {ticketData.vehicleNumber} ({ticketData.vehicleType})
                  </span>
                </div>
                <div className={styles.ticketItem}>
                  <span className={styles.label}>Slot Number</span>
                  <span className={styles.value}>{ticketData.slotNumber}</span>
                </div>
                <div className={styles.ticketItem}>
                  <span className={styles.label}>Entry Time</span>
                  <span className={styles.value}>
                    {new Date(ticketData.entryTime).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className={styles.note}>Please save your ticket ID for exit</p>
              <button
                className={styles.submitBtn}
                onClick={() => setTicketData(null)}
              >
                Park Another Vehicle →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="vehicleNumber">VEHICLE NUMBER *</label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., KA01AB1234"
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="vehicleType">VEHICLE TYPE *</label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="Bike">🏍️ Bike</option>
                  <option value="Car">🚗 Car</option>
                  <option value="Truck">🚚 Truck</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Parking...
                  </>
                ) : (
                  'Park Vehicle →'
                )}
              </button>
            </form>
          )}
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>i</div>
              <h3>Guidelines</h3>
            </div>
            <ul>
              <li>Enter your complete vehicle registration number</li>
              <li>Select the correct vehicle type for proper slot allocation</li>
              <li>Save your Ticket ID — required at exit</li>
              <li>Slot assignment is automatic based on availability</li>
            </ul>
          </div>

          <div className={styles.slotsCard}>
            <h3 className={styles.slotsTitle}>AVAILABLE SLOTS</h3>
            <div className={styles.slotsGrid}>
              <div className={styles.slotItem}>
                <span className={styles.slotCount}>5</span>
                <span className={styles.slotType}>Bikes</span>
              </div>
              <div className={styles.slotItem}>
                <span className={styles.slotCount}>5</span>
                <span className={styles.slotType}>Cars</span>
              </div>
              <div className={styles.slotItem}>
                <span className={styles.slotCount}>2</span>
                <span className={styles.slotType}>Trucks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkVehicle;
