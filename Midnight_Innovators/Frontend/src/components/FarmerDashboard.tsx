import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Types
interface Order {
  _id: string;
  productId: string;
  productName: string;
  productPrice: number;
  finalAmount: number;
  deliveryCharge: number;
  deliveryType: 'pickup' | 'home_delivery';
  farmerAadhar: string;
  farmerName: string;
  customerName: string;
  customerMobile: string;
  status: 'pending' | 'confirmed' | 'delivery' | 'rejected' | 'completed' | 'payment_pending' | 'payment_completed';
  deliveryLocation?: string;
  customerLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  farmerLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  date: string;
  createdAt: string;
  paymentQRCode?: string;
  paymentExpiry?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'expired';
  rejectionReason?: string;
}

interface Revenue {
  _id: string;
  farmerAadhar: string;
  farmerName: string;
  orderId: string;
  productName: string;
  amount: number;
  baseAmount: number;
  deliveryCharge: number;
  deliveryType: 'pickup' | 'home_delivery';
  date: string;
  createdAt: string;
}

interface RevenueData {
  transactions: Revenue[];
  totals: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalTransactions: number;
    deliveryEarnings: number;
  };
}

// Icons
const icons = {
  TrendingUp: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  LocalShipping: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Inventory: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  AttachMoney: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>,
  CheckCircle: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Cancel: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  LocationOn: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Payment: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
};

