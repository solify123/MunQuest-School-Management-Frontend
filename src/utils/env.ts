// Environment configuration utility
export const getFrontendUrl = (): string => {
  // Check for environment variable first
  const envUrl = import.meta.env.VITE_FRONTEND_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // For Vercel deployment, use the Vercel URL
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // Check if we're on Vercel (vercel.app domain)
    if (origin.includes('vercel.app') || origin.includes('munquest.com')) {
      return origin;
    }
    return origin;
  }
  
  // Default fallback for development
  return 'http://localhost:5173';
};

export const getBackendUrl = (): string => {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:1000';
};

// Email confirmation redirect URL
export const getEmailConfirmationUrl = (): string => {
  return `${getFrontendUrl()}/email-confirmation`;
};
