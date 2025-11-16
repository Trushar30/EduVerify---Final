# EduVerify - Test Execution Guide

## Quick Start to Testing

### System Requirements
- **Node.js:** v18+ (check with `node --version`)
- **npm:** v9+ (check with `npm --version`)
- **Browser:** Chrome, Firefox, Safari, or Edge (latest versions)
- **RAM:** 4GB+ recommended
- **Disk Space:** 500MB free space

---

## SETUP BEFORE TESTING

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create `.env.local` file in project root:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Step 3: Start Development Server
```bash
npm run dev
```
Server will be available at: `http://localhost:5173`

### Step 4: Verify Initial Load
- [ ] Application loads without console errors
- [ ] Landing page displays correctly
- [ ] Navigation menu appears

---

## TEST CREDENTIALS

### Admin Account
```
Email: admin@eduverify.com
Role: ADMIN
Purpose: User management, system administration
```

### Teacher Account
```
Email: teacher@example.com
Role: TEACHER
Purpose: Class management, assignment creation, plagiarism review
```

### Student Accounts
```
Email: student1@example.com
Role: STUDENT
Purpose: Submit assignments, view reports

Email: student2@example.com
Role: STUDENT
Purpose: Submit assignments, view reports
```

### Demo Access
All test accounts use **password-less login** - just enter email and submit.

---

## PHASE 1: AUTHENTICATION TEST EXECUTION

### 1.1 - Test Landing Page
**Duration:** 5 minutes

1. Open `http://localhost:5173`
2. Verify page elements:
   - [ ] EduVerify logo visible
   - [ ] Main tagline displayed
   - [ ] Navigation: Home, About, Login, Signup visible
   - [ ] Hero section with CTA buttons
   - [ ] Features section displays
   - [ ] Footer present
3. Click "About" link - verify About page loads
4. Return to home

**Expected Result:** ✅ All page elements render correctly

---

### 1.2 - Test Login (Valid Credentials)
**Duration:** 5 minutes

1. Click "Login" button
2. Verify Login page:
   - [ ] Left side branding visible (desktop)
   - [ ] Email input field visible
   - [ ] Submit button visible
   - [ ] "Don't have an account?" link visible
3. **Test 1: Valid Teacher Login**
   - Enter email: `teacher@example.com`
   - Click "Sign In"
   - Expected: Redirected to `/dashboard`
   - Expected: Teacher Dashboard displayed
   - Verify localStorage contains `eduverify_user`
4. **Test 2: Valid Student Login**
   - Click profile → Logout
   - Navigate to Login
   - Enter email: `student1@example.com`
   - Click "Sign In"
   - Expected: Redirected to `/dashboard`
   - Expected: Student Dashboard displayed
5. **Test 3: Valid Admin Login**
   - Logout again
   - Enter email: `admin@eduverify.com`
   - Click "Sign In"
   - Expected: Admin Dashboard displayed

**Expected Result:** ✅ All three roles login successfully and display correct dashboards

---

### 1.3 - Test Login (Invalid Credentials)
**Duration:** 3 minutes

1. Go to Login page
2. Enter email: `nonexistent@example.com`
3. Click "Sign In"
4. **Expected Result:** ❌ Error message displays: "Invalid email. Please try again."
5. Repeat with email: `invalid.email`
6. **Expected Result:** Same error message

**Expected Result:** ✅ Invalid credentials rejected properly

---

### 1.4 - Test Signup
**Duration:** 5 minutes

1. Click "Signup" button from Login or Landing page
2. Verify form displays:
   - [ ] Name input field
   - [ ] Email input field
   - [ ] Role dropdown (Admin, Teacher, Student)
   - [ ] Submit button
3. **Test 1: Create new student account**
   - Name: "Test Student User"
   - Email: `teststudent@example.com`
   - Role: STUDENT
   - Click "Sign Up"
   - Expected: Account created successfully
   - Expected: Redirected to dashboard
   - Expected: Student Dashboard displayed
4. **Test 2: Try duplicate email**
   - Go to Signup
   - Try email: `teststudent@example.com`
   - Expected: Error message about duplicate email
5. **Test 3: Test form validation**
   - Try submitting empty form
   - Expected: Required field errors shown
   - Try invalid email format
   - Expected: Email validation error shown

**Expected Result:** ✅ Signup works, validation works, duplicates prevented

---

### 1.5 - Test Logout & Session Persistence
**Duration:** 3 minutes

1. **Login again** with `teacher@example.com`
2. Verify dashboard loads
3. **Open browser DevTools** (F12)
   - Go to Application → LocalStorage
   - Check for `eduverify_user` key
   - Verify it contains teacher data
4. **Click Logout** (Profile menu → Logout)
   - Expected: Redirected to landing page
   - Expected: `eduverify_user` removed from localStorage
5. **Refresh page** while logged out
   - Expected: Stays on landing page (not forced to login)
6. **Login again** with same email
   - Expected: Dashboard loads immediately
   - Expected: User data populated from localStorage

**Expected Result:** ✅ Session management and persistence working

---

## PHASE 2: ROLE-BASED DASHBOARD TESTS

### 2.1 - Admin Dashboard
**Duration:** 10 minutes

1. **Login as Admin** (`admin@eduverify.com`)
2. **Verify Dashboard Layout:**
   - [ ] Sidebar navigation shows: Users, Classes, Profile, Logout
   - [ ] Main area displays statistics cards:
     - Total Users count
     - Total Classes count
     - Total Submissions count
     - Pending Reports count
   - [ ] Dashboard title "Admin Dashboard" visible
3. **Test Navigation:**
   - [ ] Click "Users" → Navigate to user management
   - [ ] Click "Classes" → Navigate to class management
   - [ ] Click "Profile" → Navigate to profile page
   - [ ] Click on logo → Return to main dashboard
4. **Check Statistics Accuracy:**
   - Note the displayed statistics
   - These should be counts of actual data in system

**Test Plan:**
```
Admin should see:
- Statistics for entire system
- Options to manage all users
- Options to manage all classes
- No class-specific content
```

**Expected Result:** ✅ Admin dashboard fully functional

---

### 2.2 - Teacher Dashboard
**Duration:** 10 minutes

1. **Login as Teacher** (`teacher@example.com`)
2. **Verify Dashboard Layout:**
   - [ ] Sidebar navigation shows: Classes, Notifications, Profile, Logout
   - [ ] Main area displays:
     - Classes taught (with card for each)
     - Statistics: Assignments, Submissions, Flagged
     - Recent submissions list
     - Quick actions: Create Class, View Submissions
3. **Test Class Cards:**
   - [ ] Each class shows name, student count, assignment count
   - [ ] Click class card → Navigate to class detail page
   - [ ] Join code visible (for sharing)
4. **Test Recent Submissions:**
   - [ ] Shows latest submissions
   - [ ] Student name visible
   - [ ] Assignment name visible
   - [ ] Submission timestamp visible
   - [ ] Plagiarism score visible (if report generated)
5. **Test Navigation:**
   - [ ] Click "Classes" → Class management page
   - [ ] Click "Notifications" → Notifications page
   - [ ] Click "Profile" → Profile page

