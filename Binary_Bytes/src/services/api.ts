const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'An error occurred' }));
        const errorMessage = error.details || error.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    return Promise.resolve();
  }

  async createScan(scanData: {
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
  }): Promise<{ scanResult: any }> {
    return this.request<{ scanResult: any }>('/api/scans', {
      method: 'POST',
      body: JSON.stringify(scanData),
    });
  }

  async getScans(status?: string): Promise<{ scanResults: any[] }> {
    const endpoint = status && status !== 'all' 
      ? `/api/scans?status=${status}` 
      : '/api/scans';
    return this.request<{ scanResults: any[] }>(endpoint, {
      method: 'GET',
    });
  }

  async getCameras(): Promise<{ cameras: any[] }> {
    return this.request<{ cameras: any[] }>('/api/cameras', {
      method: 'GET',
    });
  }

  async createCamera(cameraData: {
    id: string;
    name: string;
    ip: string;
    status?: 'secure' | 'vulnerable';
    risk?: 'critical' | 'high' | 'medium' | 'low';
    securityChecks?: {
      strongPassword: boolean;
      encryption: boolean;
      authentication: boolean;
      firewall: boolean;
      firmware: boolean;
    };
  }): Promise<{ camera: any }> {
    return this.request<{ camera: any }>('/api/cameras', {
      method: 'POST',
      body: JSON.stringify(cameraData),
    });
  }

  async updateCamera(id: string, updates: Partial<{
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
  }>): Promise<{ camera: any }> {
    return this.request<{ camera: any }>(`/api/cameras/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteCamera(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/cameras/${id}`, {
      method: 'DELETE',
    });
  }

  async getThreats(status?: string, severity?: string): Promise<{ threats: any[] }> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (severity && severity !== 'all') params.append('severity', severity);
    const query = params.toString();
    const endpoint = query ? `/api/threats?${query}` : '/api/threats';
    return this.request<{ threats: any[] }>(endpoint, {
      method: 'GET',
    });
  }

  async createThreat(threatData: {
    id: string;
    timestamp?: string;
    type: 'unauthorized_access' | 'brute_force' | 'anomaly' | 'intrusion';
    severity: 'critical' | 'high' | 'medium' | 'low';
    source: string;
    camera: string;
    description: string;
    status?: 'active' | 'investigating' | 'resolved';
  }): Promise<{ threat: any }> {
    return this.request<{ threat: any }>('/api/threats', {
      method: 'POST',
      body: JSON.stringify(threatData),
    });
  }

  async updateThreat(id: string, updates: Partial<{
    type: 'unauthorized_access' | 'brute_force' | 'anomaly' | 'intrusion';
    severity: 'critical' | 'high' | 'medium' | 'low';
    source: string;
    camera: string;
    description: string;
    status: 'active' | 'investigating' | 'resolved';
  }>): Promise<{ threat: any }> {
    return this.request<{ threat: any }>(`/api/threats/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteThreat(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/threats/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

