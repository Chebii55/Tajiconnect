// Test script to verify onboarding database connection
const OnboardingIntegrationService = require('./services/onboardingIntegrationService');

async function testOnboardingFlow() {
  console.log('Testing onboarding database connection...');
  
  const service = new OnboardingIntegrationService();
  
  // Test data
  const testUserId = 'test-user-123';
  const testOnboardingData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '2000-01-01',
    age: 24,
    educationLevel: 'bachelor',
    interests: ['Technology', 'Business'],
    careerGoals: 'Become a software engineer',
    termsAccepted: true,
    privacyAccepted: true,
    isComplete: true
  };
  
  try {
    console.log('Processing onboarding data...');
    const result = await service.processOnboardingData(testUserId, testOnboardingData);
    
    console.log('✅ Onboarding processed successfully!');
    console.log('Career recommendations:', result.careerRecommendations?.length || 0);
    console.log('Generated roadmaps:', result.generatedRoadmaps?.length || 0);
    
    // Test status retrieval
    const status = service.getOnboardingStatus(testUserId);
    console.log('✅ Status retrieved:', status.completed ? 'Complete' : 'Incomplete');
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run test if called directly
if (require.main === module) {
  testOnboardingFlow()
    .then(success => {
      console.log(success ? '✅ All tests passed!' : '❌ Tests failed!');
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test error:', error);
      process.exit(1);
    });
}

module.exports = { testOnboardingFlow };
