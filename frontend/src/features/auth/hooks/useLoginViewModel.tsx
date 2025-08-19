// src/features/auth/hooks/useLoginViewModel.ts

import { useState, useCallback, useMemo } from 'react';
import type { LoginFormData, LoginViewModel, AuthStatus, ValidationErrors } from '../models/auth.types';
import { authService } from '../services/auth.service';
import { validateLoginForm, hasValidationErrors } from '../utils/validation';

const initialFormData: LoginFormData = {
  email: '',
  password: '',
  rememberMe: false,
};

export const useLoginViewModel = () => {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<AuthStatus>('idle');

  const isFormValid = useMemo(() => {
    const errors = validateLoginForm(formData);
    return !hasValidationErrors(errors) && formData.email.length > 0 && formData.password.length > 0;
  }, [formData]);

  // Add email validation to your canSubmit logic
  const canSubmit = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(formData.email);
    
    return (
      isEmailValid && // Add this line
      formData.password.trim() !== '' &&
      status !== 'loading' &&
      Object.keys(validationErrors).length === 0
    );
  }, [formData, validationErrors, status]);

  const updateField = useCallback((field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof ValidationErrors];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const validateForm = useCallback(() => {
    const errors = validateLoginForm(formData);
    setValidationErrors(errors);
    return !hasValidationErrors(errors);
  }, [formData]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      return { success: false, error: 'Please fix validation errors' };
    }

    setStatus('loading');

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      setStatus('success');
      
      // Reset form
      setFormData(initialFormData);
      setValidationErrors({});

      return { 
        success: true, 
        data: response,
        message: 'Login successful!' 
      };
    } catch (error) {
      setStatus('error');
      
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      // Set general error or field-specific error
      if (errorMessage.toLowerCase().includes('email')) {
        setValidationErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes('password')) {
        setValidationErrors({ password: errorMessage });
      } else {
        setValidationErrors({ email: errorMessage });
      }

      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, [formData, validateForm]);

  const clearErrors = useCallback(() => {
    setValidationErrors({});
    setStatus('idle');
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidationErrors({});
    setStatus('idle');
  }, []);

  const viewModel: LoginViewModel = {
    formData,
    validationErrors,
    status,
    isFormValid,
    canSubmit,
  };

  return {
    viewModel,
    actions: {
      updateField,
      handleLogin,
      validateForm,
      clearErrors,
      resetForm,
    },
  };
};