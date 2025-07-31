import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  const [rows] = await pool.query('SELECT salary FROM users WHERE id = ?', [userId]) as any
  const salary = rows[0]?.salary ?? 0
  return NextResponse.json({ salary })
}

export async function POST(req: Request) {
  const { userId, salary } = await req.json()
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  await pool.query('UPDATE users SET salary = ? WHERE id = ?', [salary ?? 0, userId])
  return NextResponse.json({ ok: true })
}