// Order Card Component
interface OrderCardProps {
  order: Order;
  onAccept: (order: Order) => void;
  onReject: (orderId: string) => void;
  onShareLocation: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onAccept, onReject, onShareLocation }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'payment_pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'delivery': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'pending': return 'border-l-yellow-500';
      case 'payment_pending': return 'border-l-orange-500';
      case 'confirmed': return 'border-l-green-500';
      case 'delivery': return 'border-l-blue-500';
      case 'rejected': return 'border-l-red-500';
      case 'completed': return 'border-l-purple-500';
      default: return 'border-l-gray-500';
    }
  };

  const isDelivery = order.deliveryType === 'home_delivery';
  const finalAmount = order.finalAmount || order.productPrice;

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-l-4 ${getStatusBorder(
        order.status
      )} mb-4 hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {order.productName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Order ID: {order._id?.slice(-8) || "N/A"}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              order.status
            )}`}
          >
            {order.status
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p>
              <strong className="text-gray-900">Price:</strong> ₹{finalAmount}{" "}
              {isDelivery && "(incl. delivery)"}
            </p>
          </div>
          <div>
            <p>
              <strong className="text-gray-900">Customer:</strong>{" "}
              {order.customerName}
            </p>
          </div>
          <div>
            <p>
              <strong className="text-gray-900">Mobile:</strong>{" "}
              {order.customerMobile}
            </p>
          </div>
          <div>
            <p>
              <strong className="text-gray-900">Date:</strong>
              {order.date && !isNaN(new Date(order.date).getTime())
                ? new Date(order.date).toLocaleDateString()
                : order.createdAt && !isNaN(new Date(order.createdAt).getTime())
                ? new Date(order.createdAt).toLocaleDateString()
                : "Date not available"}
            </p>
          </div>
          {isDelivery && order.customerLocation?.address && (
            <div className="md:col-span-2">
              <p className="flex items-start">
                <strong className="text-gray-900 mr-2">
                  Delivery Location:
                </strong>
                <span className="flex items-center text-gray-700">
                  <icons.LocationOn className="w-4 h-4 mr-1" />
                  {order.customerLocation.address}
                </span>
              </p>
            </div>
          )}
          {order.rejectionReason && (
            <div className="md:col-span-2">
              <p className="text-red-600">
                <strong>Rejection Reason:</strong> {order.rejectionReason}
              </p>
            </div>
          )}
        </div>

        {order.status === "pending" && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onAccept(order)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              <icons.CheckCircle className="w-4 h-4 mr-2" />
              Accept Order
            </button>
            <button
              onClick={() => onReject(order._id)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              <icons.Cancel className="w-4 h-4 mr-2" />
              Reject
            </button>
          </div>
        )}

        {order.status === "payment_pending" && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <icons.Payment className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">
                Waiting for customer payment
              </span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              Customer will complete payment via QR code
            </p>
          </div>
        )}

        {order.status === "confirmed" &&
          order.deliveryType === "pickup" &&
          !order.farmerLocation && (
            <div className="mt-4">
              <button
                onClick={() => onShareLocation(order)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <icons.LocationOn className="w-4 h-4 mr-2" />
                Share Pickup Location
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

// Rejection Modal Component
interface RejectionModalProps {
  orderId: string;
  onClose: () => void;
  onReject: (orderId: string, reason: string) => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({ orderId, onClose, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(orderId, rejectionReason.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Reject Order</h3>
        </div>
        
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Please provide a reason for rejection:
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
          />
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              !rejectionReason.trim() 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            Reject Order
          </button>
        </div>
      </div>
    </div>
  );
};

// Location Sharing Modal Component
interface LocationModalProps {
  order: Order;
  onClose: () => void;
  onShareLocation: (orderId: string, location: { lat: number; lng: number; address: string }) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ order, onClose, onShareLocation }) => {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
    address: ''
  });
  const [mapsLink, setMapsLink] = useState('');
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create Google Maps link
          const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}&z=16`;
          
          // Generate a readable address from coordinates
          const address = `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          setLocation({
            lat: latitude,
            lng: longitude,
            address
          });
          setMapsLink(mapsLink);
          setIsLocationSet(true);

        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleManualAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const address = e.target.value;
    setLocation(prev => ({ ...prev, address }));
    
    // If we have coordinates but user is entering manual address, keep the maps link
    if (location.lat && location.lng) {
      const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=16`;
      setMapsLink(mapsLink);
    }
  };

  const handleShareLocation = () => {
    if (location.lat && location.lng && location.address) {
      onShareLocation(order._id, location);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mapsLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openInMaps = () => {
    window.open(mapsLink, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-900">Share Pickup Location</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                Share your location with the customer for pickup. The customer will receive a Google Maps link to your location.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Location Input */}
              <div className="space-y-4">
                <button
                  onClick={handleGetCurrentLocation}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <icons.LocationOn className="w-5 h-5 mr-2" />
                  Use Current Location
                </button>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pickup Location Address
                  </label>
                  <textarea
                    value={location.address}
                    onChange={handleManualAddress}
                    placeholder="Enter your pickup location address or use current location..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {isLocationSet && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-green-800">Location Ready to Share</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={openInMaps}
                          className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          <icons.LocationOn className="w-3 h-3 mr-1" />
                          Open Maps
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          {copied ? (
                            <icons.CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                          {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded border p-3">
                      <p className="text-sm text-gray-600 break-all">
                        <strong>Google Maps Link:</strong><br />
                        <a 
                          href={mapsLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {mapsLink}
                        </a>
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p><strong>Coordinates:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Google Maps Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Location Preview</h4>
                
                {isLocationSet ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="300"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
                      allowFullScreen
                      title="Pickup Location Map"
                    >
                    </iframe>
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <p className="text-sm text-gray-600 text-center">
                        This is how your location will appear to the customer
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-80 flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-500">
                      <icons.LocationOn className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Your location will appear here</p>
                      <p className="text-sm">Click "Use Current Location" to get started</p>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-800 mb-2">How it works:</h5>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Get your current location automatically</li>
                    <li>Add any additional address details if needed</li>
                    <li>Customer receives Google Maps link to your location</li>
                    <li>They can navigate directly to your pickup point</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShareLocation}
            disabled={!location.address.trim() || !isLocationSet}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              !location.address.trim() || !isLocationSet
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Share Location with Customer
          </button>
        </div>
      </div>
    </div>
  );
};

// Revenue Chart Component
interface RevenueChartProps {
  revenueData: RevenueData;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ revenueData }) => {
  const monthlyData = revenueData.transactions.reduce((acc: any[], transaction) => {
    const month = new Date(transaction.createdAt).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    
    if (existing) {
      existing.revenue += transaction.amount;
    } else {
      acc.push({ month, revenue: transaction.amount });
    }
    
    return acc;
  }, []).slice(-6);

  const deliveryTypeData = [
    { name: 'Home Delivery', value: revenueData.transactions.filter(t => t.deliveryType === 'home_delivery').length },
    { name: 'Self Pickup', value: revenueData.transactions.filter(t => t.deliveryType === 'pickup').length }
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <div className="space-y-8">
      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Revenue Trend (Last 6 Months)</h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Types Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Delivery Types</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Orders']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Daily Revenue (Last 10 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData.transactions.slice(-10).map(t => ({
                date: new Date(t.createdAt).toLocaleDateString(),
                revenue: t.amount
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const FarmerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  
  // Modal states
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [pendingRejectionOrderId, setPendingRejectionOrderId] = useState<string | null>(null);
  
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });

  const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:5000' 
    : window.location.origin;
  
  const farmerAadhaar = localStorage.getItem('farmerAadhaar') || sessionStorage.getItem('aadhaars');

  // Filter orders based on tab
  const filteredOrders = {
    pending: orders.filter(order => order.status === 'pending'),
    payment_pending: orders.filter(order => order.status === 'payment_pending'),
    confirmed: orders.filter(order => order.status === 'confirmed'),
    delivery: orders.filter(order => order.status === 'delivery'),
    all: orders
  };

  // Stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: filteredOrders.pending.length,
    paymentPending: filteredOrders.payment_pending.length,
    confirmedOrders: filteredOrders.confirmed.length + filteredOrders.delivery.length,
    totalRevenue: revenueData?.totals.totalRevenue || 0,
    monthlyRevenue: revenueData?.totals.monthlyRevenue || 0,
    deliveryEarnings: revenueData?.totals.deliveryEarnings || 0
  };

  // Fetch data
  const fetchData = async () => {
    if (!farmerAadhaar) {
      setError('Farmer Aadhaar not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const [ordersResponse, revenueResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/orders/farmer/${farmerAadhaar}`),
        fetch(`${API_BASE_URL}/api/revenue/farmer/${farmerAadhaar}`)
      ]);

      if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
      if (!revenueResponse.ok) throw new Error('Failed to fetch revenue data');

      const [ordersData, revenueData] = await Promise.all([
        ordersResponse.json(),
        revenueResponse.json()
      ]);

      setOrders(ordersData);
      setRevenueData(revenueData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      showNotification('Failed to load data. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [farmerAadhaar]);

  // Handlers
  const handleAcceptOrder = async (order: Order) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${order._id}/accept`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to accept order');

      const result = await response.json();
      
      await fetchData();
      showNotification('Order accepted. Customer will complete payment via QR code.', 'success');
    } catch (err) {
      console.error('Error accepting order:', err);
      showNotification('Failed to accept order', 'error');
    }
  };

  const handleRejectOrderClick = (orderId: string) => {
    setPendingRejectionOrderId(orderId);
    setRejectionModalOpen(true);
  };

  const handleRejectOrder = async (orderId: string, reason: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason: reason })
      });

      if (!response.ok) throw new Error('Failed to reject order');
      
      setRejectionModalOpen(false);
      setPendingRejectionOrderId(null);
      await fetchData();
      showNotification('Order rejected successfully', 'success');
    } catch (err) {
      console.error('Error rejecting order:', err);
      showNotification('Failed to reject order', 'error');
    }
  };

  const handleShareLocationClick = (order: Order) => {
    setCurrentOrder(order);
    setLocationModalOpen(true);
  };

  const handleShareLocation = async (orderId: string, location: { lat: number; lng: number; address: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/farmer-location`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
      });

      if (!response.ok) throw new Error('Failed to share location');

      setLocationModalOpen(false);
      setCurrentOrder(null);
      await fetchData();
      showNotification('Location shared with customer', 'success');
    } catch (err) {
      console.error('Error sharing location:', err);
      showNotification('Failed to share location', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ open: true, message, type });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your orders and revenue data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { label: 'Pending Orders', count: filteredOrders.pending.length },
    { label: 'Payment Pending', count: filteredOrders.payment_pending.length },
    { label: 'Confirmed Orders', count: filteredOrders.confirmed.length },
    { label: 'Delivery Orders', count: filteredOrders.delivery.length },
    { label: 'All Orders', count: filteredOrders.all.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <icons.Inventory className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <icons.LocalShipping className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <icons.Payment className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Payment Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.paymentPending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <icons.AttachMoney className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab, index) => (
                <button
                  key={tab.label}
                  onClick={() => setTabValue(index)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    tabValue === index
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    tabValue === index
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {(() => {
              const currentOrders = 
                tabValue === 0 ? filteredOrders.pending :
                tabValue === 1 ? filteredOrders.payment_pending :
                tabValue === 2 ? filteredOrders.confirmed :
                tabValue === 3 ? filteredOrders.delivery :
                filteredOrders.all;

              return currentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1m4 0h-4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentOrders.map(order => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onAccept={handleAcceptOrder}
                      onReject={handleRejectOrderClick}
                      onShareLocation={handleShareLocationClick}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Revenue Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Revenue Analytics</h2>
          
          {revenueData && revenueData.transactions.length > 0 ? (
            <>
              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <p className="text-blue-600 font-semibold mb-2">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹{stats.monthlyRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <p className="text-green-600 font-semibold mb-2">Total Transactions</p>
                  <p className="text-3xl font-bold text-gray-900">{revenueData.totals.totalTransactions}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <p className="text-purple-600 font-semibold mb-2">Delivery Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">₹{stats.deliveryEarnings.toFixed(2)}</p>
                </div>
              </div>

              {/* Charts */}
              <RevenueChart revenueData={revenueData} />

              {/* Recent Transactions */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  {revenueData.transactions.slice(0, 5).map((transaction, index) => (
                    <div key={transaction._id} className={`flex items-center justify-between py-4 ${index !== 4 ? 'border-b border-gray-200' : ''}`}>
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          transaction.deliveryType === 'home_delivery' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {transaction.deliveryType === 'home_delivery' ? (
                            <icons.LocalShipping className="w-5 h-5" />
                          ) : (
                            <icons.Inventory className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{transaction.productName}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.deliveryType === 'home_delivery' ? 'Home Delivery' : 'Self Pickup'} • 
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-green-600">₹{transaction.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No revenue data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModalOpen && pendingRejectionOrderId && (
        <RejectionModal
          orderId={pendingRejectionOrderId}
          onClose={() => {
            setRejectionModalOpen(false);
            setPendingRejectionOrderId(null);
          }}
          onReject={handleRejectOrder}
        />
      )}

      {/* Location Sharing Modal */}
      {locationModalOpen && currentOrder && (
        <LocationModal
          order={currentOrder}
          onClose={() => setLocationModalOpen(false)}
          onShareLocation={handleShareLocation}
        />
      )}

      {/* Notification */}
      {notification.open && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`flex-shrink-0 ${
              notification.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {notification.type === 'success' ? (
                <icons.CheckCircle className="w-5 h-5" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className={`font-medium ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.message}
            </p>
            <button
              onClick={handleCloseNotification}
              className={`flex-shrink-0 ${
                notification.type === 'success' ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;