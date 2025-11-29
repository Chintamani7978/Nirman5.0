import React from 'react';
import { TrendingUp } from 'lucide-react';

interface FarmProgressProps {
  progress: number;
}

const FarmProgress: React.FC<FarmProgressProps> = ({ progress }) => {
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <TrendingUp size={20} />
          Farm Progress
        </div>
      </div>
      <div className="progress-circle">
        <svg>
          <circle 
            className="progress-bg" 
            cx="75" 
            cy="75" 
            r="70"
            fill="none"
            strokeWidth="8"
            stroke="rgba(46, 125, 50, 0.1)"
          />
          <circle 
            className="progress-bar" 
            cx="75" 
            cy="75" 
            r="70"
            fill="none"
            strokeWidth="8"
            stroke="#4CAF50"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 75 75)"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="progress-text">
          <div className="progress-value">{progress}%</div>
          <div>Complete</div>
        </div>
      </div>
    </div>
  );
};

export default FarmProgress;