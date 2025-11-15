import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Assignment, User } from '../../types';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { PlusIcon, ArrowLeftIcon, UsersIcon, DocumentTextIcon, ChatBubbleLeftEllipsisIcon, SparklesIcon, TrashIcon, TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import StudentAchievementsModal from '../../components/ui/StudentAchievementsModal';
import ClassAnalyticsTab from '../../components/analytics/ClassAnalyticsTab';

const CreateAssignmentForm: React.FC<{ classId: string, onSave: (assignment: Omit<Assignment, 'id'>) => void, onCancel: () => void }> = ({ classId, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ classId, title, instructions, deadline: new Date(deadline).toISOString() });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={4} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
             <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm">Create Assignment</button>
            </div>
        </form>
    )
}

const TeacherClassDetailPage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const { user } = useAuth();
    const { state, dispatch } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'stream' | 'assignments' | 'people' | 'analytics'>('stream');
    const [viewingStudentAchievements, setViewingStudentAchievements] = useState<User | null>(null);
    
    const currentClass = state.classes.find(c => c.id === classId);
    
    if (!currentClass || !user) return <div>Class not found or user not logged in.</div>;
    
    const assignments = state.assignments.filter(a => a.classId === currentClass.id);
    const students = state.users.filter(u => currentClass.studentIds.includes(u.id));
    
    const handleCreateAssignment = (assignment: Omit<Assignment, 'id'>) => {
        dispatch({ type: 'CREATE_ASSIGNMENT', payload: assignment });
        setIsModalOpen(false);
    }

    const handleRemoveStudent = (studentId: string, studentName: string) => {
        if (window.confirm(`Are you sure you want to remove ${studentName} from the class?`)) {
            dispatch({ type: 'REMOVE_STUDENT', payload: { classId: currentClass.id, studentId } });
        }
    }

    const renderStream = () => {
        const allSubmissionsInClass = state.submissions.filter(s => assignments.some(a => a.id === s.assignmentId));
        const allReportIdsInClass = allSubmissionsInClass.map(s => s.reportId).filter(Boolean);
        const feedbackForClass = state.feedback.filter(f => allReportIdsInClass.includes(f.reportId));

        const streamItems = [
            ...allSubmissionsInClass.map(s => ({ type: 'submission', data: s, timestamp: s.submittedAt })),
            ...feedbackForClass.map(f => ({ type: 'feedback', data: f, timestamp: f.timestamp }))
        ].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return (
            <div>
                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
                 {streamItems.length > 0 ? (
                    <div className="space-y-4">
                        {streamItems.map(item => {
                            if (item.type === 'submission') {
                                const student = students.find(s => s.id === item.data.studentId);
                                const assignment = assignments.find(a => a.id === item.data.assignmentId);
                                return (
                                    <div key={item.data.id} className="p-4 bg-gray-50 rounded-lg flex items-center gap-4 border border-gray-200">
                                        <DocumentTextIcon className="w-6 h-6 text-blue-500 flex-shrink-0"/>
                                        <div>
                                            <p className="text-gray-700">{student?.name} submitted '{item.data.fileName}' for assignment: <strong>{assignment?.title}</strong></p>
                                            <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )
                            }
                             if (item.type === 'feedback') {
                                const student = students.find(s => s.id === item.data.studentId);
                                return (
                                    <div key={item.data.id} className="p-4 bg-gray-50 rounded-lg flex items-center gap-4 border border-gray-200">
                                        <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-indigo-500 flex-shrink-0"/>
                                        <div>
                                            <p className="text-gray-700">{student?.name} left feedback: "{item.data.message}"</p>
                                            <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                 ) : <p className="text-gray-500 text-center py-8">No recent activity in this class.</p>}
            </div>
        )
    };
    
    const renderAssignments = () => (
        <>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Class Assignments</h2>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm">
                <PlusIcon className="w-5 h-5 mr-2" /> Create Assignment
            </button>
        </div>
        <div className="space-y-4">
            {assignments.map(a => {
                const submissionsCount = state.submissions.filter(s => s.assignmentId === a.id).length;
                return (
                    <Link to={`/dashboard/classes/${classId}/assignments/${a.id}`} key={a.id} className="block p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-blue-600">{a.title}</h3>
                                <p className="text-xs text-gray-500">Due: {new Date(a.deadline).toLocaleString()}</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">{submissionsCount} / {students.length} Submitted</span>
                        </div>
                    </Link>
                )
            })}
             {assignments.length === 0 && <p className="text-gray-500 text-center py-8">No assignments created for this class yet.</p>}
        </div>
        </>
    );

    const renderPeople = () => (
         <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Teacher</h2>
             <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center mb-6">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">Students ({students.length})</h2>
            <ul className="space-y-3">
            {students.map(student => (
                <li key={student.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                     <div className="flex items-center gap-4">
                        {student.achievements && student.achievements.length > 0 && (
                            <button onClick={() => setViewingStudentAchievements(student)} className="flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700 bg-amber-100 px-3 py-1 rounded-full transition">
                                <TrophyIcon className="w-4 h-4 mr-1.5" />
                                {student.achievements.length}
                            </button>
                        )}
                        <button onClick={() => handleRemoveStudent(student.id, student.name)} className="text-gray-400 hover:text-red-500 transition" aria-label={`Remove ${student.name} from the class`}>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </li>
            ))}
             {students.length === 0 && <p className="text-gray-500 text-center py-8">No students have joined this class yet.</p>}
            </ul>
        </div>
    );

    const tabs = [
        { id: 'stream', name: 'Stream', icon: SparklesIcon },
        { id: 'assignments', name: 'Assignments', icon: DocumentTextIcon },
        { id: 'people', name: 'People', icon: UsersIcon },
        { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    ];

    return (
        <div>
            <Link to="/dashboard/classes" className="flex items-center text-sm text-blue-600 hover:underline mb-4 font-semibold">
                <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                Back to My Classes
            </Link>
            <div className={`p-6 rounded-lg mb-6 bg-white border border-gray-200 border-t-4 ${currentClass.classTheme}`}>
                 <h1 className="text-3xl font-bold mb-2 text-gray-900">{currentClass.name}</h1>
                <p className="font-mono text-gray-600">Join Code: {currentClass.joinCode}</p>
            </div>
           

            <div className="mb-6">
                 <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                            }
                        >
                        <tab.icon className="w-5 h-5 mr-2"/>
                        {tab.name}
                        </button>
                    ))}
                    </nav>
                </div>
            </div>

            <Card>
                {activeTab === 'stream' && renderStream()}
                {activeTab === 'assignments' && renderAssignments()}
                {activeTab === 'people' && renderPeople()}
                {activeTab === 'analytics' && <ClassAnalyticsTab classId={currentClass.id} />}
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Assignment">
                <CreateAssignmentForm classId={currentClass.id} onSave={handleCreateAssignment} onCancel={() => setIsModalOpen(false)}/>
            </Modal>

            <StudentAchievementsModal 
                isOpen={!!viewingStudentAchievements}
                onClose={() => setViewingStudentAchievements(null)}
                student={viewingStudentAchievements}
            />
        </div>
    );
};

export default TeacherClassDetailPage;