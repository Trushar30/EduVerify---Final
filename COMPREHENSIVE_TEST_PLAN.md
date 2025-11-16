# EduVerify - Comprehensive Feature Test Plan

## Project Overview
**EduVerify** is an Academic Integrity Platform built with React, TypeScript, Vite, and Supabase. It provides plagiarism detection, AI content analysis, and academic integrity management for educational institutions.

**Key Technologies:**
- Frontend: React 19.2.0, TypeScript, Tailwind CSS, React Router
- Charts: Recharts 3.3.0
- Backend: Supabase (PostgreSQL)
- AI: Google Gemini API
- Build Tool: Vite 6.2.0

---

## PHASE 1: AUTHENTICATION & AUTHORIZATION TESTS

### Test 1.1: Landing Page Load
**Expected:** Landing page displays without errors
- [ ] Page loads with branding (EduVerify logo, tagline)
- [ ] Navigation links visible: Login, Signup, About
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Hero section displays correctly
- [ ] Call-to-action buttons functional

### Test 1.2: Login Functionality
**Expected:** Users can login with valid email
```
Demo Credentials Available:
- Admin: admin@eduverify.com
- Teacher: teacher@example.com
- Student: student1@example.com / student2@example.com
```
- [ ] Invalid email shows error message: "Invalid email. Please try again."
- [ ] Valid email logs in user successfully
- [ ] User redirected to `/dashboard`
- [ ] User stored in localStorage as `eduverify_user`
- [ ] Logout clears localStorage
- [ ] Quick login buttons work (if present)

### Test 1.3: Signup Functionality
**Expected:** New users can create accounts
- [ ] Form displays all required fields (name, email, password, role)
- [ ] Role selection dropdown shows: ADMIN, TEACHER, STUDENT
- [ ] Form validation works (required fields, email format)
- [ ] New user created successfully
- [ ] Duplicate email prevented
- [ ] User automatically logged in after signup
- [ ] Redirect to dashboard occurs

### Test 1.4: Protected Routes
**Expected:** Unauthorized users cannot access protected pages
- [ ] Non-authenticated users redirected to login from `/dashboard`
- [ ] `/dashboard` requires valid user in context
- [ ] User role determines route availability
- [ ] Back button after logout doesn't bypass protection
- [ ] Refresh page maintains authentication (localStorage)

### Test 1.5: Role-Based Access Control
**Expected:** Different dashboards for different roles
- [ ] ADMIN redirects to AdminDashboard
- [ ] TEACHER redirects to TeacherDashboard
- [ ] STUDENT redirects to StudentDashboard
- [ ] Users cannot access other role dashboards
- [ ] Role returned from AuthContext matches user object

---

## PHASE 2: DASHBOARD TESTS

### Test 2.1: Admin Dashboard
**Expected:** Displays admin-specific statistics and navigation
- [ ] Dashboard loads without errors
- [ ] Navigation menu shows: Users, Classes, Profile
- [ ] Admin statistics display correctly
- [ ] Total users count shown
- [ ] Total classes count shown
- [ ] Total submissions count shown
- [ ] Quick action buttons visible (Create Class, Manage Users)
- [ ] User list/table displays with pagination (if applicable)

### Test 2.2: Teacher Dashboard
**Expected:** Displays teacher-specific content
- [ ] Dashboard loads for teacher role
- [ ] Shows classes taught by teacher
- [ ] Shows total assignments created
- [ ] Shows total submissions received
- [ ] Shows flagged submissions count
- [ ] Recent submissions list displays
- [ ] Navigation menu shows: Classes, Notifications, Profile
- [ ] Quick stats cards display correctly

### Test 2.3: Student Dashboard
**Expected:** Displays student-specific information
- [ ] Dashboard loads for student role
- [ ] Shows enrolled classes
- [ ] Shows pending assignments count
- [ ] Shows submitted assignments count
- [ ] Shows achievements unlocked
- [ ] Shows notifications count
- [ ] Navigation menu shows: Classes, Join Class, Notifications, Profile
- [ ] Recent activity section functional

---

## PHASE 3: CLASS MANAGEMENT TESTS

