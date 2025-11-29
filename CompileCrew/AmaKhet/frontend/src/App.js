import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import LoginForm from './components/LoginForm';
import FarmerDashboard from './components/FarmerDashboard';
import './App.css';

function App() {
  const [farmerData, setFarmerData] = useState(null);

  const handleLogin = (data) => {
    setFarmerData(data);
  };

  const handleLogout = () => {
    setFarmerData(null);
  };

  return (
    <LanguageProvider>
      <div className="App">
        {!farmerData ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <FarmerDashboard farmerData={farmerData} onLogout={handleLogout} />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
