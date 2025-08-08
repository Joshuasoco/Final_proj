// App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPages from '@/pages/DashboardPage';
import { useAuth } from '@/features/auth/context/AuthContext';

// Component to handle authenticated redirects for login
const AuthenticatedRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <LoginPage />;
};

// Component to handle authenticated redirects for registration
const RegisterRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <RegisterPage />;
};

// Main App component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<AuthenticatedRedirect />} />
      <Route path="/register" element={<RegisterRedirect />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPages />
          </ProtectedRoute>
        } 
      />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;