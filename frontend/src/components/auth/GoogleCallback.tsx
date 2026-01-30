import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/api/auth';
import { onboardingService } from '../../services/api/onboarding';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing Google sign-in...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setStatus('error');
        setMessage('Google authentication was cancelled or failed');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        const response = await authService.handleGoogleCallback(code);

        setStatus('success');
        setMessage('Sign-in successful! Redirecting...');

        // Store user info for potential onboarding
        if (response.user) {
          localStorage.setItem('userId', response.user.id);
          localStorage.setItem('userEmail', response.user.email);
          localStorage.setItem('userName', `${response.user.first_name} ${response.user.last_name}`);
          localStorage.setItem('userFirstName', response.user.first_name);
          localStorage.setItem('userLastName', response.user.last_name);
        }

        // Determine redirect path
        let redirectPath = '/student/dashboard';

        // Check if new user needs onboarding
        if (response.is_new_user) {
          redirectPath = '/onboarding';
        } else {
          // Check onboarding status for existing users
          try {
            const onboardingStatus = await onboardingService.getStatus();
            if (!onboardingStatus.is_completed) {
              redirectPath = '/onboarding';
            }
          } catch {
            // If onboarding check fails, proceed to dashboard
          }
        }

        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1500);
      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg flex items-center justify-center">
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600 dark:text-gray-300">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-green-600 dark:text-green-400 font-medium">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400 mb-2">{message}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Redirecting to login...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
