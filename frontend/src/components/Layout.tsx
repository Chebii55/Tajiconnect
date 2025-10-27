import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">TajiConnect</span>
            </div>
            <p className="text-neutral-light text-sm">
              Your personalized learning and career guidance platform
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="#" className="text-neutral-light hover:text-primary-light transition-colors"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-neutral-light hover:text-primary-light transition-colors"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-neutral-light hover:text-primary-light transition-colors"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-neutral-light hover:text-primary-light transition-colors"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <p className="text-neutral-light/70 text-xs mt-4">
              © 2024 TajiConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;