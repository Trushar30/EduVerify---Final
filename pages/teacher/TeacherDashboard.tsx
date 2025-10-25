import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { BookOpenIcon, DocumentCheckIcon, BellIcon, PlusIcon } from '@heroicons/react/24/outline';

const TeacherDashboard: React.FC = () => {
    const { user } = useAuth();
    const { state } = useData();

    if (!user) return null;

    const teacherClasses = state.classes.filter(c => c.teacherId === user.id);
    const assignmentsInMyClasses = state.assignments.filter(a => teacherClasses.some(c => c.id === a.classId));
    const submissions = state.submissions.filter(s => assignmentsInMyClasses.some(a => a.id === s.assignmentId));
    const reports = state.reports.filter(r => submissions.some(s => s.id === r.submissionId));
    const pendingReports = reports.filter(r => r.status === 'PENDING').length;
    const notifications = state.notifications.filter(n => n.userId === user.id && !n.read).length;


    return (
        <div className="animation-popIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
                <Link to="/dashboard/classes" className="flex items-center bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <BookOpenIcon className="w-5 h-5 mr-2" />
                    Manage My Classes
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                            <BookOpenIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Active Classes</p>
                            <p className="text-2xl font-bold text-gray-800">{teacherClasses.filter(c => !c.archived).length}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                            <DocumentCheckIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Pending Reports</p>
                            <p className="text-2xl font-bold text-gray-800">{pendingReports}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                     <div className="flex items-center">
                        <div className="p-3 bg-amber-100 rounded-lg mr-4">
                            <BellIcon className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Unread Notifications</p>
                            <p className="text-2xl font-bold text-gray-800">{notifications}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link to="/dashboard/classes" className="flex-1 text-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition border border-gray-200">
                        <p className="font-semibold text-gray-700">Create New Assignment</p>
                        <p className="text-sm text-gray-500">Go to a class to add a new assignment.</p>
                    </Link>
                    <Link to="/dashboard/notifications" className="flex-1 text-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition border border-gray-200">
                         <p className="font-semibold text-gray-700">View Feedback</p>
                         <p className="text-sm text-gray-500">Check recent student feedback on reports.</p>
                    </Link>
                </div>
            </Card>

        </div>
    );
};

export default TeacherDashboard;