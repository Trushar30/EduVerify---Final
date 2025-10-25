// Fix: Removed incorrect self-import of 'User'. The 'User' interface is defined within this file.

export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  classIds: string[];
  active?: boolean; // Added for deactivation
}

// For forms, password isn't part of the main User model
export type UserDetails = Omit<User, 'id' | 'classIds' | 'active'> & { id?: string, password?: string };

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