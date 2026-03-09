import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🌱 Starting database seed (meetings/recordings only, no departments/companies/users creation)...');

  // Resolve target company dynamically (prefer default company)

  // Load existing data instead of creating it
  const companies = await prisma.company.findMany({ select: { id: true, name: true, default: true } });
  const defaultCompany = companies.find((c: any) => c.default) || null;
  const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true, companyId: true, role: true } });
  const TARGET_COMPANY_ID = defaultCompany?.id || users[0]?.companyId || companies[0]?.id || null;
  const usersInTargetCompany = TARGET_COMPANY_ID ? users.filter((u: any) => u.companyId === TARGET_COMPANY_ID) : [];
  const contacts = await prisma.contact.findMany({ select: { id: true } });

  if (!TARGET_COMPANY_ID) {
    console.log('⚠️  No target company could be determined (no default company and no users/companies found). Aborting meetings seed.');
    return;
  }

  if (users.length === 0) {
    console.log('⚠️  Skipping meetings seed: need existing companies and users in DB.');
    console.log(`Companies: ${companies.length}, Users: ${users.length}`);
    return;
  }

  // Create 50 Greek meetings (calls) with past and future dates and demo stats
  const now = new Date();
  const greekTitles = [
    'Συνάντηση Εκτύπωσης',
    'Συνεργασία Ψηφιακών Εκτυπώσεων',
    'Παραγγελία Πελάτη',
    'Προσφορά Υπηρεσιών',
    'Παρουσίαση Δειγμάτων',
    'Χρονοπρογραμματισμός Παραγωγής',
    'Συνάντηση Παραγωγής',
    'Συντονισμός Έργου',
    'Έλεγχος Ποιότητας',
    'Επιβεβαίωση Τιμολογίου'
  ];
  const greekDescriptions = [
    'Συζήτηση για ανάγκες ψηφιακής εκτύπωσης και επιλογές χαρτιού.',
    'Αναλυτική παρουσίαση υπηρεσιών εκτύπωσης και ολοκληρώσεων.',
    'Δημιουργία προσφοράς για πινακίδες, φυλλάδια και επαγγελματικές κάρτες.',
    'Συντονισμός παραγγελίας με προθεσμία παράδοσης και ποιοτικό έλεγχο.',
    'Δοκιμαστικές εκτυπώσεις και επιβεβαίωση χρωμάτων (color proofing).',
    'Καθορισμός αρχείων εκτύπωσης και προδιαγραφών PDF/X.',
    'Ανασκόπηση παραγωγικού χρόνου και σταδίων φινιρίσματος.',
    'Έλεγχος μακετών και τεχνικών παρατηρήσεων πριν την παραγωγή.',
    'Συζήτηση για αποστολή, συσκευασία και παράδοση.',
    'Επιβεβαίωση τελικού κόστους και όρων πληρωμής.'
  ];

  console.log(`🗓️  Δημιουργία 50 ελληνικών συναντήσεων για εταιρεία ${TARGET_COMPANY_ID}...`);

  const allMeetingsRaw = await Promise.all(
    Array.from({ length: 50 }).map(async (_, i) => {
      const isPast = i < 25; // 25 παρελθόν, 25 μέλλον
      const daysOffset = isPast ? -(25 - i) : i - 24; // διασπορά γύρω από σήμερα
      const startTime = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000 + (i % 8) * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + (45 + (i % 60)) * 60 * 1000); // 45-105 λεπτά
      const title = `${greekTitles[i % greekTitles.length]} #${i + 1}`;
      const description = greekDescriptions[i % greekDescriptions.length];
      // pick a creator prioritizing users from the target company
      const pool = (usersInTargetCompany.length > 0 ? usersInTargetCompany : users);
      if (!pool || pool.length === 0) {
        return null as any;
      }
      const createdBy = pool[i % pool.length]!;
      const status = isPast ? 'ended' : 'scheduled';
      const type = 'meeting';

      const call = await prisma.call.create({
        data: {
          title,
          description,
          startTime,
          endTime,
          type,
          status,
          password: null,
          companyId: TARGET_COMPANY_ID,
          createdById: createdBy.id,
        },
      });

      // Add participants: host (creator), another user (if available), and a contact (if available)
      const participantsToCreate: { callId: string; userId?: string; contactId?: string; role: string }[] = [
        { callId: call.id, userId: createdBy.id, role: 'host' },
      ];
      const otherUser = pool.length > 1 ? pool[(i + 1) % pool.length] : undefined;
      if (otherUser && otherUser.id && otherUser.id !== createdBy.id) {
        participantsToCreate.push({ callId: call.id, userId: otherUser.id, role: 'participant' });
      }
      const contact = contacts.length > 0 ? contacts[i % contacts.length] : undefined;
      if (contact && contact.id) {
        participantsToCreate.push({ callId: call.id, contactId: contact.id, role: 'participant' });
      }

      await Promise.all(participantsToCreate.map(p => prisma.participant.create({ data: p })));

      // Demo stats: create a couple of events
      await Promise.all([
        prisma.event.create({
          data: {
            callId: call.id,
            userId: createdBy.id,
            type: isPast ? 'completed' : 'created',
            timestamp: startTime,
            metadata: { locale: 'el-GR' },
          },
        }),
        prisma.event.create({
          data: {
            callId: call.id,
            userId: createdBy.id,
            type: 'participants_count',
            timestamp: endTime,
            metadata: { total: participantsToCreate.length },
          },
        }),
      ]);

      return call;
    })
  );

  const allMeetings = allMeetingsRaw.filter((m: any): m is typeof allMeetingsRaw[number] => Boolean(m));

  console.log(`✅ Δημιουργήθηκαν ${allMeetings.length} συναντήσεις.`);

  // Create demo recordings for a subset of past meetings
  const greekRecordingTitles = [
    'Ηχογράφηση Συνάντησης',
    'Αρχειοθέτηση Βιντεοκλήσης',
    'Demo Εγγραφή',
    'Καταγραφή Παρουσίασης',
    'Εγγραφή Παραγωγής'
  ];

  const pastMeetings = allMeetings.filter((m: any) => (m.status === 'ended'));
  const recordingsToCreate = pastMeetings.slice(0, Math.min(15, pastMeetings.length));

  await Promise.all(
    recordingsToCreate.map((call: any, idx: number) =>
      prisma.recording.create({
        data: {
          callId: call.id,
          title: `${greekRecordingTitles[idx % greekRecordingTitles.length]} #${idx + 1}`,
          description: 'Δοκιμαστική εγγραφή για επίδειξη (χωρίς πραγματικό αρχείο).',
          url: null,
          bunnyCdnUrl: 'https://demo.invalid/recording.mp4', // placeholder χωρίς πραγματικό link
          duration: 30 * 60 + (idx % 15) * 60, // 30-44 λεπτά
          fileSize: 150 * 1024 * 1024 + (idx % 50) * 1024 * 1024, // ~150-200 MB
          status: 'completed',
        },
      })
    )
  );

  console.log('✅ Demo recordings created:', recordingsToCreate.length);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Default credentials:');
  console.log('Admin: admin@acme.com / admin123');
  console.log('Manager: manager@acme.com / manager123');
  console.log('User: user@acme.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 