import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'trainer' | 'admin';
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
    if (userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      if (userRole === 'student') {
        return <Navigate to="/student/dashboard" replace />;
      } else if (userRole === 'trainer') {
        return <Navigate to="/trainer/dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;