import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../utils/auth';
import type { UserRole } from '../../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | 'trainer'; // 'trainer' is alias for 'instructor'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required and doesn't match, redirect appropriately
  if (requiredRole) {
    const userRole = getUserRole();

    // Normalize role - 'trainer' maps to 'instructor'
    const normalizedRequiredRole = requiredRole === 'trainer' ? 'instructor' : requiredRole;
    const normalizedUserRole = userRole === 'instructor' ? 'instructor' : userRole;

    if (normalizedUserRole !== normalizedRequiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      switch (userRole) {
        case 'student':
          return <Navigate to="/student/dashboard" replace />;
        case 'instructor':
          return <Navigate to="/trainer" replace />;
        case 'admin':
          return <Navigate to="/admin/dashboard" replace />;
        case 'moderator':
          return <Navigate to="/admin/dashboard" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
