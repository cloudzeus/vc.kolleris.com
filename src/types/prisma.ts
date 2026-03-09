// Shared types for components that need Prisma-like types
// These are defined manually to avoid importing from @prisma/client in client components

export type Contact = {
    id: string
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    mobile: string | null
    workPhone: string | null
    title: string | null
    profession: string | null
    address: string | null
    city: string | null
    zip: string | null
    country: string | null
    avatarUrl: string | null
    createdAt: Date
    updatedAt: Date
}

export type Company = {
    id: string
    COMPANY: string
    LOCKID: string | null
    SODTYPE: string | null
    name: string
    type: string
    address: string | null
    city: string | null
    country: string | null
    phone: string | null
    email: string | null
    website: string | null
    logo: string | null
    createdAt: Date
    updatedAt: Date
    AFM: string | null
    CODE: string | null
    EMAILACC: string | null
    INSDATE: Date | null
    IRSDATA: string | null
    JOBTYPE: string | null
    PHONE01: string | null
    PHONE02: string | null
    TRDR: string | null
    UPDDATE: Date | null
    ZIP: string | null
    default: boolean
}

export type Department = {
    id: string
    name: string
    description: string | null
    companyId: string
    createdAt: Date
    updatedAt: Date
}

export type ContactWithCompanies = Contact & {
    companies: {
        company: Company
    }[]
}
