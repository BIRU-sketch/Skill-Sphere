import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { Hackathon } from '@/lib/models/hackathon.model';
import { connectDB } from '@/lib/config/db';

/**
 * POST /api/hackathons
 * Create a new hackathon (Organizer only)
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await authenticate(req);
    if (user.role !== 'organizer') {
      return NextResponse.json(
        { error: 'Only organizers can create hackathons' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const hackathon = await Hackathon.create({
      ...body,
      organizer: user.id,
      status: 'draft',
      participants: [],
      teams: [],
      judges: [],
      announcements: [],
    });

    return NextResponse.json(hackathon, { status: 201 });
  } catch (error: any) {
    console.error('Hackathon creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create hackathon' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/hackathons
 * List all published hackathons
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || 'published';

    const hackathons = await Hackathon.find({ status })
      .populate('organizer', 'profile.fullName email')
      .sort({ createdAt: -1 });

    return NextResponse.json(hackathons);
  } catch (error: any) {
    console.error('Fetch hackathons error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hackathons' },
      { status: 500 }
    );
  }
}

