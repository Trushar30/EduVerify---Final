import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { User, Role, UserDetails } from '../../types';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UserForm: React.FC<{ user?: UserDetails; onSave: (user: UserDetails) => void; onCancel: () => void; }> = ({ user, onSave, onCancel }) => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>(user?.role || Role.STUDENT);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: user?.id, name, email, password, role });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            {!user && <div>
              <label htmlFor="password" aria-label="Password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value as Role)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm">Save User</button>
            </div>
        </form>
    );
}


const UserManagementPage: React.FC = () => {
    const { state, dispatch } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDetails | undefined>(undefined);

    const handleOpenCreateModal = () => {
        setEditingUser(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (user: UserDetails) => {
        if (user.id) { // Editing existing user
            dispatch({ type: 'UPDATE_USER', payload: user });
        } else { // Creating new user
            const newUser: User = {
                id: `user-${Date.now()}`,
                name: user.name,
                email: user.email,
                role: user.role,
                classIds: [],
                active: true
            };
            dispatch({ type: 'ADD_USER', payload: newUser });
        }
        setIsModalOpen(false);
    };

    const handleToggleStatus = (userId: string) => {
        if(window.confirm('Are you sure you want to change this user\'s status?')) {
            dispatch({ type: 'TOGGLE_USER_STATUS', payload: { userId } });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <button onClick={handleOpenCreateModal} className="flex items-center bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create User
                </button>
            </div>
            <Card>
                <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
                    {state.users.map(user => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {user.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 flex gap-4">
                                <button onClick={() => handleOpenEditModal(user)} className="text-gray-500 hover:text-blue-600"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleToggleStatus(user.id)} className={user.active ? 'text-gray-500 hover:text-red-600' : 'text-gray-500 hover:text-green-600'}>
                                    {user.active ? <XMarkIcon className="w-5 h-5"/> : <CheckIcon className="w-5 h-5"/>}
                                </button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Create New User'}>
                <UserForm user={editingUser} onSave={handleSaveUser} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default UserManagementPage;