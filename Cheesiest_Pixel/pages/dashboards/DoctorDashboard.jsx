import React from 'react';
import AIChat from '../../components/AIChat';
import { Users, Clock, Calendar, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', patients: 12 },
    { name: 'Tue', patients: 19 },
    { name: 'Wed', patients: 15 },
    { name: 'Thu', patients: 22 },
    { name: 'Fri', patients: 18 },
    { name: 'Sat', patients: 10 },
];

const DoctorDashboard = ({ user }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Welcome, {user.name}</h1>
                <div className="text-sm text-gray-500 dark:text-dark-muted">{new Date().toLocaleDateString()}</div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Appointments Today', value: '8', icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                    { label: 'Pending Reports', value: '3', icon: FileText, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
                    { label: 'Total Patients', value: '1,240', icon: Users, color: 'text-green-600 dark:text-dark-secondary', bg: 'bg-green-100 dark:bg-dark-secondary/20' },
                    { label: 'Avg Consult Time', value: '15m', icon: Clock, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={stat.color} size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-dark-muted text-xs font-medium uppercase">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                        <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4">Patient Visits Trend</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} />
                                    <Line type="monotone" dataKey="patients" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                        <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4">Today's Appointments</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-dark-muted">
                                <thead className="text-xs text-gray-700 dark:text-dark-text uppercase bg-gray-50 dark:bg-dark-bg">
                                    <tr>
                                        <th className="px-6 py-3">Patient</th>
                                        <th className="px-6 py-3">Time</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Rohan Das', time: '09:00 AM', type: 'In-Person', status: 'Confirmed' },
                                        { name: 'Sarah Khan', time: '10:30 AM', type: 'Video', status: 'Pending' },
                                        { name: 'Amit Verma', time: '11:15 AM', type: 'In-Person', status: 'Confirmed' },
                                    ].map((row, i) => (
                                        <tr key={i} className="bg-white dark:bg-dark-surface border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg/50">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-dark-text">{row.name}</td>
                                            <td className="px-6 py-4">{row.time}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs ${row.type === 'Video' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                                    {row.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-green-600 dark:text-dark-secondary">{row.status}</td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-600 dark:text-blue-400 hover:underline">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar / AI Tool */}
                <div className="space-y-6">
                    <AIChat />

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 rounded-xl p-6 text-white shadow-md">
                        <h3 className="font-bold text-lg mb-2">Telemedicine Portal</h3>
                        <p className="text-indigo-100 text-sm mb-4">You have 1 upcoming video consultation.</p>
                        <button className="w-full bg-white dark:bg-dark-surface text-indigo-600 dark:text-indigo-400 py-2 rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-dark-bg transition-colors">
                            Join Meeting Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
