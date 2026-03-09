import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const MAIN_COMPANY_ID = 'cmmjbyx4z00000ld4rdrzcfoc'

interface CompanyDef {
  COMPANY: string
  name: string
  type: 'client' | 'supplier'
  AFM?: string
  IRSDATA?: string
  address?: string
  city?: string
  ZIP?: string
  country: string
  PHONE01?: string
  PHONE02?: string
  email?: string
  EMAILACC?: string
  website?: string
  JOBTYPE?: string
}

const companies: CompanyDef[] = [
  // ── ΠΡΟΜΗΘΕΥΤΕΣ (Suppliers) ────────────────────────
  {
    COMPANY: 'FACOM-GR', name: 'FACOM - Stanley Black & Decker Hellas',
    type: 'supplier', AFM: '094079886', IRSDATA: 'ΦΑΕ ΑΘΗΝΩΝ',
    address: 'Λεωφ. Βουλιαγμένης 128', city: 'Γλυφάδα', ZIP: '16674', country: 'Greece',
    PHONE01: '210 8985600', email: 'info@stanleyblackanddecker.gr',
    EMAILACC: 'orders@stanleyblackanddecker.gr', website: 'www.facom.com',
    JOBTYPE: 'Εργαλεία χειρός & βιομηχανικά',
  },
  {
    COMPANY: 'WERA-DE', name: 'Wera Werkzeuge GmbH',
    type: 'supplier', AFM: 'DE811518268', IRSDATA: 'Finanzamt Wuppertal',
    address: 'Korzerter Straße 21-25', city: 'Wuppertal', ZIP: '42349', country: 'Germany',
    PHONE01: '+49 202 4045 0', email: 'info@wera.de',
    EMAILACC: 'export@wera.de', website: 'www.wera.de',
    JOBTYPE: 'Κατσαβίδια, καστάνιες, μύτες',
  },
  {
    COMPANY: 'KNIPEX-DE', name: 'KNIPEX-Werk C. Gustav Putsch KG',
    type: 'supplier', AFM: 'DE120501884', IRSDATA: 'Finanzamt Wuppertal-Barmen',
    address: 'Oberkamper Straße 13', city: 'Wuppertal', ZIP: '42349', country: 'Germany',
    PHONE01: '+49 202 4794 0', email: 'info@knipex.de',
    EMAILACC: 'export@knipex.de', website: 'www.knipex.com',
    JOBTYPE: 'Πένσες, κόφτες, πενσοκλείδα',
  },
  {
    COMPANY: 'GEDORE-DE', name: 'GEDORE Werkzeugfabrik GmbH & Co. KG',
    type: 'supplier', AFM: 'DE124798765', IRSDATA: 'Finanzamt Remscheid',
    address: 'Remscheider Straße 149', city: 'Remscheid', ZIP: '42899', country: 'Germany',
    PHONE01: '+49 2191 596 0', email: 'info@gedore.de',
    EMAILACC: 'export@gedore.com', website: 'www.gedore.com',
    JOBTYPE: 'Δυναμόκλειδα, κλειδιά, καρυδάκια',
  },
  {
    COMPANY: 'BAHCO-SE', name: 'SNA Europe (Bahco)',
    type: 'supplier', AFM: 'SE556012748101', IRSDATA: 'Skatteverket Enköping',
    address: 'Bryggerivägen 5', city: 'Enköping', ZIP: '74982', country: 'Sweden',
    PHONE01: '+46 171 81000', email: 'info@bahco.com',
    EMAILACC: 'orders@snaeurope.com', website: 'www.bahco.com',
    JOBTYPE: 'Πριόνια, λίμες, κλειδιά',
  },
  {
    COMPANY: 'BETA-IT', name: 'Beta Utensili S.p.A.',
    type: 'supplier', AFM: 'IT00760080152', IRSDATA: 'Agenzia Entrate Sovico',
    address: 'Via Volta 18', city: 'Sovico (MB)', ZIP: '20845', country: 'Italy',
    PHONE01: '+39 039 2071 1', email: 'info@beta-tools.com',
    EMAILACC: 'export@beta-tools.com', website: 'www.beta-tools.com',
    JOBTYPE: 'Εργαλεία, εργαλειοφόροι, αεροεργαλεία',
  },
  {
    COMPANY: 'STAHLWILLE-DE', name: 'STAHLWILLE Eduard Wille GmbH & Co. KG',
    type: 'supplier', AFM: 'DE119550832', IRSDATA: 'Finanzamt Wuppertal',
    address: 'Lindenallee 27', city: 'Wuppertal', ZIP: '42349', country: 'Germany',
    PHONE01: '+49 202 4791 0', email: 'info@stahlwille.de',
    EMAILACC: 'export@stahlwille.de', website: 'www.stahlwille.de',
    JOBTYPE: 'Ροπόκλειδα, καρυδάκια, κλειδιά',
  },

  // ── ΠΕΛΑΤΕΣ (Clients) - Ελληνικές εταιρείες ────────
  {
    COMPANY: 'OLYMPMECH', name: 'Ολυμπιακή Μηχανική Α.Ε.',
    type: 'client', AFM: '094567123', IRSDATA: 'ΔΟΥ Πειραιά',
    address: 'Ακτή Μιαούλη 85', city: 'Πειραιάς', ZIP: '18538', country: 'Greece',
    PHONE01: '210 4123456', PHONE02: '210 4123457', email: 'info@olympmech.gr',
    EMAILACC: 'logistirio@olympmech.gr', website: 'www.olympmech.gr',
    JOBTYPE: 'Βιομηχανικές εγκαταστάσεις',
  },
  {
    COMPANY: 'ZAFEIROPOULOS', name: 'Ζαφειρόπουλος Electric Ε.Π.Ε.',
    type: 'client', AFM: '099887654', IRSDATA: 'ΔΟΥ Αμαρουσίου',
    address: 'Λεωφ. Κηφισίας 234', city: 'Μαρούσι', ZIP: '15123', country: 'Greece',
    PHONE01: '210 6145500', email: 'info@zafeiropoulos-electric.gr',
    EMAILACC: 'accounts@zafeiropoulos-electric.gr',
    JOBTYPE: 'Ηλεκτρολογικές εγκαταστάσεις',
  },
  {
    COMPANY: 'TITANIND', name: 'ΤΙΤΑΝ Βιομηχανική Α.Ε.',
    type: 'client', AFM: '094321876', IRSDATA: 'ΦΑΕ ΑΘΗΝΩΝ',
    address: 'Χαλκίδος 22Α', city: 'Αθήνα', ZIP: '10432', country: 'Greece',
    PHONE01: '210 5204000', email: 'procurement@titan-ind.gr',
    EMAILACC: 'logistirio@titan-ind.gr', website: 'www.titan-ind.gr',
    JOBTYPE: 'Βαριά βιομηχανία, τσιμέντο',
  },
  {
    COMPANY: 'ELKOELECT', name: 'ΕΛΚΟ Ηλεκτρικά Α.Ε.',
    type: 'client', AFM: '094876234', IRSDATA: 'ΔΟΥ Θεσσαλονίκης',
    address: '26ης Οκτωβρίου 90', city: 'Θεσσαλονίκη', ZIP: '54627', country: 'Greece',
    PHONE01: '2310 654321', email: 'info@elko-electric.gr',
    EMAILACC: 'finance@elko-electric.gr',
    JOBTYPE: 'Ηλεκτρολογικές εγκαταστάσεις, πίνακες',
  },
  {
    COMPANY: 'MARINOSKIDS', name: 'Μαρίνος & Υιοί Ο.Ε.',
    type: 'client', AFM: '082345678', IRSDATA: 'ΔΟΥ Λάρισας',
    address: 'Παπαναστασίου 42', city: 'Λάρισα', ZIP: '41222', country: 'Greece',
    PHONE01: '2410 287654', email: 'info@marinos-tools.gr',
    EMAILACC: 'logistirio@marinos-tools.gr',
    JOBTYPE: 'Εμπόριο εργαλείων, σιδηρικά',
  },
  {
    COMPANY: 'AUTOTECH-PA', name: 'AutoTech Πάτρα Μ.Ε.Π.Ε.',
    type: 'client', AFM: '800654321', IRSDATA: 'ΔΟΥ Πατρών',
    address: 'Κορίνθου 156', city: 'Πάτρα', ZIP: '26221', country: 'Greece',
    PHONE01: '2610 345678', email: 'service@autotech-patra.gr',
    JOBTYPE: 'Συνεργείο αυτοκινήτων, ανταλλακτικά',
  },
  {
    COMPANY: 'METALWORKS', name: 'Μεταλλουργική Κρήτης Α.Ε.',
    type: 'client', AFM: '094765432', IRSDATA: 'ΔΟΥ Ηρακλείου',
    address: 'ΒΙΠΕ Ηρακλείου, Θέση 14', city: 'Ηράκλειο', ZIP: '71601', country: 'Greece',
    PHONE01: '2810 302100', email: 'info@metalworks-crete.gr',
    EMAILACC: 'accounting@metalworks-crete.gr', website: 'www.metalworks-crete.gr',
    JOBTYPE: 'Μεταλλικές κατασκευές, CNC',
  },
  {
    COMPANY: 'ERGOSAFE', name: 'ErgoSafe Ελλάς Ε.Π.Ε.',
    type: 'client', AFM: '800123987', IRSDATA: 'ΔΟΥ Αγ. Δημητρίου',
    address: 'Βουλιαγμένης 510', city: 'Ηλιούπολη', ZIP: '16341', country: 'Greece',
    PHONE01: '210 9923456', email: 'orders@ergosafe.gr',
    EMAILACC: 'finance@ergosafe.gr', website: 'www.ergosafe.gr',
    JOBTYPE: 'Μέσα ατομικής προστασίας, εργαλεία VDE',
  },
  {
    COMPANY: 'PLOUMIDIS', name: 'Πλουμίδης Εργαλεία & Μηχανήματα',
    type: 'client', AFM: '047654321', IRSDATA: 'ΔΟΥ Ιωαννίνων',
    address: 'Δωδώνης 88', city: 'Ιωάννινα', ZIP: '45332', country: 'Greece',
    PHONE01: '26510 78900', email: 'info@ploumidis-tools.gr',
    JOBTYPE: 'Λιανικό εμπόριο εργαλείων',
  },
  {
    COMPANY: 'PROTOOLS-SKG', name: 'ProTools Θεσσαλονίκη Α.Ε.',
    type: 'client', AFM: '094234567', IRSDATA: 'ΔΟΥ ΦΑΕ Θεσσαλονίκης',
    address: 'Μοναστηρίου 220', city: 'Θεσσαλονίκη', ZIP: '54628', country: 'Greece',
    PHONE01: '2310 512345', PHONE02: '2310 512346', email: 'sales@protools-skg.gr',
    EMAILACC: 'logistirio@protools-skg.gr', website: 'www.protools-skg.gr',
    JOBTYPE: 'Χονδρική εργαλείων, βιομηχανικός εξοπλισμός',
  },
  {
    COMPANY: 'NAVTECH', name: 'NavTech Marine Services Α.Ε.',
    type: 'client', AFM: '094555888', IRSDATA: 'ΔΟΥ Πλοίων Πειραιά',
    address: 'Ακτή Ποσειδώνος 28', city: 'Πειραιάς', ZIP: '18531', country: 'Greece',
    PHONE01: '210 4297100', email: 'procurement@navtech-marine.gr',
    EMAILACC: 'accounts@navtech-marine.gr', website: 'www.navtech-marine.gr',
    JOBTYPE: 'Ναυτιλιακά, εργαλεία πλοίων',
  },
  {
    COMPANY: 'SOLARTECHGR', name: 'SolarTech Ενεργειακά Συστήματα Α.Ε.',
    type: 'client', AFM: '800987654', IRSDATA: 'ΔΟΥ Χαλανδρίου',
    address: 'Αγ. Παρασκευής 56', city: 'Χαλάνδρι', ZIP: '15234', country: 'Greece',
    PHONE01: '210 6877000', email: 'info@solartech.gr',
    EMAILACC: 'finance@solartech.gr', website: 'www.solartech.gr',
    JOBTYPE: 'Φωτοβολταϊκά, ηλεκτρικές εγκαταστάσεις',
  },
]

