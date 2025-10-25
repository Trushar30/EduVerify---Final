import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import { Role, User } from '../types';

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

    // Check if user already exists
    const userExists = state.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      setError('An account with this email already exists.');
      return;
    }
    
    // Create new user object
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      classIds: [],
    };

    // Add user to the data context
    dispatch({ type: 'ADD_USER', payload: newUser });

    // Log the new user in
    const success = login(email);
    if (success) {
      navigate('/dashboard');
    } else {
        // This should ideally not happen if the user was just added
        setError('An unexpected error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="z-10 w-full max-w-md animation-popIn">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">Create Account</h1>
        <p className="text-center text-gray-500 mb-8">Join EduVerify Today</p>
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="e.g., Alex Johnson"
                required
              />
            </div>
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
            <div className="mb-4">
              <label htmlFor="password" aria-label="Password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
             <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <div className="flex gap-4">
                    <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all text-center ${role === Role.STUDENT ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="radio" name="role" value={Role.STUDENT} checked={role === Role.STUDENT} onChange={() => setRole(Role.STUDENT)} className="sr-only"/>
                        <span className="font-semibold text-gray-800">Student</span>
                    </label>
                     <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all text-center ${role === Role.TEACHER ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="radio" name="role" value={Role.TEACHER} checked={role === Role.TEACHER} onChange={() => setRole(Role.TEACHER)} className="sr-only"/>
                        <span className="font-semibold text-gray-800">Teacher</span>
                    </label>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-sm">
              Sign Up
            </button>
          </form>
        </Card>
        <p className="text-center text-gray-500 text-sm mt-6">Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign In</Link></p>
      </div>
    </div>
  );
};

export default SignupPage;