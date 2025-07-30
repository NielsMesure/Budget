import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  const [rows] = await pool.query('SELECT * FROM budgets WHERE user_id = ?', [userId]) as any
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const { userId, category, allocated, color, emoji } = await req.json()
  if (!userId || !category || !allocated) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const [result] = await pool.query(
    'INSERT INTO budgets (user_id, category, allocated, spent, color, emoji) VALUES (?, ?, ?, 0, ?, ?)',
    [userId, category, allocated, color, emoji]
  ) as any
  return NextResponse.json({ id: result.insertId })
}
