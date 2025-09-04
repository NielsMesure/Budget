import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function PUT(req: Request) {
  try {
    const { userId, currentEmail, newEmail } = await req.json()
    
    if (!userId || !currentEmail || !newEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify current email matches
    const [userRows] = await pool.query(
      'SELECT email FROM users WHERE id = ?', 
      [userId]
    ) as any
    
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userRows[0].email !== currentEmail) {
      return NextResponse.json({ error: 'Current email does not match' }, { status: 400 })
    }

    // Check if new email already exists
    const [existingRows] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND id != ?', 
      [newEmail, userId]
    ) as any
    
    if (existingRows.length > 0) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    // Update email
    await pool.query(
      'UPDATE users SET email = ? WHERE id = ?', 
      [newEmail, userId]
    )

    return NextResponse.json({ message: 'Email updated successfully' })
  } catch (error) {
    console.error('Error updating email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}