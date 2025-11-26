import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaPlus } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                                <img className="h-10 w-auto" src="/logo.png" alt="RailPing" />
                                <span className="font-bold text-xl text-blue-900 hidden sm:block">RailPing</span>
                            </Link>
                        </div>

                        {isAuthenticated && (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 hidden md:block">
                                    Welcome, <span className="font-medium text-gray-900">{user?.name}</span>
                                </span>

                                {location.pathname === '/dashboard' && (
                                    <Link
                                        to="/create-alert"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        <FaPlus /> <span className="hidden sm:inline">New Alert</span>
                                    </Link>
                                )}

                                <button
                                    onClick={logout}
                                    className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    title="Logout"
                                >
                                    <FaSignOutAlt size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} RailPing. Track your trains seamlessly.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
