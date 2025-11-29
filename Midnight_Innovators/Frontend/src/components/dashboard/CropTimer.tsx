import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CropTimerProps {
  daysLeft: number;
  onProgressUpdate: (progress: number) => void;
}

const CropTimer: React.FC<CropTimerProps> = ({ daysLeft, onProgressUpdate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysLeft);

    const updateTimer = () => {
      const now = new Date();
      const timeDiff = targetDate.getTime() - now.getTime();

      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        
        const progress = Math.max(0, Math.min(100, Math.round(((90 - days) / 90) * 100)));
        onProgressUpdate(progress);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [daysLeft, onProgressUpdate]);

  return (
    <div className="card crop-timer">
      <h3 style={{ marginBottom: '1rem' }}>
        <Clock size={20} style={{ marginRight: '10px' }} />
        Crop Harvest Timer
      </h3>
      <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
        Time remaining until wheat harvest
      </p>
      <div className="timer-grid">
        <div className="timer-item">
          <span className="timer-value">{timeLeft.days.toString().padStart(2, '0')}</span>
          <span className="timer-label">Days</span>
        </div>
        <div className="timer-item">
          <span className="timer-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="timer-label">Hours</span>
        </div>
        <div className="timer-item">
          <span className="timer-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="timer-label">Minutes</span>
        </div>
        <div className="timer-item">
          <span className="timer-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="timer-label">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CropTimer;