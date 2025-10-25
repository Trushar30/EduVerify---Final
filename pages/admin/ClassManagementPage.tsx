import React from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import { TrashIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const AdminClassManagementPage: React.FC = () => {
    const { state, dispatch } = useData();
    const { classes, users } = state;

    const getTeacherName = (teacherId: string) => {
        return users.find(u => u.id === teacherId)?.name || 'Unknown Teacher';
    };

    const handleArchive = (classId: string) => {
        if(window.confirm('Are you sure you want to archive this class? This action cannot be undone.')) {
            dispatch({ type: 'ARCHIVE_CLASS', payload: { classId } });
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Global Class Management</h1>
            <Card>
                <Table headers={['Class Name', 'Teacher', 'Students', 'Join Code', 'Status', 'Actions']}>
                    {classes.map(cls => (
                        <tr key={cls.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{cls.name}</td>
                            <td className="px-6 py-4">{getTeacherName(cls.teacherId)}</td>
                            <td className="px-6 py-4">{cls.studentIds.length}</td>
                            <td className="px-6 py-4 font-mono text-gray-700">{cls.joinCode}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${!cls.archived ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {!cls.archived ? 'Active' : 'Archived'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {!cls.archived && (
                                    <button onClick={() => handleArchive(cls.id)} className="text-gray-500 hover:text-amber-600" title="Archive Class">
                                        <ArchiveBoxIcon className="w-5 h-5"/>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </div>
    );
};

export default AdminClassManagementPage;