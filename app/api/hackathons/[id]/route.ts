import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { Hackathon } from '@/lib/models/hackathon.model';
import { connectDB } from '@/lib/config/db';

/**
 * GET /api/hackathons/[id]
 * Get hackathon details with teams and participants
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await authenticate(req);

    const hackathon = await Hackathon.findById(params.id)
      .populate('organizer', 'profile.fullName email')
      .populate({ path: 'teams', populate: { path: 'members', select: 'profile.fullName email' } })
      .populate('participants', 'profile.fullName email');

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(hackathon);
  } catch (error: any) {
    console.error('Fetch hackathon error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hackathon' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/hackathons/[id]
 * Update hackathon (Organizer only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await authenticate(req);
    const hackathon = await Hackathon.findById(params.id);

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    if (hackathon.organizer.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this hackathon' },
        { status: 403 }
      );
    }

    const body = await req.json();
    Object.assign(hackathon, body);
    await hackathon.save();

    return NextResponse.json(hackathon);
  } catch (error: any) {
    console.error('Update hackathon error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update hackathon' },
      { status: 500 }
    );
  }
}

