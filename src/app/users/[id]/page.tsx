import { redirect, notFound } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { getUserById } from '@/lib/data/users';
import { getMeetingsByUser } from '@/lib/data/meetings';
import { getDepartmentsByCompany } from '@/lib/data/departments';
import { NavigationWrapper } from '@/components/layout/navigation-wrapper';
import { UserProfile } from '@/components/users/user-profile';

interface UserProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/login');
  }

  const currentUser = session.user;
  const { id } = await params;

  // Check permissions
  const canViewProfile = 
    currentUser.id === id || 
    currentUser.role === 'Administrator' || 
    currentUser.role === 'Manager';

  if (!canViewProfile) {
    redirect('/users');
  }

  // Fetch user data
  const user = await getUserById(id, currentUser.companyId);

  if (!user) {
    notFound();
  }

  // Fetch user's meetings
  const meetings = await getMeetingsByUser(id, {
    page: 1,
    limit: 50,
  });

  // Fetch departments for profile editing
  const departments = await getDepartmentsByCompany(currentUser.companyId, {
    page: 1,
    limit: 100,
  });

  return (
    <div className="min-h-screen bg-background">
      <NavigationWrapper user={currentUser} />
      
      <main className="container-responsive py-6">
        <UserProfile 
          user={user}
          currentUser={currentUser}
          meetings={meetings.data}
          departments={departments.data}
        />
      </main>
    </div>
  );
} 