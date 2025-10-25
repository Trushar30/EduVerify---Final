import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/ui/Card';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const StudentClassManagementPage: React.FC = () => {
    const { user } = useAuth();
    const { state } = useData();

    if (!user) return null;

    const studentClasses = state.classes.filter(c => user.classIds.includes(c.id));
    const getTeacherName = (teacherId: string) => state.users.find(u => u.id === teacherId)?.name || 'N/A';
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
                <Link to="/dashboard/join-class" className="flex items-center bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Join a Class
                </Link>
            </div>
            
            {studentClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studentClasses.map(cls => (
                         <div key={cls.id} className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200 border-t-4 ${cls.classTheme}`}>
                            <div className="p-4 flex flex-col justify-between relative flex-grow">
                                <Link to={`/dashboard/classes/${cls.id}`} className="hover:underline">
                                    <h2 className="text-xl font-bold truncate pr-8 text-gray-800">{cls.name}</h2>
                                </Link>
                                <p className="text-sm text-gray-500 mt-2">{getTeacherName(cls.teacherId)}</p>
                                {cls.archived && <span className="absolute top-4 right-4 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Archived</span>}
                            </div>
                             <Link to={`/dashboard/classes/${cls.id}`} className="block border-t border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors text-right">
                                <span className="text-sm font-semibold text-blue-600">View Class</span>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <p className="text-gray-500">You are not enrolled in any classes yet.</p>
                    <Link to="/dashboard/join-class" className="mt-4 inline-block font-semibold text-blue-600 hover:underline">
                        Join your first class
                    </Link>
                </Card>
            )}
        </div>
    );
};

export default StudentClassManagementPage;