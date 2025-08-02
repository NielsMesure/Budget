import { DashboardLayout } from "@/components/dashboard-layout"
import { TransactionForm } from "@/components/transaction-form"
import { ExpenseChart } from "@/components/expense-chart"
import { NonRecurringTransactions } from "@/components/non-recurring-transactions"
import { RecurringTransactions } from "@/components/recurring-transactions"

export default function TransactionsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">



                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Transactions</h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ExpenseChart />
                    <TransactionForm />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NonRecurringTransactions />
                    <RecurringTransactions />
                </div>


            </div>
        </DashboardLayout>
    )
}
