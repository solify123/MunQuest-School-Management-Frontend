export const getBackendUrl = (): string => {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:1000';
};

// Email confirmation redirect URL
export const getEmailConfirmationUrl = (): string => {
  let url =
    process?.env?.VITE_FRONTEND_URL ?? // Set this to your site URL in production env.
    'http://localhost:5173/'
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`
  return url
};
