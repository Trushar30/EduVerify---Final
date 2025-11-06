import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { Role } from '../types';

jest.mock('../services/geminiService', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockProtectedRoute = jest.fn();
jest.mock('../components/ProtectedRoute', () => {
  return {
    __esModule: true,
    default: (props: {
      children: React.ReactNode;
      allowedRoles: Role[];
    }) => {
      mockProtectedRoute(props.allowedRoles);
      return <div data-testid="protected-route">{props.children}</div>;
    },
  };
});

jest.mock('../components/layout/MainLayout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="main-layout">{children}</div>
    ),
  };
});
jest.mock('../pages/admin/AdminDashboard', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="admin-dashboard">Admin Dashboard</div>,
  };
});
jest.mock('../pages/admin/UserManagementPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="user-management">User Management</div>,
  };
});
jest.mock('../pages/student/StudentDashboard', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="student-dashboard">Student Dashboard</div>,
  };
});
jest.mock('../pages/admin/ClassManagementPage', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="admin-class-management">Admin Class Management</div>
    ),
  };
});
jest.mock('../pages/teacher/TeacherDashboard', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="teacher-dashboard">Teacher Dashboard</div>,
  };
});
jest.mock('../pages/teacher/TeacherClassManagementPage', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="teacher-class-management">
        Teacher Class Management
      </div>
    ),
  };
});
jest.mock('../pages/teacher/TeacherClassDetailPage', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="teacher-class-detail">Teacher Class Detail</div>
    ),
  };
});
jest.mock('../pages/teacher/TeacherAssignmentDetailPage', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="teacher-assignment-detail">
        Teacher Assignment Detail
      </div>
    ),
  };
});
jest.mock('../pages/student/StudentClassManagementPage', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="student-class-management">
        Student Class Management
      </div>
    ),
  };
});
jest.mock('../pages/student/StudentClassDetailPage', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="student-class-detail">Student Class Detail</div>
    ),
  };
});
jest.mock('../pages/student/JoinClassPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="join-class">Join Class</div>,
  };
});
jest.mock('../pages/NotificationsPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="notifications">Notifications</div>,
  };
});
jest.mock('../pages/ProfilePage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="profile">Profile</div>,
  };
});

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

const mockUseAuth = jest.fn();
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => mockUseAuth(),
}));

describe('Dashboard Routing', () => {
  it('should not allow a student to access the user management page', () => {
    const studentUser = { ...mockUser, role: Role.STUDENT };
    mockUseAuth.mockReturnValue({ user: studentUser });

    render(
      <MemoryRouter initialEntries={['/dashboard/users']}>
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('user-management')).not.toBeInTheDocument();
  });

  it('should allow an admin to access the user management page and use the ProtectedRoute', () => {
    const adminUser = { ...mockUser, role: Role.ADMIN };
    mockUseAuth.mockReturnValue({ user: adminUser });

    render(
      <MemoryRouter initialEntries={['/dashboard/users']}>
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('user-management')).toBeInTheDocument();
    expect(mockProtectedRoute).toHaveBeenCalledWith([Role.ADMIN]);
  });
});
