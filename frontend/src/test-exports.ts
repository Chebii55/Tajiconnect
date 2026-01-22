// Test file to verify exports
import * as types from './services/api/types';

console.log('Available exports:', Object.keys(types));
console.log('Has ApiError:', 'ApiError' in types);
console.log('Has ContentRecommendation:', 'ContentRecommendation' in types);
console.log('Has PsychometricResponse:', 'PsychometricResponse' in types);

export {};