interface ContactDef {
  firstName: string
  lastName: string
  title?: string
  profession?: string
  email?: string
  phone?: string
  mobile?: string
  city?: string
  country: string
  companyCode: string // links to COMPANY code above
}

const contacts: ContactDef[] = [
  // Facom / SBD Hellas
  { firstName: 'Νίκος', lastName: 'Παπαδόπουλος', title: 'Διευθυντής Πωλήσεων',
    profession: 'Sales Director', email: 'n.papadopoulos@stanleyblackanddecker.gr',
    phone: '210 8985610', mobile: '694 1234567', city: 'Γλυφάδα', country: 'Greece', companyCode: 'FACOM-GR' },
  { firstName: 'Ελένη', lastName: 'Καραγιάννη', title: 'Key Account Manager',
    profession: 'Account Manager', email: 'e.karagianni@stanleyblackanddecker.gr',
    phone: '210 8985620', mobile: '697 2345678', city: 'Γλυφάδα', country: 'Greece', companyCode: 'FACOM-GR' },

  // Wera
  { firstName: 'Thomas', lastName: 'Müller', title: 'Export Manager Southern Europe',
    profession: 'Export Manager', email: 't.mueller@wera.de',
    phone: '+49 202 4045 100', mobile: '+49 170 5551234', city: 'Wuppertal', country: 'Germany', companyCode: 'WERA-DE' },

  // Knipex
  { firstName: 'Klaus', lastName: 'Bergmann', title: 'Area Sales Manager Greece/Balkans',
    profession: 'Regional Sales', email: 'k.bergmann@knipex.de',
    phone: '+49 202 4794 150', mobile: '+49 171 6661234', city: 'Wuppertal', country: 'Germany', companyCode: 'KNIPEX-DE' },
  { firstName: 'Κατερίνα', lastName: 'Αλεξίου', title: 'Agent Ελλάδας Knipex',
    profession: 'Commercial Agent', email: 'k.alexiou@knipex-greece.gr',
    mobile: '693 4567890', city: 'Αθήνα', country: 'Greece', companyCode: 'KNIPEX-DE' },

  // Gedore
  { firstName: 'Stefan', lastName: 'Weber', title: 'International Sales Director',
    profession: 'Sales Director', email: 's.weber@gedore.com',
    phone: '+49 2191 596 200', city: 'Remscheid', country: 'Germany', companyCode: 'GEDORE-DE' },

  // Bahco
  { firstName: 'Erik', lastName: 'Johansson', title: 'Sales Manager Mediterranean',
    profession: 'Sales Manager', email: 'e.johansson@snaeurope.com',
    phone: '+46 171 81050', city: 'Enköping', country: 'Sweden', companyCode: 'BAHCO-SE' },

  // Beta
  { firstName: 'Marco', lastName: 'Rossi', title: 'Export Manager',
    profession: 'Export Manager', email: 'm.rossi@beta-tools.com',
    phone: '+39 039 2071 200', city: 'Sovico', country: 'Italy', companyCode: 'BETA-IT' },

  // Stahlwille
  { firstName: 'Andrea', lastName: 'Fischer', title: 'Sales Representative Greece',
    profession: 'Sales Rep', email: 'a.fischer@stahlwille.de',
    phone: '+49 202 4791 120', city: 'Wuppertal', country: 'Germany', companyCode: 'STAHLWILLE-DE' },

  // ── CONTACTS ΠΕΛΑΤΩΝ ───────────────────────────────
  // Ολυμπιακή Μηχανική
  { firstName: 'Γιώργος', lastName: 'Αντωνίου', title: 'Τεχνικός Διευθυντής',
    profession: 'Technical Director', email: 'g.antoniou@olympmech.gr',
    phone: '210 4123460', mobile: '694 7654321', city: 'Πειραιάς', country: 'Greece', companyCode: 'OLYMPMECH' },
  { firstName: 'Μαρία', lastName: 'Σταυροπούλου', title: 'Προϊσταμένη Αγορών',
    profession: 'Procurement Manager', email: 'm.stavropoulou@olympmech.gr',
    phone: '210 4123461', city: 'Πειραιάς', country: 'Greece', companyCode: 'OLYMPMECH' },

  // Ζαφειρόπουλος Electric
  { firstName: 'Κώστας', lastName: 'Ζαφειρόπουλος', title: 'Ιδιοκτήτης / CEO',
    profession: 'Owner', email: 'k.zafeiropoulos@zafeiropoulos-electric.gr',
    phone: '210 6145501', mobile: '693 1112233', city: 'Μαρούσι', country: 'Greece', companyCode: 'ZAFEIROPOULOS' },

  // ΤΙΤΑΝ Βιομηχανική
  { firstName: 'Αθανάσιος', lastName: 'Λιάκος', title: 'Διευθυντής Συντήρησης',
    profession: 'Maintenance Director', email: 'a.liakos@titan-ind.gr',
    phone: '210 5204050', mobile: '697 4445566', city: 'Αθήνα', country: 'Greece', companyCode: 'TITANIND' },
  { firstName: 'Δήμητρα', lastName: 'Παππά', title: 'Τμήμα Προμηθειών',
    profession: 'Procurement', email: 'd.pappa@titan-ind.gr',
    phone: '210 5204060', city: 'Αθήνα', country: 'Greece', companyCode: 'TITANIND' },

  // ΕΛΚΟ Ηλεκτρικά
  { firstName: 'Παναγιώτης', lastName: 'Ελευθεριάδης', title: 'Γενικός Διευθυντής',
    profession: 'General Manager', email: 'p.eleftheriadis@elko-electric.gr',
    phone: '2310 654322', mobile: '698 7778899', city: 'Θεσσαλονίκη', country: 'Greece', companyCode: 'ELKOELECT' },

  // Μαρίνος & Υιοί
  { firstName: 'Σπύρος', lastName: 'Μαρίνος', title: 'Ιδιοκτήτης',
    profession: 'Owner', email: 's.marinos@marinos-tools.gr',
    phone: '2410 287655', mobile: '693 5556677', city: 'Λάρισα', country: 'Greece', companyCode: 'MARINOSKIDS' },

  // AutoTech Πάτρα
  { firstName: 'Ανδρέας', lastName: 'Γεωργακόπουλος', title: 'Αρχιτεχνίτης',
    profession: 'Head Mechanic', email: 'a.georgakopoulos@autotech-patra.gr',
    phone: '2610 345679', mobile: '694 8889900', city: 'Πάτρα', country: 'Greece', companyCode: 'AUTOTECH-PA' },

  // Μεταλλουργική Κρήτης
  { firstName: 'Εμμανουήλ', lastName: 'Χατζηδάκης', title: 'Διευθυντής Παραγωγής',
    profession: 'Production Director', email: 'e.chatzidakis@metalworks-crete.gr',
    phone: '2810 302110', mobile: '694 3334455', city: 'Ηράκλειο', country: 'Greece', companyCode: 'METALWORKS' },

  // ErgoSafe
  { firstName: 'Χριστίνα', lastName: 'Δημητρίου', title: 'HSE Manager',
    profession: 'Health Safety Environment', email: 'c.dimitriou@ergosafe.gr',
    phone: '210 9923457', mobile: '697 6667788', city: 'Ηλιούπολη', country: 'Greece', companyCode: 'ERGOSAFE' },

  // Πλουμίδης
  { firstName: 'Θεόδωρος', lastName: 'Πλουμίδης', title: 'Ιδιοκτήτης',
    profession: 'Owner', email: 't.ploumidis@ploumidis-tools.gr',
    phone: '26510 78901', mobile: '693 2223344', city: 'Ιωάννινα', country: 'Greece', companyCode: 'PLOUMIDIS' },

  // ProTools SKG
  { firstName: 'Βασίλης', lastName: 'Τσαμπίκος', title: 'Εμπορικός Διευθυντής',
    profession: 'Commercial Director', email: 'v.tsampikos@protools-skg.gr',
    phone: '2310 512347', mobile: '698 1112233', city: 'Θεσσαλονίκη', country: 'Greece', companyCode: 'PROTOOLS-SKG' },
  { firstName: 'Άννα', lastName: 'Κωνσταντινίδου', title: 'Αγορές & Logistics',
    profession: 'Purchasing', email: 'a.konstantinidou@protools-skg.gr',
    phone: '2310 512348', city: 'Θεσσαλονίκη', country: 'Greece', companyCode: 'PROTOOLS-SKG' },

  // NavTech Marine
  { firstName: 'Ιωάννης', lastName: 'Μαρκόπουλος', title: 'Technical Superintendent',
    profession: 'Marine Engineer', email: 'i.markopoulos@navtech-marine.gr',
    phone: '210 4297110', mobile: '694 5556677', city: 'Πειραιάς', country: 'Greece', companyCode: 'NAVTECH' },

  // SolarTech
  { firstName: 'Αλέξανδρος', lastName: 'Οικονόμου', title: 'Τεχνικός Υπεύθυνος',
    profession: 'Technical Lead', email: 'a.oikonomou@solartech.gr',
    phone: '210 6877010', mobile: '697 9990011', city: 'Χαλάνδρι', country: 'Greece', companyCode: 'SOLARTECHGR' },
]

