import { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/utils/jwt';

export interface AuthenticatedUser {
  id: string;
  role: 'participant' | 'organizer' | 'judge' | 'admin';
}

/**
 * Authenticates request via JWT token in Authorization header
 * Returns user object or throws error
 */
export async function authenticate(req: NextRequest): Promise<AuthenticatedUser> {
  const authHeader = req.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization token');
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = verifyJwt(token);

  return {
    id: payload.sub,
    role: payload.role as AuthenticatedUser['role'],
  };
}

