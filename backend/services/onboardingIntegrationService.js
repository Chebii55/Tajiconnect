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

  // Process streamlined onboarding data
  async processOnboardingData(userId, onboardingData) {
    try {
      const db = this.loadDatabase();
      
      // Create user onboarding record
      const userOnboarding = {
        id: Date.now().toString(),
        userId: userId,
        ...onboardingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (!db.onboarding) db.onboarding = [];
      db.onboarding.push(userOnboarding);

      // Update user's onboarding status
      const user = db.users && db.users.find(u => u.id.toString() === userId.toString());
      if (user) {
        user.onboardingComplete = true;
        user.updatedAt = new Date().toISOString();
      }

      // Generate career assessment from onboarding data
      const assessmentAnswers = this.convertOnboardingToAssessment(onboardingData);
      const userProfile = this.extractUserProfile(userOnboarding);

      // Generate career recommendations
      const recommendations = await this.careerService.generateCareerRecommendations(
        { answers: assessmentAnswers, userId },
        userProfile
      );

      // Save assessment and generate roadmaps
      const result = await this.careerService.saveCareerAssessment(
        userId, 
        { answers: assessmentAnswers }, 
        recommendations
      );

      // Update user profile
      this.updateUserCareerPreferences(userId, recommendations, db);
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

  // Convert streamlined onboarding data to assessment format
  convertOnboardingToAssessment(onboardingData) {
    const answers = {};

    // Map education level to work environment preference
    if (onboardingData.educationLevel) {
      answers[1] = onboardingData.educationLevel.includes('bachelor') || onboardingData.educationLevel.includes('master') 
        ? 'Corporate office' : 'Remote/flexible';
    } else {
      answers[1] = 'Remote/flexible'; // Default for brief onboarding
    }

    // Map interests to career preferences
    if (onboardingData.interests && onboardingData.interests.length > 0) {
      // Map first interest to work style preference
      const firstInterest = onboardingData.interests[0].toLowerCase();
      if (firstInterest.includes('technology')) {
        answers[2] = 'Analytical and data-driven';
      } else if (firstInterest.includes('business')) {
        answers[2] = 'Strategic and goal-oriented';
      } else if (firstInterest.includes('healthcare')) {
        answers[2] = 'Helping others and making a difference';
      } else {
        answers[2] = 'Creative and innovative';
      }
    } else {
      answers[2] = 'Balanced approach'; // Default
    }

    // Set default values for missing assessment data
    answers[3] = 'Moderate challenge'; // Challenge preference
    answers[4] = 'Team collaboration'; // Work style
    answers[5] = 'Work-life balance'; // Priority

    return answers;
  }

  // Extract user profile from streamlined onboarding data
  extractUserProfile(onboardingData) {
    return {
      id: onboardingData.userId,
      age: onboardingData.age,
      education: {
        level: onboardingData.educationLevel || 'High school'
      },
      isPWD: onboardingData.isPWD || false,
      impairmentType: onboardingData.impairmentType,
      hobbies: onboardingData.hobbies || [],
      talents: onboardingData.talents || [],
      interests: onboardingData.interests || []
    };
  }

  // Update user's career preferences
  updateUserCareerPreferences(userId, recommendations, db) {
    const user = db.users && db.users.find(u => u.id.toString() === userId.toString());
    
    if (user) {
      if (!user.careerPreferences) {
        user.careerPreferences = {};
      }

      user.careerPreferences = {
        primaryCareer: recommendations.recommendations[0] && recommendations.recommendations[0].title,
        secondaryCareer: recommendations.recommendations[1] && recommendations.recommendations[1].title,
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
    const userOnboarding = db.onboarding && db.onboarding.find(o => o.userId.toString() === userId.toString());
    
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