**Test Plan:**
```
Teacher should see:
- Only their own classes
- Submissions from their students
- Ability to create assignments
- Student analytics
```

**Expected Result:** ✅ Teacher dashboard functional with correct data

---

### 2.3 - Student Dashboard
**Duration:** 10 minutes

1. **Login as Student** (`student1@example.com`)
2. **Verify Dashboard Layout:**
   - [ ] Sidebar navigation shows: Classes, Join Class, Notifications, Profile, Logout
   - [ ] Main area displays:
     - Enrolled classes
     - Pending assignments count
     - Submitted assignments count
     - Achievements section
     - Recent activity
3. **Test Class Cards:**
   - [ ] Shows classes student is enrolled in
   - [ ] Click class → Navigate to class detail
4. **Test "Join Class" Button:**
   - [ ] Click "Join Class"
   - [ ] Join code input field appears
   - [ ] Can enter a valid join code
   - [ ] Can see error for invalid codes
5. **Test Achievements:**
   - [ ] Achievements section displays
   - [ ] Unlocked achievements show with icons
   - [ ] Achievement count correct
   - [ ] Click achievement → Details modal opens

**Test Plan:**
```
Student should see:
- Only classes they enrolled in
- Their own assignments and submissions
- Their achievements
- Ability to join new classes
- Notifications relevant to them
```

**Expected Result:** ✅ Student dashboard functional with correct data

---

## PHASE 3: CLASS MANAGEMENT TESTS

### 3.1 - Teacher Creates Class
**Duration:** 10 minutes

1. **Login as Teacher** (`teacher@example.com`)
2. Navigate to Classes → "Create Class" button
3. **Verify Form:**
   - [ ] Class Name input field
   - [ ] Optional description field
   - [ ] Create button visible
4. **Test Class Creation:**
   - Class Name: "Advanced Python Programming"
   - Click "Create"
   - Expected: Success message shown
   - Expected: New class appears in class list
   - Expected: Unique join code generated
   - Verify join code format (e.g., "XYZW###")
5. **Verify Class Details:**
   - Click newly created class
   - Verify:
     - [ ] Class name displays
     - [ ] Join code visible
     - [ ] Student list empty (or minimal)
     - [ ] Assignments list empty
     - [ ] Edit/Delete options available

**Expected Result:** ✅ Class created with unique code

---

### 3.2 - Student Joins Class
**Duration:** 10 minutes

1. **Login as Student** (`student1@example.com`)
2. Note the join code from teacher's class (e.g., "XYZW###")
3. Navigate to Dashboard → "Join Class"
4. **Test Join Functionality:**
   - Enter valid join code
   - Click "Join"
   - Expected: Success message
   - Expected: Class appears in student's class list
   - Expected: Notification may appear
5. **Verify Student Added to Class:**
   - Login as Teacher
   - Navigate to the class
   - Verify student name appears in student list
   - Verify student count increased
6. **Test Invalid Join Code:**
   - Login as different student
   - Try join code: "INVALID"
   - Expected: Error message "Invalid join code"
   - Expected: Student not added

**Test Plan:**
```
Process:
1. Teacher creates class with code "ABC123"
2. Student1 joins with code "ABC123" ✓
3. Student2 tries code "WRONGCODE" ✗ (error shown)
4. Student2 joins with code "ABC123" ✓
```

**Expected Result:** ✅ Join system working correctly

---

### 3.3 - Manage Class (Teacher)
**Duration:** 10 minutes

1. **Login as Teacher** (`teacher@example.com`)
2. Navigate to a class with students
3. **Test Edit Class:**
   - Click "Edit Class" or settings icon
   - Change class name to "Advanced Python 2025"
   - Click "Save"
   - Expected: Name updated immediately
   - Expected: Name persists after refresh
4. **Test View Students:**
   - Student list displays
   - [ ] Student names visible
   - [ ] Student emails visible
   - [ ] Student count accurate
5. **Test Remove Student:**
   - Click "Remove" next to a student
   - Expected: Confirmation dialog
   - Click "Confirm"
   - Expected: Student removed from list
   - Expected: Student can no longer access class
6. **Test Archive Class:**
   - If class is empty or completed:
   - Click "Archive" option
   - Expected: Class archived status shown
   - Expected: Appears in archived classes list

**Expected Result:** ✅ Class management features working

---

## PHASE 4: ASSIGNMENT & SUBMISSION TESTS

### 4.1 - Create Assignment
**Duration:** 10 minutes

1. **Login as Teacher** (`teacher@example.com`)
2. Navigate to a class with students enrolled
3. Click "Create Assignment" or "Add Assignment"
4. **Verify Form:**
   - [ ] Assignment Title field
   - [ ] Instructions text area
   - [ ] Deadline date/time picker
   - [ ] Create button
5. **Test Assignment Creation:**
   - Title: "Quantum Physics Essay"
   - Instructions: "Write a 5-page essay on quantum entanglement. Include at least 3 peer-reviewed sources."
   - Deadline: Select date 2 weeks from now, 11:59 PM
   - Click "Create"
   - Expected: Success message
   - Expected: Assignment appears in class
   - Expected: Students notified (optional)
6. **Verify Assignment Display:**
   - Assignment appears in teacher's class
   - Title, instructions, deadline all visible
   - Assignment shows as "Active" or "Pending Submissions"

**Expected Result:** ✅ Assignment created successfully

---

### 4.2 - Student Views Assignment
**Duration:** 5 minutes

1. **Login as Student** (`student1@example.com`)
2. Navigate to class with assignment
3. **View Assignment List:**
   - [ ] Assignment title visible
   - [ ] Assignment due date visible
   - [ ] Status indicator (Not Started, Submitted, Graded)
   - Click assignment → Opens assignment detail
4. **View Assignment Details:**
   - [ ] Full title displays
   - [ ] Instructions display completely
   - [ ] Deadline shows (e.g., "Due: Nov 15, 2025 11:59 PM")
   - [ ] "Submit Assignment" button visible
   - [ ] Days remaining counter (if applicable)

**Expected Result:** ✅ Assignment details displayed correctly

---

### 4.3 - Submit Assignment
**Duration:** 15 minutes

1. **Prepare Test File:**
   - Create a test document:
     - Save as `.txt` file
     - Content: "Quantum entanglement is a phenomenon where particles remain connected even at distance. Einstein called it 'spooky action at a distance'."
2. **Login as Student** (`student1@example.com`)
3. Navigate to assignment and click "Submit"
4. **Test File Upload:**
   - Click "Choose File" button
   - Select your test document
   - File appears in preview
   - [ ] File name visible
   - [ ] File size shown (optional)
   - [ ] Preview text visible (for text files)
5. **Complete Submission:**
   - Click "Submit" button
   - Expected: Success message "Submission recorded"
   - Expected: Page refreshes showing submission status
   - Expected: Timestamp recorded
6. **Verify Submission Display:**
   - Assignment status changes to "Submitted"
   - Submission appears in timeline
   - Can view submitted file
   - Cannot delete (or requires teacher approval)
