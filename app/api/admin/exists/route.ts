import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as admin_count FROM users WHERE is_admin = TRUE') as any
    const adminExists = rows[0].admin_count > 0
    return NextResponse.json({ adminExists })
  } catch (error) {
    console.error('Error checking admin exists:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}