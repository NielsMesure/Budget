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
  const { userId, category, allocated, percentage, color, emoji } = await req.json()
  if (!userId || !category) {
    return NextResponse.json({ error: 'Missing required fields: userId and category' }, { status: 400 })
  }
  
  // Validate that either allocated or percentage is provided, but not both
  if ((!allocated && !percentage) || (allocated && percentage)) {
    return NextResponse.json({ error: 'Either allocated amount or percentage must be provided, but not both' }, { status: 400 })
  }
  
  const [result] = await pool.query(
    'INSERT INTO budgets (user_id, category, allocated, percentage, spent, color, emoji) VALUES (?, ?, ?, ?, 0, ?, ?)',
    [userId, category, allocated || null, percentage || null, color, emoji]
  ) as any
  return NextResponse.json({ id: result.insertId })
}

export async function PUT(req: Request) {
  const { id, userId, category, allocated, percentage, color, emoji } = await req.json()
  if (!id || !userId) {
    return NextResponse.json({ error: 'Missing required fields: id and userId' }, { status: 400 })
  }
  
  await pool.query(
    'UPDATE budgets SET category = ?, allocated = ?, percentage = ?, color = ?, emoji = ? WHERE id = ? AND user_id = ?',
    [category, allocated || null, percentage || null, color, emoji, id, userId]
  ) as any
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const userId = searchParams.get('userId')
  
  if (!id || !userId) {
    return NextResponse.json({ error: 'Missing required parameters: id and userId' }, { status: 400 })
  }
  
  await pool.query('DELETE FROM budgets WHERE id = ? AND user_id = ?', [id, userId]) as any
  return NextResponse.json({ success: true })
}
