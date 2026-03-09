import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'Administrator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const settings = await request.json()

    // Validate required fields
    if (!settings.fromEmail || !settings.fromName) {
      return NextResponse.json({
        error: 'From email and from name are required'
      }, { status: 400 })
    }

    // For SMTP testing with Resend, we need an API key
    // If using custom SMTP, this endpoint should be updated to use nodemailer
    // For now, we'll use Resend if RESEND_API_KEY is available
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      return NextResponse.json({
        error: 'SMTP testing requires RESEND_API_KEY environment variable. Please configure Resend or use a different email service.'
      }, { status: 400 })
    }

    const resend = new Resend(resendApiKey)

    // Send test email using Resend
    const { data, error } = await resend.emails.send({
      from: `${settings.fromName} <${settings.fromEmail}>`,
      to: [session.user.email],
      subject: 'SMTP Test Email - Video Conference Manager',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Email Configuration Test</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3 style="margin-top: 0;">Configuration Details:</h3>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li><strong>From Email:</strong> ${settings.fromEmail}</li>
              <li><strong>From Name:</strong> ${settings.fromName}</li>
              <li><strong>Service:</strong> Resend</li>
            </ul>
          </div>
          <p>If you received this email, your email configuration is working correctly!</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated test email from the Video Conference Manager settings page.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({
        error: `Failed to send test email: ${error.message}`
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Test email sent successfully',
      details: {
        fromEmail: settings.fromEmail,
        fromName: settings.fromName,
        sentTo: session.user.email,
        emailId: data?.id,
      }
    })

  } catch (error) {
    console.error('Error testing email:', error)

    // Provide more specific error messages
    let errorMessage = 'Failed to send test email'

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json({
      error: errorMessage
    }, { status: 500 })
  }
} 