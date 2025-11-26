import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            await login(credentialResponse.credential);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01]">
                <div className="bg-blue-600 p-8 text-center">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <img src="/logo.png" alt="RailPing Logo" className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-blue-100">Sign in to manage your train alerts</p>
                </div>

                <div className="p-8">
                    <div className="space-y-6">
                        <div className="text-center text-gray-600 text-sm mb-6">
                            Use your Google account to access RailPing securely.
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleSuccess}
                                onError={() => console.log('Login Failed')}
                                theme="filled_blue"
                                shape="pill"
                                size="large"
                                width="100%"
                            />
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-400">
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
