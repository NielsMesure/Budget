import { DashboardLayout } from "@/components/dashboard-layout"
import { TransactionForm } from "@/components/transaction-form"
import { ExpenseChart } from "@/components/expense-chart"
import { RecentTransactions } from "@/components/recent-transactions"

export default function TransactionsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Transactions</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ExpenseChart />
                    <RecentTransactions />
                </div>

                <TransactionForm />
            </div>
        </DashboardLayout>
    )
}
