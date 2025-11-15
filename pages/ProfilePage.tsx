import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Role } from '../types';
import Card from '../components/ui/Card';
import AchievementBadge from '../components/ui/AchievementBadge';
import { UserCircleIcon, TrophyIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import AchievementsInfoModal from '../components/ui/AchievementsInfoModal';

const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const { state } = useData();
  const [isAchievementsInfoModalOpen, setIsAchievementsInfoModalOpen] = useState(false);
  
  // Get the most up-to-date user object from the state
  const user = state.users.find(u => u.id === authUser?.id);


  if (!user) {
    return <div>Loading user profile...</div>;
  }

  const isStudent = user.role === Role.STUDENT;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card className="animation-popIn">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
                    <div className="flex-shrink-0 mb-4 sm:mb-0">
                        <UserCircleIcon className="w-24 h-24 text-gray-400"/>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 text-center sm:text-left">{user.name}</h2>
                        <p className="text-lg text-blue-600 text-center sm:text-left">{user.email}</p>
                        <span className="mt-2 inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
                            {user.role}
                        </span>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Account Details</h3>
                    <div className="space-y-2 text-gray-600">
                        <p><strong>User ID:</strong> {user.id}</p>
                        <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{user.active ? 'Active' : 'Inactive'}</span></p>
                         <p><strong>Classes Enrolled:</strong> {user.classIds.length}</p>
                    </div>
                </div>
            </Card>
        </div>
        {isStudent && (
            <div>
                <Card className="animation-popIn" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <TrophyIcon className="w-6 h-6 mr-2 text-amber-500"/>
                        My Achievements
                         <button onClick={() => setIsAchievementsInfoModalOpen(true)} className="ml-2 text-gray-400 hover:text-blue-500" aria-label="About achievements">
                            <InformationCircleIcon className="w-5 h-5"/>
                        </button>
                    </h3>
                    {user.achievements && user.achievements.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                           {user.achievements
                                .sort((a,b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
                                .map(ach => (
                               <AchievementBadge key={ach.id} achievement={ach}/>
                           ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                            <p>Your achievements will appear here.</p>
                            <p className="text-sm">Keep up the great work!</p>
                        </div>
                    )}
                </Card>
            </div>
        )}
      </div>
       <AchievementsInfoModal 
            isOpen={isAchievementsInfoModalOpen}
            onClose={() => setIsAchievementsInfoModalOpen(false)}
            unlockedAchievements={user.achievements}
        />
    </div>
  );
};

export default ProfilePage;