import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { loginUser, getLoginRedirectPath } from '../../utils/auth';
import { onboardingService } from '../../services/api/onboarding';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Secret keyboard shortcut to access trainer portal (Ctrl+Shift+T pressed 3 times)
  useEffect(() => {
    let keyPressCount = 0;
    let resetTimer: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        keyPressCount++;

        if (keyPressCount >= 3) {
          navigate('/trainer/login');
          keyPressCount = 0;
        } else {
          // Reset count after 2 seconds if not pressed 3 times
          clearTimeout(resetTimer);
          resetTimer = setTimeout(() => {
            keyPressCount = 0;
          }, 2000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(resetTimer);
    };
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setNotification({
        type: 'error',
        message: 'Please correct the errors below'
      });
      return;
    }

    setIsLoading(true);
    setNotification(null);

    try {
      // Use the auth service to login
      const result = await loginUser(formData.email, formData.password);

      setNotification({
        type: 'success',
        message: 'Login successful! Redirecting...'
      });

      // Check onboarding status from API
      let redirectPath = getLoginRedirectPath(result.user);

      try {
        const onboardingStatus = await onboardingService.getStatus();
        if (!onboardingStatus.is_completed) {
          redirectPath = '/onboarding';
        }
      } catch {
        // If onboarding check fails, redirect to default path
      }

      setTimeout(() => {
        navigate(redirectPath);
      }, 1500);
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';

      if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        setNotification({
          type: 'error',
          message: 'Request timed out. Please check your connection and try again.'
        });
      } else {
        setNotification({
          type: 'error',
          message: errorMessage || 'Login failed. Please check your credentials and try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setNotification({
      type: 'info',
      message: `${provider} login integration coming soon!`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-[#0f1419] dark:via-[#1a1f2e] dark:to-[#0f1419] font-['Inter'] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark dark:from-emerald-500 dark:to-emerald-600 rounded-full mb-4 shadow-lg dark:shadow-emerald-500/20">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-white mb-2">Welcome Back</h1>
          <p className="text-neutral-dark/70 dark:text-gray-400">Sign in to continue your learning journey</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300'
              : notification.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
              : 'bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="text-sm">{notification.message}</span>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white dark:bg-[#1e2433] rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/20 p-8 dark:border dark:border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-dark dark:text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 focus:border-transparent transition-colors bg-white dark:bg-[#262d3d] dark:text-white dark:placeholder-gray-500 ${
                    errors.email
                      ? 'border-red-300 bg-red-50 dark:border-red-500/50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-dark dark:text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 focus:border-transparent transition-colors bg-white dark:bg-[#262d3d] dark:text-white dark:placeholder-gray-500 ${
                    errors.password
                      ? 'border-red-300 bg-red-50 dark:border-red-500/50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-primary dark:text-emerald-500 focus:ring-primary dark:focus:ring-emerald-500 dark:bg-[#262d3d]"
                />
                <span className="ml-2 text-sm text-neutral-dark/70 dark:text-gray-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark dark:from-emerald-500 dark:to-emerald-600 text-white rounded-lg hover:from-primary-dark hover:to-primary dark:hover:from-emerald-600 dark:hover:to-emerald-700 focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-[#1e2433] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg dark:shadow-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#1e2433] text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#262d3d] transition-colors dark:bg-[#262d3d]/50"
            >
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#262d3d] transition-colors dark:bg-[#262d3d]/50"
            >
              <div className="w-5 h-5 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                <span className="text-white dark:text-gray-900 text-xs font-bold">G</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">GitHub</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-dark/70 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary-dark dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Trainer Login Link - Hidden (Secret: Press Ctrl+Shift+T three times) */}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
            <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
