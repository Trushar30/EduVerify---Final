import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';

const JoinClassPage: React.FC = () => {
    const { user } = useAuth();
    const { state, dispatch } = useData();
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    if(!user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const code = joinCode.trim().toUpperCase();
        if(!code) {
            setError('Please enter a join code.');
            return;
        }

        const classExists = state.classes.some(c => c.joinCode === code && !c.archived);

        if (classExists) {
            dispatch({ type: 'JOIN_CLASS', payload: { userId: user.id, joinCode: code } });
            setSuccess('Successfully joined the class! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard/classes');
            }, 1500);
        } else {
            setError('Invalid or archived join code. Please check the code and try again.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Join a New Class</h1>
            <Card className="max-w-md mx-auto">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 mb-2">Enter Class Join Code</label>
                    <input
                        type="text"
                        id="joinCode"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono tracking-widest text-lg text-center"
                        placeholder="e.g., QPHYS789"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
                    <button type="submit" className="mt-4 w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-sm">
                        Join Class
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default JoinClassPage;