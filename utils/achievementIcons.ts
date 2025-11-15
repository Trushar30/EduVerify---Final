import React from 'react';
import {
  RocketLaunchIcon,
  ClockIcon,
  ShieldCheckIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';

export const iconMap: { [key: string]: React.ElementType } = {
  RocketLaunch: RocketLaunchIcon,
  Clock: ClockIcon,
  ShieldCheck: ShieldCheckIcon,
  Fire: FireIcon,
  ArrowTrendingUp: ArrowTrendingUpIcon,
  CalendarDays: CalendarDaysIcon,
  CheckBadge: CheckBadgeIcon,
  ChatBubbleLeftRight: ChatBubbleLeftRightIcon,
  default: TrophyIcon,
};

export const iconColorMap: { [key: string]: string } = {
    RocketLaunch: 'text-green-500',
    Clock: 'text-blue-500',
    ShieldCheck: 'text-indigo-500',
    Fire: 'text-red-500',
    ArrowTrendingUp: 'text-emerald-500',
    CalendarDays: 'text-purple-500',
    CheckBadge: 'text-yellow-500',
    ChatBubbleLeftRight: 'text-cyan-500',
    default: 'text-gray-500',
}