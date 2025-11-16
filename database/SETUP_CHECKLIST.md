# EduVerify Supabase Setup Checklist

## ✅ Completed
- [x] Created comprehensive database schema (`supabase-schema.sql`)
- [x] Created database documentation (`README.md`)
- [x] Created entity relationship diagram (`DATABASE_DIAGRAM.md`)
- [x] Defined local file storage structure (`LOCAL_FILE_STORAGE.md`)
- [x] Created local upload directories
- [x] Updated .gitignore for file uploads

## 📋 Your Next Steps (User Action Required)

### 1. Create Supabase Project
Go to [https://supabase.com](https://supabase.com) and create a new project.

**What to do:**
- Sign up or log in
- Click "New Project"
- Choose a name (e.g., "eduverify")
- Choose a database password (save it!)
- Select a region close to you
- Wait for project to be created (~2 minutes)

### 2. Run the Database Schema
**What to do:**
- In Supabase Dashboard, go to **SQL Editor**
- Click "New Query"
- Copy the entire contents of `database/supabase-schema.sql`
- Paste into the query editor
- Click "Run"
- Verify all tables appear in **Table Editor**

### 3. Create Storage Buckets
**What to do:**
- Go to **Storage** in Supabase Dashboard
- Create bucket: `submissions`
  - Click "New bucket"
  - Name: `submissions`
  - Make it **Private**
  - Click "Create bucket"
- Create bucket: `avatars`
  - Click "New bucket"
  - Name: `avatars`
  - Make it **Public**
  - Click "Create bucket"

### 4. Get API Credentials
**What to do:**
- In Supabase Dashboard, go to **Settings** → **API**
- Note down these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANT**: The Service Role Key is sensitive! Never share it publicly.

### 5. Provide Credentials to Agent
Once you have the above credentials, provide them in the format:

```
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

## 🚀 What Happens Next (Automated by Agent)

Once you provide the credentials, the agent will:
1. ✓ Install `@supabase/supabase-js` package
2. ✓ Create Supabase client configuration
3. ✓ Build database service layer (CRUD operations)
4. ✓ Create file upload service
5. ✓ Update DataContext to use real database
6. ✓ Implement real-time subscriptions
7. ✓ Add authentication integration
8. ✓ Test all database operations
9. ✓ Migrate from mock data to Supabase

## 📊 Database Schema Summary

### Core Tables Created:
- **users** (8 fields) - User accounts with roles
- **classes** (11 fields) - Course information
- **class_enrollments** (5 fields) - Student-class relationships
- **assignments** (11 fields) - Assignment details
- **submissions** (13 fields) - Student submissions
- **analysis_reports** (13 fields) - AI analysis results
- **achievements** (8 fields) - Gamification achievements
- **user_achievements** (4 fields) - User achievement tracking
- **notifications** (8 fields) - User notifications
- **class_analytics** (10 fields) - Analytics data
- **feedback_comments** (8 fields) - Teacher feedback
- **audit_logs** (9 fields) - System audit trail

### Total: 12 tables + 2 views + 4 triggers + RLS policies

## 🔒 Security Features Included
- Row Level Security (RLS) on all tables
- Authentication-based access controls
- Encrypted API keys via Replit Secrets
- File upload validation
- Audit logging for all actions

## 📁 File Storage Structure
```
Supabase Storage:
├── submissions/         (Private bucket)
│   └── {assignment_id}/{student_id}/{file}
└── avatars/            (Public bucket)
    └── {user_id}/profile.{ext}

Local Storage (temporary):
└── uploads/
    ├── temp/           (1 hour retention)
    ├── cache/          (24 hour retention)
    └── exports/        (7 day retention)
```

## 💡 Tips
1. **Database Password**: Save it somewhere safe, you'll need it for database connections
2. **Service Role Key**: Only use server-side, never expose to client
3. **Anon Key**: Safe to use client-side
4. **Backups**: Supabase handles automatic backups
5. **Testing**: Use the Supabase Table Editor to verify data

## 🆘 Troubleshooting

### "Permission denied" errors
- Check Row Level Security policies
- Ensure you're authenticated
- Verify the user has the correct role

### "Relation does not exist" errors
- Ensure schema SQL ran successfully
- Check for typos in table names
- Verify migrations completed

### File upload fails
- Check bucket exists
- Verify bucket is public/private as needed
- Check file size limits

## 📚 Documentation
- Full Schema: `database/supabase-schema.sql`
- Setup Guide: `database/README.md`
- ERD Diagram: `database/DATABASE_DIAGRAM.md`
- File Storage: `database/LOCAL_FILE_STORAGE.md`

---

**Ready to proceed?** Provide your Supabase credentials and the agent will handle the rest! 🚀
