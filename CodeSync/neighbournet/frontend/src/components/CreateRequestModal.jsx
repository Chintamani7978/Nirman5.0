import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateRequestModal({ onClose, onCreated }) {
    const [formData, setFormData] = useState({
        type: 'Help Needed',
        description: '',
        contact: '',
        lat: '',
        lng: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setFormData(prev => ({
                        ...prev,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    }));
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    // Allow manual entry if geolocation fails
                }
            );
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to create a request.');
            }

            await axios.post('/api/requests', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            onCreated();
            onClose();
        } catch (err) {
            console.error("Create request error:", err);
            setError(err.response?.data?.error || err.message || 'Failed to create request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '400px',
                maxWidth: '90%'
            }}>
                <h2>Create New Request</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="Help Needed">Help Needed</option>
                            <option value="Resource Available">Resource Available</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Community Event">Community Event</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', minHeight: '80px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Contact Info</label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Phone or Email"
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Latitude</label>
                            <input
                                type="number"
                                name="lat"
                                value={formData.lat}
                                onChange={handleChange}
                                step="any"
                                required
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Longitude</label>
                            <input
                                type="number"
                                name="lng"
                                value={formData.lng}
                                onChange={handleChange}
                                step="any"
                                required
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '8px 16px', cursor: 'pointer' }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRequestModal;
