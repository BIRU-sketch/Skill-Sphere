import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { Submission } from '@/lib/models/submission.model';
import { Team } from '@/lib/models/team.model';
import { connectDB } from '@/lib/config/db';

/**
 * GET /api/leaderboard/[hackathonId]
 * Get real-time leaderboard sorted by aggregate score
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { hackathonId: string } }
) {
  try {
    await connectDB();
    await authenticate(req);

    const submissions = await Submission.find({ hackathon: params.hackathonId })
      .populate('team', 'name members')
      .sort({ aggregateScore: -1 });

    // Group by team and calculate rankings
    const leaderboard = submissions.map((sub, index) => ({
      rank: index + 1,
      teamId: sub.team._id,
      teamName: (sub.team as any).name || 'Unnamed Team',
      score: sub.aggregateScore || 0,
      members: (sub.team as any).members || [],
      submissionId: sub._id,
    }));

    return NextResponse.json(leaderboard);
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

