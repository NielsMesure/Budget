import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db'
import { EmailService } from '@/lib/services/email'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Check if any admin exists before allowing regular registration
  const [adminRows] = await pool.query('SELECT COUNT(*) as admin_count FROM users WHERE is_admin = TRUE') as any
  if (adminRows[0].admin_count === 0) {
    return NextResponse.json({ error: 'Setup required' }, { status: 403 })
  }

  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]) as any
  if (rows.length > 0) {
    return NextResponse.json({ error: 'User exists' }, { status: 400 })
  }
  const hashed = await bcrypt.hash(password, 10)
  const [result] = await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]) as any
  
  // Send welcome email
  try {
    await EmailService.sendAccountCreationEmail(email, name || 'Utilisateur')
  } catch (error) {
    console.log('Failed to send welcome email:', error)
    // Don't fail registration if email fails
  }
  
  // Return the created user data
  return NextResponse.json({ 
    id: result.insertId, 
    name, 
    email, 
    isAdmin: false 
  })
}
