import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getAuthSession } from '@/lib/auth';
import { LoginForm } from '@/components/auth/login-form';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://vculture.b-cdn.net/media/envato_video_gen_Dec_04_2025_5_23_36.mp4" type="video/mp4" />
      </video>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center space-y-6 mb-8">
            {/* Video Manager Logo */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-4 shadow-2xl">
                <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points="10,9 10,15 15,12" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
                Video Manager
              </h1>
              <p className="text-xl text-white/90 font-light">
                Welcome Back
              </p>
            </div>
          </div>

          {/* Login Card with Glassmorphism */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            }>
              <LoginForm />
            </Suspense>
          </div>

          {/* Footer */}
          <p className="text-center text-white/70 text-sm mt-6">
            Secure video conferencing platform
          </p>
        </div>
      </div>
    </div>
  );
}