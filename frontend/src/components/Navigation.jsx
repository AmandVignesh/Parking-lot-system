// Navigation component
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>🅿️ Parking Lot System</h1>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/park">Park Vehicle</Link>
          </li>
          <li>
            <Link to="/parked">Parked Vehicles</Link>
          </li>
          <li>
            <Link to="/exit">Exit Vehicle</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
