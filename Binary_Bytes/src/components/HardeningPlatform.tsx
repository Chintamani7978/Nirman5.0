import { useState, useEffect } from 'react';
import { Shield, Lock, Key, Wifi, Server, Check, AlertTriangle, Play, Download, CheckSquare, Square, Clock, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Camera } from '../context/AppContext';

const getRecommendations = (camera: Camera) => {
  const recommendations = [];
  
  if (!camera.securityChecks.strongPassword) {
    recommendations.push('Enable strong password policy (min 12 chars, special chars, numbers)');
  }
  
  if (!camera.securityChecks.encryption) {
    recommendations.push('Enable encryption for data in transit (TLS/SSL)');
  }
  
  if (!camera.securityChecks.authentication) {
    recommendations.push('Enable multi-factor authentication');
  }
  
  if (!camera.securityChecks.firewall) {
    recommendations.push('Configure firewall rules to restrict access');
  }
  
  if (!camera.securityChecks.firmware) {
    recommendations.push('Update to the latest firmware version');
  }
  
  return recommendations.length > 0 ? recommendations : ['No critical issues detected'];
};

export function HardeningPlatform() {
  const { cameras, updateCamera, showNotification } = useAppContext();
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [isHardening, setIsHardening] = useState(false);
  const [selectedCameras, setSelectedCameras] = useState<Set<string>>(new Set());
  const [hardeningProgress, setHardeningProgress] = useState<{ [key: string]: number }>({});
  const [currentStep, setCurrentStep] = useState<string>('');

  const handleAutoHarden = async (cameraId: string) => {
    try {
      const camera = cameras.find(c => c.id === cameraId);
      if (!camera) {
        console.error('Camera not found');
        return;
      }

      setSelectedCamera(cameraId);
      setIsHardening(true);

      const securityChecks = Object.keys(camera.securityChecks) as Array<keyof Camera['securityChecks']>;
      
      for (const check of securityChecks) {
        if (!camera.securityChecks[check]) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const updatedChecks = {
            ...camera.securityChecks,
            [check]: true
          };
          
          const completedChecks = Object.values(updatedChecks).filter(Boolean).length;
          const totalChecks = securityChecks.length;
          
          const newStatus: 'secure' | 'vulnerable' = 
            completedChecks === totalChecks ? 'secure' : 'vulnerable';
            
          const newRisk: 'critical' | 'high' | 'medium' | 'low' = 
            completedChecks === totalChecks ? 'low' :
            completedChecks >= Math.ceil(totalChecks * 0.75) ? 'medium' :
            completedChecks >= Math.ceil(totalChecks * 0.5) ? 'high' : 'critical';
          
          updateCamera(cameraId, {
            securityChecks: updatedChecks,
            status: newStatus,
            risk: newRisk
          });
        }
      }
    } catch (error) {
      console.error('Error during hardening:', error);
    } finally {
      setIsHardening(false);
      setSelectedCamera(null);
    }
  };

  const handleHardenAll = async () => {
    const camerasToHarden = selectedCameras.size > 0 
      ? cameras.filter(c => selectedCameras.has(c.id))
      : cameras;
    
    if (camerasToHarden.length === 0) {
      showNotification('Please select at least one camera to harden', 'warning');
      return;
    }

    const confirmed = confirm(`Are you sure you want to harden ${camerasToHarden.length} camera(s)? This will take a few moments.`);
    if (!confirmed) return;

    setIsHardening(true);
    
    try {
      for (let i = 0; i < camerasToHarden.length; i++) {
        const camera = camerasToHarden[i];
        setSelectedCamera(camera.id);
        await handleAutoHarden(camera.id);
        
        if (i < camerasToHarden.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      showNotification(`Successfully hardened ${camerasToHarden.length} camera(s)!`, 'success');
      setSelectedCameras(new Set());
    } catch (error) {
      console.error('Error during bulk hardening:', error);
      showNotification('Error during bulk hardening process', 'error');
    } finally {
      setIsHardening(false);
      setSelectedCamera(null);
    }
  };

  const toggleCameraSelection = (cameraId: string) => {
    setSelectedCameras(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cameraId)) {
        newSet.delete(cameraId);
      } else {
        newSet.add(cameraId);
      }
      return newSet;
    });
  };

  const selectAllCameras = () => {
    setSelectedCameras(new Set(cameras.map(c => c.id)));
  };

  const deselectAllCameras = () => {
    setSelectedCameras(new Set());
  };

  const handleExportConfig = () => {
    try {
      const config = {
        generatedAt: new Date().toISOString(),
        system: 'CCTV Security Hardening Configuration',
        version: '1.0',
        cameras: cameras.map(cam => ({
          id: cam.id,
          name: cam.name,
          ip: cam.ip,
          status: cam.status,
          risk: cam.risk,
          lastHardened: new Date().toISOString(),
          securityChecks: {
            ...cam.securityChecks,
            _metadata: {
              lastUpdated: new Date().toISOString(),
              updatedBy: 'auto-hardening-tool'
            }
          },
        })),
      };
      
      const dataStr = JSON.stringify(config, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `security-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('Configuration exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting configuration:', error);
      showNotification('Failed to export configuration', 'error');
    }
  };

  const handleGenerateReport = () => {
    try {
      const now = new Date();
      const securedCameras = cameras.filter(c => c.status === 'secure').length;
      const vulnerableCameras = cameras.filter(c => c.status === 'vulnerable').length;
      
      const report = {
        reportType: 'Security Hardening Report',
        generatedAt: now.toISOString(),
        generatedBy: 'CCTV Security Dashboard',
        summary: {
          totalCameras: cameras.length,
          securedCameras,
          vulnerableCameras,
          securityScore: Math.round((securedCameras / cameras.length) * 100) || 0,
          lastHardened: now.toISOString(),
        },
        cameras: cameras.map(cam => ({
          id: cam.id,
          name: cam.name,
          ip: cam.ip,
          status: cam.status,
          risk: cam.risk,
          securityChecks: {
            ...cam.securityChecks,
            passedChecks: Object.values(cam.securityChecks).filter(Boolean).length,
            totalChecks: Object.keys(cam.securityChecks).length,
            compliancePercentage: Math.round(
              (Object.values(cam.securityChecks).filter(Boolean).length / 
               Object.keys(cam.securityChecks).length) * 100
            )
          },
          recommendations: getRecommendations(cam)
        })),
        _metadata: {
          version: '1.0',
          reportId: `report-${now.getTime()}`,
          format: 'security-scan-v1'
        }
      };
      
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hardening-report-${now.toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('Report generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating report:', error);
      showNotification('Failed to generate report', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A120B] to-[#3C2A21] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#E5E5CB]">Security Hardening Platform</h1>
          <p className="text-[#D5CEA3]">Automated security fixes and configuration management</p>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <span className="text-2xl text-red-400">
                {cameras.filter(c => c.status === 'vulnerable').length}
              </span>
            </div>
            <div className="text-sm text-[#E5E5CB]/70">Vulnerable Cameras</div>
          </div>

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl text-yellow-400">
                {cameras.filter(c => {
                  const completed = Object.values(c.securityChecks).filter(Boolean).length;
                  return completed > 0 && completed < 5;
                }).length}
              </span>
            </div>
            <div className="text-sm text-[#E5E5CB]/70">Partially Secured</div>
          </div>

          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Check className="w-6 h-6 text-green-400" />
              <span className="text-2xl text-green-400">
                {cameras.filter(c => c.status === 'secure').length}
              </span>
            </div>
            <div className="text-sm text-[#E5E5CB]/70">Fully Secured</div>
          </div>
        </div>

        {/* Batch Selection Controls */}
        <div className="mb-6 flex items-center justify-between bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={selectAllCameras}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A120B] text-[#D5CEA3] border border-[#D5CEA3]/30 rounded-lg hover:border-[#D5CEA3] transition-colors text-sm"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Select All</span>
            </button>
            <button
              onClick={deselectAllCameras}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A120B] text-[#D5CEA3] border border-[#D5CEA3]/30 rounded-lg hover:border-[#D5CEA3] transition-colors text-sm"
            >
              <Square className="w-4 h-4" />
              <span>Deselect All</span>
            </button>
            <span className="text-sm text-[#E5E5CB]/60">
              {selectedCameras.size} of {cameras.length} selected
            </span>
          </div>
          <button
            onClick={handleHardenAll}
            disabled={isHardening || selectedCameras.size === 0}
            className="flex items-center gap-2 px-6 py-2 bg-[#D5CEA3] text-[#1A120B] rounded-lg hover:bg-[#E5E5CB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            <span>Harden Selected ({selectedCameras.size})</span>
          </button>
        </div>

        {/* Current Hardening Progress */}
        {isHardening && selectedCamera && currentStep && (
          <div className="mb-6 bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 border-4 border-[#D5CEA3] border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <h3 className="text-lg text-[#E5E5CB] mb-1">Hardening in Progress</h3>
                <p className="text-sm text-[#D5CEA3]">{currentStep}</p>
                <div className="mt-3 w-full bg-[#1A120B] rounded-full h-2">
                  <div 
                    className="bg-[#D5CEA3] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${hardeningProgress[selectedCamera] || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-[#D5CEA3] mt-1">{hardeningProgress[selectedCamera] || 0}% complete</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera List */}
          <div className="lg:col-span-2 space-y-4">
            {cameras.map((camera) => (
              <CameraCard 
                key={camera.id} 
                camera={camera} 
                onHarden={handleAutoHarden}
                isHardening={isHardening && selectedCamera === camera.id}
                isSelected={selectedCameras.has(camera.id)}
                onToggleSelect={() => toggleCameraSelection(camera.id)}
                progress={hardeningProgress[camera.id]}
              />
            ))}
          </div>

          {/* Security Recommendations */}
          <div className="space-y-6">
            <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
              <h3 className="text-lg text-[#E5E5CB] mb-4">Security Recommendations</h3>
              <div className="space-y-4">
                <RecommendationItem
                  icon={<Key className="w-5 h-5" />}
                  title="Password Policy"
                  description="Enforce minimum 12-character passwords with complexity requirements"
                  priority="high"
                />
                <RecommendationItem
                  icon={<Wifi className="w-5 h-5" />}
                  title="Enable Encryption"
                  description="Use RTSPS or WPA3 for secure streaming"
                  priority="critical"
                />
                <RecommendationItem
                  icon={<Shield className="w-5 h-5" />}
                  title="Network Segmentation"
                  description="Isolate cameras on separate VLAN"
                  priority="high"
                />
                <RecommendationItem
                  icon={<Server className="w-5 h-5" />}
                  title="Firmware Updates"
                  description="Update to latest security patches"
                  priority="medium"
                />
              </div>
            </div>

            <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
              <h3 className="text-lg text-[#E5E5CB] mb-4">Bulk Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleHardenAll}
                  disabled={isHardening}
                  className="w-full px-4 py-2 bg-[#D5CEA3] text-[#1A120B] rounded-lg hover:bg-[#E5E5CB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Harden All Cameras
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1A120B]/40 text-[#E5E5CB] border border-[#D5CEA3]/20 rounded-lg hover:border-[#D5CEA3]/40 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
                <button 
                  onClick={handleExportConfig}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1A120B]/40 text-[#E5E5CB] border border-[#D5CEA3]/20 rounded-lg hover:border-[#D5CEA3]/40 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Config</span>
                </button>
              </div>
            </div>

            <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
              <h3 className="text-lg text-[#E5E5CB] mb-4">Compliance Status</h3>
              <div className="space-y-3">
                <ComplianceItem label="NIST Cybersecurity Framework" status="partial" />
                <ComplianceItem label="ISO 27001" status="compliant" />
                <ComplianceItem label="GDPR Requirements" status="partial" />
                <ComplianceItem label="SOC 2 Type II" status="non-compliant" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CameraCardProps {
  camera: {
    id: string;
    name: string;
    ip: string;
    status: 'secure' | 'vulnerable';
    risk: 'critical' | 'high' | 'medium' | 'low';
    securityChecks: {
      strongPassword: boolean;
      encryption: boolean;
      authentication: boolean;
      firewall: boolean;
      firmware: boolean;
    };
  };
  onHarden: (cameraId: string) => void;
  isHardening: boolean;
}

function CameraCard({ camera, onHarden, isHardening, isSelected = false, onToggleSelect, progress }: CameraCardProps) {
  const statusColors = {
    vulnerable: 'border-red-500/50 bg-red-500/10',
    secure: 'border-green-500/50 bg-green-500/10',
  };

  const completedChecks = Object.values(camera.securityChecks).filter(Boolean).length;
  const totalChecks = Object.keys(camera.securityChecks).length;
  const securityProgress = (completedChecks / totalChecks) * 100;
  const hardeningProgressValue = progress || 0;

  return (
    <div className={`bg-[#3C2A21]/40 backdrop-blur-sm border-2 rounded-lg p-6 transition-all ${
      isSelected ? 'border-[#D5CEA3] ring-2 ring-[#D5CEA3]/30' : statusColors[camera.status]
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {onToggleSelect && (
            <button
              onClick={onToggleSelect}
              className="mt-1 p-1 hover:bg-[#1A120B]/40 rounded transition-colors"
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-[#D5CEA3]" />
              ) : (
                <Square className="w-5 h-5 text-[#E5E5CB]/40" />
              )}
            </button>
          )}
          <div className="flex-1">
            <h3 className="text-xl text-[#E5E5CB] mb-1">{camera.name}</h3>
            <div className="text-sm text-[#E5E5CB]/60">{camera.id} • {camera.ip}</div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs uppercase ${
          camera.status === 'vulnerable' ? 'bg-red-500/20 text-red-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {camera.status}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[#E5E5CB]/70">
            {isHardening && hardeningProgressValue > 0 ? 'Hardening Progress' : 'Security Configuration'}
          </span>
          <span className="text-[#D5CEA3]">
            {isHardening && hardeningProgressValue > 0 
              ? `${hardeningProgressValue}%` 
              : `${completedChecks}/${totalChecks}`}
          </span>
        </div>
        <div className="h-2 bg-[#1A120B] rounded-full overflow-hidden">
          {isHardening && hardeningProgressValue > 0 ? (
            <div 
              className="h-full bg-[#D5CEA3] transition-all duration-300"
              style={{ width: `${hardeningProgressValue}%` }}
            ></div>
          ) : (
            <div 
              className={`h-full transition-all duration-500 ${
                securityProgress === 100 ? 'bg-green-500' : securityProgress > 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${securityProgress}%` }}
            ></div>
          )}
        </div>
      </div>

      {/* Security Checks */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <SecurityCheck 
          label="Strong Password"
          enabled={camera.securityChecks.strongPassword}
          isProcessing={isHardening && !camera.securityChecks.strongPassword}
        />
        <SecurityCheck 
          label="Stream Encryption"
          enabled={camera.securityChecks.encryption}
          isProcessing={isHardening && !camera.securityChecks.encryption}
        />
        <SecurityCheck 
          label="Authentication"
          enabled={camera.securityChecks.authentication}
          isProcessing={isHardening && !camera.securityChecks.authentication}
        />
        <SecurityCheck 
          label="Firewall Rules"
          enabled={camera.securityChecks.firewall}
          isProcessing={isHardening && !camera.securityChecks.firewall}
        />
        <SecurityCheck 
          label="Firmware Updated"
          enabled={camera.securityChecks.firmware}
          isProcessing={isHardening && !camera.securityChecks.firmware}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => onHarden(camera.id)}
          disabled={isHardening || camera.status === 'secure'}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#D5CEA3] text-[#1A120B] rounded-lg hover:bg-[#E5E5CB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isHardening ? (
            <>
              <div className="w-4 h-4 border-2 border-[#1A120B] border-t-transparent rounded-full animate-spin"></div>
              <span>Hardening...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Auto-Harden</span>
            </>
          )}
        </button>
        <button className="px-4 py-2 bg-[#1A120B]/40 text-[#E5E5CB] border border-[#D5CEA3]/20 rounded-lg hover:border-[#D5CEA3]/40 transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SecurityCheck({ 
  label, 
  enabled, 
  isProcessing 
}: { 
  label: string; 
  enabled: boolean; 
  isProcessing: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border ${
      enabled 
        ? 'bg-green-500/10 border-green-500/30' 
        : 'bg-[#1A120B]/40 border-[#D5CEA3]/10'
    }`}>
      {isProcessing ? (
        <div className="w-4 h-4 border-2 border-[#D5CEA3] border-t-transparent rounded-full animate-spin"></div>
      ) : enabled ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ${enabled ? 'text-green-400' : 'text-[#E5E5CB]/60'}`}>
        {label}
      </span>
    </div>
  );
}

