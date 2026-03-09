import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const userId = session.user.id;

        // Check if the user is a participant in this meeting
        const meeting = await prisma.call.findUnique({
            where: { id },
            include: {
                participants: true
            }
        });

        if (!meeting) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }

        const isParticipant = meeting.participants.some((p: any) => p.userId === userId);
        if (!isParticipant) {
            return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
        }

        // If it's a 1-on-1 call (VIDEO_CALL), declining it should probably end/cancel it
        if (meeting.type === 'VIDEO_CALL') {
            await prisma.call.update({
                where: { id },
                data: {
                    status: 'cancelled' // or 'ended'
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error declining meeting:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
