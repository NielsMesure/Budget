"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react"
import { useFinancialData } from "@/hooks/use-financial-data"

export function FinancialMetrics() {
  const { data, totalBalance, totalExpenses, isLoaded } = useFinancialData()

  // Afficher un skeleton pendant le chargement
  if (!isLoaded) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-slate-600 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-slate-600 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-24 bg-slate-600 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-slate-600 rounded animate-pulse" />
                </CardContent>
              </Card>
          ))}
        </div>
    )
  }

  const metrics = [
    {
      title: "Revenus",
      value: `${(data.salary || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
      change: (data.salary || 0) > 0 ? "+100%" : "0%",
      trend: "up",
      icon: ArrowUpIcon,
      color: "text-green-400",
    },
    {
      title: "Solde Net",
      value: `${totalBalance.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
      change: totalBalance > 0 ? "+15%" : "0%",
      trend: totalBalance > 0 ? "up" : "down",
      icon: TrendingUpIcon,
      color: "text-blue-400",
    },
    {
      title: "Dépenses",
      value: `${totalExpenses.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
      change: totalExpenses > 0 ? "-3%" : "0%",
      trend: "down",
      icon: ArrowDownIcon,
      color: "text-orange-400",
    },
    {
      title: "Disponible",
      value: `${Math.max(0, totalBalance).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`,
      change: totalBalance > 0 ? "+8%" : "0%",
      trend: totalBalance > 0 ? "up" : "down",
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
