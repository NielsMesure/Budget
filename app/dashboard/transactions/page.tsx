import { DashboardLayout } from "@/components/dashboard-layout"
import { TransactionForm } from "@/components/transaction-form"

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <TransactionForm />
    </DashboardLayout>
  )
}
