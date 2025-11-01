import jwt, { SignOptions, Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const rawExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = rawExpiresIn as SignOptions['expiresIn'];

interface JWTPayload {
  sub: string;
  role: string;
}

/**
 * Sign JWT token with user ID and role
 */
export function signJwt(payload: { sub: string; role: string }): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify JWT token and return payload
 */
export function verifyJwt(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

