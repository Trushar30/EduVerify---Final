// Fix: Removed incorrect self-import of 'User'. The 'User' interface is defined within this file.

export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export enum AchievementType {
    FIRST_SUBMISSION = 'FIRST_SUBMISSION',
    ON_TIME_SUBMISSION = 'ON_TIME_SUBMISSION',
    INTEGRITY_ACE = 'INTEGRITY_ACE',
    STREAK_3 = 'STREAK_3',
    STREAK_5 = 'STREAK_5',
    MOST_IMPROVED = 'MOST_IMPROVED',
    PROACTIVE_PLANNER = 'PROACTIVE_PLANNER',
    PERFECT_SCORE = 'PERFECT_SCORE',
    FEEDBACK_PROVIDER = 'FEEDBACK_PROVIDER',
}

export interface Achievement {
    id: string;
    type: AchievementType;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  classIds: string[];
  active?: boolean; // Added for deactivation
  achievements: Achievement[];
}

// For forms, password isn't part of the main User model
export type UserDetails = Omit<User, 'id' | 'classIds' | 'active' | 'achievements'> & { id?: string, password?: string };

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  joinCode: string;
  archived?: boolean; // Added for archiving
  classTheme?: string; // For UI theming
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  instructions: string;
  deadline: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileName: string;
  fileContent: string; // Extracted text for analysis
  fileData?: string; // Base64 encoded file data for preview
  mimeType?: string; // e.g., 'application/pdf'
  submittedAt: string;
  reportId?: string;
  teacherFeedback?: string;
}

export interface PlagiarizedSource {
  source: string; // URL for external, or Student Name for internal
  snippet: string;
  confidence: number;
  sourceType: 'INTERNAL' | 'EXTERNAL';
  studentName?: string; // Explicit name for internal source
}


export interface Report {
  id:string;
  submissionId: string;
  plagiarismScore: number;
  aiContentScore: number;
  analysisSummary: string;
  plagiarizedSources: PlagiarizedSource[];
  status: 'PENDING' | 'PUBLISHED';
  generatedAt: string;
}

export interface Feedback {
  id: string;
  reportId: string;
  studentId: string;
  teacherId: string;
  message: string;
  timestamp: string;
}

export enum NotificationType {
    NEW_SUBMISSION = 'NEW_SUBMISSION',
    REPORT_PUBLISHED = 'REPORT_PUBLISHED',
    NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
    NEW_FEEDBACK = 'NEW_FEEDBACK',
    ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',
    TEACHER_FEEDBACK = 'TEACHER_FEEDBACK',
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  linkTo?: string; // e.g., /dashboard/classes/class1/assignments/assign1
}

export interface AnalysisResult {
    plagiarismScore: number;
    aiContentScore: number;
    analysisSummary: string;
    plagiarizedSources: PlagiarizedSource[];
}