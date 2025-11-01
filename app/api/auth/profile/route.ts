import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { User } from '@/lib/models/user.model';
import { connectDB } from '@/lib/config/db';

/**
 * GET /api/auth/profile
 * Get current user profile
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await authenticate(req);
    const userDoc = await User.findById(user.id);

    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: userDoc._id,
      email: userDoc.email,
      role: userDoc.role,
      profile: userDoc.profile,
      university: userDoc.university,
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

