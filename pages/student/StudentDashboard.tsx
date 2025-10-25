import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { BookOpenIcon, ClockIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';


const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const { state } = useData();

    if (!user) return null;

    const myClasses = state.classes.filter(c => c.studentIds.includes(user.id));
    const mySubmissions = state.submissions.filter(s => s.studentId === user.id);
    const assignmentsInMyClasses = state.assignments.filter(a => myClasses.some(c => c.id === a.classId));
    
    const upcomingAssignments = assignmentsInMyClasses.filter(a => {
        const isSubmitted = mySubmissions.some(s => s.assignmentId === a.id);
        const isPastDeadline = new Date() > new Date(a.deadline);
        return !isSubmitted && !isPastDeadline;
    });

    const publishedReports = state.reports.filter(r => mySubmissions.some(s => s.id === r.submissionId) && r.status === 'PUBLISHED').length;

    return (
        <div className="animation-popIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
                <Link to="/dashboard/join-class" className="flex items-center bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Join a Class
                </Link>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                            <BookOpenIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Enrolled Classes</p>
                            <p className="text-2xl font-bold text-gray-800">{myClasses.length}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                            <ClockIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Upcoming Deadlines</p>
                            <p className="text-2xl font-bold text-gray-800">{upcomingAssignments.length}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                     <div className="flex items-center">
                        <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                            <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Published Reports</p>
                            <p className="text-2xl font-bold text-gray-800">{publishedReports}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Assignments</h2>
                {upcomingAssignments.length > 0 ? (
                    <ul className="space-y-3">
                        {upcomingAssignments.slice(0, 3).map(a => {
                            const aClass = myClasses.find(c => c.id === a.classId);
                            return (
                                <li key={a.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200">
                                    <div>
                                        <p className="font-semibold text-gray-700">{a.title}</p>
                                        <p className="text-sm text-gray-500">{aClass?.name}</p>
                                    </div>
                                    <Link to={`/dashboard/classes/${aClass?.id}`} className="text-blue-600 hover:underline text-sm font-semibold">
                                        View
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming assignments. You're all caught up!</p>
                )}
                 {upcomingAssignments.length > 3 && (
                     <div className="text-center mt-4">
                        <Link to="/dashboard/classes" className="text-blue-600 hover:underline font-semibold text-sm">View all...</Link>
                     </div>
                 )}
            </Card>
        </div>
    );
};

export default StudentDashboard;