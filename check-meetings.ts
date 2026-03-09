import { prisma } from './src/lib/prisma'

async function checkMeetings() {
    try {
        console.log('🔍 Checking all meetings in database...\n')

        const allMeetings = await prisma.call.findMany({
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        })

        console.log(`Found ${allMeetings.length} recent meetings:\n`)

        allMeetings.forEach((meeting: any, index: number) => {
            console.log(`Meeting ${index + 1}:`)
            console.log(`  ID: ${meeting.id}`)
            console.log(`  Title: ${meeting.title}`)
            console.log(`  Status: "${meeting.status}" (type: ${typeof meeting.status})`)
            console.log(`  Start Time: ${meeting.startTime}`)
            console.log(`  Is Future: ${meeting.startTime > new Date()}`)
            console.log(`  Created By: ${meeting.createdBy.firstName} ${meeting.createdBy.lastName} (${meeting.createdById})`)
            console.log(`  Participants: ${meeting.participants.length}`)
            meeting.participants.forEach((p: any) => {
                console.log(`    - User: ${p.user?.firstName} ${p.user?.lastName} (${p.userId}) - Role: ${p.role}`)
            })
            console.log(`  Company ID: ${meeting.companyId}`)
            console.log('')
        })

        // Check what getUpcomingMeetings would return
        console.log('\n🔍 Testing getUpcomingMeetings query...\n')

        const now = new Date()
        const upcomingMeetings = await prisma.call.findMany({
            where: {
                startTime: { gte: now },
                status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                participants: true
            }
        })

        console.log(`Found ${upcomingMeetings.length} upcoming meetings with status SCHEDULED or IN_PROGRESS:\n`)
        upcomingMeetings.forEach((meeting: any, index: number) => {
            console.log(`${index + 1}. ${meeting.title} - Status: "${meeting.status}" - Start: ${meeting.startTime}`)
        })

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkMeetings()
