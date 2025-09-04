import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    // Get total user count
    const [userCountRows] = await pool.query('SELECT COUNT(*) as total_users FROM users') as any
    const totalUsers = userCountRows[0].total_users

    // Get admin count
    const [adminCountRows] = await pool.query('SELECT COUNT(*) as total_admins FROM users WHERE is_admin = TRUE') as any
    const totalAdmins = adminCountRows[0].total_admins

    // Get total transactions count
    const [transactionCountRows] = await pool.query('SELECT COUNT(*) as total_transactions FROM transactions') as any
    const totalTransactions = transactionCountRows[0].total_transactions

    // Get total budgets count
    const [budgetCountRows] = await pool.query('SELECT COUNT(*) as total_budgets FROM budgets') as any
    const totalBudgets = budgetCountRows[0].total_budgets

    // Get recent registrations (last 30 days)
    const [recentUsersRows] = await pool.query(
      'SELECT COUNT(*) as recent_users FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    ) as any
    const recentUsers = recentUsersRows[0].recent_users

    // Get users registered this month
    const [monthlyUsersRows] = await pool.query(
      'SELECT COUNT(*) as monthly_users FROM users WHERE YEAR(created_at) = YEAR(NOW()) AND MONTH(created_at) = MONTH(NOW())'
    ) as any
    const monthlyUsers = monthlyUsersRows[0].monthly_users

    return NextResponse.json({
      totalUsers,
      totalAdmins,
      totalTransactions,
      totalBudgets,
      recentUsers,
      monthlyUsers
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}