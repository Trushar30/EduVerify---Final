import { User, Role } from '../types';

export const DUMMY_USERS: User[] = [
    { id: 'admin1', name: 'Admin User', email: 'admin@eduverify.com', role: Role.ADMIN, classIds: [], active: true },
    { id: 'teacher1', name: 'Dr. Evelyn Reed', email: 'teacher@eduverify.com', role: Role.TEACHER, classIds: ['class1'], active: true },
    { id: 'student1', name: 'Alex Johnson', email: 'student@eduverify.com', role: Role.STUDENT, classIds: ['class1'], active: true },
    { id: 'student2', name: 'Maria Garcia', email: 'student2@eduverify.com', role: Role.STUDENT, classIds: ['class1'], active: true },
    { id: 'student3', name: 'Chen Wei', email: 'student3@eduverify.com', role: Role.STUDENT, classIds: [], active: false },
    { id: 'teacher2', name: 'Mr. Ben Carter', email: 'teacher2@eduverify.com', role: Role.TEACHER, classIds: [], active: true },
];
