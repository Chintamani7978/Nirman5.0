import React from 'react';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import { Activity, FileText, Pill, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const bpData = [
    { name: 'Jan', systolic: 120, diastolic: 80 },
    { name: 'Feb', systolic: 122, diastolic: 82 },
    { name: 'Mar', systolic: 118, diastolic: 78 },
    { name: 'Apr', systolic: 125, diastolic: 85 },
    { name: 'May', systolic: 121, diastolic: 79 },
];

const PatientDashboard = ({ user }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Namaste, {user.name}</h1>
                    <p className="text-gray-500 dark:text-dark-muted">Your Health ID: <span className="font-mono text-gray-700 dark:text-gray-300">SHA-8821-9921</span></p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-primary dark:bg-dark-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-600 dark:hover:bg-dark-secondary">Book Appointment</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Vitals & History */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Vitals Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-2">
                                <Activity size={18} />
                                <span className="text-xs font-bold uppercase">Heart Rate</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">72 <span className="text-sm font-normal text-gray-500 dark:text-dark-muted">bpm</span></p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
                                <Activity size={18} />
                                <span className="text-xs font-bold uppercase">Blood Pressure</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">120/80</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                                <Pill size={18} />
                                <span className="text-xs font-bold uppercase">Glucose</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">95 <span className="text-sm font-normal text-gray-500 dark:text-dark-muted">mg/dL</span></p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-2">
                                <Activity size={18} />
                                <span className="text-xs font-bold uppercase">Weight</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">70 <span className="text-sm font-normal text-gray-500 dark:text-dark-muted">kg</span></p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                        <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4">Blood Pressure History</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={bpData}>
                                    <defs>
                                        <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} />
                                    <Area type="monotone" dataKey="systolic" stroke="#8884d8" fillOpacity={1} fill="url(#colorSys)" />
                                    <Area type="monotone" dataKey="diastolic" stroke="#82ca9d" fillOpacity={1} fill="#82ca9d" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Records */}
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800 dark:text-dark-text">Recent Medical Records</h3>
                            <button className="text-sm text-primary dark:text-dark-primary hover:underline">View All</button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { date: '10 Oct 2023', doctor: 'Dr. Anjali Gupta', type: 'Prescription', tag: 'Allopathy' },
                                { date: '15 Sep 2023', doctor: 'Dr. Rao', type: 'Lab Report', tag: 'Pathology' },
                                { date: '20 Aug 2023', doctor: 'Vaidya Sharma', type: 'Diet Plan', tag: 'Ayurveda' },
                            ].map((rec, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg/80 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-white dark:bg-dark-surface p-2 rounded shadow-sm">
                                            <FileText size={20} className="text-gray-500 dark:text-dark-muted" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-dark-text">{rec.type}</p>
                                            <p className="text-xs text-gray-500 dark:text-dark-muted">{rec.date} • {rec.doctor}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded text-gray-600 dark:text-dark-muted">{rec.tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: QR & Actions */}
                <div className="space-y-6">
                    <QRCodeGenerator
                        value={`samhita://patient/${user.id}`}
                        label="Scan for Emergency Access"
                    />

                    <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                        <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4">Upcoming Appointments</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 pb-4 border-b border-gray-100 dark:border-dark-border">
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-dark-text">General Checkup</p>
                                    <p className="text-sm text-gray-500 dark:text-dark-muted">Tomorrow, 10:00 AM</p>
                                    <div className="mt-2 flex gap-2">
                                        <button className="text-xs bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded">Reschedule</button>
                                        <button className="text-xs border border-gray-300 dark:border-gray-600 dark:text-gray-300 px-3 py-1 rounded">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Heritage Remedy Tip</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 italic">
                            "Warm water with ginger and honey can help soothe a seasonal cough."
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 text-right">- Source: Sushruta Samhita</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
