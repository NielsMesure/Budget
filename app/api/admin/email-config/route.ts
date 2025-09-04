import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT config_key, config_value FROM email_config WHERE config_key IN (?, ?, ?, ?)',
      ['brevo_api_key', 'brevo_sender_name', 'brevo_sender_email', 'smtp_enabled']
    ) as any

    const config: Record<string, string> = {}
    rows.forEach((row: any) => {
      config[row.config_key] = row.config_value || ''
    })

    // Ensure all required keys exist
    const requiredKeys = ['brevo_api_key', 'brevo_sender_name', 'brevo_sender_email', 'smtp_enabled']
    requiredKeys.forEach(key => {
      if (!(key in config)) {
        config[key] = key === 'smtp_enabled' ? 'true' : ''
      }
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching email config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { brevo_api_key, brevo_sender_name, brevo_sender_email, smtp_enabled } = body

    if (!brevo_api_key || !brevo_sender_name || !brevo_sender_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update or insert configuration values
    const configUpdates = [
      ['brevo_api_key', brevo_api_key],
      ['brevo_sender_name', brevo_sender_name],
      ['brevo_sender_email', brevo_sender_email],
      ['smtp_enabled', smtp_enabled || 'true']
    ]

    for (const [key, value] of configUpdates) {
      await pool.query(
        'INSERT INTO email_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
        [key, value, value]
      )
    }

    return NextResponse.json({ message: 'Configuration updated successfully' })
  } catch (error) {
    console.error('Error updating email config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}