// Exit Vehicle page
import React, { useState } from 'react';
import { exitVehicle } from '../services/api';
import Alert from '../components/Alert';
import styles from './ExitVehicle.module.css';

const ExitVehicle = () => {
  const [searchType, setSearchType] = useState('ticketId');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchValue('');
    setReceiptData(null);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!searchValue.trim()) {
      setAlert({
        type: 'error',
        message: searchType === 'ticketId'
          ? 'Please enter ticket ID'
          : 'Please enter vehicle number'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await exitVehicle(
        searchType === 'ticketId' ? searchValue : null,
        searchType === 'vehicleNumber' ? searchValue : null
      );

      if (response.data.success) {
        setReceiptData(response.data.data);
        setAlert({ type: 'success', message: 'Vehicle exited successfully!' });
        setSearchValue('');
      } else {
        setAlert({ type: 'error', message: response.data.message });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to exit vehicle'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewExit = () => {
    setReceiptData(null);
    setSearchValue('');
    setAlert(null);
  };

  return (
    <div className={styles.exitVehicle}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h2>🚪 Exit Vehicle</h2>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          {receiptData && (
            <div className={styles.receiptCard}>
              <h3>🧾 Exit Receipt</h3>
              <div className={styles.receiptInfo}>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Ticket ID:</span>
                  <span className={styles.value}>{receiptData.ticketId}</span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Vehicle:</span>
                  <span className={styles.value}>
                    {receiptData.vehicleNumber} ({receiptData.vehicleType})
                  </span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Slot Number:</span>
                  <span className={styles.value}>{receiptData.slotNumber}</span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Entry Time:</span>
                  <span className={styles.value}>
                    {new Date(receiptData.entryTime).toLocaleString()}
                  </span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Exit Time:</span>
                  <span className={styles.value}>
                    {new Date(receiptData.exitTime).toLocaleString()}
                  </span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Duration:</span>
                  <span className={styles.value}>{receiptData.durationHours} hour(s)</span>
                </div>
                <div className={styles.receiptItem} style={{ borderTop: '2px solid #667eea', marginTop: '15px', paddingTop: '15px' }}>
                  <span className={styles.label} style={{ fontSize: '18px' }}>Total Fee:</span>
                  <span className={styles.fee}>{receiptData.currency}{receiptData.fee}</span>
                </div>
              </div>
              <button
                className={styles.newExitBtn}
                onClick={handleNewExit}
              >
                Exit Another Vehicle
              </button>
            </div>
          )}

          {!receiptData && (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="searchType">Search By *</label>
                <select
                  id="searchType"
                  value={searchType}
                  onChange={handleSearchTypeChange}
                  disabled={loading}
                >
                  <option value="ticketId">Ticket ID</option>
                  <option value="vehicleNumber">Vehicle Number</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="searchValue">
                  {searchType === 'ticketId' ? 'Ticket ID' : 'Vehicle Number'} *
                </label>
                <input
                  type="text"
                  id="searchValue"
                  value={searchValue}
                  onChange={handleInputChange}
                  placeholder={
                    searchType === 'ticketId'
                      ? 'Enter ticket ID'
                      : 'Enter vehicle number'
                  }
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  'Get Exit Receipt'
                )}
              </button>
            </form>
          )}
        </div>

        <div className={styles.infoCard}>
          <h3>ℹ️ Pricing Information</h3>
          <div className={styles.priceTable}>
            <div className={styles.priceRow}>
              <span className={styles.duration}>Up to 3 hours</span>
              <span className={styles.price}>₹30</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.duration}>3 to 6 hours</span>
              <span className={styles.price}>₹85</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.duration}>More than 6 hours</span>
              <span className={styles.price}>₹120</span>
            </div>
          </div>

          <h4 style={{ marginTop: '25px', marginBottom: '15px' }}>📋 Instructions</h4>
          <ul>
            <li>You can exit by Ticket ID or Vehicle Number</li>
            <li>Ticket ID (unique identifier) is provided at parking</li>
            <li>Vehicle Number can also be used to find your parked vehicle</li>
            <li>Exit fee is calculated based on parking duration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExitVehicle;
