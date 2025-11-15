import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { Role } from '../../types';
import { HomeIcon, UsersIcon, BookOpenIcon, BellIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useData } from '../../context/DataContext';

const Sidebar: React.FC = () => {
    const { user } = useAuth();

    const getNavLinks = () => {
        const baseLinks = [
            { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
        ];

        const roleLinks = {
            [Role.ADMIN]: [
                { name: 'User Management', icon: UsersIcon, path: '/dashboard/users' },
                { name: 'Class Management', icon: BookOpenIcon, path: '/dashboard/classes' },
            ],
            [Role.TEACHER]: [
                { name: 'My Classes', icon: BookOpenIcon, path: '/dashboard/classes' },
                { name: 'Notifications', icon: BellIcon, path: '/dashboard/notifications' },
            ],
            [Role.STUDENT]: [
                { name: 'My Classes', icon: BookOpenIcon, path: '/dashboard/classes' },
                { name: 'Notifications', icon: BellIcon, path: '/dashboard/notifications' },
            ],
        };

        const profileLink = { name: 'Profile', icon: UserCircleIcon, path: '/dashboard/profile' };

        return user ? [...baseLinks, ...roleLinks[user.role], profileLink] : [];
    };
    
    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="p-6 text-center border-b border-gray-200">
                <NavLink to="/dashboard" className="text-2xl font-bold text-blue-600">EduVerify</NavLink>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <ul>
                    {getNavLinks().map(link => (
                        <li key={link.name}>
                           <NavLink 
                                to={link.path} 
                                end={link.path === '/dashboard'}
                                className={({isActive}) => 
                                    `flex items-center px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                                        isActive 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }`
                                }
                            >
                                <link.icon className="w-5 h-5 mr-3"/>
                                {link.name}
                           </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { state } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = state.notifications.filter(n => n.userId === user?.id && !n.read).length;

    return (
        <header className="h-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-end px-8 flex-shrink-0">
            <div className="flex items-center">
                <NavLink 
                  to="/dashboard/notifications" 
                  className="relative p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'View notifications'}
                >
                  <BellIcon className="w-6 h-6 text-gray-500"/>
                  {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true">
                            <span className="sr-only">{unreadCount} unread notifications</span>
                        </span>
                    )}
                </NavLink>
                <div className="flex items-center ml-4">
                    <UserCircleIcon className="w-10 h-10 text-gray-400"/>
                    <div className="ml-3">
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
                    </div>
                    <button onClick={handleLogout} className="ml-6 p-2 rounded-full hover:bg-gray-100 transition" aria-label="Logout">
                       <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500"/>
                    </button>
                </div>
            </div>
        </header>
    );
};

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;