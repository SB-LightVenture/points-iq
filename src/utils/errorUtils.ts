export interface UserFriendlyError {
  title: string;
  message: string;
  actions?: string[];
  type: 'error' | 'warning' | 'info';
  retry?: boolean;
}

export type ErrorContext = 
  | 'auth-login'
  | 'auth-signup'
  | 'auth-session'
  | 'flight-search'
  | 'flight-scraping'
  | 'wallet-create'
  | 'wallet-update'
  | 'wallet-delete'
  | 'network'
  | 'validation'
  | 'unknown';

export class ErrorHandler {
  private static getAuthError(error: any, context: ErrorContext): UserFriendlyError {
    const message = error?.message?.toLowerCase() || '';
    
    switch (context) {
      case 'auth-login':
        if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
          return {
            title: 'Login Failed',
            message: 'The email or password you entered is incorrect. Please double-check and try again.',
            actions: ['Check your email spelling', 'Try resetting your password if you forgot it'],
            type: 'error',
            retry: true
          };
        }
        if (message.includes('email not confirmed')) {
          return {
            title: 'Email Not Verified',
            message: 'Please check your email and click the verification link before signing in.',
            actions: ['Check your email inbox and spam folder', 'Resend verification email if needed'],
            type: 'warning'
          };
        }
        if (message.includes('too many requests')) {
          return {
            title: 'Too Many Attempts',
            message: 'Please wait a few minutes before trying to sign in again.',
            actions: ['Wait 5-10 minutes', 'Check if your account is locked'],
            type: 'warning'
          };
        }
        break;
        
      case 'auth-signup':
        if (message.includes('user already registered') || message.includes('already exists')) {
          return {
            title: 'Account Already Exists',
            message: 'An account with this email is already registered. Try signing in instead.',
            actions: ['Use the Sign In tab', 'Reset your password if needed'],
            type: 'warning'
          };
        }
        if (message.includes('password')) {
          return {
            title: 'Password Requirements',
            message: 'Your password must be at least 6 characters long.',
            actions: ['Use a mix of letters, numbers, and symbols', 'Make it at least 6 characters'],
            type: 'error'
          };
        }
        if (message.includes('email') && message.includes('invalid')) {
          return {
            title: 'Invalid Email',
            message: 'Please enter a valid email address.',
            actions: ['Check for typos in your email', 'Use a different email format'],
            type: 'error'
          };
        }
        break;
        
      case 'auth-session':
        return {
          title: 'Session Expired',
          message: 'Your session has expired. Please sign in again to continue.',
          actions: ['Sign in again', 'Your data is still safe'],
          type: 'warning'
        };
    }
    
