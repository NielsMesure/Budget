import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  
  // Get budgets
  const [budgetRows] = await pool.query('SELECT * FROM budgets WHERE user_id = ?', [userId]) as any
  
  // Calculate spent amount for each budget from transactions
  const budgetsWithSpent = await Promise.all(
    budgetRows.map(async (budget: any) => {
      const [spentRows] = await pool.query(
        'SELECT COALESCE(SUM(amount), 0) as spent FROM transactions WHERE user_id = ? AND category = ?',
        [userId, budget.category]
      ) as any
      
      return {
        ...budget,
        spent: parseFloat(spentRows[0]?.spent || '0')
      }
    })
  )
  
  return NextResponse.json(budgetsWithSpent)
}

export async function POST(req: Request) {
  const { userId, category, allocated, percentage, color, emoji } = await req.json()
  if (!userId || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  let finalAllocated = allocated
  
  // If percentage is provided, calculate allocated amount from user's salary
  if (percentage && !allocated) {
    const [userRows] = await pool.query('SELECT salary FROM users WHERE id = ?', [userId]) as any
    const userSalary = userRows[0]?.salary || 0
    finalAllocated = (userSalary * percentage) / 100
  }
  
  if (!finalAllocated) {
    return NextResponse.json({ error: 'Either allocated amount or percentage must be provided' }, { status: 400 })
  }
  
  const [result] = await pool.query(
    'INSERT INTO budgets (user_id, category, allocated, percentage, spent, color, emoji) VALUES (?, ?, ?, ?, 0, ?, ?)',
    [userId, category, finalAllocated, percentage || null, color, emoji]
  ) as any
  return NextResponse.json({ id: result.insertId, allocated: finalAllocated })
}

export async function PUT(req: Request) {
  const { id, userId, category, allocated, percentage, color, emoji } = await req.json()
  if (!id || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  let finalAllocated = allocated
  
  // If percentage is provided, calculate allocated amount from user's salary
  if (percentage && !allocated) {
    const [userRows] = await pool.query('SELECT salary FROM users WHERE id = ?', [userId]) as any
    const userSalary = userRows[0]?.salary || 0
    finalAllocated = (userSalary * percentage) / 100
  }
  
  await pool.query(
    'UPDATE budgets SET category = ?, allocated = ?, percentage = ?, color = ?, emoji = ? WHERE id = ? AND user_id = ?',
    [category, finalAllocated, percentage || null, color, emoji, id, userId]
  )
  
  return NextResponse.json({ success: true, allocated: finalAllocated })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const userId = searchParams.get('userId')
  
  if (!id || !userId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }
  
  await pool.query('DELETE FROM budgets WHERE id = ? AND user_id = ?', [id, userId])
  return NextResponse.json({ success: true })
}
