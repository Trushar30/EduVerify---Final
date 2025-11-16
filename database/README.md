# EduVerify Database Schema Documentation

## Overview
This document explains the complete database structure for EduVerify using Supabase (PostgreSQL).

## 📊 Database Tables

### Core Tables

#### 1. **users**
Stores all user information for students, teachers, and administrators.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email address |
| name | VARCHAR(255) | Full name |
| role | VARCHAR(50) | User role: 'student', 'teacher', 'admin' |
| avatar_url | TEXT | Profile picture URL |
| bio | TEXT | User biography |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last profile update |
| last_login | TIMESTAMP | Last login timestamp |
| is_active | BOOLEAN | Account status |

#### 2. **classes**
Stores course/class information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Class name |
| description | TEXT | Class description |
| course_code | VARCHAR(50) | Course code (e.g., CS101) |
| teacher_id | UUID | Foreign key to users table |
| semester | VARCHAR(50) | Semester (Fall, Spring, etc.) |
| academic_year | VARCHAR(20) | Academic year (2024-2025) |
| color | VARCHAR(7) | UI theme color (hex code) |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

#### 3. **class_enrollments**
Junction table for many-to-many relationship between users and classes.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| class_id | UUID | Foreign key to classes |
| user_id | UUID | Foreign key to users |
| enrollment_date | TIMESTAMP | When student enrolled |
| status | VARCHAR(50) | 'active', 'dropped', 'completed' |

#### 4. **assignments**
Stores assignment details.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| class_id | UUID | Foreign key to classes |
| title | VARCHAR(255) | Assignment title |
| description | TEXT | Assignment description |
| instructions | TEXT | Detailed instructions |
| due_date | TIMESTAMP | Submission deadline |
| max_points | INTEGER | Maximum points (default 100) |
| allow_late_submissions | BOOLEAN | Allow late submissions |
| file_types_allowed | TEXT[] | Array of allowed file types |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |
| is_published | BOOLEAN | Published status |

#### 5. **submissions**
Stores student submissions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| assignment_id | UUID | Foreign key to assignments |
| student_id | UUID | Foreign key to users |
| content | TEXT | Text submission content |
| file_path | TEXT | Path to uploaded file |
| file_name | VARCHAR(255) | Original filename |
| file_size | INTEGER | File size in bytes |
| file_type | VARCHAR(50) | MIME type |
| submitted_at | TIMESTAMP | Submission timestamp |
| is_late | BOOLEAN | Late submission flag |
| status | VARCHAR(50) | 'draft', 'submitted', 'graded', 'returned' |
| grade | DECIMAL(5,2) | Grade (0-100) |
| feedback | TEXT | Teacher feedback |

#### 6. **analysis_reports**
Stores plagiarism and AI detection results from Gemini AI.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| submission_id | UUID | Foreign key to submissions |
| analysis_type | VARCHAR(50) | 'plagiarism', 'ai_detection', 'both' |
| plagiarism_score | DECIMAL(5,2) | Plagiarism percentage (0-100) |
| plagiarism_sources | JSONB | Matched sources with details |
| ai_probability | DECIMAL(5,2) | AI-generated probability (0-100) |
| ai_analysis_details | JSONB | Detailed AI metrics |
| integrity_status | VARCHAR(50) | 'excellent', 'good', 'warning', 'flagged' |
| flagged_sections | JSONB | Array of problematic sections |
| analyzed_at | TIMESTAMP | Analysis timestamp |
| analysis_duration | INTEGER | Duration in milliseconds |
| gemini_model_version | VARCHAR(50) | Model version used |
| raw_response | JSONB | Full API response |

#### 7. **achievements**
Stores achievement definitions for gamification.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Achievement name |
| description | TEXT | Achievement description |
| icon | VARCHAR(50) | Icon identifier |
| criteria | JSONB | Criteria for earning |
| points | INTEGER | Points awarded |
| tier | VARCHAR(50) | 'bronze', 'silver', 'gold', 'platinum' |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation date |

#### 8. **user_achievements**
Tracks which users earned which achievements.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| achievement_id | UUID | Foreign key to achievements |
| earned_at | TIMESTAMP | When earned |

#### 9. **notifications**
Stores user notifications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| title | VARCHAR(255) | Notification title |
| message | TEXT | Notification message |
| type | VARCHAR(50) | 'info', 'success', 'warning', 'error' |
| link | TEXT | Optional link |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Creation date |

### Additional Tables

- **class_analytics** - Aggregated analytics data
- **feedback_comments** - Teacher feedback on submissions
- **audit_logs** - System event tracking

