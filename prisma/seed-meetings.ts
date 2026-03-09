import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const COMPANY_ID = 'cmmjbyx4z00000ld4rdrzcfoc'

const USERS = {
  george:    'cmmjbyxc000010ld4phz2okfu',  // George Kozyris - Admin
  dimitris:  'cmmjcckn600056qd4ybrzs7h1',  // Δημήτρης Κολλέρης - Admin
  lamprini:  'cmmjcdnf000066qd4wucww5eh',  // Λαμπρινή Τριάντου - Manager
  alex:      'cmmjcez5h00076qd4crvk1epa',  // Αλέξανδρος Κολλέρης - Employee (warehouse)
  thanasis:  'cmmjcgbcw00086qd4u4ynpcym',  // Αθανάσιος Στάμος - Contact
  dgoumas:   'cmmjchg8k00096qd4wqxh89ip',  // Δημήτρης Γκούμας - Contact
  chronis:   'cmmjciqsp000a6qd4opxrlh7p',  // Χρόνης Δερτιλής - Employee (marketing)
}

interface MeetingDef {
  title: string
  description: string
  daysAgo?: number
  daysAhead?: number
  durationMin: number
  createdBy: string
  participants: string[]
  status: 'ended' | 'scheduled' | 'cancelled'
}

const meetings: MeetingDef[] = [
  // ── FACOM ──────────────────────────────────────────
  {
    title: 'Παρουσίαση νέας σειράς Facom V.2 κλειδιών',
    description: 'Παρουσίαση της νέας σειράς γερμανοπολύγωνων κλειδιών Facom V.2 με anti-slip grip. Σύγκριση με προηγούμενη σειρά, τιμολογιακή πολιτική και ελάχιστη ποσότητα παραγγελίας.',
    daysAgo: 90, durationMin: 45, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.alex, USERS.lamprini], status: 'ended',
  },
  {
    title: 'Facom - Έλεγχος αποθεμάτων & αναπαραγγελίες Q4',
    description: 'Ανασκόπηση αποθεμάτων εργαλείων Facom (καστάνιες SL/SH, σειρά 440, μύτες). Καθορισμός ποσοτήτων αναπαραγγελίας για Q4 και εορταστική περίοδο.',
    daysAgo: 75, durationMin: 60, createdBy: USERS.lamprini,
    participants: [USERS.lamprini, USERS.alex, USERS.dimitris], status: 'ended',
  },
  {
    title: 'Σεμινάριο Facom ροπόκλειδα & δυναμομετρικά',
    description: 'Εκπαίδευση προσωπικού στη σειρά Facom E.306 ηλεκτρονικών ροπόκλειδων. Σωστή χρήση, βαθμονόμηση, αποθήκευση και παρουσίαση στον πελάτη.',
    daysAgo: 60, durationMin: 90, createdBy: USERS.george,
    participants: [USERS.george, USERS.alex, USERS.chronis, USERS.dimitris], status: 'ended',
  },
  {
    title: 'Facom - Προσφορά συνεργείου "Ολυμπιακή Μηχανική"',
    description: 'Ετοιμασία προσφοράς για εξοπλισμό συνεργείου: εργαλειοφόρος JET+, σειρά μυτοτσίμπιδων, σετ κλειδιών 440 & καστάνιες R.161. Deadline Παρασκευή.',
    daysAgo: 45, durationMin: 40, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.lamprini], status: 'ended',
  },
  {
    title: 'Facom Module αεροεργαλείων - Τιμοκατάλογος 2025',
    description: 'Ανάλυση νέου τιμοκαταλόγου αεροεργαλείων Facom V.360/V.400. Σύγκριση ανταγωνιστικών τιμών, περιθώριο κέρδους, στρατηγική πωλήσεων.',
    daysAgo: 30, durationMin: 55, createdBy: USERS.lamprini,
    participants: [USERS.lamprini, USERS.dimitris, USERS.george], status: 'ended',
  },

  // ── WERA ───────────────────────────────────────────
  {
    title: 'Wera - Εισαγωγή σειράς Kraftform Kompakt',
    description: 'Παρουσίαση σειράς Wera Kraftform Kompakt (σετ μύτες, κατσαβίδια ακριβείας, Zyklop Speed). Positioning vs Facom, target group συνεργεία αυτοκινήτων.',
    daysAgo: 85, durationMin: 50, createdBy: USERS.george,
    participants: [USERS.george, USERS.dimitris, USERS.chronis], status: 'ended',
  },
  {
    title: 'Wera Zyklop Speed - Demo & εκπαίδευση πωλήσεων',
    description: 'Hands-on demo με Wera Zyklop Speed καστάνιες 8100 SA/SC. Εκπαίδευση ομάδας πωλήσεων σε USP (switch-all ratchet, free-turning sleeve). Ετοιμασία pitch πελατών.',
    daysAgo: 70, durationMin: 75, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.alex, USERS.chronis, USERS.george], status: 'ended',
  },
  {
    title: 'Wera - Αξιολόγηση παραγγελίας & χρόνοι παράδοσης',
    description: 'Follow-up παραγγελίας Wera Γερμανίας. Ελλείψεις σε Joker κλειδιά, Tool-Check PLUS. Εναλλακτικές αποστολής, ενημέρωση πελατών σε αναμονή.',
    daysAgo: 40, durationMin: 35, createdBy: USERS.lamprini,
    participants: [USERS.lamprini, USERS.dimitris], status: 'ended',
  },
  {
    title: 'Wera Advent Calendar 2025 - Marketing plan',
    description: 'Σχεδιασμός καμπάνιας για Wera Advent Calendar 2025. Social media posts, email blast, προ-παραγγελίες, in-store displays. Budget & timeline.',
    daysAgo: 20, durationMin: 45, createdBy: USERS.chronis,
    participants: [USERS.chronis, USERS.dimitris, USERS.george], status: 'ended',
  },

  // ── KNIPEX ─────────────────────────────────────────
  {
    title: 'Knipex - Νέα σειρά πενσών TwinForce 2025',
    description: 'Παρουσίαση Knipex TwinForce (διπλή μόχλευση, 30% λιγότερη δύναμη). Σύγκριση με Cobra, Pliers Wrench. Τιμές εισαγωγής & positioning.',
    daysAgo: 80, durationMin: 50, createdBy: USERS.george,
    participants: [USERS.george, USERS.dimitris, USERS.alex], status: 'ended',
  },
  {
    title: 'Knipex Cobra & Pliers Wrench - Αποθήκη restock',
    description: 'Έλεγχος αποθήκης Knipex: Cobra 87 01, Pliers Wrench 86 05, Raptor 87 22. Παραγγελία fast-movers, ποσότητες ανά κωδικό, lead times.',
    daysAgo: 55, durationMin: 40, createdBy: USERS.alex,
    participants: [USERS.alex, USERS.lamprini, USERS.dimitris], status: 'ended',
  },
  {
    title: 'Knipex VDE ηλεκτρολογικά εργαλεία - Εκπαίδευση',
    description: 'Σεμινάριο ασφαλείας VDE 1000V εργαλείων Knipex. Κανονισμοί, σωστή χρήση, ημερομηνίες ελέγχου. Παρουσίαση σετ VDE για ηλεκτρολόγους.',
    daysAgo: 35, durationMin: 60, createdBy: USERS.george,
    participants: [USERS.george, USERS.alex, USERS.chronis, USERS.dimitris, USERS.lamprini], status: 'ended',
  },
  {
    title: 'Knipex - Παράπονο πελάτη "Ζαφειρόπουλος Electric"',
    description: 'Αντιμετώπιση παραπόνου για ελαττωματικό Knipex 71 72 610 κόφτη μπουλονιών. Διαδικασία RMA, αντικατάσταση, ενημέρωση πελάτη.',
    daysAgo: 15, durationMin: 25, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.lamprini], status: 'ended',
  },

  // ── GEDORE ─────────────────────────────────────────
  {
    title: 'Gedore Red vs Blue Line - Στρατηγική positioning',
    description: 'Σύγκριση Gedore Red (entry-level) vs Blue (professional). Ποιο κοινό στοχεύουμε, τιμολόγηση, margin analysis, shelf space αποθήκης.',
    daysAgo: 95, durationMin: 55, createdBy: USERS.george,
    participants: [USERS.george, USERS.dimitris, USERS.lamprini], status: 'ended',
  },
  {
    title: 'Gedore - Παραλαβή & ποιοτικός έλεγχος παραγγελίας',
    description: 'Παραλαβή παραγγελίας Gedore (δυναμόκλειδα Dremaster, σωληνόκλειδα, σετ καρυδάκια). Δειγματοληπτικός έλεγχος, καταγραφή ελλείψεων.',
    daysAgo: 65, durationMin: 40, createdBy: USERS.alex,
    participants: [USERS.alex, USERS.lamprini], status: 'ended',
  },
  {
    title: 'Gedore Dremaster ροπόκλειδα - Βαθμονόμηση & service',
    description: 'Εκπαίδευση στη βαθμονόμηση Gedore Dremaster (8560-01/8561-01). Πιστοποιημένα κέντρα, διαδικασία αποστολής, κόστος & χρόνος επιστροφής.',
    daysAgo: 50, durationMin: 70, createdBy: USERS.george,
    participants: [USERS.george, USERS.alex, USERS.dimitris], status: 'ended',
  },
  {
    title: 'Gedore - Προσφορά εργοστασίου "ΤΙΤΑΝ Βιομηχανική"',
    description: 'Μεγάλη προσφορά Gedore Blue για βιομηχανική μονάδα: σετ εργαλείων, εργαλειοφόρος, ειδικά εργαλεία συντήρησης. Budget πελάτη €15K.',
    daysAgo: 25, durationMin: 50, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.lamprini, USERS.george], status: 'ended',
  },

  // ── ΑΠΟΘΗΚΗ & LOGISTICS ─────────────────────────────
  {
    title: 'Αναδιοργάνωση αποθήκης - Zone mapping εργαλείων',
    description: 'Χαρτογράφηση ζωνών αποθήκης: Zone A (fast-movers Facom/Knipex), Zone B (Wera/Gedore), Zone C (εποχιακά, προσφορές). Σήμανση ραφιών, barcode.',
    daysAgo: 100, durationMin: 90, createdBy: USERS.alex,
    participants: [USERS.alex, USERS.dimitris, USERS.lamprini, USERS.george], status: 'ended',
  },
  {
    title: 'Απογραφή αποθήκης - Τέλος Φεβρουαρίου',
    description: 'Προετοιμασία ετήσιας φυσικής απογραφής. Κατανομή ομάδων, checklist ανά brand, καταγραφή αποκλίσεων, deadline αποστολής στο λογιστήριο.',
    daysAgo: 10, durationMin: 45, createdBy: USERS.lamprini,
    participants: [USERS.lamprini, USERS.alex, USERS.dimitris], status: 'ended',
  },
  {
    title: 'Βελτιστοποίηση picking αποθήκης - KPIs & targets',
    description: 'Ανάλυση χρόνων picking, σφαλμάτων αποστολής, returns. Στόχοι Q2: μείωση picking time κατά 15%, λάθη <1%. Action plan & follow-up.',
    daysAgo: 5, durationMin: 50, createdBy: USERS.george,
    participants: [USERS.george, USERS.alex, USERS.lamprini], status: 'ended',
  },

  // ── ΕΚΠΑΙΔΕΥΣΗ & TRAINING ──────────────────────────
  {
    title: 'Onboarding εκπαίδευση - Νέος υπάλληλος αποθήκης',
    description: 'Εκπαίδευση νέου υπαλλήλου: κατηγορίες εργαλείων, κωδικολογία brands, WMS σύστημα, διαδικασίες παραλαβής/αποστολής, ασφάλεια χώρου.',
    daysAgo: 88, durationMin: 120, createdBy: USERS.alex,
    participants: [USERS.alex, USERS.george, USERS.dimitris], status: 'ended',
  },
  {
    title: 'Product training - Νέα εργαλεία αυτοκινήτου 2025',
    description: 'Παρουσίαση automotive εργαλείων 2025: Facom τροχήλατοι, Knipex πενσοκλειδά αυτοκινήτου, Wera Joker. Target market: συνεργεία, αντιπροσωπείες.',
    daysAgo: 42, durationMin: 80, createdBy: USERS.george,
    participants: [USERS.george, USERS.dimitris, USERS.chronis, USERS.alex], status: 'ended',
  },
  {
    title: 'Εκπαίδευση e-shop - Φωτογράφιση & περιγραφές εργαλείων',
    description: 'Workshop: φωτογράφιση εργαλείων για e-shop, σύνταξη τεχνικών περιγραφών, SEO keywords, τιμολόγηση online vs κατάστημα.',
    daysAgo: 28, durationMin: 60, createdBy: USERS.chronis,
    participants: [USERS.chronis, USERS.george, USERS.dimitris], status: 'ended',
  },
  {
    title: 'Ασφάλεια εργασίας - Εκπαίδευση χειρισμού εργαλείων',
    description: 'Ετήσιο σεμινάριο ασφαλείας: χρήση ηλεκτρικών εργαλείων, PPE, σωστή αποθήκευση, πυρασφάλεια, πρώτες βοήθειες. Υποχρεωτική παρακολούθηση.',
    daysAgo: 18, durationMin: 90, createdBy: USERS.george,
    participants: [USERS.george, USERS.dimitris, USERS.alex, USERS.chronis, USERS.lamprini], status: 'ended',
  },

  // ── ΓΕΝΙΚΑ ΕΜΠΟΡΙΚΑ ────────────────────────────────
  {
    title: 'Εβδομαδιαία σύσκεψη πωλήσεων - W09',
    description: 'Weekly review: νέες παραγγελίες, εκκρεμότητες, follow-ups πελατών. Pipeline ανά brand, στόχοι εβδομάδας, ανάθεση tasks.',
    daysAgo: 7, durationMin: 30, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.lamprini, USERS.chronis, USERS.george], status: 'ended',
  },
  {
    title: 'Μηνιαία αναφορά πωλήσεων Φεβρουαρίου',
    description: 'Review πωλήσεων Φεβρουαρίου: ανά brand (Facom, Wera, Knipex, Gedore), ανά κατηγορία, top sellers, στόχοι vs πραγματοποιήσεις. Budget Μαρτίου.',
    daysAgo: 3, durationMin: 60, createdBy: USERS.lamprini,
    participants: [USERS.lamprini, USERS.dimitris, USERS.george], status: 'ended',
  },

  // ── ΜΕΛΛΟΝΤΙΚΑ MEETINGS ─────────────────────────────
  {
    title: 'Facom - Παρουσίαση καλοκαιρινής προσφοράς 2026',
    description: 'Σχεδιασμός καλοκαιρινής καμπάνιας Facom: bundle offers, δωρεάν εργαλειοθήκη με αγορά >€500, flyer design, social media plan.',
    daysAhead: 3, durationMin: 50, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.chronis, USERS.lamprini], status: 'scheduled',
  },
  {
    title: 'Wera - Συνάντηση με αντιπρόσωπο Ελλάδας',
    description: 'Meeting με τον αντιπρόσωπο Wera Ελλάδας: νέες κατηγορίες, αποκλειστικότητα, διαφημιστικό υλικό, στόχοι 2026, bonus scheme.',
    daysAhead: 7, durationMin: 60, createdBy: USERS.george,
    participants: [USERS.george, USERS.dimitris, USERS.lamprini], status: 'scheduled',
  },
  {
    title: 'Knipex - Live demo σε πελάτη "ΕΛΚΟ Ηλεκτρικά"',
    description: 'On-site παρουσίαση Knipex VDE & Cobra σειράς σε εταιρεία ηλεκτρολογικών εγκαταστάσεων. Στόχος: παραγγελία εξοπλισμού 20 τεχνικών.',
    daysAhead: 10, durationMin: 90, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.alex, USERS.chronis], status: 'scheduled',
  },
  {
    title: 'Gedore Red - Σχεδιασμός promo ράφι καταστήματος',
    description: 'Σχεδιασμός Gedore Red promotional display: ράφι δαπέδου, σήμανση, τιμές, bundle offers για DIY πελάτες. Παραγγελία υλικού.',
    daysAhead: 14, durationMin: 45, createdBy: USERS.chronis,
    participants: [USERS.chronis, USERS.dimitris, USERS.george], status: 'scheduled',
  },
  {
    title: 'Ετήσια αξιολόγηση προμηθευτών εργαλείων',
    description: 'Ετήσια αξιολόγηση brands: lead times, ποιότητα, margin, returns rate, support. Scorecard ανά προμηθευτή, αποφάσεις για 2026 lineup.',
    daysAhead: 21, durationMin: 75, createdBy: USERS.george,
    participants: [USERS.george, USERS.dimitris, USERS.lamprini, USERS.alex], status: 'scheduled',
  },
  {
    title: 'Εκπαίδευση νέου WMS - Αποθήκη v2.0',
    description: 'Training σε νέο Warehouse Management System: barcode scanning, real-time stock, auto-reorder, analytics dashboard. Hands-on session.',
    daysAhead: 28, durationMin: 120, createdBy: USERS.george,
    participants: [USERS.george, USERS.alex, USERS.lamprini, USERS.dimitris], status: 'scheduled',
  },
  {
    title: 'Q2 2026 - Στόχοι πωλήσεων & budget planning',
    description: 'Καθορισμός στόχων Q2: revenue targets ανά brand, marketing budget, νέα προϊόντα, hiring plan, capex αποθήκης.',
    daysAhead: 35, durationMin: 90, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.george, USERS.lamprini, USERS.chronis], status: 'scheduled',
  },

  // ── ΑΚΥΡΩΜΕΝΑ ──────────────────────────────────────
  {
    title: 'Συνάντηση με Snap-on αντιπρόσωπο (ΑΚΥΡΩΘΗΚΕ)',
    description: 'Αξιολόγηση εισαγωγής Snap-on στο portfolio. Ακυρώθηκε λόγω ασύμφορων όρων εισαγωγής και υψηλών ελάχιστων ποσοτήτων.',
    daysAgo: 48, durationMin: 60, createdBy: USERS.george,
    participants: [USERS.george, USERS.dimitris], status: 'cancelled',
  },
  {
    title: 'Επίσκεψη πελάτη "Μαρίνος & Υιοί" (ΑΝΑΒΛΗΘΗΚΕ)',
    description: 'Αναβλήθηκε λόγω ασθένειας πελάτη. Θα επαναπρογραμματιστεί εντός Μαρτίου.',
    daysAgo: 12, durationMin: 45, createdBy: USERS.dimitris,
    participants: [USERS.dimitris, USERS.chronis], status: 'cancelled',
  },
]

