// Environment variable validation utility

export function validateEnv() {
  const publicVars = [
    'NEXT_PUBLIC_API_URL',
  ];

  const missing = publicVars.filter(key => !process.env[key] && typeof window === 'undefined' && process.env.NODE_ENV === 'production');

  if (missing.length > 0) {
    console.warn(
      `[Warning] Missing production environment variables: ${missing.join(', ')}. ` +
      `Falling back to default cloud endpoints.`
    );
  }
}
