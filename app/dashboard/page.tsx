import { DashboardLayout } from "@/components/dashboard-layout"
import { FinancialMetrics } from "@/components/financial-metrics"
import { ExpenseChart } from "@/components/expense-chart"
import { CalendarView } from "@/components/calendar-view"
import { RecurringTransactions } from "@/components/recurring-transactions"
import { MonthlySalaryEntry } from "@/components/monthly-salary-entry"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <FinancialMetrics />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart />
          <MonthlySalaryEntry />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView />
          </div>
          <div>
            <RecurringTransactions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
