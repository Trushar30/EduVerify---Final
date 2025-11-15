import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/ui/Card';
import { UsersIcon, BookOpenIcon, DocumentTextIcon, ShieldCheckIcon, DocumentArrowUpIcon, DocumentMagnifyingGlassIcon, ClockIcon, SparklesIcon, ChartPieIcon, EyeIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import PlagiarismTreemap from '../../components/analytics/PlagiarismTreemap';
import TopSourcesCard from '../../components/analytics/TopSourcesCard';
import AtRiskCohortsCard from '../../components/analytics/AtRiskCohortsCard';

const AdminDashboard: React.FC = () => {
    const { state } = useData();
    const { users, classes, submissions, reports, assignments } = state;
    const [activeTab, setActiveTab] = useState('overview');

    // --- Memoized calculations for Platform Overview ---
    const platformStats = useMemo(() => {
        const totalUsers = users.length;
        const totalClasses = classes.length;
        const totalSubmissions = submissions.length;
        const avgPlagiarism = reports.length > 0 ? Math.round(reports.reduce((acc, r) => acc + r.plagiarismScore, 0) / reports.length) : 0;
        const avgAiContent = reports.length > 0 ? Math.round(reports.reduce((acc, r) => acc + r.aiContentScore, 0) / reports.length) : 0;
        const pendingReports = reports.filter(r => r.status === 'PENDING').length;
        return { totalUsers, totalClasses, totalSubmissions, avgPlagiarism, avgAiContent, pendingReports };
    }, [users, classes, submissions, reports]);

    const submissionsByClass = useMemo(() => classes.map(c => ({
        name: c.name.length > 15 ? `${c.name.substring(0, 15)}...` : c.name,
        submissions: submissions.filter(s => {
            const assignment = assignments.find(a => a.id === s.assignmentId);
            return assignment?.classId === c.id;
        }).length
    })), [classes, submissions, assignments]);

    const userGrowthData = useMemo(() => [
        { name: 'Jan', users: 1 }, { name: 'Feb', users: 2 }, { name: 'Mar', users: 2 },
        { name: 'Apr', users: 3 }, { name: 'May', users: 4 }, { name: 'Jun', users: 4 },
        { name: 'Jul', users: 5 }, { name: 'Aug', users: 6 }, { name: 'Sep', users: 6 },
        { name: 'Oct', users: 6 },
    ], []);

    const recentActivity = useMemo(() => {
        const submissionActivities = submissions.map(s => {
            const student = users.find(u => u.id === s.studentId);
            const assignment = assignments.find(a => a.id === s.assignmentId);
            return { type: 'submission' as const, id: s.id, text: `${student?.name || 'A student'} submitted to "${assignment?.title || 'an assignment'}"`, timestamp: new Date(s.submittedAt) };
        });

        const reportActivities = reports.map(r => {
            const submission = submissions.find(s => s.id === r.submissionId);
            const student = users.find(u => u.id === submission?.studentId);
            return { type: 'report' as const, id: r.id, text: `Analysis complete for ${student?.name || 'a student'}'s submission`, timestamp: new Date(r.generatedAt), isHighRisk: r.plagiarismScore > 50 || r.aiContentScore > 50 };
        });
        
        return [...submissionActivities, ...reportActivities]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5);
    }, [submissions, reports, users, assignments]);

    // --- Memoized calculations for Institutional Insights ---
    const plagiarismByClassData = useMemo(() => {
        return classes.map(cls => {
            const classAssignments = assignments.filter(a => a.classId === cls.id);
            const classSubmissions = submissions.filter(s => classAssignments.some(a => a.id === s.assignmentId));
            const classReports = reports.filter(r => classSubmissions.some(s => s.id === r.submissionId));
            
            if (classReports.length === 0) {
                return { name: cls.name, submissions: classSubmissions.length, avgScore: 0 };
            }
            const totalScore = classReports.reduce((acc, r) => acc + r.plagiarismScore, 0);
            return { name: cls.name, submissions: classSubmissions.length, avgScore: Math.round(totalScore / classReports.length) };
        }).filter(data => data.submissions > 0);
    }, [classes, assignments, submissions, reports]);

    const topPlagiarizedSourcesData = useMemo(() => {
        const sourceCounts = new Map<string, number>();
        reports.forEach(report => {
            report.plagiarizedSources.forEach(source => {
                let sourceDomain = "Internal Submission";
                if (source.sourceType === 'EXTERNAL') {
                    try {
                        sourceDomain = new URL(source.source.startsWith('http') ? source.source : `https://${source.source}`).hostname;
                    } catch (e) {
                        sourceDomain = source.source;
                    }
                }
                sourceCounts.set(sourceDomain, (sourceCounts.get(sourceDomain) || 0) + 1);
            });
        });
        return Array.from(sourceCounts.entries())
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [reports]);

    const atRiskCohortsData = useMemo(() => {
        const studentScores = new Map<string, { totalScore: number, count: number }>();
        reports.forEach(report => {
            const submission = submissions.find(s => s.id === report.submissionId);
            if (submission) {
                const studentData = studentScores.get(submission.studentId) || { totalScore: 0, count: 0 };
                studentData.totalScore += report.plagiarismScore;
                studentData.count += 1;
                studentScores.set(submission.studentId, studentData);
            }
        });

        const atRiskStudentIds = new Set<string>();
        studentScores.forEach((data, studentId) => {
            if (data.count >= 2 && data.totalScore / data.count > 50) {
                atRiskStudentIds.add(studentId);
            }
        });

        const classRiskCount = new Map<string, { name: string, count: number }>();
        atRiskStudentIds.forEach(studentId => {
            const user = users.find(u => u.id === studentId);
            user?.classIds.forEach(classId => {
                const classInfo = classes.find(c => c.id === classId);
                if (classInfo) {
                    const classData = classRiskCount.get(classId) || { name: classInfo.name, count: 0 };
                    classData.count += 1;
                    classRiskCount.set(classId, classData);
                }
            });
        });

        return Array.from(classRiskCount.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [reports, submissions, users, classes]);

    const ActivityIcon: React.FC<{ type: 'submission' | 'report'; isHighRisk?: boolean }> = ({ type, isHighRisk }) => {
        const iconBaseClass = "w-6 h-6";
        if (type === 'submission') return <DocumentArrowUpIcon className={`${iconBaseClass} text-blue-600`} />;
        if (type === 'report') return isHighRisk ? <ShieldCheckIcon className={`${iconBaseClass} text-red-600`} /> : <DocumentMagnifyingGlassIcon className={`${iconBaseClass} text-indigo-600`} />;
        return <ClockIcon className={`${iconBaseClass} text-gray-500`} />;
    };

    const tabs = [
        { id: 'overview', name: 'Platform Overview', icon: ChartPieIcon },
        { id: 'insights', name: 'Institutional Insights', icon: EyeIcon },
    ];
    
    return (
        <div className="animation-popIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <tab.icon className="w-5 h-5 mr-2"/>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Link to="users" className="block hover:no-underline"><Card className="h-full"><div className="flex items-center"><div className="p-3 bg-blue-100 rounded-lg mr-4"><UsersIcon className="w-6 h-6 text-blue-600"/></div><div><p className="text-gray-500 text-sm">Total Users</p><p className="text-2xl font-bold text-gray-800">{platformStats.totalUsers}</p></div></div></Card></Link>
                            <Link to="classes" className="block hover:no-underline"><Card className="h-full"><div className="flex items-center"><div className="p-3 bg-indigo-100 rounded-lg mr-4"><BookOpenIcon className="w-6 h-6 text-indigo-600"/></div><div><p className="text-gray-500 text-sm">Total Classes</p><p className="text-2xl font-bold text-gray-800">{platformStats.totalClasses}</p></div></div></Card></Link>
                            <Card><div className="flex items-center"><div className="p-3 bg-emerald-100 rounded-lg mr-4"><DocumentTextIcon className="w-6 h-6 text-emerald-600"/></div><div><p className="text-gray-500 text-sm">Submissions</p><p className="text-2xl font-bold text-gray-800">{platformStats.totalSubmissions}</p></div></div></Card>
                            <Card><div className="flex items-center"><div className="p-3 bg-red-100 rounded-lg mr-4"><ShieldCheckIcon className="w-6 h-6 text-red-600"/></div><div><p className="text-gray-500 text-sm">Avg. Plagiarism</p><p className="text-2xl font-bold text-gray-800">{platformStats.avgPlagiarism}%</p></div></div></Card>
                            <Card><div className="flex items-center"><div className="p-3 bg-purple-100 rounded-lg mr-4"><SparklesIcon className="w-6 h-6 text-purple-600"/></div><div><p className="text-gray-500 text-sm">Avg. AI Content</p><p className="text-2xl font-bold text-gray-800">{platformStats.avgAiContent}%</p></div></div></Card>
                            <Card><div className="flex items-center"><div className="p-3 bg-amber-100 rounded-lg mr-4"><ClockIcon className="w-6 h-6 text-amber-600"/></div><div><p className="text-gray-500 text-sm">Pending Reports</p><p className="text-2xl font-bold text-gray-800">{platformStats.pendingReports}</p></div></div></Card>
                        </div>
                        <Card><h2 className="text-xl font-semibold mb-4 text-gray-800">Submissions per Class</h2><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={submissionsByClass} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/><XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }}/><YAxis stroke="#6b7280"/><Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}/><Legend/><Bar dataKey="submissions" fill="#3b82f6"/></BarChart></ResponsiveContainer></div></Card>
                    </div>
                    <div className="space-y-6">
                        <Card><h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2><ul className="space-y-4">{recentActivity.map(item => (<li key={item.id} className="flex items-start"><div className="p-2 bg-gray-100 rounded-full mr-3 mt-1"><ActivityIcon type={item.type} isHighRisk={(item as any).isHighRisk}/></div><div><p className="text-sm text-gray-700">{item.text}</p><p className="text-xs text-gray-400">{item.timestamp.toLocaleString()}</p></div></li>))}{recentActivity.length === 0 && <p className="text-center text-gray-500 py-4">No recent activity.</p>}</ul></Card>
                        <Card><h2 className="text-xl font-semibold mb-4 text-gray-800">User Growth</h2><div className="h-60"><ResponsiveContainer width="100%" height="100%"><LineChart data={userGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/><XAxis dataKey="name" stroke="#6b7280"/><YAxis stroke="#6b7280" allowDecimals={false}/><Tooltip/><Legend/><Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2}/></LineChart></ResponsiveContainer></div></Card>
                    </div>
                </div>
            )}
            
            {activeTab === 'insights' && (
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Plagiarism Heatmap by Class</h2>
                        <p className="text-sm text-gray-500 mb-4">Visualize academic integrity across classes. Larger blocks have more submissions, and redder blocks have higher average plagiarism scores.</p>
                        <PlagiarismTreemap data={plagiarismByClassData} />
                    </Card>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TopSourcesCard data={topPlagiarizedSourcesData} />
                        <AtRiskCohortsCard data={atRiskCohortsData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