7. **Test Resubmission (if allowed):**
   - Click "Resubmit" button
   - Upload different file
   - Expected: Latest version recorded
   - Expected: Submission timestamp updated

**Test Plan:**
```
File Types to Test:
- .txt files ✓
- .pdf files ✓
- .docx files ✓
- Large files (>10MB) - verify max size
- Wrong file type - should reject or process
```

**Expected Result:** ✅ File submission working, status updated

---

### 4.4 - Monitor Submission Status
**Duration:** 10 minutes

1. **Teacher View:**
   - Login as teacher
   - Navigate to assignment
   - Verify submission appears in list:
     - [ ] Student name
     - [ ] Submission time
     - [ ] Status (Pending, Analyzing, Completed, Flagged)
     - [ ] Plagiarism score (if available)
2. **Student View:**
   - Login as student
   - Navigate to submitted assignment
   - Verify status displays:
     - [ ] Current status shown
     - [ ] If analyzing: Progress indicator
     - [ ] If completed: Report available button
     - [ ] If flagged: Warning badge
3. **Watch Status Change:**
   - After file upload, status may show "Analyzing"
   - Wait a few seconds (analysis simulated)
   - Refresh page
   - Expected: Status updates to "Completed"
   - Expected: Report badge appears
   - Expected: Teacher can view report

**Expected Result:** ✅ Status tracking working through pipeline

---

## PHASE 5: PLAGIARISM DETECTION TESTS

### 5.1 - Report Generation
**Duration:** 15 minutes

1. **Login as Teacher** (`teacher@example.com`)
2. Navigate to assignment with submitted work
3. **View Submission:**
   - Click on student submission
   - Verify submission details display
4. **Trigger Analysis (if manual):**
   - Click "Run Analysis" or "Generate Report" button
   - Expected: "Analyzing..." status shown
   - Expected: Loading indicator appears
5. **Wait for Report:**
   - System generates plagiarism report
   - Expected: Takes 5-30 seconds depending on content
   - Expected: Status changes to "Completed"
6. **View Report:**
   - Click "View Report" button
   - Expected: Report modal opens
   - Expected: All report sections visible:
     - Plagiarism score (0-100%)
     - AI content score (0-100%)
     - Analysis summary
     - List of plagiarized sources

**Expected Result:** ✅ Report generated successfully

---

### 5.2 - Plagiarism Score Display
**Duration:** 10 minutes

1. **Review Multiple Reports:**
   - Submit multiple assignments with different content
   - Examples:
     - Original content
     - Content with one quoted sentence
     - Heavily referenced content
2. **Verify Scoring:**
   - Score displayed as percentage (0-100%)
   - Color-coded:
     - 🟢 Green (0-20%): Low plagiarism
     - 🟡 Yellow (21-50%): Medium
     - 🟠 Orange (51-80%): High
     - 🔴 Red (81-100%): Critical
3. **Check Report Details:**
   - Score visible in report modal
   - Score visible in submission list
   - Score visible in analytics
   - Score consistent across views

**Test Scores to Verify:**
```
Content: Original essay → Expected score: 0-10%
Content: 1 Wikipedia quote → Expected score: 20-40%
Content: Multiple sources combined → Expected score: 50-80%
```

**Expected Result:** ✅ Scores displayed accurately and color-coded

---

### 5.3 - AI Content Detection
**Duration:** 10 minutes

1. **View Report with AI Analysis:**
   - Open plagiarism report
   - Verify AI Content Score visible (0-100%)
   - Check color-coded severity:
     - 🟢 Green (0-30%): Likely human-written
     - 🟡 Yellow (31-70%): Mixed content
     - 🔴 Red (71-100%): Likely AI-generated
2. **Review AI Details:**
   - AI detection summary displayed
   - Flagged sections identified (if any)
   - Confidence levels shown
   - Recommendations provided
3. **Test Multiple Submissions:**
   - Submit various content types
   - Verify AI scores vary
   - Verify warnings appear for high AI content

**Expected Result:** ✅ AI detection working with appropriate warnings

---

### 5.4 - Plagiarized Sources
**Duration:** 10 minutes

1. **Open Plagiarism Report**
2. **Review Sources Section:**
   - [ ] External sources listed (URLs)
   - [ ] Internal sources listed (Student names)
   - [ ] Matching snippets displayed
   - [ ] Confidence score for each source
   - [ ] Source type badge (INTERNAL/EXTERNAL)
3. **Test Source Details:**
   - Click on source → Shows matched text
   - URL sources are clickable (if applicable)
   - Student sources show name clearly
4. **Verify Sorting:**
   - Sources sorted by confidence (highest first)
   - High confidence (>90%) at top
   - Lower confidence at bottom
5. **Example Sources Display:**
   ```
   ✓ "en.wikipedia.org/wiki/Quantum_Entanglement" - 95% confidence
   ✓ "Alex Chen (Student)" - 85% confidence
   ✓ "physics-journal.org/article/..." - 72% confidence
   ```

**Expected Result:** ✅ Sources displayed with details and confidence

---

### 5.5 - Report Modal Details
**Duration:** 10 minutes

1. **Open Report Modal:**
   - Click "View Report" on any submission with report
2. **Verify Modal Content:**
   - [ ] Modal title: "Plagiarism Report"
   - [ ] Close button (X) visible
   - [ ] Student name displayed
   - [ ] Submission date/time displayed
3. **Verify Report Sections:**
   - [ ] Summary section (score, analysis)
   - [ ] Plagiarism score with color
   - [ ] AI content score with color
   - [ ] Analysis text/summary
   - [ ] Sources table/list
   - [ ] Flagged sections (if any)
4. **Test Modal Interactions:**
   - [ ] Scroll through content
   - [ ] Click sources to expand
   - [ ] Click close → Modal closes
   - [ ] Click outside → Modal closes (if applicable)
   - [ ] Test on mobile → Modal fits screen
5. **Verify Data Persistence:**
   - Close and reopen modal
   - Expected: Same data displays
   - Refresh page
   - Expected: Report still available

**Expected Result:** ✅ Report modal fully functional

---

## PHASE 6: ANALYTICS & INSIGHTS TESTS

### 6.1 - Class Analytics
**Duration:** 15 minutes

1. **Login as Teacher** (`teacher@example.com`)
2. Navigate to class detail page
3. **Locate Analytics Section:**
   - Scroll down or find "Analytics" tab
   - Expected: Analytics section visible
4. **Verify Statistics Cards:**
   - [ ] Average plagiarism score
   - [ ] Average AI content score
   - [ ] Submission rate percentage
   - [ ] On-time vs Late submissions ratio
   - [ ] Total submissions count
   - [ ] Pending reviews count
5. **Example Analytics Display:**
   ```
   Average Plagiarism: 28%
   On-Time Submissions: 85%
   At-Risk Students: 2
   Total Submissions: 12
   ```
6. **Verify Calculations:**
   - Manually calculate average of visible submissions
   - Compare with displayed average
   - Should match (within rounding)

