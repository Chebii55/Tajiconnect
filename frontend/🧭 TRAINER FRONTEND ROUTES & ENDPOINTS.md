## **🧭 TRAINER FRONTEND ROUTES & ENDPOINTS**

### **🔐 Authentication & Access**

| Page | Path | Description |
| ----- | ----- | ----- |
| Trainer Login | `/trainer/login` | Dedicated login page for trainers |
| Trainer Logout | `/trainer/logout` | Ends trainer session and clears local storage |
| Trainer Register (optional) | `/trainer/register` | For onboarding new trainers (optional future) |

---

### **🏠 Trainer Dashboard**

| Page | Path | Description |
| ----- | ----- | ----- |
| Dashboard Home | `/trainer/dashboard` | Trainer overview: summary cards, notifications, and recent activity |
| Dashboard Analytics Snapshot | `/trainer/dashboard/analytics` | Quick performance insights at a glance |

---

### **📚 Course Management**

| Page | Path | Description |
| ----- | ----- | ----- |
| All Courses | `/trainer/courses` | View list of all trainer-created courses |
| Create Course | `/trainer/courses/create` | Form for creating a new course |
| Edit Course | `/trainer/courses/:courseId/edit` | Edit course details, modules, and lessons |
| View Course | `/trainer/courses/:courseId` | View course content and performance |
| Module Editor | `/trainer/courses/:courseId/modules/:moduleId/edit` | Edit a specific module |
| Lesson Editor | `/trainer/courses/:courseId/lessons/:lessonId/edit` | Edit or upload lesson materials |
| Course Preview | `/trainer/courses/:courseId/preview` | Preview course as learners see it |

---

### **🎓 Learner Management**

| Page | Path | Description |
| ----- | ----- | ----- |
| Learners Overview | `/trainer/learners` | View all learners enrolled in trainer’s courses |
| Learner Details | `/trainer/learners/:learnerId` | View learner profile, progress, and assessments |
| Learner Progress | `/trainer/learners/:learnerId/progress` | Detailed analytics of learner’s journey |
| Course Learners | `/trainer/courses/:courseId/learners` | List of learners per course |

---

### **📊 Trainer Analytics**

| Page | Path | Description |
| ----- | ----- | ----- |
| Analytics Dashboard | `/trainer/analytics` | Full analytics overview |
| Course Performance | `/trainer/analytics/courses` | Compare course-level performance |
| Learner Engagement | `/trainer/analytics/engagement` | Engagement charts and participation data |
| Assessment Statistics | `/trainer/analytics/assessments` | Evaluation of assessment results per course |
| Feedback & Ratings | `/trainer/analytics/feedback` | Aggregate learner feedback and ratings |

---

### **💬 Communication & Messaging**

| Page | Path | Description |
| ----- | ----- | ----- |
| Messages Inbox | `/trainer/messages` | Central communication hub |
| Chat View | `/trainer/messages/:conversationId` | Direct message thread with a learner |
| Announcements | `/trainer/messages/announcements` | Send bulk course updates or notifications |

---

### **⚙️ Trainer Settings & Profile**

| Page | Path | Description |
| ----- | ----- | ----- |
| Trainer Profile | `/trainer/profile` | View and edit personal trainer information |
| Edit Profile | `/trainer/profile/edit` | Update bio, expertise, and contact info |
| Account Settings | `/trainer/settings` | Manage account preferences and password |
| Notification Preferences | `/trainer/settings/notifications` | Customize system and email notifications |
| Theme & UI Settings | `/trainer/settings/display` | Toggle dark/light mode and layout options |

---

### **🧾 Administrative & Miscellaneous (Future-Ready)**

| Page | Path | Description |
| ----- | ----- | ----- |
| Earnings (Optional Future) | `/trainer/earnings` | View earnings, payouts, and invoices |
| Certificates Management | `/trainer/certificates` | Issue or view certificates for learners |
| Resources Library | `/trainer/resources` | Access teaching guides and media uploads |
| Support | `/trainer/support` | Contact support or raise a help ticket |
| FAQs | `/trainer/help` | Common trainer support questions |

---

### **🔒 Route Structure Example (React Router)**

Here’s how the trainer routes can be defined in React Router DOM:

`<Routes>`  
  `<Route path="/trainer/login" element={<TrainerLogin />} />`  
  `<Route path="/trainer" element={<TrainerLayout />}>`  
    `<Route path="dashboard" element={<TrainerDashboard />} />`  
    `<Route path="courses" element={<CourseManagement />} />`  
    `<Route path="courses/create" element={<CreateCourse />} />`  
    `<Route path="courses/:courseId" element={<CourseView />} />`  
    `<Route path="courses/:courseId/edit" element={<EditCourse />} />`  
    `<Route path="learners" element={<LearnerProgress />} />`  
    `<Route path="learners/:learnerId" element={<LearnerDetail />} />`  
    `<Route path="analytics" element={<TrainerAnalytics />} />`  
    `<Route path="messages" element={<TrainerMessages />} />`  
    `<Route path="settings" element={<TrainerSettings />} />`  
    `<Route path="profile" element={<TrainerProfile />} />`  
  `</Route>`  
`</Routes>`

---

### **🗂 Folder Structure Suggestion**

`src/`  
 `└── pages/`  
      `└── trainer/`  
          `├── Dashboard/`  
          `├── Courses/`  
          `├── Learners/`  
          `├── Analytics/`  
          `├── Messages/`  
          `├── Settings/`  
          `├── Profile/`  
          `├── Earnings/ (future)`  
          `├── Support/`  
          `└── index.tsx`

