import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { NotificationType } from '../types';
import { BellIcon, CheckCircleIcon, DocumentPlusIcon, DocumentCheckIcon, ChatBubbleLeftEllipsisIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.NEW_ASSIGNMENT:
            return <DocumentPlusIcon className="w-6 h-6 text-blue-500" />;
        case NotificationType.NEW_SUBMISSION:
            return <DocumentCheckIcon className="w-6 h-6 text-indigo-500" />;
        case NotificationType.NEW_FEEDBACK:
            return <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-amber-500" />;
        case NotificationType.REPORT_PUBLISHED:
            return <AcademicCapIcon className="w-6 h-6 text-emerald-500" />;
        default:
            return <BellIcon className="w-6 h-6 text-gray-500" />;
    }
};

const NotificationItem: React.FC<{ notification: any; onMarkRead: (e: React.MouseEvent, id: string) => void; }> = ({ notification, onMarkRead }) => {
    const content = (
        <div 
            className={`flex items-start p-4 rounded-lg transition-colors w-full text-left ${
                notification.read ? 'bg-gray-50' : 'bg-white hover:bg-gray-100'
            }`}
        >
            <div className={`mr-4 mt-1 flex-shrink-0`}>
                {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-grow">
                <p className={`text-gray-800 ${!notification.read && 'font-semibold'}`}>{notification.message}</p>
                <p className="text-sm text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
            </div>
            {!notification.read && (
                <div className="ml-4 flex-shrink-0">
                    <button onClick={(e) => onMarkRead(e, notification.id)} className="p-2 rounded-full hover:bg-blue-100 group" aria-label="Mark as read">
                        <span className="block h-2.5 w-2.5 rounded-full bg-blue-500 group-hover:bg-blue-600"></span>
                    </button>
                </div>
            )}
        </div>
    );
    
    if (notification.linkTo) {
        return <Link to={notification.linkTo} className="block">{content}</Link>;
    }
    return content;
};

const NotificationsPage: React.FC = () => {
    const { user } = useAuth();
    const { state, dispatch } = useData();

    if (!user) return null;

    const userNotifications = state.notifications
        .filter(n => n.userId === user.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const hasUnread = userNotifications.some(n => !n.read);

    const handleMarkAllRead = () => {
        if (user) {
            dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', payload: { userId: user.id } });
        }
    };

    const handleMarkOneRead = (e: React.MouseEvent, notificationId: string) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { notificationId } });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                {hasUnread && (
                    <button onClick={handleMarkAllRead} className="text-sm font-semibold text-blue-600 hover:underline">
                        Mark all as read
                    </button>
                )}
            </div>
            <Card>
                {userNotifications.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {userNotifications.map(notification => (
                            <li key={notification.id}>
                                <NotificationItem notification={notification} onMarkRead={handleMarkOneRead} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <CheckCircleIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="font-semibold">All caught up!</p>
                        <p>You have no new notifications.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default NotificationsPage;