**Expected Result:** ✅ Analytics calculated and displayed correctly

---

### 6.2 - Plagiarism Treemap
**Duration:** 10 minutes

1. **View Class Analytics Page** or Analytics section
2. **Locate Treemap Visualization:**
   - Titled "Plagiarism Distribution" or similar
   - Shows visual blocks for each submission
3. **Verify Treemap Features:**
   - [ ] Size of block represents plagiarism score
   - [ ] Higher scores = larger blocks
   - [ ] Color represents severity:
     - Green: Low plagiarism
     - Yellow: Medium
     - Red: High
   - [ ] Hover shows student name and score
   - [ ] Click block (if interactive) shows details
4. **Test Responsiveness:**
   - Treemap fits within container
   - Responsive on mobile
   - Legend visible
5. **Verify Accuracy:**
   - Block sizes correlate with scores
   - Color matches score ranges
   - All submissions represented

**Expected Result:** ✅ Treemap visualization working

---

### 6.3 - At-Risk Cohorts
**Duration:** 10 minutes

1. **View Class Analytics**
2. **Locate "At-Risk Students" Section:**
   - Shows students needing intervention
3. **Verify At-Risk Criteria:**
   - Plagiarism score > 50% flagged
   - AI content > 70% flagged
   - Multiple high submissions flagged
4. **Review At-Risk List:**
   - [ ] Student names displayed
   - [ ] Reason for risk shown (e.g., "High plagiarism")
   - [ ] Risk score shown
   - [ ] Recommended action (optional)
   - [ ] Click student → View detailed report
5. **Example At-Risk Display:**
   ```
   John Smith - High Plagiarism (78%)
   Sarah Davis - High AI Content (82%)
   Mike Johnson - Declining Integrity (55% → 72%)
   ```
6. **Test Recommendations:**
   - Click "Intervention Suggested"
   - View teacher recommendations
   - Options to send messages/assign support

**Expected Result:** ✅ At-risk students identified with reasons

---

### 6.4 - Top Sources Card
**Duration:** 10 minutes

1. **View Analytics Section**
2. **Locate "Top Plagiarism Sources" Card**
3. **Verify Sources Listed:**
   - [ ] External sources (URLs)
   - [ ] Internal sources (student names)
   - [ ] Frequency count for each
   - [ ] Sorted by frequency (highest first)
4. **Example Display:**
   ```
   Top External Sources:
   1. Wikipedia (4 occurrences)
   2. Stack Overflow (3 occurrences)
   3. Medium.com (2 occurrences)
   
   Top Internal Sources:
   1. Alex Chen (3 matches)
   2. Sarah Lee (2 matches)
   ```
5. **Test Interactions:**
   - Click source → Filter submissions using that source
   - Count matches displayed
   - Pattern analysis visible
6. **Verify Data Accuracy:**
   - Count matches actual plagiarism reports
   - No double-counting

**Expected Result:** ✅ Sources listed accurately with frequencies

---

## PHASE 7: USER MANAGEMENT TESTS (ADMIN)

### 7.1 - View Users
**Duration:** 10 minutes

1. **Login as Admin** (`admin@eduverify.com`)
2. Navigate to "Users" section
3. **Verify User List:**
   - [ ] Table displays with columns:
     - Name
     - Email
     - Role (Admin, Teacher, Student)
     - Status (Active/Inactive)
     - Actions (Edit, Deactivate, Delete)
4. **Test Pagination:**
   - If >10 users: Next/Previous buttons visible
   - Click next → Load more users
   - Click previous → Go back
5. **Test Search/Filter:**
   - Search by name
   - Search by email
   - Filter by role
   - Filter by status
   - Verify results update
6. **Test Sorting:**
   - Click column headers to sort
   - Ascending/descending toggle
   - Verify order correct

**Example User List:**
```
Name             Email                  Role      Status
John Admin       admin@eduverify.com    ADMIN     Active
Jane Teacher     teacher@example.com    TEACHER   Active
Student1         student1@example.com   STUDENT   Active
Student2         student2@example.com   STUDENT   Active
Test Student     teststudent@example.   STUDENT   Active
```

**Expected Result:** ✅ User list displayed with all features

---

### 7.2 - Create User
**Duration:** 10 minutes

1. **Navigate to Users Management**
2. Click "Create User" or "Add User" button
3. **Verify Form Fields:**
   - [ ] Name input field
   - [ ] Email input field
   - [ ] Role dropdown (Admin, Teacher, Student)
   - [ ] Optional: Password field
   - [ ] Create button
4. **Test User Creation:**
   - Name: "New Test User"
   - Email: "newuser@example.com"
   - Role: "TEACHER"
   - Click "Create"
   - Expected: Success message
   - Expected: User appears in list
5. **Test Form Validation:**
   - Submit empty form → Required field errors
   - Enter invalid email → Validation error
   - Duplicate email → Error shown
6. **Verify New User:**
   - Can login with new email
   - Has correct role assigned
   - Status is Active by default

**Expected Result:** ✅ User creation with validation working

---

### 7.3 - Edit User
**Duration:** 10 minutes

1. **Find user in list**
2. Click "Edit" button next to user
3. **Verify Edit Form:**
   - [ ] Pre-filled with current data
   - [ ] Name field editable
   - [ ] Email field editable
   - [ ] Role dropdown changeable
   - [ ] Save button visible
4. **Test Edit Operations:**
   - Change name: "John Smith" → "John Smith Jr."
   - Click "Save"
   - Expected: Success message
   - Expected: User list shows new name
5. **Test Role Change:**
   - Change role: STUDENT → TEACHER
   - Click "Save"
   - Expected: Role updated
   - Expected: User now has teacher permissions
6. **Test Email Change:**
   - Change email to valid new email
   - Click "Save"
   - Expected: Email updated
   - Expected: Can login with new email
   - Expected: Old email no longer works

**Expected Result:** ✅ User edit functionality working

---

### 7.4 - Deactivate/Reactivate User
**Duration:** 10 minutes

1. **Select active user from list**
2. **Test Deactivation:**
   - Click "Deactivate" button
   - Expected: Confirmation dialog
   - Click "Confirm"
   - Expected: User status changes to "Inactive"
   - Expected: User badge shows "Inactive"
3. **Test Inactive User Behavior:**
   - Try to login as deactivated user
   - Expected: Login fails with message "Account inactive"
   - Expected: Cannot access any pages
   - Expected: Classes and submissions still exist
4. **Test Reactivation:**
   - Click "Activate" button next to inactive user
   - Expected: User status changes to "Active"
   - Expected: Can now login again
   - Expected: Full access restored
5. **Verify Permissions:**
   - After reactivation, verify role still correct
   - Verify can access classes again

**Expected Result:** ✅ User activation/deactivation working

---

### 7.5 - Delete User
**Duration:** 5 minutes

1. **Select user to delete** (test user account)
2. **Test Deletion:**
   - Click "Delete" button
   - Expected: Confirmation dialog
   - Click "Cancel" → Deletion canceled
   - Click "Delete" again, then "Confirm"
   - Expected: User removed from list
   - Expected: Success message shown
