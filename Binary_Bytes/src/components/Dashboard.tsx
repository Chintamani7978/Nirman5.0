import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Camera, Lock, Activity, TrendingUp, TrendingDown, Zap, Search, Bell, X, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StreamViewer } from './StreamViewer';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { cameras, threats, stats, updateCamera } = useAppContext();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'info' | 'warning' | 'success'; timestamp: Date }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [realtimeData, setRealtimeData] = useState<Array<{ time: string; threats: number; scans: number }>>([
    { time: '00:00', threats: 2, scans: 15 },
    { time: '04:00', threats: 1, scans: 22 },
    { time: '08:00', threats: 4, scans: 35 },
    { time: '12:00', threats: 3, scans: 28 },
    { time: '16:00', threats: 5, scans: 42 },
    { time: '20:00', threats: 3, scans: 31 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => {
        const newData = [...prev];
        const lastEntry = newData[newData.length - 1];
        const hour = parseInt(lastEntry.time.split(':')[0]);
        const nextHour = (hour + 1) % 24;
        newData.push({
          time: `${String(nextHour).padStart(2, '0')}:00`,
          threats: Math.floor(Math.random() * 6) + 1,
          scans: Math.floor(Math.random() * 30) + 20,
        });
        return newData.slice(-6);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const vulnerabilityData = [
    { name: 'Critical', value: cameras.filter(c => c.risk === 'critical').length, color: '#ff4444' },
    { name: 'High', value: cameras.filter(c => c.risk === 'high').length, color: '#ff8844' },
    { name: 'Medium', value: cameras.filter(c => c.risk === 'medium').length, color: '#D5CEA3' },
    { name: 'Low', value: cameras.filter(c => c.risk === 'low').length, color: '#88cc88' },
  ];

  const recentAlerts = threats.slice(0, 3);

  const liveCameras = cameras.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A120B] to-[#3C2A21] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl mb-2 text-[#E5E5CB]">Security Operations Center</h1>
            <p className="text-[#D5CEA3]">Real-time CCTV network monitoring and threat analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-[#3C2A21]/40 border border-[#D5CEA3]/20 rounded-lg hover:border-[#D5CEA3] transition-colors"
            >
              <Bell className="w-5 h-5 text-[#D5CEA3]" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="mb-6 bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-[#E5E5CB] flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <span>Notifications ({notifications.length})</span>
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-[#1A120B] rounded"
              >
                <X className="w-4 h-4 text-[#E5E5CB]" />
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-[#E5E5CB]/60 text-center py-4">No new notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${
                      notif.type === 'warning' ? 'bg-red-500/10 border-red-500/30' :
                      notif.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                      'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-[#E5E5CB] flex-1">{notif.message}</p>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="p-1 hover:bg-[#1A120B]/40 rounded"
                      >
                        <X className="w-3 h-3 text-[#E5E5CB]/60" />
                      </button>
                    </div>
                    <p className="text-xs text-[#E5E5CB]/50 mt-1">
                      {notif.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/scanner')}
            className="flex items-center gap-3 p-4 bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg hover:border-[#D5CEA3] transition-colors group"
          >
            <div className="p-3 bg-[#D5CEA3]/10 rounded-lg group-hover:bg-[#D5CEA3]/20 transition-colors">
              <Search className="w-6 h-6 text-[#D5CEA3]" />
            </div>
            <div className="text-left">
              <div className="text-[#E5E5CB] font-medium">Quick Scan</div>
              <div className="text-sm text-[#E5E5CB]/60">Scan a camera for vulnerabilities</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/hardening')}
            className="flex items-center gap-3 p-4 bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg hover:border-[#D5CEA3] transition-colors group"
          >
            <div className="p-3 bg-[#D5CEA3]/10 rounded-lg group-hover:bg-[#D5CEA3]/20 transition-colors">
              <Zap className="w-6 h-6 text-[#D5CEA3]" />
            </div>
            <div className="text-left">
              <div className="text-[#E5E5CB] font-medium">Auto-Harden</div>
              <div className="text-sm text-[#E5E5CB]/60">Secure all vulnerable cameras</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/threats')}
            className="flex items-center gap-3 p-4 bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg hover:border-[#D5CEA3] transition-colors group"
          >
            <div className="p-3 bg-[#D5CEA3]/10 rounded-lg group-hover:bg-[#D5CEA3]/20 transition-colors">
              <AlertTriangle className="w-6 h-6 text-[#D5CEA3]" />
            </div>
            <div className="text-left">
              <div className="text-[#E5E5CB] font-medium">View Threats</div>
              <div className="text-sm text-[#E5E5CB]/60">{stats.activeThreats} active threats</div>
            </div>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Camera className="w-6 h-6" />}
            label="Total Cameras"
            value={stats.totalCameras}
            trend="+2"
            trendUp={true}
          />
          <StatCard
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Vulnerable Cameras"
            value={stats.vulnerableCameras}
            trend="-3"
            trendUp={false}
            alert={true}
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Active Threats"
            value={stats.activeThreats}
            trend="+1"
            trendUp={false}
            alert={true}
          />
          <StatCard
            icon={<Shield className="w-6 h-6" />}
            label="Secured Cameras"
            value={stats.securedCameras}
            trend="+5"
            trendUp={true}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
            <h3 className="text-xl text-[#E5E5CB] mb-4">Real-time Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D5CEA3" opacity={0.1} />
                <XAxis dataKey="time" stroke="#D5CEA3" />
                <YAxis stroke="#D5CEA3" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#3C2A21', 
                    border: '1px solid #D5CEA3',
                    borderRadius: '8px',
                    color: '#E5E5CB'
                  }} 
                />
                <Area type="monotone" dataKey="threats" stroke="#ff4444" fill="#ff4444" fillOpacity={0.3} />
                <Area type="monotone" dataKey="scans" stroke="#D5CEA3" fill="#D5CEA3" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Vulnerability Distribution */}
          <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
            <h3 className="text-xl text-[#E5E5CB] mb-4">Vulnerability Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vulnerabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vulnerabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#3C2A21', 
                    border: '1px solid #D5CEA3',
                    borderRadius: '8px',
                    color: '#E5E5CB'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {vulnerabilityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[#E5E5CB]/70">{item.name}</span>
                  </div>
                  <span className="text-[#E5E5CB]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Streams and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Live Camera Feeds */}
          <div className="lg:col-span-2 bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
            <h3 className="text-xl text-[#E5E5CB] mb-4">Live Camera Feeds</h3>
            <div className="grid grid-cols-2 gap-4">
              {liveCameras.map((camera) => (
                <StreamViewer key={camera.id} camera={camera} />
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
            <h3 className="text-xl text-[#E5E5CB] mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              {recentAlerts.length === 0 ? (
                <div className="text-center py-8 text-[#E5E5CB]/50">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No recent alerts</p>
                </div>
              ) : (
                recentAlerts.map((alert) => {
                  const getTimeAgo = (timestamp: string) => {
                    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
                    if (seconds < 60) return 'Just now';
                    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
                    return `${Math.floor(seconds / 3600)} hours ago`;
                  };

                  const camera = cameras.find(c => c.id === alert.camera);
                  
                  return (
                    <div 
                      key={alert.id}
                      className={`p-4 rounded-lg border transition-all ${
                        alert.severity === 'critical' 
                          ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50' 
                          : alert.severity === 'high'
                          ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50'
                          : 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                          alert.severity === 'critical' 
                            ? 'text-red-500' 
                            : alert.severity === 'high'
                            ? 'text-orange-500'
                            : 'text-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <div className="text-xs text-[#D5CEA3] mb-1">{alert.camera}</div>
                          <div className="text-sm text-[#E5E5CB] mb-1">{alert.description}</div>
                          <div className="text-xs text-[#E5E5CB]/50 mb-2">{getTimeAgo(alert.timestamp)}</div>
                          {camera && camera.status === 'vulnerable' && (
                            <button
                              onClick={() => handleQuickHarden(camera.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-[#D5CEA3]/20 text-[#D5CEA3] rounded text-xs hover:bg-[#D5CEA3]/30 transition-colors"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Quick Harden</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  trend, 
  trendUp, 
  alert 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  trend: string; 
  trendUp: boolean;
  alert?: boolean;
}) {
  return (
    <div className={`bg-[#3C2A21]/40 backdrop-blur-sm border rounded-lg p-6 ${
      alert ? 'border-red-500/30' : 'border-[#D5CEA3]/20'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${
          alert ? 'bg-red-500/20 text-red-400' : 'bg-[#D5CEA3]/20 text-[#D5CEA3]'
        }`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          trendUp ? 'text-green-400' : 'text-red-400'
        }`}>
          {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{trend}</span>
        </div>
      </div>
      <div className="text-3xl text-[#E5E5CB] mb-1">{value}</div>
      <div className="text-sm text-[#E5E5CB]/60">{label}</div>
    </div>
  );
}