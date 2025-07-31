import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]) as any
  if (rows.length > 0) {
    return NextResponse.json({ error: 'User exists' }, { status: 400 })
  }
  const hashed = await bcrypt.hash(password, 10)
  const [result] = await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]) as any
  return NextResponse.json({ id: result.insertId })
}
