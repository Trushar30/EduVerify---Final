import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email. Please try again.');
    }
  };
  
  const quickLogin = (email: string) => {
    if(login(email)) {
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="z-10 w-full max-w-md animation-popIn">
            <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">Welcome to EduVerify</h1>
            <p className="text-center text-gray-500 mb-8">Sign in to continue</p>
            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        placeholder="e.g., student@eduverify.com"
                        required
                    />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-sm">
                    Sign In
                    </button>
                </form>
                <div className="mt-6">
                    <p className="text-center text-gray-500 text-sm mb-4">Or quick login as:</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => quickLogin('student@eduverify.com')} className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-700 transition">Student</button>
                        <button onClick={() => quickLogin('teacher@eduverify.com')} className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-700 transition">Teacher</button>
                        <button onClick={() => quickLogin('admin@eduverify.com')} className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-700 transition">Admin</button>
                    </div>
                </div>
            </Card>
            <p className="text-center text-gray-500 text-sm mt-6">Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline font-semibold">Sign Up</Link></p>
        </div>
    </div>
  );
};

export default LoginPage;