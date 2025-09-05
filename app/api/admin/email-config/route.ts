import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT config_key, config_value FROM email_config WHERE config_key IN (?, ?, ?, ?, ?, ?, ?)',
      ['brevo_smtp_server', 'brevo_smtp_port', 'brevo_smtp_username', 'brevo_smtp_password', 'brevo_sender_name', 'brevo_sender_email', 'smtp_enabled']
    ) as any

    const config: Record<string, string> = {}
    rows.forEach((row: any) => {
      config[row.config_key] = row.config_value || ''
    })

    // Ensure all required keys exist with defaults
    const defaultConfig = {
      brevo_smtp_server: 'smtp-relay.brevo.com',
      brevo_smtp_port: '587',
      brevo_smtp_username: '',
      brevo_smtp_password: '',
      brevo_sender_name: 'Budget App',
      brevo_sender_email: '',
      smtp_enabled: 'true'
    }

    Object.keys(defaultConfig).forEach(key => {
      if (!(key in config)) {
        config[key] = (defaultConfig as any)[key]
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
    const { 
      brevo_smtp_server, 
      brevo_smtp_port, 
      brevo_smtp_username, 
      brevo_smtp_password, 
      brevo_sender_name, 
      brevo_sender_email, 
      smtp_enabled 
    } = body

    if (!brevo_smtp_username || !brevo_smtp_password || !brevo_sender_name || !brevo_sender_email) {
      return NextResponse.json({ error: 'Champs requis manquants (nom d\'utilisateur SMTP, mot de passe SMTP, nom expéditeur, email expéditeur)' }, { status: 400 })
    }

    // Update or insert configuration values
    const configUpdates = [
      ['brevo_smtp_server', brevo_smtp_server || 'smtp-relay.brevo.com'],
      ['brevo_smtp_port', brevo_smtp_port || '587'],
      ['brevo_smtp_username', brevo_smtp_username],
      ['brevo_smtp_password', brevo_smtp_password],
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