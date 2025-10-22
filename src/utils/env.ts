// Environment configuration utility
export const getFrontendUrl = (): string => {
  // Check for environment variable first
  const envUrl = import.meta.env.VITE_FRONTEND_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback to window.location.origin for development
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Default fallback
  return 'http://localhost:5173';
};

export const getBackendUrl = (): string => {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:1000';
};

// Email confirmation redirect URL
export const getEmailConfirmationUrl = (): string => {
  return `${getFrontendUrl()}/email-confirmation`;
};
