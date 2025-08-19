import type{ ForgotPasswordRequest, VerifyOtpRequest, ApiResponse } from '../types';

class AuthService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - replace with actual API call
      if (data.email.includes('@')) {
        return {
          success: true,
          message: 'OTP sent successfully to your email',
        };
      } else {
        throw new Error('Invalid email format');
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - replace with actual API call
      if (data.otp === '123456') {
        return {
          success: true,
          message: 'OTP verified successfully',
        };
      } else {
        throw new Error('Invalid OTP code');
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify OTP',
      };
    }
  }
}

export const authService = new AuthService();
