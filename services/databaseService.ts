import { supabase } from './supabaseClient';
import { User, Class, Assignment, Submission, AnalysisReport, Achievement, Role } from '../types';

export class DatabaseService {
  // ============================================
  // USER OPERATIONS
  // ============================================
  
  static async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    // Map database fields to our User type
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as Role,
      classIds: [],
      achievements: []
    };
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching user by email:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as Role,
      classIds: [],
      achievements: []
    };
  }

  static async createUser(userData: { email: string; name: string; role: Role }): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name,
        role: userData.role,
        is_active: true
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as Role,
      classIds: [],
      achievements: []
    };
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.active !== undefined) dbUpdates.is_active = updates.active;

    if (Object.keys(dbUpdates).length === 0) {
      return this.getUser(id);
    }

    const { data, error} = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as Role,
      classIds: [],
      achievements: []
    };
  }

  // ============================================
  // CLASS OPERATIONS
  // ============================================

  static async getClass(id: string): Promise<Class | null> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching class:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      teacherId: data.teacher_id,
      studentIds: [],
      joinCode: data.id.substring(0, 8).toUpperCase()
    };
  }

  static async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching teacher classes:', error);
      return [];
    }
    
    return data.map(c => ({
      id: c.id,
      name: c.name,
      teacherId: c.teacher_id,
      studentIds: [],
      joinCode: c.id.substring(0, 8).toUpperCase()
    }));
  }

  static async getClassesByStudent(studentId: string): Promise<Class[]> {
    const { data, error } = await supabase
      .from('class_enrollments')
      .select('classes(*)')
      .eq('user_id', studentId)
      .eq('status', 'active');
    
    if (error) {
      console.error('Error fetching student classes:', error);
      return [];
    }
    
    return (data?.map((d: any) => ({
      id: d.classes.id,
      name: d.classes.name,
      teacherId: d.classes.teacher_id,
      studentIds: [],
      joinCode: d.classes.id.substring(0, 8).toUpperCase()
    })) || []);
  }

  static async createClass(classData: { name: string; teacherId: string }): Promise<Class | null> {
    const { data, error } = await supabase
      .from('classes')
      .insert([{
        name: classData.name,
        teacher_id: classData.teacherId,
        is_active: true
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating class:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      teacherId: data.teacher_id,
      studentIds: [],
      joinCode: data.id.substring(0, 8).toUpperCase()
    };
  }

  static async enrollStudent(classId: string, studentId: string): Promise<boolean> {
    const { error } = await supabase
      .from('class_enrollments')
      .insert([{
        class_id: classId,
        user_id: studentId,
        status: 'active'
      }]);
    
    if (error) {
      console.error('Error enrolling student:', error);
      return false;
    }
    return true;
  }

  static async getClassStudents(classId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('class_enrollments')
      .select('users(*)')
      .eq('class_id', classId)
      .eq('status', 'active');
    
    if (error) {
      console.error('Error fetching class students:', error);
      return [];
    }
    
    return (data?.map((d: any) => ({
      id: d.users.id,
      name: d.users.name,
      email: d.users.email,
      role: d.users.role as Role,
      classIds: [],
      achievements: []
    })) || []);
  }

  // ============================================
  // ASSIGNMENT OPERATIONS
  // ============================================

  static async getAssignment(id: string): Promise<Assignment | null> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching assignment:', error);
      return null;
    }
    
    return {
      id: data.id,
      classId: data.class_id,
      title: data.title,
      instructions: data.description || '',
      deadline: data.due_date || new Date().toISOString()
    };
  }

  static async getAssignmentsByClass(classId: string): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .order('due_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching class assignments:', error);
      return [];
    }
    
    return data.map(a => ({
      id: a.id,
      classId: a.class_id,
      title: a.title,
      instructions: a.description || '',
      deadline: a.due_date || new Date().toISOString()
    }));
  }

  static async createAssignment(assignment: { classId: string; title: string; instructions: string; deadline: string }): Promise<Assignment | null> {
    const { data, error } = await supabase
      .from('assignments')
      .insert([{
        class_id: assignment.classId,
        title: assignment.title,
        description: assignment.instructions,
        due_date: assignment.deadline,
        is_published: true
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating assignment:', error);
      return null;
    }
    
    return {
      id: data.id,
      classId: data.class_id,
      title: data.title,
      instructions: data.description || '',
      deadline: data.due_date
    };
  }

  // ============================================
  // SUBMISSION OPERATIONS
  // ============================================

  static async getSubmission(id: string): Promise<Submission | null> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching submission:', error);
      return null;
    }
    
    return {
      id: data.id,
      assignmentId: data.assignment_id,
      studentId: data.student_id,
      fileName: data.file_name || 'submission.txt',
      fileContent: data.content || '',
      submittedAt: data.submitted_at
    };
  }

  static async getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching assignment submissions:', error);
      return [];
    }
    
    return data.map(s => ({
      id: s.id,
      assignmentId: s.assignment_id,
      studentId: s.student_id,
      fileName: s.file_name || 'submission.txt',
      fileContent: s.content || '',
      submittedAt: s.submitted_at
    }));
  }

  static async getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching student submissions:', error);
      return [];
    }
    
    return data.map(s => ({
      id: s.id,
      assignmentId: s.assignment_id,
      studentId: s.student_id,
      fileName: s.file_name || 'submission.txt',
      fileContent: s.content || '',
      submittedAt: s.submitted_at
    }));
  }

  static async createSubmission(submission: { assignmentId: string; studentId: string; fileName: string; fileContent: string }): Promise<Submission | null> {
    const { data, error } = await supabase
      .from('submissions')
      .insert([{
        assignment_id: submission.assignmentId,
        student_id: submission.studentId,
        file_name: submission.fileName,
        content: submission.fileContent,
        status: 'submitted',
        is_late: false
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating submission:', error);
      return null;
    }
    
    return {
      id: data.id,
      assignmentId: data.assignment_id,
      studentId: data.student_id,
      fileName: data.file_name,
      fileContent: data.content || '',
      submittedAt: data.submitted_at
    };
  }

  static async updateSubmission(id: string, updates: Partial<Submission>): Promise<Submission | null> {
    const dbUpdates: any = {};
    if (updates.fileName !== undefined) dbUpdates.file_name = updates.fileName;
    if (updates.fileContent !== undefined) dbUpdates.content = updates.fileContent;
    if (updates.teacherFeedback !== undefined) dbUpdates.teacher_feedback = updates.teacherFeedback;

    if (Object.keys(dbUpdates).length === 0) {
      return this.getSubmission(id);
    }

    const { data, error } = await supabase
      .from('submissions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating submission:', error);
      return null;
    }
    
    return {
      id: data.id,
      assignmentId: data.assignment_id,
      studentId: data.student_id,
      fileName: data.file_name,
      fileContent: data.content || '',
      submittedAt: data.submitted_at
    };
  }

  // ============================================
  // ANALYSIS REPORT OPERATIONS
  // ============================================

  static async getAnalysisReport(submissionId: string): Promise<AnalysisReport | null> {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*')
      .eq('submission_id', submissionId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching analysis report:', error);
      return null;
    }
    
    return {
      id: data.id,
      submissionId: data.submission_id,
      analysisType: data.analysis_type,
      plagiarismScore: data.plagiarism_score,
      plagiarismSources: data.plagiarism_sources,
      aiProbability: data.ai_probability,
      aiDetails: data.ai_analysis_details,
      integrityStatus: data.integrity_status,
      flaggedSections: data.flagged_sections,
      analyzedAt: data.analyzed_at,
      modelVersion: data.gemini_model_version,
      rawResponse: data.raw_response
    };
  }

  static async createAnalysisReport(report: Omit<AnalysisReport, 'id'>): Promise<AnalysisReport | null> {
    const { data, error } = await supabase
      .from('analysis_reports')
      .insert([{
        submission_id: report.submissionId,
        analysis_type: report.analysisType,
        plagiarism_score: report.plagiarismScore,
        plagiarism_sources: report.plagiarismSources,
        ai_probability: report.aiProbability,
        ai_analysis_details: report.aiDetails,
        integrity_status: report.integrityStatus,
        flagged_sections: report.flaggedSections,
        gemini_model_version: report.modelVersion,
        raw_response: report.rawResponse
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating analysis report:', error);
      return null;
    }
    
    return {
      id: data.id,
      submissionId: data.submission_id,
      analysisType: data.analysis_type,
      plagiarismScore: data.plagiarism_score,
      plagiarismSources: data.plagiarism_sources,
      aiProbability: data.ai_probability,
      aiDetails: data.ai_analysis_details,
      integrityStatus: data.integrity_status,
      flaggedSections: data.flagged_sections,
      analyzedAt: data.analyzed_at,
      modelVersion: data.gemini_model_version,
      rawResponse: data.raw_response
    };
  }

  // ============================================
  // NOTIFICATION OPERATIONS
  // ============================================

  static async createNotification(notification: {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    link?: string;
  }): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        link: notification.link || null,
        is_read: false
      }]);
    
    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }
    return true;
  }

  static async getUserNotifications(userId: string, limit: number = 50): Promise<any[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data || [];
  }

  static async markNotificationRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    return true;
  }
}

export default DatabaseService;
