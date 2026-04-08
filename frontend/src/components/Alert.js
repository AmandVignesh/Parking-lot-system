// Alert component for displaying messages
import React, { useEffect, useState } from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, 5000); // Auto close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!visible || !message) return null;

  return (
    <div className={`alert alert-${type}`}>
      {message}
    </div>
  );
};

export default Alert;