function RecommendationItem({ 
  icon, 
  title, 
  description, 
  priority 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  priority: 'critical' | 'high' | 'medium' | 'low';
}) {
  const priorityColors = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-blue-400',
  };

  return (
    <div className="flex gap-3">
      <div className={`flex-shrink-0 ${priorityColors[priority]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm text-[#E5E5CB]">{title}</h4>
          <span className={`text-xs px-2 py-0.5 rounded uppercase ${
            priority === 'critical' ? 'bg-red-500/20 text-red-400' :
            priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
            priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-blue-500/20 text-blue-400'
          }`}>
            {priority}
          </span>
        </div>
        <p className="text-xs text-[#E5E5CB]/60">{description}</p>
      </div>
    </div>
  );
}

function ComplianceItem({ 
  label, 
  status 
}: { 
  label: string; 
  status: 'compliant' | 'partial' | 'non-compliant';
}) {
  const statusConfig = {
    compliant: { color: 'text-green-400', icon: '✓', bg: 'bg-green-500/20' },
    partial: { color: 'text-yellow-400', icon: '⚠', bg: 'bg-yellow-500/20' },
    'non-compliant': { color: 'text-red-400', icon: '✗', bg: 'bg-red-500/20' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#E5E5CB]">{label}</span>
      <div className={`flex items-center gap-1 px-2 py-1 rounded ${config.bg} ${config.color} text-xs`}>
        <span>{config.icon}</span>
        <span className="capitalize">{status === 'non-compliant' ? 'Non-Compliant' : status}</span>
      </div>
    </div>
  );
}
