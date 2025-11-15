import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

interface TreemapData {
    name: string;
    submissions: number;
    avgScore: number;
}

interface PlagiarismTreemapProps {
    data: TreemapData[];
}

const getColor = (score: number) => {
    if (score > 50) return '#ef4444'; // red-500
    if (score > 20) return '#f59e0b'; // amber-500
    return '#22c55e'; // green-500
};

const CustomTreemapContent: React.FC<any> = (props) => {
    const { depth, x, y, width, height, name, avgScore } = props;

    if (width < 60 || height < 40) {
        // For very small nodes, just show the colored block
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} style={{ fill: getColor(avgScore), stroke: '#fff', strokeWidth: 2 / (depth + 1e-10) }} />
            </g>
        );
    }

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: getColor(avgScore),
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                }}
            />
            <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="bold" stroke="#000" strokeWidth="0.2px" paintOrder="stroke">
                {name}
            </text>
            <text x={x + width / 2} y={y + height / 2 + 22} textAnchor="middle" fill="#fff" fontSize={12} stroke="#000" strokeWidth="0.2px" paintOrder="stroke">
                Avg: {avgScore}%
            </text>
        </g>
    );
};

const PlagiarismTreemap: React.FC<PlagiarismTreemapProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center py-12 text-gray-500">No submission data available to generate heatmap.</div>;
    }

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <Treemap
                    data={data}
                    dataKey="submissions"
                    ratio={4 / 3}
                    stroke="#fff"
                    fill="#8884d8"
                    content={<CustomTreemapContent />}
                >
                    <Tooltip content={({ payload }) => {
                        if (payload && payload[0]) {
                            const { name, submissions, avgScore } = payload[0].payload;
                            return (
                                <div className="bg-white p-3 border border-gray-300 rounded-md shadow-lg">
                                    <p className="font-bold text-gray-800">{name}</p>
                                    <p className="text-sm text-gray-600">Submissions: {submissions}</p>
                                    <p className="text-sm" style={{ color: getColor(avgScore) }}>Avg. Plagiarism: {avgScore}%</p>
                                </div>
                            );
                        }
                        return null;
                    }} />
                </Treemap>
            </ResponsiveContainer>
        </div>
    );
};

export default PlagiarismTreemap;
