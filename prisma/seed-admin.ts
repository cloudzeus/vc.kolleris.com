import { prisma } from '../src/lib/prisma'
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function main() {
    console.log('🌱 Seeding admin user...');

    // Create a default company first
    const company = await prisma.company.upsert({
        where: { COMPANY: 'DEFAULT' },
        update: {},
        create: {
            COMPANY: 'DEFAULT',
            name: 'Default Company',
            type: 'Technology',
            default: true,
        },
    });

    console.log('✅ Company created:', company.name);

    // Hash the password
    const hashedPassword = await bcrypt.hash('1f1femsk', 10);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'gkozyris@i4ria.com' },
        update: {
            password: hashedPassword,
            role: 'Administrator',
        },
        create: {
            email: 'gkozyris@i4ria.com',
            password: hashedPassword,
            firstName: 'George',
            lastName: 'Kozyris',
            role: 'Administrator',
            companyId: company.id,
            isActive: true,
        },
    });

    console.log('✅ Admin user created:', admin.email);
    console.log('\n📋 Login credentials:');
    console.log('Email: gkozyris@i4ria.com');
    console.log('Password: 1f1femsk');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
