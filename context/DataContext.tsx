import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Role, Class, Assignment, Submission, Report, Feedback, Notification, UserDetails, NotificationType } from '../types';
import { checkAndAwardAchievements } from '../services/achievementService';

// Dummy Data

interface DataState {
    users: User[];
    classes: Class[];
    assignments: Assignment[];
    submissions: Submission[];
    reports: Report[];
    feedback: Feedback[];
    notifications: Notification[];
}

type Action = 
    | { type: 'ADD_SUBMISSION'; payload: Submission }
    | { type: 'ADD_REPORT'; payload: { submissionId: string, report: Report } }
    | { type: 'PUBLISH_REPORT'; payload: { reportId: string, studentId: string } }
    | { type: 'ADD_USER'; payload: User }
    | { type: 'UPDATE_USER'; payload: UserDetails }
    | { type: 'TOGGLE_USER_STATUS'; payload: { userId: string } }
    | { type: 'CREATE_CLASS'; payload: { name: string, teacherId: string } }
    | { type: 'ARCHIVE_CLASS'; payload: { classId: string } }
    | { type: 'JOIN_CLASS'; payload: { userId: string, joinCode: string } }
    | { type: 'CREATE_ASSIGNMENT'; payload: Omit<Assignment, 'id'> }
    | { type: 'ADD_FEEDBACK'; payload: Omit<Feedback, 'id' | 'timestamp'> }
    | { type: 'ADD_TEACHER_FEEDBACK'; payload: { submissionId: string; feedback: string } }
    | { type: 'EDIT_CLASS'; payload: { classId: string, name: string } }
    | { type: 'REMOVE_STUDENT'; payload: { classId: string, studentId: string } }
    | { type: 'MARK_NOTIFICATION_READ'; payload: { notificationId: string } }
    | { type: 'MARK_ALL_NOTIFICATIONS_READ'; payload: { userId: string } };

const classThemes = [
    'border-blue-500',
    'border-indigo-500',
    'border-emerald-500',
    'border-amber-500',
    'border-rose-500',
];


const initialState: DataState = {
    users: [],
    classes: [],
    assignments: [],
    submissions: [],
    reports: [],
    feedback: [],
    notifications: [],
};