## 🗂️ File Storage Structure

### Supabase Storage Buckets

Create the following storage buckets in Supabase:

#### 1. **submissions** bucket
```
submissions/
  └── {assignment_id}/
      └── {student_id}/
          └── {timestamp}_{filename}
```

**Security Policy:**
- Students can upload to their own folders
- Teachers can read all files in their class assignments
- Admins have full access

#### 2. **avatars** bucket
```
avatars/
  └── {user_id}/
      └── profile.{ext}
```

**Security Policy:**
- Users can upload/update their own avatar
- All authenticated users can read avatars

## 🚀 Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (for client-side)
   - **Service Role Key** (for server-side, keep secret!)

### Step 2: Run Database Schema
1. In Supabase Dashboard, go to **SQL Editor**
2. Copy contents of `supabase-schema.sql`
3. Execute the SQL script
4. Verify all tables are created in **Table Editor**

### Step 3: Create Storage Buckets
1. Go to **Storage** in Supabase Dashboard
2. Create bucket: `submissions`
   - Make it **private**
   - Set max file size (e.g., 10MB)
3. Create bucket: `avatars`
   - Make it **public** (for easy avatar display)
   - Set max file size (e.g., 2MB)

### Step 4: Configure Storage Policies
For **submissions** bucket:
```sql
-- Students can upload to their folders
CREATE POLICY "Students can upload submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'submissions' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Teachers can read their class submissions
CREATE POLICY "Teachers can read class submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'submissions' AND
  EXISTS (
    SELECT 1 FROM assignments a
    JOIN classes c ON a.class_id = c.id
    WHERE c.teacher_id = auth.uid()
    AND (storage.foldername(name))[1] = a.id::text
  )
);
```

For **avatars** bucket:
```sql
-- Users can upload their avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Anyone can view avatars
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Step 5: Enable Realtime (Optional)
For real-time updates, enable realtime on these tables:
1. Go to **Database** → **Replication**
2. Enable for:
   - `notifications`
   - `submissions` (for teachers)
   - `analysis_reports`

## 🔐 API Keys You'll Need to Provide

After completing the setup above, you'll need to provide:

1. **SUPABASE_URL** - Your project URL
2. **SUPABASE_ANON_KEY** - Public/Anon key (safe for client-side)
3. **SUPABASE_SERVICE_ROLE_KEY** - Service role key (server-side only, KEEP SECRET!)

These will be added to Replit Secrets for secure storage.

## 📝 Example Data Structure

### JSONB Field Examples

**plagiarism_sources** in analysis_reports:
```json
[
  {
    "source": "https://example.com/article",
    "similarity": 85.5,
    "matched_text": "This is the matched section...",
    "type": "web"
  },
  {
    "source": "Student John Doe - Assignment 1",
    "similarity": 45.2,
    "matched_text": "Another matched section...",
    "type": "internal"
  }
]
```

**ai_analysis_details** in analysis_reports:
```json
{
  "confidence": 92.5,
  "patterns_detected": ["repetitive_structure", "uniform_complexity"],
  "suspicious_sections": [
    {
      "text": "Section that looks AI-generated...",
      "score": 95.0,
      "reason": "Consistent formal tone"
    }
  ]
}
```

**criteria** in achievements:
```json
{
  "submissions": 10,
  "min_integrity_score": 90,
  "timeframe_days": 30
}
```

## 🔍 Useful Queries

### Get class with students
```sql
SELECT 
  c.*,
  json_agg(json_build_object(
    'id', u.id,
    'name', u.name,
    'email', u.email
  )) as students
FROM classes c
LEFT JOIN class_enrollments ce ON c.id = ce.class_id
LEFT JOIN users u ON ce.user_id = u.id
WHERE c.id = 'class-uuid'
GROUP BY c.id;
```

### Get submissions with analysis
```sql
SELECT 
  s.*,
  u.name as student_name,
  ar.plagiarism_score,
  ar.ai_probability,
  ar.integrity_status
FROM submissions s
JOIN users u ON s.student_id = u.id
LEFT JOIN analysis_reports ar ON s.id = ar.submission_id
WHERE s.assignment_id = 'assignment-uuid';
```

## 📚 Next Steps

Once you provide the Supabase credentials, I will:
1. Install `@supabase/supabase-js` package
2. Create Supabase client configuration
3. Create database service layer
4. Update DataContext to use Supabase
5. Implement file upload functionality
6. Add real-time subscriptions for notifications
