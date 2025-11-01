import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { Hackathon } from '@/lib/models/hackathon.model';
import { Submission } from '@/lib/models/submission.model';
import { generateCertificate } from '@/lib/utils/certificates';
import { connectDB } from '@/lib/config/db';
import { Types } from 'mongoose';

/**
 * POST /api/certificates/[hackathonId]/generate
 * Generate digital certificates for all participants/winners (Organizer only)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { hackathonId: string } }
) {
  try {
    await connectDB();
    const user = await authenticate(req);
    const hackathon = await Hackathon.findById(params.hackathonId).exec();

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    if (hackathon.organizer.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Only organizers can generate certificates' },
        { status: 403 }
      );
    }

    // Get top submissions for winners
    const topSubmissions = await Submission.find({ hackathon: params.hackathonId })
      .sort({ aggregateScore: -1 })
      .limit(10)
      .populate('team', 'name members')
      .exec();

    const certificates: Array<{
      submissionId: Types.ObjectId;
      teamId: Types.ObjectId | null;
      certificateUrl: string;
    }> = [];

    const isPopulatedTeam = (
      team: unknown
    ): team is { _id: Types.ObjectId; name?: string } =>
      typeof team === 'object' && team !== null && '_id' in team;

    for (let index = 0; index < topSubmissions.length; index += 1) {
      const submission = topSubmissions[index];
      const teamEntry = submission.team as unknown;

      const teamId = isPopulatedTeam(teamEntry)
        ? teamEntry._id
        : (teamEntry as Types.ObjectId | null) ?? null;
      const teamName = isPopulatedTeam(teamEntry) && teamEntry.name
        ? teamEntry.name
        : 'Team';

      const certificateUrl = await generateCertificate({
        hackathonTitle: hackathon.title,
        participantName: teamName,
        score: submission.aggregateScore || 0,
        rank: index + 1,
      });

      certificates.push({
        submissionId: submission._id,
        teamId,
        certificateUrl,
      });
    }

    return NextResponse.json({ certificates, generated: certificates.length }, { status: 201 });
  } catch (error: any) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate certificates' },
      { status: 500 }
    );
  }
}

