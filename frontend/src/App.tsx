// App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoginPage from '@/pages/admin/Login';
import RegisterPage from '@/pages/admin/RegisterPage';
import DashboardPages from '@/pages/admin/DashboardPage';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ForgotPasswordPage } from '@/pages/admin/ForgotPasswordPage';
import { VerifyOtp } from '@/features/auth/components/VerifyOtp';


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
      <Route path='/forgot-password'element=
      {<ForgotPasswordPage/>}/>
      {/* Protected routes */}
      <Route
        path="/verify-otp"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <VerifyOtp
            email="user@example.com" // TODO: Replace with actual email value
            onSuccess={() => { /* handle success */ }}
            onBack={() => { /* handle back */ }}
            onResendOtp={() => { /* handle resend OTP */ }}
          />
          </div>
        }
      />

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