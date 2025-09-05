import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT id, template_key, template_name, subject, html_content, text_content, available_variables, is_active FROM email_templates ORDER BY template_name'
    ) as any

    const templates = rows.map((row: any) => ({
      ...row,
      available_variables: JSON.parse(row.available_variables || '[]'),
      is_active: Boolean(row.is_active)
    }))

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      id, 
      template_key, 
      template_name, 
      subject, 
      html_content, 
      text_content, 
      available_variables, 
      is_active 
    } = body

    if (!template_key || !template_name || !subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const variablesJson = JSON.stringify(available_variables || [])

    if (id) {
      // Update existing template
      await pool.query(
        'UPDATE email_templates SET template_name = ?, subject = ?, html_content = ?, text_content = ?, available_variables = ?, is_active = ? WHERE id = ?',
        [template_name, subject, html_content, text_content, variablesJson, is_active, id]
      )
    } else {
      // Insert new template
      await pool.query(
        'INSERT INTO email_templates (template_key, template_name, subject, html_content, text_content, available_variables, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [template_key, template_name, subject, html_content, text_content, variablesJson, is_active]
      )
    }

    return NextResponse.json({ message: 'Template updated successfully' })
  } catch (error) {
    console.error('Error updating email template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}