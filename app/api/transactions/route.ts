import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  const [rows] = await pool.query('SELECT * FROM transactions WHERE user_id = ?', [userId]) as any
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const { userId, amount, description, category, date, notes, isRecurring } = await req.json()
  if (!userId || amount == null || !date) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const [result] = await pool.query(
    'INSERT INTO transactions (user_id, amount, description, category, date, notes, is_recurring) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, amount, description, category, date, notes, isRecurring ? 1 : 0]
  ) as any
  return NextResponse.json({ id: result.insertId })
}
