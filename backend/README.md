# Career Platform Mock Backend

This is a JSON Server-based mock backend for the career platform application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001`

## Available Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/:id/assessments` - Get user assessments
- `GET /api/users/:id/progress` - Get user progress
- `GET /api/users/:id/achievements` - Get user achievements
- `GET /api/users/:id/notifications` - Get user notifications
- `GET /api/users/:id/applications` - Get user job applications
- `GET /api/users/:id/certifications` - Get user certifications

### Career Paths
- `GET /api/career-paths` - Get all career paths
- `GET /api/career-paths/:id` - Get career path by ID

### Skills Gap Analysis
- `GET /api/users/:userId/skills-gap/:careerPathId` - Get skills gap analysis

### Assessments
- `GET /api/assessments` - Get all assessments
- `POST /api/assessments` - Create new assessment
- `PUT /api/assessments/:id` - Update assessment

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/recommended` - Get recommended courses

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/recommended` - Get recommended jobs
- `POST /api/applications` - Apply for a job

### Achievements & Progress
- `GET /api/achievements` - Get all achievements
- `GET /api/progress` - Get all progress records
- `POST /api/progress` - Update progress

### Certifications
- `GET /api/certifications` - Get all available certifications
- `GET /api/user-certifications` - Get user certifications

## Sample API Calls

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "password": "password123"}'
```

### Get Career Paths
```bash
curl http://localhost:3001/api/career-paths
```

### Get Skills Gap Analysis
```bash
curl http://localhost:3001/api/users/1/skills-gap/1
```

## Development Mode

For development with artificial delays (to simulate real API latency):
```bash
npm run dev
```

## Data Structure

The mock data includes:
- **Users**: Student and trainer profiles with preferences
- **Career Paths**: Different career tracks with skills and requirements
- **Assessments**: Career and skill assessments with results
- **Skills Gap**: Analysis of current vs required skills
- **Courses**: Learning content with modules and progress tracking
- **Jobs**: Job listings with matching scores
- **Applications**: Job application tracking
- **Achievements**: Gamification elements
- **Notifications**: User notifications and alerts
- **Progress**: Learning and career progress tracking
- **Certifications**: Available certifications and user progress

## CORS

The server is configured to allow cross-origin requests from any domain for development purposes.