3. **Verify Deletion:**
   - Try to find user in list → Not there
   - Try to login as deleted user → Account not found
4. **Test Data Handling:**
   - Check if user's submissions still exist (cascade behavior)
   - Verify class enrollments handled
   - Check if associated data cleaned up

**Expected Result:** ✅ User deletion working with appropriate cleanup

---

## PHASE 8: NOTIFICATIONS & FEEDBACK TESTS

### 8.1 - Teacher Feedback on Submission
**Duration:** 10 minutes

1. **Login as Teacher** (`teacher@example.com`)
2. Navigate to submitted assignment
3. **Locate Feedback Section:**
   - Find "Teacher Feedback" or "Add Feedback" area
4. **Test Adding Feedback:**
   - Click "Add Feedback" button
   - Text input appears for feedback message
   - Enter feedback: "Great work! Your analysis is thorough. Consider citing more recent sources."
   - Click "Submit Feedback"
   - Expected: Feedback saved
   - Expected: Timestamp recorded
   - Expected: Feedback appears in timeline
5. **Verify Feedback Display:**
   - Teacher name shown
   - Feedback text visible
   - Timestamp visible
   - Edit/delete options (for teacher)
6. **Student Notification:**
   - Login as student
   - Navigate to assignment
   - Verify feedback visible
   - Expected notification: "New feedback on your submission"

**Expected Result:** ✅ Feedback system working

---

### 8.2 - Notifications Page
**Duration:** 10 minutes

1. **Login as any user**
2. Navigate to "Notifications" page
3. **Verify Notification Types:**
   - [ ] NEW_SUBMISSION: "New submission received"
   - [ ] REPORT_PUBLISHED: "Report is ready"
   - [ ] NEW_ASSIGNMENT: "New assignment created"
   - [ ] NEW_FEEDBACK: "Feedback on your submission"
   - [ ] ACHIEVEMENT_UNLOCKED: "Achievement unlocked"
4. **Test Notification Management:**
   - [ ] Unread notifications highlighted/bold
   - [ ] Click notification → Navigate to relevant page
   - [ ] Mark as read → Status changes
   - [ ] "Mark all as read" button works
5. **Verify Notification Content:**
   - Message text displayed
   - Timestamp shown (e.g., "2 hours ago")
   - Related object clear (assignment, class, etc.)
6. **Test Empty State:**
   - If no notifications: "No notifications" message shown
   - Keep checking as actions trigger new ones

**Example Notifications:**
```
🆕 [UNREAD] New submission from John Smith in "Physics 101"
📊 Your report for "Quantum Paper" has been published
📝 New feedback: "Great work! ..."
🏆 Achievement unlocked: "Integrity Ace!"
```

**Expected Result:** ✅ Notifications displaying and manageable

---

### 8.3 - Real-time Notification Triggers
**Duration:** 15 minutes

1. **Setup Multiple Browsers/Windows:**
   - Window 1: Logged in as TEACHER
   - Window 2: Logged in as STUDENT
2. **Test Notification Triggering:**
   - In Window 2 (Student): Submit an assignment
   - In Window 1 (Teacher): Check if notification appears
   - Expected: Teacher sees new submission notification
3. **Test Multiple Notifications:**
   - Student: Submit multiple assignments
   - Teacher: Notifications should appear for each
4. **Test Notification Clearing:**
   - Teacher: View the submissions
   - Notifications may auto-clear or need manual clearing
5. **Test Achievement Notifications:**
   - Student: Complete eligible actions
   - Expected: Achievement notification when unlocked
   - Expected: Appears immediately or near-immediately

**Expected Result:** ✅ Notifications triggering on events

---

## PHASE 9: ACHIEVEMENTS & GAMIFICATION TESTS

### 9.1 - Achievement Types
**Duration:** 20 minutes

1. **Review Achievement System:**
   - 9 different achievement types defined
   - Each has unique unlock conditions
2. **Test Each Achievement Type:**

**FIRST_SUBMISSION:**
- Action: Submit first assignment ever
- Expected: Achievement unlocks immediately
- Badge: 🎯 "First Submission"

**ON_TIME_SUBMISSION:**
- Action: Submit assignment before deadline
- Expected: Unlocks for each on-time submission
- Badge: ⏰ "On-Time Submission"

**INTEGRITY_ACE:**
- Action: Get < 20% plagiarism score
- Expected: Unlocks on qualified submission
- Badge: 🎖️ "Integrity Ace"

**STREAK_3:**
- Action: 3 on-time submissions in a row
- Expected: Unlocks after 3rd consecutive on-time
- Badge: 🔥 "Streak 3"

**STREAK_5:**
- Action: 5 on-time submissions in a row
- Expected: Unlocks after 5th consecutive on-time
- Badge: 🔥🔥 "Streak 5"

3. **Verify Achievement Progress:**
   - Student profile shows unlocked achievements
   - Progress shown for in-progress achievements
   - Achievement date visible

**Expected Result:** ✅ Achievements unlocking based on conditions

---

### 9.2 - Achievement Display
**Duration:** 10 minutes

1. **View Achievements on Student Profile**
2. **Verify Display Elements:**
   - [ ] Achievement badge/icon visible
   - [ ] Achievement name displayed
   - [ ] Achievement description shown
   - [ ] Unlock date/time shown (if unlocked)
   - [ ] Progress bar shown (if in progress)
3. **Test Achievement Cards:**
   - Hover over achievement → Tooltip shows details
   - Click achievement → Detail modal opens
4. **Test Achievement Modal:**
   - Modal shows full description
   - Requirements explained
   - Progress toward unlock visible
   - Close button functional
5. **Dashboard Display:**
   - Achievement count shown
   - Top achievements featured
   - Recent achievements highlighted

**Expected Result:** ✅ Achievements displayed with full details

---

### 9.3 - Achievement Notifications
**Duration:** 10 minutes

1. **Trigger Achievement Unlock**
   - Complete an action that unlocks achievement
   - Expected: Toast notification appears
   - Example: "🏆 Achievement Unlocked: Integrity Ace!"
2. **Verify Toast Display:**
   - [ ] Icon visible
   - [ ] Achievement name visible
   - [ ] Auto-dismisses after ~5 seconds
   - [ ] Manual dismiss button works
3. **Verify Notification Entry:**
   - Check notifications page
   - ACHIEVEMENT_UNLOCKED notification present
   - Notification shows achievement name
4. **Check Profile Update:**
   - Achievement appears in profile immediately
   - Count updated
   - Badge/Icon visible

**Expected Result:** ✅ Achievement notifications working

---

## PHASE 10: UI COMPONENTS TEST

### 10.1 - Card Component
**Duration:** 5 minutes

1. **Locate Cards on various pages:**
   - Dashboard cards (statistics)
   - Class cards in class list
   - Submission cards
   - Achievement cards
2. **Verify Card Appearance:**
   - [ ] Proper padding/spacing
   - [ ] Border radius applied
   - [ ] Shadow effect visible (if applicable)
   - [ ] Text readable
   - [ ] Icons aligned properly
