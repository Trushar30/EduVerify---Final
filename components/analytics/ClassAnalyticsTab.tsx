import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User } from '../../types';

interface ClassAnalyticsTabProps {
    classId: string;
}

const COLORS = ['#ef4444', '#22c55e', '#f59e0b']; // Red (Late), Green (On Time), Yellow (Early)

const ClassAnalyticsTab: React.FC<ClassAnalyticsTabProps> = ({ classId }) => {
    const { state } = useData();

    // Memoized data calculations
    const analyticsData = useMemo(() => {
        const classAssignments = state.assignments.filter(a => a.classId === classId).sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        const classStudents = state.users.filter(u => u.classIds.includes(classId));
        
        // 1. Integrity Scores Over Time
        const integrityTrends = classAssignments.map(assignment => {
            const assignmentSubmissions = state.submissions.filter(s => s.assignmentId === assignment.id);
            const assignmentReports = state.reports.filter(r => assignmentSubmissions.some(s => s.id === r.submissionId));
            
            if (assignmentReports.length === 0) {
                return { name: assignment.title, 'Avg Plagiarism': 0, 'Avg AI Content': 0 };
            }

            const avgPlagiarism = Math.round(assignmentReports.reduce((acc, r) => acc + r.plagiarismScore, 0) / assignmentReports.length);
            const avgAI = Math.round(assignmentReports.reduce((acc, r) => acc + r.aiContentScore, 0) / assignmentReports.length);
            
            return { name: assignment.title, 'Avg Plagiarism': avgPlagiarism, 'Avg AI Content': avgAI };
        });

        // 2. Submission Timeliness
        let onTime = 0;
        let late = 0;
        let early = 0;
        const allSubmissionsInClass = state.submissions.filter(sub => classAssignments.some(a => a.id === sub.assignmentId));

        allSubmissionsInClass.forEach(sub => {
            const assignment = classAssignments.find(a => a.id === sub.assignmentId);
            if (assignment) {
                const submissionDate = new Date(sub.submittedAt);
                const deadlineDate = new Date(assignment.deadline);
                const diffHours = (deadlineDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60);

                if (diffHours < 0) {
                    late++;
                } else if (diffHours > 24) {
                    early++;
                } else {
                    onTime++;
                }
            }
        });
        const timelinessData = [
            { name: 'Late', value: late },
            { name: 'On Time', value: onTime },
            { name: 'Early', value: early },
        ].filter(d => d.value > 0);

        // 3. Student Leaderboard
        const studentPerformance = classStudents.map(student => {
            const studentSubmissions = state.submissions.filter(s => s.studentId === student.id && classAssignments.some(a => a.id === s.assignmentId));
            const studentReports = state.reports.filter(r => studentSubmissions.some(s => s.id === r.submissionId));
            
            if (studentReports.length === 0) {
                return { name: student.name, avgPlagiarism: null, avgAI: null, submissions: studentSubmissions.length };
            }
            const avgPlagiarism = Math.round(studentReports.reduce((acc, r) => acc + r.plagiarismScore, 0) / studentReports.length);
            const avgAI = Math.round(studentReports.reduce((acc, r) => acc + r.aiContentScore, 0) / studentReports.length);

            return { name: student.name, avgPlagiarism, avgAI, submissions: studentSubmissions.length };
        }).sort((a, b) => {
            const scoreA = a.avgPlagiarism === null ? Infinity : a.avgPlagiarism + (a.avgAI ?? 0);
            const scoreB = b.avgPlagiarism === null ? Infinity : b.avgPlagiarism + (b.avgAI ?? 0);
            return scoreA - scoreB;
        }); // Sort by lowest combined score

        return { integrityTrends, timelinessData, studentPerformance };
    }, [classId, state]);

    if (analyticsData.integrityTrends.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No assignment data available yet for this class.</p>
                <p className="text-sm">Analytics will appear here once students make submissions and reports are generated.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Integrity Scores Over Time</h3>
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.integrityTrends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#6b7280" />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Line type="monotone" dataKey="Avg Plagiarism" stroke="#ef4444" strokeWidth={2} />
                            <Line type="monotone" dataKey="Avg AI Content" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Submission Timeliness</h3>
                     {analyticsData.timelinessData.length > 0 ? (
                        <div style={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={analyticsData.timelinessData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {analyticsData.timelinessData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                     ) : (
                         <div className="flex items-center justify-center h-full text-center py-16 text-gray-500">No submissions yet.</div>
                     )}
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Performance Summary</h3>
                     <div className="overflow-x-auto max-h-72">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Student</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Submissions</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Avg Plagiarism</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Avg AI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {analyticsData.studentPerformance.map(student => (
                                    <tr key={student.name}>
                                        <td className="px-4 py-2 font-medium text-gray-800">{student.name}</td>
                                        <td className="px-4 py-2 text-gray-600">{student.submissions}</td>
                                        <td className="px-4 py-2 text-gray-600">{student.avgPlagiarism === null ? 'N/A' : `${student.avgPlagiarism}%`}</td>
                                        <td className="px-4 py-2 text-gray-600">{student.avgAI === null ? 'N/A' : `${student.avgAI}%`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ClassAnalyticsTab;