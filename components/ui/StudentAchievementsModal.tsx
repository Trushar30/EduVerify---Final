import React from 'react';
import Modal from './Modal';
import { User } from '../../types';
import AchievementBadge from './AchievementBadge';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface StudentAchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
}

const StudentAchievementsModal: React.FC<StudentAchievementsModalProps> = ({ isOpen, onClose, student }) => {
  if (!student) return null;

  const sortedAchievements = student.achievements?.sort((a,b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Achievements for ${student.name}`}>
      {sortedAchievements && sortedAchievements.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
            {sortedAchievements.map(ach => (
                <AchievementBadge key={ach.id} achievement={ach} />
            ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
            <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="font-semibold">{student.name} hasn't unlocked any achievements yet.</p>
        </div>
      )}
       <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm">
                Close
            </button>
        </div>
    </Modal>
  );
};

export default StudentAchievementsModal;