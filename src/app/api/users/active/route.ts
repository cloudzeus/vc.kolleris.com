import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { companyId: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get users active in the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const activeUsers = await prisma.user.findMany({
            where: {
                companyId: user.companyId,
                id: { not: session.user.id }, // Exclude current user
                lastSeen: {
                    gte: fiveMinutesAgo
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                lastSeen: true,
            },
            orderBy: {
                lastSeen: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            users: activeUsers,
            count: activeUsers.length
        });

    } catch (error) {
        console.error('Failed to fetch active users:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch active users'
            },
            { status: 500 }
        );
    }
}
