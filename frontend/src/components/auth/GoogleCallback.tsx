import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { authService } from '../../services/api/auth';
import { onboardingService } from '../../services/api/onboarding';
import { getLoginRedirectPath } from '../../utils/auth';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [message, setMessage] = useState<string>('Completing Google sign-in...');

  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    if (error) {
      setStatus('error');
      setMessage(errorDescription || 'Google sign-in was cancelled.');
      return;
    }

    const code = searchParams.get('code');
    if (!code) {
      setStatus('error');
      setMessage('Missing Google authorization code.');
      return;
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;

    const completeLogin = async () => {
      try {
        const result = await authService.googleCallback(code, redirectUri);
        setStatus('success');
        setMessage('Google sign-in successful! Redirecting...');

        let redirectPath = getLoginRedirectPath(result.user);
        try {
          const onboardingStatus = await onboardingService.getStatus();
          if (!onboardingStatus.is_completed) {
            redirectPath = '/onboarding';
          }
        } catch {
          // Ignore onboarding fetch errors and use default redirect
        }

        setTimeout(() => {
          navigate(redirectPath);
        }, 1200);
      } catch (err) {
        console.error('Google login error:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
        setStatus('error');
        setMessage(errorMessage);
      }
    };

    completeLogin();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg font-['Inter'] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">
              {message}
            </p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-8 h-8 mx-auto text-green-600" />
            <p className="mt-4 text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">
              {message}
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-8 h-8 mx-auto text-red-600" />
            <p className="mt-4 text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