3. **Test Card Interactions:**
   - Click card (if clickable) → Navigation works
   - Hover effect shows (if applicable)
   - Interactive elements within card work

**Expected Result:** ✅ Cards render and function correctly

---

### 10.2 - Table Component
**Duration:** 10 minutes

1. **View Tables:**
   - User management table
   - Submissions table
   - Reports table (if applicable)
2. **Verify Table Display:**
   - [ ] Column headers visible
   - [ ] Data rows display correctly
   - [ ] Alternating row colors (if applicable)
   - [ ] Proper alignment
   - [ ] Not too wide (scrollable if needed)
3. **Test Table Features:**
   - [ ] Pagination: Next/Previous buttons
   - [ ] Sort: Click headers to sort
   - [ ] Search/Filter: Results update
   - [ ] Row selection: Checkboxes work (if present)
4. **Test Responsive:**
   - On mobile: Table converts to card view or scrolls
   - On tablet: Optimized display
   - On desktop: Full table visible

**Expected Result:** ✅ Tables functional with features

---

### 10.3 - Modal Component
**Duration:** 10 minutes

1. **Open Various Modals:**
   - Report detail modal
   - Achievement detail modal
   - Confirmation modals
   - Feedback modal
2. **Verify Modal Display:**
   - [ ] Overlay covers background
   - [ ] Modal centered on screen
   - [ ] Title/header visible
   - [ ] Content readable
   - [ ] Close button (X) visible
   - [ ] Action buttons visible
3. **Test Modal Interactions:**
   - [ ] Click close (X) → Modal closes
   - [ ] Click outside modal → Closes (if applicable)
   - [ ] Press Escape → Closes (if applicable)
   - [ ] Click action button → Performs action
   - [ ] Click Cancel → Modal closes
4. **Test Mobile Modal:**
   - Modal fits in viewport
   - Scrollable if content tall
   - Close button accessible
   - Touch-friendly

**Expected Result:** ✅ Modals functional and accessible

---

### 10.4 - Charts (Recharts)
**Duration:** 10 minutes

1. **Locate Charts on pages:**
   - Plagiarism treemap
   - Statistics charts
   - Analytics charts
2. **Verify Chart Display:**
   - [ ] Chart renders without errors
   - [ ] Title visible
   - [ ] Legend displays
   - [ ] Data points visible
   - [ ] Colors appropriate
   - [ ] Labels readable
3. **Test Chart Interactions:**
   - Hover over data point → Tooltip appears
   - Shows value, label, percentage
   - Click on legend item → Filter/toggle (if applicable)
   - Responsive sizing on mobile
4. **Verify Data Accuracy:**
   - Data displayed matches source
   - Calculations correct
   - Updates when data changes
   - No rendering errors

**Expected Result:** ✅ Charts render and function correctly

---

### 10.5 - Toast Notifications
**Duration:** 10 minutes

1. **Trigger Toast Messages:**
   - Success: Submit form → "Changes saved"
   - Error: Invalid input → "Please fix errors"
   - Warning: Low integrity → "Low integrity detected"
   - Info: Achievement → "Achievement unlocked"
2. **Verify Toast Display:**
   - [ ] Colored appropriately (green/red/yellow/blue)
   - [ ] Icon matches type
   - [ ] Message text clear
   - [ ] Positioned on screen (usually top-right)
3. **Test Toast Behavior:**
   - [ ] Auto-dismisses after ~5 seconds
   - [ ] Manual close button works
   - [ ] Click toast → Action (if applicable)
   - [ ] Multiple toasts don't overlap
   - [ ] Stack properly if multiple
4. **Test Edge Cases:**
   - Long message → Wraps correctly
   - Multiple toasts → All visible
   - Mobile → Fits on screen
   - Rapid toasts → No duplication

**Expected Result:** ✅ Toasts display and dismiss correctly

---

### 10.6 - Form Components
**Duration:** 10 minutes

1. **Test Various Form Types:**
   - Login form
   - Signup form
   - Class creation form
   - Assignment creation form
   - Feedback form
2. **Verify Form Elements:**
   - [ ] Text inputs accept input
   - [ ] Email fields validate format
   - [ ] Password fields mask input
   - [ ] Date/time pickers functional
   - [ ] Dropdowns open and select
   - [ ] Checkboxes toggle
   - [ ] Radio buttons select
3. **Test Form Validation:**
   - [ ] Required fields show error when empty
   - [ ] Email format validated
   - [ ] Password strength checked (if applicable)
   - [ ] Duplicate email prevented
   - [ ] Error messages displayed clearly
   - [ ] Fields highlighted in red on error
4. **Test Form Submission:**
   - [ ] Submit button disabled while loading
   - [ ] Success shows toast message
   - [ ] Error shows validation messages
   - [ ] Form clears on success (or shows confirmation)
5. **Test on Mobile:**
   - Form fields large enough to tap
   - Keyboard appears appropriately
   - Form scrollable if tall
   - Submit button accessible

**Expected Result:** ✅ Forms fully functional with validation

---

## PHASE 11: PROFILE & SETTINGS TESTS

### 11.1 - Profile Page
**Duration:** 10 minutes

1. **Login as any user**
2. Navigate to Profile
3. **Verify Profile Display:**
   - [ ] User name displayed
   - [ ] User email displayed
   - [ ] User role displayed
   - [ ] Profile picture/avatar (if applicable)
   - [ ] Account created date (if shown)
4. **Test Edit Functionality:**
   - Click "Edit Profile" button
   - Edit form displays:
     - [ ] Name field (pre-filled)
     - [ ] Email field (pre-filled)
     - [ ] Other fields specific to role
   - Make changes: Name "John" → "John Smith"
   - Click "Save"
   - Expected: Success message
   - Expected: Profile updates immediately
   - Expected: Changes persist after refresh
5. **Test Email Change:**
   - Change email to new valid email
   - Submit
   - Expected: New email saved
   - Expected: Must login with new email
   - Expected: Old email no longer works (optional: verification required)
6. **Test Password Change (if applicable):**
   - Click "Change Password"
   - Old password required
   - New password entered twice
   - Submit
   - Expected: Password updated
   - Expected: Can login with new password

**Expected Result:** ✅ Profile page functional

---

## PHASE 12: INTEGRATION TESTS

### 12.1 - Supabase Integration
**Duration:** 15 minutes

**Note:** Requires Supabase to be properly configured

1. **Test User Operations:**
   - Create new user via signup
   - Check Supabase database → User exists
   - Login as that user
   - Edit user profile
   - Verify changes saved in database
   - Deactivate user
   - Verify status in database

2. **Test Class Operations:**
   - Create class as teacher
   - Check Supabase → Class record exists
   - Join class as student
   - Verify student added to class.student_ids
   - Edit class
   - Verify changes persisted

3. **Test Submission Operations:**
   - Submit assignment
   - Check Supabase → Submission record created
   - Verify file stored
   - Generate report
   - Check report saved in database
   - Verify report linked to submission

