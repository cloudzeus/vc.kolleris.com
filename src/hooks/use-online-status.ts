import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useOnlineStatus() {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user) return;

        const sendHeartbeat = async () => {
            try {
                await fetch('/api/users/heartbeat', { method: 'POST' });
            } catch (error) {
                console.error('Failed to send heartbeat:', error);
            }
        };

        // Send immediately
        sendHeartbeat();

        // Send every minute
        const interval = setInterval(sendHeartbeat, 60 * 1000);

        return () => clearInterval(interval);
    }, [session]);
}
