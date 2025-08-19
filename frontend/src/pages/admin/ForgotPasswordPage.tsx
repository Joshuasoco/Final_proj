import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ForgotPassword } from '@/features/auth/components/ForgotPassword';
import { VerifyOtp } from '@/features/auth/components/VerifyOtp';

type Step = 'forgot-password' | 'verify-otp' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('forgot-password');
  const [email, setEmail] = useState('');

  const handleEmailSubmitSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep('verify-otp');
  };

  const handleOtpSuccess = () => {
    setCurrentStep('success');
    // Redirect to login or reset password page
    console.log('OTP verified successfully');
  };

  const handleBackToForgotPassword = () => {
    setCurrentStep('forgot-password');
  };

  const handleBackToLogin = () => {
    // Navigate to login page
    window.location.href = '/admin/login';
  };

  const handleResendOtp = () => {
    // Resend OTP logic
    console.log('Resending OTP to:', email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {currentStep === 'forgot-password' && (
            <ForgotPassword
              key="forgot-password"
              onSuccess={handleEmailSubmitSuccess}
              onBackToLogin={handleBackToLogin}
            />
          )}
          {currentStep === 'verify-otp' && (
            <VerifyOtp
              key="verify-otp"
              email={email}
              onSuccess={handleOtpSuccess}
              onBack={handleBackToForgotPassword}
              onResendOtp={handleResendOtp}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};