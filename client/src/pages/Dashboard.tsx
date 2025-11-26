import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FaTrash, FaTrain, FaMapMarkerAlt, FaBell, FaPlus } from 'react-icons/fa';

interface Alert {
    id: number;
    trainNumber: string;
    alertStationCode: string;
    user: {
        email: string;
        phoneNumber: string;
    };
    journeyDate: string;
}

const Dashboard: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [user, setUser] = useState<any>(null);

    const fetchAlerts = async () => {
        try {
            const response = await api.get('/alerts');
            setAlerts(response.data);
            if (response.data.length > 0 && response.data[0].user) {
                setUser(response.data[0].user);
            }
        } catch (error) {
            console.error('Error fetching alerts', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = async (id: number) => {
        if (!confirm('Are you sure you want to delete this alert?')) return;
        try {
            await api.delete(`/alerts/${id}`);
            fetchAlerts();
        } catch (error) {
            console.error('Error deleting alert', error);
        }
    };

    const handleUpdatePhone = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put('/user/phone', { phoneNumber });
            setShowPhoneModal(false);
            fetchAlerts(); // Refresh to get updated user info
            alert('Phone number updated!');
        } catch (error) {
            console.error('Error updating phone', error);
            alert('Failed to update phone number');
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Your Alerts</h1>
                    <p className="text-gray-500">Manage your train tracking notifications</p>
                </div>
                <div className="flex gap-2">
                    {user && !user.phoneNumber && (
                        <button
                            onClick={() => setShowPhoneModal(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                        >
                            Enable SMS
                        </button>
                    )}
                    <Link
                        to="/create-alert"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm md:hidden"
                    >
                        <FaPlus /> New Alert
                    </Link>
                </div>
            </div>

            {/* Phone Number Modal */}
            {showPhoneModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Enable SMS Alerts</h3>
                        <p className="text-gray-600 mb-4 text-sm">Enter your phone number (with country code) to receive SMS notifications.</p>
                        <form onSubmit={handleUpdatePhone}>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+919876543210"
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPhoneModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {alerts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBell className="text-blue-500 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts yet</h3>
                    <p className="text-gray-500 mb-6">Create your first alert to start tracking trains.</p>
                    <Link
                        to="/create-alert"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <FaPlus className="mr-2" /> Create Alert
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-lg">
                                            <FaTrain className="text-orange-600 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{alert.trainNumber}</h3>
                                            <p className="text-xs text-gray-500">Train Number</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteAlert(alert.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Delete Alert"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <div>
                                            <span className="text-sm font-medium block text-gray-900">{alert.alertStationCode}</span>
                                            <span className="text-xs text-gray-500">Alert Station</span>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Journey Date</span>
                                        <span className="font-medium text-gray-900">{alert.journeyDate}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 flex justify-between">
                                <span>Email: {alert.user?.email ? 'On' : 'Off'}</span>
                                <span className={alert.user?.phoneNumber ? 'text-green-600 font-medium' : 'text-gray-400'}>
                                    SMS: {alert.user?.phoneNumber ? 'On' : 'Off'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
