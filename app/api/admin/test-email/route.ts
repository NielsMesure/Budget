import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, template } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Get email configuration
    const [configRows] = await pool.query(
      'SELECT config_key, config_value FROM email_config WHERE config_key IN (?, ?, ?, ?)',
      ['brevo_api_key', 'brevo_sender_name', 'brevo_sender_email', 'smtp_enabled']
    ) as any

    const config: Record<string, string> = {}
    configRows.forEach((row: any) => {
      config[row.config_key] = row.config_value || ''
    })

    if (!config.brevo_api_key) {
      return NextResponse.json({ error: 'Brevo API key not configured' }, { status: 400 })
    }

    if (config.smtp_enabled !== 'true') {
      return NextResponse.json({ error: 'Email sending is disabled' }, { status: 400 })
    }

    // Get template
    const [templateRows] = await pool.query(
      'SELECT * FROM email_templates WHERE template_key = ? AND is_active = 1',
      [template || 'account_creation']
    ) as any

    if (templateRows.length === 0) {
      return NextResponse.json({ error: 'Email template not found' }, { status: 404 })
    }

    const emailTemplate = templateRows[0]

    // Replace variables with test data
    const testData = {
      userName: 'Utilisateur Test',
      userEmail: email,
      resetCode: '123456',
      expirationTime: '15 minutes'
    }

    let subject = emailTemplate.subject
    let htmlContent = emailTemplate.html_content
    let textContent = emailTemplate.text_content

    Object.entries(testData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, value)
      htmlContent = htmlContent.replace(regex, value)
      textContent = textContent.replace(regex, value)
    })

    // Send email via Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': config.brevo_api_key
      },
      body: JSON.stringify({
        sender: {
          name: config.brevo_sender_name,
          email: config.brevo_sender_email
        },
        to: [{ email: email }],
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent
      })
    })

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text()
      console.error('Brevo API error:', errorText)
      return NextResponse.json({ 
        error: 'Failed to send email via Brevo',
        details: errorText 
      }, { status: 500 })
    }

    return NextResponse.json({ message: 'Test email sent successfully' })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}