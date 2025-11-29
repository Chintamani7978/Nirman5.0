import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import { connectSocket, disconnectSocket } from '../lib/socket';
import { assignRequest } from '../lib/api';
import CreateRequestModal from '../components/CreateRequestModal';

// Custom Icons
const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const icons = {
    'Help Needed': createIcon('blue'), // Default
    'Resource Available': createIcon('green'),
    'Emergency': createIcon('red'),
    'Community Event': createIcon('orange'),
    'default': createIcon('blue')
};

function MapPage() {
    const [position, setPosition] = useState(null);
    const [requests, setRequests] = useState([]);
    const [toast, setToast] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Connect socket
        connectSocket((newRequest) => {
            setRequests((prev) => [...prev, newRequest]);
            setToast(`New Request: ${newRequest.type}`);
            setTimeout(() => setToast(null), 3000);
        });

        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                    fetchRequests(latitude, longitude);
                },
                (err) => {
                    console.error("Error getting location:", err);
                    setPosition([51.505, -0.09]);
                    fetchRequests(51.505, -0.09);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setPosition([51.505, -0.09]);
        }
    }, []);

    const fetchRequests = async (lat, lng) => {
        try {
            const response = await axios.get('/api/requests', {
                params: {
                    lat,
                    lng,
                    radiusKm: 5
                }
            });
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const handleAssign = async (id) => {
        try {
            await assignRequest(id);
            setToast('Thanks for volunteering!');
            setTimeout(() => setToast(null), 3000);
            // Refresh requests to show updated status
            if (position) {
                fetchRequests(position[0], position[1]);
            }
        } catch (error) {
            console.error("Assign error:", error);
            setToast(`Error: ${error.message}`);
            setTimeout(() => setToast(null), 3000);
        }
    };

    if (!position) {
        return <div className="flex items-center justify-center h-screen text-xl">Loading location...</div>;
    }

    return (
        <div className="h-screen w-screen relative">
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={position}>
                    <Popup>
                        You are here
                    </Popup>
                </Marker>

                {requests.map((req) => (
                    <Marker
                        key={req._id}
                        position={[req.location.coordinates[1], req.location.coordinates[0]]}
                        icon={icons[req.type] || icons['default']}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg mb-1">{req.type}</h3>
                                <p className="text-gray-700 mb-2">{req.description}</p>
                                {req.contact && <p className="text-sm text-gray-600 mb-2"><strong>Contact:</strong> {req.contact}</p>}
                                <p className="text-xs text-gray-500 mb-3">Status: <span className="font-semibold capitalize">{req.status}</span></p>

                                {req.status === 'open' && (
                                    <button
                                        onClick={() => handleAssign(req._id)}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                                    >
                                        I'll help
                                    </button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-5 right-5 z-[1000] bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105"
            >
                + Request Help
            </button>

            {isModalOpen && (
                <CreateRequestModal
                    onClose={() => setIsModalOpen(false)}
                    onCreated={() => {
                        if (position) fetchRequests(position[0], position[1]);
                    }}
                />
            )}

            {toast && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl z-[2000] animate-fade-in-up">
                    {toast}
                </div>
            )}
        </div>
    );
}

export default MapPage;
