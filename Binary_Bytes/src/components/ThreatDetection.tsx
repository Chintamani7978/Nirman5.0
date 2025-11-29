import { useState, useEffect } from 'react';
import { AlertTriangle, Activity, Shield, Eye, Bell, Filter, Download, Search, X, Clock, MapPin, User, Info, Camera } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';

export function ThreatDetection() {
  const { threats, updateThreat, addThreat, cameras } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'investigating' | 'resolved'>('all');
  const [liveThreats, setLiveThreats] = useState<string[]>([]);
  const [alertSettings, setAlertSettings] = useState({
    email: true,
    sms: false,
    push: true,
    webhook: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);
  const [selectedThreats, setSelectedThreats] = useState<Set<string>>(new Set());

  const threatData = [
    { time: '00:00', threats: 2 },
    { time: '04:00', threats: 1 },
    { time: '08:00', threats: 4 },
    { time: '12:00', threats: 3 },
    { time: '16:00', threats: 7 },
    { time: '20:00', threats: 5 },
    { time: '23:59', threats: 3 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const threatTypes = [
        'Port scan detected on CAM-001',
        'Suspicious traffic pattern from 192.168.1.45',
        'Failed authentication attempt on CAM-003',
        'Unusual stream access spike detected',
        'Brute force attack prevented',
        'Unknown device attempting connection',
      ];
      const newThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      setLiveThreats(prev => [newThreat, ...prev].slice(0, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const threatTypes: Array<'unauthorized_access' | 'brute_force' | 'anomaly' | 'intrusion'> = [
          'unauthorized_access', 'brute_force', 'anomaly', 'intrusion'
        ];
        const severities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
        
        const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
        
        const newThreat = {
          id: `THR-${String(threats.length + 1).padStart(3, '0')}`,
          timestamp: new Date().toISOString(),
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          camera: randomCamera?.id || 'CAM-001',
          description: 'New security threat detected - automated monitoring alert',
          status: 'active' as const,
        };
        
        addThreat(newThreat);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [threats.length, cameras, addThreat]);

  const filteredThreats = threats.filter(threat => {
    const severityMatch = filter === 'all' || threat.severity === filter;
    const statusMatch = statusFilter === 'all' || threat.status === statusFilter;
    const searchMatch = searchQuery === '' || 
      threat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.camera.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.type.toLowerCase().includes(searchQuery.toLowerCase());
    return severityMatch && statusMatch && searchMatch;
  });

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleBlockAllThreats = () => {
    const confirmed = confirm('Are you sure you want to block all active threats?');
    if (confirmed) {
      threats.forEach(threat => {
        if (threat.status === 'active') {
          updateThreat(threat.id, { status: 'resolved' });
        }
      });
      alert('All active threats have been blocked!');
    }
  };

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      totalThreats: threats.length,
      activeThreats: threats.filter(t => t.status === 'active').length,
      threats: threats,
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `threat-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleThreatAction = (threatId: string, action: 'investigating' | 'resolved' | 'ignore') => {
    if (action === 'ignore') {
      const confirmed = confirm('Are you sure you want to ignore this threat?');
      if (!confirmed) return;
      updateThreat(threatId, { status: 'resolved' });
    } else {
      updateThreat(threatId, { status: action });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A120B] to-[#3C2A21] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#E5E5CB]">Threat Detection & Monitoring</h1>
          <p className="text-[#D5CEA3]">Real-time security threat analysis and intrusion detection</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatBox
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Active Threats"
            value={threats.filter(t => t.status === 'active').length}
            color="red"
          />
          <StatBox
            icon={<Eye className="w-6 h-6" />}
            label="Under Investigation"
            value={threats.filter(t => t.status === 'investigating').length}
            color="yellow"
          />
          <StatBox
            icon={<Shield className="w-6 h-6" />}
            label="Resolved Today"
            value={threats.filter(t => t.status === 'resolved').length}
            color="green"
          />
          <StatBox
            icon={<Activity className="w-6 h-6" />}
            label="Monitored Cameras"
            value={cameras.length}
            color="blue"
          />
        </div>

        {/* Threat Timeline Chart */}
        <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6 mb-8">
          <h3 className="text-xl text-[#E5E5CB] mb-4">24-Hour Threat Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={threatData}>
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
              <Area 
                type="monotone" 
                dataKey="threats" 
                stroke="#ff4444" 
                fill="#ff4444" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Threat List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-4 mb-4">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D5CEA3]/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search threats by description, source, camera, or type..."
                    className="w-full bg-[#1A120B] border border-[#D5CEA3]/30 rounded-lg pl-10 pr-10 py-2 text-[#E5E5CB] placeholder-[#E5E5CB]/30 focus:outline-none focus:border-[#D5CEA3]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#D5CEA3]/50 hover:text-[#D5CEA3]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#D5CEA3]" />
                  <span className="text-[#E5E5CB]">Filters:</span>
                </div>
                
                <div className="flex gap-2">
                  <FilterButton 
                    label="All" 
                    active={filter === 'all'} 
                    onClick={() => setFilter('all')} 
                  />
                  <FilterButton 
                    label="Critical" 
                    active={filter === 'critical'} 
                    onClick={() => setFilter('critical')}
                    color="red"
                  />
                  <FilterButton 
                    label="High" 
                    active={filter === 'high'} 
                    onClick={() => setFilter('high')}
                    color="orange"
                  />
                  <FilterButton 
                    label="Medium" 
                    active={filter === 'medium'} 
                    onClick={() => setFilter('medium')}
                    color="yellow"
                  />
                </div>

                <div className="flex gap-2">
                  <FilterButton 
                    label="Active" 
                    active={statusFilter === 'active'} 
                    onClick={() => setStatusFilter('active')}
                  />
                  <FilterButton 
                    label="Investigating" 
                    active={statusFilter === 'investigating'} 
                    onClick={() => setStatusFilter('investigating')}
                  />
                  <FilterButton 
                    label="Resolved" 
                    active={statusFilter === 'resolved'} 
                    onClick={() => setStatusFilter('resolved')}
                  />
                </div>
              </div>
            </div>

            {/* Threats */}
            <div className="space-y-4">
              {filteredThreats.length === 0 ? (
                <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-8 text-center">
                  <Shield className="w-12 h-12 text-[#D5CEA3] mx-auto mb-3 opacity-50" />
                  <p className="text-[#E5E5CB]/60">No threats match the selected filters</p>
                </div>
              ) : (
                filteredThreats.map((threat) => (
                  <ThreatCard 
                    key={threat.id} 
                    threat={threat} 
                    getTimeAgo={getTimeAgo}
                    onAction={handleThreatAction}
                    onViewDetails={() => setSelectedThreat(threat.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Live Feed Sidebar */}
          <div className="space-y-6">
            {/* Live Monitoring */}
            <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg text-[#E5E5CB]">Live Monitoring</h3>
              </div>
              <div className="space-y-3">
                {liveThreats.length === 0 ? (
                  <p className="text-sm text-[#E5E5CB]/50">Waiting for activity...</p>
                ) : (
                  liveThreats.map((threat, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-[#1A120B]/40 border border-[#D5CEA3]/10 rounded text-sm text-[#E5E5CB]/70 animate-fadeIn"
                    >
                      {threat}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
              <h3 className="text-lg text-[#E5E5CB] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleBlockAllThreats}
                  className="w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Block All Threats
                </button>
                <button 
                  onClick={handleExportReport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#D5CEA3]/20 text-[#D5CEA3] border border-[#D5CEA3]/30 rounded-lg hover:bg-[#D5CEA3]/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
                <button 
                  onClick={() => alert('Alert configuration panel would open here')}
                  className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Configure Alerts
                </button>
              </div>
            </div>

            {/* Alert Settings */}
            <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-[#D5CEA3]" />
                <h3 className="text-lg text-[#E5E5CB]">Alert Settings</h3>
              </div>
              <div className="space-y-3">
                <ToggleSetting 
                  label="Email Notifications" 
                  enabled={alertSettings.email}
                  onToggle={() => setAlertSettings(prev => ({ ...prev, email: !prev.email }))}
                />
                <ToggleSetting 
                  label="SMS Alerts" 
                  enabled={alertSettings.sms}
                  onToggle={() => setAlertSettings(prev => ({ ...prev, sms: !prev.sms }))}
                />
                <ToggleSetting 
                  label="Push Notifications" 
                  enabled={alertSettings.push}
                  onToggle={() => setAlertSettings(prev => ({ ...prev, push: !prev.push }))}
                />
                <ToggleSetting 
                  label="Webhook Integration" 
                  enabled={alertSettings.webhook}
                  onToggle={() => setAlertSettings(prev => ({ ...prev, webhook: !prev.webhook }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Threat Details Modal */}
        {selectedThreat && (
          <ThreatDetailsModal
            threatId={selectedThreat}
            threats={threats}
            onClose={() => setSelectedThreat(null)}
            getTimeAgo={getTimeAgo}
            onAction={handleThreatAction}
          />
        )}
      </div>
    </div>
  );
}

function ThreatDetailsModal({
  threatId,
  threats,
  onClose,
  getTimeAgo,
  onAction
}: {
  threatId: string;
  threats: any[];
  onClose: () => void;
  getTimeAgo: (timestamp: string) => string;
  onAction: (threatId: string, action: 'investigating' | 'resolved' | 'ignore') => void;
}) {
  const threat = threats.find(t => t.id === threatId);
  
  if (!threat) return null;

  const severityColors = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-blue-400',
  };

  const typeLabels = {
    unauthorized_access: 'Unauthorized Access',
    brute_force: 'Brute Force Attack',
    anomaly: 'Anomaly Detected',
    intrusion: 'Intrusion Attempt',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#3C2A21] border border-[#D5CEA3]/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#3C2A21] border-b border-[#D5CEA3]/20 p-6 flex items-center justify-between">
          <h2 className="text-2xl text-[#E5E5CB]">Threat Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A120B] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#E5E5CB]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Threat ID and Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl text-[#E5E5CB] mb-2">{threat.id}</div>
              <div className="text-sm text-[#D5CEA3]">{getTimeAgo(threat.timestamp)}</div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-semibold mb-1 ${severityColors[threat.severity]}`}>
                {threat.severity.toUpperCase()}
              </div>
              <div className={`text-xs px-3 py-1 rounded-full inline-block ${
                threat.status === 'active' ? 'bg-red-500/20 text-red-400' :
                threat.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {threat.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-[#D5CEA3]" />
              <h3 className="text-lg text-[#E5E5CB]">Description</h3>
            </div>
            <p className="text-[#E5E5CB]/80 bg-[#1A120B]/40 p-4 rounded-lg border border-[#D5CEA3]/10">
              {threat.description}
            </p>
          </div>

          {/* Threat Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem icon={<User className="w-5 h-5" />} label="Threat Type" value={typeLabels[threat.type]} />
            <DetailItem icon={<MapPin className="w-5 h-5" />} label="Source IP" value={threat.source} />
            <DetailItem icon={<Camera className="w-5 h-5" />} label="Camera ID" value={threat.camera} />
            <DetailItem icon={<Clock className="w-5 h-5" />} label="Detected" value={new Date(threat.timestamp).toLocaleString()} />
          </div>

          {/* Actions */}
          {threat.status !== 'resolved' && (
            <div className="flex gap-3 pt-4 border-t border-[#D5CEA3]/20">
              <button
                onClick={() => {
                  onAction(threat.id, 'investigating');
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-[#D5CEA3] text-[#1A120B] rounded-lg hover:bg-[#E5E5CB] transition-colors"
              >
                Mark as Investigating
              </button>
              <button
                onClick={() => {
                  onAction(threat.id, 'resolved');
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Resolve & Block
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[#1A120B]/40 p-4 rounded-lg border border-[#D5CEA3]/10">
      <div className="flex items-center gap-2 mb-2 text-[#D5CEA3]">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-[#E5E5CB] font-medium">{value}</div>
    </div>
  );
}

function StatBox({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  color: 'red' | 'yellow' | 'green' | 'blue';
}) {
  const colors = {
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div className={`border rounded-lg p-6 ${colors[color]}`}>
      <div className="mb-3">{icon}</div>
      <div className="text-3xl mb-1">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}

function FilterButton({ 
  label, 
  active, 
  onClick, 
  color 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
  color?: 'red' | 'orange' | 'yellow';
}) {
  const colors = {
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-sm transition-colors ${
        active 
          ? color ? colors[color] : 'bg-[#D5CEA3] text-[#1A120B]'
          : 'bg-[#1A120B]/40 text-[#E5E5CB]/60 border border-[#D5CEA3]/20 hover:border-[#D5CEA3]/40'
      }`}
    >
      {label}
    </button>
  );
}

interface ThreatCardProps {
  threat: {
    id: string;
    timestamp: string;
    type: 'unauthorized_access' | 'brute_force' | 'anomaly' | 'intrusion';
    severity: 'critical' | 'high' | 'medium' | 'low';
    source: string;
    camera: string;
    description: string;
    status: 'active' | 'investigating' | 'resolved';
  };
  getTimeAgo: (timestamp: string) => string;
  onAction: (threatId: string, action: 'investigating' | 'resolved' | 'ignore') => void;
  onViewDetails: () => void;
}

function ThreatCard({ threat, getTimeAgo, onAction, onViewDetails }: ThreatCardProps) {
  const severityColors = {
    critical: 'border-red-500/50 bg-red-500/10',
    high: 'border-orange-500/50 bg-orange-500/10',
    medium: 'border-yellow-500/50 bg-yellow-500/10',
    low: 'border-blue-500/50 bg-blue-500/10',
  };

  const statusColors = {
    active: 'bg-red-500/20 text-red-400',
    investigating: 'bg-yellow-500/20 text-yellow-400',
    resolved: 'bg-green-500/20 text-green-400',
  };

  const typeIcons = {
    unauthorized_access: '🚫',
    brute_force: '🔨',
    anomaly: '⚠️',
    intrusion: '🔓',
  };

  return (
    <div className={`bg-[#3C2A21]/40 backdrop-blur-sm border-2 rounded-lg p-6 ${severityColors[threat.severity]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{typeIcons[threat.type]}</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg text-[#E5E5CB]">{threat.id}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[threat.status]}`}>
                {threat.status.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-[#E5E5CB]/60">{getTimeAgo(threat.timestamp)}</div>
          </div>
        </div>
        <div className={`text-xs px-3 py-1 rounded-full uppercase ${
          threat.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
          threat.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
          threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {threat.severity}
        </div>
      </div>

      <p className="text-[#E5E5CB] mb-4">{threat.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-[#D5CEA3] mb-1">Source IP</div>
          <div className="text-sm text-[#E5E5CB]">{threat.source}</div>
        </div>
        <div>
          <div className="text-xs text-[#D5CEA3] mb-1">Camera ID</div>
          <div className="text-sm text-[#E5E5CB]">{threat.camera}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onViewDetails}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-colors text-sm"
        >
          <Info className="w-4 h-4" />
          <span>View Details</span>
        </button>
        {threat.status !== 'resolved' && (
          <>
            <button 
              onClick={() => onAction(threat.id, 'investigating')}
              className="flex-1 px-4 py-2 bg-[#D5CEA3] text-[#1A120B] rounded hover:bg-[#E5E5CB] transition-colors text-sm"
            >
              Investigate
            </button>
            <button 
              onClick={() => onAction(threat.id, 'resolved')}
              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors text-sm"
            >
              Block
            </button>
            <button 
              onClick={() => onAction(threat.id, 'ignore')}
              className="px-4 py-2 bg-[#1A120B]/40 text-[#E5E5CB] border border-[#D5CEA3]/20 rounded hover:border-[#D5CEA3]/40 transition-colors text-sm"
            >
              Ignore
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ToggleSetting({ 
  label, 
  enabled,
  onToggle
}: { 
  label: string; 
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#E5E5CB]">{label}</span>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          enabled ? 'bg-green-500' : 'bg-[#1A120B]'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}></div>
      </button>
    </div>
  );
}