    return {
      title: 'Authentication Error',
      message: 'We encountered an issue with authentication. Please try again.',
      actions: ['Check your internet connection', 'Try refreshing the page'],
      type: 'error',
      retry: true
    };
  }

  private static getFlightSearchError(error: any): UserFriendlyError {
    const message = error?.message?.toLowerCase() || '';
    
    if (message.includes('edge function returned a non-2xx status code')) {
      return {
        title: 'Flight Search Temporarily Unavailable',
        message: 'We\'re having trouble connecting to airline systems right now. This usually resolves quickly.',
        actions: ['Try again in a few minutes', 'Check if your search dates are valid', 'Verify airport codes are correct'],
        type: 'warning',
        retry: true
      };
    }
    
    if (message.includes('timeout') || message.includes('504')) {
      return {
        title: 'Search Taking Too Long',
        message: 'The airline systems are responding slowly. Your search may still be processing.',
        actions: ['Wait a moment and try again', 'Try searching one airline at a time'],
        type: 'warning',
        retry: true
      };
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return {
        title: 'Connection Problem',
        message: 'Unable to connect to flight search services. Please check your internet connection.',
        actions: ['Check your internet connection', 'Try refreshing the page'],
        type: 'error',
        retry: true
      };
    }
    
    if (message.includes('401') || message.includes('unauthorized')) {
      return {
        title: 'Session Expired',
        message: 'Your session has expired. Please sign in again to search flights.',
        actions: ['Sign in again', 'Refresh the page'],
        type: 'warning'
      };
    }
    
    if (message.includes('rate limit') || message.includes('429')) {
      return {
        title: 'Search Limit Reached',
        message: 'You\'ve made too many searches recently. Please wait a moment before searching again.',
        actions: ['Wait 1-2 minutes', 'Try fewer airlines at once'],
        type: 'warning'
      };
    }

    return {
      title: 'Flight Search Error',
      message: 'We couldn\'t complete your flight search. This might be due to airline system maintenance.',
      actions: ['Try different dates or routes', 'Check back in a few minutes', 'Verify your search details'],
      type: 'error',
      retry: true
    };
  }

  private static getWalletError(error: any, context: ErrorContext): UserFriendlyError {
    const message = error?.message?.toLowerCase() || '';
    
    switch (context) {
      case 'wallet-create':
        if (message.includes('duplicate') || message.includes('unique')) {
          return {
            title: 'Wallet Already Exists',
            message: 'You already have a wallet for this frequent flyer program.',
            actions: ['Edit your existing wallet instead', 'Use a different program'],
            type: 'warning'
          };
        }
        if (message.includes('foreign key') || message.includes('program')) {
          return {
            title: 'Invalid Program',
            message: 'The selected frequent flyer program is not available. Please choose a different one.',
            actions: ['Select a different program', 'Refresh the page to reload programs'],
            type: 'error'
          };
        }
        break;
        
      case 'wallet-update':
        if (message.includes('not found') || message.includes('does not exist')) {
          return {
            title: 'Wallet Not Found',
            message: 'This wallet no longer exists. It may have been deleted.',
            actions: ['Refresh the page', 'Create a new wallet'],
            type: 'warning'
          };
        }
        break;
        
      case 'wallet-delete':
        if (message.includes('not found')) {
          return {
            title: 'Wallet Already Deleted',
            message: 'This wallet has already been removed.',
            actions: ['Refresh the page to see current wallets'],
            type: 'info'
          };
        }
        break;
    }
    
    return {
      title: 'Wallet Operation Failed',
      message: 'We couldn\'t complete the wallet operation. Please try again.',
      actions: ['Check your internet connection', 'Try again in a moment'],
      type: 'error',
      retry: true
    };
  }

  private static getNetworkError(): UserFriendlyError {
    return {
      title: 'Connection Problem',
      message: 'Unable to connect to our servers. Please check your internet connection.',
      actions: ['Check your internet connection', 'Try refreshing the page', 'Wait a moment and try again'],
      type: 'error',
      retry: true
    };
  }

  private static getValidationError(field?: string): UserFriendlyError {
    if (field) {
      return {
        title: 'Invalid Information',
        message: `Please check the ${field} field and try again.`,
        actions: [`Verify your ${field} is correct`, 'Fill in all required fields'],
        type: 'error'
      };
    }
    
    return {
      title: 'Form Validation Error',
      message: 'Please check your information and fill in all required fields.',
      actions: ['Review all form fields', 'Ensure required fields are filled'],
      type: 'error'
    };
  }

  public static getUserFriendlyError(error: any, context: ErrorContext, field?: string): UserFriendlyError {
    // Handle null/undefined errors
    if (!error) {
      return {
        title: 'Unknown Error',
        message: 'Something went wrong. Please try again.',
        actions: ['Try again', 'Refresh the page'],
        type: 'error',
        retry: true
      };
    }

    // Handle network errors
    if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
      return this.getNetworkError();
    }

    // Handle context-specific errors
    switch (context) {
      case 'auth-login':
      case 'auth-signup':
      case 'auth-session':
        return this.getAuthError(error, context);
        
      case 'flight-search':
      case 'flight-scraping':
        return this.getFlightSearchError(error);
        
      case 'wallet-create':
      case 'wallet-update':
      case 'wallet-delete':
        return this.getWalletError(error, context);
        
      case 'validation':
        return this.getValidationError(field);
        
      case 'network':
        return this.getNetworkError();
        
      default:
        return {
          title: 'Something Went Wrong',
          message: 'We encountered an unexpected error. Please try again.',
          actions: ['Try again', 'Refresh the page', 'Contact support if this persists'],
          type: 'error',
          retry: true
        };
    }
  }
}