import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

import { NavigationWrapper } from '@/components/layout/navigation-wrapper';
import { CreateMeetingButton } from '@/components/meetings/create-meeting-button';
import { MeetingsTable } from '@/components/meetings/meetings-table';

import { getAuthSession } from '@/lib/auth';
import { getMeetingsByCompany } from '@/lib/data/meetings';
import { getUsersByCompany } from '@/lib/data/users';
import { getContacts } from '@/lib/data/contacts';

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user;
  const isAdmin = user.role === 'Administrator';

  // Parse search parameters - await the searchParams first
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 10;
  const search = typeof params.search === 'string' ? params.search : '';
  const status = typeof params.status === 'string' ? params.status : '';
  const type = typeof params.type === 'string' ? params.type : '';



  // Fetch meetings server-side
  const meetings = await getMeetingsByCompany(
    user.companyId,
    isAdmin,
    {
      page,
      limit,
      search,
      status,
      type,
      userId: user.id,
    }
  );

  // Transform meetings data to match the MeetingsTable interface
  const transformedMeetings = meetings.data.map((meeting: any) => ({
    ...meeting,
    participants: meeting.participants.map((participant: any) => ({
      id: participant.id,
      userId: participant.userId,
      contactId: participant.contactId,
      role: participant.role,
      joinedAt: participant.joinedAt,
      leftAt: participant.leftAt,
      user: participant.user ? {
        id: participant.user.id,
        firstName: participant.user.firstName,
        lastName: participant.user.lastName,
        email: participant.user.email,
        avatar: null,
      } : undefined,
      contact: participant.contact ? {
        id: participant.contact.id,
        firstName: participant.contact.firstName,
        lastName: participant.contact.lastName,
        email: participant.contact.email || '',
        avatarUrl: null,
      } : undefined,
    }))
  }));

  // Fetch users for the meeting modal
  const users = await getUsersByCompany(
    user.companyId,
    isAdmin,
    {
      limit: 100, // Get enough users for the modal
    }
  );

  // Fetch ALL contacts for the meeting modal
  const rawContacts = await getContacts();

  // Transform contacts to match the expected interface (with companyId)
  const contacts = rawContacts.map((contact: any) => ({
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email || '',
    companyId: contact.companies[0]?.companyId || user.companyId, // Use first company or fallback to user's company
  }));

  console.log('🔍 Debug: ALL contacts in database:', rawContacts.length);
  console.log('🔍 Debug: Transformed contacts:', contacts.length);

  return (
    <div className="min-h-screen bg-black">
      <NavigationWrapper user={user} />

      <main className="container-responsive py-6 pt-24">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Video Conferences</h1>
              <p className="text-slate-400">
                Manage and join your video conferences powered by WebRTC
              </p>
            </div>
            <CreateMeetingButton user={user} users={users.data} contacts={contacts} />
          </div>

          {/* Meetings Table */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <MeetingsTable
              currentFilters={{
                limit,
                page,
                search,
                status,
                type,
              }}
              meetings={transformedMeetings}
              pagination={meetings.pagination}
              user={user}
              users={users.data}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 