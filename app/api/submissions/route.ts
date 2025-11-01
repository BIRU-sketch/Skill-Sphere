import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { Submission } from '@/lib/models/submission.model';
import { uploadArtifact } from '@/lib/utils/storage';
import { connectDB } from '@/lib/config/db';

/**
 * POST /api/submissions
 * Submit project for hackathon evaluation
 * Handles file upload via FormData
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await authenticate(req);

    if (user.role !== 'participant') {
      return NextResponse.json(
        { error: 'Only participants can submit projects' },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const hackathonId = formData.get('hackathonId');
    const teamId = formData.get('teamId');
    const title = formData.get('title');
    const description = formData.get('description');
    const techStackEntry = formData.get('techStack');
    const repoUrl = formData.get('repoUrl');
    const demoUrl = formData.get('demoUrl');
    const fileEntry = formData.get('file');

    if (
      typeof hackathonId !== 'string' ||
      typeof teamId !== 'string' ||
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      typeof repoUrl !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Missing required submission fields.' },
        { status: 400 }
      );
    }

    const resolvedDemoUrl = typeof demoUrl === 'string' ? demoUrl : undefined;

    const techStack = typeof techStackEntry === 'string'
      ? techStackEntry
          .split(',')
          .map((stackItem) => stackItem.trim())
          .filter((stackItem) => stackItem.length > 0)
      : [];

    const file = fileEntry instanceof File ? fileEntry : null;

    let artifactUrl: string | undefined;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      artifactUrl = await uploadArtifact({
        buffer,
        originalname: file.name,
        mimetype: file.type,
      });
    }

    const submission = await Submission.create({
      hackathon: hackathonId,
      team: teamId,
      submittedBy: user.id,
      title,
      description,
      techStack,
      repoUrl,
      demoUrl: resolvedDemoUrl,
      artifactUrl,
      status: 'submitted',
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit project' },
      { status: 500 }
    );
  }
}

