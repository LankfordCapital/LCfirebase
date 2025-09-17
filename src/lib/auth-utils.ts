/**
 * Authentication utility functions for consistent error handling and validation
 */

export interface AuthError {
  code: string;
  message: string;
  userFriendlyMessage: string;
  shouldRetry: boolean;
  retryDelay?: number;
}

export const AUTH_ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'auth/network-request-failed',
  TIMEOUT: 'auth/timeout',
  
  // User errors
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  INVALID_EMAIL: 'auth/invalid-email',
  USER_DISABLED: 'auth/user-disabled',
  EMAIL_NOT_VERIFIED: 'auth/email-not-verified',
  
  // Rate limiting
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  
  // Google auth errors
  POPUP_CLOSED: 'auth/popup-closed-by-user',
  POPUP_BLOCKED: 'auth/popup-blocked',
  CANCELLED_POPUP: 'auth/cancelled-popup-request',
  
  // General errors
  INVALID_CREDENTIAL: 'auth/invalid-credential',
  CREDENTIAL_ALREADY_IN_USE: 'auth/credential-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
} as const;

export const getAuthError = (error: any): AuthError => {
  const code = error?.code || 'unknown';
  const message = error?.message || 'An unknown error occurred';
  
  const errorMap: Record<string, Omit<AuthError, 'code' | 'message'>> = {
    [AUTH_ERROR_CODES.NETWORK_ERROR]: {
      userFriendlyMessage: 'Network error. Please check your connection and try again.',
      shouldRetry: true,
      retryDelay: 2000,
    },
    [AUTH_ERROR_CODES.TIMEOUT]: {
      userFriendlyMessage: 'Request timed out. Please try again.',
      shouldRetry: true,
      retryDelay: 3000,
    },
    [AUTH_ERROR_CODES.USER_NOT_FOUND]: {
      userFriendlyMessage: 'No account found with this email address.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.WRONG_PASSWORD]: {
      userFriendlyMessage: 'Incorrect password. Please try again.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.INVALID_EMAIL]: {
      userFriendlyMessage: 'Invalid email address format.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.USER_DISABLED]: {
      userFriendlyMessage: 'This account has been disabled. Please contact support.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED]: {
      userFriendlyMessage: 'Please verify your email address before signing in.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.TOO_MANY_REQUESTS]: {
      userFriendlyMessage: 'Too many failed attempts. Please wait a few minutes before trying again.',
      shouldRetry: true,
      retryDelay: 60000, // 1 minute
    },
    [AUTH_ERROR_CODES.POPUP_CLOSED]: {
      userFriendlyMessage: 'Sign-in was cancelled. Please try again.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.POPUP_BLOCKED]: {
      userFriendlyMessage: 'Popup was blocked by your browser. Please allow popups and try again.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.CANCELLED_POPUP]: {
      userFriendlyMessage: 'Sign-in was cancelled. Please try again.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.INVALID_CREDENTIAL]: {
      userFriendlyMessage: 'Invalid credentials. Please check your email and password.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.CREDENTIAL_ALREADY_IN_USE]: {
      userFriendlyMessage: 'This account is already linked to another user.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.WEAK_PASSWORD]: {
      userFriendlyMessage: 'Password is too weak. Please choose a stronger password.',
      shouldRetry: false,
    },
    [AUTH_ERROR_CODES.EMAIL_ALREADY_IN_USE]: {
      userFriendlyMessage: 'An account with this email already exists.',
      shouldRetry: false,
    },
  };
  
  const errorInfo = errorMap[code] || {
    userFriendlyMessage: 'An unexpected error occurred. Please try again.',
    shouldRetry: true,
    retryDelay: 2000,
  };
  
  return {
    code,
    message,
    ...errorInfo,
  };
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password.trim()) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password must be less than 128 characters' };
  }
  
  return { isValid: true };
};

export const validateFullName = (fullName: string): { isValid: boolean; error?: string } => {
  if (!fullName.trim()) {
    return { isValid: false, error: 'Full name is required' };
  }
  
  if (fullName.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters long' };
  }
  
  if (fullName.trim().length > 100) {
    return { isValid: false, error: 'Full name must be less than 100 characters' };
  }
  
  return { isValid: true };
};

export const isRetryableError = (error: any): boolean => {
  const authError = getAuthError(error);
  return authError.shouldRetry;
};

export const getRetryDelay = (error: any, attempt: number): number => {
  const authError = getAuthError(error);
  
  if (!authError.shouldRetry) {
    return 0;
  }
  
  // Use custom delay if specified, otherwise exponential backoff
  if (authError.retryDelay) {
    return authError.retryDelay;
  }
  
  // Exponential backoff: 1s, 2s, 4s, 8s, max 10s
  return Math.min(Math.pow(2, attempt) * 1000, 10000);
};

export const shouldRetryAuthOperation = (error: any, attempt: number, maxRetries: number = 3): boolean => {
  if (attempt >= maxRetries) {
    return false;
  }
  
  return isRetryableError(error);
};

export const createAuthRetryWrapper = <T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  maxRetries: number = 3
) => {
  return async (...args: T): Promise<R> => {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Auth operation attempt ${attempt}/${maxRetries}`);
        const result = await operation(...args);
        console.log(`✅ Auth operation successful on attempt ${attempt}`);
        return result;
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Auth operation attempt ${attempt} failed:`, error.code, error.message);
        
        if (!shouldRetryAuthOperation(error, attempt, maxRetries)) {
          throw error;
        }
        
        const delay = getRetryDelay(error, attempt);
        if (delay > 0) {
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error(`❌ All ${maxRetries} auth operation attempts failed`);
    throw lastError;
  };
};

// ============================================================================
// CLIENT-SIDE AUTHENTICATION UTILITIES
// ============================================================================
// Note: This file contains only client-side safe utilities
// Server-side authentication functions are in auth-utils-server.ts