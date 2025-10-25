import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Profile</h1>
      <Card className="max-w-2xl animation-popIn">
        <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
                <UserCircleIcon className="w-24 h-24 text-gray-400"/>
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-lg text-blue-600">{user.email}</p>
                <span className="mt-2 inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
                    {user.role}
                </span>
            </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Account Details</h3>
            <div className="space-y-2 text-gray-600">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Active</span></p>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;