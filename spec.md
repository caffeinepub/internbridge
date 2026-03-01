# Specification

## Summary
**Goal:** Build InternBridge, a fully responsive single-page React application that connects students and recruiters through a skill-based internship platform, with role-based dashboards, localStorage-only persistence, and state-based navigation.

**Planned changes:**
- Set up a global AuthContext persisting the current user (role: student | recruiter | admin) in localStorage under `internbridge_currentUser`; implement all navigation via useState (no router library); apply blue (#3B82F6) to indigo (#6366F1) gradient Tailwind theme throughout
- Build a responsive Navbar with Home, Login, Register links; hamburger menu on mobile; display logged-in user name/role and Logout button
- Build the Home page with a gradient hero section (tagline "Bridge the Gap Between Skills and Opportunities", CTA buttons: "Find Internships" and "Hire Talent") and a Features section with at least 4 benefit cards
- Build the Login page with two tabs: Student/Recruiter login (checks localStorage) and Admin login (hardcoded admin/admin); redirect to the appropriate dashboard on success with inline error messages
- Build the Register page with Student and Recruiter tabs, all specified fields including file-to-base64 for photo/resume; save to `internbridge_students` or `internbridge_recruiters` in localStorage; redirect to Login after submission
- Build the Student Dashboard (protected) with sidebar navigation (Profile, Skills, Documents, Skill Assessment, Search Internships, My Applications sections)
- Build the Recruiter Dashboard (protected) with sidebar navigation (Company Profile, Verification Status, Post Internship, My Internship Postings, View Applicants / Application Management sections)
- Build the Admin Dashboard (protected) with three tabs: Students, Recruiters, Documents — each with Verify/Reject/Request More Info actions persisted to localStorage
- Build the Search Internships page with real-time filtering; Apply button (students only) creates a record in `internbridge_applications`; duplicate prevention and toast confirmation
- Build the Assessment page with skill selector (Excel, SQL, Power BI, Python), 5 hardcoded MCQs per skill, score calculation, and result saved to the student's assessments array in localStorage
- Build the Applications page showing student applications with colored status badges, and recruiter application management view with status update controls
- Seed localStorage on first load with 2 sample students, 2 sample recruiters, 3 sample internships, and 2 sample applications
- Build reusable UI components: Badge, StatusPill, Toast (auto-dismiss, bottom-right), Confirmation Modal, and InternshipCard (responsive grid)
- Apply the full visual theme: gradient hero, #F9FAFB dashboard backgrounds, green/yellow/red for verified/pending/rejected states, clear typography hierarchy

**User-visible outcome:** Users can register as students or recruiters, log in to role-specific dashboards, post or search internships, apply with one click, take skill assessments, and manage verifications — all within a polished, mobile-responsive single-page app backed entirely by localStorage.
