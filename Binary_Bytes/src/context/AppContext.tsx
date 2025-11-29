import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

export interface Camera {
  id: string;
  name: string;
  ip: string;
  status: 'secure' | 'vulnerable' | string;
  risk: 'critical' | 'high' | 'medium' | 'low' | string;
  securityChecks: {
    strongPassword: boolean;
    encryption: boolean;
    authentication: boolean;
    firewall: boolean;
    firmware: boolean;
  };
}

interface Threat {
  id: string;
  timestamp: string;
  type: 'unauthorized_access' | 'brute_force' | 'anomaly' | 'intrusion';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  camera: string;
  description: string;
  status: 'active' | 'investigating' | 'resolved';
}

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

interface AppContextType {
  cameras: Camera[];
  setCameras: React.Dispatch<React.SetStateAction<Camera[]>>;
  threats: Threat[];
  scanResults: ScanResult[];
  addCamera: (camera: Camera) => Promise<void>;
  updateCamera: (id: string, updates: Partial<Camera>) => Promise<void>;
  deleteCamera: (id: string) => Promise<void>;
  addThreat: (threat: Threat) => Promise<void>;
  updateThreat: (id: string, updates: Partial<Threat>) => Promise<void>;
  deleteThreat: (id: string) => Promise<void>;
  addScanResult: (result: ScanResult) => void;
  stats: {
    totalCameras: number;
    vulnerableCameras: number;
    activeThreats: number;
    securedCameras: number;
  };
  totalCameras: number;
  vulnerableCameras: number;
  activeThreats: number;
  securedCameras: number;
  showNotification: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'warning'} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        try {
          const camerasResponse = await apiService.getCameras();
          setCameras(camerasResponse.cameras.map((cam: any) => ({
            id: cam.id,
            name: cam.name,
            ip: cam.ip,
            status: cam.status,
            risk: cam.risk,
            securityChecks: cam.securityChecks,
          })));
        } catch (error) {
          console.error('Error fetching cameras:', error);
          showNotification('Failed to load cameras from backend', 'error');
        }

        try {
          const threatsResponse = await apiService.getThreats();
          setThreats(threatsResponse.threats.map((threat: any) => ({
            id: threat.id,
            timestamp: new Date(threat.timestamp).toISOString(),
            type: threat.type,
            severity: threat.severity,
            source: threat.source,
            camera: threat.camera,
            description: threat.description,
            status: threat.status,
          })));
        } catch (error) {
          console.error('Error fetching threats:', error);
          showNotification('Failed to load threats from backend', 'error');
        }

        try {
          const scansResponse = await apiService.getScans();
          setScanResults(scansResponse.scanResults.map((scan: any) => ({
            id: scan.id,
            rtspUrl: scan.rtspUrl,
            vulnerabilities: scan.vulnerabilities,
            riskScore: scan.riskScore,
            status: scan.status,
            timestamp: new Date(scan.timestamp).toISOString(),
            findings: scan.findings,
          })));
        } catch (error) {
          console.error('Error fetching scans:', error);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        showNotification('Failed to initialize data from backend', 'error');
      } finally {
        setLoading(false);
      }
    };

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const addCamera = async (camera: Camera) => {
    try {
      const response = await apiService.createCamera(camera);
      const newCamera = {
        id: response.camera.id,
        name: response.camera.name,
        ip: response.camera.ip,
        status: response.camera.status,
        risk: response.camera.risk,
        securityChecks: response.camera.securityChecks,
      };
      setCameras(prev => [...prev, newCamera]);
      showNotification('Camera added successfully', 'success');
    } catch (error) {
      console.error('Error adding camera:', error);
      showNotification('Failed to add camera', 'error');
      throw error;
    }
  };

  const updateCamera = async (id: string, updates: Partial<Camera>) => {
    try {
      const response = await apiService.updateCamera(id, updates);
      const updatedCamera = {
        id: response.camera.id,
        name: response.camera.name,
        ip: response.camera.ip,
        status: response.camera.status,
        risk: response.camera.risk,
        securityChecks: response.camera.securityChecks,
      };
      setCameras(prev => prev.map(cam => 
        cam.id === id ? updatedCamera : cam
      ));
      showNotification('Camera updated successfully', 'success');
    } catch (error) {
      console.error('Error updating camera:', error);
      showNotification('Failed to update camera', 'error');
      throw error;
    }
  };

  const addThreat = async (threat: Threat) => {
    try {
      const response = await apiService.createThreat({
        id: threat.id,
        timestamp: threat.timestamp,
        type: threat.type,
        severity: threat.severity,
        source: threat.source,
        camera: threat.camera,
        description: threat.description,
        status: threat.status,
      });
      const newThreat = {
        id: response.threat.id,
        timestamp: new Date(response.threat.timestamp).toISOString(),
        type: response.threat.type,
        severity: response.threat.severity,
        source: response.threat.source,
        camera: response.threat.camera,
        description: response.threat.description,
        status: response.threat.status,
      };
      setThreats(prev => [newThreat, ...prev]);
      showNotification('Threat added successfully', 'success');
    } catch (error) {
      console.error('Error adding threat:', error);
      showNotification('Failed to add threat', 'error');
      throw error;
    }
  };

  const updateThreat = async (id: string, updates: Partial<Threat>) => {
    try {
      const response = await apiService.updateThreat(id, updates);
      const updatedThreat = {
        id: response.threat.id,
        timestamp: new Date(response.threat.timestamp).toISOString(),
        type: response.threat.type,
        severity: response.threat.severity,
        source: response.threat.source,
        camera: response.threat.camera,
        description: response.threat.description,
        status: response.threat.status,
      };
      setThreats(prev => prev.map(threat => 
        threat.id === id ? updatedThreat : threat
      ));
      showNotification('Threat updated successfully', 'success');
    } catch (error) {
      console.error('Error updating threat:', error);
      showNotification('Failed to update threat', 'error');
      throw error;
    }
  };

  const deleteCamera = async (id: string) => {
    try {
      await apiService.deleteCamera(id);
      setCameras(prev => prev.filter(cam => cam.id !== id));
      showNotification('Camera deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting camera:', error);
      showNotification('Failed to delete camera', 'error');
      throw error;
    }
  };

  const deleteThreat = async (id: string) => {
    try {
      await apiService.deleteThreat(id);
      setThreats(prev => prev.filter(threat => threat.id !== id));
      showNotification('Threat deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting threat:', error);
      showNotification('Failed to delete threat', 'error');
      throw error;
    }
  };

  const addScanResult = (result: ScanResult) => {
    setScanResults(prev => [result, ...prev]);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const handleLoginAttempt = (e: StorageEvent) => {
      if (e.key === 'login_attempt' && e.newValue) {
        const attempt = JSON.parse(e.newValue);
        showNotification(`Suspicious login attempt from ${attempt.ip} at ${new Date(attempt.timestamp).toLocaleString()}`, 'warning');
        localStorage.removeItem('login_attempt');
      }
    };

    const handleRTSPAttempt = (e: StorageEvent) => {
      if (e.key === 'rtsp_access_attempt' && e.newValue) {
        const attempt = JSON.parse(e.newValue);
        showNotification(`Unauthorized RTSP access attempt from ${attempt.ip} at ${new Date(attempt.timestamp).toLocaleString()}`, 'error');
        localStorage.removeItem('rtsp_access_attempt');
      }
    };

    window.addEventListener('storage', handleLoginAttempt);
    window.addEventListener('storage', handleRTSPAttempt);

    return () => {
      window.removeEventListener('storage', handleLoginAttempt);
      window.removeEventListener('storage', handleRTSPAttempt);
    };
  }, []);

  const stats = {
    totalCameras: cameras.length,
    vulnerableCameras: cameras.filter(c => c.status === 'vulnerable').length,
    activeThreats: threats.filter(t => t.status === 'active').length,
    securedCameras: cameras.filter(c => c.status === 'secure').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A120B] flex items-center justify-center">
        <div className="text-[#E5E5CB]">Loading...</div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        cameras,
        setCameras,
        threats,
        scanResults,
        addCamera,
        updateCamera,
        deleteCamera,
        addThreat,
        updateThreat,
        deleteThreat,
        addScanResult,
        stats,
        totalCameras: cameras.length,
        vulnerableCameras: cameras.filter(cam => cam.status === 'vulnerable').length,
        activeThreats: threats.filter(t => t.status === 'active').length,
        securedCameras: cameras.filter(cam => cam.status === 'secure').length,
        showNotification,
      }}
    >
      {children}
      {notification && (
        <div 
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-500' : 
            notification.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          } text-white`}
          style={{
            transform: 'translateY(0)',
            opacity: 1,
            transition: 'all 0.3s ease-in-out',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <div className="flex items-center">
            <div className="shrink-0">
              {notification.type === 'success' ? '✅' : 
               notification.type === 'error' ? '❌' : '⚠️'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 -mr-1 p-1 rounded-md hover:bg-black/10 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from {
              transform: translateY(100px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `
      }} />
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
