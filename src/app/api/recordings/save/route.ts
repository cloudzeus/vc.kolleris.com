import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToBunnyCDN } from '@/lib/bunny';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { callId, recordingUrl, duration } = await request.json();

        if (!callId || !recordingUrl) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find the call
        const call = await prisma.call.findFirst({
            where: {
                id: callId,
                OR: [
                    { createdById: session.user.id },
                    { participants: { some: { userId: session.user.id } } }
                ]
            },
            include: {
                company: true,
                createdBy: true,
            },
        });

        if (!call) {
            return NextResponse.json({ error: 'Call not found' }, { status: 404 });
        }

        console.log('📹 Downloading recording from Stream:', recordingUrl);

        // Download recording from Stream.io
        const response = await fetch(recordingUrl);
        if (!response.ok) {
            throw new Error(`Failed to download recording: ${response.statusText}`);
        }

        const recordingBuffer = Buffer.from(await response.arrayBuffer());
        console.log('📹 Recording downloaded, size:', recordingBuffer.length, 'bytes');

        // Upload to Bunny CDN
        const timestamp = Date.now();
        const fileName = `recording-${callId}-${timestamp}.mp4`;
        const filePath = `recordings/${call.companyId}/${fileName}`;

        console.log('☁️ Uploading to Bunny CDN:', filePath);
        const bunnyCdnUrl = await uploadToBunnyCDN(
            recordingBuffer,
            filePath,
            'video/mp4'
        );
        console.log('✅ Uploaded to Bunny CDN:', bunnyCdnUrl);

        // Create recording record
        const recording = await prisma.recording.create({
            data: {
                callId: call.id,
                title: `Recording - ${call.title}`,
                description: `Recording of ${call.title}`,
                url: recordingUrl,
                bunnyCdnUrl,
                duration: duration ? Math.round(duration) : null,
                fileSize: recordingBuffer.length,
                status: 'completed',
            },
        });

        console.log('💾 Recording saved to database:', recording.id);

        return NextResponse.json({
            success: true,
            recording: {
                id: recording.id,
                bunnyCdnUrl: recording.bunnyCdnUrl,
            },
        });

    } catch (error) {
        console.error('❌ Failed to save recording:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to save recording'
            },
            { status: 500 }
        );
    }
}
