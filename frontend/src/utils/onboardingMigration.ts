// Migration utility to handle transition from old onboarding flow to streamlined version
export const migrateOnboardingData = (oldData: any) => {
  return {
    firstName: oldData.firstName || '',
    lastName: oldData.lastName || '',
    email: oldData.email || '',
    phone: oldData.phone || '',
    dateOfBirth: oldData.dateOfBirth || '',
    gender: oldData.gender || '',
    age: oldData.age || 0,
    
    // Map old education structure to new format
    educationLevel: oldData.education?.level || oldData.educationLevel || '',
    interests: oldData.interests || oldData.education?.interests || [],
    hobbies: oldData.hobbies || oldData.education?.hobbies || [],
    talents: oldData.talents || oldData.education?.talents || [],
    
    // PWD information
    isPWD: oldData.isPWD || false,
    impairmentType: oldData.impairmentType || '',
    
    // Parent/Guardian info
    requiresParentInfo: oldData.requiresParentInfo || oldData.age < 18,
    parentGuardian: oldData.parentGuardian || {
      name: '',
      email: '',
      phone: '',
      relationship: ''
    },
    
    // Consents
    termsAccepted: oldData.termsAccepted || false,
    privacyAccepted: oldData.privacyAccepted || false,
    dataConsentAccepted: oldData.dataConsentAccepted || false,
    mediaConsentAccepted: oldData.mediaConsentAccepted || false,
    newsletterOptIn: oldData.newsletterOptIn || false,
    
    // Progress tracking
    currentStep: 1,
    completedSteps: [],
    isComplete: false
  };
};

// Check if user has incomplete onboarding data and needs migration
export const needsOnboardingMigration = () => {
  const oldData = sessionStorage.getItem('onboardingData');
  return oldData && !JSON.parse(oldData).isComplete;
};

// Clear old onboarding data after successful migration
export const clearOldOnboardingData = () => {
  sessionStorage.removeItem('onboardingData');
  localStorage.removeItem('onboardingProgress');
};
