import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { Submission } from '@/lib/models/submission.model';
import { connectDB } from '@/lib/config/db';

/**
 * GET /api/submissions/[hackathonId]
 * List all submissions for a hackathon (Organizer/Judge only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { hackathonId: string } }
) {
  try {
    await connectDB();
    const user = await authenticate(req);

    if (user.role !== 'organizer' && user.role !== 'judge') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const submissions = await Submission.find({ hackathon: params.hackathonId })
      .populate('team', 'name members')
      .populate('submittedBy', 'profile.fullName email')
      .sort({ aggregateScore: -1, createdAt: -1 });

    return NextResponse.json(submissions);
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

