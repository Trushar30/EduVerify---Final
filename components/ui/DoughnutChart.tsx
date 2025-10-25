import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DoughnutChartProps {
  score: number;
  title: string;
  color: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ score, title, color }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  const colors = [color, '#e5e7eb']; // Main color and a light gray for the rest

  return (
    <div className="relative flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <div style={{ width: '150px', height: '150px' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1 flex items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold" style={{color}}>{score}%</span>
      </div>
    </div>
  );
};

export default DoughnutChart;