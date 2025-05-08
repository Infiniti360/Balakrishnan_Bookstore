import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading indicator while checking auth state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute; 