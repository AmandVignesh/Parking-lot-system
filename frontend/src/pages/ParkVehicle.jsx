// Park Vehicle page
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

    // Validate inputs
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
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h2>🚗 Park Your Vehicle</h2>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          {ticketData && (
            <div className={styles.ticketCard}>
              <h3>✅ Vehicle Parked Successfully!</h3>
              <div className={styles.ticketInfo}>
                <div className={styles.ticketItem}>
                  <span className={styles.label}>Ticket ID:</span>
                  <span className={styles.value}>{ticketData.ticketId}</span>
                </div>
                <div className={styles.ticketItem}>
                  <span className={styles.label}>Vehicle:</span>
                  <span className={styles.value}>
                    {ticketData.vehicleNumber} ({ticketData.vehicleType})
                  </span>
                </div>
                <div className={styles.ticketItem}>
                  <span className={styles.label}>Slot Number:</span>
                  <span className={styles.value}>{ticketData.slotNumber}</span>
                </div>
                <div className={styles.ticketItem}>
                  <span className={styles.label}>Entry Time:</span>
                  <span className={styles.value}>
                    {new Date(ticketData.entryTime).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className={styles.note}>Please save your ticket ID for exit</p>
              <button
                className={styles.newParkBtn}
                onClick={() => setTicketData(null)}
              >
                Park Another Vehicle
              </button>
            </div>
          )}

          {!ticketData && (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="vehicleNumber">Vehicle Number *</label>
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
                <label htmlFor="vehicleType">Vehicle Type *</label>
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
                  'Park Vehicle'
                )}
              </button>
            </form>
          )}
        </div>

        <div className={styles.infoCard}>
          <h3>ℹ️ Guidelines</h3>
          <ul>
            <li>Enter your complete vehicle number</li>
            <li>Select the correct vehicle type</li>
            <li>Save your ticket ID for exit</li>
            <li>Parking slots available:
              <ul>
                <li>Bikes: 5 slots</li>
                <li>Cars: 5 slots</li>
                <li>Trucks: 2 slots</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParkVehicle;
