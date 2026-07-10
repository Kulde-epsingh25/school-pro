import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '30d';

export const generateTokens = (userId: string, tenantId?: string) => {
  const payload = {
    userId,
    ...(tenantId && { tenantId }),
    iat: Math.floor(Date.now() / 1000)
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
