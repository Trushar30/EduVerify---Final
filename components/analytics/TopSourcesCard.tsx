import React from 'react';
import Card from '../ui/Card';
import { LinkIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface SourceData {
    source: string;
    count: number;
}

interface TopSourcesCardProps {
    data: SourceData[];
}

const TopSourcesCard: React.FC<TopSourcesCardProps> = ({ data }) => {
    return (
        <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <LinkIcon className="w-6 h-6 mr-2 text-indigo-500" />
                Top Plagiarized Sources
            </h2>
            {data.length > 0 ? (
                <ul className="space-y-3">
                    {data.map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="font-medium text-gray-700 truncate pr-4">{item.source}</span>
                            <span className="font-bold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full text-sm">{item.count}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No plagiarism sources have been flagged yet.</p>
                </div>
            )}
        </Card>
    );
};

export default TopSourcesCard;
