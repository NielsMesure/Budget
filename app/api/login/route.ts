import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const [rows] = await pool.query('SELECT id, name, email, password, is_admin FROM users WHERE email = ?', [email]) as any
  const user = rows[0]
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  return NextResponse.json({ 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    isAdmin: user.is_admin 
  })
}
