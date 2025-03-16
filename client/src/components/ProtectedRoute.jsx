import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.profileType)) {
    // Redirect to appropriate page based on user type
    switch (user?.profileType) {
      case 'seller':
        return <Navigate to="/profile" />;
      case 'admin':
        return <Navigate to="/admin" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute; 