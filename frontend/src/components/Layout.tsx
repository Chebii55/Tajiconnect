import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Navbar from './Navbar';
import MainSidebar from './MainSidebar';
import { isAuthenticated } from '../utils/auth';

// Public routes where sidebar should not show
const PUBLIC_ROUTES = ['/login', '/register', '/trainer/login', '/forgot-password', '/reset-password'];

// Routes where the main footer should be hidden (they have their own footer/links)
const HIDE_FOOTER_ROUTES = ['/login', '/register', '/trainer/login', '/forgot-password', '/reset-password', '/privacy', '/terms', '/cookies', '/support', '/contact'];

const Layout: React.FC = () => {
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));
  const hideFooter = HIDE_FOOTER_ROUTES.some(route => location.pathname.startsWith(route));

  // Don't show sidebar on public routes even if there's stale auth data
  const authenticated = !isPublicRoute && isAuthenticated();

  // Hide footer on auth routes and legal pages (they have their own footers)
  const showFooter = !hideFooter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-mist dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg">
      <div className="flex">
        {/* Sidebar - hidden on mobile and when not authenticated, shown on lg screens when authenticated */}
        {authenticated && (
          <div className="hidden lg:block">
            <MainSidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>

          {/* Footer - hidden on public auth routes */}
          {showFooter && (
            <footer className="bg-primary-dark dark:bg-darkMode-navbar text-white mt-12">
              <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-r from-primary to-primary-light dark:from-darkMode-progress dark:to-darkMode-success rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-bold text-white dark:text-darkMode-text">TajiConnect</span>
                  </div>
                  <p className="text-neutral-light dark:text-darkMode-textSecondary text-xs">
                    Your personalized learning and career guidance platform
                  </p>
                  <div className="flex justify-center gap-4 mt-3">
                    <a href="#" className="text-neutral-light dark:text-darkMode-textMuted hover:text-accent-gold dark:hover:text-darkMode-accent transition-colors"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="text-neutral-light dark:text-darkMode-textMuted hover:text-accent-gold dark:hover:text-darkMode-accent transition-colors"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="text-neutral-light dark:text-darkMode-textMuted hover:text-accent-gold dark:hover:text-darkMode-accent transition-colors"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="text-neutral-light dark:text-darkMode-textMuted hover:text-accent-gold dark:hover:text-darkMode-accent transition-colors"><i className="fab fa-linkedin-in"></i></a>
                  </div>
                  <p className="text-forest-light dark:text-darkMode-textMuted text-xs mt-3">
                    © {new Date().getFullYear()} TajiConnect. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
