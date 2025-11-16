-- ============================================
-- EDUVERIFY SUPABASE DATABASE SCHEMA
-- ============================================
-- This schema defines all tables, relationships, and policies
-- for the EduVerify Academic Integrity Platform
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores all user information (students, teachers, admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- CLASSES TABLE
-- ============================================
-- Stores class/course information
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    course_code VARCHAR(50),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    semester VARCHAR(50),
    academic_year VARCHAR(20),
    color VARCHAR(7) DEFAULT '#3B82F6', -- For UI theming
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_active ON classes(is_active);

-- ============================================
-- CLASS ENROLLMENTS TABLE
-- ============================================
-- Junction table for users and classes (many-to-many)
CREATE TABLE class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed')),
    UNIQUE(class_id, user_id)
);

CREATE INDEX idx_enrollments_class ON class_enrollments(class_id);
CREATE INDEX idx_enrollments_user ON class_enrollments(user_id);

-- ============================================
-- ASSIGNMENTS TABLE
-- ============================================
-- Stores assignment details
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    max_points INTEGER DEFAULT 100,
    allow_late_submissions BOOLEAN DEFAULT FALSE,
    file_types_allowed TEXT[], -- Array of allowed file extensions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

-- ============================================
-- SUBMISSIONS TABLE
-- ============================================
-- Stores student submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT, -- For text submissions
    file_path TEXT, -- Path to uploaded file in storage
    file_name VARCHAR(255),
    file_size INTEGER, -- in bytes
    file_type VARCHAR(50),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_late BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
    grade DECIMAL(5,2),
    feedback TEXT,
    UNIQUE(assignment_id, student_id) -- One submission per student per assignment
);

CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- ============================================
-- ANALYSIS REPORTS TABLE
-- ============================================
-- Stores plagiarism and AI detection analysis results
CREATE TABLE analysis_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('plagiarism', 'ai_detection', 'both')),
    
    -- Plagiarism Analysis Results
    plagiarism_score DECIMAL(5,2), -- Percentage 0-100
    plagiarism_sources JSONB, -- Array of matched sources with details
    
    -- AI Detection Results
    ai_probability DECIMAL(5,2), -- Percentage 0-100
    ai_analysis_details JSONB, -- Detailed AI detection metrics
    
    -- Overall Results
    integrity_status VARCHAR(50) CHECK (integrity_status IN ('excellent', 'good', 'warning', 'flagged')),
    flagged_sections JSONB, -- Array of flagged text sections
    
    -- Metadata
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis_duration INTEGER, -- in milliseconds
    gemini_model_version VARCHAR(50),
    raw_response JSONB, -- Full Gemini API response for debugging
    
    UNIQUE(submission_id) -- One analysis per submission
);

CREATE INDEX idx_analysis_submission ON analysis_reports(submission_id);
CREATE INDEX idx_analysis_status ON analysis_reports(integrity_status);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
-- Stores achievement definitions
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(50), -- Icon identifier
    criteria JSONB NOT NULL, -- Criteria for earning the achievement
    points INTEGER DEFAULT 10,
    tier VARCHAR(50) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER ACHIEVEMENTS TABLE
-- ============================================
-- Stores which users have earned which achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
-- Stores user notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('info', 'success', 'warning', 'error')),
    link TEXT, -- Optional link to related resource
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- CLASS ANALYTICS TABLE
-- ============================================
-- Stores aggregated analytics data for classes
CREATE TABLE class_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    
    -- Metrics
    total_submissions INTEGER DEFAULT 0,
    average_plagiarism_score DECIMAL(5,2),
    average_ai_probability DECIMAL(5,2),
    flagged_count INTEGER DEFAULT 0,
    on_time_submissions INTEGER DEFAULT 0,
    late_submissions INTEGER DEFAULT 0,
    
    -- Date
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    period VARCHAR(50) -- 'daily', 'weekly', 'monthly', 'assignment'
);

CREATE INDEX idx_analytics_class ON class_analytics(class_id);
CREATE INDEX idx_analytics_assignment ON class_analytics(assignment_id);
CREATE INDEX idx_analytics_period ON class_analytics(period, recorded_at DESC);

-- ============================================
-- FEEDBACK COMMENTS TABLE
-- ============================================
-- Stores teacher feedback on submissions
CREATE TABLE feedback_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    line_number INTEGER, -- For inline comments
    is_private BOOLEAN DEFAULT FALSE, -- Private notes vs student-visible
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_feedback_submission ON feedback_comments(submission_id);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
-- Tracks important system events for security and debugging
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- 'submission', 'assignment', 'class', etc.
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Teachers can view their classes
CREATE POLICY "Teachers can view their classes" ON classes
    FOR SELECT USING (auth.uid() = teacher_id);

-- Students can view classes they're enrolled in
CREATE POLICY "Students can view enrolled classes" ON classes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM class_enrollments 
            WHERE class_id = id AND user_id = auth.uid()
        )
    );

-- Teachers can create classes
CREATE POLICY "Teachers can create classes" ON classes
    FOR INSERT WITH CHECK (auth.uid() = teacher_id);

-- More RLS policies would be added based on specific security requirements...

-- ============================================
-- INITIAL DATA SEEDING
-- ============================================

-- Insert default achievements
INSERT INTO achievements (name, description, icon, criteria, points, tier) VALUES
    ('First Submission', 'Submit your first assignment', 'trophy', '{"submissions": 1}', 10, 'bronze'),
    ('Perfect Score', 'Get 100% on an assignment', 'star', '{"perfect_grades": 1}', 25, 'silver'),
    ('Integrity Champion', 'Submit 10 assignments with excellent integrity scores', 'shield', '{"excellent_integrity": 10}', 50, 'gold'),
    ('Early Bird', 'Submit 5 assignments before the due date', 'clock', '{"early_submissions": 5}', 20, 'bronze'),
    ('Consistency King', 'Submit assignments on time for an entire semester', 'crown', '{"on_time_streak": 15}', 100, 'platinum');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for class overview with student count
CREATE VIEW class_overview AS
SELECT 
    c.*,
    u.name as teacher_name,
    COUNT(DISTINCT ce.user_id) as student_count,
    COUNT(DISTINCT a.id) as assignment_count
FROM classes c
JOIN users u ON c.teacher_id = u.id
LEFT JOIN class_enrollments ce ON c.id = ce.class_id AND ce.status = 'active'
LEFT JOIN assignments a ON c.id = a.class_id
GROUP BY c.id, u.name;

-- View for submission statistics
CREATE VIEW submission_stats AS
SELECT 
    s.*,
    u.name as student_name,
    u.email as student_email,
    ar.plagiarism_score,
    ar.ai_probability,
    ar.integrity_status
FROM submissions s
JOIN users u ON s.student_id = u.id
LEFT JOIN analysis_reports ar ON s.id = ar.submission_id;

-- ============================================
-- NOTES
-- ============================================
-- 1. File Storage: Use Supabase Storage buckets for file uploads
--    - Bucket: 'submissions' for student submissions
--    - Bucket: 'avatars' for user profile pictures
--    
-- 2. Authentication: Use Supabase Auth for user authentication
--    - Link auth.users to our users table via triggers
--    
-- 3. Real-time: Enable real-time subscriptions for:
--    - notifications table
--    - submissions table (for teachers)
--    - analysis_reports table
--
-- 4. Indexes: Additional indexes may be needed based on query patterns
--
-- 5. Backup: Configure automated backups in Supabase dashboard
