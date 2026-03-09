'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, CircleDot, StopCircle, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface StreamMeetingRoomProps {
  meeting: any;
  user: any;
  isHost: boolean;
  isAdmin: boolean;
}

// Separate component to use hooks inside StreamCall context
const ParticipantList = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div className="h-full bg-gray-800 p-4 border-l border-gray-700 overflow-y-auto w-80">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Users className="h-4 w-4" />
        Participants ({participants.length})
      </h3>
      <div className="space-y-2">
        {participants.map((p) => (
          <div key={p.sessionId} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-700/50">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-medium">
                  {p.name?.[0] || '?'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {p.name} {p.isLocalParticipant && '(You)'}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-gray-400 text-xs">
                  {p.roles.includes('host') ? 'Host' : 'Participant'}
                </p>
                {p.isLocalParticipant && (
                  <Badge variant="secondary" className="text-[10px] h-4 px-1">Local</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function StreamMeetingRoomSimple({ meeting, user, isHost, isAdmin }: StreamMeetingRoomProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Only initialize Stream when we have a valid session
    if (status === 'loading' || !session?.user) {
      return;
    }

    let myClient: StreamVideoClient | null = null;
    let myCall: any = null;

    const initializeStream = async () => {
      try {
        setIsJoining(true);
        setError(null);

        // Get Stream token from your API
        const response = await fetch('/api/stream/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ callId: meeting.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get Stream token');
        }

        const { token, apiKey } = await response.json();

        // Create Stream client
        const streamClient = new StreamVideoClient({
          apiKey,
          user: {
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            image: user.avatar,
          },
          token,
        });

        myClient = streamClient;
        setClient(streamClient);

        // Create and join call
        const streamCall = streamClient.call('default', meeting.id);
        await streamCall.join({ create: true });

        myCall = streamCall;
        setCall(streamCall);

        setIsJoining(false);
      } catch (err: any) {
        console.error('Failed to initialize Stream:', err);
        setError(err.message || 'Failed to connect to video call');
        setIsJoining(false);
      }
    };

    initializeStream();

    return () => {
      if (myCall) {
        myCall.leave().catch((err: any) => {
          // Ignore error if call was already left
          console.log('Call cleanup:', err.message);
        });
      }
      if (myClient) {
        myClient.disconnectUser().catch((err: any) => {
          console.log('Client cleanup:', err.message);
        });
      }
      setCall(null);
      setClient(null);
    };
  }, [meeting.id, user.id, user.firstName, user.lastName, user.avatar, session, status]);

  useEffect(() => {
    if (!call) return;

    // Listen for recording events
    const unsubscribeRecordingStarted = call.on('call.recording_started', () => setIsRecording(true));
    const unsubscribeRecordingStopped = call.on('call.recording_stopped', () => setIsRecording(false));

    // Listen for call ended
    const unsubscribeCallEnded = call.on('call.ended', () => {
      toast({ title: 'Call Ended', description: 'The call has been ended.' });
      router.push('/');
    });

    // Check initial recording state if available
    if (call.state?.recording) {
      setIsRecording(true);
    }

    return () => {
      unsubscribeRecordingStarted();
      unsubscribeRecordingStopped();
      unsubscribeCallEnded();
    };
  }, [call, router, toast]);

  const toggleRecording = async () => {
    if (!call) return;
    try {
      if (isRecording) {
        // Stop recording
        console.log('🛑 Stopping recording...');
        await call.stopRecording();
        toast({ title: 'Recording Stopped', description: 'Processing recording...' });

        // Wait for Stream to finalize the recording
        setTimeout(async () => {
          try {
            console.log('🔍 Querying recordings from Stream...');
            console.log('📞 Call ID:', meeting.id);
            console.log('📞 Stream Call ID:', call.id);

            // Query recordings from Stream API
            const recordings = await call.queryRecordings();
            console.log('📹 Raw recordings response:', JSON.stringify(recordings, null, 2));

            if (recordings && recordings.recordings && recordings.recordings.length > 0) {
              const latestRecording = recordings.recordings[recordings.recordings.length - 1];
              console.log('📹 Latest recording details:', {
                url: latestRecording.url,
                filename: latestRecording.filename,
                duration: latestRecording.duration_seconds,
                status: latestRecording.status
              });

              if (latestRecording.url) {
                // Save to Bunny CDN via our API
                console.log('☁️ Saving to Bunny CDN...');
                console.log('📤 Request payload:', {
                  callId: meeting.id,
                  recordingUrl: latestRecording.url,
                  duration: latestRecording.duration_seconds,
                });

                const saveResponse = await fetch('/api/recordings/save', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    callId: meeting.id,
                    recordingUrl: latestRecording.url,
                    duration: latestRecording.duration_seconds,
                  }),
                });

                const result = await saveResponse.json();
                console.log('📥 Save response:', result);

                if (saveResponse.ok) {
                  toast({
                    title: 'Recording Saved',
                    description: 'Recording has been saved successfully.'
                  });
                  console.log('✅ Recording saved successfully:', result);
                } else {
                  console.error('❌ Save failed with status:', saveResponse.status);
                  console.error('❌ Error details:', result);
                  throw new Error(result.error || 'Failed to save recording');
                }
              } else {
                console.warn('⚠️ Recording URL not available yet');
                console.warn('⚠️ Recording object:', latestRecording);
                toast({
                  title: 'Processing',
                  description: 'Recording is still being processed by Stream. Please check back in a few minutes.',
                  variant: 'default'
                });
              }
            } else {
              console.warn('⚠️ No recordings found in response');
              console.warn('⚠️ Full response:', recordings);
              toast({
                title: 'Processing',
                description: 'Recording is being processed. It will appear in the Recordings page soon.',
                variant: 'default'
              });
            }
          } catch (saveError) {
            console.error('❌ Failed to save recording:', saveError);
            console.error('❌ Error stack:', saveError instanceof Error ? saveError.stack : 'No stack');
            toast({
              title: 'Error',
              description: saveError instanceof Error ? saveError.message : 'Failed to save recording',
              variant: 'destructive'
            });
          }
        }, 10000); // Wait 10 seconds for Stream to process

      } else {
        // Start recording
        try {
          await call.startRecording();
          toast({ title: 'Recording Started', description: 'The meeting is now being recorded.' });
        } catch (startError: any) {
          // Handle "already recording" error
          if (startError?.message?.includes('already being recorded')) {
            console.log('Recording already in progress');
            toast({
              title: 'Already Recording',
              description: 'This call is already being recorded.',
              variant: 'default'
            });
          } else {
            throw startError;
          }
        }
      }
    } catch (e: any) {
      console.error('Failed to toggle recording:', e);
      const errorMessage = e?.message || 'Failed to toggle recording';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Card className="w-96 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-red-400">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">You must be logged in to join this video conference.</p>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Card className="w-96 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-red-400">Connection Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!client || !call || isJoining) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{isJoining ? 'Connecting to meeting...' : 'Initializing video call...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-white font-semibold">{meeting.title}</h1>
            <p className="text-gray-400 text-sm">
              {isHost ? 'Host' : 'Participant'} • Meeting ID: {meeting.id}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Recording Button */}
          {(isHost || isAdmin) && (
            <Button
              variant={isRecording ? "destructive" : "secondary"}
              size="sm"
              onClick={toggleRecording}
              className="gap-2"
            >
              {isRecording ? (
                <>
                  <StopCircle className="h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <CircleDot className="h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          )}

          <Badge variant="default" className="bg-green-600 hover:bg-green-700">Active</Badge>
          {isHost && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Host
            </Badge>
          )}
        </div>
      </div>

      {/* Stream Video Component */}
      <div className="flex-1 overflow-hidden">
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <StreamTheme className="h-full">
              <div className="h-full flex flex-row">
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 relative">
                    <SpeakerLayout participantsBarPosition="bottom" />
                  </div>
                  <CallControls onLeave={() => router.push('/')} />
                </div>

                {/* Participant List Sidebar inside StreamTheme */}
                <ParticipantList />
              </div>
            </StreamTheme>
          </StreamCall>
        </StreamVideo>
      </div>
    </div>
  );
}
