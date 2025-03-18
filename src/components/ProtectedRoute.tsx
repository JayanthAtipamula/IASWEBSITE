import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = true 
}) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Show a clear error message when a regular user tries to access admin pages
    if (user && !loading && requireAdmin && !isAdmin) {
      // Use localStorage to prevent showing the alert multiple times
      const hasShownAdminAlert = localStorage.getItem('hasShownAdminAlert');
      
      if (!hasShownAdminAlert) {
        alert('You do not have admin privileges. This area is restricted to administrators only.');
        localStorage.setItem('hasShownAdminAlert', 'true');
        
        // Clear the alert flag after 1 hour
        setTimeout(() => {
          localStorage.removeItem('hasShownAdminAlert');
        }, 3600000);
      }
    }
  }, [user, loading, isAdmin, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // For admin routes, check both authentication and admin status
  if (requireAdmin) {
    if (!user) {
      return <Navigate to="/admin/login" />;
    }
    
    if (!isAdmin) {
      return <Navigate to="/login" state={{ adminAccessDenied: true }} />;
    }
  } else {
    // For regular protected routes, just check authentication
    if (!user) {
      return <Navigate to="/login" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
