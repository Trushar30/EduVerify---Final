import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import { Role, User } from '../types';
import { ShieldCheckIcon, EnvelopeIcon, UserIcon, LockClosedIcon, AcademicCapIcon, UsersIcon } from '@heroicons/react/24/outline';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { state, dispatch } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Use Supabase Auth to sign up
    import('../services/supabaseClient').then(async ({ supabase }) => {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } }
      });

      if (signUpError) {
        setError(signUpError.message || 'Signup failed.');
        return;
      }

      // Insert user into users table
      const { user } = data;
      if (user) {
        const { error: dbError } = await supabase.from('users').insert({
          id: user.id,
          name,
          email,
          role,
          avatar_url: '',
          bio: '',
          is_active: true
        });
        if (dbError) {
          setError(dbError.message || 'Could not save user profile.');
          return;
        }
        // Optionally, update context state here if needed
        navigate('/dashboard');
      } else {
        setError('Signup failed. No user returned.');
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 flex-col justify-between relative overflow-hidden">
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
              Join the Future of Academic Integrity
            </h2>
            <p className="text-xl text-indigo-100 leading-relaxed mb-8">
              Create your free account and start ensuring academic honesty with AI-powered detection.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animation-popIn">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <ShieldCheckIcon className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">EduVerify</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Start your journey to academic excellence</p>
          </div>

          <Card className="shadow-xl">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="Alex Johnson"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
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
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="student@eduverify.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    role === Role.STUDENT 
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 ring-2 ring-blue-500' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value={Role.STUDENT} 
                      checked={role === Role.STUDENT} 
                      onChange={() => setRole(Role.STUDENT)} 
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <AcademicCapIcon className={`w-8 h-8 ${role === Role.STUDENT ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`font-bold ${role === Role.STUDENT ? 'text-blue-700' : 'text-gray-700'}`}>Student</span>
                    </div>
                  </label>
                  
                  <label className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    role === Role.TEACHER 
                      ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-500 ring-2 ring-indigo-500' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value={Role.TEACHER} 
                      checked={role === Role.TEACHER} 
                      onChange={() => setRole(Role.TEACHER)} 
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <UsersIcon className={`w-8 h-8 ${role === Role.TEACHER ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className={`font-bold ${role === Role.TEACHER ? 'text-indigo-700' : 'text-gray-700'}`}>Teacher</span>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Create Account
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </Card>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
              Sign In
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

export default SignupPage;
