import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // First check if an admin already exists
    const [adminRows] = await pool.query('SELECT COUNT(*) as admin_count FROM users WHERE is_admin = TRUE') as any
    if (adminRows[0].admin_count > 0) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 403 })
    }

    // Check if email is already taken
    const [existingRows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]) as any
    if (existingRows.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Create the admin user
    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, TRUE)', 
      [name, email, hashedPassword]
    ) as any

    return NextResponse.json({ 
      success: true, 
      adminId: result.insertId,
      message: 'Administrator created successfully' 
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}