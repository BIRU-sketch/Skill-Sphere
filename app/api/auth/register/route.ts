import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User } from '@/lib/models/user.model';
import { signJwt } from '@/lib/utils/jwt';
import { connectDB } from '@/lib/config/db';

/**
 * POST /api/auth/register
 * Registers a new participant or organizer
 * Only allows university email domains (ends with .edu)
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password, profile, role } = body;

    if (!email.endsWith('.edu')) {
      return NextResponse.json(
        { error: 'Please register with your university email address.' },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: 'Account already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || 'participant',
      profile,
      university: email.split('@')[1],
    });

    const token = signJwt({ sub: user._id.toString(), role: user.role });

    return NextResponse.json(
      { token, user: { id: user._id, email: user.email, role: user.role, profile: user.profile } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

