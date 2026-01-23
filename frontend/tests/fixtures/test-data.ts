// Test data fixtures for Playwright tests

export const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
  dateOfBirth: '1995-01-15',
};

export const newUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'NewPassword123!',
  firstName: 'New',
  lastName: 'TestUser',
  dateOfBirth: '1998-06-20',
};

export const testCourse = {
  title: 'Introduction to Web Development',
  description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
  category: 'Technology',
  level: 'beginner',
  price: 49.99,
  duration: '8 weeks',
};

export const testLesson = {
  title: 'Getting Started with HTML',
  description: 'Learn the basics of HTML structure and tags.',
  content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages.',
  duration: 30,
  order: 1,
};

export const testAssessment = {
  title: 'HTML Basics Quiz',
  description: 'Test your knowledge of HTML fundamentals',
  questions: [
    {
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Home Tool Markup Language',
        'Hyperlinks and Text Markup Language',
      ],
      correctAnswer: 0,
    },
    {
      question: 'Which tag is used for the largest heading?',
      options: ['<h6>', '<heading>', '<h1>', '<head>'],
      correctAnswer: 2,
    },
  ],
};

export const API_ENDPOINTS = {
  gateway: 'http://localhost:8000',
  userService: 'http://localhost:8001',
  courseService: 'http://localhost:8002',
  contentService: 'http://localhost:8003',
  notificationService: 'http://localhost:8004',
  aiService: 'http://localhost:8005',
  analyticsService: 'http://localhost:8006',
  paymentService: 'http://localhost:8007',
};
