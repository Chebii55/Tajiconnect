import React, { useEffect, useState } from 'react';
import { X, Award, Download, Share2, GraduationCap, CheckCircle, ExternalLink } from 'lucide-react';
import type { Certificate, Course } from '../../../types/course';
import { Link } from 'react-router-dom';

interface CertificateAwardModalProps {
  certificate: Certificate;
  course: Course;
  earnedDate: string;
  onClose: () => void;
}

const CertificateAwardModal: React.FC<CertificateAwardModalProps> = ({
  certificate,
  course,
  earnedDate,
  onClose,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    // In a real app, this would generate/download a PDF certificate
    alert('Certificate download would start here. This feature would generate a PDF certificate.');
  };

  const handleShare = () => {
    // In a real app, this would open share options
    if (navigator.share) {
      navigator.share({
        title: `I earned the ${certificate.title}!`,
        text: `I just completed the ${course.title} course on TajiConnect!`,
        url: window.location.href,
      });
    } else {
      alert('Share feature would open here with various sharing options.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative bg-white dark:bg-darkMode-surface rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-500 my-8 ${
          showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <GraduationCap className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
          <p className="text-white/90 text-lg">You've earned a certificate</p>
        </div>

        {/* Certificate Preview */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-darkMode-surfaceHover dark:to-darkMode-surface border-4 border-yellow-400 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-darkMode-textMuted uppercase tracking-wider mb-2">
                Certificate of Completion
              </p>
              <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
                {certificate.title}
              </h3>
              <p className="text-gray-600 dark:text-darkMode-textSecondary mb-4">
                This certifies that you have successfully completed
              </p>
              <p className="text-lg font-semibold text-primary dark:text-darkMode-link mb-4">
                {course.title}
              </p>
              <p className="text-gray-600 dark:text-darkMode-textSecondary text-sm">
                {certificate.description}
              </p>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-darkMode-border">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-darkMode-textMuted">Issued by</p>
                    <p className="font-medium text-primary-dark dark:text-darkMode-text">
                      {certificate.issuer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 dark:text-darkMode-textMuted">Date Earned</p>
                    <p className="font-medium text-primary-dark dark:text-darkMode-text">
                      {formatDate(earnedDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-darkMode-textSecondary mb-3">
              Badges Earned in This Course
            </h4>
            <div className="flex gap-2">
              {course.modules.map((module) => (
                <div
                  key={module.badge.id}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    {module.badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Certificate
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-primary dark:border-darkMode-link text-primary dark:text-darkMode-link font-medium rounded-lg hover:bg-primary/10 dark:hover:bg-darkMode-link/10 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share Achievement
            </button>
          </div>

          {/* View in Certificates */}
          <Link
            to="/student/certificates"
            className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-link transition-colors"
          >
            <span>View all certificates</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CertificateAwardModal;
