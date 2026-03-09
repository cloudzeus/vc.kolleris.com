'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IncomingCall {
    id: string;
    title: string;
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string | null;
    };
}

export function IncomingCallListener() {
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [isPolling, setIsPolling] = useState(true);
    const [ignoredCallIds, setIgnoredCallIds] = useState<Set<string>>(new Set());
    const router = useRouter();
    const { toast } = useToast();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element for ringtone
        audioRef.current = new Audio('/ring.mp3');
        audioRef.current.loop = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (incomingCall && audioRef.current) {
            // Play sound - requires user interaction on page usually, so might fail
            audioRef.current.play().catch(e => console.log('Audio play failed (user interaction needed):', e));
        } else if (!incomingCall && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [incomingCall]);

    useEffect(() => {
        if (!isPolling) return;

        const pollInterval = setInterval(async () => {
            try {
                // Don't poll if we're already in a meeting
                if (window.location.pathname.startsWith('/meetings/')) {
                    return;
                }

                const response = await fetch('/api/users/incoming-calls');
                if (response.ok) {
                    const data = await response.json();
                    if (data.calls && data.calls.length > 0) {
                        const call = data.calls[0];

                        // Skip if we already ignored/accepted this call
                        if (ignoredCallIds.has(call.id)) {
                            return;
                        }

                        // Only set if it's a new call or different from current
                        setIncomingCall(prev => prev?.id === call.id ? prev : call);
                    } else {
                        setIncomingCall(null);
                    }
                }
            } catch (error) {
                console.error('Error polling for calls:', error);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(pollInterval);
    }, [isPolling, ignoredCallIds]);

    const handleAccept = () => {
        if (!incomingCall) return;

        // Mark as ignored so we don't get notified again
        setIgnoredCallIds(prev => new Set(prev).add(incomingCall.id));

        // Stop polling and sound
        setIsPolling(false);
        if (audioRef.current) audioRef.current.pause();

        // Redirect to meeting
        router.push(`/meetings/${incomingCall.id}`);
        setIncomingCall(null);
    };

    const handleDecline = async () => {
        if (!incomingCall) return;

        const callId = incomingCall.id;
        setIgnoredCallIds(prev => new Set(prev).add(callId));
        setIncomingCall(null);
        if (audioRef.current) audioRef.current.pause();

        try {
            await fetch(`/api/meetings/${callId}/decline`, {
                method: 'POST',
            });
            toast({
                title: "Call Declined",
                description: "You declined the incoming call.",
            });
        } catch (error) {
            console.error('Error declining call:', error);
        }
    };

    if (!incomingCall) return null;

    return (
        <Dialog open={!!incomingCall} onOpenChange={(open) => !open && handleDecline()}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Incoming Video Call</DialogTitle>
                    <DialogDescription className="text-center text-slate-400">
                        {incomingCall.createdBy.firstName} is calling you...
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-slate-800 shadow-xl">
                            <AvatarImage src={incomingCall.createdBy.avatar || undefined} />
                            <AvatarFallback className="text-2xl bg-slate-700 text-white">
                                {incomingCall.createdBy.firstName[0]}{incomingCall.createdBy.lastName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full animate-pulse">
                            <Video className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-semibold">
                            {incomingCall.createdBy.firstName} {incomingCall.createdBy.lastName}
                        </h3>
                        <p className="text-sm text-slate-400">
                            Incoming video call...
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex flex-row justify-center gap-4 sm:justify-center">
                    <Button
                        variant="destructive"
                        size="lg"
                        className="rounded-full w-16 h-16 p-0 bg-red-600 hover:bg-red-700"
                        onClick={handleDecline}
                    >
                        <PhoneOff className="h-8 w-8" />
                        <span className="sr-only">Decline</span>
                    </Button>

                    <Button
                        variant="default"
                        size="lg"
                        className="rounded-full w-16 h-16 p-0 bg-green-600 hover:bg-green-700 animate-bounce"
                        onClick={handleAccept}
                    >
                        <Phone className="h-8 w-8" />
                        <span className="sr-only">Accept</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
