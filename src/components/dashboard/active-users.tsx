'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, Phone, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    lastSeen?: string | null;
}

interface ActiveUsersProps {
    users: User[];
    currentUser: any;
}

export function ActiveUsers({ users: initialUsers, currentUser }: ActiveUsersProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [activeUsers, setActiveUsers] = useState<User[]>(initialUsers);

    // Poll for active users every 10 seconds
    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const response = await fetch('/api/users/active');
                if (response.ok) {
                    const data = await response.json();
                    setActiveUsers(data.users || []);
                }
            } catch (error) {
                console.error('Failed to fetch active users:', error);
            }
        };

        // Fetch immediately
        fetchActiveUsers();

        // Then poll every 10 seconds
        const interval = setInterval(fetchActiveUsers, 10000);

        return () => clearInterval(interval);
    }, [currentUser.id]);

    const handleCallUser = async (targetUser: User) => {
        setIsLoading(targetUser.id);
        try {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 mins

            const response = await fetch('/api/meetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Call with ${targetUser.firstName}`,
                    description: 'Direct call',
                    startTime,
                    endTime,
                    type: 'VIDEO_CALL',
                    status: 'IN_PROGRESS',
                    participants: [targetUser.id],
                    isPublic: false,
                    allowJoinBeforeHost: true,
                    recordMeeting: false
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to start call');
            }

            const data = await response.json();
            if (data.meeting?.id) {
                toast({
                    title: "Starting Call",
                    description: `Calling ${targetUser.firstName}...`,
                });
                // Redirect to meeting
                window.location.href = `/meetings/${data.meeting.id}`;
            }
        } catch (error) {
            console.error('Failed to start call:', error);
            toast({
                title: "Error",
                description: "Failed to start call. Please try again.",
                variant: "destructive",
            });
            setIsLoading(null);
        }
    };

    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                        Active Users
                    </div>
                    <span className="text-sm font-normal text-slate-400">
                        {activeUsers.length} online
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {activeUsers.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">
                        No active users right now
                    </p>
                ) : (
                    <div className="space-y-4">
                        {activeUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar || undefined} />
                                            <AvatarFallback>
                                                {user.firstName?.[0]}{user.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-slate-800 bg-green-500 animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white text-sm">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Online
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-slate-300 hover:text-white hover:bg-slate-600"
                                    onClick={() => handleCallUser(user)}
                                    disabled={isLoading === user.id}
                                >
                                    {isLoading === user.id ? (
                                        <span className="animate-spin">⌛</span>
                                    ) : (
                                        <Phone className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