async function seed() {
  console.log('Seeding companies & contacts...')

  // Create companies
  const companyMap = new Map<string, string>() // COMPANY code -> id
  let companyCount = 0

  for (const c of companies) {
    const existing = await prisma.company.findUnique({ where: { COMPANY: c.COMPANY } })
    if (existing) {
      companyMap.set(c.COMPANY, existing.id)
      console.log(`  ⏭  Company "${c.name}" already exists, skipping`)
      continue
    }

    const created = await prisma.company.create({
      data: {
        COMPANY: c.COMPANY,
        name: c.name,
        type: c.type,
        AFM: c.AFM,
        IRSDATA: c.IRSDATA,
        address: c.address,
        city: c.city,
        ZIP: c.ZIP,
        country: c.country,
        PHONE01: c.PHONE01,
        PHONE02: c.PHONE02,
        email: c.email,
        EMAILACC: c.EMAILACC,
        website: c.website,
        JOBTYPE: c.JOBTYPE,
        SODTYPE: c.type === 'client' ? '13' : '12',
      },
    })
    companyMap.set(c.COMPANY, created.id)
    companyCount++
  }
  console.log(`✅ Created ${companyCount} companies`)

  // Create contacts + link to companies
  let contactCount = 0
  for (const ct of contacts) {
    const companyId = companyMap.get(ct.companyCode)
    if (!companyId) {
      console.warn(`  ⚠ Company code "${ct.companyCode}" not found for contact ${ct.firstName} ${ct.lastName}`)
      continue
    }

    const contact = await prisma.contact.create({
      data: {
        firstName: ct.firstName,
        lastName: ct.lastName,
        title: ct.title,
        profession: ct.profession,
        email: ct.email,
        phone: ct.phone,
        mobile: ct.mobile,
        city: ct.city,
        country: ct.country,
      },
    })

    await prisma.contactCompany.create({
      data: {
        contactId: contact.id,
        companyId: companyId,
      },
    })

    // Also link to main company (ΑΦΟΙ ΚΟΛΛΕΡΗ) so they're visible
    if (companyId !== MAIN_COMPANY_ID) {
      await prisma.contactCompany.create({
        data: {
          contactId: contact.id,
          companyId: MAIN_COMPANY_ID,
        },
      })
    }

    contactCount++
  }
  console.log(`✅ Created ${contactCount} contacts (linked to companies)`)

  await prisma.$disconnect()
  console.log('Done!')
}

seed().catch(e => {
  console.error('Seed error:', e)
  process.exit(1)
})
