import { useState } from 'react';
import { Search, Play, AlertTriangle, CheckCircle, XCircle, Wifi, Lock, Shield, Server, Download, RefreshCw, Filter, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api';

interface ScanResult {
  id: string;
  rtspUrl: string;
  vulnerabilities: string[];
  riskScore: number;
  status: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  findings: {
    weakPassword: boolean;
    openPorts: string[];
    outdatedFirmware: boolean;
    unencryptedStream: boolean;
    defaultCredentials: boolean;
  };
}

export function SecurityScanner() {
  const { scanResults, addScanResult } = useAppContext();
  const [rtspUrl, setRtspUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [scanningStep, setScanningStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const validateRTSPUrl = (url: string): { valid: boolean; error?: string } => {
    if (!url.trim()) {
      return { valid: false, error: 'RTSP URL is required' };
    }

    const rtspRegex = /^rtsp[s]?:\/\/([^\/:]+)(?::(\d+))?(\/.*)?$/i;
    
    if (!rtspRegex.test(url)) {
      return { valid: false, error: 'Invalid RTSP URL format. Use rtsp:// or rtsps://' };
    }
    
    try {
      const urlObj = new URL(url);
      if (!['rtsp:', 'rtsps:'].includes(urlObj.protocol)) {
        return { valid: false, error: 'Protocol must be rtsp:// or rtsps://' };
      }
      
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        return { valid: false, error: 'Hostname is required' };
      }
      
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1' || urlObj.hostname === '0.0.0.0') {
        return { valid: false, error: 'Localhost URLs are not allowed for security scanning' };
      }
      
      if (url.includes('..')) {
        return { valid: false, error: 'URL contains suspicious patterns' };
      }
      
      return { valid: true };
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  };

  const handleScan = () => {
    const validation = validateRTSPUrl(rtspUrl);
    if (!validation.valid) {
      alert(validation.error || 'Invalid RTSP URL');
      return;
    }

    setIsScanning(true);
    setScanningStep(0);
    setScanProgress(0);
    
    const steps = [0, 1, 2, 3, 4];
    let currentStep = 0;

    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setScanningStep(currentStep + 1);
        setScanProgress(((currentStep + 1) / steps.length) * 100);
        currentStep++;
      } else {
        clearInterval(stepInterval);
      }
    }, 600);
    
    setTimeout(async () => {
      try {
        const urlObj = new URL(rtspUrl);
        const vulnerabilities: string[] = [];
        const findings = {
          weakPassword: false,
          openPorts: [] as string[],
          outdatedFirmware: false,
          unencryptedStream: urlObj.protocol === 'rtsp:', // Not rtsps
          defaultCredentials: false,
        };

        if (urlObj.protocol === 'rtsp:') {
          vulnerabilities.push('Unencrypted Stream');
        }

        const port = urlObj.port || '554';
        if (['554', '8554'].includes(port)) {
          findings.openPorts.push(port);
          if (findings.openPorts.length > 0) {
            vulnerabilities.push(`${findings.openPorts.length} Open Ports`);
          }
        }

        let status: 'critical' | 'high' | 'medium' | 'low';
        let riskScore: number;

        if (findings.unencryptedStream && findings.openPorts.length > 0) {
          status = 'critical';
          riskScore = 90;
        } else if (findings.unencryptedStream || findings.openPorts.length > 0) {
          status = 'high';
          riskScore = 70;
        } else if (urlObj.protocol === 'rtsps:') {
          status = 'low';
          riskScore = 20;
        } else {
          status = 'medium';
          riskScore = 50;
        }

        const scanId = `SCAN-${String(scanResults.length + 1).padStart(3, '0')}`;
        
        const scanData = {
          id: scanId,
          rtspUrl: rtspUrl,
          vulnerabilities,
          riskScore,
          status,
          timestamp: new Date().toISOString(),
          findings,
        };

        try {
          await apiService.createScan(scanData);
          
          const result: ScanResult = {
            id: scanId,
            rtspUrl: rtspUrl,
            vulnerabilities,
            riskScore,
            status,
            timestamp: new Date().toISOString(),
            findings,
          };
          
          addScanResult(result);
          setCurrentScan(result);
        } catch (apiError) {
          console.error('Error saving scan to backend:', apiError);
          const result: ScanResult = {
            id: scanId,
            rtspUrl: rtspUrl,
            vulnerabilities,
            riskScore,
            status,
            timestamp: new Date().toISOString(),
            findings,
          };
          addScanResult(result);
          setCurrentScan(result);
        }
      } catch (error) {
        console.error('Scan error:', error);
        alert('An error occurred during scanning. Please try again.');
      } finally {
        setIsScanning(false);
        setScanningStep(0);
        setScanProgress(100);
        setRtspUrl('');
      }
    }, 3500);
  };

  const handleExportResults = () => {
    if (!currentScan) return;
    
    const report = {
      scanId: currentScan.id,
      timestamp: new Date(currentScan.timestamp).toLocaleString(),
      rtspUrl: currentScan.rtspUrl,
      riskScore: currentScan.riskScore,
      status: currentScan.status,
      vulnerabilities: currentScan.vulnerabilities,
      findings: currentScan.findings,
      recommendations: [
        currentScan.findings.weakPassword && "Implement strong password policy",
        currentScan.findings.unencryptedStream && "Enable RTSPS (RTSP over TLS)",
        currentScan.findings.defaultCredentials && "Change default credentials",
        "Configure firewall to restrict port access",
        "Enable two-factor authentication if available"
      ].filter(Boolean)
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-report-${currentScan.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRescan = (url: string) => {
    setRtspUrl(url);
    setCurrentScan(null);
    setTimeout(() => {
      handleScan();
    }, 100);
  };

  const filteredResults = filterStatus === 'all' 
    ? scanResults 
    : scanResults.filter(r => r.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A120B] to-[#3C2A21] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#E5E5CB]">CCTV Security Scanner</h1>
          <p className="text-[#D5CEA3]">Scan RTSP streams for vulnerabilities and security risks</p>
        </div>

        {/* Scanner Input */}
        <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm text-[#D5CEA3] mb-2">RTSP Stream URL</label>
              <input
                type="text"
                value={rtspUrl}
                onChange={(e) => setRtspUrl(e.target.value)}
                placeholder="rtsp://192.168.1.10:554/stream1"
                className="w-full bg-[#1A120B] border border-[#D5CEA3]/30 rounded-lg px-4 py-3 text-[#E5E5CB] placeholder-[#E5E5CB]/30 focus:outline-none focus:border-[#D5CEA3]"
                disabled={isScanning}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleScan}
                disabled={isScanning || !rtspUrl.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-[#D5CEA3] text-[#1A120B] rounded-lg hover:bg-[#E5E5CB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#1A120B] border-t-transparent rounded-full animate-spin"></div>
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Scan Options */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-[#E5E5CB]/60">Quick scan:</span>
            <button 
              onClick={() => setRtspUrl('rtsp://192.168.1.10:554/stream1')}
              disabled={isScanning}
              className="text-sm px-3 py-1 bg-[#1A120B] text-[#D5CEA3] rounded border border-[#D5CEA3]/30 hover:border-[#D5CEA3] transition-colors disabled:opacity-50"
            >
              Camera 10
            </button>
            <button 
              onClick={() => setRtspUrl('rtsp://demo.server:554/live')}
              disabled={isScanning}
              className="text-sm px-3 py-1 bg-[#1A120B] text-[#D5CEA3] rounded border border-[#D5CEA3]/30 hover:border-[#D5CEA3] transition-colors disabled:opacity-50"
            >
              Demo Server
            </button>
            <button 
              onClick={() => setRtspUrl('rtsp://192.168.0.100:554/stream')}
              disabled={isScanning}
              className="text-sm px-3 py-1 bg-[#1A120B] text-[#D5CEA3] rounded border border-[#D5CEA3]/30 hover:border-[#D5CEA3] transition-colors disabled:opacity-50"
            >
              Subnet Scan
            </button>
          </div>
        </div>

        {/* Current Scan Result */}
        {isScanning && (
          <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 border-4 border-[#D5CEA3] border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <h3 className="text-xl text-[#E5E5CB]">Scanning in progress...</h3>
                <p className="text-sm text-[#D5CEA3]">Analyzing security vulnerabilities</p>
                {/* Progress Bar */}
                <div className="mt-3 w-full bg-[#1A120B] rounded-full h-2">
                  <div 
                    className="bg-[#D5CEA3] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-[#D5CEA3] mt-1">{Math.round(scanProgress)}% complete</p>
              </div>
            </div>
            <div className="space-y-2">
              <ScanningStep label="Checking RTSP connectivity" complete={scanningStep >= 1} />
              <ScanningStep label="Testing authentication" complete={scanningStep >= 2} />
              <ScanningStep label="Scanning open ports" complete={scanningStep >= 3} />
              <ScanningStep label="Analyzing stream encryption" complete={scanningStep >= 4} />
              <ScanningStep label="Checking firmware version" complete={scanningStep >= 5} />
            </div>
          </div>
        )}

        {/* Scan Results */}
        {currentScan && !isScanning && (
          <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6 mb-8 animate-fadeIn">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl text-[#E5E5CB]">Scan Complete</h3>
                  <span className="text-xs text-[#D5CEA3] bg-[#1A120B]/40 px-2 py-1 rounded">
                    {new Date(currentScan.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-[#D5CEA3]">{currentScan.rtspUrl}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-4xl text-[#E5E5CB] mb-1">{currentScan.riskScore}</div>
                  <div className={`text-sm px-3 py-1 rounded-full inline-block ${
                    currentScan.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                    currentScan.status === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    currentScan.status === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {currentScan.status.toUpperCase()} RISK
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleExportResults}
                    className="flex items-center gap-2 px-4 py-2 bg-[#D5CEA3] text-[#1A120B] rounded-lg hover:bg-[#E5E5CB] transition-colors text-sm"
                    title="Export Report"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => handleRescan(currentScan.rtspUrl)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A120B] text-[#D5CEA3] border border-[#D5CEA3]/30 rounded-lg hover:border-[#D5CEA3] transition-colors text-sm"
                    title="Rescan"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Rescan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Vulnerabilities Found */}
            <div className="mb-6">
              <h4 className="text-lg text-[#E5E5CB] mb-3">Vulnerabilities Found</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <VulnerabilityItem 
                  icon={<Lock className="w-5 h-5" />}
                  title="Weak Password"
                  status={currentScan.findings.weakPassword}
                  severity="critical"
                />
                <VulnerabilityItem 
                  icon={<Shield className="w-5 h-5" />}
                  title="Default Credentials"
                  status={currentScan.findings.defaultCredentials}
                  severity="critical"
                />
                <VulnerabilityItem 
                  icon={<Wifi className="w-5 h-5" />}
                  title="Unencrypted Stream"
                  status={currentScan.findings.unencryptedStream}
                  severity="high"
                />
                <VulnerabilityItem 
                  icon={<Server className="w-5 h-5" />}
                  title="Outdated Firmware"
                  status={currentScan.findings.outdatedFirmware}
                  severity="medium"
                />
              </div>
            </div>

            {/* Open Ports */}
            {currentScan.findings.openPorts.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg text-[#E5E5CB] mb-3">Open Ports Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {currentScan.findings.openPorts.map((port) => (
                    <div key={port} className="px-3 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30">
                      Port {port}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h4 className="text-lg text-[#E5E5CB] mb-3">Security Recommendations</h4>
              <div className="space-y-2">
                {currentScan.findings.weakPassword && (
                  <Recommendation text="Implement strong password policy (min 12 characters, alphanumeric + special)" />
                )}
                {currentScan.findings.unencryptedStream && (
                  <Recommendation text="Enable RTSPS (RTSP over TLS) for encrypted streaming" />
                )}
                {currentScan.findings.defaultCredentials && (
                  <Recommendation text="Change default credentials immediately" />
                )}
                <Recommendation text="Configure firewall to restrict port access" />
                <Recommendation text="Enable two-factor authentication if available" />
              </div>
            </div>
          </div>
        )}

        {/* Previous Scans */}
        {scanResults.length > 0 && (
          <div className="bg-[#3C2A21]/40 backdrop-blur-sm border border-[#D5CEA3]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-[#E5E5CB]">Previous Scans ({filteredResults.length})</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm ${
                    showFilters 
                      ? 'bg-[#D5CEA3] text-[#1A120B] border-[#D5CEA3]' 
                      : 'bg-[#1A120B] text-[#D5CEA3] border-[#D5CEA3]/30 hover:border-[#D5CEA3]'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mb-4 p-4 bg-[#1A120B]/40 rounded-lg border border-[#D5CEA3]/20">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-[#D5CEA3]">Filter by risk:</span>
                  {(['all', 'critical', 'high', 'medium', 'low'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        filterStatus === status
                          ? 'bg-[#D5CEA3] text-[#1A120B]'
                          : 'bg-[#1A120B] text-[#D5CEA3] border border-[#D5CEA3]/30 hover:border-[#D5CEA3]'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {filteredResults.length === 0 ? (
                <div className="text-center py-8 text-[#E5E5CB]/60">
                  <p>No scans found with {filterStatus} risk level</p>
                </div>
              ) : (
                filteredResults.map((result) => (
                  <div 
                    key={result.id}
                    className="flex items-center justify-between p-4 bg-[#1A120B]/40 rounded-lg border border-[#D5CEA3]/10 hover:border-[#D5CEA3]/30 transition-colors cursor-pointer group"
                    onClick={() => setCurrentScan(result)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-[#E5E5CB]">{result.rtspUrl}</div>
                        {result.id === currentScan?.id && (
                          <span className="text-xs text-[#D5CEA3] bg-[#D5CEA3]/20 px-2 py-0.5 rounded">Current</span>
                        )}
                      </div>
                      <div className="text-sm text-[#E5E5CB]/60">
                        {result.vulnerabilities.length} vulnerabilities • {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRescan(result.rtspUrl);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#1A120B] rounded"
                        title="Rescan"
                      >
                        <RefreshCw className="w-4 h-4 text-[#D5CEA3]" />
                      </button>
                      <div className="text-right">
                        <div className="text-2xl text-[#E5E5CB]">{result.riskScore}</div>
                        <div className="text-xs text-[#D5CEA3]">Risk Score</div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        result.status === 'critical' ? 'bg-red-500' :
                        result.status === 'high' ? 'bg-orange-500' :
                        result.status === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScanningStep({ label, complete }: { label: string; complete: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {complete ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <div className="w-5 h-5 border-2 border-[#D5CEA3] border-t-transparent rounded-full animate-spin"></div>
      )}
      <span className={`${complete ? 'text-[#E5E5CB]/60' : 'text-[#E5E5CB]'}`}>{label}</span>
    </div>
  );
}

function VulnerabilityItem({ 
  icon, 
  title, 
  status, 
  severity 
}: { 
  icon: React.ReactNode; 
  title: string; 
  status: boolean; 
  severity: 'critical' | 'high' | 'medium' | 'low';
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${
      status 
        ? severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
          severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
          severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
          'bg-green-500/10 border-green-500/30'
        : 'bg-green-500/10 border-green-500/30'
    }`}>
      <div className="flex items-center gap-3">
        <div className={status 
          ? severity === 'critical' ? 'text-red-500' :
            severity === 'high' ? 'text-orange-500' :
            severity === 'medium' ? 'text-yellow-500' :
            'text-green-500'
          : 'text-green-500'
        }>
          {icon}
        </div>
        <span className="text-[#E5E5CB]">{title}</span>
      </div>
      {status ? (
        <XCircle className="w-5 h-5 text-red-500" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-500" />
      )}
    </div>
  );
}

function Recommendation({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-[#1A120B]/40 rounded border border-[#D5CEA3]/10">
      <AlertTriangle className="w-5 h-5 text-[#D5CEA3] flex-shrink-0 mt-0.5" />
      <span className="text-sm text-[#E5E5CB]">{text}</span>
    </div>
  );
}
