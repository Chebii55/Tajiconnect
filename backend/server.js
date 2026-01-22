// Load environment variables
require('dotenv').config();

const jsonServer = require('json-server');
const express = require('express');
const CareerGenerationService = require('./services/careerGenerationService');
const OnboardingIntegrationService = require('./services/onboardingIntegrationService');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Initialize services
const careerService = new CareerGenerationService();
const onboardingService = new OnboardingIntegrationService();

// Custom middleware for CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Parse JSON bodies - use express middleware
server.use(express.json());

// Custom routes and middleware
server.use(middlewares);

// User registration
server.use('/api/auth/register', (req, res, next) => {
  if (req.method === 'POST') {
    try {
      console.log('Registration request received:', req.body);
      const { firstName, lastName, email, password, dateOfBirth, age, role, termsAccepted, newsletterOptIn, createdAt } = req.body;
      
      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
      
      const db = router.db.getState();
      const users = db.users || [];
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        password, // In production, hash this
        dateOfBirth,
        age,
        role: role || 'student',
        termsAccepted,
        newsletterOptIn,
        onboardingComplete: false,
        createdAt: createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to database
      if (!db.users) db.users = [];
      db.users.push(newUser);
      router.db.setState(db);
      
      console.log('User created successfully:', newUser.id);
      
      // Return success response
      res.json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        token: `mock-jwt-token-${newUser.id}`,
        message: 'Registration successful'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
    }
  } else {
    next();
  }
});

// Custom authentication middleware
server.use('/api/auth/login', (req, res, next) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    const db = router.db.getState();
    const users = db.users || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          onboardingComplete: user.onboardingComplete
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

// AI Career Assessment endpoint
server.use('/api/career/assess', (req, res, next) => {
  if (req.method === 'POST') {
    try {
      const { userId, answers, userProfile } = req.body;
      
      if (!userId || !answers) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: userId and answers'
        });
      }

      // Generate AI career recommendations
      const recommendations = careerService.generateCareerRecommendations(
        { answers, userId },
        userProfile
      );

      // Save assessment and roadmaps
      careerService.saveCareerAssessment(userId, { answers }, recommendations)
        .then(result => {
          res.json({
            success: true,
            data: {
              recommendations: recommendations.recommendations,
              analysis: recommendations.analysis,
              savedAssessment: result.assessment,
              generatedRoadmaps: result.roadmaps
            },
            message: 'Career assessment completed and roadmaps generated'
          });
        })
        .catch(error => {
          console.error('Error saving assessment:', error);
          res.status(500).json({
            success: false,
            message: 'Error saving assessment results'
          });
        });

    } catch (error) {
      console.error('Career assessment error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing career assessment'
      });
    }
  } else {
    next();
  }
});

// Get user roadmaps endpoint
server.use('/api/users/:userId/roadmaps', (req, res, next) => {
  if (req.method === 'GET') {
    try {
      const { userId } = req.params;
      const roadmaps = careerService.getUserRoadmaps(userId);
      
      res.json({
        success: true,
        data: roadmaps,
        message: 'Roadmaps retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user roadmaps'
      });
    }
  } else {
    next();
  }
});

// Update roadmap progress endpoint
server.use('/api/roadmaps/:roadmapId/progress', (req, res, next) => {
  if (req.method === 'PUT') {
    try {
      const { roadmapId } = req.params;
      const { phaseIndex, progress } = req.body;
      
      const updatedRoadmap = careerService.updateRoadmapProgress(roadmapId, phaseIndex, progress);
      
      if (updatedRoadmap) {
        res.json({
          success: true,
          data: updatedRoadmap,
          message: 'Roadmap progress updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Roadmap not found'
        });
      }
    } catch (error) {
      console.error('Error updating roadmap progress:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating roadmap progress'
      });
    }
  } else {
    next();
  }
});

// Onboarding integration endpoints
server.use('/api/onboarding/:userId/process', (req, res, next) => {
  if (req.method === 'POST') {
    try {
      const { userId } = req.params;
      const onboardingData = req.body;
      
      onboardingService.processOnboardingData(userId, onboardingData)
        .then(result => {
          res.json({
            success: true,
            data: result,
            message: 'Onboarding processed and career path generated successfully'
          });
        })
        .catch(error => {
          console.error('Error processing onboarding:', error);
          res.status(500).json({
            success: false,
            message: 'Error processing onboarding data'
          });
        });
    } catch (error) {
      console.error('Onboarding processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing onboarding'
      });
    }
  } else {
    next();
  }
});

// Complete onboarding endpoint
server.use('/api/onboarding/complete', (req, res, next) => {
  if (req.method === 'POST') {
    try {
      const { userId, ...onboardingData } = req.body;
      
      onboardingService.processOnboardingData(userId, onboardingData)
        .then(result => {
          res.json({
            success: true,
            data: result,
            message: 'Onboarding completed successfully'
          });
        })
        .catch(error => {
          console.error('Error completing onboarding:', error);
          res.status(500).json({
            success: false,
            message: 'Error completing onboarding'
          });
        });
    } catch (error) {
      console.error('Onboarding completion error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing onboarding completion'
      });
    }
  } else {
    next();
  }
});

// Get onboarding status
server.use('/api/onboarding/:userId/status', (req, res, next) => {
  if (req.method === 'GET') {
    try {
      const { userId } = req.params;
      const status = onboardingService.getOnboardingStatus(userId);
      
      res.json({
        success: true,
        data: status,
        message: 'Onboarding status retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving onboarding status'
      });
    }
  } else {
    next();
  }
});

// Get user profile
server.use('/api/users/:userId/profile', (req, res, next) => {
  if (req.method === 'GET') {
    try {
      const { userId } = req.params;
      const db = router.db.getState();
      const user = db.users?.find(u => u.id.toString() === userId.toString());
      
      if (user) {
        res.json({
          success: true,
          data: {
            educationLevel: user.educationLevel || '',
            interests: user.interests || [],
            hobbies: user.hobbies || [],
            talents: user.talents || [],
            phone: user.phone || '',
            gender: user.gender || ''
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { userId } = req.params;
      const profileData = req.body;
      const db = router.db.getState();
      const user = db.users?.find(u => u.id.toString() === userId.toString());
      
      if (user) {
        // Update user profile
        Object.assign(user, profileData, { updatedAt: new Date().toISOString() });
        router.db.setState(db);
        
        res.json({
          success: true,
          message: 'Profile updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  } else {
    next();
  }
});

// Streamlined onboarding completion
server.use('/api/onboarding/complete', (req, res, next) => {
  if (req.method === 'POST') {
    try {
      const onboardingData = req.body;
      const userId = onboardingData.userId || Date.now().toString(); // Generate ID if not provided
      
      onboardingService.processOnboardingData(userId, onboardingData)
        .then(result => {
          res.json({
            success: true,
            data: result,
            message: 'Onboarding completed successfully'
          });
        })
        .catch(error => {
          console.error('Onboarding completion error:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to complete onboarding',
            error: error.message
          });
        });
    } catch (error) {
      console.error('Onboarding completion error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete onboarding',
        error: error.message
      });
    }
  } else {
    next();
  }
});

// Complete onboarding
server.use('/api/onboarding/:userId/complete', (req, res, next) => {
  if (req.method === 'POST') {
    try {
      const { userId } = req.params;

      onboardingService.completeOnboarding(userId)
        .then(result => {
          res.json({
            success: true,
            data: result,
            message: 'Onboarding completed and career roadmaps generated successfully'
          });
        })
        .catch(error => {
          console.error('Error completing onboarding:', error);
          res.status(500).json({
            success: false,
            message: 'Error completing onboarding'
          });
        });
    } catch (error) {
      console.error('Onboarding completion error:', error);
      res.status(500).json({
        success: false,
        message: 'Error completing onboarding'
      });
    }
  } else {
    next();
  }
});

// Save comprehensive onboarding profile data
server.use('/api/onboarding/profile', (req, res, next) => {
  if (req.method === 'POST') {
    try {
      const onboardingData = req.body;
      const { userId } = onboardingData;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Validate required fields based on TFDN requirements
      const requiredFields = ['firstName', 'lastName', 'email', 'termsAccepted', 'privacyAccepted', 'dataConsentAccepted'];
      const missingFields = requiredFields.filter(field => !onboardingData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Check if PWD and require impairment type
      if (onboardingData.isPWD && !onboardingData.impairmentType) {
        return res.status(400).json({
          success: false,
          message: 'Impairment type is required for PWD users'
        });
      }

      // Check if parent/guardian info required (age < 18 or PWD)
      if (onboardingData.requiresParentInfo) {
        const parentFields = ['parentGuardian.name', 'parentGuardian.email', 'parentGuardian.phone'];
        const missingParentFields = parentFields.filter(field => {
          const keys = field.split('.');
          return !onboardingData[keys[0]] || !onboardingData[keys[0]][keys[1]];
        });

        if (missingParentFields.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Parent/Guardian information is required for users under 18 or PWD users'
          });
        }
      }

      // Check if onboarding record already exists
      const existingOnboarding = router.db.get('onboarding')
        .find({ userId: parseInt(userId) })
        .value();

      const timestamp = new Date().toISOString();

      if (existingOnboarding) {
        // Update existing record
        router.db.get('onboarding')
          .find({ userId: parseInt(userId) })
          .assign({
            ...onboardingData,
            userId: parseInt(userId),
            updatedAt: timestamp
          })
          .write();

        res.json({
          success: true,
          data: onboardingData,
          message: 'Onboarding profile updated successfully'
        });
      } else {
        // Create new record
        const newOnboarding = {
          id: Date.now().toString(),
          ...onboardingData,
          userId: parseInt(userId),
          createdAt: timestamp,
          updatedAt: timestamp
        };

        router.db.get('onboarding')
          .push(newOnboarding)
          .write();

        res.json({
          success: true,
          data: newOnboarding,
          message: 'Onboarding profile created successfully'
        });
      }
    } catch (error) {
      console.error('Error saving onboarding profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error saving onboarding profile'
      });
    }
  } else {
    next();
  }
});

// Get onboarding profile data
server.use('/api/onboarding/profile/:userId', (req, res, next) => {
  if (req.method === 'GET') {
    try {
      const { userId } = req.params;

      const onboarding = router.db.get('onboarding')
        .find({ userId: parseInt(userId) })
        .value();

      if (onboarding) {
        res.json({
          success: true,
          data: onboarding,
          message: 'Onboarding profile retrieved successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Onboarding profile not found'
        });
      }
    } catch (error) {
      console.error('Error retrieving onboarding profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving onboarding profile'
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
  console.log(`   - POST /api/career/assess (AI Career Assessment)`);
  console.log(`   - GET /api/users/:id/roadmaps`);
  console.log(`   - PUT /api/roadmaps/:id/progress`);
  console.log(`   - POST /api/onboarding/:id/process (Process Onboarding)`);
  console.log(`   - GET /api/onboarding/:id/status (Onboarding Status)`);
  console.log(`   - POST /api/onboarding/:id/complete (Complete Onboarding)`);
  console.log(`   - POST /api/onboarding/profile (Save Onboarding Profile)`);
  console.log(`   - GET /api/onboarding/profile/:userId (Get Onboarding Profile)`);
  console.log(`   - GET /api/users/:id/skills-gap/:careerPathId`);
});