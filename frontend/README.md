# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## TajiConnect Frontend Plan - Task Assignment

### 1. Legal Pages - HAM
- Privacy Policy → `/privacy`
- Terms of Service → `/terms`
- Cookie Policy → `/cookies`

### 2. Authentication Routes - HAM
- Login → `/login`
- Register → `/register`
- Forgot Password → `/forgot-password`
- Reset Password → `/reset-password/:token`
- Email Verification → `/verify-email/:token`

### 3. Onboarding Flow - SHEILA
- Age Verification → `/onboarding/age-verify`
- Profile Setup → `/onboarding/profile-setup`
- Parental Consent → `/onboarding/parental-consent`
- Initial Assessment → `/onboarding/assessment`
- Psychometric Test → `/onboarding/psychometric`
- Roadmap Generation → `/onboarding/roadmap-generation`
- Welcome Page → `/onboarding/welcome`

### 4. Student Dashboard (Protected: role = student) - SHEILA
- Main Dashboard → `/student` or `/student/dashboard`
- Profile → `/student/profile`
- Settings → `/student/settings`

### 5. Learning & Roadmap - COSMAS
- Personalized Roadmap → `/student/roadmap`
- Roadmap Overview → `/student/roadmap/overview`
- Learning Path → `/student/roadmap/learning-path`
- Milestone Tracker → `/student/roadmap/milestones`

### 6. Courses & Learning - COSMAS
- Course Catalog → `/student/courses`
- My Courses → `/student/courses/my-courses`
- Course Search → `/student/courses/search`
- Recommendations → `/student/courses/recommendations`
- Course Detail → `/student/courses/:courseId`
- Course Player → `/student/courses/:courseId/play`
- Lesson Detail → `/student/courses/:courseId/lessons/:lessonId`

### 7. Assessments & Testing
- Assessment Center → `/student/assessments`
- Psychometric Dashboard → `/student/assessments/psychometric`
- Skills Assessment → `/student/assessments/skills`
- Personality Test → `/student/assessments/personality`
- Assessment Detail → `/student/assessments/:assessmentId`
- Take Assessment → `/student/assessments/:assessmentId/take`
- Results → `/student/assessments/:assessmentId/results`

### 8. Progress & Analytics
- Progress Dashboard → `/student/progress`
- Learning Analytics → `/student/progress/analytics`
- Performance Reports → `/student/progress/reports`
- Goal Tracking → `/student/progress/goals`
- Time Spent Analytics → `/student/progress/time-tracking`

### 9. Gamification & Rewards
- Achievements → `/student/achievements`
- Badges → `/student/achievements/badges`
- Rewards Tiers → `/student/achievements/tiers`
- Leaderboard → `/student/achievements/leaderboard`
- Points History → `/student/achievements/points`
- Challenges → `/student/achievements/challenges`

### 10. Career Guidance & Jobs - SHEILA
- Career Dashboard → `/student/career`
- Career Assessment → `/student/career/assessment`
- Career Pathways → `/student/career/pathways`
- Skills Gap Analysis → `/student/career/skills-gap`

### 11. Job Recommendations (NEW) - SHEILA
- Job Recommendations → `/student/jobs`
- Personalized Jobs → `/student/jobs/personalized`
- General Job Board → `/student/jobs/general`
- Industry Explorer → `/student/jobs/industry/:industryId`
- Job Matching Quiz → `/student/jobs/matching-quiz`
- Job Alerts → `/student/jobs/alerts`
- Salary Insights → `/student/jobs/salary-insights`
- Job Detail → `/student/jobs/:jobId`
- Job Application → `/student/jobs/:jobId/apply`
- Application Tracker → `/student/jobs/applications`

### 12. Certifications & Credentials
- Certificates → `/student/certificates`
- Digital Badges → `/student/certificates/digital-badges`
- Credential Wallet → `/student/certificates/wallet`
- Certificate Detail → `/student/certificates/:certificateId`

### 13. Communication & Support (Future Works)
- Messages Center → `/student/communication/messages`
- Tutor Chat → `/student/communication/tutor-chat`
- Peer Connections → `/student/communication/peers`
- Support Center → `/student/support`
- Help Desk → `/student/support/help`

### 14. Parent/Guardian Routes (Protected: role = parent)
- Parent Dashboard → `/parent` or `/parent/dashboard`
- Children Overview → `/parent/children`
- Child Detail → `/parent/children/:childId`
- Child Progress → `/parent/children/:childId/progress`
- Consent Management → `/parent/consent`
- Parent Messages → `/parent/messages`
- Safety Controls → `/parent/safety`
- Reports → `/parent/reports`
- Parent Settings → `/parent/settings`

### 15. Educator Routes (Protected: role = educator/admin)
- Educator Dashboard → `/educator` or `/educator/dashboard`
- Content Management → `/educator/content`
- Create Course → `/educator/courses/create`
- Edit Course → `/educator/courses/:courseId/edit`
- Student Management → `/educator/students`
- Educator Assessments → `/educator/assessments`
- Educator Analytics → `/educator/analytics`
- Resource Library → `/educator/resources`

### 16. Admin Routes (Protected: role = admin)
- Admin Dashboard → `/admin` or `/admin/dashboard`
- User Management → `/admin/users`
- Content Approval → `/admin/content/approval`
- System Analytics → `/admin/analytics`
- Platform Settings → `/admin/settings`
- Admin Reports → `/admin/reports`

### 17. Fallback Routes
- 404 Page → `/404`
- Redirect Unknown → `*` → `/404`
