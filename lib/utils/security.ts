import bcrypt from 'bcryptjs';

/**
 * Hash a CTF flag using bcrypt
 */
export async function hashFlag(flag: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(flag.trim(), saltRounds);
}

/**
 * Verify a submitted flag against the hashed flag
 */
export async function verifyFlag(submittedFlag: string, hashedFlag: string): Promise<boolean> {
  try {
    return await bcrypt.compare(submittedFlag.trim(), hashedFlag);
  } catch (error) {
    console.error('Error verifying flag:', error);
    return false;
  }
}

/**
 * Generate a random flag
 */
export function generateRandomFlag(prefix: string = 'FLAG'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 32; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}{${randomPart}}`;
}

/**
 * Rate limiting helper - tracks attempts
 */
interface RateLimitStore {
  [key: string]: { count: number; timestamp: number };
}

const rateLimitStore: RateLimitStore = {};

export function checkRateLimit(
  identifier: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; remainingAttempts: number; resetTime?: number } {
  const now = Date.now();
  const record = rateLimitStore[identifier];

  if (!record || now - record.timestamp > windowMs) {
    // New window or expired window
    rateLimitStore[identifier] = { count: 1, timestamp: now };
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    // Rate limit exceeded
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: record.timestamp + windowMs,
    };
  }

  // Increment count
  record.count++;
  return { allowed: true, remainingAttempts: maxAttempts - record.count };
}

/**
 * Clear rate limit for an identifier
 */
export function clearRateLimit(identifier: string): void {
  delete rateLimitStore[identifier];
}

