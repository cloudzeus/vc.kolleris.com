import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

import { getAuthSession } from '@/lib/auth';
import { getRecentMeetings, getUpcomingMeetings, getQuickStats } from '@/lib/data/meetings';
import { getCompanyStats } from '@/lib/data/companies';
import { getUserStats, getUsersByCompany } from '@/lib/data/users';
import { getContactsByCompany } from '@/lib/data/contacts';
import { NavigationWrapper } from '@/components/layout/navigation-wrapper';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentMeetings } from '@/components/dashboard/recent-meetings';
import { UpcomingMeetings } from '@/components/dashboard/upcoming-meetings';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ActiveUsers } from '@/components/dashboard/active-users';

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user;
  const isAdmin = user.role === 'Administrator';
  const isManager = user.role === 'Manager';

  let recentMeetings, upcomingMeetings, meetingStats, companyStats, userStats, usersData, contacts;

  try {
    [
      recentMeetings,
      upcomingMeetings,
      meetingStats,
      companyStats,
      userStats,
      usersData,
      contacts
    ] = await Promise.all([
      getRecentMeetings(user.id, user.companyId, isAdmin),
      getUpcomingMeetings(user.id, user.companyId, isAdmin),
      getQuickStats(user.companyId, isAdmin, user.id),
      isAdmin ? getCompanyStats() : null,
      isAdmin ? getUserStats() : null,
      getUsersByCompany(user.companyId, true, { limit: 100 }),
      getContactsByCompany(user.companyId),
    ]);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    redirect('/login');
  }

  const users = usersData.data;

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const activeUsers = users.filter((u: any) =>
    u.lastSeen && new Date(u.lastSeen) > fiveMinutesAgo
  );

    return (
      <div className="min-h-screen bg-black">
        <NavigationWrapper user={user} />

        {/* Gradient Header */}
        <div className="w-full h-20 bg-gradient-to-r from-purple-600 via-pink-500 via-orange-400 via-yellow-400 to-green-400 flex items-center px-8 mt-16">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user.firstName}!
          </h1>
        </div>

        <main className="container-responsive py-6">
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions
              user={user}
              users={users}
              contacts={contacts}
            />

            {/* Statistics */}
            <DashboardStats
              meetingStats={meetingStats}
              companyStats={companyStats}
              userStats={userStats}
              isAdmin={isAdmin}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RecentMeetings meetings={recentMeetings} />
                  <UpcomingMeetings meetings={upcomingMeetings} />
                </div>

                {/* Additional sections based on role */}
                {isAdmin && (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">System Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex justify-between p-3 bg-slate-900/50 rounded border border-slate-700">
                        <span className="text-slate-400">Total Companies</span>
                        <span className="font-medium text-white">{companyStats?.totalCompanies || 0}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-900/50 rounded border border-slate-700">
                        <span className="text-slate-400">Active Users</span>
                        <span className="font-medium text-white">{userStats?.active || 0}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-900/50 rounded border border-slate-700">
                        <span className="text-slate-400">Total Meetings</span>
                        <span className="font-medium text-white">{meetingStats?.totalMeetings || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                <ActiveUsers users={activeUsers} currentUser={user} />

                {isManager && (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Department</h3>
                    <p className="text-slate-400 text-sm">
                      Manage your department's meetings and team members.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
}