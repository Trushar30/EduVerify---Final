import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import AdminDashboard from './admin/AdminDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';
import StudentDashboard from './student/StudentDashboard';
import MainLayout from '../components/layout/MainLayout';
import UserManagementPage from './admin/UserManagementPage';
import AdminClassManagementPage from './admin/ClassManagementPage';
import TeacherClassManagementPage from './teacher/TeacherClassManagementPage';
import TeacherClassDetailPage from './teacher/TeacherClassDetailPage';
import TeacherAssignmentDetailPage from './teacher/TeacherAssignmentDetailPage';
import StudentClassManagementPage from './student/StudentClassManagementPage';
import StudentClassDetailPage from './student/StudentClassDetailPage';
import JoinClassPage from './student/JoinClassPage';
import NotificationsPage from './NotificationsPage';
import ProfilePage from './ProfilePage';
import ProtectedRoute from '../components/ProtectedRoute';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    const renderRoutes = () => {
        switch (user?.role) {
            case Role.ADMIN:
                return (
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><UserManagementPage /></ProtectedRoute>} />
                        <Route path="classes" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><AdminClassManagementPage /></ProtectedRoute>} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                );
            case Role.TEACHER:
                return (
                    <Routes>
                        <Route index element={<TeacherDashboard />} />
                        <Route path="classes" element={<ProtectedRoute allowedRoles={[Role.TEACHER]}><TeacherClassManagementPage /></ProtectedRoute>} />
                        <Route path="classes/:classId" element={<ProtectedRoute allowedRoles={[Role.TEACHER]}><TeacherClassDetailPage /></ProtectedRoute>} />
                        <Route path="classes/:classId/assignments/:assignmentId" element={<ProtectedRoute allowedRoles={[Role.TEACHER]}><TeacherAssignmentDetailPage /></ProtectedRoute>} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                );
            case Role.STUDENT:
                return (
                    <Routes>
                        <Route index element={<StudentDashboard />} />
                        <Route path="classes" element={<ProtectedRoute allowedRoles={[Role.STUDENT]}><StudentClassManagementPage /></ProtectedRoute>} />
                        <Route path="classes/:classId" element={<ProtectedRoute allowedRoles={[Role.STUDENT]}><StudentClassDetailPage /></ProtectedRoute>} />
                        <Route path="join-class" element={<ProtectedRoute allowedRoles={[Role.STUDENT]}><JoinClassPage /></ProtectedRoute>} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                );
            default:
                return <div>Invalid user role.</div>;
        }
    };

    return (
       <MainLayout>
         <div className="animation-fadeIn">
            {renderRoutes()}
         </div>
       </MainLayout>
    );
};

export default Dashboard;