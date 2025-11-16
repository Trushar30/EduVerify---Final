# EduVerify - Academic Integrity Platform

## Overview
EduVerify is an AI-powered academic integrity platform that helps educational institutions detect plagiarism and AI-generated content using Google's Gemini AI. The platform provides comprehensive tools for teachers and students to manage assignments, submissions, and integrity analysis.

## Recent Changes

### Date: November 15, 2025
**Supabase Database Integration**

#### Database Setup
- Integrated Supabase PostgreSQL database for data persistence
- Created comprehensive schema with 12 tables:
  - `users`: User accounts with role-based access
  - `classes`: Course/class management
  - `class_enrollments`: Student-class relationships
  - `assignments`: Assignment details and deadlines
  - `submissions`: Student submissions with file references
  - `analysis_reports`: AI-powered plagiarism/AI detection results
  - `achievements`: Gamification rewards
  - `user_achievements`: User achievement tracking
  - `notifications`: Real-time user notifications
  - `feedback`: Teacher-student communication
  - `system_logs`: Audit trail
  - `settings`: Platform configuration
- Implemented Row-Level Security (RLS) policies for data protection
- Created database indexes for optimized query performance
- Set up Supabase Storage buckets for file management:
  - `submissions`: Student assignment files (PDF, DOCX, TXT)
  - `avatars`: User profile images

#### Service Layer
- **DatabaseService** (`services/databaseService.ts`): Core CRUD operations for users, classes, assignments, submissions, and analysis reports
- **FileStorageService** (`services/fileStorageService.ts`): File upload/download with validation for submissions and avatars
- **Supabase Client** (`services/supabaseClient.ts`): Configured client with auto-refresh and persistence

#### Security Features
- Environment-based credential management via Replit Secrets
- Row-Level Security policies enforcing user access control
- File type and size validation for uploads
- Sanitized file names to prevent security issues

**Major UI/UX Redesign**

#### Landing Page Enhancements
- Added modern navigation header with logo and CTA buttons
- Enhanced hero section with animated background elements and text animations
- Added statistics section showcasing platform metrics (99.8% accuracy, 50K+ users, etc.)
- Created comprehensive features showcase with three detailed feature cards
- Added "How It Works" section with 3-step process visualization
- Implemented testimonials section with user reviews
- Added call-to-action section with free trial offer
- Created footer with company links, product info, and legal links

#### Login Page Improvements
- Redesigned with split-screen layout (branding left, form right)
- Added gradient background with pattern overlay
- Implemented icon-enhanced input fields
- Improved quick login demo buttons with color-coded roles
- Enhanced mobile responsiveness with adaptive layout
- Added "Back to Home" navigation link

#### Signup Page Enhancements
- Created split-screen design matching login page aesthetic
- Added visual role selection with icon-based radio buttons
- Implemented icon-enhanced form inputs
- Added feature highlights on branding side
- Improved form validation and error display
- Enhanced mobile layout

#### About Page Transformation
- Added comprehensive navigation and footer
- Created hero section with mission statement
- Designed mission section with visual elements and statistics
- Built detailed "Why Choose EduVerify?" features grid
- Added additional features showcase (4 mini-cards)
- Implemented core values section with gradient background
- Enhanced call-to-action section

### Technical Setup
- **Framework**: React 19 + TypeScript + Vite
- **Database**: Supabase (PostgreSQL + Storage)
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Heroicons React
- **Charts**: Recharts
- **AI Integration**: Google Gemini AI
- **Authentication**: Supabase Auth (planned)
- **Port**: 5000 (configured for Replit deployment)
- **Deployment**: Autoscale with static build

## Project Structure
```
├── components/
│   ├── analytics/       # Analytics dashboard components
│   ├── layout/          # Layout components
│   └── ui/              # Reusable UI components
├── context/             # React context providers
├── data/                # Mock data
├── pages/               # Page components
│   ├── admin/           # Admin dashboard pages
│   ├── student/         # Student dashboard pages
│   ├── teacher/         # Teacher dashboard pages
│   ├── LandingPage.tsx  # Enhanced landing page
│   ├── LoginPage.tsx    # Enhanced login page
│   ├── SignupPage.tsx   # Enhanced signup page
│   └── AboutPage.tsx    # Enhanced about page
├── services/
│   ├── supabaseClient.ts       # Supabase configuration
│   ├── databaseService.ts      # Database CRUD operations
│   ├── fileStorageService.ts   # File upload/download
│   └── geminiService.ts        # AI analysis service
└── utils/               # Utility functions
```

## Environment Variables
All environment variables should be stored in Replit Secrets:
- `GEMINI_API_KEY` - Required for AI-powered plagiarism detection
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous/public API key

## Key Features
1. **AI-Powered Detection**: Uses Gemini AI for plagiarism and AI-content detection
2. **Role-Based Access**: Separate dashboards for students, teachers, and admins
3. **Class Management**: Create and manage classes with assignment tracking
4. **Analytics Dashboard**: Visual insights into submission patterns and integrity metrics
5. **Achievement System**: Gamification to encourage academic honesty
6. **Responsive Design**: Mobile-first approach with modern UI/UX

## Design System
- **Primary Colors**: Blue (600-700) and Indigo (600-700)
- **Gradients**: Used extensively for CTAs and hero sections
- **Typography**: Inter font family with extrabold headings
- **Animations**: Fade-in, slide-up, and floating element animations
- **Components**: Card-based layouts with hover effects and shadows

## User Preferences
- Modern, clean design aesthetic
- Emphasis on visual appeal and user experience
- Gradient backgrounds and smooth animations
- Split-screen layouts for authentication pages
- Comprehensive feature showcases

## Getting Started
1. Install dependencies: `npm install`
2. Set up environment variables in Replit Secrets:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Run the database schema setup (if needed):
   - Schema is located in `database/supabase-schema.sql`
   - Execute in your Supabase SQL Editor
4. Run development server: `npm run dev`
5. Access at: `http://localhost:5000`

## Database Management
- **Connection Test**: Run `npx tsx test-supabase.ts` to verify database connectivity
- **Schema**: See `database/supabase-schema.sql` for complete database structure
- **RLS Policies**: Row-Level Security is enabled for user data protection
- **Storage Buckets**: 
  - Create `submissions` bucket (public: false, max size: 10MB)
  - Create `avatars` bucket (public: true, max size: 2MB)

## Deployment
The project is configured for Replit autoscale deployment with:
- Build command: `npm run build`
- Run command: `npx vite preview --host 0.0.0.0 --port 5000`
- Deployment target: Autoscale (for stateless web apps)
