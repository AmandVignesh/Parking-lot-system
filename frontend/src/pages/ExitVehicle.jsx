import React, { useState } from 'react';
import { exitVehicle } from '../services/api';
import Alert from '../components/Alert.jsx';
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
      <div className={styles.pageHeader}>
        <span className={styles.subtitle}>— VEHICLE EXIT</span>
        <h1 className={styles.title}>Exit <span className={styles.highlight}>Vehicle</span></h1>
      </div>

      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2>🎟️ Get Exit Receipt</h2>
            <p>Search by Ticket ID or Vehicle Number to process exit</p>
          </div>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          {receiptData ? (
            <div className={styles.receiptCard}>
              <h3>Your Exit Receipt</h3>
              <div className={styles.receiptInfo}>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Ticket ID</span>
                  <span className={styles.value}>{receiptData.ticketId}</span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Vehicle</span>
                  <span className={styles.value}>
                    {receiptData.vehicleNumber} ({receiptData.vehicleType})
                  </span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Slot Number</span>
                  <span className={styles.value}>{receiptData.slotNumber}</span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Entry Time</span>
                  <span className={styles.value}>
                    {new Date(receiptData.entryTime).toLocaleString()}
                  </span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Exit Time</span>
                  <span className={styles.value}>
                    {new Date(receiptData.exitTime).toLocaleString()}
                  </span>
                </div>
                <div className={styles.receiptItem}>
                  <span className={styles.label}>Duration</span>
                  <span className={styles.value}>{receiptData.durationHours} hour(s)</span>
                </div>
                <div className={styles.receiptItem} style={{ borderTop: '1px solid rgba(192, 132, 252, 0.3)', marginTop: '5px', paddingTop: '15px' }}>
                  <span className={styles.label} style={{ fontSize: '18px', color: '#c084fc' }}>Total Fee</span>
                  <span className={styles.fee}>{receiptData.currency}{receiptData.fee}</span>
                </div>
              </div>
              <button
                className={styles.submitBtn}
                onClick={handleNewExit}
              >
                Exit Another Vehicle →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="searchType">SEARCH BY *</label>
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
                  {searchType === 'ticketId' ? 'TICKET ID' : 'VEHICLE NUMBER'} *
                </label>
                <input
                  type="text"
                  id="searchValue"
                  value={searchValue}
                  onChange={handleInputChange}
                  placeholder={
                    searchType === 'ticketId'
                      ? 'Enter ticket ID (e.g., TKT-12345)'
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
                  'Get Exit Receipt →'
                )}
              </button>
            </form>
          )}
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBoxPurple}>₹</div>
              <h3>Pricing Info</h3>
            </div>
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

            <div className={styles.cardHeader} style={{ marginTop: '40px' }}>
              <div className={styles.iconBoxPurple}>📋</div>
              <h3>Instructions</h3>
            </div>
            <ul className={styles.purpleUl}>
              <li>Exit by Ticket ID or Vehicle Number</li>
              <li>Ticket ID is your unique parking identifier</li>
              <li>Fee is calculated based on parking duration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitVehicle;
