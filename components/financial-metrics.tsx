"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"

export function FinancialMetrics() {
  const { data, totalBalance, remainingAfterExpenses } = useFinancialData()

  const metrics = [
    {
      title: "Revenus",
      value: `${data.salary.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
      change: data.salary > 0 ? "+100%" : "0%",
      trend: "up",
      icon: ArrowUpIcon,
      color: "text-green-400",
    },
    {
      title: "Solde Total",
      value: `${totalBalance.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
      change: totalBalance > 0 ? "+15%" : "0%",
      trend: totalBalance > 0 ? "up" : "down",
      icon: TrendingUpIcon,
      color: "text-blue-400",
    },
    {
      title: "Dépenses",
      value: `${data.expenses.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
      change: data.expenses > 0 ? "-3%" : "0%",
      trend: "down",
      icon: ArrowDownIcon,
      color: "text-orange-400",
    },
    {
      title: "Disponible",
      value: `${remainingAfterExpenses.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
      change: remainingAfterExpenses > 0 ? "+8%" : "0%",
      trend: remainingAfterExpenses > 0 ? "up" : "down",
      icon: WalletIcon,
      color: "text-purple-400",
    },
  ]

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
            <Card key={metric.title} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">{metric.title}</CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <p className={`text-xs ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                  {metric.change} par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
        ))}
      </div>
  )
}
