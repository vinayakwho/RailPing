import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { FaTrain, FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CreateAlert: React.FC = () => {
    const [trainNumber, setTrainNumber] = useState('');
    const [journeyDate, setJourneyDate] = useState('');
    const [alertStationCode, setAlertStationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/alerts', {
                trainNumber,
                journeyDate,
                alertStationCode,
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating alert', error);
            alert('Failed to create alert');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 px-8 py-6">
                    <h2 className="text-2xl font-bold text-white">Create New Alert</h2>
                    <p className="text-blue-100 mt-1">Set up a notification for your upcoming journey</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Train Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaTrain className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={trainNumber}
                                    onChange={(e) => setTrainNumber(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., 12345"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Journey Date (DDMMYYYY)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCalendarAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={journeyDate}
                                    onChange={(e) => setJourneyDate(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., 25122023"
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Format: DDMMYYYY</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Station Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={alertStationCode}
                                    onChange={(e) => setAlertStationCode(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., NDLS"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4">
                        <Link
                            to="/dashboard"
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                'Create Alert'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAlert;
