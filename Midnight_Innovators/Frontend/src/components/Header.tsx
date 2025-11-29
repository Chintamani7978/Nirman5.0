import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <i className="fas fa-seedling"></i>
          <span>Kisan Mitra</span>
        </div>
        <div className="user-info">
          <div className="welcome-text">
            <div>Welcome, {currentUser.name}!</div>
            <div className="current-time">{currentTime}</div>
          </div>
          <div className="user-avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;