4. **Test Data Consistency:**
   - Data in app matches database
   - Updates reflect immediately
   - No data loss on page refresh
   - No orphaned records

**Expected Result:** ✅ Supabase integration working smoothly

---

### 12.2 - Gemini API Integration
**Duration:** 15 minutes

**Note:** Requires VITE_GEMINI_API_KEY configured

1. **Test API Connection:**
   - Submit an assignment
   - Wait for analysis
   - Expected: API call succeeds
   - Expected: Report generated in <1 minute
   - Check console for no errors
2. **Test Plagiarism Analysis:**
   - Submit content with known quote
   - Expected: Plagiarism score >0%
   - Expected: Quote detected in sources
   - Expected: Source identified
3. **Test AI Detection:**
   - Submit human-written content
   - Expected: AI score low (<30%)
   - Submit AI-like content
   - Expected: AI score higher (>50%)
4. **Test Error Handling:**
   - Check behavior if API fails
   - Expected: Graceful error message
   - Expected: User can retry
   - Expected: No crash
5. **Test Rate Limiting:**
   - Submit multiple requests
   - Expected: Handled appropriately
   - Expected: No "rate limit exceeded" errors

**Expected Result:** ✅ Gemini API integration working

---

### 12.3 - File Storage
**Duration:** 10 minutes

1. **Test File Upload:**
   - Submit file: test.txt
   - File stored in uploads folder
   - Verify file accessible
   - Download file → Matches original
2. **Test File Types:**
   - .txt files upload and process
   - .pdf files upload (if supported)
   - .docx files upload (if supported)
   - Unsupported types handled gracefully
3. **Test File Operations:**
   - View file preview (text files)
   - Download file
   - Delete file (if applicable)
   - Resubmit same file
4. **Test Large Files:**
   - Submit large file (if applicable)
   - Expected: Uploaded successfully or error shown
   - Expected: File size limit enforced
   - Expected: No timeout

**Expected Result:** ✅ File storage operational

---

## PHASE 13: PERFORMANCE & EDGE CASES

### 13.1 - Large Data Sets
**Duration:** 20 minutes

1. **Create Large Data Set:**
   - 50+ users
   - 10+ classes
   - 100+ submissions
   - 100+ reports
2. **Test Performance:**
   - User list loads without lag
   - Classes list responsive
   - Submissions list searchable/filterable
   - Charts render smoothly
   - Analytics calculate quickly
3. **Measure Load Times:**
   - Dashboard: <3 seconds
   - User list: <2 seconds
   - Class detail: <2 seconds
   - Analytics: <5 seconds
4. **Test Search/Filter:**
   - Search 1000 users by name → Responsive
   - Filter classes by teacher → Fast
   - Sort submissions table → Immediate
5. **Test UI Responsiveness:**
   - Scroll through long lists → Smooth
   - No freezing or stuttering
   - Buttons respond immediately

**Expected Result:** ✅ App handles large data efficiently

---

### 13.2 - Empty States
**Duration:** 10 minutes

1. **Fresh Account Tests:**
   - New student with no classes → "No classes" message
   - New teacher with no classes → "Create class" prompt
   - Student with no achievements → "Earn achievements" message
   - No notifications → "All caught up" message
2. **Verify Empty State UI:**
   - [ ] Clear message shown
   - [ ] Icon/image displayed
   - [ ] Call-to-action provided
   - [ ] Not confusing or blank
3. **Test Navigation from Empty States:**
   - Click "Create Class" → Form opens
   - Click "Join Class" → Join form opens
   - Click "View Assignments" → List loads
4. **No Data States:**
   - No assignments → "No assignments" shown
   - No submissions → "No submissions" shown
   - No reports → "No reports" shown

**Expected Result:** ✅ Empty states handled gracefully

---

### 13.3 - Error Handling
**Duration:** 15 minutes

1. **Network Errors:**
   - Disconnect internet
   - Try to submit assignment
   - Expected: Error message shown
   - Expected: Option to retry
   - Reconnect internet
   - Retry works
2. **API Errors:**
   - Gemini API down (simulate)
   - Try to generate report
   - Expected: "Analysis failed" message
   - Expected: Can retry
   - Expected: No crash
3. **Validation Errors:**
   - Invalid email format
   - Empty required fields
   - Duplicate entries
   - Expected: Clear error messages
   - Expected: Fields highlighted
   - Expected: Cannot submit
4. **Permission Errors:**
   - Student tries to delete class
   - Non-teacher tries to create assignment
   - Expected: "Permission denied" message
   - Expected: Action blocked
5. **Not Found Errors:**
   - Try to access deleted class
   - Try to view deleted submission
   - Expected: Redirect to safe page
   - Expected: Error message shown

**Expected Result:** ✅ Errors handled appropriately

---

### 13.4 - Concurrent Operations
**Duration:** 15 minutes

1. **Test Multiple Uploads:**
   - Open 2 browser windows (same user)
   - Window 1: Submit assignment
   - Window 2: Submit different assignment simultaneously
   - Expected: Both succeed
   - Expected: No conflicts
   - Expected: Both appear in list
2. **Test Simultaneous Edits:**
   - Window 1: Edit class name
   - Window 2: Edit class description
   - Both save
   - Expected: Latest data correct
   - Expected: No data loss
   - Expected: Refresh shows updates
3. **Test Multiple Logins:**
   - Login as student in Window 1
   - Login as teacher in Window 2
   - Logout from Window 1
   - Verify Window 2 still logged in
   - Window 1: Verify logged out
4. **Test Rapid Actions:**
   - Submit multiple assignments quickly
   - Create multiple classes rapidly
   - Expected: All succeed
   - Expected: Proper sequencing
   - Expected: No race conditions

**Expected Result:** ✅ Concurrent operations handled well

---

## PHASE 14: RESPONSIVE DESIGN

### 14.1 - Mobile Testing (320px - 480px)
**Duration:** 15 minutes

**Tool:** Use browser DevTools or actual mobile device

1. **Test All Pages on Mobile:**
   - [ ] Landing page readable
   - [ ] Login page usable
   - [ ] Dashboard fully accessible
   - [ ] Tables convert to card view
   - [ ] Navigation collapses to hamburger
   - [ ] Forms stack vertically
   - [ ] Charts resize appropriately
2. **Test Interactions:**
   - [ ] Buttons large enough (48x48px)
   - [ ] Touch targets adequate
   - [ ] No horizontal scroll needed
   - [ ] Modals fit screen
   - [ ] Text input accessible
   - [ ] Dropdowns work via touch
3. **Test Performance on Mobile:**
   - Pages load quickly
   - No excessive data usage
   - Smooth scrolling
   - Images optimized

**Expected Result:** ✅ Mobile experience smooth

---

### 14.2 - Tablet Testing (481px - 1024px)
**Duration:** 10 minutes

1. **Test Layout Optimization:**
   - [ ] Two-column layouts where appropriate
   - [ ] Sidebar visible or collapsible
   - [ ] Tables display well
   - [ ] Charts fit without scroll
2. **Test Orientation:**
   - [ ] Portrait orientation optimized
   - [ ] Landscape orientation optimized
   - [ ] Rotation doesn't break layout
