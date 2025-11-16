# EduVerify Database Schema Diagram

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EDUVERIFY DATABASE SCHEMA                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│      USERS       │
├──────────────────┤
│ PK id (UUID)     │
│    email         │──┐
│    name          │  │
│    role          │  │
│    avatar_url    │  │
│    created_at    │  │
└──────────────────┘  │
         │            │
         │            │
         │            │
    ┌────┴────┐       │
    │         │       │
    ▼         ▼       │
┌────────┐ ┌─────────────────┐
│TEACHER │ │    STUDENTS     │
└────────┘ └─────────────────┘
    │              │
    │              │
    │              │
    │              ▼
    │      ┌──────────────────────┐
    │      │ CLASS_ENROLLMENTS    │
    │      ├──────────────────────┤
    │      │ PK id                │
    │      │ FK class_id          │──┐
    │      │ FK user_id           │  │
    │      │    enrollment_date   │  │
    │      │    status            │  │
    │      └──────────────────────┘  │
    │                                │
    │                                │
    ▼                                │
┌──────────────────┐                 │
│     CLASSES      │◄────────────────┘
├──────────────────┤
│ PK id (UUID)     │
│ FK teacher_id    │
│    name          │
│    description   │
│    course_code   │
│    semester      │
└──────────────────┘
         │
         │
         │ 1:N
         ▼
┌──────────────────┐
│   ASSIGNMENTS    │
├──────────────────┤
│ PK id (UUID)     │
│ FK class_id      │
│    title         │
│    description   │
│    due_date      │
│    max_points    │
└──────────────────┘
         │
         │
         │ 1:N
         ▼
┌──────────────────────┐
│    SUBMISSIONS       │
├──────────────────────┤
│ PK id (UUID)         │
│ FK assignment_id     │
│ FK student_id        │
│    content           │
│    file_path         │
│    submitted_at      │
│    status            │
│    grade             │
└──────────────────────┘
         │
         │
         │ 1:1
         ▼
┌─────────────────────────┐
│   ANALYSIS_REPORTS      │
├─────────────────────────┤
│ PK id (UUID)            │
│ FK submission_id        │
│    plagiarism_score     │
│    plagiarism_sources   │
│    ai_probability       │
│    ai_analysis_details  │
│    integrity_status     │
│    analyzed_at          │
└─────────────────────────┘


┌──────────────────┐          ┌─────────────────────┐
│  ACHIEVEMENTS    │          │ USER_ACHIEVEMENTS   │
├──────────────────┤   N:M    ├─────────────────────┤
│ PK id (UUID)     │◄─────────│ PK id               │
│    name          │          │ FK user_id          │
│    description   │          │ FK achievement_id   │
│    icon          │          │    earned_at        │
│    criteria      │          └─────────────────────┘
│    points        │
│    tier          │
└──────────────────┘


┌──────────────────┐          ┌──────────────────────┐
│      USERS       │          │    NOTIFICATIONS     │
│                  │   1:N    ├──────────────────────┤
│                  │◄─────────│ PK id (UUID)         │
│                  │          │ FK user_id           │
└──────────────────┘          │    title             │
                              │    message           │
                              │    type              │
                              │    is_read           │
                              └──────────────────────┘


┌──────────────────────┐
│   FEEDBACK_COMMENTS  │
├──────────────────────┤
│ PK id (UUID)         │
│ FK submission_id     │──┐
│ FK teacher_id        │  │
│    comment           │  │
│    line_number       │  │
│    is_private        │  │
└──────────────────────┘  │
         ▲                │
         │                │
         └────────────────┘


┌──────────────────────┐
│   CLASS_ANALYTICS    │
├──────────────────────┤
│ PK id (UUID)         │
│ FK class_id          │
│ FK assignment_id     │
│    total_submissions │
│    avg_plagiarism    │
│    avg_ai_prob       │
│    flagged_count     │
│    period            │
└──────────────────────┘


┌──────────────────┐
│   AUDIT_LOGS     │
├──────────────────┤
│ PK id (UUID)     │
│ FK user_id       │
│    action        │
│    resource_type │
│    resource_id   │
│    details       │
│    ip_address    │
│    created_at    │
└──────────────────┘
```

## Key Relationships

### One-to-Many (1:N)
- **Users → Classes**: One teacher creates many classes
- **Classes → Assignments**: One class has many assignments
- **Assignments → Submissions**: One assignment has many submissions
- **Users → Submissions**: One student makes many submissions
- **Users → Notifications**: One user has many notifications
- **Submissions → Feedback**: One submission has many feedback comments

### One-to-One (1:1)
- **Submissions → Analysis Reports**: One submission has one analysis report

### Many-to-Many (N:M)
- **Users ↔ Classes**: Through `class_enrollments` table
- **Users ↔ Achievements**: Through `user_achievements` table

## Data Flow

### Submission and Analysis Flow
```
1. Student creates submission
   ↓
2. Submission saved to database
   ↓
3. File uploaded to Supabase Storage
   ↓
4. Gemini AI analyzes content
   ↓
5. Analysis report created
   ↓
6. Notification sent to teacher
   ↓
7. Teacher reviews and provides feedback
   ↓
8. Grade assigned
   ↓
9. Notification sent to student
```

### Achievement Flow
```
1. User performs action (submission, grade, etc.)
   ↓
2. System checks achievement criteria
   ↓
3. If criteria met, create user_achievement
   ↓
4. Send notification
   ↓
5. Update user statistics
```

## Storage Buckets Structure

### Submissions Bucket
```
submissions/
├── {assignment-uuid-1}/
│   ├── {student-uuid-1}/
│   │   ├── 2025-01-15_paper.pdf
│   │   └── 2025-01-16_revised.pdf
│   ├── {student-uuid-2}/
│   │   └── 2025-01-14_essay.docx
│   └── {student-uuid-3}/
│       └── 2025-01-15_submission.txt
├── {assignment-uuid-2}/
│   └── ...
```

### Avatars Bucket
```
avatars/
├── {user-uuid-1}/
│   └── profile.jpg
├── {user-uuid-2}/
│   └── profile.png
└── {user-uuid-3}/
    └── profile.webp
```

## Indexes for Performance

### Primary Indexes (Automatic)
- All `id` columns (Primary Keys)
- All `UNIQUE` constraints

### Custom Indexes Created
```sql
-- Users
idx_users_email
idx_users_role

-- Classes
idx_classes_teacher
idx_classes_active

-- Enrollments
idx_enrollments_class
idx_enrollments_user

-- Assignments
idx_assignments_class
idx_assignments_due_date

-- Submissions
idx_submissions_assignment
idx_submissions_student
idx_submissions_status

-- Analysis
idx_analysis_submission
idx_analysis_status

-- Notifications
idx_notifications_user
idx_notifications_read
idx_notifications_created

-- Analytics
idx_analytics_class
idx_analytics_assignment
```

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- **Students** can only see their own data and enrolled classes
- **Teachers** can see all data for their classes
- **Admins** have full access
- **Public** has no access (must be authenticated)
