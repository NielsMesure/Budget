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
  const { userId, amount, description, category, date, notes, isRecurring, frequency, logo } = await req.json()
  if (!userId || amount == null || !date) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const [result] = await pool.query(
    'INSERT INTO transactions (user_id, amount, description, category, date, notes, is_recurring, frequency, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, amount, description, category, date, notes, isRecurring ? 1 : 0, frequency || null, logo || null]
  ) as any
  return NextResponse.json({ id: result.insertId })
}

export async function PATCH(req: Request) {
  const { id, userId, amount, description, category, date, notes, frequency, logo } =
    await req.json()
  if (!id || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  await pool.query(
    'UPDATE transactions SET amount = ?, description = ?, category = ?, date = ?, notes = ?, frequency = ?, logo = ? WHERE id = ? AND user_id = ?',
    [amount, description, category, date, notes, frequency || null, logo || null, id, userId],
  )
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const userId = searchParams.get('userId')
  if (!id || !userId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }
  await pool.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [
    id,
    userId,
  ])
  return NextResponse.json({ ok: true })
}
