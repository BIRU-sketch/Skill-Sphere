import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { Hackathon } from '@/lib/models/hackathon.model';
import { connectDB } from '@/lib/config/db';

/**
 * POST /api/hackathons/[id]/announcements
 * Create announcement for hackathon (Organizer only)
 * Emits real-time event via Socket.io (implemented in WebSocket handler)
 */
export async function POST(
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
        { error: 'Not authorized to post announcements' },
        { status: 403 }
      );
    }

    const { title, message, audience = 'all' } = await req.json();

    hackathon.announcements.push({
      title,
      message,
      audience,
      createdAt: new Date(),
    });

    await hackathon.save();

    const announcement = hackathon.announcements[hackathon.announcements.length - 1];

    // TODO: Emit Socket.io event to all participants
    // io.to(`hackathon_${params.id}`).emit('announcement:new', announcement);

    return NextResponse.json(announcement, { status: 201 });
  } catch (error: any) {
    console.error('Post announcement error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to post announcement' },
      { status: 500 }
    );
  }
}

