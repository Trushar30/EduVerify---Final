import React from 'react';
import Card from '../ui/Card';
import { ShieldExclamationIcon, UsersIcon } from '@heroicons/react/24/outline';

interface CohortData {
    name: string;
    count: number;
}

interface AtRiskCohortsCardProps {
    data: CohortData[];
}

const AtRiskCohortsCard: React.FC<AtRiskCohortsCardProps> = ({ data }) => {
    return (
        <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <ShieldExclamationIcon className="w-6 h-6 mr-2 text-red-500" />
                At-Risk Class Cohorts
            </h2>
            <p className="text-sm text-gray-500 mb-4">Classes with the most students averaging over 50% plagiarism across multiple reports.</p>
            {data.length > 0 ? (
                 <ul className="space-y-3">
                    {data.map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                           <div>
                             <p className="font-medium text-gray-700">{item.name}</p>
                           </div>
                           <div className="flex items-center">
                             <span className="font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full text-sm flex items-center">
                                <UsersIcon className="w-4 h-4 mr-1.5"/>
                                {item.count} Student(s)
                             </span>
                           </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No at-risk cohorts identified at this time.</p>
                </div>
            )}
        </Card>
    );
};

export default AtRiskCohortsCard;
