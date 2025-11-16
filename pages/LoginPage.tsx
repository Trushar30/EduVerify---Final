import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { ShieldCheckIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

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
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white mb-12">
            <ShieldCheckIcon className="w-10 h-10" />
            <span className="text-3xl font-bold">EduVerify</span>
          </Link>
          
          <div className="mt-20">
            <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
              Welcome Back to Academic Excellence
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Sign in to access your integrity management dashboard and continue ensuring academic honesty.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animation-popIn">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EduVerify</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-500">Enter your credentials to continue</p>
          </div>

          <Card className="shadow-xl">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="student@eduverify.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="mt-2 text-right">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </a>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Quick Demo Login</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button 
                  onClick={() => quickLogin('student@eduverify.com')} 
                  className="px-4 py-2 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all font-semibold text-sm border border-blue-200"
                >
                  Student
                </button>
                <button 
                  onClick={() => quickLogin('teacher@eduverify.com')} 
                  className="px-4 py-2 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition-all font-semibold text-sm border border-indigo-200"
                >
                  Teacher
                </button>
                <button 
                  onClick={() => quickLogin('admin@eduverify.com')} 
                  className="px-4 py-2 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 rounded-lg hover:from-emerald-100 hover:to-emerald-200 transition-all font-semibold text-sm border border-emerald-200"
                >
                  Admin
                </button>
              </div>
            </div>
          </Card>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-bold">
              Sign Up Free
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
