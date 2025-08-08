import type { RegisterCredentials, RegisterResponse, EmailAvailabilityResponse } from '../models/register.types';

class RegisterService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          username: credentials.username,
          first_name: credentials.firstName,
          last_name: credentials.lastName,
          password: credentials.password,
          password_confirm: credentials.passwordConfirm,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle field-specific errors from Django
        if (response.status === 400 && errorData) {
          const errors: string[] = [];
          
          if (errorData.email) {
            errors.push(`Email: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}`);
          }
          if (errorData.username) {
            errors.push(`Username: ${Array.isArray(errorData.username) ? errorData.username[0] : errorData.username}`);
          }
          if (errorData.password) {
            errors.push(`Password: ${Array.isArray(errorData.password) ? errorData.password[0] : errorData.password}`);
          }
          if (errorData.non_field_errors) {
            errors.push(Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors);
          }
          
          throw new Error(errors.length > 0 ? errors.join('. ') : 'Registration failed');
        }
        
        throw new Error(errorData.message || 'Registration failed');
      }

      const data: RegisterResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please try again.');
    }
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/check-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Unable to check email availability');
      }

      const data: EmailAvailabilityResponse = await response.json();
      return data.isAvailable;
    } catch (error) {
      console.warn('Email availability check failed:', error);
      return true; // Assume available if check fails
    }
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      // This would need to be implemented in the backend
      const response = await fetch(`${this.baseUrl}/auth/check-username/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Unable to check username availability');
      }

      const data = await response.json();
      return data.isAvailable;
    } catch (error) {
      console.warn('Username availability check failed:', error);
      return true; // Assume available if check fails
    }
  }

  // Utility method to validate email format on client side
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Utility method to validate username format on client side
  isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }
}

export const registerService = new RegisterService();