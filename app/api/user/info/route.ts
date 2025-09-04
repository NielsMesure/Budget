import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const [userRows] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?', 
      [userId]
    ) as any
    
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userRows[0])
  } catch (error) {
    console.error('Error fetching user info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}