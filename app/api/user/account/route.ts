import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db'

export async function DELETE(req: Request) {
  try {
    const { userId, password, confirmText } = await req.json()
    
    if (!userId || !password || !confirmText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (confirmText !== 'DELETE') {
      return NextResponse.json({ error: 'Confirmation text must be "DELETE"' }, { status: 400 })
    }

    // Get user data and verify password
    const [userRows] = await pool.query(
      'SELECT password FROM users WHERE id = ?', 
      [userId]
    ) as any
    
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userRows[0].password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Password is incorrect' }, { status: 400 })
    }

    // Start transaction to delete all user data
    const connection = await pool.getConnection()
    
    try {
      await connection.beginTransaction()

      // Delete user's budgets
      await connection.query('DELETE FROM budgets WHERE user_id = ?', [userId])
      
      // Delete user's transactions
      await connection.query('DELETE FROM transactions WHERE user_id = ?', [userId])
      
      // Delete user's salary data
      await connection.query('DELETE FROM salary WHERE user_id = ?', [userId])
      
      // Finally delete the user account
      await connection.query('DELETE FROM users WHERE id = ?', [userId])

      await connection.commit()
      
      return NextResponse.json({ message: 'Account deleted successfully' })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}