const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Custom middleware for CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Custom routes and middleware
server.use(middlewares);

// Custom authentication middleware
server.use('/api/auth/login', (req, res, next) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    // Simple mock authentication
    const users = router.db.get('users').value();
    const user = users.find(u => u.email === email);
    
    if (user) {
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: `mock-jwt-token-${user.id}`,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } else {
    next();
  }
});

// Custom registration endpoint
server.use('/api/auth/register', (req, res, next) => {
  if (req.method === 'POST') {
    const { email, name, password, role = 'student' } = req.body;
    
    const users = router.db.get('users').value();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    } else {
      const newUser = {
        id: users.length + 1,
        email,
        name,
        role,
        profile: {
          avatar: 'https://via.placeholder.com/150',
          bio: '',
          location: '',
          phone: ''
        },
        preferences: {
          notifications: true,
          emailUpdates: true,
          theme: 'light'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      router.db.get('users').push(newUser).write();
      
      res.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        token: `mock-jwt-token-${newUser.id}`,
        message: 'Registration successful'
      });
    }
  } else {
    next();
  }
});

// Custom skills gap analysis endpoint
server.use('/api/users/:userId/skills-gap/:careerPathId', (req, res, next) => {
  if (req.method === 'GET') {
    const { userId, careerPathId } = req.params;
    
    // Mock skills gap analysis
    const mockGap = {
      id: Date.now(),
      userId: parseInt(userId),
      careerPathId: parseInt(careerPathId),
      currentSkills: [
        { name: "HTML", level: 80 },
        { name: "CSS", level: 70 },
        { name: "JavaScript", level: 60 }
      ],
      requiredSkills: [
        { name: "HTML", level: 90 },
        { name: "CSS", level: 85 },
        { name: "JavaScript", level: 90 },
        { name: "React", level: 80 },
        { name: "TypeScript", level: 70 }
      ],
      gaps: [
        { skill: "JavaScript", currentLevel: 60, requiredLevel: 90, gap: 30 },
        { skill: "React", currentLevel: 0, requiredLevel: 80, gap: 80 },
        { skill: "TypeScript", currentLevel: 0, requiredLevel: 70, gap: 70 }
      ],
      recommendations: [
        {
          skill: "JavaScript",
          courses: ["Advanced JavaScript Concepts"],
          estimatedTime: "4 weeks"
        },
        {
          skill: "React",
          courses: ["React Fundamentals"],
          estimatedTime: "6 weeks"
        }
      ],
      updatedAt: new Date().toISOString()
    };
    
    res.json(mockGap);
  } else {
    next();
  }
});

// Use the router with /api prefix
server.use('/api', router);

// Fallback for direct access without /api prefix
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server is running on port ${PORT}`);
  console.log(`📊 Database: http://localhost:${PORT}/db`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📚 Available endpoints:`);
  console.log(`   - GET /api/users`);
  console.log(`   - GET /api/career-paths`);
  console.log(`   - GET /api/assessments`);
  console.log(`   - GET /api/courses`);
  console.log(`   - GET /api/jobs`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - GET /api/users/:id/skills-gap/:careerPathId`);
});