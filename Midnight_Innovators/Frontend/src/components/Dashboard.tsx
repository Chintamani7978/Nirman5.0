import React, { useState, useEffect } from 'react';
import { User } from '../types';
import StatsGrid from './dashboard/StatsGrid';
import CropTimer from './dashboard/CropTimer';
import FarmProgress from './dashboard/FarmProgress';
import MarketPrices from './dashboard/MarketPrices';
import WeatherWidget from './dashboard/WeatherWidget';
import ChartsSection from './dashboard/ChartsSection';
import VoiceAssistant from './VoiceAssistant';

interface DashboardProps {
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [farmProgress, setFarmProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // Calculate progress based on crop timer
    const daysPassed = Math.floor(Math.random() * 91);
    const progress = Math.round(((90 - daysPassed) / 90) * 100);
    setFarmProgress(progress);
    setDaysLeft(90 - daysPassed);
  }, []);

  return (
    <div className="tab-content active">
      <StatsGrid currentUser={currentUser} />
      
      <div className="grid grid-2">
        <CropTimer 
          daysLeft={daysLeft} 
          onProgressUpdate={setFarmProgress} 
        />
        <FarmProgress progress={farmProgress} />
      </div>

      <MarketPrices />
      <WeatherWidget />
      <ChartsSection />

      <footer className="footer">
        <div className="footer-container">
          <p className="footer-text">
            © 2025 <span className="highlight">Kisan Mitra</span> | Crafted with ❤️ by{' '}
            <span className="team-name">Team MidNight-Innovators</span>
          </p>
        </div>
      </footer>
      
      {/* Voice Assistant */}
      <VoiceAssistant />
    </div>
  );
};

export default Dashboard;