// src/features/auth/services/auth.service.ts

import type { LoginCredentials, AuthResponse } from '../models/auth.types';
import { AuthError } from '../models/auth.types';

class AuthService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new AuthError(errorData.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store tokens
      if (credentials.rememberMe) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      } else {
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);
      }

      return data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Network error. Please try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getAccessToken();
      
      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear tokens regardless of API call success
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      // Update stored token
      if (localStorage.getItem('accessToken')) {
        localStorage.setItem('accessToken', newAccessToken);
      } else {
        sessionStorage.setItem('accessToken', newAccessToken);
      }

      return newAccessToken;
    } catch (error) {
      this.clearTokens();
      return null;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }
}

export const authService = new AuthService();