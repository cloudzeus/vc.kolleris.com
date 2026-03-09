import { auth as nextAuth } from '@/lib/auth'

// Export auth for use in middleware (edge runtime compatible)
export const auth = nextAuth

// Re-export for convenience
export { getAuthSession } from '@/lib/auth'
