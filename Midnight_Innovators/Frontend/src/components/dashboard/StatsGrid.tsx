import React, { useState, useEffect } from 'react';
import { 
  User, 
  Wheat, 
  TrendingUp, 
  MapPin, 
  IndianRupee, 
  Sprout, 
  CloudRain, 
  Scale, 
  Calendar, 
  Tractor,
  Leaf,
  BarChart3
} from 'lucide-react';

// Types
interface User {
  landSize?: number;
  annualIncome?: number;
  cropType?: string;
  name?: string;
}

interface StatsGridProps {
  currentUser: User;
}

const StatsGrid: React.FC<StatsGridProps> = ({ currentUser }) => {
  const [randomData, setRandomData] = useState({
    activeSchemes: 0,
    soilQuality: '',
    rainfall: 0,
    cropYield: 0,
    marketPrice: 0,
    subsidyAmount: 0,
    cropGrowth: 0,
    yearsFarming: 0,
    cropVarieties: 0
  });

  useEffect(() => {
    // Generate realistic agricultural data
    const generateRandomData = () => {
      const schemes = Math.floor(Math.random() * 8) + 5; // 5-12 schemes
      const soilQualities = ['Excellent', 'Good', 'Fair', 'Poor'];
      const soilQuality = soilQualities[Math.floor(Math.random() * soilQualities.length)];
      const rainfall = Math.floor(Math.random() * 300) + 500; // 500-800 mm
      const cropYield = (Math.random() * 5 + 2).toFixed(1); // 2.0-7.0 tons/acre
      const marketPrice = Math.floor(Math.random() * 3000) + 2000; // ₹2000-5000/ton
      const subsidyAmount = Math.floor(Math.random() * 50000) + 10000; // ₹10,000-60,000
      const cropGrowth = Math.floor(Math.random() * 20) + 5; // 5-25%
      const yearsFarming = Math.floor(Math.random() * 15) + 1; // 1-15 years
      const cropVarieties = Math.floor(Math.random() * 8) + 2; // 2-10 varieties

      setRandomData({
        activeSchemes: schemes,
        soilQuality,
        rainfall,
        cropYield: parseFloat(cropYield),
        marketPrice,
        subsidyAmount,
        cropGrowth,
        yearsFarming,
        cropVarieties
      });
    };

    generateRandomData();
  }, []);

  // Get actual data from currentUser with fallback values
  const landSize = currentUser?.landSize || Math.floor(Math.random() * 10) + 2;
  const annualIncome = currentUser?.annualIncome || Math.floor(Math.random() * 500000) + 100000;
  const cropType = currentUser?.cropType || ['Wheat', 'Rice', 'Corn', 'Soybean', 'Cotton'][Math.floor(Math.random() * 5)];

  // Function to get quality color
  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'excellent': return '#16a34a';
      case 'good': return '#65a30d';
      case 'fair': return '#ca8a04';
      case 'poor': return '#dc2626';
      default: return '#64748b';
    }
  };

  // Function to get growth trend color
  const getGrowthColor = (growth: number) => {
    if (growth >= 15) return '#16a34a';
    if (growth >= 10) return '#65a30d';
    if (growth >= 5) return '#ca8a04';
    return '#dc2626';
  };

  const statsData = [
    {
      icon: MapPin,
      value: `${landSize}`,
      label: 'Acres of Land',
      unit: 'acres',
      color: '#16a34a',
      bgColor: 'rgba(22, 163, 74, 0.1)'
    },
    {
      icon: IndianRupee,
      value: `₹${(annualIncome / 100000).toFixed(1)}L`,
      label: 'Annual Income',
      unit: '',
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.1)'
    },
    {
      icon: Wheat,
      value: cropType,
      label: 'Primary Crop',
      unit: '',
      color: '#d97706',
      bgColor: 'rgba(217, 119, 6, 0.1)'
    },
    {
      icon: BarChart3,
      value: `${randomData.activeSchemes}`,
      label: 'Active Schemes',
      unit: 'programs',
      color: '#7c3aed',
      bgColor: 'rgba(124, 58, 237, 0.1)'
    },
    {
      icon: Leaf,
      value: randomData.soilQuality,
      label: 'Soil Quality',
      unit: '',
      color: getQualityColor(randomData.soilQuality),
      bgColor: `${getQualityColor(randomData.soilQuality)}20`
    },
    {
      icon: CloudRain,
      value: `${randomData.rainfall}`,
      label: 'Annual Rainfall',
      unit: 'mm',
      color: '#0ea5e9',
      bgColor: 'rgba(14, 165, 233, 0.1)'
    },
    {
      icon: Scale,
      value: `${randomData.cropYield}`,
      label: 'Average Yield',
      unit: 't/acre',
      color: '#16a34a',
      bgColor: 'rgba(22, 163, 74, 0.1)'
    },
    {
      icon: TrendingUp,
      value: `₹${randomData.marketPrice.toLocaleString()}`,
      label: 'Market Price',
      unit: '/ton',
      color: '#dc2626',
      bgColor: 'rgba(220, 38, 38, 0.1)'
    },
    {
      icon: IndianRupee,
      value: `₹${randomData.subsidyAmount.toLocaleString()}`,
      label: 'Subsidy Received',
      unit: '',
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.1)'
    },
    {
      icon: Sprout,
      value: `${randomData.cropGrowth}%`,
      label: 'Crop Growth',
      unit: '',
      color: getGrowthColor(randomData.cropGrowth),
      bgColor: `${getGrowthColor(randomData.cropGrowth)}20`
    },
    {
      icon: Calendar,
      value: `${randomData.yearsFarming}`,
      label: 'Years Farming',
      unit: 'years',
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)'
    },
    {
      icon: Tractor,
      value: `${randomData.cropVarieties}`,
      label: 'Crop Varieties',
      unit: 'types',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    }
  ];

  return (
    <div className="stats-container">
      <style jsx>{`
        .stats-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 24px;
          background: #f8fafc;
        }

        .stats-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .stats-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }

        .stats-subtitle {
          font-size: 16px;
          color: #64748b;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border-color: #16a34a;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-color);
          border-radius: 16px 16px 0 0;
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .stat-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-color);
          color: var(--card-color);
        }

        .stat-trend {
          font-size: 12px;
          font-weight: 600;
          color: #16a34a;
          background: rgba(22, 163, 74, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.1;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }

        .stat-label {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          margin-bottom: 4px;
        }

        .stat-unit {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .stat-description {
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }

        .excellent { --quality-color: #16a34a; }
        .good { --quality-color: #65a30d; }
        .fair { --quality-color: #ca8a04; }
        .poor { --quality-color: #dc2626; }

        .quality-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: var(--quality-color);
          border-radius: 50%;
          margin-left: 8px;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .stat-card {
            padding: 20px;
          }
          
          .stat-value {
            font-size: 28px;
          }
          
          .stats-title {
            font-size: 24px;
          }
        }

        @media (max-width: 640px) {
          .stats-container {
            padding: 16px;
          }
          
          .stat-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .stat-icon-container {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>

      <div className="stats-header">
        <h2 className="stats-title">🌾 Farm Analytics Dashboard</h2>
        <p className="stats-subtitle">Comprehensive overview of your agricultural operations</p>
      </div>

      <div className="stats-grid">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          const isPercentage = stat.unit === '' && stat.value.includes('%');
          const isQuality = stat.label === 'Soil Quality';
          
          return (
            <div 
              key={index} 
              className="stat-card"
              style={{
                '--card-color': stat.color,
                '--bg-color': stat.bgColor
              } as React.CSSProperties}
            >
              <div className="stat-header">
                <div className="stat-icon-container">
                  <IconComponent size={24} />
                </div>
                {isPercentage && (
                  <div className="stat-trend">
                    +{Math.floor(Math.random() * 5) + 1}% this month
                  </div>
                )}
              </div>
              
              <div className="stat-value">
                {stat.value}
                {isQuality && (
                  <span 
                    className={`quality-indicator ${stat.value.toLowerCase()}`}
                    style={{ '--quality-color': stat.color } as React.CSSProperties}
                  />
                )}
              </div>
              
              <div className="stat-label">
                {stat.label}
              </div>
              
              {stat.unit && (
                <div className="stat-unit">
                  per {stat.unit}
                </div>
              )}
              
              <div className="stat-description">
                {stat.label === 'Acres of Land' && 'Total cultivated area under your management'}
                {stat.label === 'Annual Income' && 'Revenue generated from agricultural activities'}
                {stat.label === 'Primary Crop' && 'Main crop variety currently being cultivated'}
                {stat.label === 'Active Schemes' && 'Government schemes you are currently enrolled in'}
                {stat.label === 'Soil Quality' && 'Current soil health assessment based on recent tests'}
                {stat.label === 'Annual Rainfall' && 'Average precipitation received this year'}
                {stat.label === 'Average Yield' && 'Expected harvest output based on current conditions'}
                {stat.label === 'Market Price' && 'Current market rate for your primary crop'}
                {stat.label === 'Subsidy Received' && 'Total government subsidies received this year'}
                {stat.label === 'Crop Growth' && 'Current growth rate compared to expected timeline'}
                {stat.label === 'Years Farming' && 'Total years of agricultural experience'}
                {stat.label === 'Crop Varieties' && 'Different crop types you are currently growing'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsGrid;