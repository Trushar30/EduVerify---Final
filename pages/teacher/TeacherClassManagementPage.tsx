import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Class } from '../../types';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { PlusIcon, EllipsisVerticalIcon, PencilIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ClassForm: React.FC<{ 
    classItem?: Class;
    onSave: (name: string, classId?: string) => void; 
    onCancel: () => void 
}> = ({ classItem, onSave, onCancel }) => {
    const [name, setName] = useState(classItem?.name || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim(), classItem?.id);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
              <input type="text" id="className" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Introduction to History" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm">{classItem ? 'Save Changes' : 'Create Class'}</button>
            </div>
        </form>
    );
}

const ClassCard: React.FC<{ classItem: Class; onEdit: () => void; onArchive: () => void; }> = ({ classItem, onEdit, onArchive }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
         <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200 border-t-4 ${classItem.classTheme || 'border-t-gray-500'}`}>
            <div className="p-4 flex flex-col justify-between relative flex-grow">
                <div className="flex justify-between items-start">
                    <Link to={`/dashboard/classes/${classItem.id}`} className="hover:underline">
                        <h2 className="text-xl font-bold truncate pr-8 text-gray-800">{classItem.name}</h2>
                    </Link>
                    <div className="relative">
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen); }} className="p-1 rounded-full text-gray-500 hover:bg-gray-100" aria-haspopup="true" aria-expanded={menuOpen} aria-label={`Actions for class ${classItem.name}`}>
                            <EllipsisVerticalIcon className="w-6 h-6"/>
                        </button>
                        {menuOpen && (
                             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); setMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <PencilIcon className="w-4 h-4 mr-2"/> Edit
                                </button>
                                {!classItem.archived && <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onArchive(); setMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <ArchiveBoxIcon className="w-4 h-4 mr-2"/> Archive
                                </button>}
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{classItem.studentIds.length} student(s)</p>
                 {classItem.archived && <span className="absolute top-4 right-10 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Archived</span>}
            </div>
            <Link to={`/dashboard/classes/${classItem.id}`} className="block border-t border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-500">Join Code: <span className="font-mono tracking-widest text-gray-700 font-semibold">{classItem.joinCode}</span></p>
            </Link>
        </div>
    )
}

const TeacherClassManagementPage: React.FC = () => {
    const { user } = useAuth();
    const { state, dispatch } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | undefined>(undefined);

    if (!user) return null;

    const teacherClasses = state.classes.filter(c => c.teacherId === user.id);

    const handleSaveClass = (name: string, classId?: string) => {
        if (classId) { // Editing
            dispatch({ type: 'EDIT_CLASS', payload: { classId, name } });
        } else { // Creating
            dispatch({ type: 'CREATE_CLASS', payload: { name, teacherId: user.id } });
        }
        setIsModalOpen(false);
        setEditingClass(undefined);
    };

    const openCreateModal = () => {
        setEditingClass(undefined);
        setIsModalOpen(true);
    }
    
    const openEditModal = (classItem: Class) => {
        setEditingClass(classItem);
        setIsModalOpen(true);
    }

    const handleArchive = (classId: string) => {
        if (window.confirm('Are you sure you want to archive this class?')) {
            dispatch({ type: 'ARCHIVE_CLASS', payload: { classId } });
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
                <button onClick={openCreateModal} className="flex items-center bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create New Class
                </button>
            </div>
            
            {teacherClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teacherClasses.map(cls => (
                       <ClassCard 
                            key={cls.id}
                            classItem={cls}
                            onEdit={() => openEditModal(cls)}
                            onArchive={() => handleArchive(cls.id)}
                       />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <p className="text-gray-500">You haven't created any classes yet.</p>
                    <button onClick={openCreateModal} className="mt-4 font-semibold text-blue-600 hover:underline">
                        Create your first class
                    </button>
                </Card>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClass ? 'Edit Class' : 'Create a New Class'}>
                <ClassForm classItem={editingClass} onSave={handleSaveClass} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default TeacherClassManagementPage;