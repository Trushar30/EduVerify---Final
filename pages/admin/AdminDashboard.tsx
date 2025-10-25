import React from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/ui/Card';
import { UsersIcon, BookOpenIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { state } = useData();

    const platformStats = {
        totalUsers: state.users.length,
        totalClasses: state.classes.length,
        totalSubmissions: state.submissions.length,
    };

    const submissionsByClass = state.classes.map(c => ({
        name: c.name,
        submissions: state.submissions.filter(s => {
            const assignment = state.assignments.find(a => a.id === s.assignmentId);
            return assignment?.classId === c.id;
        }).length
    }));

    return (
        <div className="animation-popIn">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="users" className="block hover:no-underline">
                    <Card className="h-full">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                <UsersIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Users</p>
                                <p className="text-2xl font-bold text-gray-800">{platformStats.totalUsers}</p>
                            </div>
                        </div>
                    </Card>
                </Link>
                <Link to="classes" className="block hover:no-underline">
                    <Card className="h-full">
                        <div className="flex items-center">
                            <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                                <BookOpenIcon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Classes</p>
                                <p className="text-2xl font-bold text-gray-800">{platformStats.totalClasses}</p>
                            </div>
                        </div>
                    </Card>
                </Link>
                <Card>
                     <div className="flex items-center">
                        <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                            <DocumentTextIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Submissions</p>
                            <p className="text-2xl font-bold text-gray-800">{platformStats.totalSubmissions}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Submissions per Class</h2>
                <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={submissionsByClass}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                        <Legend />
                        <Bar dataKey="submissions" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;