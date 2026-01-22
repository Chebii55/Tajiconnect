import type { ApiError } from '../services/api/types';

export const handleApiError = (error: ApiError): string => {
  switch (error.code) {
    case 'INSUFFICIENT_DATA':
      return 'Please complete more assessments for better recommendations';
    case 'ANALYSIS_FAILED':
      return 'Analysis temporarily unavailable, using default recommendations';
    case 'NETWORK_ERROR':
      return 'Connection issue. Please check your internet and try again';
    case 'UNAUTHORIZED':
      return 'Please log in to continue';
    case 'FORBIDDEN':
      return 'You do not have permission to access this resource';
    case 'NOT_FOUND':
      return 'The requested resource was not found';
    case 'VALIDATION_ERROR':
      return error.details?.message || 'Please check your input and try again';
    default:
      return error.message || 'Something went wrong, please try again';
  }
};

export const showErrorMessage = (error: ApiError) => {
  const message = handleApiError(error);
  // You can integrate with your toast/notification system here
  console.error('API Error:', message, error);
  return message;
};
