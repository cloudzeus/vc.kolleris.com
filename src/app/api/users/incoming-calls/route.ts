import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Find active calls where the user is a participant
        // We look for calls created in the last 5 minutes to avoid stale notifications
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const incomingCalls = await prisma.call.findMany({
            where: {
                status: 'IN_PROGRESS',
                type: 'VIDEO_CALL',
                createdAt: {
                    gte: fiveMinutesAgo
                },
                participants: {
                    some: {
                        userId: userId
                    }
                },
                // Exclude calls created by the user themselves (they are the caller)
                NOT: {
                    createdById: userId
                }
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 1
        });

        return NextResponse.json({ calls: incomingCalls });
    } catch (error) {
        console.error('Error fetching incoming calls:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