async function seed() {
  console.log(`Seeding ${meetings.length} meetings...`)

  const now = new Date()
  let created = 0

  for (const m of meetings) {
    const offsetDays = m.daysAgo ? -m.daysAgo : (m.daysAhead || 0)
    const hour = 9 + (created % 8) // 09:00 - 16:00
    const startTime = new Date(now)
    startTime.setDate(startTime.getDate() + offsetDays)
    startTime.setHours(hour, (created % 4) * 15, 0, 0) // vary minutes: 00/15/30/45

    const endTime = new Date(startTime.getTime() + m.durationMin * 60 * 1000)

    const call = await prisma.call.create({
      data: {
        title: m.title,
        description: m.description,
        startTime,
        endTime: m.status === 'ended' ? endTime : null,
        type: 'meeting',
        status: m.status,
        companyId: COMPANY_ID,
        createdById: m.createdBy,
      },
    })

    // Host participant
    await prisma.participant.create({
      data: { callId: call.id, userId: m.createdBy, role: 'host' },
    })

    // Other participants
    for (const uid of m.participants.filter(p => p !== m.createdBy)) {
      await prisma.participant.create({
        data: { callId: call.id, userId: uid, role: 'participant' },
      })
    }

    // Events for ended meetings
    if (m.status === 'ended') {
      await prisma.event.create({
        data: {
          callId: call.id,
          userId: m.createdBy,
          type: 'started',
          timestamp: startTime,
          metadata: { locale: 'el-GR' },
        },
      })
      await prisma.event.create({
        data: {
          callId: call.id,
          userId: m.createdBy,
          type: 'completed',
          timestamp: endTime,
          metadata: { duration: m.durationMin, participantsCount: m.participants.length },
        },
      })
    }

    created++
    process.stdout.write(`\r  ${created}/${meetings.length}`)
  }

  // Demo recordings for some past meetings
  const pastCalls = await prisma.call.findMany({
    where: { companyId: COMPANY_ID, status: 'ended' },
    orderBy: { startTime: 'desc' },
    take: 8,
    select: { id: true, title: true, startTime: true },
  })

  let recCount = 0
  for (const call of pastCalls) {
    await prisma.recording.create({
      data: {
        callId: call.id,
        title: `Εγγραφή - ${call.title}`,
        description: 'Αυτόματη εγγραφή σύσκεψης.',
        status: 'completed',
        duration: 30 * 60 + (recCount % 10) * 5 * 60,
        fileSize: 120 * 1024 * 1024 + (recCount % 8) * 20 * 1024 * 1024,
      },
    })
    recCount++
  }

  console.log(`\n✅ Created ${created} meetings, ${recCount} recordings.`)
  await prisma.$disconnect()
}

seed().catch(e => {
  console.error('Seed error:', e)
  process.exit(1)
})
