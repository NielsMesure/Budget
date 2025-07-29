"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react"

const metrics = [
  {
    title: "Revenus",
    value: "+3 300€",
    change: "+12%",
    trend: "up",
    icon: ArrowUpIcon,
    color: "text-green-400",
  },
  {
    title: "Économies",
    value: "+2 332€",
    change: "+8%",
    trend: "up",
    icon: TrendingUpIcon,
    color: "text-blue-400",
  },
  {
    title: "Dépenses",
    value: "1 968€",
    change: "-3%",
    trend: "down",
    icon: ArrowDownIcon,
    color: "text-orange-400",
  },
  {
    title: "Solde",
    value: "897€",
    change: "+15%",
    trend: "up",
    icon: WalletIcon,
    color: "text-purple-400",
  },
]

export function FinancialMetrics() {
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
