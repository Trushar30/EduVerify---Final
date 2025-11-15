import React, { useMemo } from 'react';
import { Achievement } from '../../types';
import { iconMap, iconColorMap } from '../../utils/achievementIcons';

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const IconComponent = useMemo(() => iconMap[achievement.icon] || iconMap.default, [achievement.icon]);
  const iconColor = useMemo(() => iconColorMap[achievement.icon] || iconColorMap.default, [achievement.icon]);

  const tooltipText = `${achievement.description}\nUnlocked on: ${new Date(achievement.unlockedAt).toLocaleDateString()}`;

  return (
    <div
      className="group relative flex flex-col items-center text-center p-3 w-28 h-28 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      title={tooltipText}
    >
      <div className={`w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mb-2 transition-transform group-hover:scale-110 ${iconColor}`}>
        <IconComponent className="w-7 h-7" />
      </div>
      <p className="text-xs font-semibold text-gray-700 leading-tight">{achievement.name}</p>
    </div>
  );
};

export default AchievementBadge;