import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line, Radar, Scatter } from 'react-chartjs-2';
import { Download, Table, Map, TrendingUp, BarChart3, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedState, setSelectedState] = useState<string>('');
  const [mapData, setMapData] = useState<any>(null);

  // Enhanced Indian states agriculture data with all major states
  const stateWiseData = {
    labels: [
      'Uttar Pradesh', 'Punjab', 'Maharashtra', 'Madhya Pradesh', 'Karnataka',
      'West Bengal', 'Gujarat', 'Rajasthan', 'Andhra Pradesh', 'Tamil Nadu',
      'Bihar', 'Haryana', 'Odisha', 'Telangana', 'Assam',
      'Chhattisgarh', 'Kerala', 'Jharkhand', 'Uttarakhand', 'Himachal Pradesh'
    ],
    datasets: [{
      label: 'Food Grain Production (Million Tons)',
      data: [58, 31, 26, 25, 15, 18, 14, 23, 21, 17, 16, 19, 12, 14, 8, 9, 3, 6, 4, 2],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  // Major crops distribution
  const cropsData = {
    labels: ['Rice', 'Wheat', 'Maize', 'Pulses', 'Oilseeds', 'Sugarcane', 'Cotton'],
    datasets: [{
      data: [44, 35, 9, 7, 13, 4, 5],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(201, 203, 207, 0.7)',
        'rgba(255, 99, 132, 0.7)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 2,
    }]
  };

  // Yield trends for major crops
  const yieldTrendsData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Rice (kg/hectare)',
        data: [2600, 2680, 2750, 2820, 2900, 2980],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Wheat (kg/hectare)',
        data: [3200, 3300, 3420, 3500, 3600, 3700],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Pulses (kg/hectare)',
        data: [800, 820, 850, 880, 900, 920],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        tension: 0.4,
      }
    ]
  };

  // Irrigation coverage
  const irrigationData = {
    labels: [
      'Punjab', 'Haryana', 'Uttar Pradesh', 'Tamil Nadu', 'Andhra Pradesh',
      'Karnataka', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Madhya Pradesh',
      'West Bengal', 'Bihar', 'Odisha', 'Telangana', 'Kerala'
    ],
    datasets: [{
      label: 'Irrigation Coverage (%)',
      data: [98, 85, 75, 65, 60, 55, 45, 40, 35, 30, 70, 65, 50, 45, 80],
      backgroundColor: 'rgba(153, 102, 255, 0.7)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
    }]
  };

  // Seasonal production
  const seasonalData = {
    labels: ['Kharif', 'Rabi', 'Zaid'],
    datasets: [{
      label: 'Production (Million Tons)',
      data: [150, 160, 15],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Fertilizer Consumption by State
  const fertilizerData = {
    labels: [
      'Uttar Pradesh', 'Punjab', 'Maharashtra', 'Andhra Pradesh', 'Madhya Pradesh',
      'Karnataka', 'Gujarat', 'Rajasthan', 'West Bengal', 'Tamil Nadu',
      'Bihar', 'Haryana', 'Odisha', 'Telangana'
    ],
    datasets: [
      {
        label: 'Nitrogen (kg/hectare)',
        data: [180, 240, 120, 140, 110, 100, 130, 90, 150, 160, 170, 220, 80, 120],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Phosphorus (kg/hectare)',
        data: [80, 110, 60, 70, 50, 45, 65, 40, 75, 85, 70, 100, 35, 55],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Potassium (kg/hectare)',
        data: [40, 60, 30, 35, 25, 20, 30, 20, 40, 45, 35, 55, 15, 25],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  // NEW: Agricultural Exports Data
  const exportsData = {
    labels: ['Rice', 'Marine Products', 'Spices', 'Buffalo Meat', 'Sugar', 'Cotton', 'Tea'],
    datasets: [{
      label: 'Export Value (Billion USD)',
      data: [11.5, 7.7, 4.0, 3.5, 2.8, 2.1, 0.8],
      backgroundColor: 'rgba(40, 167, 69, 0.7)',
      borderColor: 'rgba(40, 167, 69, 1)',
      borderWidth: 1
    }]
  };

  // NEW: Farmer Income Trends
  const incomeData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Average Farmer Income (₹ Thousand/Year)',
        data: [105, 115, 125, 135, 148, 162],
        borderColor: 'rgba(255, 193, 7, 1)',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // NEW: Organic Farming Coverage
  const organicData = {
    labels: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Gujarat', 'Odisha', 'Others'],
    datasets: [{
      label: 'Area under Organic Farming (Million Hectares)',
      data: [1.2, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 1.5],
      backgroundColor: [
        'rgba(106, 176, 76, 0.7)',
        'rgba(65, 149, 69, 0.7)',
        'rgba(46, 125, 50, 0.7)',
        'rgba(27, 94, 32, 0.7)',
        'rgba(56, 142, 60, 0.7)',
        'rgba(76, 175, 80, 0.7)',
        'rgba(129, 199, 132, 0.7)',
        'rgba(200, 230, 201, 0.7)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 2,
    }]
  };

  // Enhanced India map data with more states
  const indiaMapData = [
    { state: 'Uttar Pradesh', production: 58, color: '#1f77b4' },
    { state: 'Punjab', production: 31, color: '#ff7f0e' },
    { state: 'Maharashtra', production: 26, color: '#2ca02c' },
    { state: 'Madhya Pradesh', production: 25, color: '#d62728' },
    { state: 'Karnataka', production: 15, color: '#9467bd' },
    { state: 'West Bengal', production: 18, color: '#8c564b' },
    { state: 'Gujarat', production: 14, color: '#e377c2' },
    { state: 'Rajasthan', production: 23, color: '#7f7f7f' },
    { state: 'Andhra Pradesh', production: 21, color: '#bcbd22' },
    { state: 'Tamil Nadu', production: 17, color: '#17becf' },
    { state: 'Bihar', production: 16, color: '#ff9896' },
    { state: 'Haryana', production: 19, color: '#98df8a' },
    { state: 'Odisha', production: 12, color: '#c5b0d5' },
    { state: 'Telangana', production: 14, color: '#ffbb78' },
    { state: 'Assam', production: 8, color: '#aec7e8' },
    { state: 'Chhattisgarh', production: 9, color: '#ff7f0e' },
    { state: 'Kerala', production: 3, color: '#c49c94' },
    { state: 'Jharkhand', production: 6, color: '#f7b6d2' },
    { state: 'Uttarakhand', production: 4, color: '#c7c7c7' },
    { state: 'Himachal Pradesh', production: 2, color: '#dbdb8d' }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const charts = [
    { 
      id: 'production', 
      title: 'Top States - Food Grain Production', 
      type: 'production', 
      icon: <BarChart3 size={16} />,
      component: <Bar data={stateWiseData} options={chartOptions} /> 
    },
    { 
      id: 'crops', 
      title: 'Major Crops Distribution', 
      type: 'distribution', 
      icon: <PieChart size={16} />,
      component: <Doughnut data={cropsData} options={chartOptions} /> 
    },
    { 
      id: 'yield', 
      title: 'Crop Yield Trends', 
      type: 'yield', 
      icon: <TrendingUp size={16} />,
      component: <Line data={yieldTrendsData} options={chartOptions} /> 
    },
    { 
      id: 'irrigation', 
      title: 'Irrigation Coverage by State', 
      type: 'infrastructure', 
      icon: <BarChart3 size={16} />,
      component: <Bar data={irrigationData} options={chartOptions} /> 
    },
    { 
      id: 'seasonal', 
      title: 'Seasonal Production', 
      type: 'production', 
      icon: <PieChart size={16} />,
      component: <Bar data={seasonalData} options={chartOptions} /> 
    },
    { 
      id: 'fertilizer', 
      title: 'Fertilizer Consumption by State', 
      type: 'inputs', 
      icon: <BarChart3 size={16} />,
      component: <Bar data={fertilizerData} options={{
        ...chartOptions,
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: false,
            title: {
              display: true,
              text: 'kg/hectare'
            }
          }
        }
      }} /> 
    },
    // NEW: Agricultural Exports Chart
    { 
      id: 'exports', 
      title: 'Agricultural Exports', 
      type: 'trade', 
      icon: <TrendingUp size={16} />,
      component: <Bar data={exportsData} options={chartOptions} /> 
    },
    // NEW: Farmer Income Trends Chart
    { 
      id: 'income', 
      title: 'Farmer Income Trends', 
      type: 'socioeconomic', 
      icon: <TrendingUp size={16} />,
      component: <Line data={incomeData} options={chartOptions} /> 
    },
    // NEW: Organic Farming Chart
    { 
      id: 'organic', 
      title: 'Organic Farming Coverage', 
      type: 'sustainable', 
      icon: <PieChart size={16} />,
      component: <Doughnut data={organicData} options={chartOptions} /> 
    }
  ];

  const filteredCharts = activeFilter === 'all' ? charts : charts.filter(chart => chart.type === activeFilter);

  // Enhanced India map visualization with more states
  const renderIndiaMap = () => (
    <div className="india-map-container">
      <div className="map-title">Food Grain Production by State (Million Tons)</div>
      <div className="map-wrapper">
        <div className="india-map-image">
          <img 
            src="https://i0.wp.com/indiadatamap.com/wp-content/uploads/2025/08/Total-poultry-production-in-India-state-wise-2025.png?resize=1024%2C1024&ssl=1" 
            alt="India Map" 
            className="map-bg"
          />
          
          <div className="state-markers">
            {indiaMapData.map((stateData, index) => (
              <div
                key={stateData.state}
                className={`state-marker ${stateData.state.toLowerCase().replace(/\s+/g, '')}`}
                data-production={stateData.production}
                onClick={() => setSelectedState(stateData.state)}
                title={`${stateData.state} - ${stateData.production} MT`}
                style={{ backgroundColor: stateData.color }}
              >
                {stateData.state.substring(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color high"></span>
          <span>High Production (25+ MT)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color medium"></span>
          <span>Medium Production (10-25 MT)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color low"></span>
          <span>Low Production (&lt;10 MT)</span>
        </div>
      </div>

      {selectedState && (
        <div className="state-info">
          <h4>{selectedState}</h4>
          <p>Food Grain Production: {indiaMapData.find(s => s.state === selectedState)?.production} Million Tons</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 30px;
          background: rgba(255, 255, 255, 0.95);
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-subtitle {
          font-size: 1.1rem;
          color: #718096;
          margin-bottom: 25px;
        }

        .chart-controls {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .chart-controls button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border: 2px solid #e2e8f0;
          background: white;
          color: #4a5568;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chart-controls button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
          color: #667eea;
        }

        .chart-controls button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .map-section {
          margin: 30px 0;
        }

        .india-map-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .map-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          text-align: center;
          margin-bottom: 20px;
        }

        .map-wrapper {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }

        .india-map-image {
          position: relative;
          max-width: 600px;
          width: 100%;
        }

        .map-bg {
          width: 100%;
          height: auto;
          border-radius: 15px;
          filter: brightness(0.9) contrast(1.1);
        }

        .state-markers {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .state-marker {
          position: absolute;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.3);
          min-width: 40px;
          text-align: center;
        }

        .state-marker:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          z-index: 10;
        }

        /* Enhanced positioning for all major states */
        .state-marker.uttarpradesh { top: 25%; left: 45%; }
        .state-marker.punjab { top: 15%; left: 42%; }
        .state-marker.maharashtra { top: 50%; left: 35%; }
        .state-marker.madhyapradesh { top: 40%; left: 45%; }
        .state-marker.karnataka { top: 65%; left: 40%; }
        .state-marker.westbengal { top: 40%; left: 65%; }
        .state-marker.gujarat { top: 40%; left: 25%; }
        .state-marker.rajasthan { top: 30%; left: 30%; }
        .state-marker.andhrapradesh { top: 65%; left: 45%; }
        .state-marker.tamilnadu { top: 75%; left: 45%; }
        .state-marker.bihar { top: 30%; left: 55%; }
        .state-marker.haryana { top: 20%; left: 45%; }
        .state-marker.odisha { top: 50%; left: 55%; }
        .state-marker.telangana { top: 55%; left: 42%; }
        .state-marker.assam { top: 35%; left: 70%; }
        .state-marker.chhattisgarh { top: 45%; left: 50%; }
        .state-marker.kerala { top: 75%; left: 40%; }
        .state-marker.jharkhand { top: 40%; left: 58%; }
        .state-marker.uttarakhand { top: 20%; left: 48%; }
        .state-marker.himachalpradesh { top: 12%; left: 45%; }

        .map-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #4a5568;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        .legend-color.high { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); }
        .legend-color.medium { background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); }
        .legend-color.low { background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%); }

        .state-info {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 15px;
          margin-top: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .state-info h4 {
          margin: 0 0 10px 0;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .state-info p {
          margin: 0;
          font-size: 1rem;
          opacity: 0.9;
        }

        .key-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 25px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .metric-label {
          font-size: 0.9rem;
          color: #718096;
          font-weight: 500;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 25px;
          margin-top: 30px;
        }

        .chart-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chart-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f7fafc;
        }

        .chart-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3748;
        }

        .chart-actions {
          display: flex;
          gap: 8px;
        }

        .chart-actions button {
          padding: 8px;
          background: #f7fafc;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #718096;
          transition: all 0.2s ease;
        }

        .chart-actions button:hover {
          background: #e2e8f0;
          color: #4a5568;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 15px;
          }
          
          .dashboard-header h1 {
            font-size: 2rem;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .chart-container {
            padding: 20px;
          }
          
          .key-metrics {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
          
          .metric-value {
            font-size: 2rem;
          }
          
          .state-marker {
            padding: 6px 8px;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .chart-controls {
            flex-direction: column;
            align-items: center;
          }
          
          .chart-controls button {
            width: 200px;
            justify-content: center;
          }
          
          .map-legend {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
      
      <div className="dashboard-header">
        <h1>🇮🇳 India Agricultural Analytics Dashboard</h1>
        <p className="dashboard-subtitle">Comprehensive analysis of Indian agriculture sector</p>
        
        <div className="chart-controls">
          <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>
            <Map size={16} /> All Charts
          </button>
          <button className={activeFilter === 'production' ? 'active' : ''} onClick={() => setActiveFilter('production')}>
            <BarChart3 size={16} /> Production
          </button>
          <button className={activeFilter === 'yield' ? 'active' : ''} onClick={() => setActiveFilter('yield')}>
            <TrendingUp size={16} /> Yield
          </button>
          <button className={activeFilter === 'distribution' ? 'active' : ''} onClick={() => setActiveFilter('distribution')}>
            <PieChart size={16} /> Distribution
          </button>
          <button className={activeFilter === 'infrastructure' ? 'active' : ''} onClick={() => setActiveFilter('infrastructure')}>
            Infrastructure
          </button>
          <button className={activeFilter === 'inputs' ? 'active' : ''} onClick={() => setActiveFilter('inputs')}>
            Inputs
          </button>
          <button className={activeFilter === 'trade' ? 'active' : ''} onClick={() => setActiveFilter('trade')}>
            Trade
          </button>
          <button className={activeFilter === 'socioeconomic' ? 'active' : ''} onClick={() => setActiveFilter('socioeconomic')}>
            Socioeconomic
          </button>
          <button className={activeFilter === 'sustainable' ? 'active' : ''} onClick={() => setActiveFilter('sustainable')}>
            Sustainable
          </button>
        </div>
      </div>

      {/* India Map Section */}
      <div className="map-section">
        {renderIndiaMap()}
      </div>

      {/* Enhanced Key Metrics */}
      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-value">315M</div>
          <div className="metric-label">Total Food Grain Production (Tons)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">156M</div>
          <div className="metric-label">Hectares under Cultivation</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">48%</div>
          <div className="metric-label">Irrigation Coverage</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">₹19.5T</div>
          <div className="metric-label">Agricultural GDP</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">28.5M</div>
          <div className="metric-label">Fertilizer Consumption (Tons)</div>
        </div>
        {/* NEW METRICS */}
        <div className="metric-card">
          <div className="metric-value">$53B</div>
          <div className="metric-label">Agricultural Exports (2023)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">162K</div>
          <div className="metric-label">Avg Farmer Income (₹/Year)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">4.3M</div>
          <div className="metric-label">Organic Farming Area (Hectares)</div>
        </div>
      </div>

      <div className="charts-grid">
        {filteredCharts.map((chart) => (
          <div key={chart.id} className="chart-container">
            <div className="chart-header">
              <div className="chart-title">
                {chart.icon}
                {chart.title}
              </div>
              <div className="chart-actions">
                <button title="Download as PNG">
                  <Download size={14} />
                </button>
                <button title="View Data Table">
                  <Table size={14} />
                </button>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              {chart.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartsSection;