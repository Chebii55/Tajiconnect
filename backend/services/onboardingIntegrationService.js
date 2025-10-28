const CareerGenerationService = require('./careerGenerationService');
const fs = require('fs');
const path = require('path');

class OnboardingIntegrationService {
  constructor() {
    this.careerService = new CareerGenerationService();
    this.dbPath = path.join(__dirname, '../db.json');
  }

  loadDatabase() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading database:', error);
      return {};
    }
  }

  saveToDatabase(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving to database:', error);
      return false;
    }
  }

  // Process onboarding data and generate career recommendations
  async processOnboardingData(userId, onboardingData) {
    try {
      const db = this.loadDatabase();
      
      // Find or create user onboarding record
      let userOnboarding = db.onboarding?.find(o => o.userId.toString() === userId.toString());
      
      if (!userOnboarding) {
        userOnboarding = {
          id: Date.now().toString(),
          userId: userId,
          ...onboardingData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        if (!db.onboarding) db.onboarding = [];
        db.onboarding.push(userOnboarding);
      } else {
        // Update existing record
        Object.assign(userOnboarding, onboardingData);
        userOnboarding.updatedAt = new Date().toISOString();
      }

      // Generate career assessment based on onboarding data
      const assessmentAnswers = this.convertOnboardingToAssessment(onboardingData);
      const userProfile = this.extractUserProfile(userOnboarding);

      // Generate AI career recommendations
      const recommendations = this.careerService.generateCareerRecommendations(
        { answers: assessmentAnswers, userId },
        userProfile
      );

      // Save assessment and roadmaps
      const result = await this.careerService.saveCareerAssessment(
        userId, 
        { answers: assessmentAnswers }, 
        recommendations
      );

      // Update user profile with career preferences
      this.updateUserCareerPreferences(userId, recommendations, db);

      // Save database
      this.saveToDatabase(db);

      return {
        success: true,
        onboardingComplete: true,
        careerRecommendations: recommendations.recommendations,
        generatedRoadmaps: result.roadmaps,
        userProfile: userProfile
      };

    } catch (error) {
      console.error('Error processing onboarding data:', error);
      throw error;
    }
  }

  // Convert onboarding data to assessment format
  convertOnboardingToAssessment(onboardingData) {
    const answers = {};

    // Map education level to work environment preference
    if (onboardingData.education?.level) {
      if (onboardingData.education.level.includes('Bachelor') || onboardingData.education.level.includes('Master')) {
        answers[1] = 'Corporate office'; // Higher education -> corporate preference
      } else {
        answers[1] = 'Remote/flexible'; // Flexible for others
      }
    }

    // Map hobbies to interests
    if (onboardingData.education?.hobbies) {
      const techHobbies = ['Programming', 'Gaming', 'Electronics', 'Computers'];
      const creativeHobbies = ['Painting', 'Drawing', 'Music', 'Writing', 'Photography'];
      const socialHobbies = ['Sports', 'Volunteering', 'Teaching', 'Mentoring'];

      const interests = [];
      onboardingData.education.hobbies.forEach(hobby => {
        if (techHobbies.some(tech => hobby.toLowerCase().includes(tech.toLowerCase()))) {
          interests.push('Problem solving', 'Data analysis');
        } else if (creativeHobbies.some(creative => hobby.toLowerCase().includes(creative.toLowerCase()))) {
          interests.push('Creative design');
        } else if (socialHobbies.some(social => hobby.toLowerCase().includes(social.toLowerCase()))) {
          interests.push('Teaching others', 'Helping people');
        }
      });

      if (interests.length > 0) {
        answers[3] = [...new Set(interests)]; // Remove duplicates
      }
    }

    // Map talents to skills
    if (onboardingData.education?.talents) {
      const skillMapping = {
        'Public Speaking': 'Communication',
        'Leadership': 'Leadership',
        'Writing': 'Communication',
        'Mathematics': 'Data analysis',
        'Technology': 'Programming'
      };

      const skills = [];
      onboardingData.education.talents.forEach(talent => {
        Object.keys(skillMapping).forEach(key => {
          if (talent.toLowerCase().includes(key.toLowerCase())) {
            skills.push(skillMapping[key]);
          }
        });
      });

      if (skills.length > 0) {
        answers[5] = [...new Set(skills)];
      }
    }

    // Set default values for missing answers
    if (!answers[2]) answers[2] = 4; // Technology interest (scale 1-5)
    if (!answers[4]) answers[4] = 3; // Communication skills (scale 1-5)
    if (!answers[6]) answers[6] = 3; // Public speaking comfort (scale 1-5)
    if (!answers[7]) answers[7] = 'Career growth'; // Career importance
    if (!answers[8]) answers[8] = 3; // Salary importance (scale 1-5)
    if (!answers[9]) answers[9] = 'Mix of both'; // Work preference
    if (!answers[10]) answers[10] = 3; // Stress handling (scale 1-5)

    return answers;
  }

  // Extract user profile from onboarding data
  extractUserProfile(onboardingData) {
    return {
      id: onboardingData.userId,
      age: onboardingData.age,
      education: {
        level: onboardingData.education?.level || 'High school'
      },
      isPWD: onboardingData.isPWD || false,
      impairmentType: onboardingData.impairmentType,
      hobbies: onboardingData.education?.hobbies || [],
      talents: onboardingData.education?.talents || []
    };
  }

  // Update user's career preferences
  updateUserCareerPreferences(userId, recommendations, db) {
    const user = db.users?.find(u => u.id.toString() === userId.toString());
    
    if (user) {
      if (!user.careerPreferences) {
        user.careerPreferences = {};
      }

      user.careerPreferences = {
        primaryCareer: recommendations.recommendations[0]?.title,
        secondaryCareer: recommendations.recommendations[1]?.title,
        interests: recommendations.analysis.interests.map(i => i.interest),
        skillLevels: recommendations.analysis.skills,
        lastUpdated: new Date().toISOString()
      };

      user.updatedAt = new Date().toISOString();
    }
  }

  // Get user's onboarding status
  getOnboardingStatus(userId) {
    const db = this.loadDatabase();
    const userOnboarding = db.onboarding?.find(o => o.userId.toString() === userId.toString());
    
    if (!userOnboarding) {
      return {
        completed: false,
        currentStep: 'age-verification',
        progress: 0
      };
    }

    // Calculate progress based on completed fields
    const requiredFields = ['age', 'education', 'consent'];
    const completedFields = requiredFields.filter(field => userOnboarding[field]);
    const progress = Math.round((completedFields.length / requiredFields.length) * 100);

    return {
      completed: progress === 100,
      currentStep: this.getNextStep(userOnboarding),
      progress: progress,
      data: userOnboarding
    };
  }

  // Determine next onboarding step
  getNextStep(onboardingData) {
    if (!onboardingData.age) return 'age-verification';
    if (!onboardingData.parentGuardianDetails && onboardingData.age < 18) return 'parental-consent';
    if (!onboardingData.education) return 'profile-setup';
    if (!onboardingData.consent) return 'consent';
    if (!onboardingData.termsAccepted) return 'terms';
    return 'complete';
  }

  // Complete onboarding and generate career path
  async completeOnboarding(userId) {
    try {
      const db = this.loadDatabase();
      const userOnboarding = db.onboarding?.find(o => o.userId.toString() === userId.toString());
      
      if (!userOnboarding) {
        throw new Error('Onboarding data not found');
      }

      // Process the complete onboarding data
      const result = await this.processOnboardingData(userId, userOnboarding);

      // Mark onboarding as complete
      userOnboarding.completed = true;
      userOnboarding.completedAt = new Date().toISOString();
      
      this.saveToDatabase(db);

      return result;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }
}

module.exports = OnboardingIntegrationService;