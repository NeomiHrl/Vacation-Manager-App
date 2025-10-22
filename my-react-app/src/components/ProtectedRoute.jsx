import { useUser } from '../contexts/Context';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;