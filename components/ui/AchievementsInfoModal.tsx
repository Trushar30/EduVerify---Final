import React from 'react';
import Modal from './Modal';
import { Achievement } from '../../types';
import { ALL_ACHIEVEMENTS } from '../../services/achievementService';
import { iconMap, iconColorMap } from '../../utils/achievementIcons';
import { LockClosedIcon } from '@heroicons/react/24/solid';

interface AchievementsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedAchievements: Achievement[];
}

const AchievementsInfoModal: React.FC<AchievementsInfoModalProps> = ({ isOpen, onClose, unlockedAchievements }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="All Available Achievements" maxWidth="max-w-2xl">
        <div className="space-y-4">
            <p className="text-sm text-gray-500">Here are all the badges you can earn in EduVerify. Keep up the great work to collect them all!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALL_ACHIEVEMENTS.map((template) => {
                    const unlocked = unlockedAchievements.find(a => a.type === template.type);
                    const IconComponent = iconMap[template.icon] || iconMap.default;
                    const color = unlocked ? (iconColorMap[template.icon] || iconColorMap.default) : 'text-gray-400';

                    return (
                        <div key={template.type} className={`p-4 rounded-lg flex items-start gap-4 transition-all ${unlocked ? 'bg-green-50 border-green-200 border' : 'bg-gray-50 border-gray-200 border'}`}>
                            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${unlocked ? 'bg-white' : 'bg-gray-200'} ${unlocked ? '' : 'grayscale'}`}>
                                <IconComponent className={`w-7 h-7 ${color}`} />
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>{template.name}</h4>
                                <p className="text-sm text-gray-500">{template.description}</p>
                                {unlocked ? (
                                    <p className="text-xs text-green-600 font-semibold mt-1">Unlocked: {new Date(unlocked.unlockedAt).toLocaleDateString()}</p>
                                ) : (
                                     <p className="text-xs text-gray-400 font-semibold mt-1 flex items-center"><LockClosedIcon className="w-3 h-3 mr-1"/> Locked</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
             <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
                <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm">
                    Close
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default AchievementsInfoModal;