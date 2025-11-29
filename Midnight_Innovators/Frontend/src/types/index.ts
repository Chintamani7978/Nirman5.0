export interface User {
  name: string;
  landSize: number;
  annualIncome: number;
  cropType: string;
  aadhaar: string;
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  unit: string;
  description?: string;
  location?: string;
  contactNumber?: string;
  farmerName: string;
  aadhaar: string;
  image: string;
}

export interface Scheme {
  name: string;
  type: 'Government' | 'Private';
  amount: string;
  eligibility: string;
  interestRate: string;
  description: string;
  benefits: string[];
  bestMatch?: boolean;
}

export interface ModalContent {
  type: 'success' | 'error' | 'info' | 'contact' | 'edit';
  title: string;
  content: React.ReactNode;
  onConfirm?: () => void;
}

export interface MarketPrice {
  name: string;
  price: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface WeatherData {
  temperature: string;
  description: string;
  wind: string;
  humidity: string;
  rain: string;
  icon: string;
  forecast: Array<{
    day: string;
    icon: string;
    temp: string;
  }>;
}