### Test 3.1: Create Class (Admin/Teacher)
**Expected:** Teachers can create classes
- [ ] Form displays with fields: Class Name, optional description
- [ ] Class creation successful
- [ ] Unique join code generated (format: XXXX###)
- [ ] Class appears in class list immediately
- [ ] Class theme assigned randomly
- [ ] Creator becomes teacher of class
- [ ] Empty student list initially

### Test 3.2: Join Class (Student)
**Expected:** Students can join classes via code
- [ ] "Join Class" page accessible to students
- [ ] Input field for join code
- [ ] Invalid code shows error: "Invalid join code"
- [ ] Valid code adds student to class
- [ ] Student appears in class student list
- [ ] Class appears in student's class list
- [ ] Can't join same class twice (prevent duplicates)

### Test 3.3: Class Management
**Expected:** Teachers can manage their classes
- [ ] View all classes taught
- [ ] Edit class name
- [ ] View student list
- [ ] Remove students from class
- [ ] Archive class (soft delete)
- [ ] Display join code for students
- [ ] View assignments in class
- [ ] Delete class (if no submissions)

### Test 3.4: Class Detail Page (Teacher)
**Expected:** Teachers can see detailed class information
- [ ] Class name, description, join code displayed
- [ ] List of enrolled students with counts
- [ ] List of assignments with status (pending, submitted, analyzed)
- [ ] Add new assignment button functional
- [ ] Recent submissions list
- [ ] Analytics section displays
- [ ] Class settings/actions menu

### Test 3.5: Class Detail Page (Student)
**Expected:** Students can see their classes
- [ ] Class name and teacher displayed
- [ ] List of assignments in class
- [ ] Assignment status indicators (Not Started, Submitted, Graded)
- [ ] Submit assignment button for pending assignments
- [ ] View grade/report if submitted
- [ ] View submission history
- [ ] Leave class option (if applicable)

---

## PHASE 4: ASSIGNMENT & SUBMISSION TESTS

### Test 4.1: Create Assignment
**Expected:** Teachers can create assignments
- [ ] Form displays: Title, Instructions, Deadline
- [ ] Title required field validation
- [ ] Instructions rich text input (or plain text)
- [ ] Deadline date/time picker functional
- [ ] Assignment created successfully
- [ ] Assignment appears in class assignment list
- [ ] Default status is "ACTIVE"
- [ ] Appears on student dashboards

### Test 4.2: View Assignment Details
**Expected:** Both teachers and students can view assignment details
- [ ] Assignment title, instructions, deadline display
- [ ] Submission count shown
- [ ] For students: submission button visible
- [ ] For teachers: submission list with status

### Test 4.3: Submit Assignment (Student)
**Expected:** Students can submit files
- [ ] File upload input accepts files (PDF, DOCX, TXT, etc.)
- [ ] File preview available before submission
- [ ] File size validation (if applicable)
- [ ] Submission timestamp recorded correctly
- [ ] Submitted file appears in submission list
- [ ] Status changes from "Not Started" to "Submitted"
- [ ] Submission confirmation message shown
- [ ] Can resubmit (if allowed)

### Test 4.4: Submission Status Tracking
**Expected:** Submission status correctly tracked through pipeline
- [ ] Initial status: "PENDING" (awaiting analysis)
- [ ] During analysis: "ANALYZING" or "IN_PROGRESS"
- [ ] After analysis: "COMPLETED" with report
- [ ] If flagged: "FLAGGED" status visible
- [ ] Teacher can see submission timeline
- [ ] Student can see their submission status

---

## PHASE 5: PLAGIARISM DETECTION & ANALYSIS TESTS

### Test 5.1: Report Generation (Gemini API)
**Expected:** Plagiarism reports generated successfully
- [ ] Report generation triggered on submission
- [ ] Plagiarism score calculated (0-100)
- [ ] AI content score calculated (0-100)
- [ ] Analysis summary generated
- [ ] Plagiarized sources detected
- [ ] Report status: PENDING → PUBLISHED
- [ ] Report timestamp accurate

### Test 5.2: Plagiarism Score Display
**Expected:** Plagiarism scores displayed correctly
- [ ] Score shown as percentage (0-100%)
- [ ] Color-coded indicators:
  - Green: 0-20% (Low plagiarism)
  - Yellow: 21-50% (Medium)
  - Orange: 51-80% (High)
  - Red: 81-100% (Critical)
- [ ] Score displayed on submission list
- [ ] Score visible in detailed report
- [ ] Score persistent after refresh

### Test 5.3: AI Content Detection
**Expected:** AI content detection working
- [ ] AI probability score shown (0-100%)
- [ ] AI content summary provided
- [ ] Flagged sections identified
- [ ] Confidence levels shown
- [ ] Warning if high AI content detected

### Test 5.4: Plagiarized Sources
**Expected:** Source citations displayed
- [ ] External sources listed (URLs)
- [ ] Internal sources listed (Student names)
- [ ] Matching snippets shown
- [ ] Confidence scores for each source
- [ ] Source type indicated (INTERNAL/EXTERNAL)
- [ ] Sources sorted by confidence

### Test 5.5: Report Detail Modal
**Expected:** Detailed report viewing
- [ ] Modal opens without errors
- [ ] All report data displays correctly
- [ ] Charts/visualizations render
- [ ] Sources clickable/expandable
- [ ] Close button functional
- [ ] Responsive on mobile

---

## PHASE 6: ANALYTICS & INSIGHTS TESTS

### Test 6.1: Class Analytics Dashboard
**Expected:** Class-level analytics displayed
- [ ] Average plagiarism score calculated
- [ ] High-risk students identified
- [ ] Submission rate shown
- [ ] On-time vs late submissions
- [ ] Most common plagiarism sources
- [ ] AI detection trends
- [ ] Charts update correctly

### Test 6.2: Plagiarism Treemap Visualization
**Expected:** Visual representation of plagiarism
- [ ] Treemap renders correctly
- [ ] Size represents plagiarism score
- [ ] Color represents severity
- [ ] Hover shows student name and score
- [ ] Click expands/drills down
- [ ] Legend displayed

### Test 6.3: At-Risk Cohorts
**Expected:** Identify students needing support
- [ ] Students with plagiarism > 50% flagged
- [ ] Students with high AI detection flagged
- [ ] Risk count accurate
- [ ] At-risk list sortable/filterable
- [ ] Recommendation shown for intervention

### Test 6.4: Top Sources Card
**Expected:** Most common plagiarism sources displayed
- [ ] External sources listed by frequency
- [ ] Internal sources listed by frequency
- [ ] Count of occurrences shown
- [ ] Sorted by frequency descending
- [ ] Clickable to see details

---

## PHASE 7: USER MANAGEMENT TESTS

### Test 7.1: View Users (Admin)
**Expected:** Admin can view all users
- [ ] User list displays with: Name, Email, Role, Status
- [ ] Total users count shown
- [ ] Pagination/infinite scroll functional
- [ ] Search/filter by name or email
- [ ] Filter by role (Admin, Teacher, Student)
- [ ] Sort by name, email, role

### Test 7.2: Create User (Admin)
**Expected:** Admin can create new users
- [ ] Form displays: Name, Email, Password, Role
- [ ] Required field validation
- [ ] Email uniqueness validation
- [ ] Password strength validation (if applicable)
- [ ] User created successfully
- [ ] User appears in list immediately
- [ ] Confirmation message shown

### Test 7.3: Edit User (Admin)
**Expected:** Admin can edit user details
- [ ] Edit form pre-fills current data
- [ ] Name can be updated
- [ ] Email can be updated
- [ ] Role can be changed
- [ ] Changes saved successfully
- [ ] User list updates
- [ ] No duplicate emails allowed

### Test 7.4: Deactivate/Reactivate User
**Expected:** Admin can toggle user status
- [ ] Active status shown (Active/Inactive badge)
- [ ] Deactivate button visible for active users
- [ ] Activate button visible for inactive users
- [ ] Deactivation removes from class access
- [ ] Reactivation restores access
- [ ] Status persists after refresh
- [ ] Cannot login if deactivated

### Test 7.5: Delete User
**Expected:** Admin can delete users
- [ ] Delete button visible
- [ ] Confirmation dialog appears
- [ ] User removed from system
- [ ] Associated data handled (cascade)
- [ ] Cannot recover deleted user (if no backup)

---

## PHASE 8: FEEDBACK & COMMUNICATION TESTS

### Test 8.1: Teacher Feedback on Submission
**Expected:** Teachers can provide feedback
- [ ] Feedback form displays on submission detail
- [ ] Text input for feedback message
- [ ] Submit feedback button functional
- [ ] Feedback saved with timestamp
- [ ] Feedback appears in submission timeline
- [ ] Student notified of feedback

### Test 8.2: Student Feedback Response
**Expected:** Students can respond to feedback
- [ ] Response form visible to student
- [ ] Can add follow-up message
- [ ] Response saved with timestamp
- [ ] Teacher notified of response
- [ ] Conversation thread displayed

### Test 8.3: Notifications System
**Expected:** Users receive relevant notifications
- [ ] NEW_SUBMISSION: Teacher notified when student submits
- [ ] REPORT_PUBLISHED: Student notified when report ready
- [ ] NEW_ASSIGNMENT: Student notified of new assignment
- [ ] NEW_FEEDBACK: Student notified of teacher feedback
- [ ] ACHIEVEMENT_UNLOCKED: Student notified of achievement
- [ ] Notifications appear in notifications page
- [ ] Notification count accurate
- [ ] Mark as read functionality works

### Test 8.4: Notifications Page
**Expected:** Notifications displayed and manageable
- [ ] All notifications listed with newest first
- [ ] Unread notifications highlighted
- [ ] Read/Unread toggle works
- [ ] Mark all as read button functional
- [ ] Filter by type (if implemented)
- [ ] Click notification navigates to relevant page
- [ ] Delete notification option available

---

## PHASE 9: ACHIEVEMENTS & GAMIFICATION TESTS

### Test 9.1: Achievement Types
**Expected:** All achievement types unlock correctly
- [ ] FIRST_SUBMISSION: Unlocks on first submission
- [ ] ON_TIME_SUBMISSION: Unlocks when submitted before deadline
- [ ] INTEGRITY_ACE: Plagiarism score < 20% on submission
- [ ] STREAK_3: 3 on-time submissions in a row
- [ ] STREAK_5: 5 on-time submissions in a row
- [ ] MOST_IMPROVED: Plagiarism score improves by 30%+
- [ ] PROACTIVE_PLANNER: Submit 3 days before deadline
- [ ] PERFECT_SCORE: 0% plagiarism + high quality content
- [ ] FEEDBACK_PROVIDER: Leave feedback on peer submission

### Test 9.2: Achievement Display
**Expected:** Achievements displayed with details
- [ ] Achievement badge displays with icon
- [ ] Achievement name and description shown
- [ ] Unlock date/time visible
- [ ] Progress toward achievement visible (if not unlocked)
- [ ] Achievement list on student profile
- [ ] Achievement notifications in toast

### Test 9.3: Achievement Modal
**Expected:** Detailed achievement information
- [ ] Modal opens when achievement clicked
- [ ] Full description displayed
- [ ] Requirements explained
- [ ] Progress bar shown (if applicable)
- [ ] Unlock date/time shown if unlocked

---

## PHASE 10: UI COMPONENTS & UX TESTS

### Test 10.1: Card Component
**Expected:** Card wrapper displays correctly
- [ ] Content renders inside card
- [ ] Padding and spacing correct
- [ ] Shadow applied (if applicable)
- [ ] Border rounded
- [ ] Responsive width on all screen sizes
- [ ] Click handlers work (if applicable)

### Test 10.2: Table Component
**Expected:** Data tables display correctly
- [ ] Headers display
- [ ] Data rows display
- [ ] Pagination controls visible
- [ ] Sort by column header works
- [ ] Row selection works (if applicable)
- [ ] Responsive on mobile (scrollable/collapsible)
- [ ] Empty state message shown when no data

### Test 10.3: Modal Component
**Expected:** Modal dialogs function correctly
- [ ] Modal opens with overlay
- [ ] Close button works (X and outside click)
- [ ] Content displays without overflow
- [ ] Keyboard escape closes modal
- [ ] Focus trapped in modal
- [ ] Responsive width on mobile

### Test 10.4: Chart Components (Recharts)
**Expected:** Charts render with data
- [ ] DoughnutChart displays correctly
- [ ] Bar charts render (if used)
- [ ] Line charts render (if used)
- [ ] Legend displays
- [ ] Tooltip shows on hover
- [ ] Responsive sizing
- [ ] Colors consistent

### Test 10.5: Toast Notifications
**Expected:** Toast messages display properly
- [ ] Success toast displays green
- [ ] Error toast displays red
- [ ] Warning toast displays yellow
- [ ] Info toast displays blue
- [ ] Auto-dismiss after 5 seconds
- [ ] Manual dismiss button works
- [ ] Multiple toasts stack properly
- [ ] Message text visible

### Test 10.6: Form Components
**Expected:** Form inputs work correctly
- [ ] Text inputs accept input
- [ ] Email validation works
- [ ] Date/time pickers functional
- [ ] Dropdowns open and select
- [ ] Checkboxes toggle
- [ ] Radio buttons toggle
- [ ] Required field indicators shown
- [ ] Error messages display under fields
- [ ] Form submission prevents when invalid

---

## PHASE 11: PROFILE & SETTINGS TESTS

### Test 11.1: Profile Page
**Expected:** User profile displays correctly
- [ ] User name displayed
- [ ] User email displayed
- [ ] User role displayed
- [ ] User avatar (if applicable)
- [ ] Edit profile button visible
- [ ] Edit name functionality works
- [ ] Edit email functionality works
- [ ] Edit password functionality (if applicable)
- [ ] Save changes successfully
- [ ] Changes persist after logout/login

---

## PHASE 12: INTEGRATION TESTS

### Test 12.1: Supabase Integration
**Expected:** Database operations work
- [ ] Users table queries work
- [ ] Classes table queries work
- [ ] Assignments table queries work
- [ ] Submissions table queries work
- [ ] Reports table queries work
- [ ] Data persists across sessions
- [ ] Create operations successful
- [ ] Update operations successful
- [ ] Delete operations successful
- [ ] Error handling for failed queries

### Test 12.2: Gemini API Integration
**Expected:** AI analysis works
- [ ] API connection successful
- [ ] Text submission sent correctly
- [ ] Plagiarism score received
- [ ] AI content score received
- [ ] Analysis summary generated
- [ ] Sources detected and listed
- [ ] Error handling for API failures
- [ ] Timeout handling for long requests
- [ ] Rate limiting respected (if applicable)

### Test 12.3: File Storage
**Expected:** File uploads work
- [ ] Files uploaded to correct location
- [ ] File names preserved (with sanitization)
- [ ] File mime type detected
- [ ] Large files handled
- [ ] File deletion works
- [ ] File retrieval/download works
- [ ] File preview available (for text/PDFs)

---

## PHASE 13: PERFORMANCE & EDGE CASES

### Test 13.1: Large Data Sets
**Expected:** App handles volume
- [ ] 1000+ users loads without lag
- [ ] 1000+ classes/submissions handled
- [ ] Lists with pagination perform
- [ ] Search/filter responsive with large data
- [ ] Charts render quickly with large data
- [ ] Analytics calculations complete in reasonable time

### Test 13.2: Empty States
**Expected:** App handles no data gracefully
- [ ] No classes: empty message displayed
- [ ] No assignments: empty message displayed
- [ ] No submissions: empty message displayed
- [ ] No analytics: empty state shown
- [ ] No notifications: empty state shown
- [ ] No achievements: empty state shown

### Test 13.3: Error Handling
**Expected:** Errors handled gracefully
- [ ] Network error shows message
- [ ] API timeout shows message
- [ ] Invalid data doesn't break UI
- [ ] Missing required fields show validation
- [ ] Unauthorized access shows error
- [ ] 404 pages handled
- [ ] 500 errors show message

### Test 13.4: Concurrent Operations
**Expected:** Multiple simultaneous actions work
- [ ] Multiple file uploads work
- [ ] Multiple submissions don't conflict
- [ ] Multiple users editing simultaneously
- [ ] Real-time updates propagate
- [ ] No data corruption from race conditions

---

## PHASE 14: RESPONSIVE DESIGN TESTS

### Test 14.1: Mobile (320px - 480px)
**Expected:** App works on small screens
- [ ] All pages readable without horizontal scroll
- [ ] Buttons/inputs easily tappable (48x48px minimum)
- [ ] Navigation collapsed to hamburger menu
- [ ] Tables convert to card view or scroll
- [ ] Charts responsive/smaller
- [ ] Forms stack vertically
- [ ] Images scale down appropriately

### Test 14.2: Tablet (481px - 1024px)
**Expected:** App optimized for tablets
- [ ] Layout utilizes space effectively
- [ ] Two-column layouts where appropriate
- [ ] Landscape orientation supported
- [ ] Touch interactions work
- [ ] Modals appropriately sized

### Test 14.3: Desktop (1025px+)
**Expected:** Full feature display
- [ ] Side navigation visible
- [ ] Multi-column layouts
- [ ] All features accessible
- [ ] Optimal readability
- [ ] Hover states work

---

## PHASE 15: ACCESSIBILITY TESTS

### Test 15.1: Keyboard Navigation
**Expected:** Full keyboard access
- [ ] Tab through all interactive elements
- [ ] Shift+Tab reverse navigation works
- [ ] Enter activates buttons
- [ ] Space toggles checkboxes
- [ ] Arrow keys in dropdowns/menus
- [ ] Focus visible on all elements
- [ ] No keyboard traps

### Test 15.2: Screen Reader Compatibility
**Expected:** Works with accessibility tools
- [ ] ARIA labels on interactive elements
- [ ] Form labels associated with inputs
- [ ] Images have alt text
- [ ] Buttons have descriptive text
- [ ] Icons have aria-label
- [ ] Tables have header rows
- [ ] Links have descriptive text

### Test 15.3: Color Contrast
**Expected:** Text readable for color-blind users
- [ ] Text contrast ratio > 4.5:1 (WCAG AA)
- [ ] Not relying solely on color for information
- [ ] Status indicators have text/icon backup

---

## QUICK TEST CHECKLIST

### Pre-Test Setup
- [ ] Clear browser cache and localStorage
- [ ] Close all console errors if possible
- [ ] Test on fresh browser profile if possible
- [ ] Ensure backend/Supabase credentials are configured
- [ ] Verify Gemini API key is set
- [ ] Note current build/version number

### Critical Path Tests (Must Pass)
- [ ] Login with valid credentials
- [ ] Navigate to correct dashboard based on role
- [ ] Create a class and join as student
- [ ] Submit an assignment
- [ ] Receive plagiarism report
- [ ] View achievements
- [ ] Logout and login again (persistence check)

### Known Issues/Limitations
- [ ] List any known bugs
- [ ] List any incomplete features
- [ ] List any dependent external services

---

## TEST EXECUTION SUMMARY

| Phase | Category | Tests | Status | Notes |
|-------|----------|-------|--------|-------|
| 1 | Authentication | 5 | [ ] | |
| 2 | Dashboards | 3 | [ ] | |
| 3 | Class Management | 5 | [ ] | |
| 4 | Assignments | 4 | [ ] | |
| 5 | Plagiarism Detection | 5 | [ ] | |
| 6 | Analytics | 4 | [ ] | |
| 7 | User Management | 5 | [ ] | |
| 8 | Feedback | 4 | [ ] | |
| 9 | Achievements | 3 | [ ] | |
| 10 | UI Components | 6 | [ ] | |
| 11 | Profile | 1 | [ ] | |
| 12 | Integrations | 3 | [ ] | |
| 13 | Performance | 4 | [ ] | |
| 14 | Responsive | 3 | [ ] | |
| 15 | Accessibility | 3 | [ ] | |

**Total Tests: 60**
**Estimated Time: 4-6 hours for comprehensive testing**

---

## EXECUTION NOTES

### For Manual Testing:
1. Use the demo accounts provided in credentials
2. Create test submissions with provided dummy data
3. Document any failures with steps to reproduce
4. Screenshot UI for each major section
5. Test both happy path and error scenarios

### For Automated Testing (Future):
- Implement Jest for unit tests
- Implement Cypress/Playwright for E2E tests
- Mock Supabase and Gemini API
- Create test data factories
- Set up CI/CD pipeline

---

**Test Plan Created:** November 15, 2025
**Application Version:** 0.0.0
**Status:** Ready for Execution
