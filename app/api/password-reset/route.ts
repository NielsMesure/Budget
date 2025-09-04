import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { EmailService } from '@/lib/services/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    const [userRows] = await pool.query(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email]
    ) as any

    if (userRows.length === 0) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ message: 'If the email exists, a reset code has been sent.' })
    }

    const user = userRows[0]

    // Generate a reset code (6 digits)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    // Store reset code in database (you might want to create a password_resets table)
    await pool.query(
      'INSERT INTO password_resets (user_id, reset_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE reset_code = ?, expires_at = ?',
      [user.id, resetCode, expiresAt, resetCode, expiresAt]
    )

    // Send reset email
    const emailResult = await EmailService.sendPasswordResetEmail(
      user.email,
      user.name || 'Utilisateur',
      resetCode,
      '15 minutes'
    )

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
    }

    return NextResponse.json({ message: 'If the email exists, a reset code has been sent.' })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { email, resetCode, newPassword } = await req.json()

    if (!email || !resetCode || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify reset code
    const [resetRows] = await pool.query(
      `SELECT pr.user_id, u.email 
       FROM password_resets pr 
       JOIN users u ON pr.user_id = u.id 
       WHERE u.email = ? AND pr.reset_code = ? AND pr.expires_at > NOW()`,
      [email, resetCode]
    ) as any

    if (resetRows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 })
    }

    const { user_id } = resetRows[0]

    // Hash new password
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user_id]
    )

    // Delete used reset code
    await pool.query(
      'DELETE FROM password_resets WHERE user_id = ?',
      [user_id]
    )

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Password reset confirmation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}