3. **Test Touch Interactions:**
   - [ ] All buttons tappable
   - [ ] Dropdowns work
   - [ ] Modals usable
   - [ ] Forms functional

**Expected Result:** ✅ Tablet experience optimized

---

### 14.3 - Desktop Testing (1025px+)
**Duration:** 10 minutes

1. **Test Full Desktop Experience:**
   - [ ] Sidebar always visible
   - [ ] Multi-column layouts utilized
   - [ ] All features visible
   - [ ] Whitespace appropriate
   - [ ] Text readability optimal
2. **Test Wide Screens:**
   - [ ] Content doesn't stretch too wide
   - [ ] Max-width constraints applied
   - [ ] Centered appropriately
3. **Test Hover States:**
   - [ ] Buttons highlight on hover
   - [ ] Links underline on hover
   - [ ] Cards elevate on hover
   - [ ] Tooltips appear

**Expected Result:** ✅ Desktop experience fully optimized

---

## PHASE 15: ACCESSIBILITY

### 15.1 - Keyboard Navigation
**Duration:** 10 minutes

1. **Test Tab Navigation:**
   - [ ] Tab through all interactive elements
   - [ ] Logical tab order (left to right, top to bottom)
   - [ ] No skipped elements
   - [ ] Focus visible on all elements
2. **Test Keyboard Shortcuts:**
   - [ ] Enter activates buttons
   - [ ] Space toggles checkboxes
   - [ ] Arrow keys navigate dropdowns/menus
   - [ ] Escape closes modals
   - [ ] Shift+Tab reverse navigation
3. **Test No Keyboard Traps:**
   - [ ] Can tab out of all sections
   - [ ] Modals don't trap focus permanently
   - [ ] Can reach close button with keyboard
4. **Test Form Navigation:**
   - [ ] Tab through form fields
   - [ ] Submit with Enter key
   - [ ] Arrow keys in date picker
   - [ ] All inputs reachable

**Expected Result:** ✅ Full keyboard navigation working

---

### 15.2 - Screen Reader Compatibility
**Duration:** 15 minutes

**Tool:** Use VoiceOver (Mac) or NVDA (Windows)

1. **Test Label Association:**
   - [ ] Form labels connected to inputs
   - [ ] Screen reader announces labels
   - [ ] Placeholder not used as label
2. **Test ARIA Labels:**
   - [ ] Icon buttons have aria-label
   - [ ] Close buttons labeled
   - [ ] Interactive elements announced
3. **Test Content Structure:**
   - [ ] Headings properly hierarchical (h1, h2, h3)
   - [ ] Lists announced as lists
   - [ ] Tables have headers
4. **Test Navigation:**
   - [ ] Can navigate by headings
   - [ ] Can navigate by landmarks
   - [ ] Can navigate by links
   - [ ] Skip navigation links present
5. **Test Form Accessibility:**
   - [ ] Required fields announced
   - [ ] Error messages announced
   - [ ] Instructions provided
   - [ ] Form purpose clear

**Expected Result:** ✅ Screen reader compatible

---

### 15.3 - Color Contrast & Color-Blind Accessibility
**Duration:** 10 minutes

**Tool:** Use WCAG Contrast Checker or Chromatic Vision Simulator

1. **Test Text Contrast:**
   - [ ] Normal text: 4.5:1 ratio (WCAG AA)
   - [ ] Large text: 3:1 ratio
   - [ ] Links distinguishable
   - [ ] Buttons readable
   - [ ] Error messages visible
2. **Test Not Color-Only:**
   - [ ] Status not indicated by color alone
   - [ ] Icons accompany colors
   - [ ] Text labels provided
   - [ ] Patterns used if needed
3. **Test Color Palettes:**
   - [ ] Check accessibility with Deuteranopia (Red-Green)
   - [ ] Check with Protanopia
   - [ ] Check with Tritanopia (Blue-Yellow)
   - [ ] Still usable for color-blind users

**Expected Result:** ✅ Accessible color usage

---

## FINAL VERIFICATION CHECKLIST

### Critical Features (Must Work)
- [ ] User can login with valid email
- [ ] User can signup new account
- [ ] User redirected to correct dashboard by role
- [ ] Teacher can create class
- [ ] Student can join class with code
- [ ] Student can submit assignment
- [ ] Plagiarism report generates
- [ ] Report shows plagiarism score
- [ ] User can view achievements
- [ ] User can logout
- [ ] User can login again (persistence)

### Important Features (Should Work)
- [ ] Admin can manage users
- [ ] Teacher can manage class
- [ ] Teacher can provide feedback
- [ ] Student can view notifications
- [ ] Analytics displays correctly
- [ ] Charts render without errors
- [ ] Mobile responsive
- [ ] Forms validate inputs
- [ ] Errors handled gracefully
- [ ] Empty states display

### Nice-to-Have Features (Optional)
- [ ] Real-time notifications
- [ ] Achievement animations
- [ ] Advanced filtering/search
- [ ] Export functionality
- [ ] Dark mode (if available)
- [ ] Keyboard shortcuts
- [ ] Performance optimizations

---

## TEST EXECUTION WORKFLOW

### Daily Testing Routine (30 minutes)
1. Clear browser cache
2. Start dev server
3. Run critical path tests (Phase 1-2)
4. Document any failures
5. Create bug reports

### Comprehensive Testing (Full Day)
1. Complete Phases 1-11 (all features)
2. Test on multiple browsers
3. Test on mobile device
4. Document all results
5. Create final report

### Before Release
1. Complete all 15 phases
2. Test on 3+ browsers
3. Test on desktop, tablet, mobile
4. Performance profiling
5. Accessibility audit
6. Security check
7. Create release notes

---

## DOCUMENTATION TEMPLATE

### Test Case Template
```
Test ID: [Phase].[Feature].[Number]
Title: [Clear, concise title]
Precondition: [What must be true before test]
Steps:
1. [First action]
2. [Second action]
3. [Expected result]
Expected Result: [What should happen]
Actual Result: [What actually happened]
Status: [ ] PASS [ ] FAIL
Notes: [Any relevant information]
```

### Bug Report Template
```
Title: [Clear bug description]
Severity: [Critical/High/Medium/Low]
Steps to Reproduce:
1. [First step]
2. [Second step]
3. [Etc]
Expected: [What should happen]
Actual: [What actually happened]
Screenshots: [Include if possible]
Environment: [Browser, OS, etc]
```

---

## RESOURCES & REFERENCES

- **Gemini API Docs:** https://ai.google.dev/
- **Supabase Docs:** https://supabase.com/docs
- **React Router:** https://reactrouter.com/
- **Recharts:** https://recharts.org/
- **Tailwind CSS:** https://tailwindcss.com/
- **TypeScript:** https://www.typescriptlang.org/

---

## Sign-Off

**Testing Completed By:** [Your Name]
**Date:** [Date]
**Status:** [PASS/FAIL]
**Issues Found:** [Number]
**Blockers:** [None/List]

---

**Good luck with testing! 🚀**
