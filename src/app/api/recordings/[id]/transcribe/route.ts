import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { summarizeMeeting } from '@/lib/deepseek';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: recordingId } = await params;

        // Find the recording
        const recording = await prisma.recording.findFirst({
            where: {
                id: recordingId,
            },
            include: {
                call: {
                    include: {
                        company: true,
                    }
                }
            }
        });

        if (!recording) {
            return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
        }

        // Check if user has access to this recording
        const hasAccess = await prisma.call.findFirst({
            where: {
                id: recording.callId,
                OR: [
                    { createdById: session.user.id },
                    { participants: { some: { userId: session.user.id } } }
                ]
            }
        });

        if (!hasAccess && session.user.role !== 'Administrator') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        console.log('🎙️ Starting transcription for recording:', recordingId);

        // Download the video file from Bunny CDN
        const videoUrl = recording.bunnyCdnUrl || recording.url;
        if (!videoUrl) {
            return NextResponse.json({ error: 'No video URL available' }, { status: 400 });
        }

        console.log('📥 Downloading video from:', videoUrl);
        const videoResponse = await fetch(videoUrl);
        if (!videoResponse.ok) {
            throw new Error('Failed to download video');
        }

        const videoBuffer = await videoResponse.arrayBuffer();
        console.log('📥 Video downloaded, size:', videoBuffer.byteLength, 'bytes');

        // Create a File object for OpenAI API
        const videoFile = new File([videoBuffer], 'recording.mp4', { type: 'video/mp4' });

        console.log('🎙️ Sending to OpenAI Whisper for transcription...');

        // Transcribe using OpenAI Whisper with auto language detection
        const transcription = await openai.audio.transcriptions.create({
            file: videoFile,
            model: 'whisper-1',
            // Remove language parameter to enable auto-detection
            response_format: 'verbose_json',
            timestamp_granularities: ['segment']
        });

        console.log('✅ Transcription completed');
        console.log('🌍 Detected language:', transcription.language);
        console.log('📝 Transcript length:', transcription.text.length, 'characters');

        // Extract the text
        const transcriptText = transcription.text;

        // Generate summary using DeepSeek
        console.log('📝 Generating summary with DeepSeek in', transcription.language, '...');
        const summary = await summarizeMeeting(transcriptText, transcription.language);
        console.log('✅ Summary generated');

        // Update the call with transcription, summary, and language
        await prisma.call.update({
            where: { id: recording.callId },
            data: {
                transcription: transcriptText,
                summary: summary,
                language: transcription.language,
            }
        });

        console.log('💾 Saved transcription and summary to database');

        return NextResponse.json({
            success: true,
            transcription: transcriptText,
            summary: summary,
            segments: transcription.segments || [],
        });

    } catch (error) {
        console.error('❌ Transcription error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to transcribe recording'
            },
            { status: 500 }
        );
    }
}