function dataReducer(state: DataState, action: Action): DataState {
    switch (action.type) {
        case 'ADD_SUBMISSION': {
            const assignment = state.assignments.find(a => a.id === action.payload.assignmentId);
            const classInfo = state.classes.find(c => c.id === assignment?.classId);
            const student = state.users.find(u => u.id === action.payload.studentId);
            if (!classInfo || !assignment || !student) return state;

            const newNotification: Notification = {
                id: `notif-${Date.now()}`,
                userId: classInfo.teacherId,
                message: `${student.name} submitted their work for "${assignment.title}".`,
                timestamp: new Date().toISOString(),
                read: false,
                type: NotificationType.NEW_SUBMISSION,
                linkTo: `/dashboard/classes/${classInfo.id}/assignments/${assignment.id}`
            };

            // Temporarily add new submission to state for achievement check
            const tempState = { ...state, submissions: [...state.submissions, action.payload] };
            const achievementResults = checkAndAwardAchievements(tempState, student.id, 'submission', { submission: action.payload, assignment });

            const updatedUsers = state.users.map(u => u.id === student.id ? { ...u, achievements: achievementResults.finalAchievements } : u);

            return { 
                ...state, 
                submissions: [...state.submissions, action.payload], 
                notifications: [...state.notifications, newNotification, ...achievementResults.newNotifications],
                users: updatedUsers
            };
        }
        case 'ADD_REPORT':
            return { 
                ...state, 
                reports: [...state.reports, action.payload.report],
                submissions: state.submissions.map(s => s.id === action.payload.submissionId ? { ...s, reportId: action.payload.report.id } : s)
            };
        case 'PUBLISH_REPORT': {
            const publishedReport = state.reports.find(r => r.id === action.payload.reportId);
            if (!publishedReport) return state;
            const submission = state.submissions.find(s => s.id === publishedReport.submissionId);
            if (!submission) return state;
            const assignment = state.assignments.find(a => a.id === submission.assignmentId);
            const classInfo = state.classes.find(c => c.id === assignment?.classId);
            const student = state.users.find(u => u.id === action.payload.studentId);
            if (!student) return state;
            
            const newNotification: Notification = {
                id: `notif-${Date.now()}`,
                userId: action.payload.studentId,
                message: `Your report for "${assignment?.title}" has been published.`,
                timestamp: new Date().toISOString(),
                read: false,
                type: NotificationType.REPORT_PUBLISHED,
                linkTo: `/dashboard/classes/${classInfo?.id}`
            };
            
            // Create a temporary state with the newly published report to pass to the service
            const tempState = { ...state, reports: state.reports.map(r => r.id === action.payload.reportId ? { ...r, status: 'PUBLISHED' as const } : r) };
            const achievementResults = checkAndAwardAchievements(tempState, student.id, 'report', { report: { ...publishedReport, status: 'PUBLISHED' } });

            const updatedUsers = state.users.map(u => u.id === student.id ? { ...u, achievements: achievementResults.finalAchievements } : u);

            return { 
                ...state, 
                reports: tempState.reports,
                notifications: [...state.notifications, newNotification, ...achievementResults.newNotifications],
                users: updatedUsers,
            };
        }
        case 'ADD_USER':
            if (state.users.some(u => u.email.toLowerCase() === action.payload.email.toLowerCase())) {
                return state; // User already exists
            }
            return { ...state, users: [...state.users, { ...action.payload, active: true }] };
        case 'UPDATE_USER': {
            return {
                ...state,
                users: state.users.map(u => u.id === action.payload.id ? { ...u, name: action.payload.name, email: action.payload.email, role: action.payload.role } : u)
            };
        }
        case 'TOGGLE_USER_STATUS':
            return {
                ...state,
                users: state.users.map(u => u.id === action.payload.userId ? { ...u, active: !u.active } : u)
            };
        case 'CREATE_CLASS': {
            const newClass: Class = {
                id: `class-${Date.now()}`,
                name: action.payload.name,
                teacherId: action.payload.teacherId,
                studentIds: [],
                joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                archived: false,
                classTheme: classThemes[state.classes.length % classThemes.length],
            };
            return { ...state, classes: [...state.classes, newClass] };
        }
        case 'EDIT_CLASS':
            return {
                ...state,
                classes: state.classes.map(c => c.id === action.payload.classId ? { ...c, name: action.payload.name } : c)
            };
        case 'ARCHIVE_CLASS':
            return {
                ...state,
                classes: state.classes.map(c => c.id === action.payload.classId ? { ...c, archived: true } : c)
            };
        case 'JOIN_CLASS': {
            const classToJoin = state.classes.find(c => c.joinCode === action.payload.joinCode && !c.archived);
            if (!classToJoin) return state; // or handle error
            if (classToJoin.studentIds.includes(action.payload.userId)) return state; // Already in class

            return {
                ...state,
                classes: state.classes.map(c => c.id === classToJoin.id ? { ...c, studentIds: [...c.studentIds, action.payload.userId] } : c),
                users: state.users.map(u => u.id === action.payload.userId ? { ...u, classIds: [...u.classIds, classToJoin.id] } : u)
            };
        }
        case 'REMOVE_STUDENT': {
             return {
                ...state,
                classes: state.classes.map(c => c.id === action.payload.classId 
                    ? { ...c, studentIds: c.studentIds.filter(id => id !== action.payload.studentId) } 
                    : c
                ),
                users: state.users.map(u => u.id === action.payload.studentId 
                    ? { ...u, classIds: u.classIds.filter(id => id !== action.payload.classId) } 
                    : u
                )
            };
        }
        case 'CREATE_ASSIGNMENT': {
            const newAssignment: Assignment = {
                id: `assign-${Date.now()}`,
                ...action.payload
            };
            
            const classForAssignment = state.classes.find(c => c.id === action.payload.classId);
            if (!classForAssignment) {
                return { ...state, assignments: [...state.assignments, newAssignment] };
            }

            const teacher = state.users.find(u => u.id === classForAssignment.teacherId);

            const studentNotifications: Notification[] = classForAssignment.studentIds.map(studentId => ({
                id: `notif-${Date.now()}-${studentId}`,
                userId: studentId,
                message: `New assignment posted in ${classForAssignment.name}: "${newAssignment.title}".`,
                timestamp: new Date().toISOString(),
                read: false,
                type: NotificationType.NEW_ASSIGNMENT,
                linkTo: `/dashboard/classes/${action.payload.classId}`,
            }));
            
            return { 
                ...state, 
                assignments: [...state.assignments, newAssignment],
                notifications: [...state.notifications, ...studentNotifications]
            };
        }
        case 'ADD_FEEDBACK': {
            const newFeedback: Feedback = {
                id: `fb-${Date.now()}`,
                timestamp: new Date().toISOString(),
                ...action.payload
            };
            const student = state.users.find(u => u.id === action.payload.studentId);
            const report = state.reports.find(r => r.id === action.payload.reportId);
            const submission = state.submissions.find(s => s.id === report?.submissionId);
            const assignment = state.assignments.find(a => a.id === submission?.assignmentId);
            const classInfo = state.classes.find(c => c.id === assignment?.classId);

             const newNotification: Notification = {
                id: `notif-${Date.now()}`,
                userId: action.payload.teacherId,
                message: `${student?.name || 'A student'} left feedback on a report for "${assignment?.title}".`,
                timestamp: new Date().toISOString(),
                read: false,
                type: NotificationType.NEW_FEEDBACK,
                linkTo: `/dashboard/classes/${classInfo?.id}/assignments/${assignment?.id}`,
            };

            if (!student) {
                return { ...state, feedback: [...state.feedback, newFeedback], notifications: [...state.notifications, newNotification] };
            }

            // Temporarily add feedback to state for achievement check
            const tempState = { ...state, feedback: [...state.feedback, newFeedback] };
            const achievementResults = checkAndAwardAchievements(tempState, student.id, 'feedback', {});
            
            const updatedUsers = state.users.map(u => u.id === student.id ? { ...u, achievements: achievementResults.finalAchievements } : u);

            return { 
                ...state, 
                feedback: [...state.feedback, newFeedback], 
                notifications: [...state.notifications, newNotification, ...achievementResults.newNotifications],
                users: updatedUsers
            };
        }
        case 'ADD_TEACHER_FEEDBACK': {
            const submission = state.submissions.find(s => s.id === action.payload.submissionId);
            if (!submission) return state;

            const assignment = state.assignments.find(a => a.id === submission.assignmentId);
            const classInfo = state.classes.find(c => c.id === assignment?.classId);

            if (!assignment || !classInfo) return state;

            const newNotification: Notification = {
                id: `notif-${Date.now()}`,
                userId: submission.studentId,
                message: `Your teacher left feedback on your submission for "${assignment.title}".`,
                timestamp: new Date().toISOString(),
                read: false,
                type: NotificationType.TEACHER_FEEDBACK,
                linkTo: `/dashboard/classes/${classInfo.id}`
            };

            return {
                ...state,
                submissions: state.submissions.map(s =>
                    s.id === action.payload.submissionId
                        ? { ...s, teacherFeedback: action.payload.feedback }
                        : s
                ),
                notifications: [...state.notifications, newNotification]
            };
        }
        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload.notificationId ? { ...n, read: true } : n
                )
            };
        case 'MARK_ALL_NOTIFICATIONS_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.userId === action.payload.userId ? { ...n, read: true } : n
                )
            };
        default:
            return state;
    }
}

const DataContext = createContext<{ state: DataState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(dataReducer, initialState);
    return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};